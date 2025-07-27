import React, { useState } from 'react';
import { Paper, Box, Typography, ToggleButtonGroup, ToggleButton, Chip, CircularProgress } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Colors } from '../../constants';

interface ForecastData {
  date: string;
  actual: number;
  predicted: number;
  lowerBound?: number;
  upperBound?: number;
}

interface ForecastingCardProps {
  occupancyForecast: ForecastData[];
  earningsForecast: ForecastData[];
  confidenceLevel: number;
  lastUpdated: string;
}

export default function AIForecastingCard({ 
  occupancyForecast, 
  earningsForecast,
  confidenceLevel,
  lastUpdated
}: ForecastingCardProps) {
  const [forecastType, setForecastType] = useState<string>('occupancy');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const handleForecastTypeChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
    if (newType !== null) {
      setForecastType(newType);
    }
  };
  
  const refreshForecast = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  
  const currentData = forecastType === 'occupancy' ? occupancyForecast : earningsForecast;
  
  // Find where actual data ends and predictions begin
  const predictionStartIndex = currentData.findIndex(item => item.predicted && !item.actual);
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <PsychologyIcon sx={{ color: Colors.blue, fontSize: 24 }} />
          <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
            AI Forecasting
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Chip 
            label={`${confidenceLevel}% Confidence`} 
            size="small" 
            color="primary"
            sx={{ fontWeight: 500 }}
          />
          <Chip 
            label={isRefreshing ? "Refreshing..." : "Refresh"} 
            size="small" 
            icon={isRefreshing ? <CircularProgress size={12} /> : undefined}
            onClick={refreshForecast}
            disabled={isRefreshing}
          />
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          size="small"
          value={forecastType}
          exclusive
          onChange={handleForecastTypeChange}
          aria-label="forecast type"
          sx={{ 
            width: '100%',
            '& .MuiToggleButton-root': { 
              py: 0.5, 
              px: 1.5, 
              textTransform: 'none',
              fontSize: '0.8rem',
              flex: 1
            },
            '& .Mui-selected': {
              backgroundColor: `${Colors.blue}15 !important`,
              color: Colors.blue,
              fontWeight: 600
            }
          }}
        >
          <ToggleButton value="occupancy" aria-label="occupancy">
            Occupancy Forecast
          </ToggleButton>
          <ToggleButton value="earnings" aria-label="earnings">
            Earnings Forecast
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {predictionStartIndex > 0 && (
              <ReferenceLine x={currentData[predictionStartIndex].date} stroke="#888" strokeDasharray="3 3" label="Forecast Start" />
            )}
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke={Colors.blue} 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#ff9800" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Predicted"
            />
            <Line 
              type="monotone" 
              dataKey="upperBound" 
              stroke="#f5f5f5" 
              strokeWidth={0}
              name="Upper Bound"
            />
            <Line 
              type="monotone" 
              dataKey="lowerBound" 
              stroke="#f5f5f5" 
              strokeWidth={0}
              name="Lower Bound"
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
        Last updated: {lastUpdated} • AI-powered forecast
      </Typography>
    </Paper>
  );
}