# Vehicle Inventory Management Flow

This document outlines the typical user flow for managing vehicle inventory within the RT Inventory application.

## Overview

The vehicle inventory management workflow allows users to:

1. Browse inventory by brand
2. View details of specific vehicle models
3. Examine individual units by color
4. Add new units to inventory
5. Update unit status individually or in batches

## Flow Sequence

### 1. Dashboard View

**Actions:**
- User logs in and lands on the Dashboard
- System displays a list of brands as BrandCards
- Each card shows brand name, total units, available units count, and model count

<!-- TODO: Replace with actual screenshot -->
*[Dashboard View - Screenshot to be added]*

**Expected Behavior:**
- Cards should be sorted according to the selected sort option (default: alphabetical)
- Clicking on a brand card should expand to show the models for that brand
- Search and filters should narrow down the visible brands

### 2. Brand Expansion

**Actions:**
- User clicks on a brand card (e.g., "CHANGAN")
- System expands the view to show all model/trim combinations for that brand
- Each model is displayed as a GroupedVehicleCard

<!-- TODO: Replace with actual screenshot -->
*[Brand Expansion - Screenshot to be added]*

**Expected Behavior:**
- The expansion should be immediate and smooth
- Models should be displayed in a responsive grid layout
- Clicking the down arrow again should collapse the brand card

### 3. Inventory Sheet Access

**Actions:**
- User clicks "View Inventory" on a specific model card
- System slides in the InventorySheet from the right side
- Inventory is organized by color tabs at the top

<!-- TODO: Replace with actual screenshot -->
*[Inventory Sheet - Screenshot to be added]*

**Expected Behavior:**
- Sheet should slide in smoothly from the right
- Default active tab should be the first color with inventory
- Units should be grouped by status (Available, Display, etc.)
- Header should show brand, model, and trim information

### 4. Navigating Color Tabs

**Actions:**
- User clicks on different color tabs
- System updates the view to show units of the selected color
- Units remain grouped by status

<!-- TODO: Replace with actual screenshot -->
*[Color Tabs - Screenshot to be added]*

**Expected Behavior:**
- Tab switching should be immediate
- Scroll position should be preserved when switching tabs
- Active tab should be visually highlighted

### 5. Adding New Units

**Actions:**
- User clicks "Add More" button in a color tab
- System opens the Add Units dialog
- User enters quantity, selects status, and confirms

<!-- TODO: Replace with actual screenshot -->
*[Add Units - Screenshot to be added]*

**Expected Behavior:**
- Dialog should be centered and modal
- Form validation should ensure quantity is a positive number
- On submission, new units should appear in the appropriate tab and status group
- Sheet should remain open after adding units

### 6. Editing Individual Units

**Actions:**
- User clicks on a specific unit card
- System opens the Unit Edit modal
- User modifies unit details and confirms

<!-- TODO: Replace with actual screenshot -->
*[Edit Unit - Screenshot to be added]*

**Expected Behavior:**
- Modal should show all editable properties of the unit
- Changes should be reflected immediately after saving
- Sheet should remain open after editing
- Last updated time should be refreshed

### 7. Batch Status Updates

**Actions:**
- User clicks "Batch Edit" for a status group
- System opens the Batch Edit dialog
- User selects new status and confirms

<!-- TODO: Replace with actual screenshot -->
*[Batch Edit - Screenshot to be added]*

**Expected Behavior:**
- Dialog should clearly indicate how many units will be affected
- On confirmation, all units should move to the new status group
- Animation should make it clear that units have moved
- Sheet should remain open after batch update

### 8. Closing the Inventory Sheet

**Actions:**
- User clicks the X button or clicks outside the sheet
- System slides the sheet out to the right
- User returns to the brand expansion view

**Expected Behavior:**
- Sheet should slide out smoothly
- Any changes made should be reflected in the model card (counts, etc.)
- State should be preserved if the same inventory is viewed again

## Edge Cases

### Empty Inventory

**Scenario:** User views a model with no units
**Expected Behavior:**
- Sheet should display "No units available" message
- "Add Units" functionality should still be accessible

### Large Inventory

**Scenario:** Model has hundreds of units across multiple colors
**Expected Behavior:**
- Performance should remain smooth
- Scrolling should work without lag
- Batch operations should handle large numbers efficiently

### Concurrent Updates

**Scenario:** Multiple users updating the same inventory
**Expected Behavior:**
- Latest changes should be reflected when the sheet is opened
- Conflicts should be handled gracefully with appropriate error messages
- Data integrity should be maintained

## Error Handling

### Network Failures

**Scenario:** Network connection lost during an update
**Expected Behavior:**
- Error should be displayed clearly
- User should be able to retry the operation
- Partial changes should not be committed

### Invalid Input

**Scenario:** User enters invalid data (negative quantity, etc.)
**Expected Behavior:**
- Form validation should prevent submission
- Clear error messages should guide the user
- Focus should remain on the problematic field

## Performance Considerations

- Tab switching should be instantaneous, even with large data sets
- Scrolling should remain smooth throughout the interaction
- Animations should not cause performance degradation on slower devices
- Batch operations should be optimized for efficiency

## Note on Documentation

*This flow documentation should be updated with actual screenshots once the UI is finalized. The placeholders will be replaced with real images showing each step of the workflow.* 