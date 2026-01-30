

# Layout Redesign Plan: My AI Benchmarks Page

## Overview

This plan addresses the layout issues on the My AI Benchmarks page by improving visual hierarchy, creating better section separation, and converting the Testing Methodology to a cleaner vertical list format.

---

## Current Issues

1. **Subtitle wrapping**: The subtitle text creates unbalanced line breaks
2. **Methodology section**: Card grid creates awkward empty spaces (7 cards in 2-column grid = uneven layout)
3. **Lack of visual separation**: All sections blend together without clear boundaries
4. **Inconsistent vertical rhythm**: Spacing varies between sections

---

## Proposed Changes

### 1. Hero Section - Subtitle Fix

Adjust the subtitle container to create more balanced text wrapping:

- Change max-width from `max-w-2xl` (672px) to approximately 580px
- This forces a more natural break point in the subtitle text
- Result: More visually balanced two-line layout

---

### 2. Section Container Redesign

Create distinct visual zones with different background treatments:

**AI Coding Tools Section**
- Wrap in a dedicated container with subtle pink-tinted background
- Background: `rgba(245, 12, 160, 0.03)` (very subtle pink tint)
- Border: `1px solid hsl(var(--color-pink) / 0.15)`
- Rounded corners and subtle glow
- Padding: `py-10 px-6`

**AI Models Section**
- Keep current styling but add container wrapper
- Background: `rgba(0, 255, 255, 0.02)` (very subtle cyan tint)
- Border: `1px solid hsl(var(--color-cyan) / 0.1)`
- This creates visual distinction from the tools section

**Neon Divider Between Sections**
- Add a horizontal gradient line between Tools and Models sections
- Style: `linear-gradient(90deg, transparent 0%, hsl(180 100% 56%) 30%, hsl(320 95% 50%) 70%, transparent 100%)`
- This matches the existing divider pattern used on About page

---

### 3. Testing Methodology - Vertical List Redesign

Convert the 7-card grid into two distinct parts:

**Part A: Process Steps (1-4)**
Clean vertical numbered list format:

```text
┌─────────────────────────────────────────────┐
│  Testing Methodology                        │
├─────────────────────────────────────────────┤
│                                             │
│  1  Prompt Design                           │
│     Each test uses real prompts...          │
│  ─────────────────────────────────────      │
│  2  Multi-Model Testing                     │
│     The same prompt is run across...        │
│  ─────────────────────────────────────      │
│  3  Criteria Scoring                        │
│     Models and tools are rated 1-5...       │
│  ─────────────────────────────────────      │
│  4  AI Analysis                             │
│     Aggregate scores are analyzed...        │
│                                             │
└─────────────────────────────────────────────┘
```

- Single column layout with full-width items
- Clean separator lines between steps (subtle cyan gradient)
- Larger step numbers (8x8 circles instead of 6x6)
- More generous spacing between items (space-y-6)

**Part B: Scoring Criteria Cards (3 cards)**
Keep as grid but optimize layout:

- 3 equal-width cards in a row on desktop
- Model Criteria | Output Criteria | Tool Criteria
- Subtle background differentiation (slightly deeper purple)
- Yellow-tinted container background: `rgba(249, 249, 64, 0.02)`

---

### 4. Consistent Vertical Spacing

Establish a clear spacing rhythm throughout:

| Section                     | Margin Top | Padding    |
|-----------------------------|------------|------------|
| Hero                        | pt-28      | pb-8       |
| AI Coding Tools container   | mt-0       | py-10 px-8 |
| Divider                     | my-10      | —          |
| AI Models container         | mt-0       | py-10 px-8 |
| Methodology container       | mt-16      | py-10 px-8 |

---

### 5. Container Styling Details

Each major section will have:

```css
/* Section container base */
.section-container {
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  padding: 2.5rem 2rem;
}

/* Tools Section - Pink accent */
background: rgba(245, 12, 160, 0.03);
border: 1px solid hsl(var(--color-pink) / 0.12);

/* Models Section - Cyan accent */
background: rgba(0, 255, 255, 0.02);
border: 1px solid hsl(var(--color-cyan) / 0.12);

/* Methodology Section - Yellow accent */
background: rgba(249, 249, 64, 0.02);
border: 1px solid hsl(var(--color-yellow) / 0.1);
```

---

## Technical Implementation

### Files to Modify

**src/pages/ModelMap.tsx**

1. **Hero section (lines 220-241)**
   - Reduce subtitle max-width to ~580px

2. **AI Coding Tools section (lines 248-311)**
   - Wrap in styled container div with pink-tinted background
   - Add rounded corners and subtle border

3. **Add neon divider (after tools section)**
   - Insert gradient divider element between Tools and Models

4. **AI Models section (lines 313-364)**
   - Wrap in styled container div with cyan-tinted background
   - Adjust top margin (reduce from mt-24 to mt-0 since divider handles separation)

5. **Testing Methodology section (lines 366-530)**
   - Wrap entire section in yellow-tinted container
   - Convert steps 1-4 from grid to vertical list with separator lines
   - Keep criteria cards (Model/Output/Tool) as 3-column grid
   - Add subtle header to distinguish "How It Works" from "Scoring Criteria"

---

## Visual Result

The page will have three clearly defined zones with subtle color differentiation:

```text
┌─────────────────────────────────────────────────┐
│                    HERO                         │
│         My AI Benchmarks (title)                │
│   Balanced subtitle with better wrapping        │
└─────────────────────────────────────────────────┘

┌─ PINK TINT ─────────────────────────────────────┐
│     🔧 AI Coding Tools                          │
│   ┌──────┐  ┌──────┐  ┌──────┐                 │
│   │Lovable│  │Cursor│  │Windsurf│               │
│   └──────┘  └──────┘  └──────┘                 │
└─────────────────────────────────────────────────┘
          ═══════════════════════════
              (neon gradient line)
          ═══════════════════════════
┌─ CYAN TINT ─────────────────────────────────────┐
│     🧠 AI Models                                │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│   │Deep  │  │General│  │Coding│  │Research│    │
│   └──────┘  └──────┘  └──────┘  └──────┘       │
└─────────────────────────────────────────────────┘

┌─ YELLOW TINT ───────────────────────────────────┐
│     📖 Testing Methodology                      │
│                                                 │
│   How It Works                                  │
│   ────────────                                  │
│   1. Prompt Design                              │
│   2. Multi-Model Testing                        │
│   3. Criteria Scoring                           │
│   4. AI Analysis                                │
│                                                 │
│   Scoring Criteria                              │
│   ────────────────                              │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│   │  Model   │ │  Output  │ │   Tool   │       │
│   │ Criteria │ │ Criteria │ │ Criteria │       │
│   └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────┘
```

---

## Summary

This redesign creates visual breathing room and clear section boundaries while maintaining the existing content and brand aesthetic. The colored container backgrounds are subtle enough not to distract but strong enough to create distinct zones.

