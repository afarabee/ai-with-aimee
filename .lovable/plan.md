

# Move Closing Fields to Vision Section + Update CTA Footer

Move the closing tagline/subtext into the Vision section on the public page, and replace the CTA footer with a static "Let's Connect" heading with real clickable contact links.

---

## Changes

**File:** `src/pages/WhyAimee.tsx`

### 1. Vision Section (after the vision cards grid, line 326)
Insert a centered block displaying `data.closing_tagline` and `data.closing_subtext` below the vision point cards, before the section closes.

### 2. CTA Footer Box (lines 353-371)
Replace with:
- Static heading: **"Let's Connect"**
- Contact line: **Aimee Farabee** - Manchester, TN - 813-503-0323 - linked email
- Links row with real anchor tags:
  - **Email:** mailto:aimee.farabee@gmail.com
  - **LinkedIn:** https://www.linkedin.com/in/aimee-farabee/
  - **AI Portfolio:** https://ai-with-aims.studio
  - **GitHub:** https://github.com/afarabee

All links open in new tabs (except email) and are styled as clickable text with hover effects matching the page aesthetic.

### No other files changed.

