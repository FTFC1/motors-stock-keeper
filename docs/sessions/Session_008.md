# Session 008 - Database Implementation with Supabase

May 16th 2024 Lagos Nigeria Mikano VI Office

## Tools Used
- **Cursor**: Code editing and component development
- **Supabase**: Backend database and authentication services
- **MCP (Multi-Context Programming)**: AI-assisted database design and implementation
- **Git**: Version control for database implementation branch
- **Chrome DevTools**: Testing and debugging database interactions

## Development Approach
Continuing with our established methodology while adding database integration:
1. Design database schema based on current application requirements
2. Implement tables and relationships in Supabase
3. Create API layer for database interactions
4. Migrate mock data to persistent storage
5. Update UI components to use real data

## Goals for This Session
1. Set up database schema in Supabase
2. Create data models and relationships
3. Implement initial CRUD operations
4. Begin migrating from mock data to database
5. Establish best practices for database interactions

## Current Status
- Frontend UI is fully functional with mock data
- Inventory sheet behavior has been optimized
- Vehicle and unit data structure is well-defined
- Ready to implement persistent storage
- Working on dedicated database implementation branch

## Implementation Priority List

### 1. Database Schema Design (Critical Priority)
- Design Vehicle Models table
- Design Units table
- Design History table for tracking status changes
- Define relationships between tables
- Implement appropriate indexes

### 2. API Layer Development (High Priority)
- Create database access methods
- Implement filtering and sorting
- Build CRUD operations for all entities
- Add proper error handling
- Ensure type safety throughout

### 3. Data Migration (Medium Priority)
- Create migration script for existing mock data
- Validate data integrity during migration
- Handle potential duplicates
- Preserve all relationships
- Maintain backward compatibility

### 4. UI Integration (Medium Priority)
- Update components to use real data
- Implement loading states
- Handle API errors gracefully
- Add optimistic updates
- Maintain existing UX patterns

## Technical Requirements

### 1. Database Design
- Clear table structure
- Proper relationships
- Efficient querying
- Data validation
- Appropriate indexing

### 2. API Layer
- Type-safe operations
- Proper error handling
- Efficient data fetching
- Transaction support
- Consistent patterns

### 3. Data Management
- Data integrity preservation
- Proper status tracking
- History preservation
- User attribution
- Audit capability

## Expected Challenges
1. Ensuring data consistency when migrating from mock to real data
2. Handling network errors and offline scenarios
3. Maintaining performance with larger datasets
4. Ensuring proper relationships between entities
5. Implementing effective real-time updates

## Success Criteria
1. Database schema correctly represents application needs
2. All CRUD operations work reliably
3. Data migration completes without data loss
4. UI components work seamlessly with real data
5. Performance remains responsive with larger datasets

## Next Steps After Completion
1. Implement advanced filtering and sorting
2. Add real-time updates using Supabase subscriptions
3. Enhance reporting capabilities with aggregation queries
4. Implement data export functionality
5. Add comprehensive logging and auditing

## Technical Notes
- Use Supabase Row Level Security for data protection
- Implement optimistic UI updates to improve perceived performance
- Consider implementing a local cache for offline support
- Use TypeScript for all database interfaces
- Maintain comprehensive documentation for database schema

## Session Start Time: May 16th 2024 10:00 

## Progress Updates

### 13:30 - Database Schema Design

We've completed the initial database schema design:

1. **Vehicle Models Table**:
   - Fields: id, brand, model, trim, fuelType, wheelDrive, transmissionType
   - Primary key: id (auto-generated UUID)
   - Unique constraint: combination of brand, model, trim, fuelType, wheelDrive, transmissionType
   - Indexes: brand, model, trim for efficient filtering

2. **Units Table**:
   - Fields: id, modelId, color, status, createdAt, updatedAt, updatedBy
   - Primary key: id (auto-generated UUID)
   - Foreign key: modelId references Vehicle Models table
   - Indexes: modelId, color, status for common queries

3. **History Table**:
   - Fields: id, unitId, oldStatus, newStatus, timestamp, updatedBy
   - Primary key: id (auto-generated UUID)
   - Foreign key: unitId references Units table
   - Index: unitId, timestamp for efficient history retrieval

This schema design accommodates our current application structure while providing room for future enhancements. The design ensures efficient querying for common operations like filtering by brand, model, or status.

