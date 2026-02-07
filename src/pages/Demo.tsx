import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  ArrowLeft,
  MousePointerClick,
  Shield,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  FileText,
  List,
  User,
} from "lucide-react";

const Demo = () => {
  const [story1Open, setStory1Open] = useState(false);
  const [story2Open, setStory2Open] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);

  const scrollToDemo = () => {
    document.getElementById("live-demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-16">
        {/* Zone 1: Hero */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-rajdhani font-bold neon-text-yellow mb-4">
            Intelligent Story Builder
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 font-medium mb-6">
            This tool reduced story creation time by 80% across 20+ product teams.{" "}
            <span className="text-[hsl(var(--color-pink))]">Try it yourself.</span>
          </p>

          {/* Metric Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-foreground/90"
              style={{
                border: "1px solid hsl(var(--color-cyan) / 0.5)",
                boxShadow: "0 0 12px hsl(var(--color-cyan) / 0.25)",
              }}
            >
              80% faster
            </span>
            <span
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-foreground/90"
              style={{
                border: "1px solid hsl(var(--color-pink) / 0.5)",
                boxShadow: "0 0 12px hsl(var(--color-pink) / 0.25)",
              }}
            >
              45% less rework
            </span>
            <span
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-foreground/90"
              style={{
                border: "1px solid hsl(var(--color-yellow) / 0.5)",
                boxShadow: "0 0 12px hsl(var(--color-yellow) / 0.25)",
              }}
            >
              ~7 wks/PO/yr recovered
            </span>
          </div>
        </section>

        {/* Zone 2: Sample Output Panel */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div
            className="rounded-2xl backdrop-blur-md p-6 md:p-8"
            style={{
              background: "rgba(26, 11, 46, 0.6)",
              border: "1px solid hsl(var(--color-cyan) / 0.2)",
            }}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Sample Output
            </p>
            <h2 className="text-xl md:text-2xl font-rajdhani font-bold text-foreground mb-4">
              Feature Decomposition
            </h2>

            {/* Input */}
            <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Input</p>
              <p className="text-sm text-foreground/80 italic">
                "As a user, I want to search for providers by specialty and location"
              </p>
            </div>

            {/* Summary */}
            <p className="text-sm text-foreground/70 mb-6">
              Decomposed into 3 user stories with acceptance criteria, covering search input,
              results display, and filter refinement.
            </p>

            {/* Collapsible Story 1 */}
            <Collapsible open={story1Open} onOpenChange={setStory1Open} className="mb-3">
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left p-3 rounded-lg bg-muted/20 border border-[hsl(var(--color-cyan)_/_0.2)] hover:border-[hsl(var(--color-cyan)_/_0.4)] transition-colors">
                <ChevronRight
                  className={`w-4 h-4 text-[hsl(var(--color-cyan))] shrink-0 transition-transform duration-200 ${
                    story1Open ? "rotate-90" : ""
                  }`}
                />
                <span className="text-sm font-semibold text-foreground">
                  Story 1: Provider Search Input
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-3 pb-1">
                <p className="text-sm italic text-foreground/70 mb-3">
                  "As a user, I want to enter a specialty and location so the system returns
                  relevant providers."
                </p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Acceptance Criteria
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-cyan))]" />
                    Given a specialty and zip code, the system returns providers within 25 miles.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-cyan))]" />
                    The search completes in under 2 seconds for 95% of requests.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-cyan))]" />
                    If no providers match, the system displays a clear empty-state message with
                    suggested actions.
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>

            {/* Collapsible Story 2 */}
            <Collapsible open={story2Open} onOpenChange={setStory2Open} className="mb-6">
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left p-3 rounded-lg bg-muted/20 border border-[hsl(var(--color-pink)_/_0.2)] hover:border-[hsl(var(--color-pink)_/_0.4)] transition-colors">
                <ChevronRight
                  className={`w-4 h-4 text-[hsl(var(--color-pink))] shrink-0 transition-transform duration-200 ${
                    story2Open ? "rotate-90" : ""
                  }`}
                />
                <span className="text-sm font-semibold text-foreground">
                  Story 2: Search Results Display
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-3 pb-1">
                <p className="text-sm italic text-foreground/70 mb-3">
                  "As a user, I want to see a ranked list of providers with key details so I can
                  make an informed selection."
                </p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Acceptance Criteria
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-pink))]" />
                    Results display provider name, specialty, distance, and star rating.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-pink))]" />
                    Providers are ranked by a composite score of proximity and patient rating.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-pink))]" />
                    Users can filter results by insurance accepted and availability within 7 days.
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>

            {/* Risks and Assumptions */}
            <div className="border-t border-border/30 pt-4 mb-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Risks &amp; Assumptions
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-yellow))]" />
                  Assumes provider directory API supports geo-radius queries natively.
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-yellow))]" />
                  Star-rating data may require a separate integration with a reviews service.
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--color-yellow))]" />
                  Insurance filter accuracy depends on up-to-date payer contract data.
                </li>
              </ul>
            </div>

            {/* Run It Live CTA */}
            <button
              onClick={scrollToDemo}
              className="btn-hero px-8 py-3 text-base font-montserrat inline-flex items-center gap-2"
            >
              Run It Live
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Zone 3: Grounded Context + Sandbox + Iframe */}
        <section id="live-demo" className="max-w-7xl mx-auto px-6 py-8">
          {/* Grounded Context Drawer */}
          <Collapsible open={contextOpen} onOpenChange={setContextOpen} className="mb-6">
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  contextOpen ? "rotate-90" : ""
                }`}
              />
              View Grounded Context
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid md:grid-cols-3 gap-4 mb-3">
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[hsl(var(--color-cyan))]" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                      README excerpt (redacted)
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The Provider Search module enables members to locate in-network specialists
                    using geographic and credential-based filters. Built on the unified directory
                    API v3.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <List className="w-4 h-4 text-[hsl(var(--color-pink))]" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                      Backlog snippet (synthetic)
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    EPIC-142: Provider Discovery Redesign. Sprint goal: deliver MVP search with
                    specialty + location inputs and paginated results. Dependency on DIR-API team
                    for contract data feed.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[hsl(var(--color-yellow))]" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                      Product persona
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Maria, 34, HR benefits manager. Needs to quickly find in-network providers for
                    employees relocating to new regions. Values speed and accuracy over advanced
                    filters.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/60 italic">
                Citations in the output link back to these sources.
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* Trust bar */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
            <Shield className="w-4 h-4" />
            <span>Sandbox demo · Synthetic data only · No PII · Model calls proxied and logged</span>
          </div>

          {/* Interaction hint */}
          <p className="text-center text-pink-400 mb-4 flex items-center justify-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            <span>This is a live demo—go ahead and interact!</span>
          </p>

          {/* Iframe */}
          <div className="relative rounded-2xl border border-pink-500/30 animate-banner-glow bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5" />
            <div className="relative h-[50vh] md:h-[70vh]">
              <iframe
                src="https://intelligent-ai-story-builder.lovable.app/"
                className="w-full h-full border-0"
                title="Intelligent Story Builder Demo"
                allow="clipboard-write"
              />
            </div>
          </div>
        </section>

        {/* Zone 4: Bottom CTA */}
        <div className="text-center py-12">
          <Link
            to="/"
            className="btn-hero inline-flex items-center gap-2 px-8 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Return Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;
