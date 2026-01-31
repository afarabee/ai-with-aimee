

# Add Smooth Scroll-Triggered Animations to Homepage Sections

## Overview
Implement polished, scroll-triggered animations across all homepage sections using Intersection Observer for performance. Each section will have unique entrance animations that maintain the cyberpunk aesthetic while feeling premium and fluid.

## Animation Specifications

| Section | Animation Type | Duration | Trigger | Details |
|---------|---------------|----------|---------|---------|
| **Hero** | Fade up on load | 0.6-0.8s | Page load | Heading, tagline, and content fade in with slight upward motion |
| **Proven Impact** | Staggered slide up | 0.6s + 100ms stagger | 15% viewport | 4 cards animate sequentially |
| **Blog** | Alternating slide-in | 0.7s | 15% viewport | Cards slide from left/right/left |
| **Projects** | Scale + fade | 0.6s | 15% viewport | Cards start at 95% size, scale to 100% |

---

## Technical Implementation

### Step 1: Create Custom useScrollAnimation Hook
A reusable hook that wraps Intersection Observer with configurable options.

**Location:** `src/hooks/useScrollAnimation.ts`

**Features:**
- Configurable threshold (default: 0.15 = 15%)
- Returns `ref` to attach to elements and `isVisible` state
- Option for `once` (trigger only first time) vs continuous
- Respects `prefers-reduced-motion` for accessibility

```text
interface Options {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

Returns: { ref: RefObject, isVisible: boolean }
```

### Step 2: Add Animation Keyframes to Tailwind Config
Extend `tailwind.config.ts` with new scroll animation keyframes.

**New keyframes:**
```text
"fade-up": {
  "0%": { opacity: "0", transform: "translateY(20px)" },
  "100%": { opacity: "1", transform: "translateY(0)" }
}

"slide-in-left": {
  "0%": { opacity: "0", transform: "translateX(-40px)" },
  "100%": { opacity: "1", transform: "translateX(0)" }
}

"slide-in-right": {
  "0%": { opacity: "0", transform: "translateX(40px)" },
  "100%": { opacity: "1", transform: "translateX(0)" }
}

"scale-fade-in": {
  "0%": { opacity: "0", transform: "scale(0.95)" },
  "100%": { opacity: "1", transform: "scale(1)" }
}
```

**New animations:**
```text
"fade-up": "fade-up 0.7s ease-out forwards"
"slide-in-left": "slide-in-left 0.7s ease-out forwards"
"slide-in-right": "slide-in-right 0.7s ease-out forwards"
"scale-fade-in": "scale-fade-in 0.6s ease-out forwards"
```

### Step 3: Update Hero Section
**File:** `src/components/HeroSection.tsx`

**Changes:**
- Add `useScrollAnimation` hook (though Hero uses page load, not scroll)
- Apply staggered fade-up animation to content elements on mount
- Animate in this order with 100-150ms stagger:
  1. Logo image (already has fadeIn)
  2. Heading ("Product Leader Turned...")
  3. Tagline ("Turning AI curiosity...")
  4. Body paragraph
  5. CTA buttons
  6. "Learn more" link

**Current state:** Logo already animates with `fadeIn` keyframe. Other elements appear instantly.

**Implementation approach:**
- Use CSS animation with `opacity-0` initial state
- Add `animate-fade-up` class with animation-delay for stagger
- Each element gets progressively longer delay

### Step 4: Update Proven Impact Section
**File:** `src/components/ProvenImpactSection.tsx`

**Changes:**
- Import and use `useScrollAnimation` hook
- Track visibility state for the card grid
- Apply staggered slide-up animation to each of the 4 GlowCards
- Cards start invisible (`opacity-0 translate-y-6`)
- When visible: apply `animate-fade-up` with stagger delays (0ms, 100ms, 200ms, 300ms)

**Animation timing:**
- Card 1: 0ms delay
- Card 2: 100ms delay
- Card 3: 200ms delay
- Card 4: 300ms delay
- Duration: 0.6s each
- Easing: ease-out

### Step 5: Update Blog Section
**File:** `src/components/BlogSection.tsx`

**Current state:** Already has Intersection Observer and `isVisible` state for the 3D carousel effect.

**Changes:**
- The carousel already has visibility-based animations
- Enhance by ensuring the initial card entrance uses alternating slide directions
- Since this is a carousel, the alternating effect applies to the initial 3 visible cards:
  - Left card: slides from left
  - Center card: fades up
  - Right card: slides from right

**Note:** The Blog section already implements sophisticated entrance animations via the carousel. We'll refine the existing transitions to ensure smooth ease-out timing (currently uses `ease-in-out`).

### Step 6: Update Projects Section
**File:** `src/components/ProjectsSection.tsx`

**Current state:** Already has Intersection Observer tracking `visibleCards` state and applies `opacity-0 translate-y-8` → `opacity-100 translate-y-0` transition.

**Changes:**
- Modify animation from translate-y to scale effect
- Initial state: `opacity-0 scale-[0.95]`
- Visible state: `opacity-100 scale-100`
- Update transition timing from `0.5s` to `0.6s ease-out`
- Keep existing stagger behavior (each card animates as it enters viewport)

---

## Accessibility Considerations

### Reduced Motion Support
All animations will respect `prefers-reduced-motion`:
```text
@media (prefers-reduced-motion: reduce) {
  .animate-fade-up,
  .animate-slide-in-left,
  .animate-slide-in-right,
  .animate-scale-fade-in {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useScrollAnimation.ts` | Create | Reusable Intersection Observer hook |
| `tailwind.config.ts` | Modify | Add new keyframes and animation utilities |
| `src/index.css` | Modify | Add reduced-motion styles for new animations |
| `src/components/HeroSection.tsx` | Modify | Add staggered fade-up on page load |
| `src/components/ProvenImpactSection.tsx` | Modify | Add scroll-triggered staggered cards |
| `src/components/BlogSection.tsx` | Modify | Refine existing carousel entrance timing |
| `src/components/ProjectsSection.tsx` | Modify | Change to scale-fade animation |

---

## Visual Result
When scrolling through the homepage:

1. **Hero** (on load): Elements gracefully fade in from below in sequence, creating a "reveal" effect
2. **Proven Impact** (on scroll): The 4 impact cards cascade upward one after another with 100ms stagger
3. **Blog** (on scroll): The 3D carousel smoothly materializes with refined ease-out timing
4. **Projects** (on scroll): Project cards gently scale up from 95% to 100% as they enter view

All animations use consistent 0.6-0.8s duration with ease-out timing for a polished, premium feel that maintains the cyberpunk aesthetic without being gimmicky.

