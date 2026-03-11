# AI With Aimee

**Aimee Farabee's personal AI portfolio and content platform.**

Senior Director-level Healthcare Product Leader & AI Strategist with 15+ years of experience building, shipping, and scaling AI products.

🔗 **Live site:** [ai-with-aims.studio](https://ai-with-aims.studio/)

---

## Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — Hero, Proven Impact grid, Blog previews, Projects, Interactive Demo banner, Contact |
| `/about` | Bio and background |
| `/my-ai-journey` | AI journey timeline and milestones |
| `/projects` | Project showcase listing |
| `/projects/:slug` | Individual project detail page |
| `/blog` | Blog listing |
| `/blog/:slug` | Individual blog post |
| `/model-map` | AI model benchmarks visualization |
| `/resume` | Downloadable resume page |
| `/why-aimee/:slug` | Role-specific pitch pages (unlisted, direct link only) |

## Admin CMS

All admin routes live under `/admin` and are protected by a session-based password gate.

**Modules:**

- **Blogs Hub** — Create, edit, and publish blog posts with a full-screen markdown writer
- **Projects** — Manage portfolio project entries with drag-and-drop ordering
- **Prompt Library** — Store and organize AI prompts for testing
- **Newsletter Composer** — Build, queue, and log email newsletters
- **Asset Gallery** — Upload and manage images and files
- **Headshot Editor** — AI-powered headshot retouching
- **Models & Tools** — Track AI models and tools for benchmarking
- **Test Lab** — Run and score prompt tests across models and tools
- **Model Map** — AI-generated benchmark insights and comparisons
- **Why Aimee** — Manage role-specific pitch page content

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Lovable Cloud (database, storage, edge functions) |
| Data Fetching | TanStack React Query |
| Routing | React Router v6 |
| Markdown | react-markdown + rehype/remark plugins, @uiw/react-md-editor |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| Animations | CSS transitions + custom hooks |

## Backend Functions

| Function | Purpose |
|----------|---------|
| `analyze-model-map` | AI-powered model benchmark analysis and insights generation |
| `chat-admin` | Serves OG metadata for social sharing / link previews |
| `edit-headshot` | AI headshot editing and retouching |
| `serve-meta` | OG metadata endpoint (legacy, replaced by `chat-admin` route) |
| `upload-blog-image` | Image and PDF upload to cloud storage |

## Design System

- **Theme:** Dark background with cyan and pink neon accents
- **Fonts:** Outfit (headings/body), Syne (taglines/accents), Fira Code (nav/UI), Over the Rainbow (signature)
- **Custom Components:** NeuralNetworkBackground, GlowCard, CursorGlow, AboutBackground, DemoBanner
- **Effects:** Spotlight button effect, scroll animations, page transitions, cursor glow
- **Tokens:** HSL-based CSS custom properties for consistent theming across light/dark modes

## Database Tables

| Table | Purpose |
|-------|---------|
| `blogs` | Blog post content and metadata |
| `projects` | Portfolio project entries |
| `prompts` | AI prompt library |
| `models` | AI model registry |
| `tools` | AI tool registry |
| `tests` | Test sessions linking prompts to scoring |
| `test_results` | Model test scores (accuracy, style, speed, etc.) |
| `tool_test_results` | Tool test scores (fidelity, workflow, etc.) |
| `model_map_insights` | AI-generated benchmark comparisons |
| `newsletter_queue` | Newsletter drafts and scheduling |
| `why_aimee` | Role-specific pitch page content |
| `user_roles` | Admin role assignments |

## Project Structure

```
src/
├── assets/          # Static images and logos
├── components/      # Reusable UI components
│   ├── admin/       # Admin CMS components
│   ├── resume/      # Resume page components
│   └── ui/          # shadcn/ui primitives
├── constants/       # URL constants
├── hooks/           # Custom React hooks
├── integrations/    # Lovable Cloud client and types
├── pages/           # Route page components
│   └── admin/       # Admin page components
├── types/           # TypeScript type definitions
└── utils/           # Utility functions

supabase/
└── functions/       # Backend edge functions
```

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

---

Built with [Lovable](https://lovable.dev)
