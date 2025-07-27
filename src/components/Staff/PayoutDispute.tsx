import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  Tab,
  Tabs,
  Badge,
  Alert,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import Grid from "@mui/material/GridLegacy"
import {
  Payment as PaymentIcon,
  NavigateNext as NavigateNextIcon,
  Notifications as NotificationsIcon,
  AccountBalance as BankIcon,
  Gavel as DisputeIcon,
  MonetizationOn as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  TrendingUp as EscalateIcon,
  Refresh as RefundIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PayoutIssue {
  id: number;
  type: 'payout-delay' | 'banking-issue' | 'dispute' | 'chargeback' | 'refund-request';
  hostName: string;
  propertyName: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  details: any;
}

// Mock data for payout issues
const mockPayoutIssues: PayoutIssue[] = [
  {
    id: 1,
    type: 'payout-delay',
    hostName: 'Sarah Johnson',
    propertyName: 'Sunset Villa',
    amount: 1250.00,
    currency: 'USD',
    description: 'Payout has been delayed for 5 days, host is requesting immediate resolution',
    date: '2024-01-15',
    status: 'pending',
    priority: 'high',
    details: {
      bookingId: 'BK123456',
      originalPayoutDate: '2024-01-10',
      bankAccount: '**** **** **** 1234',
      delayReason: 'Bank verification required'
    }
  },
  {
    id: 2,
    type: 'banking-issue',
    hostName: 'Mike Wilson',
    propertyName: 'Mountain Cabin',
    amount: 850.00,
    currency: 'USD',
    description: 'Bank account details are invalid, payout failed multiple times',
    date: '2024-01-14',
    status: 'in-progress',
    priority: 'medium',
    details: {
      bookingId: 'BK123457',
      attemptCount: 3,
      lastAttempt: '2024-01-13',
      bankError: 'Invalid routing number'
    }
  },
  {
    id: 3,
    type: 'dispute',
    hostName: 'Lisa Chen',
    propertyName: 'Beach House',
    amount: 2100.00,
    currency: 'USD',
    description: 'Guest is disputing charges, claiming property was not as described',
    date: '2024-01-13',
    status: 'escalated',
    priority: 'urgent',
    details: {
      bookingId: 'BK123458',
      guestName: 'Alex Turner',
      disputeReason: 'Property not as described',
      evidence: ['Photos', 'Messages']
    }
  },
  {
    id: 4,
    type: 'chargeback',
    hostName: 'Tom Anderson',
    propertyName: 'City Loft',
    amount: 650.00,
    currency: 'USD',
    description: 'Credit card chargeback initiated by guest, need to provide evidence',
    date: '2024-01-12',
    status: 'pending',
    priority: 'high',
    details: {
      bookingId: 'BK123459',
      chargebackCode: 'CB001',
      deadline: '2024-01-20',
      requiredEvidence: ['Booking confirmation', 'Property photos', 'Communication logs']
    }
  },
  {
    id: 5,
    type: 'refund-request',
    hostName: 'Emma Davis',
    propertyName: 'Country Cottage',
    amount: 450.00,
    currency: 'USD',
    description: 'Guest requesting partial refund due to late check-in caused by host',
    date: '2024-01-11',
    status: 'resolved',
    priority: 'medium',
    details: {
      bookingId: 'BK123460',
      refundAmount: 225.00,
      refundReason: 'Host caused delay',
      resolution: 'Partial refund approved'
    }
  }
];

export default function PayoutDispute() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState<PayoutIssue | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'resolved': return '#4caf50';
      case 'in-progress': return '#ff9800';
      case 'escalated': return '#f44336';
      case 'pending': return '#2196f3';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#1976d2';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'payout-delay': return <MoneyIcon />;
      case 'banking-issue': return <BankIcon />;
      case 'dispute': return <DisputeIcon />;
      case 'chargeback': return <WarningIcon />;
      case 'refund-request': return <RefundIcon />;
      default: return <PaymentIcon />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'payout-delay': return 'Payout Delay';
      case 'banking-issue': return 'Banking Issue';
      case 'dispute': return 'Payment Dispute';
      case 'chargeback': return 'Chargeback';
      case 'refund-request': return 'Refund Request';
      default: return type;
    }
  };

  const filteredIssues = () => {
    switch(currentTab) {
      case 0: return mockPayoutIssues.filter(issue => issue.status === 'pending');
      case 1: return mockPayoutIssues.filter(issue => issue.status === 'in-progress');
      case 2: return mockPayoutIssues.filter(issue => issue.status === 'escalated');
      case 3: return mockPayoutIssues.filter(issue => issue.status === 'resolved');
      default: return mockPayoutIssues;
    }
  };

  const handleTakeAction = (issue: PayoutIssue, action: string) => {
    setSelectedIssue(issue);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleSaveAction = () => {
    console.log('Saving action:', actionType, 'for issue:', selectedIssue?.id);
    console.log('Notes:', actionNotes);
    if (actionType === 'refund') {
      console.log('Refund amount:', refundAmount);
    }
    setActionDialogOpen(false);
    setActionNotes('');
    setRefundAmount('');
    setSelectedIssue(null);
    setActionType('');
  };

  const tabCounts = {
    pending: mockPayoutIssues.filter(issue => issue.status === 'pending').length,
    inProgress: mockPayoutIssues.filter(issue => issue.status === 'in-progress').length,
    escalated: mockPayoutIssues.filter(issue => issue.status === 'escalated').length,
    resolved: mockPayoutIssues.filter(issue => issue.status === 'resolved').length
  };

  // Stats for the dashboard
  const stats = {
    totalIssues: mockPayoutIssues.length,
    urgentIssues: mockPayoutIssues.filter(issue => issue.priority === 'urgent').length,
    totalAmount: mockPayoutIssues.reduce((sum, issue) => sum + issue.amount, 0),
    avgResolutionTime: '2.5 days'
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
                <PaymentIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Payout & Dispute Handling
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
            Payout & Dispute Handling
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Manage host payouts, resolve payment disputes, and handle chargebacks
          </Typography>
          
          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight={600}>
                    {stats.totalIssues}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Issues
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" color="error" fontWeight={600}>
                    {stats.urgentIssues}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Urgent Issues
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight={600}>
                    ${stats.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" color="info.main" fontWeight={600}>
                    {stats.avgResolutionTime}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Resolution Time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Issue Tabs */}
        <Paper sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.pending} color="primary">
                    Pending
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.inProgress} color="warning">
                    In Progress
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.escalated} color="error">
                    Escalated
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.resolved} color="success">
                    Resolved
                  </Badge>
                } 
              />
            </Tabs>
          </Box>

          {/* Issues List */}
          <List sx={{ p: 0 }}>
            {filteredIssues().map((issue, index) => (
              <React.Fragment key={issue.id}>
                <ListItem alignItems="flex-start" sx={{ px: 3, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: getPriorityColor(issue.priority) }}>
                      {getTypeIcon(issue.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {getTypeLabel(issue.type)} - {issue.propertyName}
                        </Typography>
                        <Chip 
                          label={`$${issue.amount.toLocaleString()} ${issue.currency}`}
                          size="small"
                          color="success"
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip 
                          label={issue.priority.toUpperCase()}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getPriorityColor(issue.priority)}15`,
                            color: getPriorityColor(issue.priority),
                            fontWeight: 600
                          }}
                        />
                        <Chip 
                          label={issue.status.toUpperCase()}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getStatusColor(issue.status)}15`,
                            color: getStatusColor(issue.status)
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          Host: {issue.hostName} • Date: {issue.date}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {issue.description}
                        </Typography>
                        
                        {/* Issue-specific details */}
                        {issue.type === 'payout-delay' && (
                          <Alert severity="warning" sx={{ my: 1 }}>
                            Original payout date: {issue.details.originalPayoutDate} • 
                            Reason: {issue.details.delayReason}
                          </Alert>
                        )}
                        
                        {issue.type === 'banking-issue' && (
                          <Alert severity="error" sx={{ my: 1 }}>
                            Failed attempts: {issue.details.attemptCount} • 
                            Error: {issue.details.bankError}
                          </Alert>
                        )}
                        
                        {issue.type === 'chargeback' && (
                          <Alert severity="warning" sx={{ my: 1 }}>
                            Deadline: {issue.details.deadline} • 
                            Required: {issue.details.requiredEvidence.join(', ')}
                          </Alert>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                          {issue.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                startIcon={<SendIcon />}
                                onClick={() => handleTakeAction(issue, 'resolve')}
                                sx={{ color: '#4caf50' }}
                              >
                                Resolve
                              </Button>
                              <Button
                                size="small"
                                startIcon={<RefundIcon />}
                                onClick={() => handleTakeAction(issue, 'refund')}
                                sx={{ color: '#2196f3' }}
                              >
                                Process Refund
                              </Button>
                              <Button
                                size="small"
                                startIcon={<EscalateIcon />}
                                onClick={() => handleTakeAction(issue, 'escalate')}
                                sx={{ color: '#f44336' }}
                              >
                                Escalate
                              </Button>
                            </>
                          )}
                          
                          {issue.status === 'in-progress' && (
                            <>
                              <Button
                                size="small"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleTakeAction(issue, 'complete')}
                                sx={{ color: '#4caf50' }}
                              >
                                Complete
                              </Button>
                              <Button
                                size="small"
                                startIcon={<RefundIcon />}
                                onClick={() => handleTakeAction(issue, 'refund')}
                                sx={{ color: '#2196f3' }}
                              >
                                Process Refund
                              </Button>
                            </>
                          )}
                          
                          <Button
                            size="small"
                            startIcon={<BankIcon />}
                            sx={{ color: '#ff9800' }}
                          >
                            Contact Host
                          </Button>
                          
                          <Button
                            size="small"
                            onClick={() => handleTakeAction(issue, 'notes')}
                            sx={{ color: '#757575' }}
                          >
                            Add Notes
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredIssues().length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {actionType === 'refund' ? 'Process Refund' : 
           actionType === 'escalate' ? 'Escalate Issue' :
           actionType === 'resolve' ? 'Resolve Issue' :
           'Add Notes'} - {selectedIssue?.propertyName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Issue: {selectedIssue?.description}
          </Typography>
          
          {actionType === 'refund' && (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Refund Amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder={`Max: $${selectedIssue?.amount}`}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Refund Reason</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="host-fault">Host Fault</MenuItem>
                  <MenuItem value="property-issue">Property Issue</MenuItem>
                  <MenuItem value="booking-error">Booking Error</MenuItem>
                  <MenuItem value="dispute-resolution">Dispute Resolution</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={
              actionType === 'refund' ? 'Enter refund justification and notes...' :
              actionType === 'escalate' ? 'Enter escalation reason and manager notes...' :
              'Enter resolution details and actions taken...'
            }
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveAction} 
            variant="contained"
            color={actionType === 'refund' ? 'primary' : actionType === 'escalate' ? 'error' : 'success'}
          >
            {actionType === 'refund' ? 'Process Refund' :
             actionType === 'escalate' ? 'Escalate to Manager' :
             'Save Action'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
