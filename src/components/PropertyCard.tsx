import {
  Stack,
} from "@fluentui/react";
import {
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Card,
  Rating,
  styled,
  Button,
  Box,
  Chip,
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PublishIcon from '@mui/icons-material/Publish';
import SlideShow from "./SlideShow";
import { Colors } from "./constants";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Kottage, useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useUpdateProperty } from "../hooks/propertyHooks";
type Props = {
  property: Kottage;
};



const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: Colors.raspberry,
  },
  "& .MuiRating-iconHover": {
    color: Colors.raspberry,
  },
});

export default function PropertyCard({ property }: Props) {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const updateProperty = useUpdateProperty();
  const images = property?.images;

  const imageArray =
    images && Object.values(images).map((image) => image as string);

  const isMyProperty = property.ownerId === firebaseUser?.uid;

  const handleButtonClick = () => {
    if (isMyProperty) {
      // Navigate to manage property page
      navigate(`/MyAccount/MyKottages/ManageProperty/${encodeURIComponent(property.name)}`);
    } else {
      // Navigate to property details/booking page
      navigate(`/property/${property.id}`);
    }
  };
  

  const handleToggleListing = async () => {
    try {
      await updateProperty.mutateAsync({
        ...property,
        isListed: !property.isListed
      });
    } catch (error) {
      console.error('Failed to update listing status:', error);
    }
  };

  if (!property) return <div>loading...</div>;

  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      style={{ position: "relative" }}
    >
      <Card sx={{ 
        width: 320, 
        height: 420, 
        backgroundColor: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
        },
        overflow: 'hidden',
        position: 'relative'
      }}>
        <CardMedia sx={{ position: 'relative' }}>
          <SlideShow images={imageArray as string[]} />
          {isMyProperty && (
            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
              <Chip 
                label="My Property" 
                size="small"
                sx={{
                  backgroundColor: Colors.blue,
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={property.isListed ? "Listed" : "Unlisted"}
                size="small"
                sx={{
                  backgroundColor: property.isListed ? '#4caf50' : '#ff9800',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
          )}
        </CardMedia>
        <CardContent sx={{ padding: "16px", paddingBottom: "80px" }}>
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ mb: 1, color: Colors.blue }}
          >
            {property.name}
          </Typography>
          
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: Colors.raspberry, mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {property.address?.country}
            </Typography>
          </Box>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              mb: 2
            }}
          >
            {property.description}
          </Typography>
          
          {isMyProperty && (
            <Box display="flex" gap={1} sx={{ mb: 1 }}>
              <Chip 
                icon={<EventIcon />}
                label={`${property.currentReservations || 0} Current`}
                size="small"
                variant="outlined"
                sx={{ 
                  color: Colors.blue,
                  borderColor: Colors.blue,
                  fontSize: '0.7rem'
                }}
              />
              <Chip 
                icon={<HistoryIcon />}
                label={`${property.pastReservations || 0} Past`}
                size="small"
                variant="outlined"
                sx={{ 
                  color: Colors.raspberry,
                  borderColor: Colors.raspberry,
                  fontSize: '0.7rem'
                }}
              />
            </Box>
          )}
        </CardContent>
        <CardActions
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            padding: '12px 16px'
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <StyledRating
                name="read-only"
                readOnly
                value={4}
                size="small"
                icon={<FavoriteIcon />}
                emptyIcon={<FavoriteBorderIcon />}
              />
              <Button 
                size="small" 
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(`/property/${property.id}`)}
                sx={{ 
                  color: Colors.raspberry,
                  textTransform: 'none',
                  fontSize: '0.75rem'
                }}
              >
                25 reviews
              </Button>
            </Box>
            
            <Typography 
              variant="h6" 
              fontWeight={700}
              sx={{ color: Colors.blue, mb: 1 }}
            >
              ${property.price}.00 <Typography component="span" variant="body2" color="text.secondary">per night</Typography>
            </Typography>
            
            {isMyProperty ? (
              <Box>
                <Button 
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleButtonClick}
                  fullWidth
                  sx={{
                    mb: 1,
                    backgroundColor: Colors.blue,
                    '&:hover': { backgroundColor: Colors.raspberry }
                  }}
                >
                  Manage Property
                </Button>
                <Button 
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={property.isListed ? <VisibilityOffIcon /> : <PublishIcon />}
                  onClick={handleToggleListing}
                  disabled={updateProperty.isPending}
                  sx={{
                    color: property.isListed ? '#ff9800' : '#4caf50',
                    borderColor: property.isListed ? '#ff9800' : '#4caf50',
                    '&:hover': {
                      backgroundColor: property.isListed ? 'rgba(255, 152, 0, 0.08)' : 'rgba(76, 175, 80, 0.08)'
                    }
                  }}
                >
                  {updateProperty.isPending ? 'Updating...' : (property.isListed ? 'Unlist' : 'List')}
                </Button>
              </Box>
            ) : (
              <Button 
                variant="contained"
                fullWidth
                onClick={handleButtonClick}
                sx={{
                  backgroundColor: Colors.raspberry,
                  '&:hover': { backgroundColor: Colors.blue },
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Reserve Now
              </Button>
            )}
          </Box>
        </CardActions>
      </Card>

    </Stack>
  );
}
