export type Position = number[];
export type BoundaryGeometry = { type: 'Polygon'; coordinates: Position[][] } | { type: 'MultiPolygon'; coordinates: Position[][][] };
export interface BoundaryFeature { type: 'Feature'; properties: Record<string, unknown>; geometry: BoundaryGeometry; }
export interface BoundaryZoneArea { featureIds: string[]; geometry: BoundaryGeometry; opacity?: number; }
export interface BoundaryCollection { type: 'FeatureCollection'; features: BoundaryFeature[]; }
/** A local buffer around real boundary segments, clipped to one feature by the renderer. */
export interface BoundaryBand { featureId: string; lines: Position[][]; widthKm: number; referenceLatitude: number; opacity?: number; }
const mercator = ([longitude, latitude]: Position): [number, number] => {
  const radians = Math.PI / 180;
  return [longitude * radians, -Math.log(Math.tan(Math.PI / 4 + Math.max(-85, Math.min(85, latitude)) * radians / 2))];
};
const rings = (feature: BoundaryFeature) => feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;

export function createBoundaryProjection(data: BoundaryCollection, width = 1000, height = 460, padding = 28) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  data.features.forEach(feature => rings(feature).forEach(polygon => polygon.forEach(ring => ring.forEach(position => {
    const [x, y] = mercator(position);
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }))));
  const valid = Number.isFinite(minX);
  const scale = valid ? Math.min((width - padding * 2) / (maxX - minX || 1), (height - padding * 2) / (maxY - minY || 1)) : 1;
  const offsetX = valid ? (width - (maxX - minX) * scale) / 2 : 0;
  const offsetY = valid ? (height - (maxY - minY) * scale) / 2 : 0;
  const project = (position: Position) => {
    const [x, y] = mercator(position);
    return [(x - minX) * scale + offsetX, (y - minY) * scale + offsetY];
  };
  const linePath = (line: Position[]) => line.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  const geometryPath = (geometry: BoundaryGeometry) => (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates).map(polygon => polygon.map(ring => linePath(ring) + 'Z').join(' ')).join(' ');
  return { project, linePath, geometryPath, valid,
    kilometersToPixels: (km: number, latitude: number) => km * scale / (6371 * Math.cos(latitude * Math.PI / 180)),
  };
}

export function projectBoundaries(data: BoundaryCollection, width = 1000, height = 460, padding = 28) {
  const projection = createBoundaryProjection(data, width, height, padding);
  if (!projection.valid) return [];
  return data.features.map(feature => rings(feature).map(polygon => polygon.map(ring => projection.linePath(ring) + 'Z').join(' ')).join(' '));
}

/** Uses the same local Mercator buffer as the SVG stroke. Caller verifies the containing parish. */
export function isWithinBoundaryBand(position: Position, band: BoundaryBand): boolean {
  const point = mercator(position);
  const radius = band.widthKm / (6371 * Math.cos(band.referenceLatitude * Math.PI / 180));
  return band.lines.some(line => line.some((value, index) => {
    if (index === 0) return false;
    const a = mercator(line[index - 1]), b = mercator(value);
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(point[0] - a[0] - t * dx, point[1] - a[1] - t * dy) <= radius;
  }));
}


export function isPointInBoundaryGeometry(point: Position, geometry: BoundaryGeometry): boolean {
  const inRing = (ring: Position[]) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i], b = ring[j];
      if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  };
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some(rings => rings.length > 0 && inRing(rings[0]) && !rings.slice(1).some(inRing));
}