### 14:15 - User Role Structure Simplification

After reviewing the project requirements, we've decided to simplify the user role structure to focus on two primary roles:

1. **Admin Users**:
   - Complete control over inventory management
   - Can add/edit/delete vehicles and units
   - Can perform bulk updates
   - Can view all vehicles regardless of status
   - Have access to the change log and reporting
   - Includes Operations Managers

2. **Sales Staff**:
   - Read-only access to inventory
   - Can only see available and in-transit vehicles
   - Can use filtering and sorting tools
   - Cannot make changes to inventory

This simplified approach aligns with the core project requirements while reducing implementation complexity. The system will use Supabase's Row Level Security (RLS) to enforce these role-based permissions:

- Tables will include RLS policies that check user roles before allowing read/write operations
- The Units table will have a policy limiting Sales Staff to only viewing records with status "Available" or "In Transit"
- Admin users will have policies granting full access to all tables and records

For auth implementation, we'll use Supabase Authentication with:
- Email/password authentication
- Role assignment stored in user metadata
- JWT tokens with role claims for secure role verification

This approach provides a clear security boundary while meeting the project requirements without unnecessary complexity.

## Next Implementation Steps

1. **Database Structure**:
   - Implement tables in Supabase according to the schema design
   - Create TypeScript interfaces matching the database schema
   - Set up proper indices and constraints

2. **Authentication & Authorization**:
   - Implement Users table with role field
   - Create RLS policies for the tables based on user roles
   - Develop authentication flow with proper role assignment

3. **API Development**:
   - Develop initial API methods for basic CRUD operations
   - Add role-based filtering logic
   - Implement error handling and validation 

## Beginner-Friendly Database Setup Guide

Since MCP (Multi-Context Programming) and the connection have already been set up, we can proceed with implementing our database. This guide provides step-by-step instructions for creating the tables and setting up the necessary security policies.

### Step 1: Create the Vehicle Models Table

1. **Open Supabase Dashboard**:
   - Navigate to your Supabase project dashboard
   - Click on "Table Editor" in the left sidebar

2. **Create Vehicle Models Table**:
   - Click "Create a new table"
   - Set table name: `vehicle_models`
   - Add columns:
     * `id`: type UUID, checked as Primary Key, with Default Value: `gen_random_uuid()`
     * `brand`: type Text, not nullable
     * `model`: type Text, not nullable
     * `trim`: type Text, not nullable
     * `fuel_type`: type Text, not nullable
     * `wheel_drive`: type Text, not nullable
     * `transmission_type`: type Text, not nullable
     * `created_at`: type Timestamp with time zone, Default: `now()`

3. **Add Unique Constraint**:
   - After creating the table, go to "Indexes" tab
   - Create a new index
   - Type: `Unique`
   - Columns: select brand, model, trim, fuel_type, wheel_drive, transmission_type
   - This prevents duplicate vehicle models

### Step 2: Create the Units Table

1. **Create Units Table**:
   - Click "Create a new table"
   - Set table name: `units`
   - Add columns:
     * `id`: type UUID, checked as Primary Key, with Default Value: `gen_random_uuid()`
     * `model_id`: type UUID, not nullable (will be foreign key)
     * `color`: type Text, not nullable
     * `status`: type Text, not nullable, Default: 'Available'
     * `location`: type Text, nullable
     * `created_at`: type Timestamp with time zone, Default: `now()`
     * `updated_at`: type Timestamp with time zone, Default: `now()`
     * `updated_by`: type UUID, nullable

2. **Add Foreign Key**:
   - After creating the table, go to the "Foreign Keys" tab
   - Create new Foreign Key
   - Columns: select `model_id`
   - Referenced table: `vehicle_models`
   - Referenced columns: `id`
   - This connects each unit to its vehicle model

### Step 3: Create the History Table

1. **Create History Table**:
   - Click "Create a new table"
   - Set table name: `history`
   - Add columns:
     * `id`: type UUID, checked as Primary Key, with Default Value: `gen_random_uuid()`
     * `unit_id`: type UUID, not nullable (will be foreign key)
     * `old_status`: type Text, not nullable
     * `new_status`: type Text, not nullable
     * `timestamp`: type Timestamp with time zone, Default: `now()`
     * `updated_by`: type UUID, nullable

