# InventorySheet Component

## Purpose

The InventorySheet component provides a detailed view of vehicle inventory for a specific model/trim combination, organized by color. It allows users to view all units of a particular vehicle, grouped by color and status, and provides functionality to edit units, add new units, and perform batch operations.

## Visual Example

![InventorySheet Component](../assets/inventorysheet_example.png)

*Note: This is a visual reference. Actual appearance may vary based on the theme and screen size.*

## Component Structure

The InventorySheet is a sliding panel that appears from the right side of the screen when a user clicks "View Inventory" on a GroupedVehicleCard. It consists of:

1. **Header**: Displays the brand, model, and trim information
2. **Color Tabs**: Tabs to switch between different colors of the same vehicle
3. **Status Groups**: Units grouped by status (Available, Display, Transit, etc.)
4. **Unit Cards**: Individual unit cards showing unit ID and last update date

## Behavior Specification

- **Opening**: Slides in from the right side when "View Inventory" is clicked
- **Closing**: Slides out to the right when the close button is clicked or when clicking outside
- **Tab Switching**: Switches between color tabs without losing scroll position
- **Scrolling**: Content area is scrollable while header and tabs remain fixed
- **Batch Actions**: Allows selecting multiple units of the same color/status for batch operations
- **Unit Selection**: Individual units can be clicked to edit their details
- **Add Units**: "Add More" button opens a dialog to add more units of a specific color

## Props/Configuration

```typescript
interface InventorySheetProps {
  isOpen: boolean;                  // Whether the sheet is visible
  onClose: () => void;              // Handler to close the sheet
  brand: string;                    // Vehicle brand
  model: string;                    // Vehicle model
  trim: string;                     // Vehicle trim
  fuelType: string;                 // Fuel type
  units: VehicleUnit[];             // Array of vehicle units
  onEditUnit: (unit: VehicleUnit) => void;  // Handler for unit edits
  onAddUnits: (groupId: string, color: string, quantity: number, status: VehicleStatus) => void;  // Handler for adding units
  onBatchEdit: (units: VehicleUnit[]) => void;  // Handler for batch operations
  groupId: string;                  // ID of the vehicle group
  activeColorTab?: string | null;   // Currently active color tab
  onActiveColorTabChange?: (color: string) => void;  // Handler for color tab changes
}
```

## Interaction States

1. **Closed**: Not visible, positioned off-screen
2. **Opening**: Animating into view from the right
3. **Open**: Fully visible on screen
4. **Tab Navigation**: Switching between color tabs
5. **Scrolling**: Scrolling through units while keeping header fixed
6. **Add Units Dialog**: Dialog open for adding new units
7. **Batch Edit Dialog**: Dialog open for editing multiple units
8. **Closing**: Animating out of view to the right

## Scrolling Behavior

- **Header Fixed**: The header with brand, model, and trim info stays fixed at the top
- **Tabs Fixed**: Color tabs remain visible under the header while scrolling
- **Content Scrollable**: Unit listings are in a scrollable container
- **Scroll Position Preservation**: When switching tabs, the scroll position is preserved
- **Scroll Memory**: When reopening the sheet, it remembers the last scroll position

## Mobile Optimization

- On mobile devices:
  - Sheet takes full width of the screen
  - Larger touch targets for better interaction
  - Simplified unit card layout
  - Full-height scrolling

## Implementation Notes

The InventorySheet implementation includes several advanced techniques:

1. **Scroll Handling**:
   - Uses `useRef` to track the scroll container
   - Preserves scroll position during tab switches and rerenders
   - Uses `requestAnimationFrame` for smooth scroll restoration

2. **Animation Optimizations**:
   - Uses CSS properties like `willChange: "scroll-position"` for performance
   - Employs `overscrollBehavior: "contain"` to prevent scroll chaining
   - Uses hardware-accelerated transforms for sheet sliding animations

3. **State Management**:
   - Keeps track of active color tab
   - Maintains operations in progress to prevent premature closing
   - Uses forceUpdate mechanism to refresh UI when data changes

4. **Event Handling**:
   - Carefully manages event propagation to prevent bubbling issues
   - Uses event capture for outside clicks to close the sheet
   - Handles keyboard events for accessibility (Escape to close)

## Usage Example

```tsx
<InventorySheet
  isOpen={openInventorySheet === group.id}
  onClose={() => setOpenInventorySheet(null)}
  brand={group.brand}
  model={group.model}
  trim={group.trim}
  fuelType={group.fuelType}
  units={group.units}
  onEditUnit={handleEditUnit}
  onAddUnits={handleAddUnits}
  onBatchEdit={handleBatchEdit}
  groupId={group.id}
  activeColorTab={activeColorTabs[group.id] || null}
  onActiveColorTabChange={(color) => {
    setActiveColorTabs(prev => ({
      ...prev,
      [group.id]: color
    }));
  }}
/>
```

## Known Issues

1. **Scroll Flickering**: On some devices, scrolling can have a brief flicker when tabs are switched
2. **Performance with Large Data**: When displaying hundreds of units, rendering performance can degrade
3. **Mobile Landscape**: In landscape orientation on mobile devices, the sheet may feel cramped

## Testing Guidelines

1. **Tab Switching**: Test switching between color tabs to ensure content updates correctly
2. **Scroll Position**: Verify scroll position is maintained when switching tabs
3. **Add Units**: Test adding new units and verify they appear in the correct tab
4. **Batch Edit**: Test batch editing multiple units and verify status updates
5. **Dialog Interaction**: Test that dialogs (add units, batch edit) work correctly
6. **Responsive Testing**: Test on various screen sizes to ensure proper adaptation
7. **Performance Testing**: Test with large data sets (100+ units) to ensure performance 