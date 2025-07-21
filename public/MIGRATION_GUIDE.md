# Migration from Redux to TanStack Query

## Overview
Your Redux thunks have been converted to custom hooks using TanStack Query. Here's how to update your components:

## Authentication Hooks

### Before (Redux)
```typescript
import { useAppDispatch } from '../state/hooks';
import { loginAsync, signOutAsync, createAccountAsync } from '../state/thunks';

const dispatch = useAppDispatch();

// Login
dispatch(loginAsync(credentials));

// Sign out
dispatch(signOutAsync());

// Create account
dispatch(createAccountAsync(accountInfo));
```

### After (TanStack Query)
```typescript
import { useLogin, useSignOut, useCreateAccount } from '../hooks';

const loginMutation = useLogin();
const signOutMutation = useSignOut();
const createAccountMutation = useCreateAccount();

// Login
loginMutation.mutate(credentials, {
  onSuccess: (user) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  }
});

// Sign out
signOutMutation.mutate();

// Create account
createAccountMutation.mutate(accountInfo);
```

## Property Hooks

### Before (Redux)
```typescript
import { addPropertyAsync, getMyPropertiesAsync } from '../state/thunks';
import { usePropertyState } from '../state/propertySlice';

const { allMyProperties } = usePropertyState();

// Add property
dispatch(addPropertyAsync({ property, Files }));

// Get properties
dispatch(getMyPropertiesAsync());
```

### After (TanStack Query)
```typescript
import { useAddProperty, useMyProperties } from '../hooks';

const { data: myProperties, isLoading, error } = useMyProperties();
const addPropertyMutation = useAddProperty();

// Add property
addPropertyMutation.mutate({ property, Files }, {
  onSuccess: () => {
    // Property added successfully
  }
});

// Properties are automatically fetched and cached
```

## Key Benefits

1. **Automatic caching** - Data is cached and reused across components
2. **Background refetching** - Data stays fresh automatically
3. **Loading states** - Built-in loading, error, and success states
4. **Optimistic updates** - UI updates immediately, rolls back on error
5. **Less boilerplate** - No need for reducers, actions, or thunks

## Migration Steps

1. ✅ Install TanStack Query
2. ✅ Create custom hooks
3. ✅ Add QueryProvider to App.tsx
4. 🔄 Update components to use new hooks
5. 🔄 Remove Redux store, slices, and thunks
6. 🔄 Update imports throughout the app

## Next Steps

Update your components one by one, replacing Redux dispatch calls with the new hooks. The hooks provide better TypeScript support and automatic loading states.