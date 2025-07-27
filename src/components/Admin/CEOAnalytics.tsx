import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  HomeWork as PropertyIcon,
  EventNote as BookingIcon,
  StarRate as StarIcon,
  Public as GlobalIcon,
  BusinessCenter as BusinessIcon,
  Analytics as AnalyticsIcon,
  Assessment as ReportIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

// Mock data for CEO analytics
const revenueData = [
  { month: 'Jan', revenue: 2800000, bookings: 1250, avgBookingValue: 2240 },
  { month: 'Feb', revenue: 3200000, bookings: 1380, avgBookingValue: 2319 },
  { month: 'Mar', revenue: 3800000, bookings: 1520, avgBookingValue: 2500 },
  { month: 'Apr', revenue: 4200000, bookings: 1680, avgBookingValue: 2500 },
  { month: 'May', revenue: 4800000, bookings: 1920, avgBookingValue: 2500 },
  { month: 'Jun', revenue: 5200000, bookings: 2080, avgBookingValue: 2500 },
  { month: 'Jul', revenue: 5600000, bookings: 2240, avgBookingValue: 2500 },
  { month: 'Aug', revenue: 5900000, bookings: 2360, avgBookingValue: 2500 },
  { month: 'Sep', revenue: 6200000, bookings: 2480, avgBookingValue: 2500 },
  { month: 'Oct', revenue: 6800000, bookings: 2720, avgBookingValue: 2500 },
  { month: 'Nov', revenue: 7200000, bookings: 2880, avgBookingValue: 2500 },
  { month: 'Dec', revenue: 7800000, bookings: 3120, avgBookingValue: 2500 }
];

const userGrowthData = [
  { month: 'Jan', hosts: 850, guests: 12500, totalUsers: 13350 },
  { month: 'Feb', hosts: 920, guests: 14200, totalUsers: 15120 },
  { month: 'Mar', hosts: 1050, guests: 16800, totalUsers: 17850 },
  { month: 'Apr', hosts: 1180, guests: 19200, totalUsers: 20380 },
  { month: 'May', hosts: 1320, guests: 22100, totalUsers: 23420 },
  { month: 'Jun', hosts: 1480, guests: 25300, totalUsers: 26780 },
  { month: 'Jul', hosts: 1650, guests: 28800, totalUsers: 30450 },
  { month: 'Aug', hosts: 1820, guests: 32500, totalUsers: 34320 },
  { month: 'Sep', hosts: 2000, guests: 36400, totalUsers: 38400 },
  { month: 'Oct', hosts: 2200, guests: 40800, totalUsers: 43000 },
  { month: 'Nov', hosts: 2420, guests: 45600, totalUsers: 48020 },
  { month: 'Dec', hosts: 2650, guests: 50800, totalUsers: 53450 }
];

const regionData = [
  { name: 'Kingston', value: 35, revenue: 2730000, properties: 420 },
  { name: 'Montego Bay', value: 28, revenue: 2184000, properties: 385 },
  { name: 'Ocho Rios', value: 15, revenue: 1170000, properties: 220 },
  { name: 'Negril', value: 12, revenue: 936000, properties: 180 },
  { name: 'Port Antonio', value: 6, revenue: 468000, properties: 95 },
  { name: 'Other', value: 4, revenue: 312000, properties: 85 }
];

const marketingROI = [
  { channel: 'Social Media', investment: 150000, revenue: 1800000, roi: 1200, conversions: 2400 },
  { channel: 'Google Ads', investment: 200000, revenue: 2800000, roi: 1400, conversions: 3200 },
  { channel: 'Influencer', investment: 100000, revenue: 1200000, roi: 1200, conversions: 1500 },
  { channel: 'Email Marketing', investment: 50000, revenue: 800000, roi: 1600, conversions: 1200 },
  { channel: 'SEO/Content', investment: 80000, revenue: 1400000, roi: 1750, conversions: 1800 },
  { channel: 'Partnerships', investment: 120000, revenue: 1600000, roi: 1333, conversions: 2000 }
];

