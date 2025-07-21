import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Tab,
  Tabs,
  Badge
} from '@mui/material';
import {
  RateReview as ReviewIcon,
  NavigateNext as NavigateNextIcon,
  Notifications as NotificationsIcon,
  Flag as FlagIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as ApproveIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: number;
  propertyName: string;
  guestName: string;
  hostName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'flagged' | 'removed';
  flags: string[];
  type: 'guest-review' | 'host-review';
}

// Mock data for reviews
const mockReviews: Review[] = [
  {
    id: 1,
    propertyName: 'Sunset Villa',
    guestName: 'John Smith',
    hostName: 'Sarah Johnson',
    rating: 1,
    comment: 'Absolutely terrible place! The host was rude and the property was dirty. This is fake and I want my money back immediately!',
    date: '2024-01-15',
    status: 'flagged',
    flags: ['Inappropriate language', 'Fake review'],
    type: 'guest-review'
  },
  {
    id: 2,
    propertyName: 'Mountain Cabin',
    guestName: 'Emily Davis',
    hostName: 'Mike Wilson',
    rating: 5,
    comment: 'Amazing stay! The cabin was clean, cozy, and had everything we needed. Mike was a wonderful host.',
    date: '2024-01-14',
    status: 'pending',
    flags: [],
    type: 'guest-review'
  },
  {
    id: 3,
    propertyName: 'Beach House',
    guestName: 'Alex Turner',
    hostName: 'Lisa Chen',
    rating: 2,
    comment: 'Guest was extremely disrespectful and left the place in terrible condition. Would not recommend.',
    date: '2024-01-13',
    status: 'flagged',
    flags: ['Potential retaliation'],
    type: 'host-review'
  },
  {
    id: 4,
    propertyName: 'City Loft',
    guestName: 'Maria Garcia',
    hostName: 'Tom Anderson',
    rating: 4,
    comment: 'Great location and clean apartment. Tom was responsive and helpful throughout our stay.',
    date: '2024-01-12',
    status: 'approved',
    flags: [],
    type: 'guest-review'
  }
];

export default function ReviewModeration() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return '#4caf50';
      case 'flagged': return '#f44336';
      case 'removed': return '#757575';
      case 'pending': return '#ff9800';
      default: return '#1976d2';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'approved': return 'Approved';
      case 'flagged': return 'Flagged';
      case 'removed': return 'Removed';
      case 'pending': return 'Pending Review';
      default: return status;
    }
  };

  const filteredReviews = () => {
    switch(currentTab) {
      case 0: return mockReviews.filter(r => r.status === 'pending');
      case 1: return mockReviews.filter(r => r.status === 'flagged');
      case 2: return mockReviews.filter(r => r.status === 'approved');
      case 3: return mockReviews.filter(r => r.status === 'removed');
      default: return mockReviews;
    }
  };

  const handleApproveReview = (reviewId: number) => {
    console.log('Approving review:', reviewId);
    // Update review status logic here
  };

  const handleRemoveReview = (reviewId: number) => {
    console.log('Removing review:', reviewId);
    // Remove review logic here
  };

  const handleReplyToReview = (review: Review) => {
    setSelectedReview(review);
    setReplyDialogOpen(true);
  };

  const handleSendReply = () => {
    console.log('Sending reply:', replyText, 'to review:', selectedReview?.id);
    setReplyDialogOpen(false);
    setReplyText('');
    setSelectedReview(null);
  };

  const tabCounts = {
    pending: mockReviews.filter(r => r.status === 'pending').length,
    flagged: mockReviews.filter(r => r.status === 'flagged').length,
    approved: mockReviews.filter(r => r.status === 'approved').length,
    removed: mockReviews.filter(r => r.status === 'removed').length
  };

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Button 
                color="inherit" 
                onClick={() => navigate('/dashboard')}
                sx={{ textTransform: 'none', fontWeight: 400 }}
              >
                Dashboard
              </Button>
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                <ReviewIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Review Moderation
              </Typography>
            </Breadcrumbs>
          </Box>
          <IconButton color="inherit" size="small">
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {/* Header */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Review Moderation
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Monitor and moderate guest and host reviews to maintain platform integrity
          </Typography>
        </Paper>

        {/* Review Tabs */}
        <Paper sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.pending} color="warning">
                    Pending Reviews
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.flagged} color="error">
                    Flagged Reviews
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.approved} color="success">
                    Approved Reviews
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.removed} color="default">
                    Removed Reviews
                  </Badge>
                } 
              />
            </Tabs>
          </Box>

          {/* Reviews List */}
          <List sx={{ p: 0 }}>
            {filteredReviews().map((review, index) => (
              <React.Fragment key={review.id}>
                <ListItem alignItems="flex-start" sx={{ px: 3, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: review.type === 'guest-review' ? '#1976d2' : '#9c27b0' }}>
                      {review.type === 'guest-review' ? review.guestName[0] : review.hostName[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {review.propertyName}
                        </Typography>
                        <Chip 
                          label={review.type === 'guest-review' ? 'Guest Review' : 'Host Review'}
                          size="small"
                          color={review.type === 'guest-review' ? 'primary' : 'secondary'}
                        />
                        <Chip 
                          label={getStatusLabel(review.status)}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getStatusColor(review.status)}15`,
                            color: getStatusColor(review.status)
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            {review.type === 'guest-review' 
                              ? `By: ${review.guestName} • Host: ${review.hostName}` 
                              : `By: ${review.hostName} • Guest: ${review.guestName}`}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly />
                          <Typography variant="caption" color="textSecondary">
                            {review.date}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {review.comment}
                        </Typography>
                        {review.flags.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                            {review.flags.map((flag, idx) => (
                              <Chip 
                                key={idx}
                                label={flag}
                                size="small"
                                icon={<FlagIcon />}
                                color="error"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          {review.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleApproveReview(review.id)}
                                sx={{ color: '#4caf50' }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                startIcon={<BlockIcon />}
                                onClick={() => handleRemoveReview(review.id)}
                                sx={{ color: '#f44336' }}
                              >
                                Remove
                              </Button>
                            </>
                          )}
                          {review.status === 'flagged' && (
                            <>
                              <Button
                                size="small"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleApproveReview(review.id)}
                                sx={{ color: '#4caf50' }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleRemoveReview(review.id)}
                                sx={{ color: '#f44336' }}
                              >
                                Remove
                              </Button>
                            </>
                          )}
                          <Button
                            size="small"
                            startIcon={<ReplyIcon />}
                            onClick={() => handleReplyToReview(review)}
                            sx={{ color: '#1976d2' }}
                          >
                            Reply as Platform
                          </Button>
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            sx={{ color: '#757575' }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredReviews().length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Reply as Platform - {selectedReview?.propertyName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Original Review: "{selectedReview?.comment}"
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Type your platform response here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendReply} variant="contained">Send Reply</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
