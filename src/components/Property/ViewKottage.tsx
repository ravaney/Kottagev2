import  { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/GridLegacy";
import Paper from "@mui/material/Paper";
import { Slide, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

import BigGallery from "./BigGallery";
import RoomTypes from "./RoomTypes";
import { Kottage, RoomType, useGetPropertyById } from "../../hooks";
import { useLocation,  useParams } from "react-router-dom";
import { usePropertyAnalytics } from "../../services/analyticsService";
import {
  LoadingState,
  ErrorState,
  PropertyPostcard,
} from "./ViewProperty";
import { DetailedRoomView } from "./ViewProperty/DetailedRoomViewDialog";

function ViewKottage() {
  const location = useLocation();
  const { id: propertyId } = useParams<{ id: string }>();
  const { data: freshKottage, isLoading, error } = useGetPropertyById(propertyId);
  const kottage = freshKottage || (location.state?.kottage as Kottage | undefined);
  
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [detailedRoomView, setDetailedRoomView] = useState<RoomType | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  
  // Initialize analytics tracking for this property
  const analytics = usePropertyAnalytics(kottage?.id || '', document.referrer);
  
  // Show loading state while fetching fresh data
  if (isLoading && !kottage) {
    return <LoadingState message="Loading property details..." />;
  }
  
  // Show error state if property not found
  if (error || (!isLoading && !kottage)) {
    return (
      <ErrorState 
        title="Property Not Found"
        message="The property you're looking for could not be found or may have been removed."
      />
    );
  }
  



  // Get the default room or the cheapest room for pricing display
  const getDefaultRoom = () => {
    if (!kottage?.roomTypes || kottage.roomTypes.length === 0) return null;
    return kottage.roomTypes.reduce((cheapest, room) => 
      room.pricePerNight < cheapest.pricePerNight ? room : cheapest
    );
  };

  const defaultRoom = getDefaultRoom();


  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Detailed Room View Modal */}
      <DetailedRoomView 
        detailedRoomView={detailedRoomView}
        setDetailedRoomView={setDetailedRoomView}
        kottage={kottage}
      />

      {/* Main Content - Full Width */}
      <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
        {/* Property Postcard - Full Width */}
        <Box sx={{ height: '100%', position: 'relative' }}>
          {kottage && (
            <PropertyPostcard 
              kottage={kottage}
              defaultRoom={defaultRoom}
              isFavorite={isFavorite}
              onFavoriteToggle={() => setIsFavorite(!isFavorite)}
              onShowRooms={() => setShowRoomSelector(true)}
            />
          )}
        </Box>

        {/* Sliding Room Selector */}
        {showRoomSelector && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1299
            }}
            onClick={() => setShowRoomSelector(false)}
          />
        )}
        
        <Slide direction="up" in={showRoomSelector} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              right: { xs: 0, lg: 0 },
              left: { xs: 0, lg: 'auto' },
              width: { xs: '100%', lg: '25%' },
              height: '70vh',
              bgcolor: 'background.paper',
              borderRadius: { xs: '24px 24px 0 0', lg: '24px 0 0 0' },
              boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
              zIndex: 1300,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Close handle and button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                px: 3,
                borderBottom: '1px solid #e0e0e0'
              }}
            >
              {/* Handle bar (mobile) */}
              <Box
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  flex: 1,
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setShowRoomSelector(false)}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 4,
                    bgcolor: '#ccc',
                    borderRadius: 2
                  }}
                />
              </Box>
              
              {/* Close button (desktop only) */}
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, flex: 1 }} />
              <IconButton
                onClick={() => setShowRoomSelector(false)}
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Room Types Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              {kottage && (
                <RoomTypes 
                  kottage={kottage}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  setDetailedRoomView={setDetailedRoomView}
                />
              )}
            </Box>
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}

export default ViewKottage;
