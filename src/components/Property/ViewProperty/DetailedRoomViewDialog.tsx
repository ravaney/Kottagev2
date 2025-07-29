import { LocalOffer, Close } from "@mui/icons-material";
import { Dialog, AppBar, Toolbar, Typography, Chip, IconButton, DialogContent, DialogActions, Button } from "@mui/material";
import {  Box } from "@mui/system";
import { calculatePromotionalPrice } from "../../../utils/promotionUtils";
import { ContactHostButton } from "../../Chat";
import { Colors } from "../../constants";
import { PromotionBanner } from "./PromotionBanner";
import { RoomAmenities } from "./RoomAmenities";
import { RoomImageGallery } from "./RoomImageGallery";
import { RoomPricingDisplay } from "./RoomPricingDisplay";
import { RoomStats } from "./RoomStats";
import { RoomType, Kottage } from "../../../hooks";
import Grid from '@mui/material/GridLegacy';
import { useNavigate } from "react-router-dom";

 export const DetailedRoomView = (
    { detailedRoomView, setDetailedRoomView, kottage, guests, checkInDate, checkOutDate }: {
        detailedRoomView: RoomType | null;
        setDetailedRoomView: (room: RoomType | null) => void;
        kottage?: Kottage;
        guests?: number;
        checkInDate?: Date;
        checkOutDate?: Date;
    }
 ) => {
     const navigate = useNavigate();
    if (!detailedRoomView) return null;

    const roomImages = detailedRoomView.images || [];
    const promotion = calculatePromotionalPrice(detailedRoomView, undefined, undefined, undefined, kottage?.promotions);

    return (
      <Dialog
        open={Boolean(detailedRoomView)}
        onClose={() => setDetailedRoomView(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
            overflow: 'hidden'
          }
        }}
      >
        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: Colors.blue }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              {detailedRoomView.name}
            </Typography>
            {promotion.isPromotionApplied && (
              <Chip
                icon={<LocalOffer />}
                label={`${promotion.isPromotionApplied ? 'SPECIAL OFFER' : ''}`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  mr: 1
                }}
              />
            )}
            <IconButton color="inherit" onClick={() => setDetailedRoomView(null)}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent sx={{ p: 0 }}>
          <Grid container sx={{ height: '100%' }}>
            {/* Left Side - Image Gallery */}
            <Grid item xs={12} md={7}>
              <RoomImageGallery 
                images={roomImages}
                roomName={detailedRoomView.name}
                height={400}
              />
            </Grid>

            {/* Right Side - Room Details */}
            <Grid item xs={12} md={5}>
              <Box sx={{ p: 3, height: 400, overflowY: 'auto' }}>
                {/* Pricing Section */}
                <RoomPricingDisplay 
                  room={detailedRoomView}
                  promotions={kottage?.promotions}
                  variant="detailed"
                />

                {/* Promotion Details */}
                <PromotionBanner 
                  room={detailedRoomView}
                  kottage={kottage}
                />

                {/* Room Stats */}
                <RoomStats 
                  room={detailedRoomView}
                  showAvailability={true}
                  variant="horizontal"
                />

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: Colors.blue }}>
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {detailedRoomView.description || 'Comfortable and well-appointed room with modern amenities designed to provide you with a relaxing and enjoyable stay.'}
                  </Typography>
                </Box>

                {/* Amenities */}
                <RoomAmenities 
                  amenities={detailedRoomView.amenities || []}
                  title="Room Amenities"
                  variant="grid"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Footer Actions */}
        <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', justifyContent: 'space-between' }}>
          {kottage?.ownerId && (
            <ContactHostButton 
              hostId={kottage.ownerId}
              hostName={kottage.name || 'Property Host'}
              propertyId={kottage.id}
              propertyName={kottage.name}
              variant="outlined"
            />
          )}
          {(() => {
            const canAccommodateGuests = !guests || guests <= detailedRoomView.maxOccupancy;
            
            return (
              <Button
                variant="contained"
                disabled={!canAccommodateGuests}
                onClick={() => {
                  setDetailedRoomView(null);
                  navigate('/book-room', { 
                    state: { 
                      kottage, 
                      room: detailedRoomView,
                      checkInDate,
                      checkOutDate,
                      guests 
                    } 
                  });
                }}
                sx={{
                  background: canAccommodateGuests 
                    ? `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`
                    : '#e0e0e0',
                  color: canAccommodateGuests ? 'white' : '#9e9e9e',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  cursor: canAccommodateGuests ? 'pointer' : 'not-allowed',
                  '&:hover': canAccommodateGuests ? {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  } : {}
                }}
              >
                {canAccommodateGuests ? 'Book Now' : 'Too Many Guests'}
              </Button>
            );
          })()}
        </DialogActions>
      </Dialog>
    );
  };