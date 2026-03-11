

# Fix: Repurpose the working `chat-admin` function for OG metadata

## The Problem

Every new function we create deploys "successfully" but returns 404 with zero logs. The platform gateway isn't registering new function routes. However, **existing functions like `chat-admin` are reachable** (it returned a 410 response, proving the route works).

## The Solution

Instead of creating a new function, we'll **repurpose the `chat-admin` function** to serve OG metadata. Since `chat-admin` is already disabled (returns "This endpoint is no longer active"), we can safely replace its code with the `serve-meta` logic.

### Steps:

1. **Replace `chat-admin/index.ts`** with the current `serve-meta/index.ts` code (the OG metadata logic)
2. **Keep `serve-meta/` as-is** for now (no harm in leaving it)
3. **Deploy `chat-admin`** -- since this route already works, the new code should be immediately reachable
4. **Test** the function at the `chat-admin` URL

### What you'll need to update in Cloudflare

Change the Worker URL to use `chat-admin` instead of `serve-meta`:

```
https://axmjbykoyrwbfxeifbnp.supabase.co/functions/v1/chat-admin?path=/projects/chief-of-staff-personal-life-operations-app
```

Yes, the name is misleading (`chat-admin` serving metadata), but it will actually work because the route is already registered in the platform gateway.

## Why this should work

- `chat-admin` returned a 410 response when we called it, proving the route is live and reachable
- We're not creating a new route -- just updating the code behind an existing one
- The deploy mechanism works for updating existing functions (we've seen this with other functions)

## Technical details

- **Modified file**: `supabase/functions/chat-admin/index.ts` -- replaced with serve-meta logic
- **No new files or routes needed**
- **Your action**: Update Cloudflare Worker URL from `serve-meta` (or `og-metadata`) to `chat-admin`
