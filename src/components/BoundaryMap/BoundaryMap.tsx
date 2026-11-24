import { BoundaryMapPoint, layoutMapPoints } from './points';
import React, { useId, useMemo, useState } from 'react';
import { BoundaryCollection, BoundaryFeature, BoundaryBand, BoundaryZoneArea, createBoundaryProjection, projectBoundaries } from './geometry';
import './BoundaryMap.css';

export interface MapZone {
  id: string;
  label: string;
  color: string;
  /** Feature IDs, not display names. First zone wins for overlapping memberships. */
  members: string[];
  parishSelection?: boolean;
  partialMembers?: BoundaryBand[];
  areas?: BoundaryZoneArea[];
  excludedAreas?: BoundaryZoneArea[];
  excludedParts?: BoundaryBand[];
  /** Optional label location in the 1000 x 460 SVG viewBox. */
  labelPosition?: [number, number];
}
export function canSelectParishInZone(zone: MapZone): boolean {
  const ids = new Set([...zone.members, ...(zone.partialMembers ?? []).map(part => part.featureId), ...(zone.areas ?? []).flatMap(area => area.featureIds)]);
  return zone.parishSelection !== false && ids.size > 1;
}
export interface BoundaryMapProps {
  data: BoundaryCollection;
  getFeatureId: (feature: BoundaryFeature) => string;
  getFeatureLabel: (feature: BoundaryFeature) => string;
  zones?: MapZone[];
  points?: BoundaryMapPoint[];
  zoneFirstSelection?: boolean;
  selectedZoneId?: string | null;
  onZoneSelect?: (zone: MapZone | null) => void;
  showZoneLabels?: boolean;
  zoneControlsPlacement?: 'map' | 'outside';
  overlapStyle?: 'first' | 'striped';
  getFeatureColor?: (feature: BoundaryFeature) => string;
  /** Supply this for controlled selection; null clears selection. */
  selectedId?: string | null;
  onSelect?: (feature: BoundaryFeature | null) => void;
  onHover?: (feature: BoundaryFeature | null) => void;
  title?: string;
  instruction?: string;
  className?: string;
}

