
# Plan: Adjust Methodology Section to 2-Column, 3-Row Layout

## Overview
Restructure the Testing Methodology section on the public Model Map page from a 4-column single-row layout to a 2-column, 3-row grid (6 items total) for better visual balance and symmetry with the category cards above.

## What Will Change

The methodology section will display 6 cards in a 2x3 grid layout:
- Row 1: Prompt Design, Multi-Model Testing
- Row 2: Criteria Scoring, AI Analysis  
- Row 3: Two new cards combining the scoring criteria details

## Implementation

### File: `src/pages/ModelMap.tsx`

1. **Change grid class from 4 columns to 2 columns**
   - Update line 284 from `lg:grid-cols-4` to `lg:grid-cols-2`
   - New class: `grid grid-cols-1 md:grid-cols-2 gap-4`

2. **Add two new cards to complete the 6-item grid**
   - Card 5: "Model Criteria" - covers Accuracy, Speed, Style
   - Card 6: "Output Criteria" - covers Practical Guidance, Technical Detail, X-Factor

3. **Remove the separate full-width Scoring Criteria card**
   - Delete the standalone scoring criteria card (lines 370-410) since its content is now integrated into the grid

### Visual Layout

```text
+---------------------+---------------------+
|  1. Prompt Design   | 2. Multi-Model Test |
+---------------------+---------------------+
| 3. Criteria Scoring |   4. AI Analysis    |
+---------------------+---------------------+
|  5. Model Criteria  |  6. Output Criteria |
+---------------------+---------------------+
```

### New Cards Content

**Card 5 - Model Criteria:**
- Icon: Target
- Lists: Accuracy, Speed, Style with brief descriptions

**Card 6 - Output Criteria:**
- Icon: Sparkles  
- Lists: Practical Guidance, Technical Detail, X-Factor with descriptions

## Technical Details

- **Files modified:** 1 file (`src/pages/ModelMap.tsx`)
- **Changes:** Update grid class, add 2 new cards, remove standalone scoring card
- **Styling:** Matches existing card styling with cyan borders and dark purple background
- **Risk level:** Low - visual restructuring only, no logic changes
