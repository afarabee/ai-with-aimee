

## Plan: Add "Import from JSON" to ProjectEditor

**Single file edit: `src/pages/admin/ProjectEditor.tsx`**

Replicate the exact BlogsWriter JSON import pattern:

1. **New imports** — Add `FileUp` from lucide-react, `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogFooter` from UI components, `Textarea` from UI components.

2. **New state variables** — `jsonImportModalOpen`, `jsonText`, `jsonError`, `confirmOverwriteOpen` (all alongside existing state around lines 76-89).

3. **`applyJsonToForm` function** — Maps JSON fields to form via `setValue()`:
   - `project_title`, `subtitle`, `excerpt`, `github_link`, `project_page_link`, `thumbnail`, `status` → direct string setValue
   - `technologies` → handle array (join with `", "`) or string
   - `display_order` → handle as number
   - `date_published` → convert ISO to `YYYY-MM-DD` format
   - `slug` → setValue (though the form auto-generates slug from title on save, this allows override)
   - `body` → set via `setBody()` (managed outside react-hook-form)
   - Skip null/undefined values; skip `id`, `created_at`, `updated_at`

4. **`handleJsonImport` function** — Parse JSON, show inline error if invalid, check `isDirty` for overwrite confirmation, then call `applyJsonToForm`.

5. **Import button in toolbar** (line 491) — Add `FileUp` "Import JSON" button next to existing Save Draft button.

6. **Import Dialog** — Textarea with helper text listing all project fields, Cancel/Import buttons, inline error display.

7. **Overwrite AlertDialog** — Confirmation before replacing populated form values.

8. **Success toast** — "Project fields populated from JSON. Review and save when ready."

