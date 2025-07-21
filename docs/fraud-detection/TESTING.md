# Fraud Detection Testing Guide

## Overview

This document provides comprehensive testing strategies for the fraud detection system, including unit tests, integration tests, and end-to-end testing scenarios.

## Test Structure

```
tests/
├── unit/
│   ├── fraudDetection.test.ts
│   ├── fraudAlgorithms.test.ts
│   └── fraudUtils.test.ts
├── integration/
│   ├── bookingFraud.test.ts
│   ├── fraudWorkflow.test.ts
│   └── fraudAPI.test.ts
├── e2e/
│   ├── fraudScenarios.test.ts
│   └── fraudDashboard.test.ts
├── fixtures/
│   ├── mockBookings.ts
│   ├── fraudCases.ts
│   └── testData.ts
└── utils/
    ├── testHelpers.ts
    └── mockServices.ts
```

## Unit Tests

### Fraud Detection Service Tests

```typescript
// tests/unit/fraudDetection.test.ts
import { FraudDetectionService, BookingData } from '../../src/utils/fraudDetection';
import { createMockBookingData } from '../fixtures/mockBookings';

describe('FraudDetectionService', () => {
  let fraudService: FraudDetectionService;

  beforeEach(() => {
    fraudService = FraudDetectionService.getInstance();
  });

  afterEach(() => {
    // Reset service state
    fraudService.clearCache();
  });

  describe('analyzeBooking', () => {
    test('should return low risk for legitimate booking', () => {
      const bookingData = createMockBookingData({
        guestEmail: 'john.doe@gmail.com',
        registrationDate: '2023-01-01T00:00:00Z',
        previousBookings: 5,
        verificationStatus: 'verified',
        amount: 150,
        paymentMethod: 'credit_card',
        cancellationRate: 0.1
      });

      const analysis = fraudService.analyzeBooking(bookingData);

      expect(analysis.riskScore).toBeLessThan(30);
      expect(analysis.riskLevel).toBe('low');
      expect(analysis.recommendation).toBe('approve');
      expect(analysis.flags).toHaveLength(0);
    });

    test('should detect disposable email fraud', () => {
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
        previousBookings: 0,
        amount: 1000,
        verificationStatus: 'unverified'
      });

      const analysis = fraudService.analyzeBooking(bookingData);

      expect(analysis.flags.some(f => f.type === 'new_user_high_value')).toBe(true);
      expect(analysis.riskLevel).toBe('high');
    });

    test('should detect payment mismatch', () => {
      const bookingData = createMockBookingData({
        billingCountry: 'US',
        cardCountry: 'NG'
      });

      const analysis = fraudService.analyzeBooking(bookingData);

      expect(analysis.flags.some(f => f.type === 'payment_country_mismatch')).toBe(true);
    });

    test('should handle missing data gracefully', () => {
      const incompleteData: Partial<BookingData> = {
        id: 'test-123',
        guest: {
          email: 'test@example.com'
        }
      };

      expect(() => {
        fraudService.analyzeBooking(incompleteData as BookingData);
      }).not.toThrow();
    });
  });

  describe('fraud algorithms', () => {
    test('checkNewUserRisk should flag new users correctly', () => {
      const newUser = createMockBookingData({
        registrationDate: new Date().toISOString(),
        previousBookings: 0
      });

      const analysis = fraudService.analyzeBooking(newUser);
      const newUserFlag = analysis.flags.find(f => f.type === 'new_user_risk');

      expect(newUserFlag).toBeDefined();
      expect(newUserFlag?.severity).toBe('medium');
    });

    test('checkLastMinuteBooking should detect last minute bookings', () => {
      const lastMinuteBooking = createMockBookingData({
        lastMinute: true,
        timeToCheckIn: 2 // 2 hours
      });

      const analysis = fraudService.analyzeBooking(lastMinuteBooking);
      const lastMinuteFlag = analysis.flags.find(f => f.type === 'last_minute_booking');

      expect(lastMinuteFlag).toBeDefined();
    });

    test('checkPaymentRisk should flag multiple payment attempts', () => {
      const riskyPayment = createMockBookingData({
        paymentAttempts: 5,
        previousDeclines: 3
      });

      const analysis = fraudService.analyzeBooking(riskyPayment);
      const paymentFlag = analysis.flags.find(f => f.type === 'payment_risk');

      expect(paymentFlag).toBeDefined();
      expect(paymentFlag?.severity).toBe('high');
    });
  });

  describe('risk scoring', () => {
    test('should calculate correct risk score for multiple flags', () => {
      const riskyBooking = createMockBookingData({
        guestEmail: 'test@10minutemail.com', // +25 points
        registrationDate: new Date().toISOString(), // +15 points
        previousBookings: 0,
        paymentAttempts: 3, // +15 points
        lastMinute: true // +10 points
      });

      const analysis = fraudService.analyzeBooking(riskyBooking);

      expect(analysis.riskScore).toBeGreaterThanOrEqual(65);
      expect(analysis.riskLevel).toBe('high');
    });

    test('should cap risk score at 100', () => {
      const extremelyRiskyBooking = createMockBookingData({
        guestEmail: 'fake@guerrillamail.com',
        registrationDate: new Date().toISOString(),
        previousBookings: 0,
        cancellationRate: 1.0,
        paymentAttempts: 10,
        previousDeclines: 5,
        lastMinute: true,
        amount: 5000,
        verificationStatus: 'unverified'
      });

      const analysis = fraudService.analyzeBooking(extremelyRiskyBooking);

      expect(analysis.riskScore).toBeLessThanOrEqual(100);
    });
  });
});
```

