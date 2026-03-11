

## Plan: Replace #ff69b4 with #ff00ff

**Scope**: Only `src/pages/WhyAimee.tsx` — all 20 occurrences are in this file.

**Change**: Replace every instance of `linear-gradient(90deg, #ff00ff, #ff69b4)` with a solid `#ff00ff` color (since both gradient stops become the same value, a flat color is cleaner).

Alternatively, if you want to keep a gradient feel, I can shift the second stop to a slightly different shade. But since the goal is to use `#ff00ff` throughout, the simplest approach is to either:
- Use `color: '#ff00ff'` directly, or
- Keep the gradient syntax with `#ff00ff` on both ends (no visual difference)

I'll replace all gradient backgrounds with a simple `color: '#ff00ff'` with the transparent text clip technique preserved.

