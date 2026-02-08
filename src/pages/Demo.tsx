import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlowCard from "@/components/ui/glow-card";
import { Play, GitCompare, ArrowLeft, MousePointerClick, ArrowDown } from "lucide-react";

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
          <p className="text-lg text-[hsl(var(--color-pink))]">
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
        <section className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Big CTA callout */}
          <div className="relative rounded-xl border border-[hsl(var(--color-pink))]/30 bg-[hsl(var(--color-pink))]/5 backdrop-blur-sm p-6 md:p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <MousePointerClick className="w-8 h-8 text-[hsl(var(--color-pink))]" />
              <h2 className="text-2xl md:text-3xl font-outfit font-bold text-foreground">
                this is a live tool — try it yourself below
              </h2>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              fully interactive · no login required · powered by real LLM calls
            </p>
            <ArrowDown className="w-6 h-6 text-[hsl(var(--color-pink))] mx-auto mt-4 animate-bounce" />
          </div>

          {/* Quick-start steps */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "select a preset scenario or paste your own requirement",
              "click \u201CGenerate User Story\u201D to create new story draft",
              "review the AI-generated stories & acceptance criteria",
              "try model comparison to see different AI outputs side-by-side",
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-sm px-4 py-2 text-sm"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--color-cyan))]/20 text-[hsl(var(--color-cyan))] font-mono font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>

          {/* Browser-chrome iframe container */}
          <div className="rounded-xl border border-border/60 shadow-[0_8px_32px_-8px_hsl(var(--color-cyan)/0.15)] bg-card/30 backdrop-blur-sm overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 bg-card/60">
              {/* Traffic-light dots */}
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              {/* Title */}
              <span className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                live tool — intelligent story builder
              </span>
            </div>
            {/* Iframe */}
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
