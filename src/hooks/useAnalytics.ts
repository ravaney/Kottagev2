import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';
import { functions, auth } from '../firebase';

// Property Analytics Interface (matches the one in Cloud Functions)
export interface PropertyAnalytics {
  propertyId: string;
  views: {
    total: number;
    lastMonth: number;
    lastWeek: number;
    today: number;
  };
  searches: {
    total: number;
    impressions: number;
    clickThroughRate: number;
    lastMonth: number;
    lastWeek: number;
  };
  bookings: {
    total: number;
    conversionRate: number;
    lastMonth: number;
    lastWeek: number;
    revenue: number;
    averageBookingValue: number;
  };
  engagement: {
    avgTimeOnPage: number;
    photoViewRate: number;
    inquiryRate: number;
    wishlistRate: number;
    shareRate: number;
  };
  reviews: {
    count: number;
    averageRating: number;
    recentReviews: number;
    reviewVelocity: number;
    responseRate: number;
  };
  competition: {
    marketPosition: number;
    priceCompetitiveness: number;
    availabilityScore: number;
  };
  popularityScore: number;
  trendingScore: number;
  lastUpdated: string;
}

// Analytics summary for dashboard cards
export interface AnalyticsSummary {
  totalViews: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  popularityScore: number;
  trendingScore: number;
  conversionRate: number;
  clickThroughRate: number;
}

// Hook to get property analytics
export const usePropertyAnalytics = (propertyId: string) => {
  return useQuery<PropertyAnalytics>({
    queryKey: ['propertyAnalytics', propertyId],
    queryFn: async () => {
      const getPropertyAnalytics = httpsCallable(functions, 'getPropertyAnalytics');
      const result = await getPropertyAnalytics({
        propertyId,
        userId: auth.currentUser?.uid
      });
      return result.data as PropertyAnalytics;
    },
    enabled: !!propertyId && !!auth.currentUser?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Hook to get analytics for multiple properties (for dashboard overview)
export const useMultiplePropertyAnalytics = (propertyIds: string[]) => {
  return useQuery<PropertyAnalytics[]>({
    queryKey: ['multiplePropertyAnalytics', propertyIds],
    queryFn: async () => {
      const getPropertyAnalytics = httpsCallable(functions, 'getPropertyAnalytics');
      
      const analyticsPromises = propertyIds.map(async (propertyId) => {
        try {
          const result = await getPropertyAnalytics({
            propertyId,
            userId: auth.currentUser?.uid
          });
          return result.data as PropertyAnalytics;
        } catch (error) {
          console.warn(`Failed to get analytics for property ${propertyId}:`, error);
          return null;
        }
      });

      const results = await Promise.all(analyticsPromises);
      return results.filter(result => result !== null) as PropertyAnalytics[];
    },
    enabled: propertyIds.length > 0 && !!auth.currentUser?.uid,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

// Hook to get analytics summary across all properties
export const useAnalyticsSummary = (propertyIds: string[]) => {
  return useQuery<AnalyticsSummary>({
    queryKey: ['analyticsSummary', propertyIds],
    queryFn: async () => {
      const getPropertyAnalytics = httpsCallable(functions, 'getPropertyAnalytics');
      
      const analyticsPromises = propertyIds.map(async (propertyId) => {
        try {
          const result = await getPropertyAnalytics({
            propertyId,
            userId: auth.currentUser?.uid
          });
          return result.data as PropertyAnalytics;
        } catch (error) {
          return null;
        }
      });

      const analyticsResults = await Promise.all(analyticsPromises);
      const validAnalytics = analyticsResults.filter(result => result !== null) as PropertyAnalytics[];

      // Aggregate the data
      const summary: AnalyticsSummary = {
        totalViews: validAnalytics.reduce((sum, analytics) => sum + analytics.views.total, 0),
        totalBookings: validAnalytics.reduce((sum, analytics) => sum + analytics.bookings.total, 0),
        totalRevenue: validAnalytics.reduce((sum, analytics) => sum + analytics.bookings.revenue, 0),
        averageRating: validAnalytics.length > 0 
          ? validAnalytics.reduce((sum, analytics) => sum + analytics.reviews.averageRating, 0) / validAnalytics.length 
          : 0,
        popularityScore: validAnalytics.length > 0 
          ? validAnalytics.reduce((sum, analytics) => sum + analytics.popularityScore, 0) / validAnalytics.length 
          : 0,
        trendingScore: validAnalytics.length > 0 
          ? validAnalytics.reduce((sum, analytics) => sum + analytics.trendingScore, 0) / validAnalytics.length 
          : 0,
        conversionRate: validAnalytics.length > 0 
          ? validAnalytics.reduce((sum, analytics) => sum + analytics.bookings.conversionRate, 0) / validAnalytics.length 
          : 0,
        clickThroughRate: validAnalytics.length > 0 
          ? validAnalytics.reduce((sum, analytics) => sum + analytics.searches.clickThroughRate, 0) / validAnalytics.length 
          : 0
      };

      return summary;
    },
    enabled: propertyIds.length > 0 && !!auth.currentUser?.uid,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

// Helper functions for formatting analytics data
export const formatAnalyticsMetric = (value: number, type: 'currency' | 'percentage' | 'number' | 'rating') => {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    
    case 'percentage':
      return `${(value * 100).toFixed(1)}%`;
    
    case 'rating':
      return value.toFixed(1);
    
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};

// Calculate growth rate between current and previous period
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Get trend indicator
export const getTrendIndicator = (growthRate: number) => {
  if (growthRate > 5) return { direction: 'up', color: 'success', icon: '↗️' };
  if (growthRate < -5) return { direction: 'down', color: 'error', icon: '↘️' };
  return { direction: 'stable', color: 'warning', icon: '→' };
};

// Analytics time period options
export const analyticsTimePeriods = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'week' },
  { label: 'Last 30 days', value: 'month' },
  { label: 'Last 90 days', value: 'quarter' },
  { label: 'Last year', value: 'year' }
] as const;

export type AnalyticsTimePeriod = typeof analyticsTimePeriods[number]['value'];
