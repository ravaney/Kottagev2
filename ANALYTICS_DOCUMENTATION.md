# Property Analytics & Popularity Engine Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Analytics Metrics](#analytics-metrics)
- [Cloud Functions](#cloud-functions)
- [Frontend Components](#frontend-components)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

The Property Analytics & Popularity Engine is a comprehensive system that tracks, analyzes, and presents property performance data to help property owners optimize their listings and improve booking rates. The system follows industry standards used by major platforms like Airbnb and Booking.com.

### Key Features
- **Real-time Analytics Tracking**: Captures user interactions across the platform
- **Industry-Standard Popularity Scoring**: Weighted algorithm for property ranking
- **Comprehensive Dashboard**: Detailed analytics for property owners
- **Automated Processing**: Daily calculation of popularity scores
- **Performance Insights**: AI-powered recommendations for improvement

## Architecture

### System Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Cloud Functions │    │   Database      │
│   Analytics     │────│   (Firebase)     │────│   (Realtime)    │
│   Tracking      │    │                  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────│   Scheduler     │──────────────┘
                        │   (Daily 2AM)   │
                        └─────────────────┘
```

### Data Flow
1. **User Interaction** → Analytics Service tracks event
2. **Analytics Service** → Sends data to Cloud Function
3. **Cloud Function** → Stores in Firebase Realtime Database
4. **Scheduler** → Runs daily calculations (2 AM Jamaica time)
5. **Dashboard** → Retrieves and displays analytics data

## Analytics Metrics

### Primary Metrics

#### 1. Views Analytics
```typescript
views: {
  total: number;        // All-time property page views
  lastMonth: number;    // Views in the last 30 days
  lastWeek: number;     // Views in the last 7 days
  today: number;        // Views today
}
```

#### 2. Search Performance
```typescript
searches: {
  total: number;           // Total clicks from search results
  impressions: number;     // Times shown in search results
  clickThroughRate: number; // clicks / impressions (0.0 to 1.0)
  lastMonth: number;       // Search clicks last 30 days
  lastWeek: number;        // Search clicks last 7 days
}
```

#### 3. Booking Metrics
```typescript
bookings: {
  total: number;              // Total confirmed bookings
  conversionRate: number;     // bookings / views (0.0 to 1.0)
  lastMonth: number;          // Bookings last 30 days
  lastWeek: number;           // Bookings last 7 days
  revenue: number;            // Total revenue in USD
  averageBookingValue: number; // revenue / total bookings
}
```

#### 4. Engagement Metrics
```typescript
engagement: {
  avgTimeOnPage: number;    // Average seconds spent on property page
  photoViewRate: number;    // % of visitors who view multiple photos
  inquiryRate: number;      // % of visitors who submit inquiries
  wishlistRate: number;     // % of visitors who save property
  shareRate: number;        // % of visitors who share property
}
```

#### 5. Review Analytics
```typescript
reviews: {
  count: number;            // Total number of reviews
  averageRating: number;    // Average rating (0.0 to 5.0)
  recentReviews: number;    // Reviews in last 30 days
  reviewVelocity: number;   // Reviews per month
  responseRate: number;     // Host response rate to reviews
}
```

#### 6. Competition Analysis
```typescript
competition: {
  marketPosition: number;      // Percentile position in market (1-100)
  priceCompetitiveness: number; // Price competitiveness score (0.0 to 1.0)
  availabilityScore: number;   // Availability vs competitors (0.0 to 1.0)
}
```

### Popularity Score Calculation

The popularity score uses a weighted algorithm based on industry standards:

```typescript
PopularityScore = (
  BookingRate × 0.30 +      // Conversion efficiency (30%)
  RatingScore × 0.25 +      // Guest satisfaction (25%)
  ReviewVelocity × 0.15 +   // Recent feedback activity (15%)
  EngagementScore × 0.15 +  // User interest metrics (15%)
  RecencyFactor × 0.10 +    // Recent activity boost (10%)
  PriceValue × 0.05         // Market competitiveness (5%)
)
```

#### Score Interpretation
- **0.8 - 1.0**: Excellent (Top 20% of properties)
- **0.6 - 0.79**: Good (Above average performance)
- **0.4 - 0.59**: Fair (Average performance)
- **0.0 - 0.39**: Needs Improvement (Below average)

## Cloud Functions

### 1. trackUserInteraction
**Purpose**: Records user interactions with properties in real-time.

**Trigger**: HTTP Callable  
**Parameters**:
```typescript
{
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
```

**Usage Example**:
```typescript
import { analyticsService } from '../services/analyticsService';

// Track property view
analyticsService.trackPropertyView('property123', 'https://google.com');

// Track photo view
analyticsService.trackPhotoView('property123', 2);

// Track booking attempt
analyticsService.trackBookingAttempt('property123');
```

### 2. getPropertyAnalytics
**Purpose**: Retrieves comprehensive analytics for a specific property.

**Trigger**: HTTP Callable  
**Parameters**:
```typescript
{
  propertyId: string;
  userId: string;
}
```

**Returns**: Complete `PropertyAnalytics` object

**Usage Example**:
```typescript
import { usePropertyAnalytics } from '../hooks/useAnalytics';

const { data: analytics, isLoading } = usePropertyAnalytics('property123');
```

### 3. updatePopularityScores
**Purpose**: Daily batch job to calculate and update popularity scores.

**Trigger**: Scheduled (2:00 AM Jamaica time)  
**Frequency**: Daily  
**Process**:
1. Retrieves all approved and listed properties
2. Calculates analytics for each property
3. Updates popularity and trending scores
4. Stores results in database

### 4. onBookingCreated
**Purpose**: Updates analytics when a new booking is created.

**Trigger**: Database write to `/bookings/{bookingId}`  
**Process**:
1. Extracts property ID from booking
2. Recalculates analytics for the property
3. Updates popularity score immediately

## Frontend Components

### 1. PropertyAnalyticsDashboard
**File**: `src/components/Dashboard/PropertyAnalyticsDashboard.tsx`

**Purpose**: Main analytics dashboard for property owners.

**Features**:
- Key metrics overview cards
- Tabbed interface for detailed analytics
- Performance recommendations
- Interactive charts and graphs

**Props**:
```typescript
interface PropertyAnalyticsDashboardProps {
  propertyId: string;
  propertyName: string;
}
```

**Tabs**:
1. **Performance**: Conversion rates, recent activity
2. **Search & Discovery**: CTR, impressions, search rankings
3. **Guest Engagement**: Time on page, photo views, inquiries
4. **Reviews & Ratings**: Guest feedback metrics
5. **Competition**: Market positioning analysis

### 2. AnalyticsService
**File**: `src/services/analyticsService.ts`

**Purpose**: Frontend service for tracking user interactions.

**Key Methods**:
```typescript
// Property page tracking
trackPropertyView(propertyId: string, referrer?: string): void
trackPropertyExit(propertyId: string): void

// Search tracking
trackSearchImpression(propertyId: string, searchQuery: string, position: number): void
trackSearchClick(propertyId: string, searchQuery: string, position: number): void

// Engagement tracking
trackPhotoView(propertyId: string, photoIndex: number): void
trackInquiry(propertyId: string): void
trackWishlist(propertyId: string): void
trackShare(propertyId: string, platform?: string): void
trackBookingAttempt(propertyId: string): void
```

**Auto-tracking Features**:
- Page visibility changes
- Time on page calculation
- Device type detection
- Batch processing for performance

### 3. Analytics Hooks
**File**: `src/hooks/useAnalytics.ts`

**Available Hooks**:
```typescript
// Single property analytics
usePropertyAnalytics(propertyId: string): UseQueryResult<PropertyAnalytics>

// Multiple properties analytics
useMultiplePropertyAnalytics(propertyIds: string[]): UseQueryResult<PropertyAnalytics[]>

// Aggregated summary
useAnalyticsSummary(propertyIds: string[]): UseQueryResult<AnalyticsSummary>
```

**React Integration**:
```typescript
import { usePropertyAnalytics } from '../services/analyticsService';

function PropertyPage({ propertyId }: { propertyId: string }) {
  const analytics = usePropertyAnalytics(propertyId, document.referrer);
  
  return (
    <div>
      <PropertyImages onPhotoView={analytics.trackPhotoView} />
      <BookingForm onBookingAttempt={analytics.trackBookingAttempt} />
      <ShareButton onClick={() => analytics.trackShare('facebook')} />
    </div>
  );
}
```

## Usage Guide

### For Property Owners

#### Accessing Analytics Dashboard
1. Navigate to **My Account** → **Dashboard**
2. Go to **My Properties** section
3. Click the **⋮ menu** on any property card
4. Select **"View Analytics"**

#### Understanding Your Metrics

**High Priority Metrics**:
- **Popularity Score**: Overall performance indicator
- **Conversion Rate**: Percentage of viewers who book
- **Click-Through Rate**: Effectiveness in search results
- **Average Rating**: Guest satisfaction level

**Improvement Indicators**:
- **Low CTR** (< 5%): Update photos and description
- **Low Conversion** (< 2%): Review pricing and availability
- **Low Response Rate** (< 80%): Respond to more guest reviews
- **Low Engagement**: Improve property photos and details

#### Best Practices
1. **Regular Monitoring**: Check analytics weekly
2. **Respond to Reviews**: Maintain 80%+ response rate
3. **Update Photos**: Refresh images every 6 months
4. **Competitive Pricing**: Monitor market position
5. **High Availability**: Keep calendar updated

### For Developers

#### Implementing Analytics Tracking

**1. Page View Tracking**:
```typescript
import { usePropertyAnalytics } from '../services/analyticsService';

function PropertyDetailPage({ propertyId }: { propertyId: string }) {
  const analytics = usePropertyAnalytics(propertyId);
  
  // Automatic tracking on component mount/unmount
  useEffect(() => {
    return () => {
      // Cleanup tracked on unmount
    };
  }, []);
}
```

**2. Search Results Tracking**:
```typescript
import { useSearchAnalytics } from '../services/analyticsService';

function SearchResults({ properties, searchQuery }: SearchResultsProps) {
  const { trackSearchImpression, trackSearchClick } = useSearchAnalytics();
  
  useEffect(() => {
    // Track impressions when results are displayed
    properties.forEach((property, index) => {
      trackSearchImpression(property.id, searchQuery, index + 1);
    });
  }, [properties, searchQuery]);
  
  const handlePropertyClick = (property: Property, index: number) => {
    trackSearchClick(property.id, searchQuery, index + 1);
    // Navigate to property
  };
}
```

**3. Custom Event Tracking**:
```typescript
import { analyticsService } from '../services/analyticsService';

// Custom interaction tracking
function CustomComponent() {
  const handleSpecialAction = () => {
    analyticsService.trackInteraction({
      propertyId: 'property123',
      action: 'custom_action',
      metadata: {
        customData: 'value',
        deviceType: 'mobile'
      }
    });
  };
}
```

## API Reference

### Cloud Functions Endpoints

#### trackUserInteraction
```typescript
POST https://us-central1-kottage-v2.cloudfunctions.net/trackUserInteraction

Body: {
  sessionId: string;
  propertyId: string;
  action: string;
  timestamp: string;
  metadata?: object;
}

Response: {
  success: boolean;
}
```

#### getPropertyAnalytics
```typescript
POST https://us-central1-kottage-v2.cloudfunctions.net/getPropertyAnalytics

Body: {
  propertyId: string;
  userId: string;
}

Response: PropertyAnalytics
```

### Database Structure

#### Analytics Data
```
/analytics/
├── interactions/
│   ├── {interactionId}/
│   │   ├── sessionId: string
│   │   ├── propertyId: string
│   │   ├── action: string
│   │   ├── timestamp: string
│   │   └── metadata: object
│   └── ...
├── properties/
│   ├── {propertyId}/
│   │   ├── views: ViewsAnalytics
│   │   ├── searches: SearchAnalytics
│   │   ├── bookings: BookingAnalytics
│   │   ├── engagement: EngagementAnalytics
│   │   ├── reviews: ReviewAnalytics
│   │   ├── competition: CompetitionAnalytics
│   │   ├── popularityScore: number
│   │   ├── trendingScore: number
│   │   └── lastUpdated: string
│   └── ...
└── summary/
    ├── daily/
    ├── weekly/
    └── monthly/
```

## Configuration

### Environment Variables
```typescript
// Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=kottage-v2
REACT_APP_FIREBASE_DATABASE_URL=your_database_url

// Analytics Configuration
ANALYTICS_BATCH_SIZE=10
ANALYTICS_BATCH_TIMEOUT=2000
ANALYTICS_ENABLED=true
```

### Popularity Score Weights
```typescript
const POPULARITY_WEIGHTS = {
  bookingRate: 0.30,     // Booking conversion rate
  rating: 0.25,          // Average guest rating
  reviewVelocity: 0.15,  // Recent review activity
  engagement: 0.15,      // User engagement metrics
  recency: 0.10,         // Recent activity boost
  priceValue: 0.05       // Price competitiveness
};
```

### Scheduler Configuration
```typescript
// Cloud Function Scheduler
schedule: "0 2 * * *"    // Daily at 2:00 AM
timeZone: "America/Jamaica"
maxInstances: 1
timeout: "9m"
memory: "512MB"
```

## Troubleshooting

### Common Issues

#### 1. Analytics Not Loading
**Symptoms**: Dashboard shows loading spinner indefinitely
**Causes**:
- Missing Firebase authentication
- Property doesn't belong to current user
- Cloud Function errors

**Solutions**:
```typescript
// Check authentication
const { currentUser } = useAuth();
if (!currentUser) {
  // Redirect to login
}

// Check console for errors
console.log('Analytics error:', error);

// Verify property ownership
const propertySnapshot = await get(ref(database, `properties/${propertyId}`));
const property = propertySnapshot.val();
if (property.ownerId !== currentUser.uid) {
  throw new Error('Unauthorized');
}
```

#### 2. Tracking Not Working
**Symptoms**: No interaction data being recorded
**Causes**:
- Analytics service not initialized
- Network connectivity issues
- Ad blockers interfering

**Solutions**:
```typescript
// Initialize analytics service
import { analyticsService } from '../services/analyticsService';

useEffect(() => {
  analyticsService.enableAutoTracking();
  analyticsService.enableBatchTracking();
}, []);

// Check network connectivity
const trackInteraction = async () => {
  try {
    await analyticsService.trackPropertyView(propertyId);
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
    // Continue without breaking user experience
  }
};
```

#### 3. Popularity Scores Not Updating
**Symptoms**: Scores remain at 0 or don't change
**Causes**:
- Scheduler not running
- Insufficient data
- Calculation errors

**Solutions**:
```typescript
// Manual score calculation trigger
const recalculateScores = httpsCallable(functions, 'updatePopularityScores');
await recalculateScores();

// Check minimum data requirements
if (analytics.views.total < 10) {
  // Not enough data for accurate scoring
}

// Verify scheduler is running
// Check Firebase Console → Functions → Logs
```

#### 4. Performance Issues
**Symptoms**: Slow loading, high latency
**Causes**:
- Too many API calls
- Large data sets
- Inefficient queries

**Solutions**:
```typescript
// Use React Query caching
const { data: analytics } = usePropertyAnalytics(propertyId, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000  // 10 minutes
});

// Implement batch processing
analyticsService.enableBatchTracking();

// Use pagination for large datasets
const { data: properties } = useInfiniteQuery({
  queryKey: ['properties'],
  queryFn: ({ pageParam = 0 }) => fetchProperties(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor
});
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `ANALYTICS_001` | Missing property ID | Ensure propertyId is provided |
| `ANALYTICS_002` | Unauthorized access | Verify user owns property |
| `ANALYTICS_003` | Network timeout | Retry with exponential backoff |
| `ANALYTICS_004` | Invalid data format | Check request payload |
| `ANALYTICS_005` | Quota exceeded | Implement rate limiting |

### Debug Mode

Enable debug logging for troubleshooting:
```typescript
// Enable debug mode
localStorage.setItem('analytics_debug', 'true');

// View analytics logs
console.log('Analytics debug data:', analyticsService.getDebugInfo());

// Monitor function performance
const startTime = performance.now();
await trackUserInteraction(data);
const endTime = performance.now();
console.log(`Tracking took ${endTime - startTime} milliseconds`);
```

### Support

For additional support:
1. Check Firebase Console logs
2. Review React DevTools console
3. Verify network requests in browser DevTools
4. Contact development team with error details

---

**Last Updated**: July 20, 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
