

# Demo Page Full Rewrite

## Summary
Complete rewrite of `src/pages/Demo.tsx` with new hero copy, metric badges, a structured sample output panel with collapsible story cards, a "Grounded Context" drawer, and updated iframe section. DemoBanner is unchanged.

---

## Zone 1: Hero (updated copy + metric badges)
- Title stays: "Intelligent Story Builder"
- New subhead: "This tool reduced story creation time by 80% across 20+ product teams. Try it yourself."
- Remove the old "Generate production-ready..." line
- Add 3 inline metric badges below the subhead:
  - "80% faster" -- cyan glow border
  - "45% less rework" -- pink glow border
  - "~7 wks/PO/yr recovered" -- yellow glow border
- Badges are small rounded pills with subtle colored borders/shadows

## Zone 2: Sample Output Panel (replaces old cards)
A single full-width panel styled like tool output:

- **Header**: "Sample Output -- Feature Decomposition"
- **Input label**: "Input: As a user, I want to search for providers by specialty and location"
- **Summary line**: "Decomposed into 3 user stories with acceptance criteria, covering search input, results display, and filter refinement"
- **2 collapsible story cards** using Radix Collapsible:
  - Story 1: "Provider Search Input" -- user story text + 3 acceptance criteria bullets (CheckCircle2 icons, cyan)
  - Story 2: "Search Results Display" -- user story text + 3 acceptance criteria bullets (CheckCircle2 icons, pink)
  - Each starts collapsed; clicking toggles open/closed with a chevron indicator
- **Risks and Assumptions** section with 2-3 muted bullets (AlertTriangle icon)
- **CTA button** below: "Run It Live" that smooth-scrolls to the iframe

## Zone 3: Grounded Context Drawer + Sandbox + Iframe
- **Collapsible "Grounded Context" drawer** above the iframe:
  - Toggle button: "View Grounded Context" with chevron
  - When expanded, shows 3 items in a grid or stacked list:
    1. "README excerpt (redacted)" -- 2-3 lines of synthetic placeholder
    2. "Backlog snippet (synthetic)" -- 2-3 lines
    3. "Product persona" -- 2-3 lines
  - Small note at bottom: "Citations in the output link back to these sources."
- **Trust bar**: "Sandbox demo . Synthetic data only . No PII . Model calls proxied and logged" with Shield icon (updated text to include "Sandbox demo")
- **Interaction hint**: Keep existing pink text with MousePointerClick icon
- **Iframe**: Keep as-is with animated glow border

## Zone 4: Bottom CTA
- Keep "Return Home" link unchanged

---

## Technical Details

### File: `src/pages/Demo.tsx`
Full rewrite. New imports added:
- `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` from `@/components/ui/collapsible`
- `AlertTriangle`, `ChevronRight` from `lucide-react`
- `useState` from React (to manage collapsible states)

The collapsible story cards use Radix Collapsible (already installed). Each card has:
- A trigger row with title + chevron that rotates on open
- Content area with user story text and acceptance criteria list

The metric badges are simple `span` elements with colored border + subtle box-shadow matching the brand colors.

### File: `src/components/DemoBanner.tsx`
No changes needed -- already has the correct copy and CTA from the previous update.

### Dependencies
No new packages required. Uses existing Radix Collapsible and Lucide icons.

