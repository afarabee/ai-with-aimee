
# Plan: Widen Blog Post Content Column

## Overview
Increase the blog post content width from 740px to 900px to make better use of modern screen sizes while maintaining readability and centered layout.

## Current Implementation
The `BlogPost.tsx` component uses `max-w-[740px]` in four locations:
- **Line 158**: Banner image container
- **Line 168**: Gradient divider
- **Line 175**: Main article content
- **Line 185**: Footer signature section

With `px-6` (24px padding each side), the effective content width is ~692px.

## Proposed Changes

### File: `src/pages/BlogPost.tsx`

| Line | Current | Updated |
|------|---------|---------|
| 158 | `max-w-[740px]` | `max-w-[900px]` |
| 168 | `max-w-[740px]` | `max-w-[900px]` |
| 175 | `max-w-[740px]` | `max-w-[900px]` |
| 185 | `max-w-[740px]` | `max-w-[900px]` |

## Visual Comparison

```text
BEFORE (740px container):
┌─────────────────────────────────────────────────────────────────┐
│                    ┌──────────────────────┐                     │
│     margins        │  Content (692px)     │     margins         │
│                    └──────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘

AFTER (900px container):
┌─────────────────────────────────────────────────────────────────┐
│            ┌────────────────────────────────────┐               │
│  margins   │       Content (852px)              │   margins     │
│            └────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

## Technical Details

All four instances of the max-width will be updated from `max-w-[740px]` to `max-w-[900px]`:

1. **Banner image section** (line 158):
   ```tsx
   <div className="max-w-[900px] mx-auto px-6">
   ```

2. **Gradient divider** (line 168):
   ```tsx
   <div className="max-w-[900px] mx-auto px-6">
   ```

3. **Article content** (line 175):
   ```tsx
   <div className="max-w-[900px] mx-auto px-6">
   ```

4. **Footer signature** (line 185):
   ```tsx
   <div className="max-w-[900px] mx-auto px-6">
   ```

## What Stays the Same
- Hero banner container remains at `max-w-5xl` (1024px) - this is intentionally wider
- `mx-auto` keeps content centered
- `px-6` padding (24px each side) is maintained
- All styling, colors, and effects unchanged

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/BlogPost.tsx` | Update 4 instances of `max-w-[740px]` → `max-w-[900px]` |
