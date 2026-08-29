import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Kottage, RoomType, useGetPropertyById } from "../../hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
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
  usePropertyAnalytics(kottage?.id || '', document.referrer);

  const listedRooms =
    kottage?.roomTypes?.filter(room => room.listStatus === 'listed') || [];

  const selectedNights =
    checkInDate && checkOutDate
      ? Math.max(
          1,
          Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
          )
        )
      : 1;

  const defaultRoom =
    listedRooms.length > 0
      ? listedRooms.reduce((cheapest, room) =>
          room.pricePerNight < cheapest.pricePerNight ? room : cheapest
        )
      : null;

  useEffect(() => {
    if (!selectedRoom && defaultRoom) {
      setSelectedRoom(defaultRoom);
    }
  }, [defaultRoom, selectedRoom]);
  
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
  



  const handlePrimaryAction = () => {
    if (kottage && listedRooms.length === 1 && defaultRoom) {
      navigate(`/Kottages/${kottage.id}/book-room`, {
        state: {
          kottage,
          room: defaultRoom,
          checkInDate,
          checkOutDate,
          guests,
          totalPrice: defaultRoom.pricePerNight * selectedNights,
          nights: selectedNights,
          pricePerNight: defaultRoom.pricePerNight,
        },
      });
      return;
    }

    const roomsSection = document.getElementById('rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', pb: { xs: 10, md: 0 } }}>
      {/* Detailed Room View Modal */}
      <DetailedRoomView 
        detailedRoomView={detailedRoomView}
        setDetailedRoomView={setDetailedRoomView}
        kottage={kottage}
        guests={guests}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      />

      {kottage && (
        <PropertyPostcard 
          kottage={kottage}
          defaultRoom={defaultRoom}
          isFavorite={isFavorite}
          onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          onViewRooms={handlePrimaryAction}
          primaryActionLabel={
            listedRooms.length === 1 ? 'Reserve this room' : 'View available rooms'
          }
        />
      )}

      {/* Room Types Section */}
      <Box 
        id="rooms-section"
        sx={{ 
          backgroundColor: '#f8fafc',
          pb: { xs: 5, md: 7 }
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
