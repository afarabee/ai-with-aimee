import { Download, Linkedin, Mail, MapPin, Sparkles, Zap, Trophy, GraduationCap, Briefcase, Code, Users, Target, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { Button } from '@/components/ui/button';
import { RESUME_URL } from '@/constants/urls';

const Resume = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch(RESUME_URL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Aimee-Farabee-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(RESUME_URL, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NeuralNetworkBackground />
      <Navigation />
      
      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-rajdhani font-bold neon-text-cyan mb-4">
              Aimee Farabee
            </h1>
            <h2 className="text-xl md:text-2xl font-josefin neon-text-pink mb-6">
              Product Director & AI Strategist
            </h2>
            
            {/* Credentials Banner */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-ibm"
                style={{
                  background: 'rgba(249, 249, 64, 0.1)',
                  border: '1px solid hsl(var(--color-yellow) / 0.3)',
                  color: 'hsl(var(--color-yellow))',
                }}
              >
                <Sparkles size={16} />
                AI for Humanity
              </span>
              <span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-ibm"
                style={{
                  background: 'rgba(245, 12, 160, 0.1)',
                  border: '1px solid hsl(var(--color-pink) / 0.3)',
                  color: 'hsl(var(--color-pink))',
                }}
              >
                <GraduationCap size={16} />
                USC Alumni Leadership
              </span>
            </div>

            {/* Contact Row */}
            <div className="flex flex-wrap justify-center gap-6 text-sm font-ibm text-muted-foreground mb-8">
              <a 
                href="https://www.linkedin.com/in/aimee-farabee/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[hsl(var(--color-cyan))] transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a 
                href="mailto:genai-aims@gmail.com"
                className="flex items-center gap-2 hover:text-[hsl(var(--color-cyan))] transition-colors"
              >
                <Mail size={16} />
                genai-aims@gmail.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                United States
              </span>
            </div>

            <Button onClick={handleDownload} className="hero-button">
              <Download size={18} className="mr-2" />
              Download Full Resume (PDF)
            </Button>
          </header>

          {/* Headline Impact Section */}
          <section 
            className="mb-16 p-8 rounded-2xl"
            style={{
              background: 'rgba(0, 255, 255, 0.03)',
              border: '1px solid hsl(var(--color-cyan) / 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-[hsl(var(--color-yellow))]" size={28} />
              <h3 className="text-2xl font-rajdhani font-semibold neon-text-yellow">
                Zero to One, Built to Scale
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(245, 12, 160, 0.05)',
                  border: '1px solid hsl(var(--color-pink) / 0.2)',
                }}
              >
                <div className="flex items-start gap-4">
                  <TrendingUp className="text-[hsl(var(--color-pink))] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-lg font-ibm text-foreground mb-2">
                      <span className="font-bold text-[hsl(var(--color-cyan))]">300M+ users</span> reached through consumer-to-enterprise products
                    </p>
                    <p className="text-sm text-muted-foreground font-ibm">
                      Contributed to $1B+ in venture-backed exits—driving 2–10× valuation growth
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(249, 249, 64, 0.05)',
                  border: '1px solid hsl(var(--color-yellow) / 0.2)',
                }}
              >
                <div className="flex items-start gap-4">
                  <Target className="text-[hsl(var(--color-yellow))] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-lg font-ibm text-foreground mb-2">
                      <span className="font-bold text-[hsl(var(--color-cyan))]">100K customers</span> and first $1M ARR
                    </p>
                    <p className="text-sm text-muted-foreground font-ibm">
                      Achieved early product-market fit with data-driven iteration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Summary */}
          <section 
            className="mb-16 p-8 rounded-2xl"
            style={{
              background: 'rgba(245, 12, 160, 0.03)',
              border: '1px solid hsl(var(--color-pink) / 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-[hsl(var(--color-pink))]" size={28} />
              <h3 className="text-2xl font-rajdhani font-semibold neon-text-pink">
                Professional Summary
              </h3>
            </div>
            <p className="text-lg font-ibm text-foreground leading-relaxed">
              Product Director with 15+ years of experience at the intersection of technology, 
              business, and human needs. I turn messy, ambiguous problems into governed, scalable, 
              genuinely human solutions. Currently leading enterprise AI adoption and pioneering 
              strategic rollout of generative AI solutions. I believe AI should feel usable, safe, 
              and like a capability that lifts people up—not something that replaces them.
            </p>
          </section>

          {/* Experience Section */}
          <section 
            className="mb-16 p-8 rounded-2xl"
            style={{
              background: 'rgba(249, 249, 64, 0.03)',
              border: '1px solid hsl(var(--color-yellow) / 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="text-[hsl(var(--color-yellow))]" size={28} />
              <h3 className="text-2xl font-rajdhani font-semibold neon-text-yellow">
                Experience
              </h3>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  company: 'Charles River Laboratories',
                  role: 'Senior Product Director, AI Enablement',
                  period: 'Current',
                  highlights: [
                    'Leading the charge on early enterprise AI adoption',
                    'Pioneering strategic rollout of generative AI solutions',
                    'Ensuring safe and valuable integration of new platform capabilities',
                  ],
                },
                {
                  company: 'American Express',
                  role: 'Product Director',
                  period: 'Previous',
                  highlights: [
                    'Built consumer-to-enterprise products at scale',
                    'Drove cross-functional initiatives across global teams',
                  ],
                },
                {
                  company: 'Cigna / Express Scripts',
                  role: 'Senior Product Manager',
                  period: 'Previous',
                  highlights: [
                    'Managed complex healthcare product portfolios',
                    'Led digital transformation initiatives',
                  ],
                },
              ].map((job, index) => (
                <div 
                  key={index}
                  className="relative pl-8 pb-8 border-l-2"
                  style={{ borderColor: 'hsl(var(--color-cyan) / 0.3)' }}
                >
                  <div 
                    className="absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px]"
                    style={{
                      background: 'hsl(var(--color-cyan))',
                      boxShadow: '0 0 12px hsl(var(--color-cyan) / 0.6)',
                    }}
                  />
                  <div className="mb-2">
                    <h4 className="text-xl font-rajdhani font-semibold text-[hsl(var(--color-cyan))]">
                      {job.role}
                    </h4>
                    <p className="font-ibm text-[hsl(var(--color-pink))]">{job.company}</p>
                    <p className="text-sm text-muted-foreground font-ibm">{job.period}</p>
                  </div>
                  <ul className="space-y-2 mt-4">
                    {job.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="flex items-start gap-3 font-ibm text-foreground">
                        <span className="text-[hsl(var(--color-yellow))] mt-1">→</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Certifications */}
          <section 
            className="mb-16 p-8 rounded-2xl"
            style={{
              background: 'rgba(0, 255, 255, 0.03)',
              border: '1px solid hsl(var(--color-cyan) / 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="text-[hsl(var(--color-cyan))]" size={28} />
              <h3 className="text-2xl font-rajdhani font-semibold neon-text-cyan">
                Education & Certifications
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(245, 12, 160, 0.05)',
                  border: '1px solid hsl(var(--color-pink) / 0.2)',
                }}
              >
                <h4 className="font-rajdhani font-semibold text-lg text-[hsl(var(--color-pink))] mb-2">
                  Applied Generative AI Specialization
                </h4>
                <p className="text-sm text-muted-foreground font-ibm">
                  Deepened hands-on expertise in AI theory, productization, and governance
                </p>
              </div>
              
              <div 
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(249, 249, 64, 0.05)',
                  border: '1px solid hsl(var(--color-yellow) / 0.2)',
                }}
              >
                <h4 className="font-rajdhani font-semibold text-lg text-[hsl(var(--color-yellow))] mb-2">
                  AI for Humanity
                </h4>
                <p className="text-sm text-muted-foreground font-ibm">
                  Certified in ethical AI practices and human-centered design
                </p>
              </div>
              
              <div 
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(0, 255, 255, 0.05)',
                  border: '1px solid hsl(var(--color-cyan) / 0.2)',
                }}
              >
                <h4 className="font-rajdhani font-semibold text-lg text-[hsl(var(--color-cyan))] mb-2">
                  USC Alumni Leadership
                </h4>
                <p className="text-sm text-muted-foreground font-ibm">
                  University of Southern California network member
                </p>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section 
            className="mb-16 p-8 rounded-2xl"
            style={{
              background: 'rgba(245, 12, 160, 0.03)',
              border: '1px solid hsl(var(--color-pink) / 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Code className="text-[hsl(var(--color-pink))]" size={28} />
              <h3 className="text-2xl font-rajdhani font-semibold neon-text-pink">
                Core Competencies
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {[
                'Enterprise AI Strategy',
                'Product Leadership',
                'Generative AI',
                'Cross-functional Leadership',
                'AI Governance',
                'Digital Transformation',
                'Product-Market Fit',
                'Healthcare Technology',
                'Agile Methodologies',
                'Stakeholder Management',
                'Data-Driven Decision Making',
                'Team Building',
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-ibm"
                  style={{
                    background: index % 3 === 0 
                      ? 'rgba(0, 255, 255, 0.1)' 
                      : index % 3 === 1 
                        ? 'rgba(245, 12, 160, 0.1)' 
                        : 'rgba(249, 249, 64, 0.1)',
                    border: index % 3 === 0 
                      ? '1px solid hsl(var(--color-cyan) / 0.3)' 
                      : index % 3 === 1 
                        ? '1px solid hsl(var(--color-pink) / 0.3)' 
                        : '1px solid hsl(var(--color-yellow) / 0.3)',
                    color: index % 3 === 0 
                      ? 'hsl(var(--color-cyan))' 
                      : index % 3 === 1 
                        ? 'hsl(var(--color-pink))' 
                        : 'hsl(var(--color-yellow))',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Download CTA */}
          <div className="text-center">
            <Button onClick={handleDownload} className="hero-button" style={{ padding: '1.5rem 3rem' }}>
              <Download size={20} className="mr-2" />
              Download Complete Resume
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resume;
