

# Move Closing Fields Under Vision Section Title

Relocate the "Closing Tagline" and "Closing Subtext" fields from the bottom of the form to appear directly after the Vision Section's "Section Title" input, but before the 4 vision point cards.

---

## Changes

**File:** `src/pages/admin/WhyAimeeEditor.tsx`

- Remove the entire "Closing CTA" block (lines 308-313: the h2 header and the two input fields)
- Insert the two closing fields (Closing Tagline and Closing Subtext) immediately after the Vision Section Title input on line 272, before the vision point cards
- No section header needed for these fields since they'll sit naturally within the Vision section
- No other files or database changes required

