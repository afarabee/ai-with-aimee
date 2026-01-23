
# Plan: Hide "Local / Private" Category from Public Model Map

## Overview
The public Model Map page at `/model-map` currently displays a "Local / Private" category alongside other categories like Deep Reasoning, Coding, etc. This category should be hidden from public visitors while remaining accessible in the admin dashboard for internal testing.

## What Will Change

The public Model Map page will no longer show the "Local / Private" category card in the summary grid. If a user somehow navigates to that category directly (via URL manipulation), they won't see it listed.

## Implementation

### File: `src/pages/ModelMap.tsx`

1. **Create a filtered categories list for public display**
   - Add a new constant `PUBLIC_CATEGORIES` that filters out "Local / Private" from the `CATEGORIES` array
   - Use this filtered list when rendering the summary grid

2. **Update the summary grid rendering**
   - Replace `CATEGORIES.map(...)` with `PUBLIC_CATEGORIES.map(...)` in the grid display

### Code Changes

```typescript
// Add after CATEGORIES definition (around line 63)
const PUBLIC_CATEGORIES = CATEGORIES.filter(cat => cat.id !== 'Local / Private');
```

Then update line ~200 to use:
```typescript
{PUBLIC_CATEGORIES.map((cat) => {
```

## What Stays the Same

- The admin Model Map Dashboard (`/admin/model-map`) will continue to show all categories including "Local / Private"
- Any existing test data for "Local / Private" prompts remains in the database
- The Prompt Library and Test Lab can still use "Local / Private" as a category

## Technical Details

- **Files modified:** 1 file (`src/pages/ModelMap.tsx`)
- **Lines changed:** ~2 lines (add filter constant, update map reference)
- **Risk level:** Low - simple filter operation with no side effects
- **Testing:** Visit `/model-map` and verify "Local / Private" card is not visible
