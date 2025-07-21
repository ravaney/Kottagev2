# Fraud Detection Implementation Guide

## Quick Start

This guide will help you integrate the fraud detection system into your booking platform.

## Prerequisites

- Node.js 16+ with TypeScript support
- Material-UI v5 for UI components
- React 18+ for frontend components

## Installation

The fraud detection system is already included in your project. No additional packages are required.

## Basic Integration

### 1. Import the Service

```typescript
import { FraudDetectionService, BookingData } from '../utils/fraudDetection';
```

### 2. Initialize the Service

```typescript
const fraudService = FraudDetectionService.getInstance();
```

### 3. Analyze a Booking

```typescript
const analysis = fraudService.analyzeBooking(bookingData);
```

## Step-by-Step Implementation

### Step 1: Prepare Booking Data

Create a `BookingData` object with all available information:

```typescript
const bookingData: BookingData = {
  id: booking.id,
  guest: {
    name: booking.guestName,
    email: booking.guestEmail,
    registrationDate: user.createdAt,
    previousBookings: user.bookingCount,
    cancellationRate: user.cancellationRate || 0,
    verificationStatus: user.isVerified ? 'verified' : 'unverified',
    paymentMethods: user.paymentMethods.length,
    ipAddress: req.ip, // From request
    deviceFingerprint: req.headers['x-device-fingerprint']
  },
  host: {
    name: host.name,
    email: host.email,
    propertyCount: host.properties.length,
    rating: host.averageRating,
    responseRate: host.responseRate
  },
  booking: {
    checkIn: booking.checkInDate,
    checkOut: booking.checkOutDate,
    bookingDate: booking.createdAt,
    amount: booking.totalAmount,
    currency: booking.currency,
    paymentMethod: booking.paymentMethod,
    guests: booking.guestCount,
    duration: calculateNights(booking.checkInDate, booking.checkOutDate),
    pricePerNight: booking.totalAmount / duration,
    lastMinute: isLastMinute(booking.checkInDate, booking.createdAt),
    timeToCheckIn: hoursUntilCheckIn(booking.checkInDate)
  },
  property: {
    id: property.id,
    averagePrice: property.averageNightlyRate,
    location: property.location,
    rating: property.averageRating,
    reviewCount: property.reviews.length
  },
  payment: {
    cardType: payment.cardType,
    cardCountry: payment.cardCountry,
    billingCountry: payment.billingCountry,
    paymentAttempts: payment.attemptCount || 1,
    previousDeclines: user.paymentDeclines || 0
  }
};
```

### Step 2: Run Fraud Analysis

```typescript
try {
  const analysis = fraudService.analyzeBooking(bookingData);
  
  console.log('Fraud Analysis Complete:');
  console.log('Risk Score:', analysis.riskScore);
  console.log('Risk Level:', analysis.riskLevel);
  console.log('Recommendation:', analysis.recommendation);
  console.log('Confidence:', analysis.confidence);
  console.log('Flags:', analysis.flags.length);
  
} catch (error) {
  console.error('Fraud analysis failed:', error);
  // Handle error appropriately
}
```

### Step 3: Handle Results

Based on the analysis results, take appropriate action:

```typescript
function handleFraudAnalysis(booking, analysis) {
  // Store fraud analysis results
  booking.fraudScore = analysis.riskScore;
  booking.fraudLevel = analysis.riskLevel;
  booking.fraudFlags = analysis.flags.map(flag => ({
    type: flag.type,
    severity: flag.severity,
    description: flag.description,
    evidence: flag.evidence
  }));
  
  // Take action based on recommendation
  switch (analysis.recommendation) {
    case 'approve':
      return approveBooking(booking);
      
    case 'review':
      return flagForReview(booking, analysis);
      
    case 'hold':
      return holdBooking(booking, analysis);
      
    case 'reject':
      return rejectBooking(booking, analysis);
      
    default:
      throw new Error(`Unknown recommendation: ${analysis.recommendation}`);
  }
}

async function approveBooking(booking) {
  booking.status = 'confirmed';
  booking.fraudChecked = true;
  booking.fraudCheckDate = new Date();
  
  await booking.save();
  
  // Send confirmation email
  await sendBookingConfirmation(booking);
  
  return { status: 'approved', booking };
}

async function flagForReview(booking, analysis) {
  booking.status = 'pending_fraud_review';
  booking.reviewRequired = true;
  booking.fraudAnalysis = analysis;
  
  await booking.save();
  
  // Notify staff for manual review
  await notifyStaffForReview(booking, analysis);
  
  return { status: 'review_required', booking };
}

async function holdBooking(booking, analysis) {
  booking.status = 'on_hold';
  booking.holdReason = 'fraud_prevention';
  booking.fraudAnalysis = analysis;
  
  await booking.save();
  
  // Notify security team
  await notifySecurityTeam(booking, analysis);
  
  return { status: 'on_hold', booking };
}

async function rejectBooking(booking, analysis) {
  booking.status = 'rejected';
  booking.rejectionReason = 'fraud_prevention';
  booking.fraudAnalysis = analysis;
  
  await booking.save();
  
  // Log fraud attempt
  await logFraudAttempt(booking, analysis);
  
  // Send rejection email (without revealing fraud detection)
  await sendBookingRejection(booking, 'Unable to process booking');
  
  return { status: 'rejected', booking };
}
```

