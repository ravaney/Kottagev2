# Analytics Quick Reference Guide

## 🚀 Quick Start

### 1. Track Property Views
```typescript
import { usePropertyAnalytics } from '../services/analyticsService';

function PropertyPage({ propertyId }: { propertyId: string }) {
  const analytics = usePropertyAnalytics(propertyId, document.referrer);
  
  return (
    <div>
      {/* Automatic tracking on mount/unmount */}
      <PropertyContent onPhotoView={analytics.trackPhotoView} />
    </div>
  );
}
```

### 2. Access Analytics Dashboard
```typescript
// Navigate to analytics
navigate(`/MyAccount/Dashboard/analytics/${propertyId}`, {
  state: { propertyName: property.name }
});
```

### 3. Get Analytics Data
```typescript
import { usePropertyAnalytics } from '../hooks/useAnalytics';

const { data: analytics, isLoading } = usePropertyAnalytics(propertyId);
// Returns complete PropertyAnalytics object
```

## 📊 Key Metrics Overview

| Metric | Description | Good Score | Action if Low |
|--------|-------------|------------|---------------|
| **Popularity Score** | Overall performance (0-1) | >0.8 | Improve all areas |
| **Conversion Rate** | Bookings/Views | >2% | Optimize pricing/photos |
| **Click-Through Rate** | Search clicks/impressions | >5% | Update listing details |
| **Average Rating** | Guest satisfaction | >4.5 | Improve guest experience |
| **Response Rate** | Host review responses | >80% | Respond to more reviews |

## 🎯 Common Tracking Events

```typescript
// Property interactions
analytics.trackPropertyView(propertyId, referrer);
analytics.trackPhotoView(propertyId, photoIndex);
analytics.trackInquiry(propertyId);
analytics.trackWishlist(propertyId);
analytics.trackShare(propertyId, 'facebook');
analytics.trackBookingAttempt(propertyId);

// Search interactions
searchAnalytics.trackSearchImpression(propertyId, query, position);
searchAnalytics.trackSearchClick(propertyId, query, position);
```

## 🛠️ Implementation Patterns

### Search Results Tracking
```typescript
function SearchResults({ properties, searchQuery }) {
  const { trackSearchImpression, trackSearchClick } = useSearchAnalytics();
  
  // Track impressions on display
  useEffect(() => {
    properties.forEach((property, index) => {
      trackSearchImpression(property.id, searchQuery, index + 1);
    });
  }, [properties, searchQuery]);
  
  // Track clicks
  const handleClick = (property, index) => {
    trackSearchClick(property.id, searchQuery, index + 1);
    navigate(`/property/${property.id}`);
  };
}
```

### Property Page Tracking
```typescript
function PropertyDetailPage({ propertyId }) {
  const analytics = usePropertyAnalytics(propertyId);
  
  return (
    <div>
      <ImageGallery onImageView={analytics.trackPhotoView} />
      <ContactForm onSubmit={analytics.trackInquiry} />
      <BookingWidget onAttempt={analytics.trackBookingAttempt} />
      <ShareButton onClick={() => analytics.trackShare('twitter')} />
    </div>
  );
}
```

## 🔧 Cloud Functions

### Available Functions
- `trackUserInteraction` - Record user actions
- `getPropertyAnalytics` - Retrieve analytics data
- `updatePopularityScores` - Daily batch calculation (automated)
- `onBookingCreated` - Update analytics on booking (automated)

### Manual Function Call
```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

const getAnalytics = httpsCallable(functions, 'getPropertyAnalytics');
const result = await getAnalytics({ propertyId, userId });
```

## 📈 Dashboard Components

### Analytics Dashboard
```typescript
<PropertyAnalyticsDashboard 
  propertyId="property123"
  propertyName="My Villa"
/>
```

### Metric Cards
```typescript
<MetricCard
  title="Total Views"
  value={analytics.views.total}
  icon={<Visibility />}
  growth={calculateGrowth(current, previous)}
/>
```

## ⚡ Performance Tips

### Caching
```typescript
// React Query auto-caching
const { data } = usePropertyAnalytics(propertyId, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000  // 10 minutes
});
```

### Batch Tracking
```typescript
// Enable batch processing for better performance
useEffect(() => {
  analyticsService.enableBatchTracking();
}, []);
```

### Error Handling
```typescript
try {
  await analytics.trackPropertyView(propertyId);
} catch (error) {
  console.warn('Analytics tracking failed:', error);
  // Continue without breaking UX
}
```

## 🐛 Common Issues & Fixes

### Issue: Analytics not loading
```typescript
// Check authentication
const { currentUser } = useAuth();
if (!currentUser) {
  return <LoginRequired />;
}

// Check property ownership
if (property.ownerId !== currentUser.uid) {
  return <Unauthorized />;
}
```

### Issue: Tracking not working
```typescript
// Verify analytics service initialization
useEffect(() => {
  analyticsService.enableAutoTracking();
}, []);

// Check network connectivity
const isOnline = navigator.onLine;
if (!isOnline) {
  // Queue events for later
}
```

### Issue: Slow performance
```typescript
// Use memoization
const analytics = useMemo(() => 
  calculateAnalytics(data), [data]
);

// Implement pagination
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['analytics'],
  queryFn: fetchAnalyticsPage
});
```

## 📱 Mobile Considerations

### Device Detection
```typescript
// Automatic device type detection
const deviceType = /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

// Include in tracking metadata
analytics.trackPropertyView(propertyId, referrer, { deviceType });
```

### Responsive Dashboard
```typescript
// Mobile-optimized analytics cards
<Grid item xs={12} sm={6} md={3}>
  <MetricCard responsive />
</Grid>
```

## 🔒 Security & Privacy

### User Consent
```typescript
// Check analytics consent
const hasConsent = localStorage.getItem('analytics_consent') === 'true';
if (hasConsent) {
  analytics.trackPropertyView(propertyId);
}
```

### Data Anonymization
```typescript
// Anonymous session tracking
const sessionId = generateAnonymousId();
analytics.trackInteraction({ sessionId, /* ... */ });
```

## 🎨 Styling & Theming

### Custom Metric Cards
```typescript
<MetricCard
  title="Custom Metric"
  value="85%"
  color="#4caf50"
  icon={<CustomIcon />}
  sx={{ customStyles }}
/>
```

### Theme Integration
```typescript
import { Colors } from '../constants';

<Typography color={Colors.blue}>
  Analytics Dashboard
</Typography>
```

## 📊 Export & Reporting

### Export Analytics Data
```typescript
const exportAnalytics = async (propertyId: string) => {
  const analytics = await getPropertyAnalytics({ propertyId, userId });
  const csv = convertToCSV(analytics);
  downloadFile(csv, `analytics-${propertyId}.csv`);
};
```

### Print-Friendly Reports
```typescript
<Box className="print-only">
  <AnalyticsSummaryReport data={analytics} />
</Box>
```

---

**💡 Pro Tips:**
- Monitor metrics weekly for best results
- Focus on conversion rate and CTR improvements
- Respond to reviews to boost popularity score
- Update photos regularly to maintain engagement
- Use A/B testing for pricing optimization

**📞 Need Help?**
- Check the full documentation: `ANALYTICS_DOCUMENTATION.md`
- Review Firebase Console logs for errors
- Contact development team for support
