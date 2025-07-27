import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Avatar,
  CircularProgress
} from '@mui/material';
import Grid from "@mui/material/GridLegacy";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import ClockIcon from '@mui/icons-material/AccessTime';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useAllProperties, useUpdateApprovalStatus } from '../../hooks/propertyHooks';

const rejectionReasons = [
  'Incomplete documentation',
  'Invalid property deed',
  'Missing business license',
  'Poor quality photos',
  'Inaccurate property description',
  'Safety concerns',
  'Zoning violations',
  'Other'
];

export default function PropertyVerification() {
  const { data: properties = [], isLoading, error } = useAllProperties();
  const updateApprovalStatus = useUpdateApprovalStatus();
  const navigate = useNavigate();
    console.log('PropertyVerification - properties:', properties);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPropertyData, setSelectedPropertyData] = useState<any>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');

  // Transform real property data to verification request format
  const transformPropertyToVerificationRequest = (property: any) => {
    const documentTypes = property.approval?.documents || [];
    return {
      id: property.id || `VR-${Date.now()}`,
      propertyName: property.name || 'Unnamed Property',
      host: property.host?.name ? property.host.name : 'Property Host',
      hostAvatar: property.host?.avatar || '/api/placeholder/40/40',
      submittedDate: property.createdAt ? new Date(property.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      location: property.address ? `${property.address.city}, ${property.address.state}` : 'Location Not Specified',
      propertyType: property.propertyType || 'Property',
      status: property.approval?.status || 'pending',
      priority: property.approval?.priority || 'medium',
      documents: {
        propertyDeed: documentTypes.find((doc: any) => doc.type === 'title_deed')?.url || null,
        businessLicense: documentTypes.find((doc: any) => doc.type === 'lease_agreement')?.url || null,
        photos: Array.isArray(property.images) ? property.images : [],
        floorPlan: documentTypes.find((doc: any) => doc.type === 'other')?.url || null
      },
      description: property.description || 'No description provided',
      amenities: property.amenities || [],
      pricePerNight: property.price || (property.roomTypes && property.roomTypes[0]?.pricePerNight) || 0,
      issues: property.approval?.issues || null
    };
  };

  // Transform properties to verification requests with memoization
  const verificationRequests = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    return properties.map(transformPropertyToVerificationRequest);
  }, [properties]);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading verification requests...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', m: 3 }}>
        <WarningIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Properties
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message || 'Unable to load property verification data'}
        </Typography>
      </Paper>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, propertyId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProperty(propertyId);
    
    // Debug: Log the property structure
    const property = properties.find(p => p.id === propertyId);
    console.log('Selected property for action:', {
      id: propertyId,
      property: property,
      approvalStatus: property?.approval,
      hasApproval: !!property?.approval
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedProperty here - it's needed for the dialogs
  };

  const handleViewProperty = (property: any) => {
    // Find the original property data from the properties array
    const originalProperty = properties.find(p => p.id === property.id);
    setSelectedPropertyData(originalProperty || property);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleApprove = () => {
    setApprovalDialogOpen(true);
    handleMenuClose();
  };

  const handleReject = () => {
    setRejectionDialogOpen(true);
    handleMenuClose();
  };

  const handleMoveToReview = async () => {
    if (!selectedProperty) return;
    
    try {
      await updateApprovalStatus.mutateAsync({
        propertyId: selectedProperty,
        status: 'under_review',
        reviewedBy: 'staff-user', // In production, get actual staff user ID
        notes: 'Property moved to review status'
      });
      
      handleMenuClose();
      setSelectedProperty(null);
    } catch (error) {
      console.error('Failed to move property to review:', error);
    }
  };

  const confirmApproval = async () => {
    if (!selectedProperty) return;
    
    try {
      console.log('Attempting to approve property:', selectedProperty);
      await updateApprovalStatus.mutateAsync({
        propertyId: selectedProperty,
        status: 'approved',
        reviewedBy: 'staff-user', // In production, get actual staff user ID
        notes: 'Property approved after verification'
      });
      
      console.log('Property approved successfully');
      setApprovalDialogOpen(false);
      setSelectedProperty(null);
      // Optionally show success message
    } catch (error) {
      console.error('Failed to approve property:', error);
      alert('Failed to approve property. Check console for details.');
      // Handle error (show error message)
    }
  };

  const confirmRejection = async () => {
    if (!selectedProperty || !rejectionReason) return;
    
    try {
      console.log('Attempting to reject property:', selectedProperty, 'with reason:', rejectionReason);
      await updateApprovalStatus.mutateAsync({
        propertyId: selectedProperty,
        status: 'rejected',
        reviewedBy: 'staff-user', // In production, get actual staff user ID
        rejectionReason: rejectionReason,
        notes: rejectionNotes
      });
      
      console.log('Property rejected successfully');
      setRejectionDialogOpen(false);
      setSelectedProperty(null);
      setRejectionReason('');
      setRejectionNotes('');
      // Optionally show success message
    } catch (error) {
      console.error('Failed to reject property:', error);
      alert('Failed to reject property. Check console for details.');
      // Handle error (show error message)
    }
  };

  // Filter verification requests based on tab and search
  const getFilteredRequests = () => {
    let filtered = verificationRequests;
    
    // Filter by status based on tab
    switch (tabValue) {
      case 0: // All
        break;
      case 1: // Pending
        filtered = filtered.filter(req => req.status === 'pending');
        break;
      case 2: // Under Review
        filtered = filtered.filter(req => req.status === 'under_review');
        break;
      case 3: // Approved
        filtered = filtered.filter(req => req.status === 'approved');
        break;
      case 4: // Rejected
        filtered = filtered.filter(req => req.status === 'rejected');
        break;
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'under_review':
        return 'info';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon sx={{ fontSize: 16 }} />;
      case 'under_review':
        return <VisibilityIcon sx={{ fontSize: 16 }} />;
      case 'approved':
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'rejected':
        return <CancelIcon sx={{ fontSize: 16 }} />;
      default:
        return <ClockIcon sx={{ fontSize: 16 }} />;
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredRequests = getFilteredRequests();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
        <Toolbar sx={{ px: 0 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link 
                color="inherit" 
                href="#" 
                onClick={() => navigate('/staff')}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <DashboardIcon sx={{ mr: 0.5, fontSize: 20 }} />
                Staff Dashboard
              </Link>
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeWorkIcon sx={{ mr: 0.5, fontSize: 20 }} />
                Property Verification
              </Typography>
            </Breadcrumbs>
            <Typography variant="h4" component="h1" sx={{ mt: 1, fontWeight: 600 }}>
              Property Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and verify property listings submitted by hosts
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<NotificationsIcon />}
            sx={{ ml: 2 }}
          >
            View Notifications
          </Button>
        </Toolbar>
      </AppBar>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="warning.main">
              {verificationRequests.filter(r => r.status === 'pending').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Reviews
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="info.main">
              {verificationRequests.filter(r => r.status === 'under_review').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Under Review
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="success.main">
              {verificationRequests.filter(r => r.status === 'approved').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Approved Today
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="error.main">
              {verificationRequests.filter(r => r.status === 'rejected').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejected
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`All (${verificationRequests.length})`} />
            <Tab label={`Pending (${verificationRequests.filter(r => r.status === 'pending').length})`} />
            <Tab label={`Under Review (${verificationRequests.filter(r => r.status === 'under_review').length})`} />
            <Tab label={`Approved (${verificationRequests.filter(r => r.status === 'approved').length})`} />
            <Tab label={`Rejected (${verificationRequests.filter(r => r.status === 'rejected').length})`} />
          </Tabs>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
            >
              Filter
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Verification Requests Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={Array.isArray(request?.documents?.photos) && request.documents.photos.length > 0 
                          ? request.documents.photos[0] 
                          : '/api/placeholder/40/40'
                        }
                        sx={{ mr: 2, width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {request.propertyName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {request.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={request.hostAvatar} sx={{ mr: 1, width: 24, height: 24 }} />
                      <Typography variant="body2">{request.host}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{request.submittedDate}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{request.location}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{request.propertyType}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(request.status)}
                      label={formatStatus(request.status)}
                      color={getStatusColor(request.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.priority}
                      color={request.priority === 'high' ? 'error' : request.priority === 'medium' ? 'warning' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, request.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRequests.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No verification requests found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search criteria' : 'No properties match the current filter'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const property = verificationRequests.find(r => r.id === selectedProperty);
          if (property) handleViewProperty(property);
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMoveToReview}>
          <ListItemIcon>
            <ClockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to Review</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleApprove}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Approve</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleReject}>
          <ListItemIcon>
            <CancelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reject</ListItemText>
        </MenuItem>
      </Menu>

      {/* Property Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Property Details</Typography>
          <IconButton
            onClick={() => setViewDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPropertyData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedPropertyData.name || selectedPropertyData.propertyName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {selectedPropertyData.address 
                          ? `${selectedPropertyData.address.city}, ${selectedPropertyData.address.state}` 
                          : selectedPropertyData.location
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {selectedPropertyData.host?.name || selectedPropertyData.host}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {selectedPropertyData.description}
                    </Typography>
                    
                    {/* Additional Property Details */}
                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Property Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Property Type</Typography>
                          <Typography variant="body2">{selectedPropertyData.propertyType || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Max Guests</Typography>
                          <Typography variant="body2">{selectedPropertyData.maxGuests || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Bedrooms</Typography>
                          <Typography variant="body2">{selectedPropertyData.bedrooms || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Bathrooms</Typography>
                          <Typography variant="body2">{selectedPropertyData.bathrooms || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Price per Night</Typography>
                          <Typography variant="body2">
                            ${selectedPropertyData.price || 
                              (selectedPropertyData.roomTypes?.[0]?.pricePerNight) || 
                              'Not specified'} JMD
                          </Typography>
                        </Grid>
                        {selectedPropertyData.amenities && selectedPropertyData.amenities.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">Amenities</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {selectedPropertyData.amenities.map((amenity: string, index: number) => (
                                <Chip key={index} label={amenity} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Property Images
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedPropertyData.images && Array.isArray(selectedPropertyData.images) && 
                        selectedPropertyData.images.map((photo: string, index: number) => (
                        <Grid item xs={6} key={index}>
                          <img
                            src={photo}
                            alt={`Property ${index + 1}`}
                            style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }}
                          />
                        </Grid>
                      ))}
                      {(!selectedPropertyData.images || !Array.isArray(selectedPropertyData.images) || selectedPropertyData.images.length === 0) && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary" textAlign="center">
                            No images available
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Approval Documents Section */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Approval Documents
                    </Typography>
                    {selectedPropertyData.approval?.submittedDocuments && 
                     Object.keys(selectedPropertyData.approval.submittedDocuments).length > 0 ? (
                      <Grid container spacing={2}>
                        {Object.values(selectedPropertyData.approval.submittedDocuments).map((doc: any, index: number) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box sx={{ 
                              p: 2, 
                              border: '1px solid #e0e0e0', 
                              borderRadius: 2,
                              backgroundColor: '#f8f9fa'
                            }}>
                              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {doc.type === 'title_deed' && 'Title Deed'}
                                  {doc.type === 'utility_bill' && 'Utility Bill'}
                                  {doc.type === 'property_tax' && 'Property Tax Receipt'}
                                  {doc.type === 'lease_agreement' && 'Lease Agreement'}
                                  {doc.type === 'authorization_letter' && 'Authorization Letter'}
                                  {doc.type === 'other' && 'Other Document'}
                                  {!['title_deed', 'utility_bill', 'property_tax', 'lease_agreement', 'authorization_letter', 'other'].includes(doc.type) && doc.type}
                                </Typography>
                                <Chip 
                                  label={doc.status || 'pending'} 
                                  size="small" 
                                  color={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'error' : 'warning'}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {doc.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Unknown'}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => window.open(doc.url, '_blank')}
                                fullWidth
                                startIcon={<VisibilityIcon />}
                              >
                                View Document
                              </Button>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        No documents submitted yet
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onClose={() => {
        setApprovalDialogOpen(false);
        setSelectedProperty(null);
      }}>
        <DialogTitle>Approve Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve this property listing? This will make it visible to guests.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setApprovalDialogOpen(false);
            setSelectedProperty(null);
          }}>Cancel</Button>
          <Button 
            onClick={confirmApproval} 
            variant="contained" 
            color="success"
            disabled={updateApprovalStatus.isPending}
            startIcon={updateApprovalStatus.isPending ? <CircularProgress size={16} /> : <CheckCircleIcon />}
          >
            {updateApprovalStatus.isPending ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onClose={() => {
        setRejectionDialogOpen(false);
        setSelectedProperty(null);
        setRejectionReason('');
        setRejectionNotes('');
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Property</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Please select a reason for rejection and provide additional notes if needed.
          </Typography>
          <TextField
            select
            fullWidth
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            margin="normal"
          >
            {rejectionReasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Notes"
            value={rejectionNotes}
            onChange={(e) => setRejectionNotes(e.target.value)}
            margin="normal"
            placeholder="Provide specific feedback to help the host improve their listing..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setRejectionDialogOpen(false);
            setSelectedProperty(null);
            setRejectionReason('');
            setRejectionNotes('');
          }}>Cancel</Button>
          <Button 
            onClick={confirmRejection} 
            variant="contained" 
            color="error"
            disabled={!rejectionReason || updateApprovalStatus.isPending}
            startIcon={updateApprovalStatus.isPending ? <CircularProgress size={16} /> : <CancelIcon />}
          >
            {updateApprovalStatus.isPending ? 'Rejecting...' : 'Reject Property'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
