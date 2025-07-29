import  { useState } from "react";
import Box from "@mui/material/Box";
import { Kottage, RoomType, useGetPropertyById } from "../../hooks";
import { useLocation,  useParams } from "react-router-dom";
import { usePropertyAnalytics } from "../../services/analyticsService";
import {
  LoadingState,
  ErrorState,
  PropertyPostcard,
} from "./ViewProperty";
import { DetailedRoomView } from "./ViewProperty/DetailedRoomViewDialog";
import RoomTypes from "./RoomTypes";

function ViewKottage() {
  const location = useLocation();
  const { id: propertyId } = useParams<{ id: string }>();
  const { data: freshKottage, isLoading, error } = useGetPropertyById(propertyId);
  const kottage = freshKottage || (location.state?.kottage as Kottage | undefined);
  
  // Extract search criteria from location state (includes dates if provided)
  const searchCriteria = location.state?.searchCriteria;
  const checkInDate = searchCriteria?.checkIn;
  const checkOutDate = searchCriteria?.checkOut;
  const guests = searchCriteria?.guests;
  
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [detailedRoomView, setDetailedRoomView] = useState<RoomType | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
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

  // Handle scroll to rooms section
  const handleViewRooms = () => {
    const roomsSection = document.getElementById('rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Box>
      {/* Detailed Room View Modal */}
      <DetailedRoomView 
        detailedRoomView={detailedRoomView}
        setDetailedRoomView={setDetailedRoomView}
        kottage={kottage}
        guests={guests}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      />

      {/* Property Postcard - Full Width */}
      <Box sx={{ height: '100vh', position: 'relative' }}>
        {kottage && (
          <PropertyPostcard 
            kottage={kottage}
            defaultRoom={defaultRoom}
            isFavorite={isFavorite}
            onFavoriteToggle={() => setIsFavorite(!isFavorite)}
            onViewRooms={handleViewRooms}
          />
        )}
      </Box>

      {/* Room Types Section */}
      <Box 
        id="rooms-section"
        sx={{ 
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 4
        }}
      >
        {kottage && (
          <RoomTypes 
            kottage={kottage}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            setDetailedRoomView={setDetailedRoomView}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            guests={guests}
          />
        )}
      </Box>
    </Box>
  );
}

export default ViewKottage;
