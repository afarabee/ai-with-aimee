
# Plan: Update Resume URL

## Overview
Update the resume download URL to point to the newly uploaded PDF file.

## Change Required

### File: `src/constants/urls.ts`

**Current:**
```typescript
export const RESUME_URL = `${STORAGE_BASE_URL}/blog-images/resume/Aimee-Farabee-Resume.pdf`;
```

**Updated:**
```typescript
export const RESUME_URL = `${STORAGE_BASE_URL}/blog-images/resume/aimee_farabee_resume.pdf`;
```

## Impact
This single change will automatically update the resume download functionality across all pages that use the `RESUME_URL` constant, including:
- The About Section on the homepage (`src/components/AboutSection.tsx`)
- The standalone About page (`src/pages/About.tsx`)

No other code changes are needed since both pages already import and use `RESUME_URL` from the constants file.
