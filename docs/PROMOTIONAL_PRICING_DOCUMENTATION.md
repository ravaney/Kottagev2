# Promotional Pricing System Documentation

## Overview
The promotional pricing system is a comprehensive solution that allows property owners to create dynamic discounts and special offers for their room types. The system supports percentage-based and fixed-amount discounts with flexible conditions, automatic calculations, and real-time display updates.

**Status**: ✅ Fully Implemented and Production Ready  
**Last Updated**: July 21, 2025  
**Version**: 1.0.0

## Features

### 1. Discount Types
- **Percentage Discount**: Offers a percentage off the original price (e.g., 20% off)
- **Fixed Amount Discount**: Offers a fixed dollar amount off (e.g., $50 off per night)

### 2. Promotion Conditions
- **Date Range**: Set start and end dates for the promotion
- **Minimum/Maximum Nights**: Require specific stay lengths
- **Day of Week Restrictions**: Limit to specific days (e.g., weekdays only)
- **Blackout Dates**: Exclude specific dates from the promotion
- **Active/Inactive Status**: Enable or disable promotions instantly

### 3. Visual Features
- **Promotional Badges**: Eye-catching badges on room cards showing discount amount
- **Strike-through Pricing**: Original price crossed out with new price highlighted
- **Savings Display**: Clear indication of money saved
- **Promotion Details**: Information boxes explaining the offer

## Implementation

### Data Structure

```typescript
interface RoomPromotion {
  id: string;                    // Unique promotion identifier
  name: string;                  // Display name (e.g., "Early Bird Special")
  description?: string;          // Optional detailed description
  discountType: 'percentage' | 'fixed';  // Type of discount
  discountValue: number;         // Percentage (0-100) or fixed amount
  startDate: string;             // ISO date string
  endDate: string;               // ISO date string
  isActive: boolean;             // Enable/disable toggle
  minNights?: number;            // Minimum stay requirement
  maxNights?: number;            // Maximum stay requirement
  daysOfWeek?: number[];         // Array of day numbers (0=Sunday, 6=Saturday)
  blackoutDates?: string[];      // Array of excluded dates (YYYY-MM-DD format)
}
```

### Adding Promotions to Room Types

Add the `promotion` field to any room type in your Firebase database:

```json
{
  "kottages": {
    "your-kottage-id": {
      "roomTypes": {
        "room-id": {
          "name": "Standard Room",
          "pricePerNight": 150,
          "promotion": {
            "id": "summer-special-2025",
            "name": "Summer Special",
            "description": "Beat the heat with our summer discount!",
            "discountType": "percentage",
            "discountValue": 25,
            "startDate": "2025-06-01T00:00:00Z",
            "endDate": "2025-08-31T23:59:59Z",
            "isActive": true,
            "minNights": 3,
            "daysOfWeek": [1, 2, 3, 4, 5]
          }
        }
      }
    }
  }
}
```

## User Experience

### For Property Browsers
1. **Visual Indicators**: Promotional rooms display colorful badges showing the discount
2. **Clear Pricing**: Original price shown with strikethrough, new price highlighted
3. **Savings Information**: Clear display of how much money they're saving
4. **Promotion Details**: Detailed information about the offer and conditions

### For Property Owners
1. **Flexible Configuration**: Easy to set up different types of promotions
2. **Time-based Control**: Set exact start and end dates
3. **Conditional Logic**: Control when promotions apply based on stay length and dates
4. **Instant Activation**: Toggle promotions on/off without code changes

## Business Benefits

### Increased Bookings
- **Urgency Creation**: Limited-time offers encourage quick decisions
- **Value Perception**: Clear savings display increases perceived value
- **Competitive Advantage**: Stand out from properties without promotions

### Revenue Optimization
- **Off-peak Incentives**: Use promotions to boost bookings during slow periods
- **Weekend/Weekday Targeting**: Different rates for different days
- **Minimum Stay Requirements**: Encourage longer bookings

### Marketing Flexibility
- **Seasonal Campaigns**: Easy to create holiday or seasonal promotions
- **Event-based Discounts**: Special rates for local events or conferences
- **Customer Segmentation**: Different promotions for different customer types

## Examples

### Early Bird Promotion
```typescript
{
  name: "Early Bird Special",
  discountType: "percentage",
  discountValue: 20,
  description: "Book 30 days in advance and save 20%!",
  minNights: 2
}
```

### Weekend Getaway Deal
```typescript
{
  name: "Weekend Getaway",
  discountType: "fixed",
  discountValue: 75,
  description: "Perfect weekend escape at a special rate",
  daysOfWeek: [5, 6, 0] // Friday, Saturday, Sunday
}
```

### Midweek Business Special
```typescript
{
  name: "Midweek Business Rate",
  discountType: "percentage",
  discountValue: 15,
  description: "Special rates for business travelers",
  daysOfWeek: [1, 2, 3, 4], // Monday to Thursday
  maxNights: 4
}
```

## Technical Details

### Automatic Calculations
- The system automatically calculates promotional pricing based on check-in dates
- Validates all promotion conditions before applying discounts
- Shows real-time savings in the booking widget

### Date Validation
- Checks if current/selected dates fall within promotion period
- Respects blackout dates and day-of-week restrictions
- Handles timezone considerations properly

### Price Display
- Original price always visible with strikethrough when promotion applies
- Promotional price prominently displayed
- Savings amount clearly highlighted

## Future Enhancements

Potential additions to the promotional system:
- **Tiered Discounts**: Different rates based on stay length
- **Group Discounts**: Special rates for multiple rooms
- **Loyalty Programs**: Repeat customer promotions
- **Dynamic Pricing**: AI-powered promotional suggestions
- **A/B Testing**: Test different promotional strategies

This promotional system provides a comprehensive solution for dynamic pricing that can significantly improve booking rates and revenue optimization.