### Algorithm-Specific Tests

```typescript
// tests/unit/fraudAlgorithms.test.ts
import { FraudDetectionService } from '../../src/utils/fraudDetection';
import { createMockBookingData } from '../fixtures/mockBookings';

describe('Fraud Detection Algorithms', () => {
  let fraudService: FraudDetectionService;

  beforeEach(() => {
    fraudService = FraudDetectionService.getInstance();
  });

  describe('Email validation', () => {
    const disposableEmails = [
      'test@10minutemail.com',
      'user@guerrillamail.com',
      'fake@tempmail.org',
      'spam@mailinator.com'
    ];

    test.each(disposableEmails)('should detect disposable email: %s', (email) => {
      const bookingData = createMockBookingData({ guestEmail: email });
      const analysis = fraudService.analyzeBooking(bookingData);

      expect(analysis.flags.some(f => f.type === 'disposable_email')).toBe(true);
    });

    test('should allow legitimate emails', () => {
      const legitimateEmails = [
        'user@gmail.com',
        'customer@outlook.com',
        'guest@yahoo.com',
        'booking@company.co.uk'
      ];

      legitimateEmails.forEach(email => {
        const bookingData = createMockBookingData({ guestEmail: email });
        const analysis = fraudService.analyzeBooking(bookingData);

        expect(analysis.flags.some(f => f.type === 'disposable_email')).toBe(false);
      });
    });
  });

  describe('High cancellation rate detection', () => {
    test('should flag users with high cancellation rates', () => {
      const testCases = [
        { rate: 0.8, shouldFlag: true },
        { rate: 0.6, shouldFlag: true },
        { rate: 0.4, shouldFlag: false },
        { rate: 0.2, shouldFlag: false }
      ];

      testCases.forEach(({ rate, shouldFlag }) => {
        const bookingData = createMockBookingData({
          cancellationRate: rate,
          previousBookings: 10 // Ensure enough history
        });

        const analysis = fraudService.analyzeBooking(bookingData);
        const hasCancellationFlag = analysis.flags.some(f => f.type === 'high_cancellation_rate');

        expect(hasCancellationFlag).toBe(shouldFlag);
      });
    });
  });

  describe('Price anomaly detection', () => {
    test('should detect suspiciously low prices', () => {
      const bookingData = createMockBookingData({
        amount: 10, // Very low price
        averagePrice: 200, // Normal market price
        duration: 3
      });

      const analysis = fraudService.analyzeBooking(bookingData);
      const priceAnomalyFlag = analysis.flags.find(f => f.type === 'price_anomaly');

      expect(priceAnomalyFlag).toBeDefined();
      expect(priceAnomalyFlag?.evidence).toContain('significantly below market rate');
    });

    test('should detect suspiciously high prices', () => {
      const bookingData = createMockBookingData({
        amount: 2000, // Very high price
        averagePrice: 200, // Normal market price
        duration: 2
      });

      const analysis = fraudService.analyzeBooking(bookingData);
      const priceAnomalyFlag = analysis.flags.find(f => f.type === 'price_anomaly');

      expect(priceAnomalyFlag).toBeDefined();
      expect(priceAnomalyFlag?.evidence).toContain('significantly above market rate');
    });
  });
});
```

