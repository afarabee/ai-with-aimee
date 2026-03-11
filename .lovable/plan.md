

## Plan: Update Why Aimee Hero Heading

**Single file edit: `src/pages/WhyAimee.tsx`**

Change line 248 from:
```
Aimee Farabee — Why Me for {data.company}
```
to:
```
Aimee Farabee — {data.company}
```

Also update the edge functions (`serve-meta` and `chat-admin`) OG title from `Why Aimee for ${page.company}` to `Aimee Farabee — ${page.company}` for consistency.