const competitorAnalysis = [
  { competitor: 'Airbnb Jamaica', marketShare: 42, avgPrice: 185, properties: 1800, satisfaction: 4.2 },
  { competitor: 'Yaad Kottage', marketShare: 28, avgPrice: 225, properties: 1385, satisfaction: 4.6 },
  { competitor: 'VRBO Jamaica', marketShare: 18, avgPrice: 195, properties: 950, satisfaction: 4.1 },
  { competitor: 'Local Platforms', marketShare: 8, avgPrice: 165, properties: 420, satisfaction: 3.9 },
  { competitor: 'Others', marketShare: 4, avgPrice: 155, properties: 280, satisfaction: 3.7 }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

const CEOAnalytics = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('12M');
  const [selectedTab, setSelectedTab] = useState(0);

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$62.8M',
      change: '+24.5%',
      trend: 'up',
      icon: <MoneyIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50'
    },
    {
      title: 'Active Properties',
      value: '1,385',
      change: '+18.2%',
      trend: 'up',
      icon: <PropertyIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3'
    },
    {
      title: 'Total Users',
      value: '53.4K',
      change: '+32.1%',
      trend: 'up',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#ff9800'
    },
    {
      title: 'Booking Rate',
      value: '78.5%',
      change: '+5.2%',
      trend: 'up',
      icon: <BookingIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0'
    },
    {
      title: 'Avg Rating',
      value: '4.6/5',
      change: '+0.3',
      trend: 'up',
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      color: '#f44336'
    },
    {
      title: 'Market Share',
      value: '28%',
      change: '+4.1%',
      trend: 'up',
      icon: <GlobalIcon sx={{ fontSize: 40 }} />,
      color: '#607d8b'
    }
  ];

  const operationalMetrics = [
    { metric: 'Customer Acquisition Cost', value: '$42', target: '$45', status: 'good' },
    { metric: 'Customer Lifetime Value', value: '$1,850', target: '$1,600', status: 'excellent' },
    { metric: 'Host Retention Rate', value: '92%', target: '85%', status: 'excellent' },
    { metric: 'Guest Return Rate', value: '68%', target: '60%', status: 'excellent' },
    { metric: 'Platform Fee Revenue', value: '12.5%', target: '12%', status: 'good' },
    { metric: 'Dispute Resolution Time', value: '24hrs', target: '48hrs', status: 'excellent' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4caf50';
      case 'good': return '#ff9800';
      case 'warning': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Executive insights and key performance indicators
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="1M">1 Month</MenuItem>
              <MenuItem value="3M">3 Months</MenuItem>
              <MenuItem value="6M">6 Months</MenuItem>
              <MenuItem value="12M">12 Months</MenuItem>
              <MenuItem value="ALL">All Time</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<ReportIcon />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${kpi.color}15, ${kpi.color}05)` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ color: kpi.color }}>
                    {kpi.icon}
                  </Box>
                  <Chip 
                    label={kpi.change}
                    color={kpi.trend === 'up' ? 'success' : 'error'}
                    size="small"
                    icon={kpi.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  />
                </Box>
                <Typography variant="h4" fontWeight={700} color={kpi.color} gutterBottom>
                  {kpi.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {kpi.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for Different Analytics Views */}
      <Card sx={{ mb: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Financial Performance" icon={<MoneyIcon />} iconPosition="start" />
          <Tab label="User Analytics" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Market Intelligence" icon={<BusinessIcon />} iconPosition="start" />
          <Tab label="Operational Metrics" icon={<AnalyticsIcon />} iconPosition="start" />
        </Tabs>

        {/* Financial Performance Tab */}
        {selectedTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Revenue Trend */}
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Revenue & Booking Trends</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value, name) => [
                          name === 'revenue' ? `$${(value as number / 1000000).toFixed(1)}M` : value,
                          name === 'revenue' ? 'Revenue' : name === 'bookings' ? 'Bookings' : 'Avg Booking Value'
                        ]} />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} />
                        <Bar yAxisId="right" dataKey="bookings" fill="#82ca9d" />
                        <Line yAxisId="right" type="monotone" dataKey="avgBookingValue" stroke="#ff7300" strokeWidth={3} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Regional Revenue */}
              <Grid item xs={12} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Revenue by Region</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={regionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {regionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Marketing ROI */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Marketing Channel Performance</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Channel</TableCell>
                            <TableCell align="right">Investment</TableCell>
                            <TableCell align="right">Revenue Generated</TableCell>
                            <TableCell align="right">ROI %</TableCell>
                            <TableCell align="right">Conversions</TableCell>
                            <TableCell align="right">Cost per Conversion</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {marketingROI.map((row) => (
                            <TableRow key={row.channel}>
                              <TableCell component="th" scope="row">
                                <Chip label={row.channel} variant="outlined" />
                              </TableCell>
                              <TableCell align="right">${row.investment.toLocaleString()}</TableCell>
                              <TableCell align="right">${row.revenue.toLocaleString()}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${row.roi}%`} 
                                  color={row.roi > 1400 ? 'success' : row.roi > 1200 ? 'warning' : 'default'}
                                />
                              </TableCell>
                              <TableCell align="right">{row.conversions.toLocaleString()}</TableCell>
                              <TableCell align="right">${Math.round(row.investment / row.conversions)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* User Analytics Tab */}
        {selectedTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* User Growth */}
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>User Growth Trends</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                          (value as number).toLocaleString(),
                          name === 'hosts' ? 'Hosts' : name === 'guests' ? 'Guests' : 'Total Users'
                        ]} />
                        <Legend />
                        <Area type="monotone" dataKey="guests" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="hosts" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* User Metrics */}
              <Grid item xs={12} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>User Engagement Metrics</Typography>
                    <Box sx={{ mt: 3 }}>
                      {[
                        { label: 'Daily Active Users', value: '12.5K', progress: 85 },
                        { label: 'Monthly Active Users', value: '45.2K', progress: 92 },
                        { label: 'Session Duration', value: '8m 32s', progress: 78 },
                        { label: 'Pages per Session', value: '4.2', progress: 88 },
                        { label: 'Bounce Rate', value: '22%', progress: 65 },
                        { label: 'User Satisfaction', value: '4.6/5', progress: 92 }
                      ].map((metric, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{metric.label}</Typography>
                            <Typography variant="body2" fontWeight={600}>{metric.value}</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={metric.progress} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Geographic Distribution */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Geographic User Distribution</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={regionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="properties" fill="#8884d8" name="Properties" />
                        <Bar dataKey="value" fill="#82ca9d" name="User Share %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Market Intelligence Tab */}
        {selectedTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Competitor Analysis */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Competitive Landscape Analysis</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Competitor</TableCell>
                            <TableCell align="right">Market Share</TableCell>
                            <TableCell align="right">Avg Price (USD)</TableCell>
                            <TableCell align="right">Properties</TableCell>
                            <TableCell align="right">Customer Satisfaction</TableCell>
                            <TableCell align="right">Competitive Position</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {competitorAnalysis.map((competitor) => (
                            <TableRow key={competitor.competitor}>
                              <TableCell component="th" scope="row">
                                <Typography 
                                  fontWeight={competitor.competitor === 'Yaad Kottage' ? 700 : 400}
                                  color={competitor.competitor === 'Yaad Kottage' ? 'primary' : 'inherit'}
                                >
                                  {competitor.competitor}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                  <Typography>{competitor.marketShare}%</Typography>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={competitor.marketShare} 
                                    sx={{ width: 60, height: 6 }}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell align="right">${competitor.avgPrice}</TableCell>
                              <TableCell align="right">{competitor.properties.toLocaleString()}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${competitor.satisfaction}/5`}
                                  color={competitor.satisfaction >= 4.5 ? 'success' : competitor.satisfaction >= 4.0 ? 'warning' : 'default'}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {competitor.competitor === 'Yaad Kottage' ? (
                                  <Chip label="Us" color="primary" />
                                ) : competitor.marketShare > 30 ? (
                                  <Chip label="Market Leader" color="error" />
                                ) : competitor.marketShare > 15 ? (
                                  <Chip label="Strong Competitor" color="warning" />
                                ) : (
                                  <Chip label="Niche Player" color="default" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Market Trends */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Market Opportunity Analysis</Typography>
                    <Box sx={{ mt: 3 }}>
                      {[
                        { segment: 'Luxury Properties', growth: '+35%', opportunity: 'High', investment: '$2.5M' },
                        { segment: 'Eco-Tourism', growth: '+28%', opportunity: 'High', investment: '$1.8M' },
                        { segment: 'Business Travel', growth: '+22%', opportunity: 'Medium', investment: '$1.2M' },
                        { segment: 'Local Experiences', growth: '+18%', opportunity: 'Medium', investment: '$800K' },
                        { segment: 'Group Bookings', growth: '+15%', opportunity: 'Low', investment: '$500K' }
                      ].map((item, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 2
                        }}>
                          <Box>
                            <Typography variant="subtitle2">{item.segment}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Growth: {item.growth} | Investment: {item.investment}
                            </Typography>
                          </Box>
                          <Chip 
                            label={item.opportunity}
                            color={item.opportunity === 'High' ? 'success' : item.opportunity === 'Medium' ? 'warning' : 'default'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Strategic Initiatives */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Strategic Initiatives Progress</Typography>
                    <Box sx={{ mt: 3 }}>
                      {[
                        { initiative: 'AI-Powered Recommendations', progress: 85, status: 'On Track', deadline: 'Q1 2025' },
                        { initiative: 'Mobile App Enhancement', progress: 70, status: 'On Track', deadline: 'Q2 2025' },
                        { initiative: 'Regional Expansion', progress: 60, status: 'Behind', deadline: 'Q2 2025' },
                        { initiative: 'Partnership Program', progress: 45, status: 'Behind', deadline: 'Q3 2025' },
                        { initiative: 'Sustainability Features', progress: 30, status: 'Planning', deadline: 'Q4 2025' }
                      ].map((item, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2">{item.initiative}</Typography>
                            <Chip 
                              label={item.status}
                              size="small"
                              color={item.status === 'On Track' ? 'success' : item.status === 'Behind' ? 'warning' : 'default'}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">{item.deadline}</Typography>
                            <Typography variant="body2">{item.progress}%</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={item.progress} 
                            sx={{ height: 6, borderRadius: 3 }}
                            color={item.status === 'On Track' ? 'success' : item.status === 'Behind' ? 'warning' : 'primary'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Operational Metrics Tab */}
        {selectedTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Operational KPIs */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Key Operational Metrics</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Metric</TableCell>
                            <TableCell align="right">Current Value</TableCell>
                            <TableCell align="right">Target</TableCell>
                            <TableCell align="right">Performance</TableCell>
                            <TableCell align="right">Trend</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {operationalMetrics.map((metric) => (
                            <TableRow key={metric.metric}>
                              <TableCell component="th" scope="row">
                                {metric.metric}
                              </TableCell>
                              <TableCell align="right">
                                <Typography fontWeight={600}>
                                  {metric.value}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">{metric.target}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={metric.status.toUpperCase()}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: getStatusColor(metric.status),
                                    color: 'white'
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TrendingUpIcon sx={{ color: '#4caf50' }} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Platform Health */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Platform Health & Performance</Typography>
                    <Box sx={{ mt: 3 }}>
                      {[
                        { metric: 'System Uptime', value: '99.9%', color: '#4caf50' },
                        { metric: 'Average Response Time', value: '1.2s', color: '#4caf50' },
                        { metric: 'Error Rate', value: '0.05%', color: '#4caf50' },
                        { metric: 'Database Performance', value: '98%', color: '#4caf50' },
                        { metric: 'CDN Performance', value: '97%', color: '#ff9800' },
                        { metric: 'Security Score', value: '95%', color: '#4caf50' }
                      ].map((item, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 1
                        }}>
                          <Typography variant="body2">{item.metric}</Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ color: item.color }}>
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Risk Assessment */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Risk Assessment Matrix</Typography>
                    <Box sx={{ mt: 3 }}>
                      {[
                        { risk: 'Market Competition', level: 'High', impact: 'High', mitigation: 'In Progress' },
                        { risk: 'Regulatory Changes', level: 'Medium', impact: 'Medium', mitigation: 'Planned' },
                        { risk: 'Technology Disruption', level: 'Medium', impact: 'High', mitigation: 'Monitoring' },
                        { risk: 'Economic Downturn', level: 'Low', impact: 'High', mitigation: 'Prepared' },
                        { risk: 'Cybersecurity', level: 'Low', impact: 'High', mitigation: 'Active' }
                      ].map((item, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 2
                        }}>
                          <Box>
                            <Typography variant="subtitle2">{item.risk}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Impact: {item.impact} | Mitigation: {item.mitigation}
                            </Typography>
                          </Box>
                          <Chip 
                            label={item.level}
                            size="small"
                            color={item.level === 'High' ? 'error' : item.level === 'Medium' ? 'warning' : 'success'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default CEOAnalytics;
