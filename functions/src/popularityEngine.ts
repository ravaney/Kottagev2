import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall } from "firebase-functions/v2/https";
import { onValueWritten } from "firebase-functions/v2/database";
import * as logger from "firebase-functions/logger";

// Property Analytics Interface
interface PropertyAnalytics {
  propertyId: string;
  views: {
    total: number;
    lastMonth: number;
    lastWeek: number;
    today: number;
  };
  searches: {
    total: number;
    impressions: number; // times shown in search results
    clickThroughRate: number; // clicks / impressions
    lastMonth: number;
    lastWeek: number;
  };
  bookings: {
    total: number;
    conversionRate: number; // bookings / views
    lastMonth: number;
    lastWeek: number;
    revenue: number;
    averageBookingValue: number;
  };
  engagement: {
    avgTimeOnPage: number; // in seconds
    photoViewRate: number; // percentage who view multiple photos
    inquiryRate: number; // inquiries / views
    wishlistRate: number; // saves / views
    shareRate: number; // shares / views
  };
  reviews: {
    count: number;
    averageRating: number;
    recentReviews: number; // reviews in last 30 days
    reviewVelocity: number; // reviews per month
    responseRate: number; // host response rate to reviews
  };
  competition: {
    marketPosition: number; // 1-100 percentile in market
    priceCompetitiveness: number; // relative to similar properties
    availabilityScore: number; // how often available vs competitors
  };
  popularityScore: number;
  trendingScore: number;
  lastUpdated: string;
}

// User interaction tracking interface
interface UserInteraction {
  userId?: string;
  sessionId: string;
  propertyId: string;
  action: 'view' | 'search_impression' | 'click' | 'inquiry' | 'wishlist' | 'share' | 'photo_view' | 'booking_attempt';
  timestamp: string;
  metadata?: {
    timeOnPage?: number;
    searchQuery?: string;
    searchPosition?: number;
    photoIndex?: number;
    referrer?: string;
    deviceType?: 'desktop' | 'mobile' | 'tablet';
  };
}

// Popularity calculation weights (configurable)
const POPULARITY_WEIGHTS = {
  bookingRate: 0.30,
  rating: 0.25,
  reviewVelocity: 0.15,
  engagement: 0.15,
  recency: 0.10,
  priceValue: 0.05
};

/**
 * Calculate property popularity score based on various metrics
 */
function calculatePopularityScore(analytics: PropertyAnalytics): number {
  const metrics = {
    // Normalize booking rate (80% = max score)
    bookingRate: Math.min(analytics.bookings.conversionRate / 0.8, 1),
    
    // Normalize rating (5 stars = max score)
    rating: analytics.reviews.averageRating / 5,
    
    // Normalize review velocity (10+ reviews/month = max score)
    reviewVelocity: Math.min(analytics.reviews.reviewVelocity / 10, 1),
    
    // Engagement score combines multiple factors
    engagement: (
      Math.min(analytics.searches.clickThroughRate / 0.1, 1) * 0.4 +
      Math.min(analytics.engagement.inquiryRate / 0.05, 1) * 0.3 +
      Math.min(analytics.engagement.wishlistRate / 0.02, 1) * 0.2 +
      Math.min(analytics.engagement.photoViewRate / 0.8, 1) * 0.1
    ),
    
    // Recency factor (recent bookings weighted higher)
    recency: calculateRecencyScore(analytics),
    
    // Price competitiveness
    priceValue: analytics.competition.priceCompetitiveness
  };

  return Object.entries(POPULARITY_WEIGHTS).reduce((score, [key, weight]) => {
    return score + (metrics[key as keyof typeof metrics] * weight);
  }, 0);
}

/**
 * Calculate recency score based on recent activity
 */
function calculateRecencyScore(analytics: PropertyAnalytics): number {
  const totalViews = analytics.views.total || 1;
  const recentActivity = (
    analytics.views.lastWeek / totalViews * 0.5 +
    analytics.bookings.lastWeek / (analytics.bookings.total || 1) * 0.5
  );
  return Math.min(recentActivity * 10, 1); // Amplify recency effect
}

