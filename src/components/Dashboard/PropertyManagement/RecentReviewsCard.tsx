import React, { useState } from 'react';
import { Paper, Box, Typography, Chip, Avatar, Rating, Button, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FlagIcon from '@mui/icons-material/Flag';
import { Colors } from '../../constants';

interface Review {
  id: string;
  guestName: string;
  guestAvatar?: string;
  propertyName: string;
  rating: number;
  comment: string;
  date: string;
  flagged: boolean;
  keywords?: string[];
}

interface RecentReviewsCardProps {
  reviews: Review[];
}

export default function RecentReviewsCard({ reviews }: RecentReviewsCardProps) {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  
  const toggleExpand = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };
  
  const isExpanded = (reviewId: string) => expandedReviews.includes(reviewId);
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon sx={{ color: Colors.blue, fontSize: 24 }} />
          <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
            Recent Reviews
          </Typography>
        </Box>
        <Chip 
          label={`${reviews.filter(r => r.flagged).length} Flagged`} 
          color="error" 
          size="small"
          sx={{ visibility: reviews.filter(r => r.flagged).length > 0 ? 'visible' : 'hidden' }}
        />
      </Box>
      
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {reviews.map((review, index) => (
          <Box key={review.id} sx={{ mb: 2 }}>
            {index > 0 && <Divider sx={{ my: 2 }} />}
            <Box display="flex" gap={1.5}>
              <Avatar 
                src={review.guestAvatar} 
                alt={review.guestName}
                sx={{ width: 40, height: 40 }}
              >
                {review.guestName.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {review.guestName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.propertyName} • {review.date}
                    </Typography>
                  </Box>
                  {review.flagged && (
                    <Chip 
                      icon={<FlagIcon sx={{ fontSize: 16 }} />} 
                      label="Flagged" 
                      size="small" 
                      color="error"
                      sx={{ height: 24 }}
                    />
                  )}
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} sx={{ my: 1 }}>
                  <Rating value={review.rating} precision={0.5} size="small" readOnly />
                  <Typography variant="body2" fontWeight={500}>
                    {review.rating.toFixed(1)}
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded(review.id) ? 'unset' : 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {review.comment}
                </Typography>
                
                {review.comment.length > 120 && (
                  <Button 
                    size="small" 
                    onClick={() => toggleExpand(review.id)}
                    sx={{ 
                      textTransform: 'none', 
                      p: 0, 
                      minWidth: 'auto', 
                      mt: 0.5,
                      color: Colors.blue,
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                  >
                    {isExpanded(review.id) ? 'Show less' : 'Read more'}
                  </Button>
                )}
                
                {review.keywords && review.keywords.length > 0 && (
                  <Box display="flex" gap={0.5} mt={1} flexWrap="wrap">
                    {review.keywords.map(keyword => (
                      <Chip 
                        key={keyword} 
                        label={keyword} 
                        size="small" 
                        sx={{ 
                          height: 20, 
                          fontSize: '0.65rem',
                          backgroundColor: '#ffebee',
                          color: '#d32f2f'
                        }} 
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      
      <Button 
        variant="text" 
        fullWidth 
        sx={{ mt: 1, color: Colors.blue }}
      >
        View All Reviews
      </Button>
    </Paper>
  );
}