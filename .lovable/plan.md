
# Move Closing Statement Under Vision Title + Restyle as Badge Box

## What Changes

**File:** `src/pages/WhyAimee.tsx`

### 1. Move the closing statement block (lines 328-338)
- Remove from its current position (after the vision cards grid)
- Insert it immediately after the vision section title (line 311), before the cards grid

### 2. Restyle as a single styled box
- Combine `closing_tagline` and `closing_subtext` into one box styled like the role badge in the hero section
- The box will have:
  - Rounded corners with a cyan-to-emerald gradient background
  - Dark text (slate-900) for contrast
  - `closing_tagline` as bold text, `closing_subtext` as smaller text below it, both inside the same pill/box
  - Centered layout with a subtle glow pulse animation matching the role badge
  - A `mb-8` margin to separate it from the vision cards below

### Result
The visual flow will be:
1. Vision Section Title (magenta gradient, Orbitron)
2. Closing tagline + subtext box (cyan-emerald gradient pill, matching the role badge style)
3. Vision point cards (2-column grid)
