// Fraud Detection Service
// This service analyzes booking patterns and user behavior to detect potential fraud

export interface FraudAnalysis {
  riskScore: number; // 0-100 (100 = highest risk)
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: FraudFlag[];
  recommendation: 'approve' | 'review' | 'reject' | 'hold';
  confidence: number; // 0-1 (1 = highest confidence)
}

export interface FraudFlag {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: any;
}

export interface BookingData {
  id: string;
  guest: {
    name: string;
    email: string;
    phone?: string;
    registrationDate: string;
    previousBookings: number;
    cancellationRate: number;
    verificationStatus: 'verified' | 'pending' | 'unverified';
    paymentMethods: number;
    ipAddress?: string;
    deviceFingerprint?: string;
  };
  host: {
    name: string;
    email: string;
    propertyCount: number;
    rating: number;
    responseRate: number;
  };
  booking: {
    checkIn: string;
    checkOut: string;
    bookingDate: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    guests: number;
    duration: number; // nights
    pricePerNight: number;
    lastMinute: boolean; // booked within 24 hours
    timeToCheckIn: number; // hours until check-in
  };
  property: {
    id: string;
    averagePrice: number;
    location: string;
    rating: number;
    reviewCount: number;
  };
  payment: {
    cardType?: string;
    cardCountry?: string;
    billingCountry?: string;
    paymentAttempts: number;
    previousDeclines: number;
  };
}

export class FraudDetectionService {
  private static instance: FraudDetectionService;
  
  // Fraud patterns and thresholds
  private readonly RISK_THRESHOLDS = {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 80,
    CRITICAL: 95
  };

  public static getInstance(): FraudDetectionService {
    if (!FraudDetectionService.instance) {
      FraudDetectionService.instance = new FraudDetectionService();
    }
    return FraudDetectionService.instance;
  }

  public analyzeBooking(data: BookingData): FraudAnalysis {
    const flags: FraudFlag[] = [];
    let totalScore = 0;
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Run all fraud detection checks
    const checks = [
      this.checkNewUserRisk(data),
      this.checkPaymentRisk(data),
      this.checkBookingPatterns(data),
      this.checkPricingAnomalies(data),
      this.checkTimeRisk(data),
      this.checkLocationRisk(data),
      this.checkBehaviorRisk(data),
      this.checkHostRisk(data),
      this.checkVelocityRisk(data),
      this.checkDeviceRisk(data)
    ];

    checks.forEach(check => {
      if (check) {
        flags.push(check);
        const severityScore = this.getSeverityScore(check.severity);
        totalScore += severityScore;
        
        if (this.getSeverityLevel(check.severity) > this.getSeverityLevel(maxSeverity)) {
          maxSeverity = check.severity;
        }
      }
    });

    // Calculate final risk score (0-100)
    const riskScore = Math.min(100, totalScore);
    const riskLevel = this.calculateRiskLevel(riskScore);
    const recommendation = this.getRecommendation(riskScore, flags);
    const confidence = this.calculateConfidence(flags, data);

    return {
      riskScore,
      riskLevel,
      flags,
      recommendation,
      confidence
    };
  }

  private checkNewUserRisk(data: BookingData): FraudFlag | null {
    const { guest } = data;
    const daysSinceRegistration = this.daysBetween(guest.registrationDate, new Date().toISOString());
    
    if (daysSinceRegistration < 1 && data.booking.amount > 500) {
      return {
        type: 'new_user_high_value',
        severity: 'high',
        description: 'New user making high-value booking within 24 hours of registration',
        evidence: { daysSinceRegistration, amount: data.booking.amount }
      };
    }
    
    if (daysSinceRegistration < 7 && guest.verificationStatus === 'unverified') {
      return {
        type: 'new_unverified_user',
        severity: 'medium',
        description: 'New unverified user making booking',
        evidence: { daysSinceRegistration, verificationStatus: guest.verificationStatus }
      };
    }

    return null;
  }