## Advanced Integration

### Real-time Monitoring

Set up real-time fraud monitoring for high-risk bookings:

```typescript
async function setupRealtimeMonitoring(booking, analysis) {
  if (analysis.riskScore >= 60) {
    // Enable real-time monitoring
    fraudService.monitorBookingInRealTime(booking.id);
    
    // Set up periodic re-evaluation
    const monitoringInterval = setInterval(async () => {
      const updatedAnalysis = fraudService.analyzeBooking(
        await getUpdatedBookingData(booking.id)
      );
      
      if (updatedAnalysis.riskScore !== analysis.riskScore) {
        await handleRiskScoreChange(booking, updatedAnalysis);
      }
      
      // Stop monitoring after check-in
      if (booking.status === 'checked_in') {
        clearInterval(monitoringInterval);
      }
    }, 30 * 60 * 1000); // Check every 30 minutes
  }
}
```

### Batch Processing

Process multiple bookings efficiently:

```typescript
async function processBatchFraudAnalysis(bookings) {
  const batchSize = 10;
  const results = [];
  
  for (let i = 0; i < bookings.length; i += batchSize) {
    const batch = bookings.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (booking) => {
      try {
        const bookingData = await convertToBookingData(booking);
        const analysis = fraudService.analyzeBooking(bookingData);
        
        return {
          bookingId: booking.id,
          success: true,
          analysis
        };
      } catch (error) {
        return {
          bookingId: booking.id,
          success: false,
          error: error.message
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to avoid overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}
```

### Webhook Integration

Integrate with external fraud prevention services:

```typescript
async function integrateWithExternalFraudService(booking, analysis) {
  if (analysis.riskScore >= 80) {
    try {
      // Send to external fraud service
      const externalAnalysis = await callExternalFraudAPI({
        bookingId: booking.id,
        guestEmail: booking.guestEmail,
        amount: booking.totalAmount,
        ipAddress: booking.ipAddress
      });
      
      // Combine results
      const combinedScore = Math.max(analysis.riskScore, externalAnalysis.riskScore);
      
      if (combinedScore >= 90) {
        return rejectBooking(booking, analysis);
      }
      
    } catch (error) {
      console.error('External fraud service error:', error);
      // Continue with internal analysis only
    }
  }
  
  return handleFraudAnalysis(booking, analysis);
}
```

## Database Schema Updates

Add fraud-related fields to your booking model:

```sql
-- Add fraud tracking columns to bookings table
ALTER TABLE bookings ADD COLUMN fraud_score INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN fraud_level VARCHAR(20) DEFAULT 'low';
ALTER TABLE bookings ADD COLUMN fraud_flags JSON;
ALTER TABLE bookings ADD COLUMN fraud_checked BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN fraud_check_date TIMESTAMP;
ALTER TABLE bookings ADD COLUMN fraud_analysis JSON;

-- Create fraud incidents table
CREATE TABLE fraud_incidents (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  incident_type VARCHAR(50),
  severity VARCHAR(20),
  description TEXT,
  evidence JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  resolved_by INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'open'
);

-- Create fraud patterns table for ML training
CREATE TABLE fraud_patterns (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  pattern_type VARCHAR(50),
  pattern_data JSON,
  is_fraud BOOLEAN,
  verified_at TIMESTAMP,
  verified_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Configuration

Add fraud detection configuration to your environment:

```env
# Fraud Detection Settings
FRAUD_DETECTION_ENABLED=true
FRAUD_AUTO_REJECT_THRESHOLD=85
FRAUD_AUTO_APPROVE_THRESHOLD=30
FRAUD_MONITORING_ENABLED=true

# External Services
EXTERNAL_FRAUD_API_URL=https://api.fraudservice.com
EXTERNAL_FRAUD_API_KEY=your_api_key

# Notification Settings
FRAUD_ALERT_EMAIL=security@yourcompany.com
FRAUD_SLACK_WEBHOOK=https://hooks.slack.com/services/...
```

## Testing

### Unit Tests

```typescript
import { FraudDetectionService } from '../utils/fraudDetection';

