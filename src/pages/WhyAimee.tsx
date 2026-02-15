import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───────────────────────────────────────────────────
interface Metric { value: string; label: string; sub: string; }
interface VisionPoint { heading: string; text: string; }
interface Requirement { jdRequirement: string; myExperience: string; company: string; proof: string; }
interface WhyAimeeData {
  company: string;
  role: string;
  hero_tagline: string;
  hero_subtext: string;
  metrics: Metric[];
  vision_title: string;
  vision_points: VisionPoint[];
  requirements: Requirement[];
  closing_tagline: string;
  closing_subtext: string;
}

// ─── Animated counter hook ───────────────────────────────────
function useCountUp(target: string, duration = 1500, startOnView = true) {
  const [count, setCount] = useState<number | string>(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) { setCount(target); return; }
    const steps = 40;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  const suffix = target.replace(/[0-9.,]/g, '');
  const display = typeof count === 'string' ? count : `${count.toLocaleString()}${suffix}`;
  return { display, ref };
}

// ─── Metric Card ─────────────────────────────────────────────
function MetricCard({ value, label, sub, delay }: Metric & { delay: number }) {
  const { display, ref } = useCountUp(value);
  return (
    <div
      ref={ref}
      className="flex flex-col items-center p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/80 to-slate-950/80"
      style={{
        animation: `fadeSlideUp 0.6s ease-out ${delay}s both`,
        boxShadow: '0 0 20px rgba(0,255,255,0.06), inset 0 1px 0 rgba(0,255,255,0.1)',
      }}
    >
      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
        {display}
      </span>
      <span className="text-sm font-semibold text-gray-200 mt-1 text-center">{label}</span>
      <span className="text-xs text-gray-500 mt-1 text-center">{sub}</span>
    </div>
  );
}