  private checkPaymentRisk(data: BookingData): FraudFlag | null {
    const { payment, booking } = data;

    if (payment.previousDeclines > 2) {
      return {
        type: 'multiple_payment_declines',
        severity: 'critical',
        description: 'Multiple previous payment declines detected',
        evidence: { declines: payment.previousDeclines }
      };
    }

    if (payment.paymentAttempts > 3) {
      return {
        type: 'multiple_payment_attempts',
        severity: 'high',
        description: 'Multiple payment attempts for this booking',
        evidence: { attempts: payment.paymentAttempts }
      };
    }

    if (payment.billingCountry && payment.cardCountry && payment.billingCountry !== payment.cardCountry) {
      return {
        type: 'country_mismatch',
        severity: 'medium',
        description: 'Payment card country differs from billing country',
        evidence: { cardCountry: payment.cardCountry, billingCountry: payment.billingCountry }
      };
    }

    return null;
  }

  private checkBookingPatterns(data: BookingData): FraudFlag | null {
    const { booking, guest } = data;

    // Check for unusual booking patterns
    if (booking.duration === 1 && booking.amount > 1000) {
      return {
        type: 'high_value_single_night',
        severity: 'medium',
        description: 'High-value booking for single night stay',
        evidence: { duration: booking.duration, amount: booking.amount }
      };
    }

    // Check guest count vs. booking value
    const valuePerGuest = booking.amount / booking.guests;
    if (valuePerGuest > 500 && booking.guests === 1) {
      return {
        type: 'high_value_single_guest',
        severity: 'medium',
        description: 'Very high value booking for single guest',
        evidence: { valuePerGuest, guests: booking.guests }
      };
    }

    // Check cancellation history
    if (guest.cancellationRate > 0.5 && guest.previousBookings > 3) {
      return {
        type: 'high_cancellation_rate',
        severity: 'high',
        description: 'User has high cancellation rate history',
        evidence: { cancellationRate: guest.cancellationRate, previousBookings: guest.previousBookings }
      };
    }

    return null;
  }

  private checkPricingAnomalies(data: BookingData): FraudFlag | null {
    const { booking, property } = data;
    
    // Check if booking price is significantly above market rate
    const priceRatio = booking.pricePerNight / property.averagePrice;
    
    if (priceRatio > 3) {
      return {
        type: 'price_significantly_above_market',
        severity: 'high',
        description: 'Booking price is significantly above market rate',
        evidence: { bookingPrice: booking.pricePerNight, marketPrice: property.averagePrice, ratio: priceRatio }
      };
    }

    // Check for round number pricing (often fake)
    if (booking.amount % 100 === 0 && booking.amount > 1000) {
      return {
        type: 'suspicious_round_pricing',
        severity: 'low',
        description: 'Booking amount is a suspicious round number',
        evidence: { amount: booking.amount }
      };
    }

    return null;
  }

  private checkTimeRisk(data: BookingData): FraudFlag | null {
    const { booking } = data;

    // Check for immediate booking (potential testing)
    if (booking.timeToCheckIn < 2) {
      return {
        type: 'immediate_checkin',
        severity: 'high',
        description: 'Booking with immediate check-in (potential testing)',
        evidence: { timeToCheckIn: booking.timeToCheckIn }
      };
    }

    // Check for last-minute high-value booking
    if (booking.lastMinute && booking.amount > 2000) {
      return {
        type: 'last_minute_high_value',
        severity: 'medium',
        description: 'High-value last-minute booking',
        evidence: { amount: booking.amount, lastMinute: booking.lastMinute }
      };
    }

    return null;
  }

  private checkLocationRisk(data: BookingData): FraudFlag | null {
    // This would typically integrate with IP geolocation and known fraud locations
    // For now, we'll implement basic checks
    
    const { guest } = data;

    // Check for VPN/Proxy indicators (simplified)
    if (guest.ipAddress && this.isHighRiskIP(guest.ipAddress)) {
      return {
        type: 'high_risk_ip',
        severity: 'medium',
        description: 'Booking from high-risk IP address or VPN',
        evidence: { ipAddress: guest.ipAddress }
      };
    }

    return null;
  }

  private checkBehaviorRisk(data: BookingData): FraudFlag | null {
    const { guest } = data;

    // Check for rapid successive bookings
    if (guest.previousBookings === 0 && data.booking.amount > 1500) {
      return {
        type: 'first_booking_high_value',
        severity: 'medium',
        description: 'First booking is unusually high value',
        evidence: { amount: data.booking.amount, isFirstBooking: true }
      };
    }

    // Check for unusual email patterns
    if (this.isDisposableEmail(guest.email)) {
      return {
        type: 'disposable_email',
        severity: 'high',
        description: 'User registered with disposable email address',
        evidence: { email: guest.email }
      };
    }

    return null;
  }

