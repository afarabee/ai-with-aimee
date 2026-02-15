

# JSON Import for Why Aimee Editor

Add an "Import JSON" button to the editor that uploads a `.json` file and populates all form fields without saving, so you can review and tweak before saving.

---

## Changes

**File:** `src/pages/admin/WhyAimeeEditor.tsx`

1. Add `Upload` icon import from lucide-react and `useRef` from React
2. Add a hidden `<input type="file" accept=".json" ref={fileInputRef}>` element
3. Add `handleImportJSON` function that:
   - Reads file via FileReader
   - Parses JSON, validates `company` and `role` are present
   - Populates all state: company, role, heroTagline, heroSubtext, metrics (clamped 4-6), visionTitle, visionPoints (exactly 4), requirements (clamped 3-8), closingTagline, closingSubtext
   - Auto-generates slug from imported company name
   - Shows success or error toast
4. Add "Import JSON" button in the action bar next to Save Draft

No database changes. No new files. The form stays open after import for review.

