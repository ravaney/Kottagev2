import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { Room } from '../../hooks/propertyHooks';
import { Colors } from '../constants';
import RoomIcon from '@mui/icons-material/Room';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

interface RoomConfigCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

export default function RoomConfigCard({ room, onEdit, onDelete }: RoomConfigCardProps) {
  return (
    <Card 
      sx={{ 
        height: 220, 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          borderColor: Colors.blue
        }
      }}
    >
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${Colors.blue}08 0%, ${Colors.raspberry}08 100%)`,
          p: 2,
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: 2, 
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <RoomIcon sx={{ color: Colors.blue, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                {room.type}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {room.count} room{room.count > 1 ? 's' : ''} available
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={0.5}>
            <IconButton 
              size="small" 
              onClick={() => onEdit(room)}
              sx={{ 
                backgroundColor: 'white',
                color: Colors.blue,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': { 
                  backgroundColor: Colors.blue,
                  color: 'white',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(room.id)}
              sx={{ 
                backgroundColor: 'white',
                color: 'error.main',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': { 
                  backgroundColor: 'error.main',
                  color: 'white',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{ 
              color: Colors.raspberry,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            ${room.price}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              /night
            </Typography>
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            flex: 1,
            height: 40,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4
          }}
        >
          {room.description || 'No description available'}
        </Typography>
        
       
      </CardContent>
    </Card>
  );
}