import React from 'react';
import {
  Wifi,
  LocalParking,
  Pool,
  Restaurant,
  Spa,
  FitnessCenter,
  BusinessCenter,
  RoomService,
  AcUnit,
  Balcony,
  Kitchen,
  Pets,
  CheckCircle,
} from "@mui/icons-material";

export const getAmenityIcon = (amenity: string): React.ComponentType => {
  const amenityLower = amenity.toLowerCase();
  if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return Wifi;
  if (amenityLower.includes('parking')) return LocalParking;
  if (amenityLower.includes('pool')) return Pool;
  if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return Restaurant;
  if (amenityLower.includes('spa')) return Spa;
  if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return FitnessCenter;
  if (amenityLower.includes('business')) return BusinessCenter;
  if (amenityLower.includes('room service')) return RoomService;
  if (amenityLower.includes('ac') || amenityLower.includes('air')) return AcUnit;
  if (amenityLower.includes('balcony') || amenityLower.includes('terrace')) return Balcony;
  if (amenityLower.includes('kitchen')) return Kitchen;
  if (amenityLower.includes('pet')) return Pets;
  return CheckCircle;
};