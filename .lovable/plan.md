

# Fix: og-meta Edge Function Returns `text/plain` Instead of `text/html`

## Problem
The `og-meta` function is deployed and returns correct HTML with OG tags, but the **Content-Type header is `text/plain`** instead of `text/html; charset=utf-8`. LinkedIn's Post Inspector cannot parse OG tags from a `text/plain` response, causing the "server error" message.

## Root Cause
The Supabase edge runtime's `Content-Security-Policy: sandbox` directive can interfere with content type negotiation. The current approach of spreading headers in the Response constructor may not be setting Content-Type reliably.

## Plan

### 1. Update response construction in `supabase/functions/og-meta/index.ts`

Use the `Response` constructor with explicit `Headers` object instead of plain object spread. Also set the content type using the standard `Response` init pattern to ensure it takes priority:

- Create a helper function that builds a proper `Response` with `text/html` content type
- Use `new Response(html, { status: 200, headers: new Headers({...}) })` pattern
- Ensure every response path (blog, project, why-aimee, static, fallback, error) uses this helper

### 2. Deploy and verify

Redeploy the function and confirm the response `Content-Type` header is `text/html; charset=utf-8`.

### 3. Re-test with LinkedIn Post Inspector

Paste this URL into LinkedIn's Post Inspector:
```
https://axmjbykoyrwbfxeifbnp.supabase.co/functions/v1/og-meta?path=/projects/chief-of-staff-personal-life-operations-app
```

## Technical Details

**File**: `supabase/functions/og-meta/index.ts`

**Change**: Add a `htmlResponse` helper and use it for all return paths:

```typescript
function htmlResponse(html: string): Response {
  return new Response(html, {
    status: 200,
    headers: new Headers({
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    }),
  });
}
```

Then replace every `new Response(buildHTML({...}), { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } })` with `htmlResponse(buildHTML({...}))`.

This is a straightforward refactor -- no logic changes, just ensuring the Content-Type header is properly set via the `Headers` API.

