

# Add Cursor Glow Effect to About Page

## Overview
Create a page-wide cursor-following glow effect for the About page. Since there are no card/box elements to apply `GlowCard` to, we'll implement a **global cursor spotlight** that creates an ambient glow following the mouse across the entire page background.

## What You'll See
When you move your cursor around the About page:
- A soft, radial glow (pink/cyan gradient) will follow your cursor position
- The glow will subtly illuminate the page background as you explore
- The effect will be smooth and non-intrusive, enhancing the neon aesthetic

## Technical Approach

### Create a New Component: `CursorGlow`
A reusable component that tracks mouse position and renders a full-page radial gradient overlay following the cursor.

**Features:**
- Tracks `mousemove` events on the page
- Renders a fixed-position overlay with a radial gradient centered on cursor
- Smooth transition for natural movement feel
- Only activates on non-touch devices (like existing `GlowCard`)
- Customizable glow colors (defaulting to pink/cyan blend)

### Component Structure
```text
src/components/ui/cursor-glow.tsx

- Uses useState to track mouse { x, y } position
- Uses useEffect to attach/detach mousemove listener
- Renders a fixed overlay div with:
  - pointer-events: none (so it doesn't block interactions)
  - radial-gradient centered at cursor position
  - z-index positioned above background but below content
```

### Integration with About Page
Add the `<CursorGlow />` component to `src/pages/About.tsx`:
- Place it as the first child inside the section
- Configure with pink-cyan gradient to match existing ambient glows
- The overlay will be positioned fixed, covering the viewport

### Visual Parameters
| Property | Value |
|----------|-------|
| Glow Size | 400-600px radius |
| Primary Color | Pink (`#f50ca0`) with 15% opacity |
| Secondary Color | Cyan (`#00ffff`) with 10% opacity |
| Blend | Soft radial gradient fading to transparent |
| Z-Index | Above background (-5), below content (10) |

## Files to Create/Modify

1. **Create:** `src/components/ui/cursor-glow.tsx`
   - New component for page-wide cursor spotlight effect

2. **Modify:** `src/pages/About.tsx`
   - Import and add `<CursorGlow />` component
   - Position it within the section for proper layering

## Result
The About page will have a subtle, ambient glow that follows your cursor, creating an interactive "spotlight" effect that enhances the neon aesthetic without requiring card/box elements.

