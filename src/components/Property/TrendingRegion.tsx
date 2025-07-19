import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Colors } from '../constants';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

interface RegionHighlight {
  id: string;
  name: string;
  image: string;
  description: string;
  type: 'attraction' | 'restaurant' | 'beach' | 'activity';
}

interface TrendingRegionProps {
  region: {
    name: string;
    image: string;
    description: string;
    highlights: RegionHighlight[];
  };
}

export default function TrendingRegion({ region }: TrendingRegionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const getChipColor = (type: string) => {
    switch (type) {
      case 'attraction': return { bg: '#e3f2fd', color: '#1976d2' };
      case 'restaurant': return { bg: '#fff8e1', color: '#ff8f00' };
      case 'beach': return { bg: '#e0f7fa', color: '#00acc1' };
      case 'activity': return { bg: '#f3e5f5', color: '#9c27b0' };
      default: return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'attraction': return 'Attraction';
      case 'restaurant': return 'Restaurant';
      case 'beach': return 'Beach';
      case 'activity': return 'Activity';
      default: return type;
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 4, 
        overflow: 'hidden',
        border: '1px solid #eaeaea',
        mb: 6
      }}
    >
      <Box sx={{ 
        p: { xs: 2, md: 4 },
        background: `linear-gradient(135deg, ${Colors.blue}10 0%, ${Colors.raspberry}10 100%)`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ color: Colors.raspberry, mr: 1, fontSize: 28 }} />
          <Typography variant="h4" fontWeight={700} color={Colors.blue}>
            Trending in {region.name}
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '800px' }}>
          {region.description}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={region.image}
              alt={region.name}
              sx={{
                width: '100%',
                height: { xs: 200, md: 300 },
                objectFit: 'cover',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} color={Colors.blue} sx={{ mb: 2 }}>
              Top Highlights
            </Typography>
            
            <Grid container spacing={2}>
              {region.highlights.map((highlight) => (
                <Grid item xs={12} sm={6} key={highlight.id}>
                  <Card sx={{ 
                    display: 'flex',
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 80 }}
                      image={highlight.image}
                      alt={highlight.name}
                    />
                    <CardContent sx={{ flex: '1 0 auto', p: 1.5 }}>
                      <Chip 
                        label={getTypeLabel(highlight.type)} 
                        size="small"
                        sx={{ 
                          mb: 0.5, 
                          backgroundColor: getChipColor(highlight.type).bg,
                          color: getChipColor(highlight.type).color,
                          fontSize: '0.7rem',
                          height: 20
                        }} 
                      />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {highlight.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(`/explore/${region.name.toLowerCase().replace(/\s+/g, '-')}`)}
              sx={{
                mt: 3,
                backgroundColor: Colors.raspberry,
                '&:hover': { backgroundColor: Colors.blue },
                borderRadius: 2,
                px: 3
              }}
            >
              Explore {region.name}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}