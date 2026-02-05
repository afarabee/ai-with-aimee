import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlowCard from "@/components/ui/glow-card";
import { Play, GitCompare, ArrowLeft, MousePointerClick } from "lucide-react";

const Demo = () => {
  const scenarios = [
    {
      icon: Play,
      title: "Quick Demo",
      duration: "30 sec",
      description:
        "Watch the AI generate a complete user story from a simple login requirement.",
      bestFor: "Getting a fast feel for the output quality.",
      glowColor: "#00ffff",
    },
    {
      icon: GitCompare,
      title: "Compare AI Models",
      duration: "1 min",
      description:
        "See GPT-5 Nano and Gemini 2.5 Flash Lite tackle the same prompt side-by-side.",
      bestFor: "Understanding how I approach model evaluation.",
      glowColor: "#ff00ff",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-16">
        {/* Zone 1: Context Hook */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-rajdhani font-bold neon-text-yellow">
              Intelligent Story Builder
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-foreground/90 font-medium mb-3">
            Generate production-ready Agile user stories in seconds.
          </p>
          <p className="text-lg text-muted-foreground">
            This tool reduced story creation time by 80% across 20+ product teams.
          </p>
        </section>

        {/* Zone 2: Scenario Cards */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <GlowCard
                key={scenario.title}
                glowColor={scenario.glowColor}
                className="cursor-pointer hover:scale-[1.03] transition-transform"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${scenario.glowColor}20, ${scenario.glowColor}10)`,
                      border: `1px solid ${scenario.glowColor}40`,
                    }}
                  >
                    <scenario.icon
                      className="w-6 h-6"
                      style={{ color: scenario.glowColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-rajdhani font-bold text-foreground">
                        {scenario.title}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${scenario.glowColor}20`,
                          color: scenario.glowColor,
                        }}
                      >
                        {scenario.duration}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {scenario.description}
                    </p>
                    <p className="text-xs text-foreground/60">
                      <span className="font-medium text-pink-400">
                        Best for:
                      </span>{" "}
                      {scenario.bestFor}
                    </p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Zone 3: Interactive Demo */}
        <section className="max-w-7xl mx-auto px-6 py-8">
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

        {/* Bottom CTA */}
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
