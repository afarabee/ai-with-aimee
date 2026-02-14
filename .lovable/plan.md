

# Why Aimee Module -- Implementation Plan

A new end-to-end module for creating role-specific pitch pages managed in the Admin Center and publicly accessible only via direct link.

---

## 1. Database Migration

Create a `why_aimee` table with JSONB columns for structured data:

| Column | Type | Default |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| slug | text (unique, not null) | -- |
| company | text (not null) | -- |
| role | text (not null) | -- |
| hero_tagline | text | -- |
| hero_subtext | text | -- |
| metrics | jsonb | '[]' |
| vision_title | text | -- |
| vision_points | jsonb | '[]' |
| requirements | jsonb | '[]' |
| closing_tagline | text | -- |
| closing_subtext | text | -- |
| status | text | 'draft' |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

Open RLS policies (matches existing pattern for this demo-data app). Auto-update trigger on `updated_at`.

---

## 2. New Files

### `src/pages/admin/WhyAimeeDashboard.tsx`
Admin listing page following BlogsHub pattern:
- Table with company, role, status, date columns
- Search by company/role, status filter (all/draft/published/archived)
- New Entry, Edit, View (opens public page), Delete actions
- Soft delete via status change to 'archived'

### `src/pages/admin/WhyAimeeEditor.tsx`
Admin editor form (simpler than BlogsWriter -- no markdown editor needed):
- **Hero Section**: Company, Role, Hero Tagline, Hero Subtext, Slug (auto-generated from company)
- **Proven Impact Metrics**: Dynamic list of 4-6 cards, each with Value/Label/Sub fields. Add/Remove buttons enforcing min 4, max 6
- **Vision Section**: Vision Title text input + 4 fixed cards, each with Heading/Text fields (the yellow boxes)
- **Requirement Match**: Dynamic list of 3-8 rows, each with JD Requirement/My Experience/Company/Proof fields. Add/Remove enforcing min 3, max 8
- **Closing CTA**: Closing Tagline, Closing Subtext
- **Status buttons**: Save Draft, Publish Now, Update Published, Unpublish, Archive (same pattern as blogs/projects)

### `src/pages/WhyAimee.tsx`
Public-facing page -- faithful reproduction of the prototype JSX:
- Fetches from `why_aimee` table by slug, only shows if status = 'published'
- 404 if not found or not published
- Exact text styles from prototype: Orbitron for section headings, Outfit for body
- Gradient text effects, neon borders, star-field background, animated counters
- Expandable requirement match rows with accordion behavior
- Closing CTA with contact info

---

## 3. Modified Files

### `src/App.tsx`
- Import WhyAimeeDashboard, WhyAimeeEditor, WhyAimee
- Add admin routes: `why-aimee` (dashboard), `why-aimee-editor` (editor) inside AdminLayout
- Add public route: `/why-aimee/:slug` (no navigation menu link)

### `src/components/admin/AdminSidebar.tsx`
- Add "Why Aimee" entry to `adminModules` array with `UserCheck` icon and url `/admin/why-aimee`

---

## Technical Notes

- Vision points are fixed at 4 cards (matching prototype design) -- editable content but not add/remove
- Metrics and requirements use dynamic add/remove with enforced min/max limits
- The public page is unlisted -- no links from main site navigation, only reachable via direct URL
- JSONB storage avoids needing join tables while keeping structured data

