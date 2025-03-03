# Vehicle Counting Logic

## Current Issues (Based on Screenshot)
1. The total stock number seems to be counting individual units incorrectly
2. Status breakdown numbers don't match with the individual units shown
3. Expanded view shows inconsistent unit counts

## Proposed Logic

### Vehicle Card Structure
```
Changan Alsvin V3
Dynamic • Petrol
Total Stock: 3                  <- This is the sum of all status counts

Status Breakdown:
• In Transit: 1                 <- Individual status counts

Individual Units (1)            <- This shows actual units with their statuses
• changan-alsvin-v3-dynamic    <- Each unit has its own status
```

### Counting Rules

1. **Total Stock Calculation**
   - Sum of ALL units for this specific model + trim + variant combination
   - Should match the sum of all status counts
   - Example: If Alsvin V3 Dynamic has 3 units (1 in transit, 2 reserved), Total Stock = 3

2. **Status Breakdown Display**
   - Show only statuses that have at least 1 unit
   - Count should be the number of units in that status
   - Format: "Status: Count"
   - Example: "In Transit: 1" means 1 unit is in transit status

3. **Individual Units Section**
   - Title should show actual count of units in parentheses
   - Each unit should be listed with its unique ID
   - Each unit's current status should be clearly indicated
   - Units should be collapsible/expandable

### Example Calculation

For "Changan Alsvin V3 Dynamic":
```
Total Units: 3
Status Breakdown:
- In Transit: 1
- Reserved: 2

Individual Units (3):
1. Unit ID: changan-alsvin-v3-dynamic-001 (In Transit)
2. Unit ID: changan-alsvin-v3-dynamic-002 (Reserved)
3. Unit ID: changan-alsvin-v3-dynamic-003 (Reserved)
```

## Implementation Requirements

1. **Data Structure Updates**
   - Each vehicle unit needs a unique identifier
   - Status must be tracked at individual unit level
   - Group-level counts should be derived from unit data

2. **UI Updates Needed**
   - Update GroupedVehicleCard to show correct total
   - Update status breakdown to only show relevant statuses
   - Ensure individual units section accurately reflects total count
   - Add proper unit ID display in expanded view

3. **Validation Rules**
   - Total stock must equal sum of status counts
   - Individual units count must match total stock
   - Each unit must have exactly one status
   - No duplicate unit IDs allowed

## Next Steps
1. Update the Vehicle type to include unique unit identifiers
2. Modify generateMockVehicles to create proper unit-level data
3. Update GroupedVehicleCard component to implement new counting logic
4. Add validation to ensure data consistency 