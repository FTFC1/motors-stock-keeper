# Motors Stock Manager Design Guidelines

## Layout & Navigation

### Sidebar

Desktop (>= 1024px):
- Width: 240px expanded, 72px collapsed
- Position: Fixed left side
- Height: 100vh
- Collapsible with smooth transition
- Icons: 20px (5 w-5 h-5)
- Active state: Primary color background
- Hover state: Muted background
- Tooltips in collapsed state
- Always visible during scroll

Mobile (< 1024px):
- Side panel slides in from left edge
- Width: 80% of screen width, max 320px
- Dark overlay behind panel when open
- Hamburger menu button positioned left of logo
- Animated transition on open/close
- Icons: 24px (6 w-6 h-6) for touch targets
- Active state: Primary color background
- Press state: Muted background with ripple

### Header

#### Desktop Header (>= 1024px):
- Height: 56px (h-14)
- Sticky positioning
- Z-index: 40
- Semi-transparent background with blur
- Icons: 16px (4 w-4 h-4)
- Logo/app name aligned left
- Primary actions right-aligned
- Proper spacing between elements

#### Mobile Header (< 1024px):
- Height: 56px (h-14)
- App name/logo centered for balance
- Hamburger menu icon positioned at left edge (16px/1rem from left)
- Critical actions (notifications, theme, profile) remain visible on right
- Use compact layout for action icons
- Icons should have proper touch targets (minimum 44px)
- Consider a subtle shadow or border to separate from content
- Optional: Condensed header when scrolling down (44px height)

#### MobileHeader Component Requirements:
- Implement as a separate component from desktop header
- Use responsive switching based on window width
- Must coordinate with sidebar component (same toggle state)
- Maintain visual continuity with overall design system
- Seamless transition between mobile/desktop layouts
- Ensure title text truncates properly on very small screens
- Z-index coordination with mobile sidebar overlay

### Content Area
- Max width: 1152px (max-w-6xl)
- Padding: 16px mobile, 32px desktop
- Background: Subtle gradient or solid
- Border radius: 8px for cards
- Margin-left: 240px when sidebar expanded, 72px when collapsed (desktop only)
- **IMPORTANT**: All content MUST be contained within the viewport width with no horizontal scrolling
- Use `overflow-x-hidden` on container elements when needed
- Elements must scale/wrap appropriately on small screens

### Filters & Controls
- Filters and sorting controls should always be in a single row on desktop
- On mobile, filters and sorting can stack vertically if space is limited
- Dropdown indicators should be consistent (chevron down)
- Filter button should use filter icon
- Sort dropdown should use chevron down/up based on sort direction
- Touch targets minimum 44px height (h-11)

## Components

### Vehicle Cards
- Up to three vehicles per row on desktop (lg:grid-cols-3)
- Two vehicles per row on tablet (sm:grid-cols-2)
- One vehicle per row on mobile (grid-cols-1)
- Cards should maintain consistent height within a row
- Status badges on the left
- Actions on the right
- Cards should have equal width in their row
- **Content must not overflow card boundaries**
- Use `overflow-hidden` to prevent content from breaking the layout

### Brand Section
- Expandable/collapsible with chevron indicator
- Expanded by default
- Status count summary always visible
- Proper spacing between brand sections (gap-6)
- Consistent corner radius across all cards
- Brand badge should be prominent and consistent
- **On small screens (< 480px):**
  - Status badges must stack or wrap when space is limited
  - Use `flex-wrap: wrap` for status badge containers
  - Consider using abbreviated status names on small screens
  - Reduce horizontal padding in badges (px-1 instead of px-2 on very small screens)

### Expandable Sections
- All expandable sections must have clear expand/collapse indicators
- Chevron up/down should be used consistently
- Animation on expand/collapse for smooth transition
- Expanded state should be remembered in session

### Inventory Sheet
- Width: 100% on mobile, max 36rem on desktop
- Tabs for color organization
- Single-line layout for unit display
- Show unit ID and last updated date
- Batch actions at status group level
- Status groups clearly separated
- Touch targets minimum 44px (h-11)

### Status Badges
- Consistent colors for each status:
  - Available: Green/Success
  - Display: Blue/Info
  - Transit: Orange/Warning
  - Reserved: Yellow/Gold
  - Unavailable: Gray/Muted
- Include count when grouping
- Clear contrast with background
- Pill shape with proper padding
- Consistent height of 24px (h-6)
- **Responsive behavior:**
  - Badges must wrap to new line when viewport is narrow
  - Container must use `flex-wrap: wrap` and `gap-1.5`
  - On very small screens (< 480px):
    - Consider using smaller text (text-xs)
    - Reduce horizontal padding (px-1.5)
    - Use shorter status labels if needed (e.g., "Avail" instead of "Available")
    - Ensure status count remains visible

### Buttons
- Ghost variant for secondary actions
- Solid variant for primary actions
- Icon size: 16px (4 w-4 h-4)
- Height: 44px (h-11) for normal interactive elements
- Height: 32px (h-8) for compact controls within cards
- Clear hover states
- Consistent corner radius

## Typography

### Hierarchy
1. Page Title: text-2xl (24px)
2. Section Title: text-lg (18px)
3. Card Title: text-base (16px)
4. Body Text: text-sm (14px)
5. Metadata: text-xs (12px)

### Fonts
- UI: System font stack
- Monospace: For unit IDs and technical information
- Font weights:
  - Regular: 400
  - Medium: 500
  - Semibold: 600

## Colors

### Theme Colors
- Primary: Brand color
- Secondary: Subtle variant
- Accent: For hover states
- Muted: For backgrounds
- Border: 40% opacity for subtle separation

### Status Colors
- Available: Green/Success
- Display: Blue/Info
- Transit: Orange/Warning
- Reserved: Yellow/Warning
- Unavailable: Gray/Muted

## Spacing

### Scale
- 4px (1): Minimal separation
- 8px (2): Default gap
- 12px (3): Component padding
- 16px (4): Section padding
- 24px (6): Large separation
- 32px (8): Page padding

### Component Specific
- Card padding: 16px
- Button padding: 12px horizontal
- Input height: 44px (h-11)
- Gap between items: 8px
- Gap between sections: 24px

## Responsive Behavior

### Breakpoints
- Small Mobile: < 480px
- Mobile: < 640px
- Tablet: >= 640px
- Desktop: >= 1024px

### Mobile Adaptations
- Full-width components
- Stack layouts vertically when needed
- Side sheet navigation
- Simplified status displays
- Touch-friendly targets (min 44px)
- **For very small screens (< 480px):**
  - Minimize horizontal padding (px-2 instead of px-4)
  - Use stacked layouts for badge groups
  - Ensure all content fits within viewport with no horizontal scrolling
  - Consider hiding non-essential information
  - Use abbreviated text where appropriate 