## Integration Tests

### Booking Workflow Integration

```typescript
// tests/integration/bookingFraud.test.ts
import { processFraudAnalysis, approveBooking, rejectBooking } from '../../src/services/bookingService';
import { createTestBooking } from '../fixtures/testData';

describe('Booking Fraud Integration', () => {
  beforeEach(async () => {
    // Set up test database
    await setupTestDatabase();
  });

  afterEach(async () => {
    // Clean up test data
    await cleanupTestDatabase();
  });

  test('should approve legitimate booking automatically', async () => {
    const legitimateBooking = await createTestBooking({
      guestEmail: 'verified.user@gmail.com',
      registrationDate: '2022-01-01T00:00:00Z',
      previousBookings: 8,
      verificationStatus: 'verified',
      amount: 180,
      paymentMethod: 'credit_card',
      cancellationRate: 0.1
    });

    const result = await processFraudAnalysis(legitimateBooking);

    expect(result.action).toBe('approved');
    expect(result.booking.status).toBe('confirmed');
    expect(result.booking.fraudScore).toBeLessThan(30);
    expect(result.booking.fraudChecked).toBe(true);
  });

  test('should flag suspicious booking for review', async () => {
    const suspiciousBooking = await createTestBooking({
      guestEmail: 'newuser@tempmail.org',
      registrationDate: new Date().toISOString(),
      previousBookings: 0,
      verificationStatus: 'unverified',
      amount: 800,
      lastMinute: true
    });

    const result = await processFraudAnalysis(suspiciousBooking);

    expect(result.action).toBe('review_required');
    expect(result.booking.status).toBe('pending_fraud_review');
    expect(result.booking.fraudScore).toBeGreaterThan(50);
    expect(result.notificationSent).toBe(true);
  });

  test('should reject high-risk booking automatically', async () => {
    const fraudulentBooking = await createTestBooking({
      guestEmail: 'scammer@10minutemail.com',
      registrationDate: new Date().toISOString(),
      previousBookings: 0,
      verificationStatus: 'unverified',
      amount: 2000,
      paymentAttempts: 8,
      previousDeclines: 5,
      cancellationRate: 1.0
    });

    const result = await processFraudAnalysis(fraudulentBooking);

    expect(result.action).toBe('rejected');
    expect(result.booking.status).toBe('rejected');
    expect(result.booking.fraudScore).toBeGreaterThan(80);
    expect(result.securityAlertSent).toBe(true);
  });

  test('should handle concurrent fraud analysis requests', async () => {
    const bookings = await Promise.all([
      createTestBooking({ guestEmail: 'user1@example.com' }),
      createTestBooking({ guestEmail: 'user2@example.com' }),
      createTestBooking({ guestEmail: 'user3@example.com' })
    ]);

    const results = await Promise.all(
      bookings.map(booking => processFraudAnalysis(booking))
    );

    expect(results).toHaveLength(3);
    results.forEach(result => {
      expect(result.booking.fraudChecked).toBe(true);
      expect(result.booking.fraudScore).toBeGreaterThanOrEqual(0);
    });
  });
});
```

### API Integration Tests

