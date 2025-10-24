import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AboutBackground from '@/components/AboutBackground';

const AgentsArentTheAnswer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative">
      <AboutBackground />
      <Navigation />
      
      <main className="relative z-10">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 transition-all duration-300 font-montserrat text-sm"
            style={{
              color: '#f27f9b',
              textShadow: '0 0 8px rgba(242, 127, 155, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = '0 0 12px rgba(242, 127, 155, 0.8), 0 0 20px rgba(242, 127, 155, 0.4)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = '0 0 8px rgba(242, 127, 155, 0.5)';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

        {/* Hero Banner */}
        <section className="relative py-16 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating JSON snippets */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`json-${i}`}
                className="absolute text-xs font-mono opacity-20 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${8 + i}s`,
                }}
              >
                {i % 3 === 0 ? '{ "agent": true }' : i % 3 === 1 ? '[Docker]' : '<AI/>'}
              </div>
            ))}
            
            {/* Neural network nodes */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
              <defs>
                <radialGradient id="node-glow">
                  <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f446a0" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[...Array(12)].map((_, i) => (
                <circle
                  key={i}
                  cx={`${(i * 8.33) + 10}%`}
                  cy={`${30 + Math.sin(i) * 20}%`}
                  r="4"
                  fill="url(#node-glow)"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </svg>
          </div>

          <div 
            className="max-w-5xl mx-auto px-6 relative z-10 text-center py-12 rounded-3xl backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(112, 94, 99, 0.3) 0%, rgba(13, 6, 26, 0.5) 100%)',
              border: '2px solid rgba(0, 255, 255, 0.3)',
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.2), 0 0 80px rgba(244, 70, 160, 0.1)',
            }}
          >
            <h1 className="text-4xl md:text-6xl font-rajdhani font-bold mb-4 neon-text-pink animate-fade-in">
              Agents Aren't Always the Answer
            </h1>
            <p className="text-2xl md:text-3xl font-shadows italic neon-text-cyan mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              A cautionary (but kinda funny) tale from my first n8n build
            </p>
            <div className="text-sm font-titillium neon-text-yellow animate-fade-in" style={{ animationDelay: '0.4s' }}>
              by Aimee Farabee
            </div>
          </div>
        </section>

        {/* Article Content - Single Continuous Reading Area */}
        <article className="py-20 relative">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-lg mx-auto" style={{ maxWidth: '850px' }}>
              
              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                Fresh off completing my GenAI specialization, I was feeling unstoppable. I'd conquered the fundamentals, 
                understood the theory, and now it was time to put it all into practice.
              </p>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                My first real project? Building an n8n agent. It seemed like the perfect blend of automation and AI — 
                a chance to showcase everything I'd learned. What could possibly go wrong?
              </p>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                Spoiler alert: Everything. Well, almost everything. But hey, that's how we learn, right?
              </p>

              <h2 className="text-2xl font-rajdhani font-semibold neon-text-yellow mt-12 mb-6">
                The Setup Saga
              </h2>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                I dove headfirst into Docker, determined to get n8n up and running. The tutorials made it look easy — 
                just a few commands, and boom, you're building workflows. Except... nothing worked the way I expected.
              </p>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                Gone. Poof. Vanished. My first workflow disappeared like it never existed. I quickly learned that 
                without proper volume persistence, Docker containers are like digital sandcastles at high tide.
              </p>

              <h2 className="text-2xl font-rajdhani font-semibold neon-text-yellow mt-12 mb-6">
                The Debugging Marathon
              </h2>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                Hours turned into days as I wrestled with JSON configurations, API endpoints, and workflow logic. 
                ChatGPT and Gemini became my debugging duo, tag-teaming through error messages and configuration files.
              </p>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                At some point, I caught myself thinking: "Am I building an agent or a migraine?" The complexity 
                was snowballing. What started as an elegant automation solution was becoming a maintenance nightmare.
              </p>

              <h2 className="text-2xl font-rajdhani font-semibold neon-text-yellow mt-12 mb-6">
                The Pivot Point
              </h2>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                Then it hit me. I didn't actually need an agent for this task. The problem I was trying to solve 
                could be handled with a simple workflow — no complex decision trees, no fancy reasoning loops, 
                just straightforward automation.
              </p>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                I had fallen into the trap of using the shiniest tool available, not the right tool for the job. 
                It's a common mistake in our field — we get excited about new technology and force-fit it into 
                places where simpler solutions would work better.
              </p>

              <h2 className="text-2xl font-rajdhani font-semibold neon-text-yellow mt-12 mb-6">
                The Lesson Learned
              </h2>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                Sometimes the smartest automation is knowing when to stop automating. Agents are powerful tools, 
                but they're not always the answer. Before diving into complex agentic systems, ask yourself:
              </p>

              <ul className="font-ibm text-lg mb-8 space-y-3 pl-6" style={{ color: '#d8f5ef', lineHeight: '1.7' }}>
                <li>Does this problem really need autonomous decision-making?</li>
                <li>Will the maintenance burden outweigh the benefits?</li>
                <li>Could a simpler workflow accomplish the same goal?</li>
              </ul>

              <p className="font-ibm text-lg mb-6" style={{ color: '#d8f5ef', lineHeight: '1.7', marginBottom: '1.2em' }}>
                I still love building agents, but I've learned the best automation is the one that actually makes 
                life simpler — not more complicated. Sometimes the most intelligent solution isn't the most 
                sophisticated one. And that's perfectly okay.
              </p>

              {/* Closing Quote */}
              <div className="mt-16 mb-12 text-center">
                <blockquote 
                  className="text-2xl md:text-3xl font-shadows italic neon-text-pink py-6"
                  style={{ textShadow: '0 0 15px rgba(232, 65, 149, 0.5)' }}
                >
                  "Agents aren't always the answer — sometimes, they're just the punchline."
                </blockquote>
              </div>

              <div className="text-center mt-12 pt-8 border-t border-cyan-500/20">
                <p className="font-rajdhani text-xl font-semibold neon-text-cyan">
                  AI with Aimee — Intelligence with a Twist
                </p>
              </div>

            </div>
          </div>
        </article>
      </main>

      <Footer />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default AgentsArentTheAnswer;