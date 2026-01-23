
# Plan: Remove 'Other' Category from Public Model Map

## Overview
Hide the 'Other' category box from the public Model Map page summary grid, similar to how 'Local / Private' is already hidden.

## What Will Change

The 'Other' category card will no longer appear in the category summary grid on the public Model Map page. Users also won't be able to access it via URL manipulation.

## Implementation

### File: `src/pages/ModelMap.tsx`

1. **Update the PUBLIC_CATEGORIES filter** (line 66)
   - Current: Filters out only 'Local / Private'
   - New: Filter out both 'Local / Private' and 'Other'

2. **Update the PRIVATE_CATEGORY_IDS array** (line 71)
   - Current: Only includes 'Local / Private'
   - New: Include both 'Local / Private' and 'Other' to prevent URL manipulation access

### Code Changes

**Line 66 - Update PUBLIC_CATEGORIES:**
```typescript
// Before
const PUBLIC_CATEGORIES = CATEGORIES.filter(cat => cat.id !== 'Local / Private');

// After
const PUBLIC_CATEGORIES = CATEGORIES.filter(cat => !['Local / Private', 'Other'].includes(cat.id));
```

**Line 71 - Update PRIVATE_CATEGORY_IDS:**
```typescript
// Before
const PRIVATE_CATEGORY_IDS = ['Local / Private'];

// After
const PRIVATE_CATEGORY_IDS = ['Local / Private', 'Other'];
```

## What Stays the Same

- The admin Model Map Dashboard continues to show all categories including 'Other'
- Existing test data for 'Other' prompts remains in the database
- The Prompt Library and Test Lab can still use 'Other' as a category

## Technical Details

- **Files modified:** 1 file (`src/pages/ModelMap.tsx`)
- **Lines changed:** 2 lines
- **Risk level:** Low - simple filter update with no side effects