/** Portable React/SVG map with no app services, UI framework, tiles or API keys. */
export default function BoundaryMap({ data, getFeatureId, getFeatureLabel, getFeatureColor, zones = [], points = [], selectedId,
  selectedZoneId, onZoneSelect, zoneFirstSelection = false, showZoneLabels = false, zoneControlsPlacement = 'map', overlapStyle = 'first',
  onSelect, onHover, title = 'Administrative boundaries', instruction = 'Hover to explore - select a boundary for details', className = '',
}: BoundaryMapProps) {
  const patternPrefix = useId().replace(/[^a-zA-Z0-9]/g, '');
  const projection = useMemo(() => createBoundaryProjection(data), [data]);
  const paths = useMemo(() => projectBoundaries(data), [data]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [localSelection, setLocalSelection] = useState<string | null>(null);
  const selected = selectedId === undefined ? localSelection : selectedId;
  const selectedZone = zones.find(zone => zone.id === selectedZoneId);
  const hoveredZone = zones.find(zone => zone.id === hoveredZoneId)
    ?? zones.find(zone => hoveredId !== null && zone.members.includes(hoveredId));
  const parishZone = zones.find(zone => selected !== null && zone.members.includes(selected));
  const focusZone = hoveredZone ?? selectedZone ?? parishZone;
  const hasFocus = Boolean(focusZone || selected);
  const activeId = hoveredId ?? selected;
  const activeFeature = data.features.find(feature => getFeatureId(feature) === activeId);
  const activeZone = zones.find(zone => zone.id === hoveredZoneId)
    ?? zones.find(zone => activeId !== null && zone.members.includes(activeId))
    ?? zones.find(zone => zone.id === selectedZoneId);
  const mapPoints = useMemo(() => layoutMapPoints(points, projection.project, selectedZone, focusZone), [points, projection, selectedZone, focusZone]);
  const labelPositions = useMemo(() => zones.map(zone => {
    if (zoneControlsPlacement === 'outside') return null;
    if (zone.labelPosition) return zone.labelPosition;
    const points = data.features.flatMap((feature, index) => zone.members.includes(getFeatureId(feature))
      ? Array.from((paths[index] ?? '').matchAll(/[ML]([\d.]+),([\d.]+)/g), match => [Number(match[1]), Number(match[2])]) : []);
    if (!points.length) return null;
    return [(Math.min(...points.map(point => point[0])) + Math.max(...points.map(point => point[0]))) / 2,
      (Math.min(...points.map(point => point[1])) + Math.max(...points.map(point => point[1]))) / 2];
  }), [data, getFeatureId, paths, zones, zoneControlsPlacement]);
  const hover = (feature: BoundaryFeature | null) => {
    setHoveredId(feature ? getFeatureId(feature) : null);
    onHover?.(feature);
  };
  const select = (feature: BoundaryFeature | null) => {
    setLocalSelection(feature ? getFeatureId(feature) : null);
    onSelect?.(feature);
  };
  const activateFeature = (feature: BoundaryFeature, zone = zones.find(item => item.members.includes(getFeatureId(feature)))) => {
    if (zoneFirstSelection && zone && (selectedZoneId !== zone.id || !canSelectParishInZone(zone))) {
      select(null);
      onZoneSelect?.(zone);
      setHoveredId(null);
      setHoveredZoneId(null);
      return;
    }
    select(feature);
  };
  const hoverArea = (feature: BoundaryFeature | null, zone: MapZone | null) => {
    hover(feature);
    setHoveredZoneId(zone?.id ?? null);
  };
  const outsideControls = showZoneLabels && zoneControlsPlacement === 'outside';
  const controlSplit = Math.ceil(zones.length / 2);
  const renderControls = (items: MapZone[], position: 'top-right' | 'bottom-center') => (
    <div className={`boundary-map__zone-controls boundary-map__zone-controls--${position}`} role="group" aria-label={`Region controls ${position}`}>
      {items.map(zone => <button key={zone.id} type="button" className="boundary-map__zone-button"
        style={{ backgroundColor: zone.color }} aria-label={`Select region ${zone.label}`} aria-pressed={selectedZoneId === zone.id}
        onClick={() => { select(null); onZoneSelect?.(zone); }}
        onMouseEnter={() => setHoveredZoneId(zone.id)} onMouseLeave={() => setHoveredZoneId(null)}
        onFocus={() => setHoveredZoneId(zone.id)} onBlur={() => setHoveredZoneId(null)}
        onKeyDown={event => { if (event.key === 'Escape') { setHoveredZoneId(null); select(null); onZoneSelect?.(null); } }}>
        {zone.label}
      </button>)}
    </div>
  );
  return (
    <div className={`boundary-map ${className}`}>
      <div className="boundary-map__heading">
        <div><strong>{title}</strong><span>{instruction}</span></div>
        {(selected || selectedZoneId) && <button type="button" onClick={() => { select(null); onZoneSelect?.(null); }}>Clear selection</button>}
      </div>
      {outsideControls && renderControls(zones.slice(0, controlSplit), 'top-right')}
      <div className="boundary-map__canvas">
        {paths.length === 0 ? <p>No boundary geometry available.</p> : (
          <svg viewBox="0 0 1000 460" role="group" aria-label={title}>
            <title>{title}</title>
            <defs>{data.features.map((feature, index) => {
              const id = getFeatureId(feature);
              const primary = zones.find(zone => zone.members.includes(id));
              return <React.Fragment key={id}>
                <clipPath id={`${patternPrefix}-clip-${index}`}><path d={paths[index]} fillRule="evenodd" clipRule="evenodd" /></clipPath>
                <mask id={`${patternPrefix}-exclude-${index}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="460" style={{ maskType: 'luminance' }}>
                  <rect width="1000" height="460" fill="white" />
                  {primary?.excludedParts?.filter(part => part.featureId === id && (part.opacity ?? 1) >= 1).flatMap((part, partIndex) => part.lines.map((line, lineIndex) => <path key={`${partIndex}-${lineIndex}`} d={projection.linePath(line)} fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth={projection.kilometersToPixels(part.widthKm * 2, part.referenceLatitude)} />))}
                  {primary?.excludedAreas?.filter(area => area.featureIds.includes(id) && (area.opacity ?? 1) >= 1).map((area, areaIndex) => <path key={areaIndex} d={projection.geometryPath(area.geometry)} fill="black" fillRule="evenodd" />)}
                </mask>
              </React.Fragment>;
            })}</defs>
            {overlapStyle === 'striped' && <defs>{data.features.map((feature, index) => {
              const memberships = zones.filter(zone => zone.members.includes(getFeatureId(feature)));
              if (memberships.length < 2) return null;
              return <pattern key={index} id={`${patternPrefix}-overlap-${index}`} patternUnits="userSpaceOnUse" width={memberships.length * 10} height="10" patternTransform="rotate(35)">
                {memberships.map((zone, stripe) => <rect key={zone.id} x={stripe * 10} y="0" width="10" height="10" fill={zone.color} />)}
              </pattern>;
            })}</defs>}
            {data.features.map((feature, index) => {
              const id = getFeatureId(feature);
              const label = getFeatureLabel(feature);
              const memberships = zones.filter(item => item.members.includes(id));
              const zone = memberships[0];
              const zoneLabel = overlapStyle === 'striped' ? memberships.map(item => item.label).join(', ') : zone?.label;
              const fill = overlapStyle === 'striped' && memberships.length > 1 ? `url(#${patternPrefix}-overlap-${index})` : zone?.color ?? getFeatureColor?.(feature) ?? '#b9d8df';
              const highlighted = activeZone ? activeZone.members.includes(id) : id === activeId;
              return <path key={id} d={paths[index]} mask={`url(#${patternPrefix}-exclude-${index})`} fill={fill} fillRule="evenodd" vectorEffect="non-scaling-stroke"
                className={`boundary-map__region${highlighted ? ' is-active' : ''}${selected === id ? ' is-selected' : ''}${selectedZone && canSelectParishInZone(selectedZone) && selectedZone.members.includes(id) && hoveredId === id ? ' is-parish-hovered' : ''}${hasFocus && (focusZone ? !focusZone.members.includes(id) : id !== selected) ? ' is-dimmed' : ''}`}
                role="button" tabIndex={0} aria-label={`${label}${zoneLabel ? `, ${zoneLabel}` : ''}`} aria-pressed={selected === id}
                onMouseEnter={() => hover(feature)} onMouseLeave={() => hover(null)} onFocus={() => hover(feature)} onBlur={() => hover(null)}
                onMouseMove={() => hover(feature)} onClick={() => activateFeature(feature, zone)} onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activateFeature(feature, zone); }
                  if (event.key === 'Escape') { hover(null); select(null); }
                }}><title>{label}{zone ? ` — ${zone.label}` : ''}</title></path>;
            })}
            {zones.flatMap(zone => (zone.partialMembers ?? []).map((part, partIndex) => {
              const featureIndex = data.features.findIndex(feature => getFeatureId(feature) === part.featureId);
              if (featureIndex < 0) return null;
              const feature = data.features[featureIndex];
              const dimmed = hasFocus && (focusZone ? zone.id !== focusZone.id : part.featureId !== selected);
              const activate = () => activateFeature(feature, zone);
              return <g key={`${zone.id}-${partIndex}`} clipPath={`url(#${patternPrefix}-clip-${featureIndex})`}>
                <path d={part.lines.map(line => projection.linePath(line)).join(' ')} fill="none" stroke={zone.color} strokeOpacity={part.opacity ?? 1}
                  strokeWidth={projection.kilometersToPixels(part.widthKm * 2, part.referenceLatitude)} strokeLinecap="round" strokeLinejoin="round"
                  className={`boundary-map__partial${dimmed ? ' is-dimmed' : ''}${activeZone?.id === zone.id ? ' is-active' : ''}${selectedZoneId === zone.id && canSelectParishInZone(zone) && hoveredId === part.featureId ? ' is-parish-hovered' : ''}${hoveredZoneId === zone.id || (hoveredId !== null && zone.members.includes(hoveredId)) ? ' is-hovered' : ''}`}
                  role="button" tabIndex={0} aria-label={`${getFeatureLabel(feature)}: ${zone.label} portion`}
                  aria-pressed={selectedZoneId === zone.id} onClick={activate}
                  onMouseEnter={() => hoverArea(feature, zone)} onMouseMove={() => hoverArea(feature, zone)} onMouseLeave={() => hoverArea(null, null)}
                  onFocus={() => hoverArea(feature, zone)} onBlur={() => hoverArea(null, null)}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } }} />
              </g>;
            }))}
            {zones.flatMap(zone => (zone.areas ?? []).flatMap((area, areaIndex) => area.featureIds.map(id => {
              const featureIndex = data.features.findIndex(feature => getFeatureId(feature) === id);
              if (featureIndex < 0) return null;
              const dimmed = hasFocus && (focusZone ? zone.id !== focusZone.id : id !== selected);
              const activate = () => activateFeature(data.features[featureIndex], zone);
              return <g key={`${zone.id}-area-${areaIndex}-${id}`} clipPath={`url(#${patternPrefix}-clip-${featureIndex})`}>
                <path d={projection.geometryPath(area.geometry)} fill={zone.color} fillOpacity={area.opacity ?? 1} fillRule="evenodd"
                  className={`boundary-map__area${dimmed ? ' is-dimmed' : ''}${selectedZoneId === zone.id && canSelectParishInZone(zone) && hoveredId === id ? ' is-parish-hovered' : ''}${hoveredZoneId === zone.id || (hoveredId !== null && zone.members.includes(hoveredId)) ? ' is-hovered' : ''}`}
                  role="button" tabIndex={0} aria-label={`${getFeatureLabel(data.features[featureIndex])}: ${zone.label} portion`}
                  aria-pressed={selectedZoneId === zone.id} onClick={activate}
                  onMouseEnter={() => hoverArea(data.features[featureIndex], zone)} onMouseMove={() => hoverArea(data.features[featureIndex], zone)} onMouseLeave={() => hoverArea(null, null)} onFocus={() => hoverArea(data.features[featureIndex], zone)} onBlur={() => hoverArea(null, null)}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } }} />
              </g>;
            }))) }
            {selected && <g aria-hidden="true" pointerEvents="none">
              <path d={paths[data.features.findIndex(feature => getFeatureId(feature) === selected)]} className="boundary-map__selection-halo" fill="none" vectorEffect="non-scaling-stroke" />
              <path d={paths[data.features.findIndex(feature => getFeatureId(feature) === selected)]} className="boundary-map__selection-outline" fill="none" vectorEffect="non-scaling-stroke" />
            </g>}
            {showZoneLabels && zoneControlsPlacement === 'map' && zones.map((zone, index) => {
              const position = labelPositions[index];
              if (!position) return null;
              const activate = () => { select(null); onZoneSelect?.(zone); };
              return <g key={zone.id} transform={`translate(${position[0]}, ${position[1]})`}
                className={`boundary-map__zone-label${hasFocus && (focusZone ? zone.id !== focusZone.id : !zone.members.includes(selected!) && !zone.partialMembers?.some(part => part.featureId === selected) && !zone.areas?.some(area => area.featureIds.includes(selected!))) ? ' is-dimmed' : ''}`} role="button" tabIndex={0}
                aria-label={`Select region ${zone.label}`} aria-pressed={selectedZoneId === zone.id}
                onClick={activate} onMouseEnter={() => setHoveredZoneId(zone.id)} onMouseLeave={() => setHoveredZoneId(null)}
                onFocus={() => setHoveredZoneId(zone.id)} onBlur={() => setHoveredZoneId(null)}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } if (event.key === 'Escape') { setHoveredZoneId(null); onZoneSelect?.(null); } }}>
                <rect x={-Math.max(50, zone.label.length * 3.7)} y="-15" width={Math.max(100, zone.label.length * 7.4)} height="30" rx="8" />
                <text textAnchor="middle" dominantBaseline="central">{zone.label}</text>
              </g>;
            })}
            <g className="boundary-map__places" pointerEvents="none">
              {mapPoints.map(({ point, x, y, dimmed, labelPosition }) => <g key={point.id} role="img" aria-label={`${point.label}, ${point.category === 'capital' ? 'parish capital' : 'major town'}`} className={dimmed ? 'is-dimmed' : ''}>
                <title>{point.label}{point.category === 'capital' ? ' - parish capital' : ' - major town'}</title>
                <circle cx={x} cy={y} r={point.category === 'capital' ? 4.5 : 3} className={`boundary-map__place-dot boundary-map__place-dot--${point.category}`} />
                {point.category === 'capital' && <circle cx={x} cy={y} r="1.8" fill="#173746" />}
                {labelPosition && <text x={labelPosition[0]} y={labelPosition[1]} className="boundary-map__place-label">{point.label}</text>}
              </g>)}
            </g>
          </svg>
        )}
        <div className="boundary-map__readout" aria-live="polite" aria-atomic="true">
          <strong>{activeFeature ? getFeatureLabel(activeFeature) : activeZone?.label ?? 'Explore the map'}</strong>
          <span>{activeZone?.label ?? (activeFeature ? 'No custom zone' : `${data.features.length} boundaries`)}</span>
        </div>
      </div>
      {outsideControls && renderControls(zones.slice(controlSplit), 'bottom-center')}
      {!outsideControls && zones.length > 0 && <ul className="boundary-map__legend" aria-label="Map zones">
        {zones.map(zone => <li key={zone.id}><span style={{ backgroundColor: zone.color }} />{zone.label}</li>)}
        {data.features.some(feature => !zones.some(zone => zone.members.includes(getFeatureId(feature)))) && <li><span style={{ backgroundColor: '#b9d8df' }} />Unassigned</li>}
      </ul>}
    </div>
  );
}
