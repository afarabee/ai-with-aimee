

# Enhanced Demo Banner with Animated Glow Border

## Overview
Transform the placeholder DemoBanner into an eye-catching, full-width section featuring the "Intelligent Story Builder" with animated glow effects, compelling copy, and a visual element to break up the text.

## Content Updates

| Element | New Content |
|---------|-------------|
| **Headline** | See AI in Action |
| **Subheadline** | Don't just read about what I build—experience it yourself. |
| **Body** | Try the Intelligent Story Builder, an agentic AI tool I designed to transform raw ideas into production-ready user stories. Select a scenario, watch the AI work, and see why this system reduced story creation time by 80%. |
| **CTA Button** | Launch Interactive Demo → |

## Design Implementation

### Layout Structure
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─ Animated Gradient Border (pink/cyan pulsing glow) ─────────────────┐   │
│  │                                                                      │   │
│  │   ┌──────────────┐    ┌─────────────────────────────────────────┐   │   │
│  │   │  ✨ Visual   │    │  See AI in Action (H2 - neon cyan)     │   │   │
│  │   │   Element    │    │                                         │   │   │
│  │   │  (Sparkles   │    │  Subheadline (muted text)               │   │   │
│  │   │   + Zap)     │    │                                         │   │   │
│  │   │              │    │  Body paragraph (lighter text)          │   │   │
│  │   └──────────────┘    │                                         │   │   │
│  │                       │     [Launch Interactive Demo →]          │   │   │
│  │                       └─────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Visual Element (Left Side)
Rather than a screenshot (which doesn't exist yet), I'll create an abstract "tool interface" icon using:
- **Sparkles icon** (lucide-react) - represents AI magic
- **Zap icon** (lucide-react) - represents speed/automation
- Arranged in a glowing container with gradient background

### Animated Glow Border
CSS keyframe animation that creates a subtle pulsing glow around the banner:
- Alternates between pink and cyan hues
- 4-second animation cycle for smooth, non-distracting effect
- Uses `box-shadow` with multiple layers for depth

## File Changes

### `src/components/DemoBanner.tsx`
Complete rewrite with:

1. **New Imports**
   - Add `Sparkles` and `Zap` icons from lucide-react

2. **Layout Structure**
   - Two-column grid on desktop (visual | text)
   - Single column stack on mobile
   - Full-width with max-w-6xl content container

3. **Visual Element**
   - Abstract icon composition in a gradient container
   - Subtle floating animation on the icons

4. **Content Section**
   - H2 headline with `neon-text-cyan` styling
   - Subheadline with pink accent styling
   - Body paragraph with standard text styling
   - Existing `btn-hero` CTA button

5. **Animated Border**
   - Wrapper div with animated box-shadow
   - CSS animation defined inline or as a custom class

### `src/index.css`
Add new keyframe animation for the glow border:

```css
@keyframes banner-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px hsl(var(--color-pink) / 0.4),
      0 0 40px hsl(var(--color-pink) / 0.2),
      inset 0 0 20px hsl(var(--color-pink) / 0.1);
  }
  50% {
    box-shadow: 
      0 0 20px hsl(var(--color-cyan) / 0.4),
      0 0 40px hsl(var(--color-cyan) / 0.2),
      inset 0 0 20px hsl(var(--color-cyan) / 0.1);
  }
}

.animate-banner-glow {
  animation: banner-glow 4s ease-in-out infinite;
}
```

## Technical Details

### Component Structure
```typescript
const DemoBanner = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Animated glow container */}
        <div className="relative rounded-2xl border border-pink-500/30 
                        animate-banner-glow bg-gradient-to-br 
                        from-pink-500/10 via-transparent to-cyan-500/10 
                        p-8 md:p-12">
          
          <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
            {/* Visual Element - Left */}
            <div className="hidden md:flex justify-center">
              <div className="relative p-6 rounded-xl 
                              bg-gradient-to-br from-pink-500/20 to-cyan-500/20 
                              border border-cyan-500/30">
                <Sparkles className="w-12 h-12 text-cyan-400" />
                <Zap className="absolute top-2 right-2 w-6 h-6 text-pink-400" />
              </div>
            </div>

            {/* Content - Right */}
            <div className="text-center md:text-left">
              <h2 className="neon-text-cyan font-rajdhani font-bold 
                           text-3xl md:text-4xl mb-3">
                See AI in Action
              </h2>
              <p className="text-lg text-pink-400/90 font-medium mb-4">
                Don't just read about what I build—experience it yourself.
              </p>
              <p className="text-base text-gray-300 mb-8 max-w-2xl">
                Try the Intelligent Story Builder...
              </p>
              <Link to="/demo" className="btn-hero ...">
                Launch Interactive Demo →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

### Accessibility Considerations
- Animation respects `prefers-reduced-motion` (added to CSS)
- Proper heading hierarchy (H2)
- Focus states on CTA button (inherited from btn-hero)

### Mobile Responsiveness
- Icon section hidden on mobile (md:flex)
- Text centered on mobile, left-aligned on desktop
- Padding adjusts (p-8 → md:p-12)

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/DemoBanner.tsx` | Complete redesign with two-column layout, visual element, new copy, animated glow border |
| `src/index.css` | Add `banner-glow` keyframe animation and `.animate-banner-glow` class |

