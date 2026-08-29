import React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { KottageWithId } from '../../hooks/usePropertySearch';
import { Colors } from '../constants';
import {
  getPropertyLocationLabel,
  getPropertyPriceLabel,
  resolvePropertyCoordinates,
} from '../../utils/propertyMapUtils';

interface SearchResultsMapProps {
  properties: KottageWithId[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (propertyId: string) => void;
  height?:
    | number
    | string
    | {
        xs?: number | string;
        sm?: number | string;
        md?: number | string;
        lg?: number | string;
        xl?: number | string;
      };
}

type MarkerEntry = {
  id: string;
  marker: maplibregl.Marker;
  element: HTMLDivElement;
};

const LOCATION_MARKER_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>'
)}")`;

const JAMAICA_BOUNDS = new maplibregl.LngLatBounds(
  [-78.55, 17.55],
  [-76.0, 18.7]
);

const applyMarkerStyles = (element: HTMLDivElement, selected: boolean) => {
  element.style.width = selected ? '28px' : '24px';
  element.style.height = selected ? '36px' : '30px';
  element.style.borderRadius = '0';
  element.style.border = 'none';
  element.style.backgroundColor = selected ? '#d155b6' : Colors.cerulean;
  element.style.backgroundImage = 'none';
  element.style.backgroundPosition = 'center';
  element.style.backgroundRepeat = 'no-repeat';
  element.style.backgroundSize = 'contain';
  element.style.maskImage = LOCATION_MARKER_MASK;
  element.style.maskPosition = 'center';
  element.style.maskRepeat = 'no-repeat';
  element.style.maskSize = 'contain';
  element.style.webkitMaskImage = LOCATION_MARKER_MASK;
  element.style.webkitMaskPosition = 'center';
  element.style.webkitMaskRepeat = 'no-repeat';
  element.style.webkitMaskSize = 'contain';
  element.style.boxShadow = selected
    ? '0 10px 22px rgba(209,85,182,0.32)'
    : '0 4px 10px rgba(0,123,167,0.18)';
};

const createMarkerElement = (selected: boolean) => {
  const marker = document.createElement('div');
  marker.setAttribute('role', 'button');
  marker.setAttribute('aria-label', 'View property on map');
  applyMarkerStyles(marker, selected);
  marker.style.cursor = 'pointer';
  marker.style.transition = 'all 0.18s ease';
  marker.style.padding = '0';
  marker.style.outline = 'none';
  marker.style.appearance = 'none';
  marker.style.webkitAppearance = 'none';
  marker.style.pointerEvents = 'auto';

  return marker;
};

const setMarkerSelectedStyles = (
  element: HTMLDivElement,
  selected: boolean
) => {
  applyMarkerStyles(element, selected);
};

const SearchResultsMap: React.FC<SearchResultsMapProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  height = 560,
}) => {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<MarkerEntry[]>([]);
  const onSelectPropertyRef = React.useRef(onSelectProperty);
  const selectedProperty =
    properties.find(property => property.key === selectedPropertyId) ||
    properties[0] ||
    null;

  React.useEffect(() => {
    onSelectPropertyRef.current = onSelectProperty;
  }, [onSelectProperty]);

  React.useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-77.2975, 18.1096],
      zoom: 6.6,
      maxBounds: JAMAICA_BOUNDS,
    });

    map.setMinZoom(6.35);

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      'top-right'
    );

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    const bounds = new maplibregl.LngLatBounds();

    properties.forEach(property => {
      const coordinates = resolvePropertyCoordinates(property);
      const element = createMarkerElement(false);

      element.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        onSelectPropertyRef.current?.(property.key);
      });

      const marker = new maplibregl.Marker({
        element,
        anchor: 'bottom',
      })
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(map);

      bounds.extend([coordinates.longitude, coordinates.latitude]);
      markersRef.current.push({
        id: property.key,
        marker,
        element,
      });
    });

    if (!properties.length) {
      return;
    }

    if (properties.length === 1) {
      const coordinates = resolvePropertyCoordinates(properties[0]);
      map.easeTo({
        center: [coordinates.longitude, coordinates.latitude],
        zoom: coordinates.precision === 'exact' ? 12 : 9.25,
        duration: 650,
      });
      return;
    }

    map.fitBounds(bounds, {
      padding: {
        top: 72,
        right: 72,
        bottom: 72,
        left: 72,
      },
      maxZoom: 11,
      duration: 700,
    });
  }, [properties]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach(({ id, element }) => {
      setMarkerSelectedStyles(element, id === selectedPropertyId);
    });

    if (!selectedPropertyId) {
      return;
    }

    const selectedPropertyMatch = properties.find(
      property => property.key === selectedPropertyId
    );

    if (!selectedPropertyMatch) {
      return;
    }

    const coordinates = resolvePropertyCoordinates(selectedPropertyMatch);
    map.easeTo({
      center: [coordinates.longitude, coordinates.latitude],
      zoom: Math.max(map.getZoom(), coordinates.precision === 'exact' ? 11 : 8.6),
      duration: 500,
    });
  }, [properties, selectedPropertyId]);

  React.useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const resizeTimeout = window.setTimeout(() => {
      mapRef.current?.resize();
    }, 80);

    return () => window.clearTimeout(resizeTimeout);
  }, [height, properties.length]);

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid rgba(15,23,42,0.1)',
        boxShadow: '0 18px 38px rgba(15,23,42,0.12)',
        backgroundColor: '#eef3f6',
      }}
    >
      {selectedProperty && (
        <Paper
          elevation={0}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            zIndex: 2,
            p: 1.5,
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.55)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            maxWidth: 360,
          }}
        >
          <Stack spacing={0.9}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1.5}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: '#162332',
                    lineHeight: 1.2,
                  }}
                >
                  {selectedProperty.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#5b6876', mt: 0.35 }}
                >
                  {getPropertyLocationLabel(selectedProperty)}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={getPropertyPriceLabel(selectedProperty)}
                sx={{
                  fontWeight: 700,
                  backgroundColor: 'rgba(0,123,167,0.1)',
                  color: '#005a79',
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                icon={<RoomOutlinedIcon />}
                label={
                  resolvePropertyCoordinates(selectedProperty).precision === 'exact'
                    ? 'Exact pin'
                    : 'Approximate area'
                }
                sx={{
                  fontWeight: 600,
                  backgroundColor: 'rgba(15,23,42,0.06)',
                }}
              />
              <Chip
                size="small"
                icon={<LocationOnIcon />}
                label="Jamaica"
                sx={{
                  fontWeight: 600,
                  backgroundColor: 'rgba(15,23,42,0.06)',
                }}
              />
            </Stack>
          </Stack>
        </Paper>
      )}

      <Box
        ref={mapContainerRef}
        sx={{
          width: '100%',
          height,
          minHeight: 320,
          '& .maplibregl-ctrl-top-right': {
            top: 16,
            right: 16,
          },
          '& .maplibregl-ctrl-group': {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 26px rgba(15,23,42,0.16)',
            border: '1px solid rgba(15,23,42,0.08)',
          },
        }}
      />
    </Paper>
  );
};

export default SearchResultsMap;
