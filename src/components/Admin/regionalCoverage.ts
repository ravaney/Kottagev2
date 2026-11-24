import { isWithinBoundaryBand, isPointInBoundaryGeometry } from '../BoundaryMap';
import type { MapZone, BoundaryFeature, BoundaryZoneArea, BoundaryCollection } from '../BoundaryMap';
import type { Kottage } from '../../hooks/propertyHooks';
import nationalPark from './blueMountainsNationalPark.json';

export const zoneParishIds = (zone: MapZone) => Array.from(new Set([
  ...zone.members, ...(zone.partialMembers ?? []).map(part => part.featureId),
  ...(zone.areas ?? []).flatMap(area => area.featureIds),
]));

export const blueMountainsNationalParkArea: BoundaryZoneArea = {
  featureIds: ['JM05', 'JM06', 'JM11', 'JM12'],
  geometry: (nationalPark as BoundaryCollection).features[0].geometry,
  opacity: 0.5,
};
export const mountainBoundary = {
  description: 'Mountain portions follow the Blue and John Crow Mountains National Park boundary.',
  sourceLabel: 'JCDT, NEPA, Forestry Department and JNHT',
  sourceUrl: 'https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Jamaica_Protected_Areas/FeatureServer/7',
};

export function createCoverageZones(): MapZone[] {
  const area = blueMountainsNationalParkArea;
  return [
    { id: 'western', label: 'Western Jamaica', color: '#c4a6e8', members: ['JM02', 'JM10', 'JM14'] },
    { id: 'north', label: 'Jamaica North Coast', color: '#80c8e4', members: ['JM13', 'JM07', 'JM11'], excludedAreas: [area] },
    { id: 'south', label: 'South Coast', color: '#ecc18b', members: ['JM09', 'JM04', 'JM01', 'JM08'] },
    { id: 'capital', label: 'Capital', color: '#9cbded', members: ['JM03', 'JM06'], excludedAreas: [area] },
    { id: 'mountains', label: 'Blue Mountains Region', parishSelection: false, color: '#a9cf9b', members: [], areas: [area] },
    { id: 'eastern', label: 'Eastern Jamaica', color: '#e8a9b7', members: ['JM05', 'JM12'], excludedAreas: [area] },
  ];
}
export const jamaicaCoverageZones = createCoverageZones();
export const normalizeParish = (name: string) => name.toLowerCase().trim().replace(/^saint\s+/, 'st ').replace(/\./g, '').replace(/\s+parish$/, '').replace(/\s+/g, ' ');
export const getParishId = (feature: BoundaryFeature) => String(feature.properties.adm1_pcode);
export const getParishLabel = (feature: BoundaryFeature) => String(feature.properties.adm1_name).replace(/^Saint /, 'St. ');

const inRing = (x: number, y: number, ring: number[][]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

export function propertyParishId(property: Pick<Kottage, 'address' | 'coordinates'>, features: BoundaryFeature[]): string | null {
  const country = property.address?.country?.trim().toLowerCase();
  if (country && !['jamaica', 'jm', 'jam'].includes(country)) return null;
  const byAddress = features.find(feature => normalizeParish(getParishLabel(feature)) === normalizeParish(property.address?.state ?? ''));
  if (byAddress) return getParishId(byAddress);
  const latitude = property.coordinates?.latitude, longitude = property.coordinates?.longitude;
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const byCoordinates = features.find(feature => {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    return polygons.some(rings => rings.length > 0 && inRing(longitude, latitude, rings[0]) && !rings.slice(1).some(ring => inRing(longitude, latitude, ring)));
  });
  return byCoordinates ? getParishId(byCoordinates) : null;
}


/** Null means a property in a split parish needs exact coordinates. */
export function propertyInCoverageZone(property: Pick<Kottage, 'coordinates'>, parishId: string | null, zone: MapZone): boolean | null {
  if (!parishId) return false;
  const partials = (zone.partialMembers ?? []).filter(part => part.featureId === parishId);
  const exclusions = (zone.excludedParts ?? []).filter(part => part.featureId === parishId);
  const areas = (zone.areas ?? []).filter(area => area.featureIds.includes(parishId));
  const excludedAreas = (zone.excludedAreas ?? []).filter(area => area.featureIds.includes(parishId));
  const fullMember = zone.members.includes(parishId);
  if (!fullMember && !partials.length && !areas.length) return false;
  if (!partials.length && !exclusions.length && !areas.length && !excludedAreas.length) return fullMember;
  const coords = property.coordinates;
  if (!coords || !Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) return null;
  const point = [coords.longitude, coords.latitude];
  const included = fullMember || partials.some(part => isWithinBoundaryBand(point, part)) || areas.some(area => isPointInBoundaryGeometry(point, area.geometry));
  return included && !exclusions.some(part => isWithinBoundaryBand(point, part)) && !excludedAreas.some(area => isPointInBoundaryGeometry(point, area.geometry));
}
