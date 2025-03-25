# BrandCard Component

## Purpose

The BrandCard component serves as a clickable card in the main dashboard view, displaying summary information about a specific vehicle brand and allowing users to expand it to see models within that brand.

## Visual Example

<!-- TODO: Replace with actual screenshot -->
*[BrandCard Component - Screenshot to be added]*

*Note: This is a visual reference. Actual appearance may vary based on the theme and screen size.*

## Component Structure

There are two variants of the BrandCard component:

1. **BrandCard** - A simple card showing brand summary that appears in the dashboard's main view
2. **DetailedBrandCard** - An expandable card showing the brand's models that appears when a brand is selected

## Behavior Specification

### BrandCard (Simple)

- **Default State**: Displays a card with brand name, total units count, available units count, and model count
- **Hover State**: Card should have a subtle shadow increase and slight background color change
- **Click Action**: When clicked, should trigger the `handleBrandSelect` function to:
  - Set the selected brand state
  - Show the DetailedBrandCard for this brand without applying a filter
- **Rendering**: Should appear in a vertical stack in the main dashboard view

### DetailedBrandCard (Expanded)

- **Initial State**: Always starts in collapsed mode when first rendered
- **Header**: Displays brand name, total stock count, and available units count with an arrow indicator
- **Click Action on Header**: Toggles between expanded and collapsed states
- **Expanded State**: Shows GroupedVehicleCards for each model/trim within this brand
- **Animation**: Smooth height transition when expanding/collapsing
- **State Persistence**: Remembers expanded/collapsed state in sessionStorage
- **Group Layout**: Uses a responsive grid layout for the contained GroupedVehicleCards

## Props/Configuration

### BrandCard Props

```typescript
interface BrandCardProps {
  brand: string;           // Brand name (e.g., "CHANGAN")
  totalUnits: number;      // Total count of all units for this brand
  availableUnits: number;  // Count of units with "available" status
  modelCount: number;      // Count of unique models for this brand
  onClick?: () => void;    // Handler for when card is clicked
}
```

### DetailedBrandCard Props

```typescript
interface DetailedBrandCardProps {
  brand: string;                   // Brand name (e.g., "CHANGAN")
  vehicleGroups: VehicleGroupWithInventoryControls[]; // Array of model/trim groups
  totalStock: number;              // Total count of all units for this brand
  statusCounts: Record<VehicleStatus, number>; // Count of units by status
  onUpdateModel: Function;         // Handler for model updates
  onUpdateVehicle: Function;       // Handler for vehicle updates
  onAddUnits: Function;            // Handler for adding new units
  onBatchUpdateStatus: Function;   // Handler for batch status updates
}
```

## Interaction States

### BrandCard (Simple)

1. **Normal**: Default appearance
2. **Hover**: Subtle shadow enhancement
3. **Active/Pressed**: Slight darkening of background
4. **Selected**: Not applicable - transitions to DetailedBrandCard

### DetailedBrandCard (Expanded)

1. **Expanded**: Card body visible, showing all model cards
2. **Collapsed**: Only header visible, body hidden
3. **Header Hover**: Background color change
4. **Child Interactions**: Contained GroupedVehicleCards have their own interaction states

## Responsive Behavior

### Mobile View (< 640px)

- BrandCard: Stack layout with vertical alignment of information
- DetailedBrandCard: Single column grid for GroupedVehicleCards
- Simplified status counts display

### Tablet View (640px - 1024px)

- BrandCard: Horizontal layout of brand and counts
- DetailedBrandCard: Two column grid for GroupedVehicleCards
- Full status counts display

### Desktop View (> 1024px)

- BrandCard: Horizontal layout with more spacing
- DetailedBrandCard: Three column grid for GroupedVehicleCards
- Full status counts display with additional information

## Known Issues

1. After page refresh, multiple clicks may be needed to expand the BrandCard properly
2. Animation can stutter on slower devices with many vehicle groups
3. SessionStorage can sometimes cause inconsistent expansion state

## Usage Examples

### Basic Usage

```tsx
<BrandCard
  brand="CHANGAN"
  totalUnits={403}
  availableUnits={395}
  modelCount={11}
  onClick={() => handleBrandSelect("CHANGAN")}
/>
```

### With DetailedBrandCard

```tsx
<DetailedBrandCard
  brand="CHANGAN"
  vehicleGroups={vehicleGroups}
  totalStock={totalStock}
  statusCounts={statusCounts}
  onUpdateModel={handleUpdateModel}
  onUpdateVehicle={handleUpdateVehicle}
  onAddUnits={handleAddUnits}
  onBatchUpdateStatus={handleBatchUpdateStatus}
/>
```

## Implementation Notes

1. Use `useState` and `useEffect` for managing expansion state
2. Employ `AnimatePresence` and `motion.div` from Framer Motion for animations
3. Store expansion state in `sessionStorage` using the brand name as key
4. Use conditional rendering with `isExpanded && (...)` pattern
5. Employ direct DOM event handling to prevent event bubbling issues

## Testing Guidelines

1. Test click behavior after page refresh
2. Verify expansion/collapse animation works smoothly
3. Ensure responsive layout works across breakpoints
4. Check sessionStorage persistence across page reloads
5. Verify all child components render correctly when expanded 