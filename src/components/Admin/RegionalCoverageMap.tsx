import React, { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BoundaryMap, {
  BoundaryCollection,
  BoundaryMapPoint,
  MapZone,
} from '../BoundaryMap';
import parishData from '../BoundaryMap/jamaicaParishes.json';
import jamaicaPlaces from './jamaicaPlaces.json';
import { useAllProperties } from '../../hooks/propertyHooks';
import {
  getParishId,
  getParishLabel,
  createCoverageZones,
  mountainBoundary,
  normalizeParish,
  propertyParishId,
  propertyInCoverageZone,
  zoneParishIds,
} from './regionalCoverage';

const boundaries = parishData as BoundaryCollection;
const placePoints = jamaicaPlaces as BoundaryMapPoint[];
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
interface CoverageAssignment {
  id: number;
  staffName: string;
  role: string;
  assignmentType: 'parish' | 'regional';
  assignmentValue: string;
}
interface RegionalCoverageMapProps {
  assignments: CoverageAssignment[];
  onAssign: (name: string, type: 'parish' | 'regional') => void;
  zones?: MapZone[];
}

export default function RegionalCoverageMap({
  assignments,
  onAssign,
  zones: customZones,
}: RegionalCoverageMapProps) {
  const activeBoundary = mountainBoundary;
  const zones = useMemo(
    () => customZones ?? createCoverageZones(),
    [customZones]
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const {
    data: properties = [],
    isPending,
    isError,
    refetch,
  } = useAllProperties();
  const selected = boundaries.features.find(
    feature => getParishId(feature) === selectedId
  );
  const selectedZone = selectedId
    ? undefined
    : zones.find(zone => zone.id === selectedZoneId);
  const showDetails = Boolean(selected || selectedZone);
  const propertyLocations = useMemo(
    () =>
      properties.map(property => ({
        property,
        parishId: propertyParishId(property, boundaries.features),
      })),
    [properties]
  );
  const selectedMembers = new Set(
    selectedZone
      ? zoneParishIds(selectedZone)
      : selectedId
        ? [selectedId]
        : boundaries.features.map(getParishId)
  );
  const matchingProperties = propertyLocations.filter(
    ({ property, parishId }) =>
      selectedZone
        ? propertyInCoverageZone(property, parishId, selectedZone) === true
        : parishId && selectedMembers.has(parishId)
  );
  const unknownZoneLocations = selectedZone
    ? propertyLocations.filter(
        ({ property, parishId }) =>
          propertyInCoverageZone(property, parishId, selectedZone) === null
      ).length
    : 0;
  const parishFeatures = boundaries.features.filter(feature =>
    selectedMembers.has(getParishId(feature))
  );
  const propertiesByParish: Record<string, typeof propertyLocations> = {};
  matchingProperties.forEach(location => {
    if (location.parishId) {
      propertiesByParish[location.parishId] = [
        ...(propertiesByParish[location.parishId] ?? []),
        location,
      ];
    }
  });
  const unmatched = propertyLocations.filter(
    ({ parishId }) => !parishId
  ).length;
  const matchingAssignments = assignments.filter(item =>
    selectedZone
      ? (item.assignmentType === 'regional' &&
          item.assignmentValue === selectedZone.label) ||
        (item.assignmentType === 'parish' &&
          boundaries.features.some(
            feature =>
              selectedMembers.has(getParishId(feature)) &&
              normalizeParish(getParishLabel(feature)) ===
                normalizeParish(item.assignmentValue)
          ))
      : selected &&
        item.assignmentType === 'parish' &&
        normalizeParish(item.assignmentValue) ===
          normalizeParish(getParishLabel(selected))
  );
  const title =
    selectedZone?.label ??
    (selected ? getParishLabel(selected) : 'All Jamaica');
  const regionalAssignments = matchingAssignments.filter(
    item => item.assignmentType === 'regional'
  );
  const uniqueStaff = Object.values(
    matchingAssignments.reduce<
      Record<string, { name: string; role: string; count: number }>
    >((result, item) => {
      const entry = result[item.staffName];
      result[item.staffName] = entry
        ? { ...entry, count: entry.count + 1 }
        : { name: item.staffName, role: item.role, count: 1 };
      return result;
    }, {})
  );
  const showCount = (count: number) =>
    isPending ? 'Loading...' : isError ? 'Unavailable' : count;

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: showDetails ? 'minmax(0, 1fr) 360px' : 'minmax(0, 1fr)',
        },
        gridTemplateRows: {
          xs: showDetails
            ? 'minmax(180px, 1fr) minmax(0, 320px)'
            : 'minmax(0, 1fr)',
          md: 'minmax(0, 1fr)',
        },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ minHeight: 0, minWidth: 0, px: 1, pb: 1 }}>
        <BoundaryMap
          data={boundaries}
          getFeatureId={getParishId}
          getFeatureLabel={getParishLabel}
          title="Jamaica regions and parishes"
          instruction="Click a zone to view property counts and staff coverage."
          selectedId={selectedId}
          selectedZoneId={selectedZoneId}
          zones={zones}
          points={placePoints}
          zoneFirstSelection
          showZoneLabels
          zoneControlsPlacement="outside"
          onSelect={feature => {
            setSelectedId(feature ? getParishId(feature) : null);
            if (!feature) setSelectedZoneId(null);
          }}
          onZoneSelect={zone => {
            setSelectedZoneId(zone?.id ?? null);
            setSelectedId(null);
          }}
        />
      </Box>
      {showDetails && (
        <Box
          role="complementary"
          aria-label="Area details"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
            borderLeft: { md: '1px solid #e2e9ef' },
            borderTop: { xs: '1px solid #e2e9ef', md: 0 },
            backgroundColor: '#fff',
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid #e2e9ef',
              backgroundColor: '#fafcfd',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              {selectedZone ? 'Regional operations' : 'Parish details'}
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.3 }}>
              {title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.25 }}
            >
              {parishFeatures.map(getParishLabel).join(' · ')}
            </Typography>
          </Box>

          <Box sx={{ flex: '1 1 0', minHeight: 0, overflow: 'auto', p: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  minWidth: 0,
                  px: 1,
                  py: 1.25,
                  textAlign: 'center',
                  border: '1px solid #e2e9ef',
                  borderRadius: 2,
                }}
              >
                <Typography
                  role="status"
                  aria-label={`${title} property count`}
                  aria-live="polite"
                  sx={{
                    fontSize: isPending || isError ? '0.95rem' : '1.5rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: '#173746',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {showCount(matchingProperties.length)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Properties
                </Typography>
              </Box>
              <Box
                sx={{
                  minWidth: 0,
                  px: 1,
                  py: 1.25,
                  textAlign: 'center',
                  border: '1px solid #e2e9ef',
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: '#173746',
                  }}
                >
                  {isPending ? '…' : isError ? '—' : uniqueStaff.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Staff assigned
                </Typography>
              </Box>
              <Box
                sx={{
                  minWidth: 0,
                  px: 1,
                  py: 1.25,
                  textAlign: 'center',
                  border: '1px solid #e2e9ef',
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: '#173746',
                  }}
                >
                  —
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Staffed properties
                </Typography>
              </Box>
            </Box>

            {!isPending && !isError && (
              <Box sx={{ mt: 1.5 }}>
                <Chip
                  size="small"
                  variant="outlined"
                  label="Coverage unknown"
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  Staffing requirements aren&apos;t configured yet, so coverage
                  can&apos;t be calculated.
                </Typography>
              </Box>
            )}

            {isError && (
              <Alert
                severity="error"
                sx={{ mt: 1.5 }}
                action={
                  <Button onClick={() => refetch()} size="small">
                    Retry
                  </Button>
                }
              >
                Unable to load property counts.
              </Alert>
            )}

            {!isPending && !isError && unknownZoneLocations > 0 && (
              <Alert severity="info" sx={{ mt: 1.5 }}>
                {unknownZoneLocations} properties in split parishes need
                coordinates and are excluded from this regional count.
              </Alert>
            )}

            {selectedZone && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1 }}>
                  Regional leader
                </Typography>
                {regionalAssignments.length === 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      p: 1.5,
                      border: '1px solid #e2e9ef',
                      borderRadius: 2,
                      backgroundColor: '#fafcfd',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No regional leader assigned.
                    </Typography>
                    <Chip
                      size="small"
                      variant="outlined"
                      color="warning"
                      label="Vacant"
                    />
                  </Box>
                ) : (
                  regionalAssignments.map(item => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        mb: 1,
                        border: '1px solid #e2e9ef',
                        borderRadius: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: '0.85rem',
                          bgcolor: '#e3f2fd',
                          color: '#173746',
                        }}
                      >
                        {initials(item.staffName)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {item.staffName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="div"
                          noWrap
                        >
                          {item.role}
                        </Typography>
                      </Box>
                      <Chip size="small" color="success" label="Assigned" />
                    </Box>
                  ))
                )}
                <Button
                  size="small"
                  fullWidth
                  sx={{ mt: 0.5, textTransform: 'none' }}
                  onClick={() => onAssign(title, 'regional')}
                >
                  {regionalAssignments.length
                    ? 'Change leader'
                    : 'Assign leader'}
                </Button>
              </>
            )}

            <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1 }}>
              {selectedZone ? 'Parish & property coverage' : 'Properties'}
            </Typography>
            {parishFeatures.map((feature, index) => {
              const parishId = getParishId(feature);
              const parishProperties = propertiesByParish[parishId] ?? [];
              return (
                <Accordion
                  key={parishId}
                  defaultExpanded={!selectedZone || index === 0}
                  disableGutters
                  elevation={0}
                  sx={{
                    mb: 1,
                    border: '1px solid #e2e9ef',
                    borderRadius: '8px !important',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon fontSize="small" />}
                    sx={{
                      minHeight: 40,
                      '& .MuiAccordionSummary-content': {
                        my: 1,
                        alignItems: 'center',
                        gap: 1,
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ flex: 1 }}
                    >
                      {getParishLabel(feature)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {showCount(parishProperties.length)} properties
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    {parishProperties.length === 0 ? (
                      <Typography variant="caption" color="text.secondary">
                        No properties in this parish.
                      </Typography>
                    ) : (
                      <Box
                        component="ul"
                        sx={{ listStyle: 'none', m: 0, p: 0 }}
                      >
                        {parishProperties.map(({ property }) => (
                          <Box
                            component="li"
                            key={property.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              py: 0.75,
                              borderTop: '1px solid #f0f4f7',
                              '&:first-of-type': { borderTop: 0 },
                            }}
                          >
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ flex: 1, minWidth: 0 }}
                            >
                              {property.name || 'Unnamed property'}
                            </Typography>
                            <Chip
                              size="small"
                              variant="outlined"
                              label={property.isListed ? 'Listed' : 'Unlisted'}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              Property-level staffing isn&apos;t configured yet, so per-property
              coverage can&apos;t be shown.
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1 }}>
              {selectedZone ? 'Regional staff directory' : 'Parish staff'}
            </Typography>
            {uniqueStaff.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No staff assigned.
              </Typography>
            ) : (
              uniqueStaff.map(staff => (
                <Box
                  key={staff.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    borderBottom: '1px solid #e2e9ef',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      fontSize: '0.75rem',
                      bgcolor: '#e3f2fd',
                      color: '#173746',
                    }}
                  >
                    {initials(staff.name)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {staff.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="div"
                      noWrap
                    >
                      {staff.role}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {staff.count} {staff.count === 1 ? 'area' : 'areas'}
                  </Typography>
                </Box>
              ))
            )}
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2, textTransform: 'none' }}
              onClick={() =>
                onAssign(title, selectedZone ? 'regional' : 'parish')
              }
            >
              Assign staff here
            </Button>

            <Accordion
              disableGutters
              elevation={0}
              sx={{
                mt: 2.5,
                border: '1px solid #e2e9ef',
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon fontSize="small" />}
                sx={{
                  minHeight: 36,
                  '& .MuiAccordionSummary-content': { my: 1 },
                }}
              >
                <Typography variant="subtitle2">
                  Data & boundary information
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block' }}
                >
                  All Firebase properties are included, including pending and
                  unlisted properties.
                </Typography>
                {selectedZone &&
                (selectedZone.areas?.length ||
                  selectedZone.excludedAreas?.length) ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    {activeBoundary.description}
                  </Typography>
                ) : null}
                {!isPending && !isError && unmatched > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    {unmatched} properties could not be matched to a Jamaica
                    parish and are excluded from map counts.
                  </Typography>
                )}
                <Typography
                  component="a"
                  href={activeBoundary.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="caption"
                  sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
                >
                  Boundary source: {activeBoundary.sourceLabel}
                </Typography>
                <Typography
                  component="a"
                  href="https://www.geonames.org/"
                  target="_blank"
                  rel="noreferrer"
                  variant="caption"
                  sx={{ display: 'block', color: 'text.secondary' }}
                >
                  Town locations: GeoNames (CC BY 4.0)
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      )}
    </Box>
  );
}
