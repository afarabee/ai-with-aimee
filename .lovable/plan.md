

# Fix: og-meta Edge Function Persistent 404

## Problem
The `og-meta` edge function deploys "successfully" but returns 404 when called. The thumbnail is now set in the database, so once the function works, LinkedIn will show the correct project-specific image.

## Root Cause
The import `jsr:@supabase/supabase-js@2` is not supported by this project's edge runtime version. Every other working function in the project uses `https://esm.sh/@supabase/supabase-js@2` or `@2.75.0`. The `jsr:` specifier silently fails, making the function unreachable.

## Plan

### 1. Fix the import in `supabase/functions/og-meta/index.ts`

Change line 1 from:
```typescript
import { createClient } from "jsr:@supabase/supabase-js@2";
```
to:
```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
```

This matches the pattern used by `analyze-model-map` and other working functions in the project.

### 2. Deploy and verify

After saving, the function auto-deploys. We'll call it directly to confirm it returns HTML with the project's thumbnail image in the `og:image` tag.

### 3. Test the full flow

Verify that `https://ai-with-aims.studio/share/projects/chief-of-staff-personal-life-operations-app` (via your Cloudflare Worker) returns the HTML with:
- `og:title` = "Chief of Staff -- Personal Life Operations App"
- `og:image` = the new thumbnail URL from the database

## Technical Details

- **File**: `supabase/functions/og-meta/index.ts` -- line 1 only
- **No other changes** -- the `htmlResponse` helper and all logic remain the same
- The thumbnail URL is already set in the database: `https://axmjbykoyrwbfxeifbnp.supabase.co/storage/v1/object/public/blog-images/blog/dc4d4b29-7add-45e9-b5e6-09be126ae920.png`