2. **Add Foreign Key**:
   - After creating the table, go to the "Foreign Keys" tab
   - Create new Foreign Key
   - Columns: select `unit_id`
   - Referenced table: `units`
   - Referenced columns: `id`
   - This connects each history record to a specific unit

### Step 4: Set Up Authentication

1. **Configure Auth Settings**:
   - Go to "Authentication" in the left sidebar
   - Under "Settings", ensure Email provider is enabled
   - Set any custom SMTP settings if required for your environment

2. **Create Role Enum Type**:
   - Go to "SQL Editor" in the left sidebar
   - Run the following SQL:
     ```sql
     CREATE TYPE user_role AS ENUM ('admin', 'sales');
     ```

3. **Create User Metadata Table** (for role information):
   - Go back to "Table Editor"
   - Create a new table called `user_profiles`
   - Add columns:
     * `id`: type UUID, checked as Primary Key
     * `user_id`: type UUID, not nullable, unique
     * `role`: type user_role, not nullable, Default: 'sales'
     * `created_at`: type Timestamp with time zone, Default: `now()`

### Step 5: Set Up Row Level Security (RLS)

1. **Enable RLS on Tables**:
   - For each table (vehicle_models, units, history, user_profiles)
   - Click on the table
   - Go to "Auth Policies" tab
   - Turn on Row Level Security (toggle switch)

2. **Create Policy for Vehicle Models Table**:
   - Add New Policy
   - Policy name: "Admin full access"
   - Define using template: "Specific roles can do specific operations"
   - Allowed operations: All
   - Target roles: admin
   - Use the expression: true
   
   Add another policy:
   - Policy name: "Sales staff read-only access"
   - Define using template: "Specific roles can do specific operations"
   - Allowed operations: SELECT
   - Target roles: sales
   - Use the expression: true

3. **Create Policy for Units Table**:
   - Add New Policy
   - Policy name: "Admin full access"
   - Define using template: "Specific roles can do specific operations"
   - Allowed operations: All
   - Target roles: admin
   - Use the expression: true
   
   Add another policy:
   - Policy name: "Sales staff can only see available or in-transit units"
   - Define using template: "Specific roles can do specific operations"
   - Allowed operations: SELECT
   - Target roles: sales
   - Use the expression: `status IN ('Available', 'In Transit')`

4. **Create Policy for History Table**:
   - Add New Policy
   - Policy name: "Admin full access"
   - Define using template: "Specific roles can do specific operations"
   - Allowed operations: All
   - Target roles: admin
   - Use the expression: true

### Step 6: Create TypeScript Interfaces

Create a new file in your project called `src/types/database.ts` with the following content:

```typescript
export interface VehicleModel {
  id: string;
  brand: string;
  model: string;
  trim: string;
  fuel_type: string;
  wheel_drive: string;
  transmission_type: string;
  created_at: Date;
}

export interface Unit {
  id: string;
  model_id: string;
  color: string;
  status: 'Available' | 'In Transit' | 'Reserved' | 'Unavailable' | 'Display';
  location?: string;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

export interface History {
  id: string;
  unit_id: string;
  old_status: string;
  new_status: string;
  timestamp: Date;
  updated_by?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: 'admin' | 'sales';
  created_at: Date;
}
```

### Step 7: Test Your Database Setup

To verify everything is working correctly:

1. **Insert Test Data**:
   - Use the "Table Editor" to manually insert a few test records
   - Add a vehicle model, then a unit connected to that model

2. **Test RLS Policies**:
   - Create two test users in Authentication (one admin, one sales)
   - Try accessing the data using both users
   - Verify that the sales user can only see available and in-transit units

If everything is working as expected, you're ready to move on to developing the API endpoints for your application!

### Helpful Tips:

- **Snake Case vs. Camel Case**: Note that in the database we use snake_case (e.g., `vehicle_models`), but in TypeScript we use camelCase (e.g., `vehicleModels`). Supabase client handles this conversion automatically.

- **UUID vs. ID**: For simplicity, we're using UUID strings in our TypeScript interfaces, but they're UUID types in the database.

- **Enums**: We've used the PostgreSQL enum type for roles, but you could also use a simple string with constraints.

- **Timestamps**: PostgreSQL automatically handles the timestamps with the `now()` function.

- **Testing**: Use the Supabase dashboard to test your queries before implementing them in code. 