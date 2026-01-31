import { Briefcase } from 'lucide-react';
import GlowCard from '@/components/ui/glow-card';

const experiences = [
  {
    title: 'Senior Director, Product Management – AI & Digital Platforms',
    company: 'Charles River Labs',
    period: '2022 – Present',
    location: 'Boston, MA',
    highlights: [
      'Led development of SARA GenAI, reducing scientific research time by 98% (from 2+ hours to 3 minutes)',
      'Established enterprise AI governance framework managing 100+ use cases with full compliance',
      'Built and scaled AI-fluent product team across 3 global regions',
      'Drove strategic roadmap for $500M+ digital portfolio transformation',
    ],
  },
  {
    title: 'Director, Product Management – Healthcare Platforms',
    company: 'Teladoc Health',
    period: '2019 – 2022',
    location: 'Purchase, NY',
    highlights: [
      'Launched behavioral health platform reducing patient wait times by 97% (from 50 days to 1.5 days)',
      'Delivered 97-day MVP launch for enterprise mental health solution',
      'Scaled platform to serve 50M+ members across Fortune 500 clients',
      'Integrated AI-powered triage reducing clinician workload by 40%',
    ],
  },
  {
    title: 'Senior Product Manager – Consumer Financial Services',
    company: 'American Express / Bluebird',
    period: '2015 – 2019',
    location: 'New York, NY',
    highlights: [
      'Launched Walmart Bluebird prepaid card opening 575k new accounts in first year',
      'Managed P&L for $200M+ consumer product portfolio',
      'Led cross-functional team of 25+ engineers, designers, and analysts',
      'Pioneered mobile-first banking features adopted by 2M+ active users',
    ],
  },
  {
    title: 'Product Manager – Digital Transformation',
    company: 'Cisco Systems',
    period: '2012 – 2015',
    location: 'San Jose, CA',
    highlights: [
      'Drove digital transformation initiatives for enterprise collaboration tools',
      'Launched self-service analytics platform reducing support tickets by 60%',
      'Managed roadmap for products reaching 300M+ global users',
    ],
  },
];

const ResumeExperience = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase 
          size={28} 
          style={{ color: 'hsl(var(--color-pink))' }}
        />
        <h3 
          className="text-2xl font-rajdhani font-semibold"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--color-pink)) 0%, rgba(139, 92, 246, 1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Professional Experience
        </h3>
      </div>
      
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <GlowCard
            key={index}
            glowColor="#f50ca0"
            className="!p-0 relative"
          >
            {/* Left accent bar */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl z-20"
              style={{
                background: 'linear-gradient(180deg, hsl(var(--color-pink)) 0%, rgba(139, 92, 246, 1) 100%)',
              }}
            />
            
            <div className="pl-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <div>
                  <h4 
                    className="text-xl font-rajdhani font-semibold"
                    style={{ color: 'hsl(var(--color-pink))' }}
                  >
                    {exp.title}
                  </h4>
                  <p className="text-lg text-foreground/90 font-ibm">
                    {exp.company}
                  </p>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <p 
                    className="font-ibm font-medium"
                    style={{ color: 'hsl(var(--color-cyan))' }}
                  >
                    {exp.period}
                  </p>
                  <p className="text-sm text-muted-foreground font-ibm">
                    {exp.location}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 mt-4">
                {exp.highlights.map((highlight, hIndex) => (
                  <li 
                    key={hIndex}
                    className="flex items-start gap-3 text-foreground/80 font-ibm"
                  >
                    <span 
                      className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: 'hsl(var(--color-cyan))' }}
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </GlowCard>
        ))}
      </div>
    </section>
  );
};

export default ResumeExperience;
