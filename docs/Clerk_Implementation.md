# Implementing Clerk Authentication in RT Inventory

## What is Clerk?

Clerk is a complete authentication and user management solution that can be easily integrated into our React application. Unlike Supabase (which we were using before), Clerk specializes in authentication and user management, offering pre-built components and hooks that make implementing login, signup, and user profiles much simpler.

## Why Switch from Supabase to Clerk?

While Supabase is great as an all-in-one backend solution (database, authentication, storage), we've experienced some challenges with its authentication flow. Clerk offers:

- Pre-built UI components for authentication (less custom code)
- Better error handling and user feedback
- Simplified email verification
- More robust session management
- Easier implementation of social logins if needed in the future

We'll still use Supabase for our database and other backend needs, but Clerk will handle all authentication.

## Implementation Steps in Plain English

### 1. Install Clerk

```bash
npm install @clerk/clerk-react
```

### 2. Set Up Environment Variables

Create or update `.env` with your Clerk credentials:

```
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
VITE_CLERK_SECRET_KEY=your_secret_key
```

Define the authentication routes:

```
VITE_CLERK_SIGN_IN_URL=/login
VITE_CLERK_SIGN_UP_URL=/signup
VITE_CLERK_AFTER_SIGN_IN_URL=/dashboard
VITE_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Add Clerk Provider to Your App

Wrap your application with `ClerkProvider` in the main file (likely `src/main.tsx`):

```jsx
import { ClerkProvider } from '@clerk/clerk-react';

// Get the publishable key from environment variables
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
```

### 4. Set Up Authentication Routes

Create sign-in and sign-up pages using Clerk's components:

```jsx
// src/pages/Login.tsx
import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}

// src/pages/Signup.tsx
import { SignUp } from '@clerk/clerk-react';

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
```

### 5. Add Protected Routes

Create a middleware file to protect routes:

```jsx
// src/middleware.ts
import { authMiddleware } from '@clerk/clerk-react';

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ['/login', '/signup', '/', '/about']
});
```

### 6. Add User Components

Use Clerk's `UserButton` component for user profile and sign-out functionality:

```jsx
import { UserButton } from '@clerk/clerk-react';

export function Header() {
  return (
    <header className="flex justify-between p-4">
      <h1>RT Inventory</h1>
      <UserButton afterSignOutUrl="/login" />
    </header>
  );
}
```

### 7. Access User Data

Use Clerk's hooks to access user data in your components:

```jsx
import { useUser } from '@clerk/clerk-react';

export function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### 8. Integrate with Supabase

Since we're still using Supabase for database operations, we need to sync Clerk's authentication with Supabase:

```jsx
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

// In a component that loads early in your app
export function SupabaseSync() {
  const { getToken, isSignedIn } = useUser();

  useEffect(() => {
    const syncSupabaseAuth = async () => {
      if (isSignedIn) {
        // Get JWT token from Clerk
        const token = await getToken({ template: 'supabase' });
        
        // Set the Supabase session with the token
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: ''
        });
      } else {
        // Sign out from Supabase when signed out from Clerk
        await supabase.auth.signOut();
      }
    };

    syncSupabaseAuth();
  }, [isSignedIn, getToken]);

  return null;
}
```

## Key Benefits of This Approach

1. **Simplified Authentication UI**: We get professionally designed, accessible auth screens out of the box
2. **Reduced Custom Code**: Less authentication logic to maintain
3. **Better Security**: Authentication is handled by security experts
4. **Improved User Experience**: Better error messages and feedback
5. **Easier Maintenance**: Auth updates and improvements come automatically from Clerk

## Migration from Supabase Auth

To transition existing users:

1. We'll export user data from Supabase
2. Import users into Clerk
3. Send password reset emails to users so they can set up their Clerk credentials
4. Update all auth-related code in the application

## Conclusion

By implementing Clerk for authentication and keeping Supabase for database operations, we get the best of both worlds: specialized authentication with Clerk and powerful database features with Supabase. 