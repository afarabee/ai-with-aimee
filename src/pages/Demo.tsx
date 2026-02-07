import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlowCard from "@/components/ui/glow-card";
import { ArrowLeft, MousePointerClick, Shield, ChevronDown, CheckCircle2 } from "lucide-react";

const Demo = () => {
  const scrollToDemo = () => {
    document.getElementById("live-demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-16">
        {/* Zone 1: Context Hook */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-rajdhani font-bold neon-text-yellow mb-4">
            Intelligent Story Builder
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 font-medium mb-3">
            Generate production-ready Agile user stories in seconds.
          </p>
          <p className="text-lg text-[hsl(var(--color-pink))] mb-8">
            This tool reduced story creation time by 80% across 20+ product teams.
          </p>
          <button
            onClick={scrollToDemo}
            className="btn-hero px-8 py-3 text-base font-montserrat inline-flex items-center gap-2"
          >
            Try the Live Demo
            <ChevronDown className="w-5 h-5" />
          </button>
        </section>

        {/* Zone 2: Pre-loaded Sample Output */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-6">
            Sample Output
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Story 1 */}
            <GlowCard glowColor="#00ffff">
              <h3 className="text-lg font-rajdhani font-bold text-foreground mb-2">
                Provider Search
              </h3>
              <p className="text-sm italic text-foreground/80 mb-4">
                "As a user, I want to enter a specialty and location so the system returns relevant providers."
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
                  If no providers match, the system displays a clear empty-state message with suggested actions.
                </li>
              </ul>
            </GlowCard>

            {/* Story 2 */}
            <GlowCard glowColor="#ff00ff">
              <h3 className="text-lg font-rajdhani font-bold text-foreground mb-2">
                Provider Results
              </h3>
              <p className="text-sm italic text-foreground/80 mb-4">
                "As a user, I want to see a ranked list of providers with key details so I can make an informed selection."
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
            </GlowCard>
          </div>
        </section>

        {/* Zone 3: Sandbox Trust Bar + Live Demo */}
        <section id="live-demo" className="max-w-7xl mx-auto px-6 py-8">
          {/* Trust bar */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
            <Shield className="w-4 h-4" />
            <span>Synthetic data only · No PII · Model calls proxied and logged</span>
          </div>

          {/* Interaction hint */}
          <p className="text-center text-pink-400 mb-4 flex items-center justify-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            <span>This is a live demo—go ahead and interact!</span>
          </p>

          {/* Iframe with animated glow border */}
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