  private checkHostRisk(data: BookingData): FraudFlag | null {
    const { host } = data;

    // Check for new host with poor metrics
    if (host.propertyCount === 1 && host.rating < 3 && host.responseRate < 0.5) {
      return {
        type: 'high_risk_host',
        severity: 'medium',
        description: 'Booking with high-risk host profile',
        evidence: { 
          propertyCount: host.propertyCount, 
          rating: host.rating, 
          responseRate: host.responseRate 
        }
      };
    }

    return null;
  }

  private checkVelocityRisk(data: BookingData): FraudFlag | null {
    // This would check for rapid booking patterns across the platform
    // Implementation would require access to recent booking history
    
    // Placeholder for velocity checking
    return null;
  }

  private checkDeviceRisk(data: BookingData): FraudFlag | null {
    const { guest } = data;

    // Check for device fingerprint anomalies
    if (guest.deviceFingerprint && this.isHighRiskDevice(guest.deviceFingerprint)) {
      return {
        type: 'high_risk_device',
        severity: 'medium',
        description: 'Booking from device with suspicious characteristics',
        evidence: { deviceFingerprint: guest.deviceFingerprint }
      };
    }

    return null;
  }

  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'low': return 10;
      case 'medium': return 25;
      case 'high': return 40;
      case 'critical': return 60;
      default: return 0;
    }
  }

  private getSeverityLevel(severity: string): number {
    switch (severity) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'critical': return 4;
      default: return 0;
    }
  }

  private calculateRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= this.RISK_THRESHOLDS.CRITICAL) return 'critical';
    if (score >= this.RISK_THRESHOLDS.HIGH) return 'high';
    if (score >= this.RISK_THRESHOLDS.MEDIUM) return 'medium';
    return 'low';
  }

  private getRecommendation(score: number, flags: FraudFlag[]): 'approve' | 'review' | 'reject' | 'hold' {
    const hasCriticalFlags = flags.some(f => f.severity === 'critical');
    
    if (hasCriticalFlags || score >= this.RISK_THRESHOLDS.CRITICAL) {
      return 'reject';
    }
    if (score >= this.RISK_THRESHOLDS.HIGH) {
      return 'hold';
    }
    if (score >= this.RISK_THRESHOLDS.MEDIUM) {
      return 'review';
    }
    return 'approve';
  }

  private calculateConfidence(flags: FraudFlag[], data: BookingData): number {
    // Calculate confidence based on data completeness and flag consistency
    let confidence = 0.7; // Base confidence
    
    // Increase confidence with more data points
    if (data.guest.previousBookings > 0) confidence += 0.1;
    if (data.guest.verificationStatus === 'verified') confidence += 0.1;
    if (data.payment.cardType) confidence += 0.05;
    if (data.guest.ipAddress) confidence += 0.05;
    
    // Decrease confidence with conflicting signals
    const severities = flags.map(f => f.severity);
    const hasConflictingSeverities = severities.includes('low') && severities.includes('critical');
    if (hasConflictingSeverities) confidence -= 0.2;
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  // Helper methods
  private daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private isHighRiskIP(ip: string): boolean {
    // Simplified check - in real implementation, this would check against
    // databases of known VPN/proxy/fraud IPs
    const highRiskPatterns = ['10.0.', '192.168.', '127.0.'];
    return highRiskPatterns.some(pattern => ip.startsWith(pattern));
  }

  private isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  }

  private isHighRiskDevice(fingerprint: string): boolean {
    // Simplified device risk check
    // Real implementation would analyze device characteristics
    return fingerprint.includes('suspicious') || fingerprint.length < 10;
  }

  // Machine Learning Integration (placeholder)
  public trainModel(trainingData: { booking: BookingData; isFraud: boolean }[]): void {
    // This would integrate with ML models for more sophisticated fraud detection
    console.log('Training fraud detection model with', trainingData.length, 'samples');
  }

  // Real-time monitoring
  public monitorBookingInRealTime(bookingId: string): void {
    // This would set up real-time monitoring for suspicious activities
    console.log('Setting up real-time monitoring for booking:', bookingId);
  }
}
