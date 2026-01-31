import { User } from 'lucide-react';
import GlowCard from '@/components/ui/glow-card';

const ResumeSummary = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <User 
          size={28} 
          style={{ color: 'hsl(var(--color-cyan))' }}
        />
        <h3 
          className="text-2xl font-rajdhani font-semibold"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--color-cyan)) 0%, hsl(var(--color-pink)) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Professional Summary
        </h3>
      </div>
      
      <GlowCard glowColor="#00ffff" className="!p-0">
        <p className="text-lg text-foreground/90 font-ibm leading-relaxed">
          Senior Director-level Healthcare Product Leader & AI Strategist with 15+ years of experience 
          driving digital transformation across enterprise organizations. Proven track record of launching 
          AI-powered products that deliver measurable outcomes—from 98% reductions in research time to 
          platforms serving 300M+ users. Passionate about building AI-fluent product teams and establishing 
          responsible governance frameworks that enable innovation while ensuring ethical AI deployment.
        </p>
      </GlowCard>
    </section>
  );
};

export default ResumeSummary;
