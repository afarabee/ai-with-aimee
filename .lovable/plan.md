

# Interactive Demo Page — Intelligent Story Builder

## Overview
Build out the Demo page with the Intelligent Story Builder showcase, featuring an intro section, three scenario cards, an embedded demo iframe, a collapsible "What You're Seeing" sidebar, and a Return Home button.

## Page Structure

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Navigation                                                      [Return Home]  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│     Intelligent Story Builder — Interactive Demo (H1)                           │
│                                                                                 │
│     "This is the AI system I built at Charles River Labs..."                    │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Quick Demo     │  │  Compare AI     │  │  Upload &       │                  │
│  │  (30 sec)       │  │  Models (1 min) │  │  Generate (2min)│                  │
│  │                 │  │                 │  │                 │                  │
│  │  Watch the AI   │  │  See GPT-5 Nano │  │  Paste your own │                  │
│  │  generate...    │  │  and Gemini...  │  │  requirements...│                  │
│  │                 │  │                 │  │                 │                  │
│  │  Best for: ...  │  │  Best for: ...  │  │  Best for: ...  │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  ┌──────────────┐  │
│  │                                                         │  │ What You're  │  │
│  │                   Embedded Demo                         │  │ Seeing       │  │
│  │                   (iframe)                              │  │              │  │
│  │                                                         │  │ ▸ RAG Context│  │
│  │                                                         │  │ ▸ Prompt...  │  │
│  │                                                         │  │ ▸ DevOps...  │  │
│  │                                                         │  │              │  │
│  └─────────────────────────────────────────────────────────┘  └──────────────┘  │
│                                                                                 │
│                           [← Return Home]                                       │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
│  Footer                                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Components to Create

### 1. Demo Page Layout (`src/pages/Demo.tsx`)

Complete rewrite with the following sections:

**Header Section**
- Page title: "Intelligent Story Builder — Interactive Demo" (H1, neon-text-yellow)
- Intro paragraph with the full context text
- "Return Home" button in the top-right corner

**Scenario Cards Section**
- Three GlowCard components in a responsive grid
- Each card contains:
  - Icon (Play, GitCompare, Upload from lucide-react)
  - Title with duration badge
  - Description text
  - "Best for:" tag line
  - Clickable (future: could trigger different demo modes)

**Embedded Demo Section**
- Full-width iframe container with styled border
- Placeholder URL (can be updated later with actual demo app URL)
- Responsive height (70vh on desktop, 50vh on mobile)

**Collapsible Sidebar**
- Uses Radix Collapsible component
- Positioned to the right of the iframe on desktop
- Contains feature explanations:
  - RAG Context
  - Prompt Versioning
  - DevOps Integration
- Collapsed by default, expandable with click

**Bottom CTA**
- "Return Home" button centered below the demo

## Content Details

### Scenario Cards

| Card | Icon | Title | Description | Best For |
|------|------|-------|-------------|----------|
| 1 | Play | Quick Demo (30 sec) | Watch the AI generate a complete user story from a simple login requirement. | Getting a fast feel for the output quality. |
| 2 | GitCompare | Compare AI Models (1 min) | See GPT-5 Nano and Gemini 2.5 Flash Lite tackle the same prompt side-by-side. | Understanding how I approach model evaluation. |
| 3 | Upload | Upload & Generate (2 min) | Paste your own requirements or upload a doc, then generate a story. | Hands-on exploration. |

### "What You're Seeing" Sidebar Features

| Feature | Description |
|---------|-------------|
| RAG Context | The system pulls from a curated knowledge base of user story best practices to ground its outputs. |
| Prompt Versioning | Each generation uses a version-controlled prompt, allowing A/B testing and continuous refinement. |
| DevOps Integration | Output is formatted for direct import into Azure DevOps or Jira with proper acceptance criteria. |

## File Changes

### `src/pages/Demo.tsx`

Complete rewrite with:

1. **Imports**
   - Link from react-router-dom
   - Navigation, Footer components
   - GlowCard component
   - Collapsible, CollapsibleTrigger, CollapsibleContent from UI
   - Icons: Play, GitCompare, Upload, ArrowLeft, ChevronRight, ChevronDown, Info, Database, GitBranch, Settings

2. **State**
   - `sidebarOpen` for collapsible panel
   - `selectedScenario` for future scenario selection (null initially)

3. **Component Structure**
   - Navigation
   - Hero section with title, intro, and top-right "Return Home" link
   - Scenario cards grid (3 columns on desktop, 1 on mobile)
   - Demo area with iframe + collapsible sidebar
   - Bottom "Return Home" button
   - Footer

4. **Styling**
   - Matches existing design system (neon-text-*, GlowCard, btn-hero)
   - Animated background particles (like ProjectsSection)
   - Responsive layout

### Iframe Placeholder

The iframe will initially use a placeholder message or URL. You can update this later with:
- A deployed Lovable app URL
- An internal component that simulates the demo
- An external tool URL

```typescript
// Placeholder for now - can be updated to actual demo URL
const DEMO_IFRAME_URL = "about:blank"; // or a placeholder component
```

## Mobile Responsiveness

| Viewport | Layout |
|----------|--------|
| Desktop (md+) | 3-column scenario cards, iframe with sidebar |
| Tablet | 2-column cards, sidebar below iframe |
| Mobile | 1-column cards, sidebar below iframe, smaller iframe height |

## Technical Details

### Component Structure

```typescript
const Demo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scenarios = [
    {
      icon: Play,
      title: "Quick Demo",
      duration: "30 sec",
      description: "Watch the AI generate...",
      bestFor: "Getting a fast feel for the output quality."
    },
    // ... more scenarios
  ];

  const features = [
    {
      icon: Database,
      title: "RAG Context",
      description: "The system pulls from..."
    },
    // ... more features
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="...">Intelligent Story Builder</h1>
              <p className="...">Interactive Demo</p>
            </div>
            <Link to="/" className="btn-hero ...">
              <ArrowLeft /> Return Home
            </Link>
          </div>
          <p className="...">This is the AI system I built...</p>
        </section>

        {/* Scenario Cards */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {scenarios.map(...)}
          </div>
        </section>

        {/* Demo + Sidebar */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            {/* Iframe */}
            <div className="rounded-2xl border ... h-[70vh]">
              <iframe ... />
            </div>
            
            {/* Collapsible Sidebar */}
            <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
              ...
            </Collapsible>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center py-12">
          <Link to="/" className="btn-hero ...">
            ← Return Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
```

## Future Enhancements (Not in This Build)

- Scenario card click handlers to switch iframe content
- Actual embedded demo application
- Progress indicators for guided scenarios
- Analytics tracking for scenario engagement