describe('Fraud Detection Service', () => {
  let fraudService: FraudDetectionService;
  
  beforeEach(() => {
    fraudService = FraudDetectionService.getInstance();
  });
  
  test('should detect disposable email', () => {
    const bookingData = createMockBookingData({
      guestEmail: 'test@10minutemail.com'
    });
    
    const analysis = fraudService.analyzeBooking(bookingData);
    
    expect(analysis.flags.some(f => f.type === 'disposable_email')).toBe(true);
    expect(analysis.riskScore).toBeGreaterThan(30);
  });
  
  test('should flag new user high value booking', () => {
    const bookingData = createMockBookingData({
      registrationDate: new Date().toISOString(),
      bookingAmount: 1000,
      previousBookings: 0
    });
    
    const analysis = fraudService.analyzeBooking(bookingData);
    
    expect(analysis.flags.some(f => f.type === 'new_user_high_value')).toBe(true);
    expect(analysis.riskLevel).toBe('high');
  });
});
```

### Integration Tests

```typescript
describe('Booking Fraud Integration', () => {
  test('should process booking with fraud analysis', async () => {
    const booking = await createTestBooking({
      guestEmail: 'legitimate@gmail.com',
      amount: 200,
      verificationStatus: 'verified'
    });
    
    const result = await processBookingWithFraudCheck(booking);
    
    expect(result.status).toBe('approved');
    expect(result.booking.fraudChecked).toBe(true);
    expect(result.booking.fraudScore).toBeLessThan(30);
  });
});
```

## Monitoring and Alerts

### Set up monitoring dashboard

```typescript
// Monitor fraud detection performance
async function getFraudMetrics(timeRange) {
  const metrics = await db.query(`
    SELECT 
      COUNT(*) as total_bookings,
      COUNT(CASE WHEN fraud_score >= 80 THEN 1 END) as high_risk,
      COUNT(CASE WHEN fraud_score >= 60 THEN 1 END) as medium_risk,
      AVG(fraud_score) as avg_fraud_score,
      COUNT(CASE WHEN status = 'rejected' AND rejection_reason = 'fraud_prevention' THEN 1 END) as rejected_for_fraud
    FROM bookings 
    WHERE created_at >= $1
  `, [timeRange.start]);
  
  return metrics[0];
}
```

### Set up alerting

```typescript
async function checkFraudAlerts() {
  const recentHighRisk = await db.query(`
    SELECT COUNT(*) as count
    FROM bookings 
    WHERE fraud_score >= 80 
    AND created_at >= NOW() - INTERVAL '1 hour'
  `);
  
  if (recentHighRisk[0].count >= 5) {
    await sendAlert({
      type: 'fraud_spike',
      message: `High fraud activity detected: ${recentHighRisk[0].count} high-risk bookings in the last hour`,
      urgency: 'high'
    });
  }
}
```

## Best Practices

1. **Always validate input data** before fraud analysis
2. **Store fraud analysis results** for audit trails
3. **Implement proper error handling** for service failures
4. **Monitor false positive rates** and adjust thresholds
5. **Regularly update fraud patterns** based on new threats
6. **Respect user privacy** when logging fraud data
7. **Provide clear feedback** to legitimate users if additional verification is needed

## Troubleshooting

### Common Issues

**High False Positive Rate**
```typescript
// Adjust thresholds or add whitelist
const whitelistedDomains = ['gmail.com', 'outlook.com', 'yahoo.com'];
if (whitelistedDomains.includes(emailDomain)) {
  analysis.riskScore *= 0.8; // Reduce risk for trusted domains
}
```

**Performance Issues**
```typescript
// Implement caching
const analysisCache = new Map();
const cacheKey = `fraud_${booking.id}_${booking.updatedAt}`;

if (analysisCache.has(cacheKey)) {
  return analysisCache.get(cacheKey);
}

const analysis = fraudService.analyzeBooking(bookingData);
analysisCache.set(cacheKey, analysis);
```

**Missing Data**
```typescript
// Handle incomplete data gracefully
function createBookingData(booking) {
  return {
    // Required fields
    id: booking.id,
    guest: {
      email: booking.guestEmail,
      registrationDate: booking.user?.createdAt || new Date().toISOString(),
      // Optional fields with defaults
      previousBookings: booking.user?.bookingCount || 0,
      cancellationRate: booking.user?.cancellationRate || 0,
      verificationStatus: booking.user?.isVerified ? 'verified' : 'unverified'
    }
    // ... other fields with appropriate defaults
  };
}
```