/**
 * Calculate trending score (recent performance vs historical)
 */
function calculateTrendingScore(analytics: PropertyAnalytics): number {
  const totalViews = analytics.views.total || 1;
  const totalBookings = analytics.bookings.total || 1;
  
  // Compare last week vs historical average
  const weeklyViewTrend = (analytics.views.lastWeek * 52) / totalViews;
  const weeklyBookingTrend = (analytics.bookings.lastWeek * 52) / totalBookings;
  
  return Math.min((weeklyViewTrend + weeklyBookingTrend) / 2, 3); // Cap at 3x trending
}

/**
 * Track user interaction with properties
 */
export const trackUserInteraction = onCall(async (request) => {
  try {
    const interaction: UserInteraction = request.data;
    
    // Validate required fields
    if (!interaction.propertyId || !interaction.action || !interaction.sessionId) {
      throw new Error("Missing required fields: propertyId, action, sessionId");
    }

    // Store interaction
    const interactionRef = admin.database().ref('analytics/interactions').push();
    await interactionRef.set({
      ...interaction,
      timestamp: interaction.timestamp || admin.database.ServerValue.TIMESTAMP
    });

    // Update real-time counters for immediate analytics
    const today = new Date().toISOString().split('T')[0];
    const propertyAnalyticsRef = admin.database().ref(`analytics/properties/${interaction.propertyId}`);
    
    switch (interaction.action) {
      case 'view':
        await propertyAnalyticsRef.child('views/total').transaction((current) => (current || 0) + 1);
        await propertyAnalyticsRef.child(`views/daily/${today}`).transaction((current) => (current || 0) + 1);
        break;
        
      case 'search_impression':
        await propertyAnalyticsRef.child('searches/impressions').transaction((current) => (current || 0) + 1);
        break;
        
      case 'click':
        await propertyAnalyticsRef.child('searches/clicks').transaction((current) => (current || 0) + 1);
        break;
        
      case 'inquiry':
        await propertyAnalyticsRef.child('engagement/inquiries').transaction((current) => (current || 0) + 1);
        break;
        
      case 'wishlist':
        await propertyAnalyticsRef.child('engagement/wishlists').transaction((current) => (current || 0) + 1);
        break;
        
      case 'share':
        await propertyAnalyticsRef.child('engagement/shares').transaction((current) => (current || 0) + 1);
        break;
    }

    return { success: true };
  } catch (error) {
    logger.error("Error tracking user interaction:", error);
    throw error;
  }
});

/**
 * Scheduled function to calculate and update popularity scores daily
 */
export const updatePopularityScores = onSchedule({
  schedule: "0 2 * * *", // Run daily at 2 AM
  timeZone: "America/Jamaica",
}, async () => {
  try {
    logger.info("Starting popularity score calculation...");
    
    // Get all approved and listed properties
    const propertiesSnapshot = await admin.database().ref('properties').once('value');
    const properties = propertiesSnapshot.val() || {};
    
    const updatePromises = Object.entries(properties).map(async ([propertyId, property]: [string, any]) => {
      if (property.approval?.status === 'approved' && property.isListed) {
        try {
          const analytics = await calculatePropertyAnalytics(propertyId);
          
          // Update analytics in database
          await admin.database().ref(`analytics/properties/${propertyId}`).update({
            ...analytics,
            lastUpdated: admin.database.ServerValue.TIMESTAMP
          });
          
          // Update popularity score in property record for easy querying
          await admin.database().ref(`properties/${propertyId}`).update({
            popularityScore: analytics.popularityScore,
            trendingScore: analytics.trendingScore,
            lastAnalyticsUpdate: admin.database.ServerValue.TIMESTAMP
          });
          
          logger.info(`Updated analytics for property ${propertyId}`, {
            popularityScore: analytics.popularityScore,
            trendingScore: analytics.trendingScore
          });
          
        } catch (error) {
          logger.error(`Error updating analytics for property ${propertyId}:`, error);
        }
      }
    });
    
    await Promise.all(updatePromises);
    logger.info("Popularity score calculation completed");
    
  } catch (error) {
    logger.error("Error in scheduled popularity update:", error);
    throw error;
  }
});

