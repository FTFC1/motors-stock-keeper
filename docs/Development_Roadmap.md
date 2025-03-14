# RT Inventory System Development Roadmap

This roadmap outlines the planned development phases for the RT Inventory System, with a focus on incremental delivery of value.

## Current Status (March 2025)

- **UI Development**: Using Onlook (https://onlook.com/) for visual React interface development
- **Frontend**: Inventory dashboard with brand filtering complete, BrandCombobox component finalized
- **Database**: Planning MCP implementation with future Supabase migration path
- **Backend**: Initial API endpoints established for inventory data

## Phase 1: Core Inventory Management (Current Phase)

- [x] Basic inventory database schema design
- [x] Import/export functionality for ERP data
- [x] Basic UI components in Onlook
- [x] BrandCombobox component with search and "Add New" functionality
- [ ] Complete Add Vehicle Modal form components
- [ ] Implement Add Units Modal functionality
- [ ] MCP database integration via Cursor
- [ ] Complete real-time inventory dashboard
- [ ] Stock level notifications
- [ ] Differentiate available vs reserved vehicles

## Phase 2: Reservation System MVP (Weeks 5-8)

- [ ] Basic reservation form implementation
- [ ] Email notification system integration
- [ ] Payment confirmation via email links
- [ ] Reservation status tracking
- [ ] Operations admin view
- [ ] UI refinement with Onlook

## Phase 3: Enhanced Features (Weeks 9-12)

- [ ] Payment rejection workflow
- [ ] Payment status tracking (partial/full)
- [ ] Vehicle reassignment capability
- [ ] Management override functionality
- [ ] Reporting dashboard
- [ ] Consider direct Supabase migration if needed

## Phase 4: Integration & Expansion (Weeks 13-16)

- [ ] Branch-specific views
- [ ] Enhanced reporting
- [ ] Bulk operations tools
- [ ] Data migration tools
- [ ] User training materials

## Phase 5: Refinement & Scale (Weeks 17-20)

- [ ] Performance optimization
- [ ] National rollout support
- [ ] Advanced audit logging
- [ ] Process analytics
- [ ] User feedback implementation

## User Flows Implementation

Based on our app_flow_document.md, we're implementing these key user journeys:

- [ ] **Onboarding & Authentication**: Sign-in, sign-up, and password recovery
- [x] **Dashboard View**: Role-specific interfaces for admin vs sales staff
- [ ] **Inventory Management**: Filtering, sorting, and viewing detailed inventory
    - [x] Brand filtering
    - [x] Accordion view for brands
    - [ ] Add vehicle form
    - [ ] Add units form
- [ ] **Reservation Management**: Creating, tracking, and updating reservations
- [ ] **Admin Operations**: Approval workflows and override capabilities
- [ ] **Reporting & Analytics**: Data visualization for executive management

## Database Implementation Path

Following our supabase_thoughts.md strategy:

1. **Initial Implementation**: Using MCP in Cursor for rapid development
2. **Schema Design**: Implementing vehicle models, units, and status tracking
3. **Future Migration**: Preparation for potential direct Supabase integration
4. **Data Security**: Implementing role-based access controls

## Key Milestones

- End of Week 4: Basic inventory system usable at Lagos VI branch
- End of Week 8: First reservation processed end-to-end
- End of Week 12: Lagos VI branch fully operational
- End of Week 16: Ready for national rollout planning
- End of Week 20: System fully deployed with all features

## Current Focus (March 2025)

We are currently focusing on:
- Completing the Add Vehicle Modal form fields
- Implementing the Add Units Modal
- MCP database integration
- Finalizing the inventory dashboard functionality

## Recent Achievements

- Completed BrandCombobox component with search and "Add New" functionality
- Resolved complex event handling issues in modal context
- Created detailed component documentation
- Fixed dropdown positioning and focus management

## Notes for Implementation

1. **Prioritize Lagos VI branch first** - Focus on making the system work well for one branch before expanding
2. **Keep it simple** - Implement minimal viable features before adding complexity
3. **Get early feedback** - Demo to users as early as possible
4. **Maintain documentation** - Keep this roadmap updated as priorities shift
5. **Regular demos** - Schedule demonstrations every two weeks to showcase progress 