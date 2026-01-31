

# Fix Contact Navigation Scrolling from Other Pages

## The Problem
When clicking "Contact" from the menu while on any page other than the homepage, the scroll position stops too high - the "Let's Connect" heading is barely visible at the bottom of the screen instead of being properly positioned at the top.

## Root Cause
The `ScrollToTop` component uses `setTimeout(..., 0)` to scroll to the `#contact` element. This fires before the homepage has fully rendered, meaning:
- The Hero section animations haven't completed
- All section elements haven't reached their final positions
- `element.offsetTop` calculates an incorrect (too low) value

## Solution
Increase the timeout delay in `ScrollToTop.tsx` to give the page time to fully render before calculating the scroll position. A delay of 100-150ms allows all elements to settle into their final positions.

## Files to Modify

### `src/components/ScrollToTop.tsx`
- Change `setTimeout(..., 0)` to `setTimeout(..., 100)`
- This small delay ensures the page has finished rendering before calculating scroll position

## Code Change

**Before:**
```javascript
setTimeout(() => {
  const element = document.getElementById(hash.substring(1));
  if (element) {
    const navHeight = 80;
    const elementPosition = element.offsetTop - navHeight;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
  }
}, 0);
```

**After:**
```javascript
setTimeout(() => {
  const element = document.getElementById(hash.substring(1));
  if (element) {
    const navHeight = 80;
    const elementPosition = element.offsetTop - navHeight;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
  }
}, 100);
```

## Why 100ms?
- Fast enough to feel immediate to users
- Long enough for React to complete its render cycle
- Accounts for CSS animations initializing
- Ensures `offsetTop` returns the accurate final position

## Result
When clicking "Contact" from any page, the user will be taken to the homepage and the view will scroll to properly show the "Let's Connect" section heading at the top of the viewport (accounting for the fixed navigation bar).

