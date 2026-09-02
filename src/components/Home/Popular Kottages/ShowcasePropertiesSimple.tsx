import { Box } from '@mui/system';
import React from 'react';
import { KottageWithId } from '../../../hooks/usePropertySearch';
import { Typography } from '@mui/material';
import { LocationPin } from '@mui/icons-material';

type SimpleProps = {
  kottage: KottageWithId;
};
export const ShowcasePropertiesSimple = ({ kottage }: SimpleProps) => {
  const { highlights = ['Sea views', 'Walk to beach', 'Island vibes'] } =
    kottage;
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid grey',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={kottage.images[0]}
          alt="villa anton"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minWidth: 0,
            overflow: 'hidden',
            p: 2.5,
            pl: 5,
            color: 'white',
            background:
              'linear-gradient(to top, rgba(7, 20, 33, 0.9) 0%, rgba(7, 20, 33, 0.55) 48%, transparent 78%)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
          }}
        >
          <Typography sx={{ color: 'inherit', fontSize: '14px' }}>
            BLU KOTTAGE COLLECTION
          </Typography>
          <Typography
            sx={{
              color: 'inherit',
              fontSize: '38px',
              lineHeight: 1.1,
              fontWeight: 400,
              margin: '6px 0',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            {kottage.name}
          </Typography>
          <Typography sx={{ color: 'inherit' }}>
            <LocationPin sx={{ color: 'inherit', fontSize: '14px' }} />{' '}
            {kottage.address.city + ', ' + kottage.address.country}
          </Typography>
          <Typography sx={{ color: 'inherit' }}>
            <span style={{ color: 'gold' }}>★</span> {kottage.rating} • 76
            reviews
          </Typography>
          <Typography
            sx={{
              color: 'inherit',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {highlights.join(' • ')}
          </Typography>
          <Typography sx={{ color: 'inherit', pt: 1 }}>
            <span>From</span> <strong>$550</strong> / night
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
