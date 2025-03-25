# Clerk and Supabase Integration: What Actually Worked

**Date:** March 19, 2025

## Overview

This document outlines the practical steps that successfully got our authentication (Clerk) and database (Supabase) integration working in production, as opposed to theoretical approaches documented previously. It focuses on real-world solutions to challenges we encountered.

## Authentication: Clerk Implementation

### Successful Setup Steps

1. **Installation and Basic Configuration**
   ```bash
   npm install @clerk/clerk-react
   ```

2. **Environment Variables** (crucial for proper operation)
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXX
   VITE_CLERK_SECRET_KEY=sk_test_XXXXX
   VITE_CLERK_SIGN_IN_URL=/login
   VITE_CLERK_SIGN_UP_URL=/signup
   VITE_CLERK_AFTER_SIGN_IN_URL=/dashboard
   VITE_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

3. **Provider Setup That Actually Worked**
   ```tsx
   // main.tsx
   import { ClerkProvider } from '@clerk/clerk-react';
   import { BrowserRouter } from 'react-router-dom';

   const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <ClerkProvider publishableKey={publishableKey}>
         <BrowserRouter>
           <App />
         </BrowserRouter>
       </ClerkProvider>
     </React.StrictMode>,
   );
   ```

### Critical Insights for Clerk Integration

1. **JWT Template Configuration**
   - Required specific configuration in Clerk dashboard
   - The template naming is case-sensitive ("supabase" worked, "Supabase" did not)
   - The exact JSON that worked:
   ```json
   {
     "sub": "{{user.id}}",
     "user_id": "{{user.id}}",
     "role": "{{user.unsafeMetadata.role}}"
   }
   ```

2. **User Metadata Management**
   - Using `unsafeMetadata` for role storage was essential; `publicMetadata` didn't propagate correctly
   - Role updates required direct API calls rather than just UI changes:
   ```tsx
   await user.update({
     unsafeMetadata: {
       role: "admin"
     }
   });
   ```

3. **Sign-In Component Configuration**
   - The working configuration included redirects but skipped unnecessary options:
   ```tsx
   <SignIn 
     routing="path" 
     path="/login" 
     redirectUrl="/dashboard"
     signUpUrl="/signup"
   />
   ```

## Database: Supabase Implementation

### What Actually Worked for Connection

1. **Connection Using Environment Variables**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Basic Client Setup**
   ```tsx
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

3. **JWT Verification in Supabase Dashboard**
   - Settings > API > JWT Settings
   - JWT Secret format that worked: URL to Clerk's JWKS
   ```
   https://your-clerk-instance.clerk.accounts.dev/.well-known/jwks.json
   ```
   - JWT Claim: `sub`

### Critical Insights for Supabase Implementation

1. **Authenticated Client Creation**
   - Creating a new client on each authentication was more reliable than updating session on existing client
   ```tsx
   // This worked
   const client = createClient(supabaseUrl, supabaseAnonKey, {
     global: {
       headers: {
         Authorization: `Bearer ${token}`
       }
     },
     auth: {
       persistSession: false,
       autoRefreshToken: false,
     }
   });

   // This did not work reliably
   await supabase.auth.setSession({
     access_token: token,
     refresh_token: ''
   });
   ```

2. **PostgreSQL Row-Level Security (RLS)**
   - Using `auth.jwt() ->> 'role'` for role checking was essential
   - Using `auth.uid()` alone was insufficient since we're using Clerk IDs
   ```sql
   -- This worked
   CREATE POLICY "Allow admin write access" ON table_name
   FOR ALL TO authenticated
   USING (auth.jwt() ->> 'role' = 'admin')
   WITH CHECK (auth.jwt() ->> 'role' = 'admin');
   ```

3. **Error Handling and Fallbacks**
   - Critical to handle failed JWT acquisition
   ```tsx
   try {
     const token = await getToken({ template: 'supabase' });
     // Use authenticated client with token
   } catch (error) {
     console.error('Error getting token:', error);
     // Fallback to anonymous client
   }
   ```

## User Synchronization

The most reliable approach for keeping Clerk and Supabase users in sync:

```tsx
export function SupabaseSync() {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const [lastSyncedUserId, setLastSyncedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !user) return;
    if (lastSyncedUserId === userId) return; // Prevent multiple syncs

    async function syncUserWithSupabase() {
      try {
        const supabaseAccessToken = await getToken({ template: 'supabase' });
        let client = supabase;
        
        if (supabaseAccessToken) {
          client = createClerkSupabaseClient(supabaseAccessToken);
        }
        
        // Track existing profile to prevent duplicates
        const { data: existingProfile } = await client
          .from('user_profiles')
          .select('*')
          .eq('clerk_id', userId)
          .maybeSingle();
          
        const userData = {
          id: existingProfile?.id || undefined,
          first_name: user.firstName,
          last_name: user.lastName,
          clerk_id: userId,
          avatar_url: user.imageUrl,
          role: user.unsafeMetadata?.role || 'user',
          updated_at: new Date().toISOString()
        };

        const { error } = await client
          .from('user_profiles')
          .upsert(userData);

        if (!error) {
          setLastSyncedUserId(userId);
        }
      } catch (error) {
        console.error('Error in sync process:', error);
      }
    }

    syncUserWithSupabase();
  }, [userId, user, getToken, lastSyncedUserId]);

  return null;
}
```

## Real-World Challenges and Solutions

### 1. JWT Claim Recognition

**Problem**: Supabase wouldn't recognize Clerk's JWT claims.

**Solution**: 
- Added explicit typing in the JWT template
- Used `auth.jwt() ->> 'role'` in RLS policies

### 2. Session Management

**Problem**: Auth state would get lost between refreshes.

**Solution**:
- Created a `useSupabaseClient` hook that regenerates on each load  
- Avoided session persistence configs that caused conflicts

### 3. Profile Duplication

**Problem**: Multiple user profiles created for same user.

**Solution**:
- Used `clerk_id` as unique identifier  
- Implemented `maybeSingle()` to find existing profiles
- Used `upsert` with proper error handling

### 4. Role-Based Access Control

**Problem**: Roles weren't being properly enforced.

**Solution**:
- Stored roles in `unsafeMetadata` instead of `publicMetadata`
- Required explicit role addition during user creation
- Implemented proper RLS policies that check the role claim

## What To Avoid

1. **Don't** use Supabase Auth alongside Clerk (causes conflicts)
2. **Don't** try to persist Supabase sessions (leads to token validation errors)
3. **Don't** update the existing Supabase client with new tokens (create new clients instead)
4. **Don't** rely on public metadata for roles (use unsafe metadata)
5. **Don't** use client-side role checks alone (always enforce with RLS)

## Conclusion

While our initial documentation focused on theoretical approaches, this document outlines what actually worked in practice. The integration of Clerk for authentication and Supabase for database operations provides a robust foundation for the RT Inventory system, with proper security through JWT-based integration and row-level security policies.

By documenting these real-world solutions, we hope to provide a clearer path for similar integrations in future projects, avoiding the theoretical pitfalls highlighted in our earlier documentation. 