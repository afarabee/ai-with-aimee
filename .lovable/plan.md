

## Plan: Add "Import from JSON" Button to BlogsWriter

### What changes

**Single file edit: `src/pages/admin/BlogsWriter.tsx`**

1. **New state variables** — `jsonImportModalOpen` (boolean), `jsonText` (string), `jsonError` (string), `confirmOverwriteOpen` (boolean)

2. **Import button** — Add an "Import from JSON" button with `FileUp` icon in the top toolbar (line 479), next to the existing Save Draft / view mode buttons. Also visible in both new and edit modes.

3. **Import modal** — A `Dialog` with:
   - Large `Textarea` labeled "Paste your blog JSON here"
   - Helper text listing accepted fields
   - Error message display (inline, not toast) for invalid JSON
   - "Cancel" and "Import" buttons

4. **Import logic**:
   - Parse JSON; if invalid, show inline error, keep modal open
   - If form `isDirty` (has existing content), show confirmation dialog: "This will replace the current form values. Continue?"
   - On confirm, map fields (`slug`, `title`, `subtitle`, `author`, `category`, `tags`, `date_published`, `status`, `excerpt`, `banner_image`, `body`) to form via `setValue()` — only for non-null/non-undefined values
   - Handle `tags` as array (join with ", ") or string
   - Handle `date_published` by converting ISO to date string
   - Set `body` state separately (since it's managed outside react-hook-form)
   - Close modal, show success toast
   - Skip `id`, `created_at`, `updated_at`, `deleted_at`

5. **Overwrite confirmation** — Reuse the existing `AlertDialog` pattern for a confirmation before overwriting populated fields.

### No other files need changes. The existing form, save logic, and database schema remain untouched.

