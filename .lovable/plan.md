

# Plan: Replace OG Image with Properly Sized Version

## Overview
Replace the current Open Graph image with your new 1200x630px version - the correct dimensions for social media previews.

## What I'll Do

### Copy Image to Public Folder
Copy your uploaded image to replace the existing OG image.

| Source | Destination |
|--------|-------------|
| `user-uploads://OG-Image.png` | `public/og-image.png` |

### No HTML Changes Needed
The `index.html` metadata is already configured correctly:
- `og:image:width` → `1200`
- `og:image:height` → `630`

## Files to Modify

| File | Action |
|------|--------|
| `public/og-image.png` | Replace with uploaded 1200x630 image |

## After Implementation
Publish your site, then test at **opengraph.xyz** to verify Facebook, LinkedIn, and Twitter will display it without cropping.

