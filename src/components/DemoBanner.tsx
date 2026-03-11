import { useState, useEffect } from "react";
import { Sparkles, Zap, Rocket, X } from "lucide-react";

const DemoBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {document.body.style.overflow = "";};
  }, [isModalOpen]);

  return (
    <>
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          {/* Animated glow container */}
          <div className="relative rounded-2xl border border-pink-500/30 animate-banner-glow bg-gradient-to-br from-pink-500/10 via-transparent to-cyan-500/10 p-8 md:p-12">
            
            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
              {/* Visual Element - Left */}
              <div className="hidden md:flex justify-center">
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-pink-500/20 to-cyan-500/20 border border-cyan-500/30">
                  <Sparkles className="w-12 h-12 text-cyan-400 animate-pulse" />
                  <Zap className="absolute top-2 right-2 w-6 h-6 text-pink-400" />
                </div>
              </div>

              {/* Content - Right */}
              <div className="text-center md:text-left">
                <h2 className="neon-text-cyan font-rajdhani font-bold text-3xl md:text-4xl mb-3">
                  See AI in Action
                </h2>
                <p className="text-lg font-medium mb-4 text-secondary">
                  Don't just read about what I build—experience it yourself.
                </p>
                <p className="text-base text-gray-300 mb-8 max-w-2xl">
                  Try the Intelligent Story Builder, an agentic AI tool I designed to transform raw ideas into production-ready user stories. Select a scenario, watch the AI work, and see why this system reduced story creation time by 80%.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-hero px-8 py-4 text-base font-montserrat inline-flex items-center gap-2">
                  
                  <Rocket className="w-5 h-5" />
                  <span>Launch Interactive Demo →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Builder Modal */}
      {isModalOpen &&
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={() => setIsModalOpen(false)}>
        
          <div
          className="relative w-[90vw] h-[90vh] rounded-xl border border-border/60 bg-card overflow-hidden shadow-[0_0_60px_hsl(var(--color-cyan)/0.15)]"
          onClick={(e) => e.stopPropagation()}>
          
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
              className="rounded-sm p-1 text-muted-foreground hover:text-foreground transition-colors">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Iframe */}
            <iframe
            src="https://intelligent-story-builder.lovable.app/"
            className="w-full border-0"
            style={{ height: "calc(90vh - 44px)" }}
            title="Intelligent Story Builder Demo"
            allow="clipboard-write" />
          
          </div>
        </div>
      }
    </>);

};

export default DemoBanner;