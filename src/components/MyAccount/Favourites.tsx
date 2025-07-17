import React from "react";
import PageHeader from '../common/PageHeader';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Colors } from '../constants';
import { Box } from '@mui/material';


export default function Favourites() {
  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader 
        title="Favourites"
        subtitle="Your saved properties and wishlist"
        icon={<FavoriteIcon sx={{ color: Colors.raspberry, fontSize: 32 }} />}
      />
      <Box sx={{mt:1}}>
        <div>Favourites Content</div>
      </Box>
    </Box>
  );
}
