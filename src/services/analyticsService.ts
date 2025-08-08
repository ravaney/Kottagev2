import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { useEffect } from 'react';

// Analytics service for tracking user interactions
export class AnalyticsService {
  // Track completed booking
  public trackBookingCompleted(
    propertyId: string,
    roomId: string,
    userId: string,
    totalPrice: number,
    guests: number,
    checkIn: string,
    checkOut: string
  ): void {
    this.trackInteraction({
      propertyId,
      action: 'booking_completed',
      metadata: {
        roomId,
        userId,
        totalPrice,
        guests,
        checkIn,
        checkOut,
        deviceType: this.getDeviceType(),
      },
    });
  }
  private static instance: AnalyticsService;
  private sessionId: string;
  private pageStartTime: number = 0;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent
      )
    ) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Track property view
  public trackPropertyView(propertyId: string, referrer?: string): void {
    this.pageStartTime = Date.now();
    this.trackInteraction({
      propertyId,
      action: 'view',
      metadata: {
        referrer: referrer || document.referrer,
        deviceType: this.getDeviceType(),
      },
    });
  }

  // Track when user leaves property page (to calculate time on page)
  public trackPropertyExit(propertyId: string): void {
    if (this.pageStartTime > 0) {
      const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000);
      this.trackInteraction({
        propertyId,
        action: 'view',
        metadata: {
          timeOnPage,
          deviceType: this.getDeviceType(),
        },
      });
    }
  }

  // Track search impression (property shown in search results)
  public trackSearchImpression(
    propertyId: string,
    searchQuery: string,
    position: number
  ): void {
    this.trackInteraction({
      propertyId,
      action: 'search_impression',
      metadata: {
        searchQuery,
        searchPosition: position,
        deviceType: this.getDeviceType(),
      },
    });
  }

  // Track click from search results
  public trackSearchClick(
    propertyId: string,
    searchQuery: string,
    position: number
  ): void {
    this.trackInteraction({
      propertyId,
      action: 'click',
      metadata: {
        searchQuery,
        searchPosition: position,
        deviceType: this.getDeviceType(),
      },
    });
  }

  // Track photo view
  public trackPhotoView(propertyId: string, photoIndex: number): void {
    this.trackInteraction({
      propertyId,
      action: 'photo_view',
      metadata: {
        photoIndex,
        deviceType: this.getDeviceType(),
      },
    });
  }

  // Track inquiry submission
  public trackInquiry(propertyId: string): void {
    this.trackInteraction({
      propertyId,
      action: 'inquiry',
      metadata: {
        deviceType: this.getDeviceType(),
      },
    });
  }

  // Track wishlist/save action
  public trackWishlist(propertyId: string): void {
    this.trackInteraction({
      propertyId,
      action: 'wishlist',
      metadata: {
        deviceType: this.getDeviceType(),
      },
    });
  }

  // Track share action
  public trackShare(propertyId: string, platform?: string): void {
    this.trackInteraction({
      propertyId,
      action: 'share',
      metadata: {
        platform,
        deviceType: this.getDeviceType(),
      },
    });
  }

  // Track booking attempt
  public trackBookingAttempt(propertyId: string): void {
    this.trackInteraction({
      propertyId,
      action: 'booking_attempt',
      metadata: {
        deviceType: this.getDeviceType(),
      },
    });
  }

  // Generic interaction tracking
  private async trackInteraction(interaction: {
    propertyId: string;
    action: string;
    metadata?: any;
  }): Promise<void> {
    try {
      // Skip analytics in development to avoid CORS issues
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics tracking skipped in development:', interaction);
        return;
      }

      const trackUserInteraction = httpsCallable(
        functions,
        'trackUserInteraction'
      );

      await trackUserInteraction({
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        ...interaction,
      });
    } catch (error) {
      console.warn('Failed to track interaction:', error);
      // Don't throw error to avoid breaking user experience
    }
  }

  // Batch tracking for performance (optional enhancement)
  private interactionQueue: any[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  public enableBatchTracking(): void {
    // Override trackInteraction to use batching
    const originalTrack = this.trackInteraction.bind(this);

    this.trackInteraction = async (interaction: any): Promise<void> => {
      this.interactionQueue.push({
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        ...interaction,
      });

      // Clear existing timeout
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      // Set new timeout to flush queue
      this.batchTimeout = setTimeout(() => {
        this.flushInteractionQueue();
      }, 2000); // Flush every 2 seconds
    };
  }

  private async flushInteractionQueue(): Promise<void> {
    if (this.interactionQueue.length === 0) return;

    const interactions = [...this.interactionQueue];
    this.interactionQueue = [];

    try {
      // Skip analytics in development to avoid CORS issues
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'Analytics queue flushing skipped in development:',
          interactions
        );
        return;
      }

      // Send all interactions in batch
      const trackUserInteraction = httpsCallable(
        functions,
        'trackUserInteraction'
      );

      await Promise.all(
        interactions.map(interaction => trackUserInteraction(interaction))
      );
    } catch (error) {
      console.warn('Failed to flush interaction queue:', error);
    }
  }

  // Auto-track page visibility changes
  public enableAutoTracking(): void {
    // Track when user switches tabs or minimizes window
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.pageStartTime > 0) {
        // User left the page, track time spent
        const currentUrl = window.location.pathname;
        const propertyIdMatch = currentUrl.match(/\/property\/([^\/]+)/);

        if (propertyIdMatch) {
          this.trackPropertyExit(propertyIdMatch[1]);
        }
      }
    });

    // Track when user is about to leave the page
    window.addEventListener('beforeunload', () => {
      if (this.pageStartTime > 0) {
        const currentUrl = window.location.pathname;
        const propertyIdMatch = currentUrl.match(/\/property\/([^\/]+)/);

        if (propertyIdMatch) {
          this.trackPropertyExit(propertyIdMatch[1]);
        }
      }
    });
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();

// React hook for easy integration
export const usePropertyAnalytics = (propertyId: string, referrer?: string) => {
  useEffect(() => {
    if (propertyId) {
      analyticsService.trackPropertyView(propertyId, referrer);

      // Return cleanup function to track exit
      return () => {
        analyticsService.trackPropertyExit(propertyId);
      };
    }
  }, [propertyId, referrer]);

  return {
    trackPhotoView: (photoIndex: number) =>
      analyticsService.trackPhotoView(propertyId, photoIndex),
    trackInquiry: () => analyticsService.trackInquiry(propertyId),
    trackWishlist: () => analyticsService.trackWishlist(propertyId),
    trackShare: (platform?: string) =>
      analyticsService.trackShare(propertyId, platform),
    trackBookingAttempt: () => analyticsService.trackBookingAttempt(propertyId),
  };
};

// Hook for search results tracking
export const useSearchAnalytics = () => {
  return {
    trackSearchImpression: (
      propertyId: string,
      searchQuery: string,
      position: number
    ) =>
      analyticsService.trackSearchImpression(propertyId, searchQuery, position),
    trackSearchClick: (
      propertyId: string,
      searchQuery: string,
      position: number
    ) => analyticsService.trackSearchClick(propertyId, searchQuery, position),
  };
};
