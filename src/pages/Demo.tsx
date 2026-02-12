import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Rocket, X } from "lucide-react";

const Demo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-16">
        <section className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-5xl font-rajdhani font-bold neon-text-yellow">
            Intelligent Story Builder
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 font-medium">
            Generate production-ready Agile user stories in seconds.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-rajdhani font-bold text-background bg-[hsl(var(--color-cyan))] shadow-[0_0_30px_hsl(var(--color-cyan)/0.4)] hover:shadow-[0_0_50px_hsl(var(--color-cyan)/0.6)] transition-all duration-300 hover:scale-105"
          >
            <Rocket className="w-6 h-6 transition-transform group-hover:-translate-y-0.5" />
            Launch Story Builder
          </button>
          <p className="text-muted-foreground font-mono text-sm">
            fully interactive · no login required · powered by real LLM calls
          </p>
        </section>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative w-[90vw] h-[90vh] rounded-xl border border-border/60 bg-card overflow-hidden shadow-[0_0_60px_hsl(var(--color-cyan)/0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-card/80">
                <span className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Intelligent Story Builder
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-sm p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Iframe */}
              <iframe
                src="https://intelligent-ai-story-builder.lovable.app/"
                className="w-full border-0"
                style={{ height: "calc(90vh - 44px)" }}
                title="Intelligent Story Builder Demo"
                allow="clipboard-write"
              />
            </div>
          </div>
        )}

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