/**
 * Calculate comprehensive analytics for a property
 */
async function calculatePropertyAnalytics(propertyId: string): Promise<PropertyAnalytics> {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get interaction data
  const interactionsRef = admin.database().ref('analytics/interactions')
    .orderByChild('propertyId')
    .equalTo(propertyId);
  const interactionsSnapshot = await interactionsRef.once('value');
  const interactions: UserInteraction[] = Object.values(interactionsSnapshot.val() || {});

  // Get booking data
  const bookingsRef = admin.database().ref('bookings')
    .orderByChild('propertyId')
    .equalTo(propertyId);
  const bookingsSnapshot = await bookingsRef.once('value');
  const bookings = Object.values(bookingsSnapshot.val() || {});

  // Get review data
  const reviewsRef = admin.database().ref(`reviews/${propertyId}`);
  const reviewsSnapshot = await reviewsRef.once('value');
  const reviews = Object.values(reviewsSnapshot.val() || {});

  // Calculate views
  const views = {
    total: interactions.filter(i => i.action === 'view').length,
    lastMonth: interactions.filter(i => 
      i.action === 'view' && new Date(i.timestamp) >= lastMonth
    ).length,
    lastWeek: interactions.filter(i => 
      i.action === 'view' && new Date(i.timestamp) >= lastWeek
    ).length,
    today: interactions.filter(i => 
      i.action === 'view' && new Date(i.timestamp) >= today
    ).length
  };

  // Calculate search metrics
  const impressions = interactions.filter(i => i.action === 'search_impression').length;
  const clicks = interactions.filter(i => i.action === 'click').length;
  const searches = {
    total: clicks,
    impressions,
    clickThroughRate: impressions > 0 ? clicks / impressions : 0,
    lastMonth: interactions.filter(i => 
      i.action === 'click' && new Date(i.timestamp) >= lastMonth
    ).length,
    lastWeek: interactions.filter(i => 
      i.action === 'click' && new Date(i.timestamp) >= lastWeek
    ).length
  };

  // Calculate booking metrics
  const totalRevenue = bookings.reduce((sum: number, booking: any) => sum + (booking.totalCost || 0), 0);
  const bookingMetrics = {
    total: bookings.length,
    conversionRate: views.total > 0 ? bookings.length / views.total : 0,
    lastMonth: bookings.filter((booking: any) => 
      new Date(booking.createdAt) >= lastMonth
    ).length,
    lastWeek: bookings.filter((booking: any) => 
      new Date(booking.createdAt) >= lastWeek
    ).length,
    revenue: totalRevenue,
    averageBookingValue: bookings.length > 0 ? totalRevenue / bookings.length : 0
  };

  // Calculate engagement metrics
  const inquiries = interactions.filter(i => i.action === 'inquiry').length;
  const wishlists = interactions.filter(i => i.action === 'wishlist').length;
  const shares = interactions.filter(i => i.action === 'share').length;
  const photoViews = interactions.filter(i => i.action === 'photo_view').length;
  
  const engagement = {
    avgTimeOnPage: calculateAverageTimeOnPage(interactions),
    photoViewRate: views.total > 0 ? photoViews / views.total : 0,
    inquiryRate: views.total > 0 ? inquiries / views.total : 0,
    wishlistRate: views.total > 0 ? wishlists / views.total : 0,
    shareRate: views.total > 0 ? shares / views.total : 0
  };

  // Calculate review metrics
  const recentReviews = reviews.filter((review: any) => 
    new Date(review.createdAt) >= lastMonth
  ).length;
  
  const reviewMetrics = {
    count: reviews.length,
    averageRating: reviews.length > 0 ? 
      reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length : 0,
    recentReviews,
    reviewVelocity: recentReviews, // reviews per month
    responseRate: calculateHostResponseRate(reviews)
  };

  // Calculate market competition (simplified - would need more market data)
  const competition = {
    marketPosition: 50, // Placeholder - would calculate based on market data
    priceCompetitiveness: 0.8, // Placeholder - would compare with similar properties
    availabilityScore: 0.9 // Placeholder - would calculate availability vs competitors
  };

  const analytics: PropertyAnalytics = {
    propertyId,
    views,
    searches,
    bookings: bookingMetrics,
    engagement,
    reviews: reviewMetrics,
    competition,
    popularityScore: 0, // Will be calculated below
    trendingScore: 0, // Will be calculated below
    lastUpdated: now.toISOString()
  };

  // Calculate final scores
  analytics.popularityScore = calculatePopularityScore(analytics);
  analytics.trendingScore = calculateTrendingScore(analytics);

  return analytics;
}

