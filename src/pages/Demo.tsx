import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlowCard from "@/components/ui/glow-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Play,
  GitCompare,
  Upload,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Database,
  GitBranch,
  Settings,
} from "lucide-react";

const Demo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    {
      icon: Upload,
      title: "Upload & Generate",
      duration: "2 min",
      description:
        "Paste your own requirements or upload a doc, then generate a story.",
      bestFor: "Hands-on exploration.",
      glowColor: "#ffcc00",
    },
  ];

  const features = [
    {
      icon: Database,
      title: "RAG Context",
      description:
        "The system pulls from a curated knowledge base of user story best practices to ground its outputs.",
    },
    {
      icon: GitBranch,
      title: "Prompt Versioning",
      description:
        "Each generation uses a version-controlled prompt, allowing A/B testing and continuous refinement.",
    },
    {
      icon: Settings,
      title: "DevOps Integration",
      description:
        "Output is formatted for direct import into Azure DevOps or Jira with proper acceptance criteria.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-rajdhani font-bold neon-text-yellow mb-2">
                Intelligent Story Builder
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Interactive Demo
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
          </div>
          <p className="text-lg text-foreground/80 max-w-4xl leading-relaxed">
            This is the AI system I built at Charles River Labs to help product
            teams write better user stories, faster. Pick a guided scenario
            below to see how it transforms raw requirements into structured,
            DevOps-ready output—or dive into the full tool and explore on your
            own.
          </p>
        </section>

        {/* Scenario Cards */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Demo + Sidebar */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            {/* Iframe Container */}
            <div className="relative rounded-2xl border border-cyan-500/30 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5" />
              <div className="relative h-[50vh] md:h-[70vh] flex items-center justify-center">
                {/* Placeholder content - replace with actual iframe when ready */}
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Play className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-rajdhani font-bold text-foreground mb-2">
                    Demo Coming Soon
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Select a scenario above to see the Intelligent Story Builder
                    in action. The embedded demo will appear here.
                  </p>
                </div>
                {/* Uncomment when iframe URL is ready:
                <iframe
                  src="YOUR_DEMO_URL_HERE"
                  className="w-full h-full border-0"
                  title="Intelligent Story Builder Demo"
                  allow="clipboard-write"
                />
                */}
              </div>
            </div>

            {/* Collapsible Sidebar */}
            <div className="lg:block">
              <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-pink-500/30 bg-card/50 backdrop-blur-sm hover:bg-pink-500/5 transition-colors">
                    <span className="font-rajdhani font-bold text-foreground">
                      What You're Seeing
                    </span>
                    {sidebarOpen ? (
                      <ChevronDown className="w-5 h-5 text-pink-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-pink-400" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4 space-y-4">
                    {features.map((feature) => (
                      <div
                        key={feature.title}
                        className="p-4 rounded-xl border border-cyan-500/20 bg-card/30 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <feature.icon className="w-5 h-5 text-cyan-400" />
                          <h4 className="font-rajdhani font-bold text-foreground">
                            {feature.title}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
