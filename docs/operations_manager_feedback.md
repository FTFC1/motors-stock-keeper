# Operations Manager Feedback - Motors Stock Manager v1
*Date: March 4, 2025*

## Overview
This document captures and expands on feedback provided by the Operations Manager after reviewing version 1 of the Motors Stock Manager application. These points need to be addressed in future updates to better align the application with operational needs.

## Detailed Feedback Points

### 1. Unit Location Tracking
**Original Feedback:** "Adding the location of each units (unit level) - Location Options: TBC"

**Expansion:**
- Each vehicle unit needs a location field to track where it is physically situated
- Location options need to be defined (likely dealership locations, storage facilities, etc.)
- This information is critical for inventory management and logistics
- May need to include location history for tracking vehicle movements
- Consider how location changes will be recorded and by whom
- Possible implementation: dropdown selection from predefined locations with "Other" option

**Impact:**
- Requires updates to the Vehicle Unit data model
- Affects inventory view and filtering capabilities
- Influences reporting functionality

### 2. Add New Units - Color Management
**Original Feedback:** "Add New Units needs search, if the entered search isn't an option then it let's you create a new colour option to the DB"

**Expansion:**
- The Add Units form requires a searchable color field
- If a color is not found in existing options, users should be able to create new color entries
- This prevents duplicate entries with slight variations (e.g. "Dark Blue" vs "Navy Blue")
- Need to consider color standardization and potential categorization
- May require color code/reference for manufacturer standards

**Impact:**
- Requires updates to the Add Units dialog component
- Needs a searchable dropdown with "Add New" capability
- Database needs to support dynamic addition of new color options
- Consider approval workflow for adding new colors (to prevent proliferation of similar colors)

### 3. View Inventory Segmentation Limits
**Original Feedback:** "Segmented part of sheet on 'View inventory' will be a problem if there are too many"

**Expansion:**
- Current segmentation approach in inventory view may not scale well with large numbers of vehicles
- Concern that too many segments could cause performance or usability issues
- Need for either pagination, virtualization, or alternative grouping approaches
- Consider collapsible sections or more efficient data presentation

**Impact:**
- UI/UX redesign may be needed for scalability
- Performance optimization for handling large datasets
- May require changes to how data is fetched and displayed

### 4. Brand-Level Dashboard Organization
**Original Feedback:** "Dashboard needs to start at the brand level (GWM, Changan, Maxus, etc.)"

**Expansion:**
- Dashboard should initially group vehicles by manufacturer brand
- This provides a top-down view aligned with business operations
- Users should be able to drill down from brand → model → specific units
- Consider visual hierarchies to represent this structure
- May need brand-specific KPIs or metrics

**Impact:**
- Requires restructuring of dashboard components
- Needs additional grouping logic at the brand level
- May affect filtering and sorting mechanisms
- Consider brand-specific visual indicators (logos, color coding)

### 5. Role-Based View Restrictions
**Original Feedback:** "Sales people don't need to see what's marked as unavailable, reserved. Only Available and Transit"

**Expansion:**
- Role-based content filtering is needed, particularly for sales staff
- Sales role should only see vehicles with status "Available" or "In Transit"
- Other statuses (Unavailable, Reserved) should be hidden from sales view
- Admin/Manager roles should still see all statuses
- This simplifies the interface for sales staff to focus only on what they can sell

**Impact:**
- Requires implementation of role-based filtering
- Affects query parameters based on user role
- May need updates to authentication and authorization logic
- UI should adapt based on user permissions

### 6. Pre-Sold Transit Units Management
**Original Feedback:** "If 50 cars come in, you click add new vehicle and then set the status to 'in transit'. But what happens if before the units arrive 20 are sold"

**Expansion:**
- Need mechanism to mark "In Transit" units as "Reserved" or "Pre-Sold"
- System should track which transit units are already committed to customers
- Requires differentiation between available transit units and pre-sold transit units
- May need additional status or flag on transit units
- Consider impact on inventory counts and availability reporting

**Impact:**
- May require new status or sub-status for transit units
- Affects filtering and counting logic
- Impacts sales reporting and forecasting
- UI needs to clearly indicate which transit units are still available

## Prioritization Suggestion

Based on business impact and implementation complexity:

**High Priority:**
- Unit Location Tracking (#1)
- Brand-Level Dashboard Organization (#4)
- Role-Based View Restrictions (#5)

**Medium Priority:**
- Add New Units - Color Management (#2)
- Pre-Sold Transit Units Management (#6)

**Lower Priority:**
- View Inventory Segmentation Limits (#3) - Can be addressed when scaling becomes an actual issue

## Next Steps

1. Review this feedback with the development team
2. Prioritize items based on business needs and development effort
3. Create detailed technical specifications for each item
4. Update project backlog and roadmap
5. Plan implementation timelines in upcoming sprints 