/**
 * Calculate average time spent on property page
 */
function calculateAverageTimeOnPage(interactions: UserInteraction[]): number {
  const timeSpentData = interactions
    .filter(i => i.metadata?.timeOnPage)
    .map(i => i.metadata!.timeOnPage!);
  
  if (timeSpentData.length === 0) return 0;
  
  return timeSpentData.reduce((sum, time) => sum + time, 0) / timeSpentData.length;
}

/**
 * Calculate host response rate to reviews
 */
function calculateHostResponseRate(reviews: any[]): number {
  const reviewsWithResponses = reviews.filter(review => review.hostResponse);
  return reviews.length > 0 ? reviewsWithResponses.length / reviews.length : 0;
}

/**
 * Get property analytics for dashboard
 */
export const getPropertyAnalytics = onCall(async (request) => {
  try {
    const { propertyId, userId } = request.data;
    
    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    // Verify user owns the property
    const propertySnapshot = await admin.database().ref(`properties/${propertyId}`).once('value');
    const property = propertySnapshot.val();
    
    if (!property) {
      throw new Error("Property not found");
    }
    
    if (property.ownerId !== userId) {
      throw new Error("Unauthorized: You don't own this property");
    }

    // Get analytics data
    const analyticsSnapshot = await admin.database().ref(`analytics/properties/${propertyId}`).once('value');
    const analytics = analyticsSnapshot.val();
    
    if (!analytics) {
      // If no analytics exist, calculate them now
      const calculatedAnalytics = await calculatePropertyAnalytics(propertyId);
      
      // Store the calculated analytics
      await admin.database().ref(`analytics/properties/${propertyId}`).set(calculatedAnalytics);
      
      return calculatedAnalytics;
    }
    
    return analytics;
    
  } catch (error) {
    logger.error("Error getting property analytics:", error);
    throw error;
  }
});

/**
 * Update analytics when a booking is created
 */
export const onBookingCreated = onValueWritten(
  {
    ref: '/bookings/{bookingId}',
    region: 'us-central1'
  },
  async (event) => {
    try {
      const booking = event.data?.after?.val();
      if (!booking || !booking.propertyId) return;

      // Trigger analytics recalculation for this property
      const analytics = await calculatePropertyAnalytics(booking.propertyId);
      
      await admin.database().ref(`analytics/properties/${booking.propertyId}`).update({
        ...analytics,
        lastUpdated: admin.database.ServerValue.TIMESTAMP
      });

      // Update popularity score in property record
      await admin.database().ref(`properties/${booking.propertyId}`).update({
        popularityScore: analytics.popularityScore,
        trendingScore: analytics.trendingScore
      });

      logger.info(`Updated analytics after booking for property ${booking.propertyId}`);
      
    } catch (error) {
      logger.error("Error updating analytics after booking:", error);
    }
  }
);
