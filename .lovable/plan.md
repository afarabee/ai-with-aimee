

# Add Cursor-Following Glow Effects to Benchmarks Page

## Overview
Apply the same interactive cursor-following glow effect used on the Homepage, Projects, and Blog pages to the Benchmarks page (ModelMap.tsx). This effect creates a spotlight glow that follows the cursor and intensifies the card border on hover.

## Current State
- **Homepage, Projects, Blog**: Use the `GlowCard` component which tracks mouse position and renders a radial gradient overlay following the cursor
- **Benchmarks page**: Uses standard shadcn `Card` components with static borders and backgrounds - no cursor-tracking glow

## Implementation Approach

### Option 1: Replace `Card` with `GlowCard` (Recommended)
Replace all `Card` components on the Benchmarks page with the existing `GlowCard` component, which already implements the cursor-following effect.

**Cards to update:**
1. **AI Coding Tools section** - Tool cards (lines 297-316)
2. **AI Models section** - Category cards (lines 353-386)
3. **Methodology section** - Scoring criteria cards (lines 493-575)
4. **Category Detail View** - Top Picks, Best Practices, Strengths, Weaknesses cards (lines 607-699)

### Customization Needed
The current `GlowCard` uses hardcoded cyan glow colors. The Benchmarks page uses different accent colors per section:
- **AI Coding Tools**: Pink accent
- **AI Models**: Cyan accent
- **Methodology**: Yellow/Pink accents

**Solution**: Enhance `GlowCard` to accept a `glowColor` prop for customizable glow colors (the prop already exists but isn't used in the gradient).

---

## Technical Details

### Step 1: Update GlowCard Component
Modify `src/components/ui/glow-card.tsx` to use the `glowColor` prop in the radial gradient overlay.

```text
Current (hardcoded):
background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 255, 255, 0.15), transparent 40%)`

Updated (dynamic):
background: `radial-gradient(600px circle at ${x}px ${y}px, ${glowColor}25, transparent 40%)`
```

### Step 2: Update ModelMap.tsx
Replace `Card` imports/usages with `GlowCard` and pass appropriate `glowColor` values:

| Section | Current | After | Glow Color |
|---------|---------|-------|------------|
| AI Coding Tools cards | `Card` | `GlowCard` | Dynamic (purple, cyan, amber, pink, green, blue cycle) |
| AI Models category cards | `Card` | `GlowCard` | Cyan (`#00ffff`) |
| Methodology criteria cards | `Card` | `GlowCard` | Pink/Cyan based on card type |
| Detail view cards | `Card` | `GlowCard` | Cyan (`#00ffff`) |

### Step 3: Adjust Padding
`GlowCard` wraps children in a `p-6` div. Adjust the inner padding of cards to avoid double-padding issues (current cards use `p-4` or `p-5`).

---

## Visual Result
After implementation, hovering over any card on the Benchmarks page will:
1. Display a subtle radial glow following the cursor position
2. Intensify the border glow/shadow
3. Apply a slight scale transform (1.03x) for interactive feedback

This matches the behavior on the Homepage Proven Impact section, Blog cards, and Projects cards.

