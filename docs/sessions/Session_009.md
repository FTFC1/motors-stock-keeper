# Session 009 - Supabase Database Setup with MCP and Clerk Authentication

**Date:** Monday, March 17, 2025  
**Location:** Victoria Island, Lagos  
**Focus:** Supabase integration, database setup using MCP, and Clerk authentication

## Objectives
- Connect to Supabase database using Model Context Protocol (MCP)
- Create initial database schema for RT Inventory
- Set up basic tables with test data
- Implement Clerk authentication with role-based access

## Achievements

### Supabase MCP Connection
- Successfully configured MCP connection to Supabase after resolving several configuration challenges
- Identified and installed the correct MCP server for read/write operations (Alexander Zuev's Supabase MCP Server)
- Set up proper environment variables for authentication

### Database Schema Implementation
- Created `inventory_items` table with comprehensive fields:
  - UUID primary key
  - Name, description fields
  - Quantity and price tracking
  - Category and location data
  - Timestamps for creation and updates
- Implemented Row Level Security (RLS) for authenticated users
- Added sample inventory data for testing

### Clerk Authentication Integration
- Successfully implemented Clerk for user authentication
- Created Login and Signup pages with Clerk components
- Implemented route protection for authenticated routes
- Added `SupabaseSync` component to sync Clerk auth with Supabase database
- Created user profiles in Supabase when users register through Clerk

### Role-Based Access Control
- Implemented admin role detection based on email address
- Created utility functions for role checking (`isAdmin`, `isManager`, etc.)
- Added UI components to display role status (AdminBanner)
- Implemented self-service admin role activation for authorized emails
- Configured role data to be stored in Clerk's `unsafeMetadata`

## Technical Notes

### MCP Configuration
The key to successful read/write operations was using the correct environment variables:
```
SUPABASE_PROJECT_REF=ywgnwkncpyuczxaegizx
SUPABASE_DB_PASSWORD=********
SUPABASE_REGION=eu-central-2
```

### Database Structure
Initial tables created with proper constraints and security:
```sql
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10, 2),
  category TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" 
ON public.inventory_items
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);
```

### User Profile Table
```sql
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read all profiles
CREATE POLICY "Allow users to read all profiles" 
ON public.user_profiles
FOR SELECT 
TO authenticated
USING (true);

-- Create a policy that allows users to update only their own profile
CREATE POLICY "Allow users to update their own profile" 
ON public.user_profiles
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

## Challenges
- Initial connection attempts failed due to DNS resolution issues
- Confusion between Postgres MCP server and Supabase-specific MCP server
- Environment variable naming requirements differed from documentation
- Default connection was read-only; required explicit unsafe mode activation
- Setting up Clerk with React Router required special configuration for verification routes
- Clerk's metadata API required using unsafeMetadata instead of publicMetadata for role storage

## Next Steps
- Create vehicle tables according to the data model 
- Replace mock data with real database queries
- Implement CRUD operations for inventory management
- Create vehicle addition and editing functionality
- Implement logging system for tracking changes to inventory 