```typescript
// tests/integration/fraudAPI.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { createAuthToken } from '../utils/testHelpers';

describe('Fraud Detection API', () => {
  let authToken: string;

  beforeEach(async () => {
    authToken = await createAuthToken('admin');
  });

  describe('POST /api/bookings/:id/fraud-analysis', () => {
    test('should run fraud analysis on existing booking', async () => {
      const booking = await createTestBooking();

      const response = await request(app)
        .post(`/api/bookings/${booking.id}/fraud-analysis`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('riskScore');
      expect(response.body).toHaveProperty('riskLevel');
      expect(response.body).toHaveProperty('recommendation');
      expect(response.body).toHaveProperty('flags');
    });

    test('should return 404 for non-existent booking', async () => {
      await request(app)
        .post('/api/bookings/non-existent/fraud-analysis')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    test('should require admin authorization', async () => {
      const booking = await createTestBooking();

      await request(app)
        .post(`/api/bookings/${booking.id}/fraud-analysis`)
        .expect(401);
    });
  });

  describe('GET /api/fraud/dashboard', () => {
    test('should return fraud dashboard data', async () => {
      const response = await request(app)
        .get('/api/fraud/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalBookings');
      expect(response.body).toHaveProperty('highRiskCount');
      expect(response.body).toHaveProperty('mediumRiskCount');
      expect(response.body).toHaveProperty('recentAlerts');
      expect(response.body).toHaveProperty('riskDistribution');
    });
  });

  describe('GET /api/fraud/patterns', () => {
    test('should return fraud patterns for analysis', async () => {
      const response = await request(app)
        .get('/api/fraud/patterns')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ timeRange: '7d' })
        .expect(200);

      expect(response.body).toHaveProperty('patterns');
      expect(response.body.patterns).toBeInstanceOf(Array);
    });
  });
});
```

## End-to-End Tests

### Complete Fraud Detection Scenarios

```typescript
// tests/e2e/fraudScenarios.test.ts
import { Browser, Page } from 'puppeteer';
import { setupBrowser, createTestUser, createTestProperty } from '../utils/e2eHelpers';

describe('Fraud Detection E2E Scenarios', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await setupBrowser();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should detect and flag fraudulent booking attempt', async () => {
    // Create a suspicious user profile
    const suspiciousUser = await createTestUser({
      email: 'scammer@tempmail.org',
      registrationDate: new Date(),
      verified: false
    });

    // Create a high-value property
    const property = await createTestProperty({
      pricePerNight: 500,
      location: 'Premium Location'
    });

    // Navigate to booking page
    await page.goto(`/property/${property.id}`);

    // Log in as suspicious user
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', suspiciousUser.email);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-submit"]');

    // Attempt to make a booking
    await page.click('[data-testid="book-now-button"]');
    await page.fill('[data-testid="checkin-date"]', getTomorrowDate());
    await page.fill('[data-testid="checkout-date"]', getDayAfterTomorrowDate());
    await page.fill('[data-testid="guests-count"]', '2');

    // Submit booking
    await page.click('[data-testid="confirm-booking"]');

    // Wait for fraud analysis to complete
    await page.waitForSelector('[data-testid="fraud-analysis-result"]', { timeout: 10000 });

    // Verify fraud detection kicked in
    const fraudAlert = await page.$('[data-testid="fraud-alert"]');
    expect(fraudAlert).toBeTruthy();

    const alertText = await page.textContent('[data-testid="fraud-alert"]');
    expect(alertText).toContain('additional verification required');
  });

  test('should allow legitimate booking to proceed', async () => {
    // Create a legitimate user profile
    const legitimateUser = await createTestUser({
      email: 'verified.customer@gmail.com',
      registrationDate: new Date('2022-01-01'),
      verified: true,
      bookingHistory: 5
    });

    const property = await createTestProperty({
      pricePerNight: 150,
      location: 'Standard Location'
    });

    // Navigate and login
    await page.goto(`/property/${property.id}`);
    await loginUser(page, legitimateUser);

    // Make booking
    await makeBooking(page, {
      checkin: getTomorrowDate(),
      checkout: getDayAfterTomorrowDate(),
      guests: 2
    });

    // Should proceed to payment without fraud alerts
    await page.waitForSelector('[data-testid="payment-form"]');
    
    const fraudAlert = await page.$('[data-testid="fraud-alert"]');
    expect(fraudAlert).toBeFalsy();

    const bookingStatus = await page.textContent('[data-testid="booking-status"]');
    expect(bookingStatus).toContain('confirmed');
  });
});
```

### Staff Dashboard E2E Tests

