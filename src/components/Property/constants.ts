import { styled } from '@mui/material/styles';
// Amenity Icons
import WifiIcon from '@mui/icons-material/Wifi';
import PoolIcon from '@mui/icons-material/Pool';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HotTubIcon from '@mui/icons-material/HotTub';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import FitnessCenter from '@mui/icons-material/FitnessCenter';
import YardIcon from '@mui/icons-material/Yard';
import BalconyIcon from '@mui/icons-material/Balcony';
import PetsIcon from '@mui/icons-material/Pets';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import SecurityIcon from '@mui/icons-material/Security';
import TvIcon from '@mui/icons-material/Tv';
import BathtubIcon from '@mui/icons-material/Bathtub';
import ShowerIcon from '@mui/icons-material/Shower';
import CoffeeMakerIcon from '@mui/icons-material/Coffee';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ChairIcon from '@mui/icons-material/Chair';
import CountertopsIcon from '@mui/icons-material/Countertops';
import WeekendIcon from '@mui/icons-material/Weekend';
import BedIcon from '@mui/icons-material/Bed';
import StarIcon from '@mui/icons-material/Star';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import {  ApprovalDocument } from '../../hooks/propertyHooks';
import React from 'react';


export const amenitiesOptions = [
    { value: 'WiFi', label: 'WiFi', icon: WifiIcon  },
    { value: 'Pool', label: 'Swimming Pool', icon: PoolIcon },
    { value: 'Kitchen', label: 'Full Kitchen', icon: KitchenIcon },
    { value: 'Parking', label: 'Free Parking', icon: LocalParkingIcon },
    { value: 'Beach Access', label: 'Beach Access', icon: BeachAccessIcon },
    { value: 'Hot Tub', label: 'Hot Tub/Jacuzzi', icon: HotTubIcon },
    { value: 'Air Conditioning', label: 'Air Conditioning', icon: AcUnitIcon },
    { value: 'Gym', label: 'Fitness Center', icon: FitnessCenter },
    { value: 'Garden', label: 'Garden/Yard', icon: YardIcon },
    { value: 'Balcony', label: 'Balcony/Patio', icon: BalconyIcon },
    { value: 'Pet Friendly', label: 'Pet Friendly', icon: PetsIcon },
    { value: 'Washing Machine', label: 'Washing Machine', icon: LocalLaundryServiceIcon },
    { value: 'Dryer', label: 'Dryer', icon: DryCleaningIcon },
    { value: 'Fireplace', label: 'Fireplace', icon: FireplaceIcon },
    { value: 'BBQ Grill', label: 'BBQ Grill', icon: OutdoorGrillIcon },
    { value: 'Security System', label: 'Security System', icon: SecurityIcon },
    { value: 'TV', label: 'Smart TV', icon: TvIcon },
    { value: 'Bathtub', label: 'Bathtub', icon: BathtubIcon },
    { value: 'Shower', label: 'Private Shower', icon: ShowerIcon },
    { value: 'Coffee Maker', label: 'Coffee Maker', icon: CoffeeMakerIcon },
    { value: 'Microwave', label: 'Microwave', icon: MicrowaveIcon },
    { value: 'Dining Area', label: 'Dining Area', icon: LocalDiningIcon },
    { value: 'Work Desk', label: 'Work Desk', icon: ChairIcon },
    { value: 'Granite Counters', label: 'Granite Countertops', icon: CountertopsIcon },
    { value: 'Living Room', label: 'Living Room', icon: WeekendIcon },
    { value: 'King Bed', label: 'King Size Bed', icon: BedIcon },
    { value: 'Queen Bed', label: 'Queen Size Bed', icon: BedIcon },
    { value: 'Premium', label: 'Premium Property', icon: StarIcon }
  ];

    export const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'under_review': return '#2196f3';
      case 'rejected': return '#f44336';
      case 'requires_documents': return '#9c27b0';
      default: return '#757575';
    }
  };

  
    export   const getApprovalStatusIcon = (status: string) => {
      switch (status) {
        case 'approved': return React.createElement(VerifiedIcon, { sx: { color: '#4caf50' } });
        case 'pending': return React.createElement(PendingIcon, { sx: { color: '#ff9800' } });
        case 'under_review': return React.createElement(PendingIcon, { sx: { color: '#2196f3' } });
        case 'rejected': return React.createElement(ErrorIcon, { sx: { color: '#f44336' } });
        case 'requires_documents': return React.createElement(CloudUploadIcon, { sx: { color: '#9c27b0' } });
        default: return React.createElement(PendingIcon, { sx: { color: '#757575' } });
      }
    };

   export const propertyTypeOptions = [
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'cabin', label: 'Cabin' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'resort', label: 'Resort' },
    { value: 'other', label: 'Other' }
  ];

  export const documentTypeOptions: { value: ApprovalDocument['type']; label: string }[] = [
    { value: 'title_deed', label: 'Title Deed' },
    { value: 'utility_bill', label: 'Utility Bill' },
    { value: 'property_tax', label: 'Property Tax' },
    { value: 'lease_agreement', label: 'Lease Agreement' },
    { value: 'authorization_letter', label: 'Authorization Letter' },
    { value: 'other', label: 'Other Document' }
  ];

  export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
