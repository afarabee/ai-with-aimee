

# Fix: Deploy og-meta Edge Function Successfully

## Problem
The `og-meta` edge function file exists and the config is correct, but deploy reports success while the function returns 404. LinkedIn's Post Inspector gets a server error because the function URL isn't reachable.

## Root Cause
The `esm.sh` import (`https://esm.sh/@supabase/supabase-js@2`) can cause deploy issues in edge-runtime. Switching to the more stable `npm:` specifier should fix it.

## Plan

### 1. Update the import in `supabase/functions/og-meta/index.ts`

Change line 1 from:
```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
```
to:
```typescript
import { createClient } from "npm:@supabase/supabase-js@2";
```

This is a single-line change. Everything else in the function stays the same.

### 2. Deploy and verify

After saving, the function will auto-deploy. We'll test by calling the function URL and confirming it returns valid HTML with OG tags.

### 3. Test with LinkedIn Post Inspector

Once the function responds correctly, the URL format for sharing is:
```
https://axmjbykoyrwbfxeifbnp.supabase.co/functions/v1/og-meta?path=/projects/chief-of-staff-personal-life-operations-app
```

## Technical Details
- **File changed**: `supabase/functions/og-meta/index.ts` (line 1 only)
- **Why**: `npm:` specifiers are more reliable than `esm.sh` URLs in Deno edge-runtime, avoiding stale redirects and integrity hash mismatches
- No other files need changes

