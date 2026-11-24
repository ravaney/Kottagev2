# BoundaryMap

Portable React/TypeScript SVG boundary map. Copy this directory into another React project. Runtime dependencies: React and the included CSS. No map server, API key, Firebase, MUI, or map library is required by the generic component.

```tsx
import BoundaryMap, { BoundaryCollection, MapZone } from './BoundaryMap';
import jamaica from './BoundaryMap/jamaicaParishes.json';

const zones: MapZone[] = [{
  id: 'west', label: 'Western operations', color: '#c4a6e8',
  members: ['JM02', 'JM10', 'JM14'],
}];

<div style={{ height: 450 }}>
  <BoundaryMap data={jamaica as BoundaryCollection}
    getFeatureId={feature => String(feature.properties.adm1_pcode)}
    getFeatureLabel={feature => String(feature.properties.adm1_name)}
    zones={zones} showZoneLabels zoneControlsPlacement="outside"
    onSelect={feature => console.log(feature?.properties)} />
</div>
```

## Configuration

- `data`: WGS84 Polygon/MultiPolygon GeoJSON FeatureCollection. Holes and islands are preserved. Give the parent an explicit height. The local Mercator renderer targets regional maps, not antimeridian-crossing world geometry.
- `getFeatureId` / `getFeatureLabel`: dataset adapters; IDs must be unique and stable. `getFeatureColor` supplies per-feature colors when no zone applies.
- `zones`: zone ID, label, color, and full-feature `members`. First full-member zone wins. Optional `overlapStyle="striped"` displays shared full-parish memberships in stripes; the application uses solid colors.
- `areas` / `excludedAreas`: exact polygon portions (`BoundaryZoneArea`) with `featureIds`, `geometry`, and optional `opacity`. Included areas are clipped to parish polygons. Excluded opaque areas mask the primary zone; transparent areas retain the primary color underneath, while spatial exclusions still apply to counts.
- `partialMembers` / `excludedParts`: optional approximate boundary-buffer bands, for custom operational zones. The Jamaica application no longer uses them now that published national park and UNESCO polygons are available.
- `showZoneLabels` and `zoneControlsPlacement="outside"`: region buttons outside the SVG, first half top right and remainder bottom center. The default `map` placement uses SVG labels with optional `labelPosition` overrides.
- `selectedId` / `onSelect`: controlled parish selection; omit `selectedId` for internal selection. `selectedZoneId` / `onZoneSelect` controls region selection. Pass null to clear. `onHover` receives a parish feature or null.
- `title` / `className`: heading and additional container class.

Hover/focus highlights; clicking or Enter/Space selects. Other areas dim while remaining clickable. Transparent partial areas become opaque on hover and return to transparency afterward. Clear selection restores all colors. Geometry projection and hit-testing helpers are independent of application services.

## Jamaica data and active boundary

`jamaicaParishes.json` is the unmodified admin-level-1 GeoJSON from the user's administrative boundary archive. It contains all 14 parishes. The archive also includes smaller administrative areas but no mountain-range layer.

The mountain zone uses the published Blue and John Crow Mountains National Park polygon in `../Admin/blueMountainsNationalPark.json`. Its companion source JSON records provenance and attribution to JCDT, NEPA, Forestry Department and JNHT. Its source area attribute is 412.950176309 km?, crossing portions of Portland, St. Andrew, St. Mary and St. Thomas. This is a park boundary, not the complete physical mountain range.

The user chose the national park after comparing it with UNESCO's smaller inscribed property. The UNESCO dataset and comparison switch have been removed. `createCoverageZones()` provides the single active configuration. Mountain areas are green (#a9cf9b), with 50% transparency and opaque hover; Capital uses blue (#9cbded). The details sidebar is shown only when a parish or region is selected, leaving the full workspace for the map otherwise.

Sources:
- [National park GIS layer](https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Jamaica_Protected_Areas/FeatureServer/7)
- [JCDT park overview](https://jcdt.org.jm/blue-john-crow-mountains/bjcmnp-overview)

## Property counts

The application adapter uses all Firebase /properties records, including pending and unlisted records, without seeded demo data. Parish names normalize Saint/St. and Parish suffixes, falling back to exact-coordinate geometry tests. Counts inside split parishes require coordinates and use the same national park polygon as the map. Capital, North Coast and Eastern exclude the mountain footprint. Missing coordinates are disclosed and excluded from regional counts while retained in full-parish totals. No approximate mountain bands are used by the active configuration.

With `zoneFirstSelection`, the first geometry click enters its region without selecting a parish. Subsequent clicks in that region select a parish, and pointer movement highlights individual parishes while leaving region peers visible. Region context persists during parish inspection. Zones with a single parish, or `parishSelection: false` (used by Blue Mountains), are selected directly without a second parish level.
