
# Feature Flag System with Environment Variables

## Overview
Create a feature flag system using **environment variables** that allows you to build the **Interactive Demo Banner** (homepage) and **Interactive Demo Page** (`/demo` route) incrementally. Features will be enabled in development and disabled in production until you're ready to launch.

## Environment Variable Approach

The system reads from Vite environment variables, allowing you to toggle features without code changes.

### How It Works
```text
┌─────────────────────────────────────────────────────────┐
│  Environment Files                                      │
│  ─────────────────                                      │
│  .env.development: VITE_FEATURE_INTERACTIVE_DEMO=true   │
│  .env.production:  VITE_FEATURE_INTERACTIVE_DEMO=false  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  src/config/featureFlags.ts                             │
│  ─────────────────────────────                          │
│  import.meta.env.VITE_FEATURE_INTERACTIVE_DEMO === 'true'│
└─────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│  Homepage (Index)   │       │  App.tsx (Router)   │
│  ─────────────────  │       │  ───────────────    │
│  if (DEMO_BANNER)   │       │  if (DEMO_PAGE)     │
│    <DemoBanner />   │       │    <Route /demo />  │
└─────────────────────┘       └─────────────────────┘
```

## Files to Create

### 1. `.env.development`
Development environment - features **enabled** for local testing.

```
VITE_FEATURE_INTERACTIVE_DEMO=true
```

### 2. `.env.production`
Production environment - features **disabled** until ready to launch.

```
VITE_FEATURE_INTERACTIVE_DEMO=false
```

### 3. `src/config/featureFlags.ts`
Central configuration that reads from environment variables.

```typescript
// Feature flags read from environment variables
// Toggle via .env.development / .env.production files
export const featureFlags = {
  // Interactive Demo - homepage banner and /demo page
  INTERACTIVE_DEMO: import.meta.env.VITE_FEATURE_INTERACTIVE_DEMO === 'true',
} as const;

// Type-safe helper for checking flags
export function isFeatureEnabled(
  flag: keyof typeof featureFlags
): boolean {
  return featureFlags[flag];
}
```

### 4. `src/components/DemoBanner.tsx`
Placeholder banner component for the homepage.

```typescript
// Skeleton structure - build out incrementally
const DemoBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-500/10 to-cyan-500/10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2>Try the Interactive Demo</h2>
        <p>Experience AI capabilities hands-on</p>
        <Link to="/demo">Launch Demo →</Link>
      </div>
    </section>
  );
};
```

### 5. `src/pages/Demo.tsx`
Placeholder page for the interactive demo experience.

```typescript
// Skeleton structure - build out incrementally
const Demo = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <h1>Interactive Demo</h1>
        {/* Demo content will go here */}
      </main>
      <Footer />
    </div>
  );
};
```

## Files to Modify

### 6. `src/pages/Index.tsx`
Conditionally render the DemoBanner based on feature flag.

```typescript
import { isFeatureEnabled } from '@/config/featureFlags';
import DemoBanner from '@/components/DemoBanner';

// Inside the component...
{isFeatureEnabled('INTERACTIVE_DEMO') && <DemoBanner />}
```

### 7. `src/App.tsx`
Conditionally register the `/demo` route based on feature flag.

```typescript
import { isFeatureEnabled } from '@/config/featureFlags';
import Demo from './pages/Demo';

// Inside Routes...
{isFeatureEnabled('INTERACTIVE_DEMO') && (
  <Route path="/demo" element={<Demo />} />
)}
```

## Launching Features

When you're ready to launch, update `.env.production`:

```
VITE_FEATURE_INTERACTIVE_DEMO=true
```

## File Structure After Implementation

```text
├── .env.development          ← NEW: Dev flags (enabled)
├── .env.production           ← NEW: Prod flags (disabled)
src/
├── config/
│   └── featureFlags.ts       ← NEW: Reads from env vars
├── components/
│   └── DemoBanner.tsx        ← NEW: Homepage demo banner
├── pages/
│   └── Demo.tsx              ← NEW: Full demo page
├── App.tsx                   ← MODIFIED: Conditional route
└── pages/
    └── Index.tsx             ← MODIFIED: Conditional banner
```

## Benefits

| Benefit | Description |
|---------|-------------|
| **No Code Changes to Launch** | Flip the env var and redeploy |
| **Environment-Specific** | Auto-enabled in dev, disabled in prod |
| **Git-Friendly** | .env files can be committed (no secrets) |
| **Vite Native** | Uses built-in import.meta.env pattern |
| **Type Safety** | TypeScript helper ensures valid flag names |

## Technical Notes

- Vite automatically loads `.env.development` during `npm run dev` and `.env.production` during `npm run build`
- Environment variables must be prefixed with `VITE_` to be exposed to client code
- The existing `.env` file (with Supabase config) will NOT be modified - Vite merges all .env files with environment-specific ones taking precedence
