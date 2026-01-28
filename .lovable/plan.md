
# Plan: Set Custom OG Image

## Overview
Replace the current Open Graph image with your uploaded "AI with Aimee" branded logo.

## What I'll Do

### Step 1: Copy Image to Public Folder
Copy your uploaded image to `public/og-image.png`, replacing the current placeholder.

| Source | Destination |
|--------|-------------|
| `user-uploads://Square_AI_w_Aimee_Logo_1080_x_1080_px.png` | `public/og-image.png` |

### Step 2: No HTML Changes Needed
The `index.html` file already has the correct meta tags pointing to `/og-image.png`:
- `og:image` → `https://ai-with-aimee.lovable.app/og-image.png`
- `twitter:image` → `https://ai-with-aimee.lovable.app/og-image.png`

## Note on Image Dimensions
Your image is 1080x1080px (square). The standard OG image size is 1200x630px. Social platforms will still display your image, but it may be cropped or letterboxed depending on the platform:
- **Facebook/LinkedIn**: Will crop to fit 1.91:1 aspect ratio (may cut off top/bottom)
- **Twitter**: Works well with square images in summary cards

If you'd like, I can also update the dimension meta tags to reflect the actual 1080x1080 size, though this is optional.

## Files to Modify

| File | Action |
|------|--------|
| `public/og-image.png` | Replace with uploaded image |

## After Implementation
You'll need to **publish the site** for the new OG image to appear on social shares. You can then test it at opengraph.xyz.
