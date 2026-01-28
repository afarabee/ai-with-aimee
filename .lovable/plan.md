

# Plan: Add Action Buttons to Top of Prompt Editor Form

## Overview
Add a duplicated set of action controls (Save Draft, Publish Now, Clear, Delete) to the top of the form, so you don't have to scroll down to access them.

## Change Required

### File: `src/pages/admin/PromptEditor.tsx`

**Current header structure (lines 394-442):**
- Back to Dashboard button (left)
- View mode toggles: Edit | Split | Preview (right)

**Updated header structure:**
Add a new row of action buttons below the current header, inside the Edit Panel card, right after the "Edit Prompt" / "New Prompt" title.

## Implementation Details

### 1. Extract Action Buttons to Reusable Component
Create an inline `ActionButtons` component inside the file to avoid code duplication:

```typescript
const ActionButtons = () => (
  <div className="flex flex-wrap gap-3">
    {/* Save Draft */}
    <Button
      type="button"
      variant="outline"
      onClick={saveDraft}
      style={{
        background: 'rgba(0, 255, 255, 0.1)',
        border: '2px solid hsl(var(--color-cyan))',
        color: 'hsl(var(--color-cyan))',
      }}
      className="hover:bg-cyan-400/20"
    >
      <Save className="mr-2 h-4 w-4" />
      Save Draft
    </Button>

    {/* Status-based buttons */}
    {formData.status === 'Published' ? (
      <>
        <Button onClick={updatePublished}>Update Published</Button>
        <Button onClick={unpublishPrompt}>Unpublish</Button>
      </>
    ) : (
      <Button onClick={publishPrompt}>Publish Now</Button>
    )}

    {/* Clear */}
    <Button onClick={() => setShowClearDialog(true)}>Clear</Button>

    {/* Delete (only for existing prompts) */}
    {promptId && (
      <Button onClick={() => setShowDeleteDialog(true)}>Delete</Button>
    )}
  </div>
);
```

### 2. Insert at Top of Form
Place the `ActionButtons` component right after the "Edit Prompt" / "New Prompt" title (around line 448-451), before the form fields begin.

### 3. Keep Bottom Buttons
The existing action buttons at the bottom of the form will remain unchanged, giving users convenient access from both locations.

## Visual Result

```text
+------------------------------------------+
| <- Back to Dashboard    [Edit][Split][Preview] |
+------------------------------------------+
|                                          |
| Edit Prompt                              |
|                                          |
| [Save Draft] [Publish Now] [Clear] [Delete] | <-- NEW
|                                          |
| Title: ___________________________       |
| Role: _________ Category: _________      |
| Status: [Draft badge]                    |
| Tags: ___________________________        |
| What You're Testing: _______________     |
| Prompt Body: ___________                 |
|              ___________                 |
|                                          |
| [Save Draft] [Publish Now] [Clear] [Delete] | <-- EXISTING
+------------------------------------------+
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/admin/PromptEditor.tsx` | Add ActionButtons component and render it at top of form |

## Technical Notes
- The component will be defined inside the `PromptEditor` function to access all the existing state and handlers
- No new dependencies or imports required
- All existing styling and behavior will be preserved
- Buttons will be responsive and wrap on smaller screens using `flex-wrap`

