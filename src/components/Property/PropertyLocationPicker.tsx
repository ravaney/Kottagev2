import React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Kottage, PropertyCoordinates } from '../../hooks/propertyHooks';
import { KottageWithId } from '../../hooks/usePropertySearch';
import {
  getPropertyLocationLabel,
  resolvePropertyCoordinates,
} from '../../utils/propertyMapUtils';
import { Colors } from '../constants';

interface PropertyLocationPickerProps {
  property: Partial<Kottage>;
  disabled?: boolean;
  height?: number;
  onChange: (coordinates: PropertyCoordinates) => void;
}

const JAMAICA_BOUNDS = new maplibregl.LngLatBounds(
  [-78.55, 17.55],
  [-76.0, 18.7]
);

const roundCoordinate = (value: number) => Number(value.toFixed(6));

const hasExactCoordinates = (
  coordinates?: Partial<PropertyCoordinates>
): coordinates is PropertyCoordinates =>
  typeof coordinates?.latitude === 'number' &&
  Number.isFinite(coordinates.latitude) &&
  typeof coordinates?.longitude === 'number' &&
  Number.isFinite(coordinates.longitude);

const createPreviewProperty = (property: Partial<Kottage>): KottageWithId =>
  ({
    id: property.id || 'draft-property',
    key: property.id || 'draft-property',
    ownerId: property.ownerId || '',
    name: property.name || 'Untitled property',
    description: property.description || '',
    phone: property.phone || '',
    address:
      property.address ||
      ({
        address1: '',
        city: '',
        state: '',
        zip: '',
        country: 'Jamaica',
      } as Kottage['address']),
    rating: property.rating || 0,
    isListed: property.isListed || false,
    amenities: property.amenities || [],
    roomTypes: property.roomTypes || [],
    promotions: property.promotions,
    images: property.images || [],
    approval:
      property.approval || {
        status: 'pending',
        requiredDocuments: [],
        submittedDocuments: [],
      },
    createdAt: property.createdAt || new Date().toISOString(),
    updatedAt: property.updatedAt,
    propertyType: property.propertyType,
    maxGuests: property.maxGuests,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    squareFootage: property.squareFootage,
    host: property.host,
    nomad: property.nomad,
    coordinates: property.coordinates,
  }) as KottageWithId;

const createMarkerElement = () => {
  const element = document.createElement('div');
  element.style.width = '18px';
  element.style.height = '18px';
  element.style.borderRadius = '999px';
  element.style.background = Colors.cerulean;
  element.style.border = '3px solid #ffffff';
  element.style.boxShadow = '0 8px 18px rgba(0,123,167,0.28)';
  element.style.cursor = 'grab';
  element.style.transition = 'transform 0.16s ease, box-shadow 0.16s ease';
  return element;
};