// ─── Requirement Match Row ───────────────────────────────────
function MatchRow({ item, index }: { item: Requirement; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-xl border border-cyan-500/20 bg-slate-900/60 overflow-hidden cursor-pointer transition-all duration-300 hover:border-cyan-400/50"
      style={{
        animation: `fadeSlideUp 0.5s ease-out ${0.1 * index}s both`,
        boxShadow: expanded ? '0 0 30px rgba(0,255,255,0.08)' : 'none',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center mt-0.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-cyan-300 leading-snug">{item.jdRequirement}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-bold text-yellow-300 bg-yellow-400/10 px-2 py-0.5 rounded-full">{item.proof}</span>
            <span className="text-xs text-gray-500">{item.company}</span>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 mt-1 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pl-16">
          <p className="text-sm text-gray-300 leading-relaxed">{item.myExperience}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function WhyAimee() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [data, setData] = useState<WhyAimeeData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let query = supabase
        .from('why_aimee')
        .select('*')
        .eq('slug', slug || '');

      if (!isPreview) {
        query = query.eq('status', 'published');
      }

      const { data: entry, error } = await query.maybeSingle();

      if (error || !entry) {
        setNotFound(true);
      } else {
        setData({
          company: entry.company,
          role: entry.role,
          hero_tagline: entry.hero_tagline || '',
          hero_subtext: entry.hero_subtext || '',
          metrics: (entry.metrics as unknown as Metric[]) || [],
          vision_title: entry.vision_title || '',
          vision_points: (entry.vision_points as unknown as VisionPoint[]) || [],
          requirements: (entry.requirements as unknown as Requirement[]) || [],
          closing_tagline: entry.closing_tagline || '',
          closing_subtext: entry.closing_subtext || '',
        });
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <p className="text-gray-400" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading...</p>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0a0a1a' }}>
        <h1 className="text-4xl font-black text-cyan-400 mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>404</h1>
        <p className="text-gray-400" style={{ fontFamily: "'Outfit', sans-serif" }}>This page doesn't exist or isn't published yet.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-gray-100"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d2b 30%, #0a0a1a 70%, #0d0921 100%)',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Orbitron:wght@700;900&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.15), 0 0 60px rgba(0,255,255,0.05); }
          50% { box-shadow: 0 0 30px rgba(0,255,255,0.25), 0 0 80px rgba(0,255,255,0.1); }
        }
        @keyframes neonFlicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
          96% { opacity: 0.9; }
          97% { opacity: 1; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .neon-border {
          position: relative;
        }
        .neon-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, #00ffff, #ff00ff, #00ffff);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        .star-field {
          background-image: radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.2) 0%, transparent 100%),
                            radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.15) 0%, transparent 100%),
                            radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.2) 0%, transparent 100%),
                            radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.25) 0%, transparent 100%),
                            radial-gradient(1px 1px at 60% 90%, rgba(255,255,255,0.15) 0%, transparent 100%),
                            radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.2) 0%, transparent 100%);
        }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden star-field">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
          <p
            className="text-xs font-bold tracking-widest text-pink-400 uppercase mb-4"
            style={{ animation: 'fadeSlideUp 0.5s ease-out 0s both', fontFamily: "'Orbitron', sans-serif" }}
          >
            Aimee Farabee — Why Me for {data.company}
          </p>
          <h1
            className="text-3xl sm:text-4xl font-black leading-tight mb-4"
            style={{
              animation: 'fadeSlideUp 0.6s ease-out 0.1s both, neonFlicker 5s ease infinite',
              background: 'linear-gradient(135deg, #00ffff 0%, #00ff88 50%, #00ffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.3))',
            }}
          >
            {data.hero_tagline}
          </h1>
          <p
            className="text-base text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6"
            style={{ animation: 'fadeSlideUp 0.6s ease-out 0.2s both' }}
          >
            {data.hero_subtext}
          </p>
          <div
            className="inline-block rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-emerald-400 neon-border"
            style={{ animation: 'fadeSlideUp 0.6s ease-out 0.3s both, glowPulse 3s ease infinite' }}
          >
            {data.role}
          </div>
        </div>
      </section>

      {/* ─── METRICS ─── */}
      {data.metrics.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-10">
          <h2
            className="text-center text-xl font-black tracking-wide uppercase mb-8"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: 'linear-gradient(90deg, #ff00ff, #ff69b4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Proven Impact
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.metrics.map((m, i) => (
              <MetricCard key={i} {...m} delay={0.1 * i} />
            ))}
          </div>
        </section>
      )}

      {/* ─── VISION ─── */}
      {data.vision_points.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-10">
          <h2
            className="text-center text-xl font-black tracking-wide uppercase mb-8"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: 'linear-gradient(90deg, #ff00ff, #ff69b4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {data.vision_title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.vision_points.map((pt, i) => (
              <div
                key={i}
                className="rounded-xl border border-pink-500/20 bg-slate-900/50 p-5 transition-all duration-300 hover:border-pink-400/50 hover:bg-slate-900/70"
                style={{
                  animation: `fadeSlideUp 0.5s ease-out ${0.1 * i}s both`,
                  boxShadow: '0 0 15px rgba(255,0,255,0.04)',
                }}
              >
                <h3 className="text-sm font-bold text-yellow-300 mb-2">{pt.heading}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{pt.text}</p>
              </div>
            ))}
          </div>

          {/* Closing statement */}
          {(data.closing_tagline || data.closing_subtext) && (
            <div className="mt-10 text-center">
              {data.closing_tagline && (
                <p className="text-lg font-bold text-cyan-300 mb-2">{data.closing_tagline}</p>
              )}
              {data.closing_subtext && (
                <p className="text-sm text-gray-400 leading-relaxed">{data.closing_subtext}</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* ─── REQUIREMENT MATCHING ─── */}
      {data.requirements.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-10">
          <h2
            className="text-center text-xl font-black tracking-wide uppercase mb-2"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: 'linear-gradient(90deg, #ff00ff, #ff69b4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Requirement Match
          </h2>
          <p className="text-center text-sm text-gray-500 mb-8">Tap any row to expand</p>
          <div className="space-y-3">
            {data.requirements.map((req, i) => (
              <MatchRow key={i} item={req} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="max-w-3xl mx-auto px-6 pt-8 pb-16 text-center">
        <div
          className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/80 to-slate-950 p-8 neon-border"
          style={{ animation: 'glowPulse 3s ease infinite' }}
        >
          <h2
            className="text-xl font-black tracking-wide uppercase mb-4"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: 'linear-gradient(90deg, #00ffff, #00bfff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Let's Connect
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            <span className="text-pink-400 font-semibold">Aimee Farabee</span>
            {' '}&middot; Manchester, TN &middot; 813-503-0323 &middot;{' '}
            <a href="mailto:aimee.farabee@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2">
              aimee.farabee@gmail.com
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="mailto:aimee.farabee@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2">
              Email
            </a>
            <span className="text-gray-600">&middot;</span>
            <a href="https://www.linkedin.com/in/aimee-farabee/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2">
              LinkedIn
            </a>
            <span className="text-gray-600">&middot;</span>
            <a href="https://ai-with-aims.studio" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2">
              AI Portfolio
            </a>
            <span className="text-gray-600">&middot;</span>
            <a href="https://github.com/afarabee" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="text-center py-6 border-t border-gray-800/50">
        <p className="text-xs text-gray-600">
          Built by Aimee Farabee &middot; AI with Aimee &middot; 2026
        </p>
      </footer>
    </div>
  );
}
