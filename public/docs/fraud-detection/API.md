# Fraud Detection API Reference

## Table of Contents

1. [Service Instance](#service-instance)
2. [Core Methods](#core-methods)
3. [Data Interfaces](#data-interfaces)
4. [Response Types](#response-types)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

## Service Instance

### FraudDetectionService

The fraud detection service follows the Singleton pattern to ensure consistent state across the application.

```typescript
import { FraudDetectionService } from '../utils/fraudDetection';

// Get service instance
const fraudService = FraudDetectionService.getInstance();
```

## Core Methods

### analyzeBooking(data: BookingData): FraudAnalysis

Performs comprehensive fraud analysis on booking data.

**Parameters:**
- `data` (BookingData): Complete booking information including guest, host, property, and payment details

**Returns:** FraudAnalysis object containing:
- Risk score (0-100)
- Risk level classification
- Array of fraud flags
- Recommendation action
- Confidence score

**Example:**
```typescript
const analysis = fraudService.analyzeBooking({
  id: 'BK-1001',
  guest: {
    name: 'John Doe',
    email: 'john@example.com',
    registrationDate: '2023-07-01',
    previousBookings: 0,
    cancellationRate: 0,
    verificationStatus: 'unverified',
    paymentMethods: 1
  },
  // ... other booking data
});

console.log(analysis.riskScore); // 45
console.log(analysis.recommendation); // 'review'
```

### trainModel(trainingData: TrainingData[]): void

Trains the fraud detection model with historical data.

**Parameters:**
- `trainingData` (TrainingData[]): Array of booking data with fraud labels

**Example:**
```typescript
const trainingData = [
  {
    booking: bookingData1,
    isFraud: true
  },
  {
    booking: bookingData2,
    isFraud: false
  }
  // ... more training examples
];

fraudService.trainModel(trainingData);
```

### monitorBookingInRealTime(bookingId: string): void

Sets up real-time monitoring for a specific booking.

**Parameters:**
- `bookingId` (string): Unique booking identifier

**Example:**
```typescript
fraudService.monitorBookingInRealTime('BK-1001');
```

## Data Interfaces

### BookingData

Complete booking information required for fraud analysis.

```typescript
interface BookingData {
  id: string;
  guest: GuestData;
  host: HostData;
  booking: BookingDetails;
  property: PropertyData;
  payment: PaymentData;
}
```

### GuestData

Guest-related information for fraud analysis.

```typescript
interface GuestData {
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;           // ISO date string
  previousBookings: number;           // Total number of previous bookings
  cancellationRate: number;           // 0-1 (0 = never cancels, 1 = always cancels)
  verificationStatus: 'verified' | 'pending' | 'unverified';
  paymentMethods: number;             // Number of payment methods on file
  ipAddress?: string;                 // IP address used for booking
  deviceFingerprint?: string;         // Device fingerprint identifier
}
```

### HostData

Host-related information for risk assessment.

```typescript
interface HostData {
  name: string;
  email: string;
  propertyCount: number;              // Number of properties managed
  rating: number;                     // 0-5 star rating
  responseRate: number;               // 0-1 response rate
}
```

### BookingDetails

Specific booking information.

```typescript
interface BookingDetails {
  checkIn: string;                    // ISO date string
  checkOut: string;                   // ISO date string
  bookingDate: string;                // ISO date string
  amount: number;                     // Total booking amount
  currency: string;                   // Currency code (e.g., 'USD')
  paymentMethod: string;              // Payment method used
  guests: number;                     // Number of guests
  duration: number;                   // Number of nights
  pricePerNight: number;              // Average price per night
  lastMinute: boolean;                // Booked within 24 hours
  timeToCheckIn: number;              // Hours until check-in
}
```

### PropertyData

Property-related information.

```typescript
interface PropertyData {
  id: string;
  averagePrice: number;               // Market average price
  location: string;                   // Property location
  rating: number;                     // Property rating
  reviewCount: number;                // Number of reviews
}
```

### PaymentData

Payment-related information for fraud detection.

```typescript
interface PaymentData {
  cardType?: string;                  // Credit card type
  cardCountry?: string;               // Card issuing country
  billingCountry?: string;            // Billing address country
  paymentAttempts: number;            // Number of payment attempts
  previousDeclines: number;           // Previous payment declines
}
```

## Response Types

### FraudAnalysis

Main response object from fraud analysis.

```typescript
interface FraudAnalysis {
  riskScore: number;                  // 0-100 risk score
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: FraudFlag[];                 // Array of detected fraud flags
  recommendation: 'approve' | 'review' | 'reject' | 'hold';
  confidence: number;                 // 0-1 confidence level
}
```

### FraudFlag

Individual fraud detection flag.

```typescript
interface FraudFlag {
  type: string;                       // Flag type identifier
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;                // Human-readable description
  evidence: any;                      // Supporting evidence
}
```

## Fraud Flag Types

### User-Related Flags

| Flag Type | Severity | Description |
|-----------|----------|-------------|
| `new_user_high_value` | High | New user making expensive booking |
| `new_unverified_user` | Medium | Unverified user booking within 7 days |
| `high_cancellation_rate` | High | User with high cancellation history |
| `first_booking_high_value` | Medium | First booking is unusually expensive |
| `disposable_email` | High | User with disposable email address |

### Payment-Related Flags

| Flag Type | Severity | Description |
|-----------|----------|-------------|
| `multiple_payment_declines` | Critical | Multiple previous payment failures |
| `multiple_payment_attempts` | High | Multiple attempts for current booking |
| `country_mismatch` | Medium | Card and billing country mismatch |

### Booking Pattern Flags

| Flag Type | Severity | Description |
|-----------|----------|-------------|
| `high_value_single_night` | Medium | Expensive single-night booking |
| `high_value_single_guest` | Medium | High cost per guest |
| `immediate_checkin` | High | Check-in within 2 hours |
| `last_minute_high_value` | Medium | Last-minute expensive booking |

### Pricing Flags

| Flag Type | Severity | Description |
|-----------|----------|-------------|
| `price_significantly_above_market` | High | Price >3x market average |
| `suspicious_round_pricing` | Low | Suspicious round number pricing |

### Technical Flags

| Flag Type | Severity | Description |
|-----------|----------|-------------|
| `high_risk_ip` | Medium | VPN/proxy or high-risk IP |
| `high_risk_device` | Medium | Suspicious device characteristics |
| `high_risk_host` | Medium | Host with poor metrics |

## Error Handling

### Common Errors

```typescript
try {
  const analysis = fraudService.analyzeBooking(bookingData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid booking data:', error.message);
  } else if (error instanceof ServiceError) {
    console.error('Service error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Validation Requirements

Required fields for fraud analysis:
- `guest.email`
- `guest.registrationDate`
- `booking.amount`
- `booking.checkIn`
- `booking.checkOut`
- `payment.paymentAttempts`

## Examples

### Basic Fraud Analysis

```typescript
import { FraudDetectionService } from '../utils/fraudDetection';

const fraudService = FraudDetectionService.getInstance();

const bookingData = {
  id: 'BK-2001',
  guest: {
    name: 'Jane Smith',
    email: 'jane@tempmail.org',  // Disposable email
    registrationDate: '2023-07-19',  // Today
    previousBookings: 0,
    cancellationRate: 0,
    verificationStatus: 'unverified',
    paymentMethods: 1,
    ipAddress: '192.168.1.100'
  },
  host: {
    name: 'Host User',
    email: 'host@example.com',
    propertyCount: 5,
    rating: 4.5,
    responseRate: 0.95
  },
  booking: {
    checkIn: '2023-07-19',  // Same day
    checkOut: '2023-07-20',
    bookingDate: '2023-07-19',
    amount: 1500,  // High value
    currency: 'USD',
    paymentMethod: 'Credit Card',
    guests: 1,
    duration: 1,
    pricePerNight: 1500,
    lastMinute: true,
    timeToCheckIn: 1  // Immediate
  },
  property: {
    id: 'PROP-001',
    averagePrice: 200,
    location: 'City Center',
    rating: 4.0,
    reviewCount: 50
  },
  payment: {
    cardType: 'Visa',
    cardCountry: 'US',
    billingCountry: 'US',
    paymentAttempts: 1,
    previousDeclines: 0
  }
};

const analysis = fraudService.analyzeBooking(bookingData);

console.log('Fraud Analysis Results:');
console.log('Risk Score:', analysis.riskScore);  // ~85
console.log('Risk Level:', analysis.riskLevel);  // 'high'
console.log('Recommendation:', analysis.recommendation);  // 'hold'
console.log('Flags:', analysis.flags.map(f => f.type));
// ['disposable_email', 'new_user_high_value', 'immediate_checkin', 'high_value_single_night']
```

### Automatic Booking Processing

```typescript
function processBooking(bookingData) {
  const analysis = fraudService.analyzeBooking(bookingData);
  
  switch (analysis.recommendation) {
    case 'approve':
      return approveBookingAutomatically(bookingData);
      
    case 'review':
      return flagForManualReview(bookingData, analysis);
      
    case 'hold':
      return holdBookingForInvestigation(bookingData, analysis);
      
    case 'reject':
      return rejectBookingWithReason(bookingData, analysis);
      
    default:
      throw new Error('Unknown recommendation');
  }
}

function approveBookingAutomatically(booking) {
  booking.status = 'confirmed';
  booking.fraudChecked = true;
  return saveBooking(booking);
}

function flagForManualReview(booking, analysis) {
  booking.status = 'pending_review';
  booking.fraudScore = analysis.riskScore;
  booking.fraudFlags = analysis.flags;
  notifyStaffForReview(booking);
  return saveBooking(booking);
}
```

### Batch Processing

```typescript
async function processBatchBookings(bookings) {
  const results = [];
  
  for (const booking of bookings) {
    try {
      const analysis = fraudService.analyzeBooking(booking);
      results.push({
        bookingId: booking.id,
        analysis,
        processed: true
      });
    } catch (error) {
      results.push({
        bookingId: booking.id,
        error: error.message,
        processed: false
      });
    }
  }
  
  return results;
}
```

### Integration with Booking Flow

```typescript
// In your booking creation endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Create initial booking record
    const booking = await createBooking(bookingData);
    
    // Run fraud analysis
    const fraudAnalysis = fraudService.analyzeBooking(bookingData);
    
    // Update booking based on fraud analysis
    booking.fraudScore = fraudAnalysis.riskScore;
    booking.fraudFlags = fraudAnalysis.flags.map(f => f.type);
    
    switch (fraudAnalysis.recommendation) {
      case 'approve':
        booking.status = 'confirmed';
        break;
      case 'review':
        booking.status = 'pending_review';
        await notifyStaffForReview(booking, fraudAnalysis);
        break;
      case 'hold':
        booking.status = 'on_hold';
        await notifySecurityTeam(booking, fraudAnalysis);
        break;
      case 'reject':
        booking.status = 'rejected';
        booking.rejectionReason = 'Fraud prevention';
        break;
    }
    
    await booking.save();
    
    res.json({
      booking,
      fraudAnalysis: {
        riskScore: fraudAnalysis.riskScore,
        riskLevel: fraudAnalysis.riskLevel,
        recommendation: fraudAnalysis.recommendation
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
