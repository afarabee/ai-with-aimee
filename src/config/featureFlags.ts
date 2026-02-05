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
