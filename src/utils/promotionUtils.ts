import { RoomPromotion, RoomType } from '../hooks/propertyHooks';

export interface PromotionCalculation {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  savings: number;
  isPromotionApplied: boolean;
}

/**
 * Calculate promotional pricing for a room
 */
export const calculatePromotionalPrice = (
  room: RoomType,
  checkInDate?: string,
  checkOutDate?: string,
  numberOfNights?: number,
  propertyPromotions?: RoomPromotion[]
): PromotionCalculation => {
  const originalPrice = room.pricePerNight;
  
  // Default result when no promotion applies
  const defaultResult: PromotionCalculation = {
    originalPrice,
    discountAmount: 0,
    finalPrice: originalPrice,
    savings: 0,
    isPromotionApplied: false
  };

  // Check if room has a promotion
  if ((!room.promotion || !room.promotion.isActive) && (!propertyPromotions || !propertyPromotions.some(p => p.isActive))) {
    return defaultResult;
  }
  
  // Use room promotion if available, otherwise use property promotion
  const promotion = room.promotion?.isActive ? room.promotion : 
    propertyPromotions?.find(p => p.isActive);
    
  if (!promotion) {
    return defaultResult;
  }

  // Check date validity
  if (checkInDate && promotion) {
    const checkIn = new Date(checkInDate);
    const promotionStart = new Date(promotion.startDate);
    const promotionEnd = new Date(promotion.endDate);
    
    if (checkIn < promotionStart || checkIn > promotionEnd) {
      return defaultResult;
    }

    // Check blackout dates
    if (promotion.blackoutDates && promotion.blackoutDates.length > 0) {
      const checkInStr = checkInDate.split('T')[0]; // Get YYYY-MM-DD format
      if (promotion.blackoutDates.includes(checkInStr)) {
        return defaultResult;
      }
    }

    // Check day of week restrictions
    if (promotion.daysOfWeek && promotion.daysOfWeek.length > 0) {
      const dayOfWeek = checkIn.getDay(); // 0 = Sunday, 6 = Saturday
      if (!promotion.daysOfWeek.includes(dayOfWeek)) {
        return defaultResult;
      }
    }
  }

  // Check minimum/maximum nights requirements
  if (numberOfNights && promotion) {
    if (promotion.minNights && numberOfNights < promotion.minNights) {
      return defaultResult;
    }
    if (promotion.maxNights && numberOfNights > promotion.maxNights) {
      return defaultResult;
    }
  }
  
  if (!promotion) {
    return defaultResult;
  }

  // Calculate discount
  let discountAmount = 0;
  
  if (promotion.discountType === 'percentage') {
    discountAmount = (originalPrice * promotion.discountValue) / 100;
  } else if (promotion.discountType === 'fixed') {
    discountAmount = Math.min(promotion.discountValue, originalPrice); // Can't discount more than the price
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const savings = originalPrice - finalPrice;

  return {
    originalPrice,
    discountAmount,
    finalPrice,
    savings,
    isPromotionApplied: true
  };
};

/**
 * Check if a promotion is currently active and valid
 */
export const isPromotionValid = (promotion: RoomPromotion, date: string = new Date().toISOString()): boolean => {
  if (!promotion.isActive) return false;

  const currentDate = new Date(date);
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  return currentDate >= startDate && currentDate <= endDate;
};

/**
 * Format promotion discount text for display
 */
export const formatPromotionDiscount = (promotion: RoomPromotion): string => {
  if (promotion.discountType === 'percentage') {
    return `${promotion.discountValue}% OFF`;
  } else {
    return `$${promotion.discountValue} OFF`;
  }
};

/**
 * Get promotion badge color based on discount amount
 */
export const getPromotionBadgeColor = (promotion: RoomPromotion): string => {
  if (promotion.discountType === 'percentage') {
    if (promotion.discountValue >= 30) return '#ff4444'; // High discount - red
    if (promotion.discountValue >= 15) return '#ff8800'; // Medium discount - orange
    return '#4caf50'; // Low discount - green
  } else {
    if (promotion.discountValue >= 100) return '#ff4444';
    if (promotion.discountValue >= 50) return '#ff8800';
    return '#4caf50';
  }
};
