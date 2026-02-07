import { Link } from "react-router-dom";
import { Sparkles, Zap } from "lucide-react";

const DemoBanner = () => {
  return (
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
              <p className="text-base text-gray-300 mb-8 max-w-2xl">
                Try the Intelligent Story Builder — an agentic AI tool that reduced story creation time by 80% across 20+ product teams. Select a scenario, watch the AI work, and see real output.
              </p>
              <Link
                to="/demo"
                className="btn-hero px-8 py-4 text-base font-montserrat inline-flex items-center gap-2"
              >
                <span>TRY THE LIVE DEMO</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoBanner;
