import React, { useState, useCallback, memo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { Kottage, useUpdateProperty } from '../../../hooks';
import { Colors } from '../../constants';
import { isSubdomain } from '../../../utils/subdomainRouter';

interface LowAvailabilityAlert {
  id: string;
  propertyName: string;
  roomType: string;
  availableUnits: number;
  totalUnits: number;
  dates: string;
}

interface PropertyConfigProps {
  properties: Kottage[] | undefined;
  isLoading: boolean;
  onAddProperty: () => void;
  lowAvailabilityAlerts?: LowAvailabilityAlert[];
}

// Memoized PropertyCard component to prevent unnecessary re-renders
const PropertyCard = memo(
  ({
    property,
    alerts,
    onCardClick,
    onToggleListing,
    isUpdating,
  }: {
    property: Kottage;
    alerts: LowAvailabilityAlert[];
    onCardClick: (property: Kottage) => void;
    onToggleListing: (property: Kottage) => void;
    isUpdating: boolean;
  }) => {
    const getStatusChip = useCallback((property: Kottage) => {
      if (!property.isListed) {
        return <Chip label="Unlisted" color="warning" size="small" />;
      }

      const approvalStatus = property.approval?.status;
      switch (approvalStatus) {
        case 'approved':
          return <Chip label="Live" color="success" size="small" />;
        case 'pending':
          return <Chip label="Pending Review" color="warning" size="small" />;
        case 'under_review':
          return <Chip label="Under Review" color="info" size="small" />;
        case 'rejected':
          return <Chip label="Rejected" color="error" size="small" />;
        case 'requires_documents':
          return (
            <Chip label="Documents Required" color="warning" size="small" />
          );
        default:
          return <Chip label="Draft" color="default" size="small" />;
      }
    }, []);

    return (
      <Card
        elevation={2}
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            elevation: 4,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
          '&:hover .card-content': {
            backgroundColor: '#fafafa',
          },
        }}
        onClick={() => onCardClick(property)}
      >
        {/* Status Chip */}
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          {getStatusChip(property)}
        </Box>

        {/* Property Image */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            image={
              property.images
                ? (Object.values(property.images)[0] as string)
                : 'https://via.placeholder.com/300x180?text=Property'
            }
            alt={property.name}
          />
          {alerts.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                backgroundColor: 'rgba(255, 59, 48, 0.9)',
                color: 'white',
                borderRadius: '4px',
                px: 1,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <WarningIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" fontWeight={600}>
                Low Availability
              </Typography>
            </Box>
          )}
        </Box>

        {/* Property Details */}
        <CardContent
          className="card-content"
          sx={{
            flexGrow: 1,
            pb: 2,
            transition: 'background-color 0.2s ease-in-out',
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            fontWeight={600}
            color={Colors.blue}
          >
            {property.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {property.address?.city}, {property.address?.country}
          </Typography>

          {/* Property Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            {property.roomTypes && property.roomTypes.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {property.roomTypes.reduce(
                  (total, room) => total + (room.quantityAvailable || 0),
                  0
                )}{' '}
                rooms
              </Typography>
            )}
            {property.maxGuests && (
              <Typography variant="caption" color="text.secondary">
                Up to {property.maxGuests} guests
              </Typography>
            )}
          </Box>

          {property.roomTypes && property.roomTypes.length > 0 && (
            <Typography
              variant="h6"
              color={Colors.blue}
              fontWeight={600}
              sx={{ mt: 1 }}
            >
              $
              {Math.min(...property.roomTypes.map(rt => rt.pricePerNight || 0))}
              /night
            </Typography>
          )}

          {/* Low availability alerts */}
          {alerts.map(alert => (
            <Box
              key={alert.id}
              sx={{
                mt: 1,
                p: 1,
                backgroundColor: '#fff8e1',
                borderRadius: 1,
                border: '1px solid #ffecb3',
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="#e65100"
                display="block"
              >
                {alert.roomType}: {alert.availableUnits}/{alert.totalUnits}{' '}
                units left
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {alert.dates}
              </Typography>
            </Box>
          ))}

          {/* Click to manage hint */}
          <Box
            sx={{
              mt: 2,
              pt: 1,
              borderTop: '1px solid #f0f0f0',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              Click anywhere on card for full management
            </Typography>
          </Box>
        </CardContent>

        {/* Action Buttons */}
        <CardActions
          sx={{ pt: 0, justifyContent: 'space-between', px: 2, pb: 2 }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={e => {
                e.stopPropagation();
                window.open(`/Kottages/${property.id}`, '_blank');
              }}
              sx={{ textTransform: 'none' }}
            >
              View
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={e => {
                e.stopPropagation();
                onCardClick(property);
              }}
              sx={{ textTransform: 'none' }}
            >
              Manage
            </Button>
          </Box>
          <Button
            size="small"
            color={property.isListed ? 'warning' : 'success'}
            startIcon={
              property.isListed ? <PauseCircleIcon /> : <CheckCircleIcon />
            }
            onClick={e => {
              e.stopPropagation();
              onToggleListing(property);
            }}
            disabled={isUpdating}
            sx={{ textTransform: 'none' }}
          >
            {isUpdating ? (
              <CircularProgress size={16} />
            ) : property.isListed ? (
              'Unlist'
            ) : (
              'List'
            )}
          </Button>
        </CardActions>
      </Card>
    );
  }
);

PropertyCard.displayName = 'PropertyCard';

export default function PropertyConfig({
  properties,
  isLoading,
  onAddProperty,
  lowAvailabilityAlerts = [],
}: PropertyConfigProps) {
  const navigate = useNavigate();
  const updateProperty = useUpdateProperty();

  const [updatingPropertyId, setUpdatingPropertyId] = useState<string | null>(
    null
  );

  // Memoized function to get alerts for a specific property
  const getPropertyAlerts = useCallback(
    (propertyName: string): LowAvailabilityAlert[] => {
      return lowAvailabilityAlerts.filter(
        (alert: LowAvailabilityAlert) => alert.propertyName === propertyName
      );
    },
    [lowAvailabilityAlerts]
  );

  // Handle property card click to navigate to management page
  const handleCardClick = useCallback(
    (property: Kottage) => {
      // Use the existing subdomain detection utility
      if (isSubdomain('host')) {
        navigate(`/dashboard/properties/manage/${property.id}`);
      } else {
        navigate(`/MyAccount/Dashboard/properties/manage/${property.id}`);
      }
    },
    [navigate]
  );

  // Handle property listing toggle
  const handleToggleListing = useCallback(
    async (property: Kottage) => {
      setUpdatingPropertyId(property.id);
      try {
        await updateProperty.mutateAsync({
          ...property,
          isListed: !property.isListed,
        });
      } catch (error) {
        console.error('Failed to update listing status:', error);
      } finally {
        setUpdatingPropertyId(null);
      }
    },
    [updateProperty]
  );

  return (
    <Box id="properties" mb={5}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600} color={Colors.blue}>
          My Properties
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: Colors.blue }}
          onClick={onAddProperty}
        >
          Add Property
        </Button>
      </Box>

      {isLoading ? (
        <Typography>Loading properties...</Typography>
      ) : properties && properties.length > 0 ? (
        <Grid container spacing={3}>
          {properties.map(property => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <PropertyCard
                property={property}
                alerts={getPropertyAlerts(property.name)}
                onCardClick={handleCardClick}
                onToggleListing={handleToggleListing}
                isUpdating={updatingPropertyId === property.id}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>
          No properties found. Add your first property to get started.
        </Typography>
      )}
    </Box>
  );
}
