# RT Inventory Development Techniques & Workflows

This document captures the various development techniques, tools, and workflows used in the RT Inventory project. It serves as a reference for current team members and onboarding guide for new developers.

## UI Development Approaches

### 1. Cleanshot X + Google AI Studio Method (Recommended)

**Overview:**
This technique uses screen recordings with contextual commentary to efficiently communicate design requirements and implementations.

**Process:**
1. Record screen interactions using Cleanshot X to capture the UI functionality or issue
2. Add verbal/text comments during recording to explain goals and requirements
3. Upload the recording to Google AI Studio
4. Use AI's description and understanding to guide Cursor in code implementation
5. Refine the implementation based on further feedback

**Benefits:**
- "Video worth 10k words" - provides richer context than static screenshots
- Significantly faster than previous methods
- Improves AI understanding of complex interactions and UI behavior
- Captures dynamic behaviors that can't be shown in static images
- Records the developer's thought process in real-time

**When to use:**
- For complex UI interactions that are difficult to describe in text
- When troubleshooting UI bugs that only manifest during specific interactions
- For showing responsive design behaviors across different screen sizes
- When communicating subtle animation or transition requirements

**Example (Session 005):**
Used to address the BrandCombobox component issue, resulting in faster implementation and better understanding of the search input positioning and event handling problems.

### 2. Onlook Method

**Overview:**
Using Onlook (https://onlook.com/) for visual React interface development and adjustments.

**Process:**
1. Create UI mockups in Onlook
2. Make visual design adjustments in real-time
3. Export components or design specifications
4. Implement in code with Cursor

**Benefits:**
- Good for initial design exploration
- Provides a visual canvas for UI adjustments
- Helps with component positioning and layout
- Offers a shared visual reference for team discussions

**When to use:**
- For initial UI design exploration
- When focused primarily on static layout and appearance
- For team design reviews and discussions

### 3. Chrome DevTools + Cursor Method

**Overview:**
Using Chrome DevTools for debugging and direct code editing with Cursor.

**Process:**
1. Inspect elements with Chrome DevTools
2. Debug issues using browser console and element inspection
3. Test CSS changes directly in the browser
4. Implement confirmed changes in Cursor

**Benefits:**
- Precise debugging of DOM structures and styles
- Real-time feedback on CSS changes
- Network and performance insights
- Access to browser console for JavaScript debugging

**When to use:**
- For troubleshooting specific browser rendering issues
- When debugging JavaScript runtime behavior
- For optimizing performance
- When making small, targeted style adjustments

## Documentation Workflows

### Component Documentation

For new or significantly modified components:

1. Create dedicated component documentation in `docs/building-documentation/`
2. Include sections on:
   - Component overview and purpose
   - Key implementation details
   - Challenges and solutions
   - Usage examples
   - Future considerations

### Session Documentation

After each development session:

1. Update the relevant session document in `docs/sessions/`
2. Record:
   - Key achievements
   - Challenges faced
   - Solutions implemented
   - Techniques used (including which of the above approaches)
   - Next steps

## CI/CD and Testing Workflows

*To be documented as these processes are established*

## Best Practices

1. **Record key decisions** - Document why certain technical approaches were chosen
2. **Update documentation promptly** - Keep docs current with code changes
3. **Include visuals** - Add screenshots or video links where helpful
4. **Cross-reference** - Link between related documentation files
5. **Note challenges** - Document issues and their solutions for future reference

## Environment Setup

*To be documented as the development environment is standardized* 