

# Fix: Rename og-metadata to get-og-metadata to bypass stuck deployment

## The real problem

The code changes we made (removing generic tags) are correct and already in the file. But the function named `og-metadata` is stuck in a bad deployment state -- it reports "deployed successfully" but returns 404 every time. No logs are ever generated, meaning it never boots. Other functions (like `chat-admin`) work fine.

This is a platform-level caching issue where the function name is essentially "poisoned."

## The fix

We will rename the function from `og-metadata` to `get-og-metadata`. This means:

1. Create a new folder `supabase/functions/get-og-metadata/` with the exact same `index.ts` code (no changes to logic)
2. Delete the old `supabase/functions/og-metadata/` folder
3. Update `supabase/config.toml` to reference `get-og-metadata` instead of `og-metadata`
4. Deploy the new function

The code stays identical -- all the generic-tag removals are already done. The `<head>` output will contain only project-specific OG tags, no competing metadata.

## What you need to do after

Update your **Cloudflare Worker** to call the new function URL:

```text
OLD: https://axmjbykoyrwbfxeifbnp.supabase.co/functions/v1/og-metadata?path=...
NEW: https://axmjbykoyrwbfxeifbnp.supabase.co/functions/v1/get-og-metadata?path=...
```

Just change `og-metadata` to `get-og-metadata` in the Worker code. Everything else stays the same.

## Expected result after both changes

When you paste `https://ai-with-aims.studio/share/projects/chief-of-staff-personal-life-operations-app` into LinkedIn Post Inspector, it will show:

- **Title**: Chief of Staff -- Personal Life Operations App
- **Description**: The project's subtitle
- **Image**: The project's thumbnail (the one you just uploaded)
- No generic site-level fallback

## Technical details

- **New file**: `supabase/functions/get-og-metadata/index.ts` (copy of current code, unchanged)
- **Deleted**: `supabase/functions/og-metadata/` directory
- **Updated**: `supabase/config.toml` -- rename `[functions.og-metadata]` to `[functions.get-og-metadata]`
- **Your action**: Update Cloudflare Worker URL from `og-metadata` to `get-og-metadata`

