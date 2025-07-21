# Firebase Database Indexing Setup

## Issue
You may encounter this error when querying reservations:
```
Index not defined, add ".indexOn": "userId", for path "/reservations", to the rules
```

## Solution

### Option 1: Add Database Index (Recommended)

1. Go to your Firebase Console
2. Navigate to **Realtime Database**
3. Click on the **Rules** tab
4. Update your rules to include indexing:

```json
{
  "rules": {
    ".read": true,
    ".write": true,
    "reservations": {
      ".indexOn": ["userId"]
    },
    "properties": {
      ".indexOn": ["ownerId"]
    },
    "users": {
      ".indexOn": ["email"]
    }
  }
}
```

5. Click **Publish**

### Option 2: The App Already Handles This

The reservation hooks have been updated with fallback logic:

- **Primary**: Try indexed query for fast performance
- **Fallback**: If index missing, scan all records (slower but works)
- **User-Friendly**: Show helpful error messages instead of technical details

## Benefits of Adding Index

- **Performance**: Much faster queries
- **Cost**: Reduced read operations
- **Scalability**: Better performance as data grows

## User-Friendly Error Messages

Instead of technical Firebase errors, users now see:
- "Database is being optimized. Please try again in a moment."
- "No internet connection. Please check your connection and try again."
- "Unable to load your reservations. Please try again later."

## Test the Fix

1. Run the test data generator to create sample reservations
2. Navigate to the dashboard
3. Should see either:
   - Your reservations displayed (if index exists)
   - Empty dashboard with no errors (fallback working)
   - User-friendly error message (if other issues)

## Hooks That Benefit from Indexing

- `useGetMyReservations()` - Queries by userId
- `useGetMyPropertyReservations()` - Queries by property ownership
- `useGetAllReservations()` - Admin queries
- `useGetReservationsWithFraudAnalysis()` - Fraud detection queries
