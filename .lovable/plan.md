

# Simplify Demo Page Layout

## Overview
Streamline the Demo page by removing unnecessary UI elements and embedding the live Intelligent Story Builder application.

## Changes Summary

| Change | Action |
|--------|--------|
| Third scenario card | Remove "Upload & Generate" |
| Grid layout | Change to 2-column (`md:grid-cols-2`) |
| "Choose Your Experience" header | Remove |
| "Explore the Full Tool" header | Remove |
| Collapsible sidebar | Remove entirely |
| Iframe | Embed live app URL |
| Return Home button | Keep as-is |

## Visual Before/After

```text
BEFORE:
┌─────────────────────────────────────────────────────────────┐
│  Zone 1: Context Hook                                       │
├─────────────────────────────────────────────────────────────┤
│  "Choose Your Experience" ← REMOVE                          │
│  [Card 1] [Card 2] [Card 3] ← REMOVE Card 3                 │
├─────────────────────────────────────────────────────────────┤
│  "Explore the Full Tool" ← REMOVE                           │
│  ┌──────────────────────────┐ ┌────────────────────┐        │
│  │  Placeholder iframe      │ │ What You're Seeing │ REMOVE │
│  └──────────────────────────┘ └────────────────────┘        │
│                    [Return Home]                            │
└─────────────────────────────────────────────────────────────┘

AFTER:
┌─────────────────────────────────────────────────────────────┐
│  Zone 1: Context Hook                                       │
├─────────────────────────────────────────────────────────────┤
│  [Quick Demo]          [Compare AI Models]                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │  https://intelligent-ai-story-builder.lovable.app/   │   │
│  │              (Full-width iframe)                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                    [Return Home]                            │
└─────────────────────────────────────────────────────────────┘
```

## File Changes

### `src/pages/Demo.tsx`

**1. Update imports** - Remove unused icons and Collapsible components:
```typescript
// Remove: Upload, ChevronRight, ChevronDown, Database, GitBranch, Settings
// Remove: Collapsible, CollapsibleContent, CollapsibleTrigger
```

**2. Remove scenarios array item** - Delete "Upload & Generate" card (third item)

**3. Remove features array** - No longer needed without sidebar

**4. Remove sidebar state** - Delete `useState` for `sidebarOpen`

**5. Remove "Choose Your Experience" header** - Delete the h2 element in Zone 2

**6. Update scenario cards grid** - Change to 2-column layout:
```typescript
<div className="grid md:grid-cols-2 gap-6">
```

**7. Remove "Explore the Full Tool" header** - Delete the h2 element in Zone 3

**8. Remove collapsible sidebar** - Change grid from `lg:grid-cols-[1fr_280px]` to full-width, remove entire Collapsible component

**9. Embed live iframe** - Replace placeholder with actual URL:
```typescript
<iframe
  src="https://intelligent-ai-story-builder.lovable.app/"
  className="w-full h-full border-0"
  title="Intelligent Story Builder Demo"
  allow="clipboard-write"
/>
```

## Technical Notes

- Iframe will be full-width without the sidebar
- Existing GlowCard styling preserved for the 2 remaining scenario cards
- Return Home button remains unchanged at bottom
- No new dependencies required

