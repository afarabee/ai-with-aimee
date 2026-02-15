

# Add Preview to Why Aimee Editor

Add an "Eye" preview button that opens the public-facing Why Aimee page in a new browser tab, working for both published and unpublished (draft) entries.

---

## How It Works

- A new **Preview** button appears in the action bar alongside Import JSON, Save Draft, etc.
- Clicking it opens `/why-aimee/{slug}` in a new tab
- For **draft/unpublished** entries to be previewable, the public page query needs to allow a `?preview=true` query parameter that skips the `status = 'published'` filter
- The button is disabled if no slug exists yet (i.e., company name hasn't been entered)

---

## Changes

### `src/pages/admin/WhyAimeeEditor.tsx`
- Import `Eye` icon from lucide-react
- Add a Preview button in the action bar that opens `/why-aimee/${slug}?preview=true` via `window.open`
- Disabled state when slug is empty

### `src/pages/WhyAimee.tsx`
- Read `preview` query parameter from the URL using `useSearchParams`
- When `preview=true`, fetch the entry by slug without filtering on `status = 'published'`
- This lets draft entries render in the public template for preview purposes

---

## Technical Notes

- No database changes needed -- preview mode simply relaxes the client-side query filter
- Since the app handles non-sensitive demo data and RLS is open, this approach is safe
- The preview parameter is only useful if you know the slug, keeping unlisted pages private in practice