export default function PropertyLocationPicker({
  property,
  disabled = false,
  height = 320,
  onChange,
}: PropertyLocationPickerProps) {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markerRef = React.useRef<maplibregl.Marker | null>(null);
  const markerElementRef = React.useRef<HTMLDivElement | null>(null);
  const onChangeRef = React.useRef(onChange);

  const previewProperty = React.useMemo(
    () => createPreviewProperty(property),
    [property]
  );

  const resolvedCoordinates = React.useMemo(
    () => resolvePropertyCoordinates(previewProperty),
    [previewProperty]
  );

  const isExactPin = hasExactCoordinates(property.coordinates);
  const initialCoordinatesRef = React.useRef(resolvedCoordinates);
  const initialZoomRef = React.useRef(isExactPin ? 14 : 10.8);
  const initialDisabledRef = React.useRef(disabled);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const markerElement = createMarkerElement();
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [
        initialCoordinatesRef.current.longitude,
        initialCoordinatesRef.current.latitude,
      ],
      zoom: initialZoomRef.current,
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

    const marker = new maplibregl.Marker({
      element: markerElement,
      anchor: 'center',
      draggable: !initialDisabledRef.current,
    })
      .setLngLat([
        initialCoordinatesRef.current.longitude,
        initialCoordinatesRef.current.latitude,
      ])
      .addTo(map);

    if (!initialDisabledRef.current) {
      map.on('click', event => {
        const nextCoordinates = {
          latitude: roundCoordinate(event.lngLat.lat),
          longitude: roundCoordinate(event.lngLat.lng),
        };
        marker.setLngLat([nextCoordinates.longitude, nextCoordinates.latitude]);
        onChangeRef.current(nextCoordinates);
      });
    }

    marker.on('dragstart', () => {
      markerElement.style.cursor = 'grabbing';
      markerElement.style.transform = 'scale(1.08)';
    });

    marker.on('dragend', () => {
      markerElement.style.cursor = 'grab';
      markerElement.style.transform = 'scale(1)';
      const lngLat = marker.getLngLat();
      onChangeRef.current({
        latitude: roundCoordinate(lngLat.lat),
        longitude: roundCoordinate(lngLat.lng),
      });
    });

    mapRef.current = map;
    markerRef.current = marker;
    markerElementRef.current = markerElement;

    const resizeTimeout = window.setTimeout(() => {
      map.resize();
    }, 120);

    return () => {
      window.clearTimeout(resizeTimeout);
      marker.remove();
      map.remove();
      markerRef.current = null;
      mapRef.current = null;
      markerElementRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    markerRef.current?.setDraggable(!disabled);
    if (markerElementRef.current) {
      markerElementRef.current.style.cursor = disabled ? 'default' : 'grab';
    }
  }, [disabled]);

  React.useEffect(() => {
    if (!mapRef.current || !markerRef.current) {
      return;
    }

    markerRef.current.setLngLat([
      resolvedCoordinates.longitude,
      resolvedCoordinates.latitude,
    ]);

    mapRef.current.easeTo({
      center: [resolvedCoordinates.longitude, resolvedCoordinates.latitude],
      zoom: isExactPin ? 14 : 10.8,
      duration: 320,
    });
  }, [isExactPin, resolvedCoordinates.latitude, resolvedCoordinates.longitude]);

  React.useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const resizeTimeout = window.setTimeout(() => {
      mapRef.current?.resize();
    }, 80);

    return () => window.clearTimeout(resizeTimeout);
  }, [height]);

  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography variant="h6" sx={{ color: Colors.cerulean, mb: 0.75 }}>
          Edit Map Location
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on the map or drag the pin to place the exact property location
          guests should see.
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip
          size="small"
          icon={<PlaceOutlinedIcon />}
          label={isExactPin ? 'Exact pin saved' : 'Approximate area shown'}
          sx={{
            fontWeight: 600,
            backgroundColor: isExactPin
              ? 'rgba(0,123,167,0.12)'
              : 'rgba(100,116,139,0.12)',
            color: isExactPin ? Colors.cerulean : '#475569',
          }}
        />
        <Chip
          size="small"
          icon={<NearMeOutlinedIcon />}
          label={`${roundCoordinate(resolvedCoordinates.latitude)}, ${roundCoordinate(
            resolvedCoordinates.longitude
          )}`}
          sx={{
            fontWeight: 600,
            backgroundColor: 'rgba(15,23,42,0.06)',
            color: '#1e293b',
          }}
        />
        <Chip
          size="small"
          label={getPropertyLocationLabel(previewProperty)}
          sx={{
            fontWeight: 600,
            backgroundColor: 'rgba(255,255,255,0.94)',
            color: '#334155',
            border: '1px solid rgba(15,23,42,0.08)',
          }}
        />
      </Stack>

      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: 3,
          border: '1px solid rgba(15,23,42,0.12)',
          boxShadow: '0 14px 36px rgba(15,23,42,0.08)',
          backgroundColor: '#eef3f6',
        }}
      >
        <Box
          ref={mapContainerRef}
          sx={{
            width: '100%',
            height,
          }}
        />
      </Paper>
    </Stack>
  );
}
