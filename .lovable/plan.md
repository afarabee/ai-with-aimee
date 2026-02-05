

# Demo Page - Three Zone Reorganization

## Overview
Refine the existing Demo page layout to clearly establish three distinct zones with improved copy and visual separation. The structure is already mostly in place - this is primarily a content update and visual polish pass.

## The Three Zones

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Navigation                                                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ZONE 1: CONTEXT HOOK                                                           │
│  ─────────────────────                                                          │
│  "Intelligent Story Builder"                                                    │
│  Generate production-ready Agile user stories in seconds.                       │
│  This tool reduced story creation time by 80% across 20+ product teams.         │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ZONE 2: GUIDED EXPERIENCE                                                      │
│  ─────────────────────────                                                      │
│  "Choose Your Experience" (section header)                                      │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Quick Demo     │  │  Compare AI     │  │  Upload &       │                  │
│  │  ⏱ 30 sec       │  │  Models ⏱ 1min  │  │  Generate ⏱ 2min│                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ZONE 3: FULL INTERACTIVE DEMO                                                  │
│  ─────────────────────────────                                                  │
│  "Explore Freely" (section header)                                              │
│                                                                                 │
│  ┌─────────────────────────────────────────────────┐  ┌──────────────────────┐  │
│  │                                                 │  │  What You're Seeing  │  │
│  │              Embedded Demo (iframe)             │  │  ▸ RAG Context       │  │
│  │                                                 │  │  ▸ Prompt Versioning │  │
│  │                                                 │  │  ▸ DevOps Integration│  │
│  └─────────────────────────────────────────────────┘  └──────────────────────┘  │
│                                                                                 │
│                           [← Return Home]                                       │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Changes by Zone

### Zone 1: Context Hook (Update Existing Hero)

**Current Text:**
> "This is the AI system I built at Charles River Labs to help product teams write better user stories, faster..."

**New Text:**
- **Headline**: Intelligent Story Builder (keep)
- **Tagline**: "Generate production-ready Agile user stories in seconds."
- **Hook**: "This tool reduced story creation time by 80% across 20+ product teams."

The intro becomes more punchy - 2 sentences instead of a paragraph.

### Zone 2: Guided Experience (Add Section Header)

- Add a subtle section header: "Choose Your Experience" with a divider
- Keep existing scenario cards (they're already well-structured)
- Cards already show duration badges (30 sec, 1 min, 2 min)

### Zone 3: Full Interactive Demo (Add Section Header)

- Add a subtle section header: "Explore the Full Tool" or "Dive In"
- Keep existing iframe container and collapsible sidebar
- The sidebar stays as "What You're Seeing" for technical context

## File Changes

### `src/pages/Demo.tsx`

| Section | Change |
|---------|--------|
| Hero (Zone 1) | Replace long intro paragraph with punchy 2-sentence hook |
| Scenario Cards (Zone 2) | Add "Choose Your Experience" section header |
| Iframe Section (Zone 3) | Add "Explore the Full Tool" section header |

## Updated Content

### Zone 1 - New Intro Copy

```typescript
<section className="max-w-6xl mx-auto px-6 py-12">
  <div className="mb-6">
    <h1 className="...">Intelligent Story Builder</h1>
  </div>
  <p className="text-xl md:text-2xl text-foreground/90 font-medium mb-3">
    Generate production-ready Agile user stories in seconds.
  </p>
  <p className="text-lg text-muted-foreground">
    This tool reduced story creation time by 80% across 20+ product teams.
  </p>
</section>
```

### Zone 2 - Section Header

```typescript
<section className="max-w-6xl mx-auto px-6 py-8">
  <h2 className="text-sm uppercase tracking-wider text-pink-400 font-medium mb-6">
    Choose Your Experience
  </h2>
  <div className="grid md:grid-cols-3 gap-6">
    {/* Existing scenario cards */}
  </div>
</section>
```

### Zone 3 - Section Header

```typescript
<section className="max-w-7xl mx-auto px-6 py-8">
  <h2 className="text-sm uppercase tracking-wider text-cyan-400 font-medium mb-6">
    Explore the Full Tool
  </h2>
  <div className="grid lg:grid-cols-[1fr_280px] gap-6">
    {/* Existing iframe + sidebar */}
  </div>
</section>
```

## Visual Hierarchy

| Zone | Header Style | Color Accent |
|------|-------------|--------------|
| 1 - Context | H1 neon-text-yellow | Yellow (brand) |
| 2 - Guided | Uppercase tracking-wider | Pink |
| 3 - Full Demo | Uppercase tracking-wider | Cyan |

This creates clear visual separation between zones while maintaining the existing design system.

## Technical Notes

- No new components needed
- No new dependencies
- Changes are primarily to content and adding section headers
- Existing GlowCard, Collapsible, and styling remain unchanged

