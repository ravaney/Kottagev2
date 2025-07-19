import React from 'react';
import { Paper, Box, Typography, Grid, Chip, Button, Divider } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Colors } from '../constants';

interface PayoutData {
  pending: number;
  processed: number;
  nextPayout: string;
  paymentMethods: {
    id: string;
    type: 'paypal' | 'stripe' | 'bank';
    name: string;
    isDefault: boolean;
  }[];
  recentPayouts: {
    id: string;
    amount: number;
    date: string;
    method: string;
    status: 'pending' | 'processed' | 'failed';
  }[];
}

interface PayoutSummaryCardProps {
  data: PayoutData;
}

export default function PayoutSummaryCard({ data }: PayoutSummaryCardProps) {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <PaymentsIcon sx={{ color: Colors.blue, fontSize: 24 }} />
        <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
          Payout Summary
        </Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Pending
            </Typography>
            <Typography variant="h5" fontWeight={700} color={Colors.blue}>
              ${data.pending.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Next payout: {data.nextPayout}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Processed (30 days)
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#4caf50">
              ${data.processed.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All payouts complete
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Payment Methods
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {data.paymentMethods.map(method => (
            <Chip 
              key={method.id}
              icon={method.type === 'paypal' ? 
                <img src="/paypal-icon.png" width="16" height="16" alt="PayPal" style={{ marginLeft: 8 }} /> : 
                method.type === 'stripe' ? 
                <img src="/stripe-icon.png" width="16" height="16" alt="Stripe" style={{ marginLeft: 8 }} /> :
                <AccountBalanceIcon sx={{ fontSize: 16, marginLeft: 1 }} />
              }
              label={method.name}
              variant={method.isDefault ? "filled" : "outlined"}
              size="small"
              color={method.isDefault ? "primary" : "default"}
            />
          ))}
          <Chip 
            icon={<span>+</span>}
            label="Add Method"
            variant="outlined"
            size="small"
            onClick={() => {}}
          />
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Recent Payouts
        </Typography>
        {data.recentPayouts.map(payout => (
          <Box 
            key={payout.id}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 1,
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={500}>
                ${payout.amount.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {payout.date} • {payout.method}
              </Typography>
            </Box>
            <Chip 
              label={payout.status} 
              size="small"
              color={
                payout.status === 'processed' ? 'success' : 
                payout.status === 'pending' ? 'warning' : 'error'
              }
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
        ))}
      </Box>
      
      <Button 
        variant="text" 
        fullWidth 
        sx={{ mt: 2, color: Colors.blue }}
      >
        View All Transactions
      </Button>
    </Paper>
  );
}