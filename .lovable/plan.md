

# Fix: Remove Iframe Scrollbar on Demo Page

## The Problem
The iframe is set to `h-[50vh]` (mobile) / `h-[70vh]` (desktop), which isn't tall enough for the embedded Story Builder app, causing it to show a vertical scrollbar.

## The Fix
**File:** `src/pages/Demo.tsx` (line 158)

Change the iframe container height from:
```
h-[50vh] md:h-[70vh]
```
to:
```
h-[80vh] md:h-[90vh]
```

This gives the embedded app significantly more vertical space, which should eliminate the scrollbar on most screen sizes. Since we don't control the embedded app's internal layout, this is the best approach -- making the frame tall enough that the app's content fits without needing to scroll.

## What Stays the Same
- Scenario cards, page header, CTA banner, quick-start steps -- all untouched.
- Browser chrome title bar and styling -- unchanged.
- Only the height value on the iframe wrapper div changes.