```typescript
// tests/e2e/fraudDashboard.test.ts
describe('Fraud Detection Dashboard E2E', () => {
  test('should display fraud alerts to staff', async () => {
    // Create high-risk bookings
    await createHighRiskBookings(3);

    // Login as staff member
    await page.goto('/staff/login');
    await loginStaff(page, 'security@company.com');

    // Navigate to fraud dashboard
    await page.click('[data-testid="fraud-dashboard-link"]');

    // Verify fraud alerts are displayed
    await page.waitForSelector('[data-testid="fraud-alerts"]');
    
    const alertCount = await page.$$eval(
      '[data-testid="fraud-alert-item"]',
      items => items.length
    );
    
    expect(alertCount).toBeGreaterThanOrEqual(3);
  });

  test('should allow staff to review and approve flagged booking', async () => {
    const flaggedBooking = await createFlaggedBooking();

    await page.goto('/staff/fraud-review');
    await loginStaff(page, 'reviewer@company.com');

    // Find the flagged booking
    await page.click(`[data-testid="review-booking-${flaggedBooking.id}"]`);

    // Review fraud analysis details
    await page.waitForSelector('[data-testid="fraud-analysis-details"]');
    
    const riskScore = await page.textContent('[data-testid="risk-score"]');
    expect(riskScore).toBeTruthy();

    // Approve the booking
    await page.click('[data-testid="approve-booking-button"]');
    await page.fill('[data-testid="approval-reason"]', 'Customer verified via phone');
    await page.click('[data-testid="confirm-approval"]');

    // Verify booking status changed
    await page.waitForSelector('[data-testid="booking-approved"]');
    const statusText = await page.textContent('[data-testid="booking-status"]');
    expect(statusText).toContain('approved');
  });
});
```

## Test Data and Fixtures

### Mock Booking Data Factory

```typescript
// tests/fixtures/mockBookings.ts
export interface MockBookingOptions {
  guestEmail?: string;
  registrationDate?: string;
  previousBookings?: number;
  verificationStatus?: 'verified' | 'unverified';
  amount?: number;
  paymentMethod?: string;
  cancellationRate?: number;
  lastMinute?: boolean;
  paymentAttempts?: number;
  previousDeclines?: number;
  billingCountry?: string;
  cardCountry?: string;
  duration?: number;
  averagePrice?: number;
  timeToCheckIn?: number;
}

export function createMockBookingData(options: MockBookingOptions = {}): BookingData {
  const defaults = {
    guestEmail: 'user@example.com',
    registrationDate: '2023-01-01T00:00:00Z',
    previousBookings: 3,
    verificationStatus: 'verified' as const,
    amount: 200,
    paymentMethod: 'credit_card',
    cancellationRate: 0.1,
    lastMinute: false,
    paymentAttempts: 1,
    previousDeclines: 0,
    billingCountry: 'US',
    cardCountry: 'US',
    duration: 3,
    averagePrice: 180,
    timeToCheckIn: 24
  };

  const config = { ...defaults, ...options };

  return {
    id: `booking-${Date.now()}-${Math.random()}`,
    guest: {
      name: 'Test User',
      email: config.guestEmail,
      registrationDate: config.registrationDate,
      previousBookings: config.previousBookings,
      cancellationRate: config.cancellationRate,
      verificationStatus: config.verificationStatus,
      paymentMethods: 1,
      ipAddress: '192.168.1.1',
      deviceFingerprint: 'test-device-123'
    },
    host: {
      name: 'Test Host',
      email: 'host@example.com',
      propertyCount: 5,
      rating: 4.5,
      responseRate: 0.95
    },
    booking: {
      checkIn: '2024-02-01T15:00:00Z',
      checkOut: '2024-02-04T11:00:00Z',
      bookingDate: '2024-01-15T10:00:00Z',
      amount: config.amount,
      currency: 'USD',
      paymentMethod: config.paymentMethod,
      guests: 2,
      duration: config.duration,
      pricePerNight: config.amount / config.duration,
      lastMinute: config.lastMinute,
      timeToCheckIn: config.timeToCheckIn
    },
    property: {
      id: 'property-123',
      averagePrice: config.averagePrice,
      location: 'Test City, TC',
      rating: 4.2,
      reviewCount: 25
    },
    payment: {
      cardType: 'visa',
      cardCountry: config.cardCountry,
      billingCountry: config.billingCountry,
      paymentAttempts: config.paymentAttempts,
      previousDeclines: config.previousDeclines
    }
  };
}
```

### Test Scenarios

