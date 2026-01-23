
# Plan: Reposition Homepage as Senior Director-Level Healthcare Product Leader

## Overview
Update the homepage text content to position the owner as a Senior Director-level Healthcare Product Leader with AI expertise, while maintaining the current visual design, color scheme, and navigation structure.

## Changes Summary

### 1. Hero Section Updates (src/components/HeroSection.tsx)

**Headline Updates:**
- Change "Product Leader & AI Strategist" back to "Product Leader Turned"
- Update typing rotation phrases from ["ML Enthusiast", "Tech Innovator", "AI Strategist"] to ["AI Strategist", "AI Pragmatist", "AI Catalyst"]

**Subheadline Update:**
- Replace "Driving measurable AI adoption in enterprise environments." with "Healthcare products that scale. AI transformation that delivers. Results that matter."

**Mission Statement Update:**
- Replace current mission text with the new comprehensive bio focusing on healthcare product leadership, 15+ years experience, 7 zero-to-one deliveries, and quantified outcomes

### 2. New "Proven Impact" Section (New Component)

Create a new component `src/components/ProvenImpactSection.tsx` to be inserted between the Hero and Blog sections.

**Four Subsections with Icons:**

1. **Measurable Outcomes** (BarChart3 icon)
   - 98% reduction in pre-clinical draft reporting cycle time
   - 80% reduction in user story creation time across 20+ product teams
   - 97 days zero-to-one launch of CareNav+ "Future of Care" pilot
   - 72 hours guaranteed patient appointment scheduling
   - 70% reduction in time-to-market through automated migration tooling
   - ~13 weeks of productive time recovered per product owner annually

2. **Healthcare Product Leadership** (Heart/Stethoscope icon)
   - Consumer mobile apps and patient portals serving millions
   - Remote Patient Monitoring platform with FHIR pipelines
   - AI symptom checking and real-time clinician availability
   - Behavioral Health API platform
   - Cloud-based enterprise data repositories
   - Digital transformation at Cigna, Evernorth, and Express Scripts

3. **Zero-to-One Track Record** (Rocket icon)
   - 7 zero-to-one deliveries in regulated environments
   - 3 Product Owner Communities of Practice established
   - 16+ years translating complex technology
   - 7+ years in product leadership roles
   - Strategic initiatives from conception to enterprise adoption

4. **AI Transformation & Governance** (Shield icon)
   - AI governance frameworks for GxP, HIPAA, GDPR compliance
   - Enterprise rollout of Microsoft Copilot, ChatGPT, agentic AI
   - AI Champion Network for responsible adoption
   - Agentic AI workflows with RAG, Azure DevOps, GitHub
   - 100+ AI use cases evaluated

**Design Approach:**
- Use existing GlowCard component for each subsection
- Follow same background gradient pattern as other sections
- Use neon color scheme (cyan icons, yellow titles, pink accents)
- Include floating particles animation for visual consistency

### 3. Update Index.tsx Page Structure

Modify the component order:
```
<Navigation />
<HeroSection />
<ProvenImpactSection />  ← NEW
<BlogSection />
<ProjectsSection />
... rest unchanged
```

### 4. Update "Intelligent Story Builder" Project in Database

Execute SQL update to modify the project card content:
- **Title:** "Intelligent Story Builder (Agentic AI Platform)"
- **Subtitle:** "Enterprise Agentic AI Workflow | Charles River Laboratories"
- **Excerpt:** New description emphasizing 80% reduction, 50% faster cycles, 20+ teams enabled, enterprise-ready validation

---

## Technical Details

### Files to Create:
1. `src/components/ProvenImpactSection.tsx` - New proven impact section component

### Files to Modify:
1. `src/components/HeroSection.tsx` - Update headline, phrases, subheadline, mission
2. `src/pages/Index.tsx` - Import and add ProvenImpactSection

### Database Changes:
1. Update `projects` table for "Intelligent Story Builder" project with new title, subtitle, and excerpt

### Component Structure for ProvenImpactSection:

```text
+------------------------------------------+
|           PROVEN IMPACT                   |
|  (Section header - neon pink)            |
+------------------------------------------+
|  +----------------+  +----------------+  |
|  | Measurable     |  | Healthcare     |  |
|  | Outcomes       |  | Product        |  |
|  | (BarChart3)    |  | Leadership     |  |
|  | - bullet list  |  | (Stethoscope)  |  |
|  +----------------+  +----------------+  |
|                                          |
|  +----------------+  +----------------+  |
|  | Zero-to-One    |  | AI Transform   |  |
|  | Track Record   |  | & Governance   |  |
|  | (Rocket)       |  | (ShieldCheck)  |  |
|  +----------------+  +----------------+  |
+------------------------------------------+
```

### Styling Approach:
- Background: Same gradient as Projects section (bg-dark to bg-deep)
- Cards: Use existing GlowCard with cyan glow
- Icons: lucide-react icons with neon-text-cyan styling
- Titles: neon-text-yellow for card headers
- Bullets: Pink checkmarks or bullets for list items
- Section dividers: Use existing SectionDivider component

### Responsive Design:
- 2-column grid on desktop (md:grid-cols-2)
- Single column stack on mobile
- Consistent padding and spacing with other sections
