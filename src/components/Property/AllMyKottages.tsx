import React from "react";
import { Kottage, useMyProperties } from "../../hooks/propertyHooks";
import PropertyCard from "../PropertyCard";
import { Stack } from "@fluentui/react";
import { Box, CircularProgress, Typography, Paper, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import ErrorIcon from '@mui/icons-material/Error';
import AddIcon from '@mui/icons-material/Add';
import { Colors } from "../constants";
import { useNavigate } from "react-router-dom";
type Props = {};

export const gap10 = { childrenGap: 10 };
export default function AllMyKottages({}: Props) {
  const { data: allMyProperties, isLoading, error } = useMyProperties();
  const navigate = useNavigate();


  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="300px"
        gap={2}
      >
        <CircularProgress size={60} sx={{ color: Colors.blue }} />
        <Typography variant="h6" color="text.secondary">
          Loading your properties...
        </Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          backgroundColor: '#ffebee',
          border: '1px solid #ffcdd2'
        }}
      >
        <ErrorIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Properties
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Paper>
    );
  }
  
  if (!allMyProperties || allMyProperties.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          backgroundColor: Colors.offWhite,
          border: `2px dashed ${Colors.blue}`,
          borderRadius: 3
        }}
      >
        <HomeIcon sx={{ fontSize: 80, color: Colors.blue, mb: 2 }} />
        <Typography variant="h5" color={Colors.blue} gutterBottom>
          No Properties Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start your hosting journey by adding your first property!
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/MyAccount/MyKottages/AddKottage')}
          sx={{
            backgroundColor: Colors.blue,
            '&:hover': { backgroundColor: Colors.raspberry }
          }}
        >
          Add Your First Property
        </Button>
      </Paper>
    );
  }

  return (
    <Stack horizontal wrap tokens={gap10} style={{ padding: "10px" }}>
      {allMyProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </Stack>
  );
}
