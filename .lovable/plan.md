

# Strip Generic Metadata from og-metadata Edge Function

## What's happening now

When LinkedIn crawls your `/share/projects/...` URL, the HTML it receives contains **both** project-specific OG tags **and** generic site-level signals. LinkedIn sees the generic signals as higher authority and falls back to them, ignoring the project title, description, and image you actually want shown.

## What we're changing

We're editing **one function** in **one spot** -- the `buildHTML()` function inside `supabase/functions/og-metadata/index.ts`. We're removing four lines that create ambiguity for LinkedIn's parser:

1. **Remove the site name from the page title** -- changing `<title>Project Title | AI With Aimee</title>` to just `<title>Project Title</title>` so LinkedIn doesn't latch onto the branding suffix.

2. **Remove the `<meta name="description">` tag** -- this generic HTML description competes with `og:description`. Without it, LinkedIn has no choice but to use the OG tag.

3. **Remove `og:site_name`** -- this tells LinkedIn "this page belongs to a parent site," which triggers fallback behavior. Removing it makes the page stand on its own.

4. **Remove the `<meta http-equiv="refresh">` redirect** -- LinkedIn treats pages that immediately redirect as non-authoritative and falls back to cached site metadata. Human visitors will still be redirected because your Cloudflare Worker and SPA `/share/*` route already handle that.

## What we're NOT changing

Everything else stays exactly as-is:
- `og:title`, `og:description`, `og:image`, `og:url` -- these are the tags LinkedIn will now use
- Twitter card tags
- Canonical link
- All query logic, database lookups, defaults, and error handling

## Expected result

After deploy, when you paste `https://ai-with-aims.studio/share/projects/chief-of-staff-personal-life-operations-app` into LinkedIn Post Inspector, it will show:
- The project's title
- The project's subtitle
- The project's thumbnail image
- No generic site-level fallback

No Cloudflare changes needed.

## Technical detail

**File**: `supabase/functions/og-metadata/index.ts`

**Lines changed**: 26-50 (the `buildHTML` return template)

The final `<head>` output will be:

```text
<head>
<meta charset="UTF-8" />
<title>${t}</title>
${extra}
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${img}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${u}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@aimeefara" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${img}" />
<link rel="canonical" href="${u}" />
</head>
```

Four lines removed, zero lines added. The function auto-deploys after the edit.
