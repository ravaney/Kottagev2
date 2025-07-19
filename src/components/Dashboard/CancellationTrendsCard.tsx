import React, { useState } from 'react';
import { Paper, Box, Typography, ToggleButtonGroup, ToggleButton, Tabs, Tab, Chip } from '@mui/material';
import { MdFreeCancellation } from 'react-icons/md';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Colors } from '../constants';

interface CancellationData {
  period: string;
  count: number;
  refundAmount: number;
}

interface CancellationReason {
  reason: string;
  count: number;
  percentage: number;
}

interface CancellationTiming {
  timing: string;
  count: number;
  percentage: number;
}

interface CancellationTrendsCardProps {
  monthlyData: CancellationData[];
  reasons: CancellationReason[];
  timings: CancellationTiming[];
  refundStats: {
    totalRefunded: number;
    partialRefunds: number;
    noRefunds: number;
    averageRefundPercentage: number;
  };
}

export default function CancellationTrendsCard({ 
  monthlyData, 
  reasons, 
  timings, 
  refundStats 
}: CancellationTrendsCardProps) {
  const [viewTab, setViewTab] = useState<number>(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setViewTab(newValue);
  };
  
  // Sort reasons by count
  const sortedReasons = [...reasons].sort((a, b) => b.count - a.count);
  
  // Prepare data for pie chart
  const reasonsChartData = sortedReasons.map(reason => ({
    name: reason.reason,
    value: reason.count
  }));
  
  const timingChartData = timings.map(timing => ({
    name: timing.timing,
    value: timing.count
  }));
  
  const COLORS = [Colors.blue, '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#607d8b'];
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <MdFreeCancellation style={{ color: Colors.raspberry, fontSize: 24 }} />
          <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
            Cancellation Trends
          </Typography>
        </Box>
        <Box>
          <Chip 
            label={`${refundStats.averageRefundPercentage}% Avg Refund`} 
            size="small" 
            color="error"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </Box>
      
      <Tabs 
        value={viewTab} 
        onChange={handleTabChange}
        sx={{ 
          mb: 2,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            minHeight: 36,
            py: 0
          }
        }}
      >
        <Tab label="Trends" />
        <Tab label="Reasons" />
        <Tab label="Timing" />
        <Tab label="Refunds" />
      </Tabs>
      
      {viewTab === 0 && (
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="count"
                fill={Colors.raspberry}
                name="Cancellations"
              />
              <Bar
                yAxisId="right"
                dataKey="refundAmount"
                fill="#f44336"
                name="Refund Amount ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
      
      {viewTab === 1 && (
        <Box sx={{ height: 300, display: 'flex' }}>
          <Box sx={{ width: '50%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reasonsChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {reasonsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} cancellations`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ width: '50%', height: '100%', overflow: 'auto' }}>
            {sortedReasons.map((reason, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1,
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <Typography variant="body2" sx={{ maxWidth: '60%' }}>
                  {reason.reason}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    {reason.percentage}%
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {reason.count}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {viewTab === 2 && (
        <Box sx={{ height: 300, display: 'flex' }}>
          <Box sx={{ width: '50%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timingChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {timingChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} cancellations`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ width: '50%', height: '100%', overflow: 'auto' }}>
            {timings.map((timing, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1,
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <Typography variant="body2">
                  {timing.timing}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    {timing.percentage}%
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {timing.count}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {viewTab === 3 && (
        <Box sx={{ height: 300 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffebee', borderRadius: 1, width: '30%' }}>
              <Typography variant="h5" fontWeight={700} color="#f44336">
                ${refundStats.totalRefunded.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Refunded
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff8e1', borderRadius: 1, width: '30%' }}>
              <Typography variant="h5" fontWeight={700} color="#ff9800">
                {refundStats.partialRefunds}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Partial Refunds
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e9', borderRadius: 1, width: '30%' }}>
              <Typography variant="h5" fontWeight={700} color="#4caf50">
                {refundStats.noRefunds}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                No Refunds
              </Typography>
            </Box>
          </Box>
          
          <ResponsiveContainer width="100%" height="60%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="refundAmount" fill="#f44336" name="Refund Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}