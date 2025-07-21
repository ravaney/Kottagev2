import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface FraudMetrics {
  totalBookings: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  criticalRisk: number;
  recentAlerts: Array<{
    id: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }>;
}

interface FraudMonitorProps {
  metrics: FraudMetrics;
}

export default function FraudMonitor({ metrics }: FraudMonitorProps) {
  const { totalBookings, lowRisk, mediumRisk, highRisk, criticalRisk, recentAlerts } = metrics;
  
  const riskPercentages = {
    low: (lowRisk / totalBookings) * 100,
    medium: (mediumRisk / totalBookings) * 100,
    high: (highRisk / totalBookings) * 100,
    critical: (criticalRisk / totalBookings) * 100
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ErrorIcon sx={{ color: '#d32f2f' }} />;
      case 'high': return <WarningIcon sx={{ color: '#f57c00' }} />;
      case 'medium': return <SecurityIcon sx={{ color: '#ff9800' }} />;
      case 'low': return <CheckCircleIcon sx={{ color: '#388e3c' }} />;
      default: return <SecurityIcon />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#ff9800';
      case 'low': return '#388e3c';
      default: return '#1976d2';
    }
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SecurityIcon sx={{ mr: 1, color: '#1976d2' }} />
        <Typography variant="h6" fontWeight={600}>
          Fraud Detection Monitor
        </Typography>
      </Box>

      {/* Risk Distribution */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Risk Distribution ({totalBookings} bookings)
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Low Risk</Typography>
              <Typography variant="body2">{lowRisk} ({riskPercentages.low.toFixed(1)}%)</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={riskPercentages.low} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { backgroundColor: '#388e3c' }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Medium Risk</Typography>
              <Typography variant="body2">{mediumRisk} ({riskPercentages.medium.toFixed(1)}%)</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={riskPercentages.medium} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">High Risk</Typography>
              <Typography variant="body2">{highRisk} ({riskPercentages.high.toFixed(1)}%)</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={riskPercentages.high} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { backgroundColor: '#f57c00' }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Critical Risk</Typography>
              <Typography variant="body2">{criticalRisk} ({riskPercentages.critical.toFixed(1)}%)</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={riskPercentages.critical} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { backgroundColor: '#d32f2f' }
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Recent Alerts
          </Typography>
          {recentAlerts.length > 0 ? (
            <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
              {recentAlerts.map((alert, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {getSeverityIcon(alert.severity)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {alert.message}
                        </Typography>
                        <Chip 
                          label={alert.severity}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getSeverityColor(alert.severity)}15`,
                            color: getSeverityColor(alert.severity),
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {alert.timestamp}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No recent alerts
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="#388e3c">
                {riskPercentages.low.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Safe Bookings
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="#f57c00">
                {(riskPercentages.high + riskPercentages.critical).toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Need Review
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="#d32f2f">
                {criticalRisk}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Critical Alerts
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="#1976d2">
                {recentAlerts.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Recent Alerts
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
