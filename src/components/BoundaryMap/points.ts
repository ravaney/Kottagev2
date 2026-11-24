import { BoundaryZoneArea, Position, isPointInBoundaryGeometry, isWithinBoundaryBand } from './geometry';
import type { MapZone } from './BoundaryMap';

export interface BoundaryMapPoint {
  id: string;
  label: string;
  featureId: string;
  coordinates: Position;
  category: 'capital' | 'town';
}
export function pointInZone(point: BoundaryMapPoint, zone: MapZone): boolean {
  const containsArea = (area: BoundaryZoneArea) => area.featureIds.includes(point.featureId) && isPointInBoundaryGeometry(point.coordinates, area.geometry);
  const included = zone.members.includes(point.featureId)
    || (zone.areas ?? []).some(containsArea)
    || (zone.partialMembers ?? []).some(part => part.featureId === point.featureId && isWithinBoundaryBand(point.coordinates, part));
  return included && !(zone.excludedAreas ?? []).some(containsArea)
    && !(zone.excludedParts ?? []).some(part => part.featureId === point.featureId && isWithinBoundaryBand(point.coordinates, part));
}

/** Place labels without collisions; keep every eligible point even when its label will not fit. */
export function layoutMapPoints(points: BoundaryMapPoint[], project: (position: Position) => number[], selectedZone?: MapZone, focusZone?: MapZone) {
  const visible = points.filter(point => point.category === 'capital' || Boolean(selectedZone && pointInZone(point, selectedZone)))
    .map(point => ({ point, x: project(point.coordinates)[0], y: project(point.coordinates)[1] }))
    .sort((a, b) => Number(Boolean(selectedZone && pointInZone(b.point, selectedZone))) - Number(Boolean(selectedZone && pointInZone(a.point, selectedZone))) || Number(a.point.category === 'town') - Number(b.point.category === 'town'));
  const occupied = visible.map(({ x, y }) => ({ left: x - 6, top: y - 6, right: x + 6, bottom: y + 6 }));
  return visible.map(({ point, x, y }) => {
    const dimmed = Boolean(focusZone && !pointInZone(point, focusZone));
    const width = point.label.length * 6.3;
    const placements = [[x + 8, y - 8], [x + 8, y + 17], [x - width - 8, y - 8], [x - width - 8, y + 17]];
    const labelPosition = dimmed ? undefined : placements.find(([left, baseline]) => {
      const box = { left: left - 2, top: baseline - 12, right: left + width + 2, bottom: baseline + 3 };
      if (box.left < 6 || box.right > 994 || box.top < 6 || box.bottom > 454) return false;
      if (occupied.some(other => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top)) return false;
      occupied.push(box);
      return true;
    });
    return { point, x, y, dimmed, labelPosition };
  });
}
