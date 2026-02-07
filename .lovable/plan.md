

# Demo Page Overhaul and DemoBanner Upgrade

## Summary
Rebuild the Demo page with a pre-loaded sample output section, feature decomposition, and a sandbox trust bar. Update the homepage DemoBanner with refined copy and a new CTA.

---

## Demo.tsx -- Full Restructure

### Zone 1: Context Hook (updated copy)
- Keep the "Intelligent Story Builder" heading
- Update subheadline to: **"Generate production-ready Agile user stories in seconds."**
- Update impact line to: **"This tool reduced story creation time by 80% across 20+ product teams."**
- Add a scroll-to CTA button: **"Try the Live Demo"** that smooth-scrolls down to the iframe section

### Zone 2: Pre-loaded Sample Output (NEW -- biggest change)
Replace the current scenario cards with **two static user story cards** showing real example output from the tool. Each card is a GlowCard containing:

**Story 1** (cyan glow):
- Title: "Provider Search"
- User story: *"As a user, I want to enter a specialty and location so the system returns relevant providers."*
- 3 acceptance criteria bullets (synthetic examples, e.g., "Given a specialty and zip code, the system returns providers within 25 miles", etc.)

**Story 2** (pink glow):
- Title: "Provider Results"
- User story: *"As a user, I want to see a ranked list of providers with key details so I can make an informed selection."*
- 3 acceptance criteria bullets (synthetic examples)

Each card will have a small label like "sample output" in muted text to clarify these are examples.

### Zone 3: Sandbox Trust Bar + Live Demo
- **Trust bar**: A small, muted horizontal bar above the iframe with a Shield icon and the text: **"Synthetic data only . No PII . Model calls proxied and logged"** -- styled in subdued gray text, small font size
- Keep the existing iframe pointing to `https://intelligent-ai-story-builder.lovable.app/`
- Keep the interaction hint with pointer icon
- Keep the animated glow border on the iframe container

### Zone 4: Bottom CTA
- Keep the "Return Home" link

---

## DemoBanner.tsx -- Copy and CTA Update

### Changes:
1. **Body copy** updated to: *"Try the Intelligent Story Builder -- an agentic AI tool I designed that reduced story creation time by 80% across 20+ product teams. Select a scenario, watch the AI work, and see real output."*
2. **CTA button text** changed from "Launch Interactive Demo" to **"TRY THE LIVE DEMO -->"**
3. Keep the existing layout, glow animation, and icons unchanged

---

## Files Modified

| File | Change |
|------|--------|
| `src/pages/Demo.tsx` | Replace scenario cards with sample output cards, add trust bar, add scroll-to CTA |
| `src/components/DemoBanner.tsx` | Update body copy and CTA text |

## What Stays the Same
- Navigation and Footer on Demo page
- The live iframe embed URL
- The animated glow border styling
- The DemoBanner layout, icons, and heading ("See AI in Action")
- All font assignments (Outfit, Syne, Fira Code) from the recent typography update

