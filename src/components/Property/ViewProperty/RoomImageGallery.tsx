import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Image as ImageIcon,
} from '@mui/icons-material';

interface RoomImageGalleryProps {
  images: string[];
  roomName: string;
  height?: number;
}

export const RoomImageGallery: React.FC<RoomImageGalleryProps> = ({
  images,
  roomName,
  height = 400,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box sx={{ position: 'relative', height, bgcolor: '#f5f5f5' }}>
      {images.length > 0 ? (
        <>
          <img
            src={images[currentImageIndex]}
            alt={`${roomName} - Image ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <IconButton
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                }}
                onClick={handlePrevImage}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                }}
                onClick={handleNextImage}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}

          {/* Image Counter */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: '0.875rem'
            }}
          >
            {currentImageIndex + 1} / {images.length}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
            color: 'text.secondary'
          }}
        >
          <ImageIcon sx={{ fontSize: 64, mb: 1 }} />
          <Typography>No images available</Typography>
        </Box>
      )}

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            display: 'flex',
            gap: 1,
            maxWidth: 'calc(100% - 120px)',
            overflowX: 'auto'
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              sx={{
                width: 50,
                height: 50,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: currentImageIndex === index ? '2px solid white' : '2px solid transparent',
                flexShrink: 0
              }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