```typescript
// tests/fixtures/fraudCases.ts
export const FRAUD_TEST_CASES = {
  legitimate: {
    description: 'Legitimate booking from verified user',
    data: {
      guestEmail: 'john.doe@gmail.com',
      registrationDate: '2022-06-15T00:00:00Z',
      previousBookings: 8,
      verificationStatus: 'verified',
      amount: 180,
      cancellationRate: 0.05
    },
    expectedRiskLevel: 'low',
    expectedFlags: 0
  },

  disposableEmail: {
    description: 'Booking with disposable email address',
    data: {
      guestEmail: 'temp@10minutemail.com',
      amount: 200
    },
    expectedFlags: ['disposable_email'],
    expectedRiskLevel: 'medium'
  },

  newUserHighValue: {
    description: 'New user making high-value booking',
    data: {
      registrationDate: new Date().toISOString(),
      previousBookings: 0,
      verificationStatus: 'unverified',
      amount: 1500
    },
    expectedFlags: ['new_user_risk', 'new_user_high_value'],
    expectedRiskLevel: 'high'
  },

  suspiciousPayment: {
    description: 'Multiple payment attempts from different countries',
    data: {
      paymentAttempts: 5,
      previousDeclines: 3,
      billingCountry: 'US',
      cardCountry: 'NG'
    },
    expectedFlags: ['payment_risk', 'payment_country_mismatch'],
    expectedRiskLevel: 'high'
  },

  combinedRisk: {
    description: 'Multiple risk factors combined',
    data: {
      guestEmail: 'fake@guerrillamail.com',
      registrationDate: new Date().toISOString(),
      previousBookings: 0,
      amount: 2000,
      paymentAttempts: 4,
      cancellationRate: 1.0,
      lastMinute: true
    },
    expectedRiskLevel: 'critical',
    expectedRecommendation: 'reject'
  }
};
```

## Test Utilities

### Test Helpers

```typescript
// tests/utils/testHelpers.ts
export async function createTestDatabase() {
  // Set up test database with clean state
  await db.query('BEGIN');
  await db.query('DELETE FROM bookings WHERE id LIKE \'test-%\'');
  await db.query('DELETE FROM users WHERE email LIKE \'%@test.example\'');
  await db.query('COMMIT');
}

export async function cleanupTestDatabase() {
  await db.query('BEGIN');
  await db.query('DELETE FROM fraud_incidents WHERE booking_id LIKE \'test-%\'');
  await db.query('DELETE FROM bookings WHERE id LIKE \'test-%\'');
  await db.query('DELETE FROM users WHERE email LIKE \'%@test.example\'');
  await db.query('COMMIT');
}

export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function getDayAfterTomorrowDate(): string {
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  return dayAfter.toISOString().split('T')[0];
}

export async function waitForFraudAnalysis(bookingId: string, timeout = 5000): Promise<any> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const booking = await getBookingById(bookingId);
    
    if (booking.fraudChecked) {
      return booking.fraudAnalysis;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`Fraud analysis did not complete within ${timeout}ms`);
}
```

## Running Tests

### Test Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:fraud": "jest tests/unit/fraudDetection.test.ts",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:fraud-scenarios": "jest tests/fixtures/fraudCases --verbose"
  }
}
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageReporters: ['text', 'html', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000
};
```

### Test Setup

```typescript
// tests/setup.ts
import { FraudDetectionService } from '../src/utils/fraudDetection';

beforeEach(() => {
  // Clear fraud service cache before each test
  const fraudService = FraudDetectionService.getInstance();
  fraudService.clearCache();
});

afterAll(async () => {
  // Clean up any test data
  await cleanupTestDatabase();
});

// Mock external services for testing
jest.mock('../src/services/emailService', () => ({
  sendAlert: jest.fn(),
  sendNotification: jest.fn()
}));

jest.mock('../src/services/slackService', () => ({
  sendSlackAlert: jest.fn()
}));
```

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/fraud-tests.yml
name: Fraud Detection Tests

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'src/utils/fraudDetection.ts'
      - 'src/components/BookingManagement.tsx'
      - 'tests/unit/fraudDetection.test.ts'
  pull_request:
    branches: [ main ]

jobs:
  fraud-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run fraud detection unit tests
      run: npm run test:fraud
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

This comprehensive testing guide ensures that your fraud detection system is thoroughly tested at all levels, from individual algorithms to complete user workflows.
