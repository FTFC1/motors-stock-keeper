# Vehicle Inventory System Requirements
*Date: March 4, 2025*

## Overview
This document captures feedback from the Operations Manager regarding version 1 of the Motors Stock Manager application and outlines implementation considerations based on the company's specific operational context.

## Detailed Requirements and Implementation Considerations

### 1. Unit Location Tracking
**Original Feedback:** "Adding the location of each units (unit level) - Location Options: TBC"

**Requirements:**
- Each vehicle unit needs a location field to track where it is physically situated
- Location options need to be defined
- This information is critical for inventory management and logistics

**Implementation Considerations:**
- **Location Management:** System must allow administrators to add new locations and handle location closures
- **Simple Location Flow:** Standard flow is Port → Warehouse → Customer
- **Location Types Needed:**
  - Dealership locations
  - Warehouse
  - PDI (Pre-Delivery Inspection)
  - Repairs/Workshop (for damaged units)
  - Port (initial arrival point)

**Not Required:**
- Tracking for exhibitions, test drive events, or temporary locations (typically 3-5 days maximum)
- Third-party storage facilities
- Direct transit-to-customer tracking (always goes through warehouse first)

### 2. Color Management for Add New Units
**Original Feedback:** "Add New Units needs search, if the entered search isn't an option then it let's you create a new colour option to the DB"

**Requirements:**
- The Add Units form requires a searchable color field
- If a color is not found in existing options, users should be able to create new color entries
- Need to prevent duplicate entries with slight variations

**Implementation Considerations:**
- **Admin-Controlled:** Colors should be managed by admin users only
- **Searchable Dropdown:** Implement with ability to add new colors when needed
- **Color Deletion:** Admin should have the option to delete colors (with confirmation dialog)
- **Color Volume:** Typically maximum of 6 colors per model, no need for complex pagination

**Not Required:**
- International color naming (English only)
- Custom wraps or repaints (considered after-sales)
- Manufacturer color code management
- Complex color merging functionality

### 3. Inventory View Segmentation
**Original Feedback:** "Segmented part of sheet on 'View inventory' will be a problem if there are too many"

**Requirements:**
- Current segmentation approach in inventory view may not scale well with large numbers of vehicles
- Need for more efficient data presentation

**Implementation Considerations:**
- **Performance Optimization:** Design for efficient handling of reasonable data volumes
- **Usable Interface:** Ensure the interface remains clear and usable even with all available colors (max ~6 per model)

**Not Required (for now):**
- Special handling for limited connectivity
- Advanced accessibility features
- Saved filter states
- Mixed segmentation views
- Print/export optimizations

### 4. Brand-Level Dashboard Organization
**Original Feedback:** "Dashboard needs to start at the brand level (GWM, Changan, Maxus, etc.)"

**Requirements:**
- Dashboard should initially group vehicles by manufacturer brand
- This provides a top-down view aligned with business operations
- Users should be able to drill down from brand → model → specific units

**Implementation Considerations:**
- **Simple Brand Structure:** Focus on Brand → Model → Trim → Color organization
- **Brand Sorting:** Order brands by stock amount for relevance
- **Limited Scale:** System needs to handle less than 10 brands total
- **Additional Attributes:** Include Wheel Drive (4x4, 4x2) and Transmission Type (Auto, Manual) as filterable attributes

**Not Required:**
- Sub-brand hierarchies
- Dealer-specific brand filtering
- Rebadged vehicle handling (no vehicles sold under different brands)

**Brand Changes:**
- Brand changes (like acquisitions) would be handled at the brand level through admin editing

### 5. Role-Based View Restrictions
**Original Feedback:** "Sales people don't need to see what's marked as unavailable, reserved. Only Available and Transit"

**Requirements:**
- Role-based content filtering is needed, particularly for sales staff
- Sales role should only see vehicles with status "Available" or "In Transit"
- Other statuses (Unavailable, Reserved) should be hidden from sales view
- Admin/Manager roles should still see all statuses

**Implementation Considerations:**
- **Highest Role Priority:** Users with multiple roles should have permissions of highest role
- **Clear Boundaries:** National sales managers should not have stock-changing abilities (reserved for operations)
- **Admin Assistance:** Sales staff should ask admins when they need information about reserved vehicles

**Not Required:**
- Complex training mode (will use demo videos instead)
- Emergency overrides (handled by asking admin)
- Complex mid-session role updates (sales roles are mostly view-only)

### 6. Pre-Sold Transit Units Management
**Original Feedback:** "If 50 cars come in, you click add new vehicle and then set the status to 'in transit'. But what happens if before the units arrive 20 are sold"

**Requirements:**
- Need mechanism to mark "In Transit" units as "Reserved" or "Pre-Sold"
- System should track which transit units are already committed to customers
- Requires differentiation between available transit units and pre-sold transit units

**Implementation Considerations:**
- **Status Changes:** Canceled pre-orders should change from "pre-sold" to "pre-inventory" (subset of in-transit)
- **Damage Handling:** Damaged units should be marked as "unavailable" with location set to PDI or repairs/workshop
- **Batch Arrivals:** Need to handle partial fulfillment of batches (some units arrive while others don't)
- **Unit Substitution:** Process for when customers accept different model/color than originally ordered

**Not Required:**
- Deposit status tracking
- Delivery date management
- Order swapping between dealers
- Complex specification change tracking

## Implementation Priorities

Based on business impact and implementation complexity:

**High Priority:**
1. Unit Location Tracking
2. Brand-Level Dashboard Organization
3. Role-Based View Restrictions

**Medium Priority:**
1. Color Management with searchable dropdown
2. Pre-Sold Transit Units Management

**Lower Priority:**
1. Interface optimizations for color segmentation
2. Additional refinements based on user feedback

## Technical Approach

The implementation should follow these principles:

1. **Simplicity First:** Focus on core functionality before adding complexity
2. **Admin Control:** Provide robust tools for administrators to manage system data
3. **Clear Status Flow:** Design intuitive status transitions that match business processes
4. **Flexible Foundation:** Build with ability to add more sophisticated features later
5. **Mobile Optimization:** Ensure all features work well on mobile devices used by sales team

## Next Steps

1. Update data models to incorporate location, role-based access, and pre-sold status
2. Redesign dashboard to organize by brand as the primary hierarchy
3. Implement searchable color dropdown with add new capability
4. Adjust inventory views based on user roles
5. Design status workflow for pre-sold transit units 