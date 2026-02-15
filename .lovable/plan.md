

# README Generation for AI With Aimee

## Overview

I'll replace the current boilerplate Lovable README with a comprehensive, professional README that documents the entire site -- its purpose, public pages, admin CMS, tech stack, and architecture.

## README Content Outline

### 1. Project Title and Description
- "AI With Aimee" -- Aimee Farabee's personal AI portfolio and content platform
- Positioning: Senior Director-level Healthcare Product Leader and AI Strategist

### 2. Live Site
- Published URL: `https://ai-with-aimee.lovable.app`

### 3. Public Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage -- Hero, Proven Impact grid, Blog previews, Projects, Contact |
| `/about` | Bio and background |
| `/projects` | Project showcase listing |
| `/projects/:slug` | Individual project detail |
| `/blog` | Blog listing |
| `/blog/:slug` | Individual blog post |
| `/model-map` | AI model benchmarks visualization |
| `/resume` | Resume / CV page |
| `/why-aimee/:slug` | Role-specific pitch pages (unlisted, direct link only) |

### 4. Admin CMS (`/admin`)
- Password-protected (session-based gate)
- Modules: Blog Editor, Project Editor, Prompt Library, Newsletter Composer, Asset Gallery, Headshot Editor, Models and Tools, Test Lab, Model Map, Why Aimee

### 5. Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Lovable Cloud (database, storage, edge functions)
- TanStack React Query

### 6. Backend Functions
- `analyze-model-map` -- AI model analysis
- `chat-admin` -- Admin chat assistant
- `edit-headshot` -- AI headshot editing
- `upload-blog-image` -- Blog image uploads

### 7. Design System
- Dark theme with cyan/pink neon accents
- Fonts: Rajdhani, Montserrat, Rainbow
- Custom components: NeuralNetworkBackground, GlowCard, CursorGlow

## Technical Details

- **File changed**: `README.md` -- full replacement of the boilerplate content
- No other files affected
- No dependencies or database changes needed

