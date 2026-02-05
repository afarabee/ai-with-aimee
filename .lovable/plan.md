
# Enhance Demo Page Iframe Section

## Overview
Add two visual enhancements to the iframe section on the Demo page to improve user experience and create visual consistency with the site's neon aesthetic.

## Enhancements Summary

| Enhancement | Description |
|-------------|-------------|
| Animated border | Pink/cyan pulsing glow around the iframe container |
| Hint text | Instructional text above the iframe prompting interaction |

## Visual Representation

```text
┌─────────────────────────────────────────────────────────────┐
│  Zone 1: Context Hook                                       │
├─────────────────────────────────────────────────────────────┤
│  [Quick Demo]          [Compare AI Models]                  │
├─────────────────────────────────────────────────────────────┤
│         👆 This is a live demo—go ahead and interact!       │  ← NEW
│  ┌ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ┐   │
│  ║                                                       ║   │  ← Animated
│  ║   https://intelligent-ai-story-builder.lovable.app/  ║   │     border
│  ║                                                       ║   │
│  └ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ┘   │
│                    [Return Home]                            │
└─────────────────────────────────────────────────────────────┘
```

## File Changes

### `src/pages/Demo.tsx`

**1. Add hint text above the iframe**

Insert a paragraph element above the iframe container with:
- Text: "This is a live demo—go ahead and interact!"
- Styling: Brand pink color with subtle glow
- Icon: Hand pointer (MousePointerClick) or similar indicator

**2. Apply animated glow border to iframe container**

The site already has the `animate-banner-glow` class defined in `index.css` that pulses between pink and cyan. Apply this existing animation to the iframe container for consistency:

```tsx
<section className="max-w-7xl mx-auto px-6 py-8">
  {/* Interaction hint */}
  <p className="text-center text-pink-400 mb-4 flex items-center justify-center gap-2">
    <MousePointerClick className="w-5 h-5" />
    <span>This is a live demo—go ahead and interact!</span>
  </p>
  
  {/* Iframe with animated glow border */}
  <div className="relative rounded-2xl border border-pink-500/30 animate-banner-glow bg-card/50 backdrop-blur-sm overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5" />
    <div className="relative h-[50vh] md:h-[70vh]">
      <iframe ... />
    </div>
  </div>
</section>
```

**3. Add icon import**

Add `MousePointerClick` (or `Pointer`) to the existing Lucide imports.

## Technical Notes

- **Reuses existing animation**: The `animate-banner-glow` animation is already defined in `src/index.css` (lines 503-520) and includes reduced-motion accessibility support
- **Animation timing**: 4-second cycle, easing in/out between pink and cyan glows
- **Accessibility**: The hint text provides clear instruction; the animation respects `prefers-reduced-motion`
- **No new CSS required**: All styling uses existing utility classes and animations
