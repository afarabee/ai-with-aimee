import { Linkedin, Github, Mail } from 'lucide-react';
import AboutBackground from './AboutBackground';
import { Button } from './ui/button';
import SectionDivider from './SectionDivider';
import aimeeHeadshot from '@/assets/aimee-headshot.jpg';
import { RESUME_URL } from '@/constants/urls';

const AboutSection = () => {

  return (
    <section id="about" className="relative min-h-screen py-24 pb-32">
      <AboutBackground />
      
      {/* Pink-to-Violet gradient overlay at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(245, 12, 160, 0.15), transparent)',
        }}
      />
      
      {/* Bottom fade-out gradient with cyan-violet blend */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(112, 94, 99, 0.3))',
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero-Intro Section */}
        <div className="mb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Portrait */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div 
                  className="w-full h-full rounded-full overflow-hidden border-4 relative"
                  style={{
                    borderColor: '#00ffff',
                    boxShadow: '0 0 6px #33ffff, 0 0 14px #99ffff, inset 0 0 30px rgba(245, 12, 160, 0.15)',
                  }}
                >
                  <img 
                    src={aimeeHeadshot} 
                    alt="Aimee Farabee - AI Strategist and Product Director"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: 'center 30%',
                      transform: 'scale(1.2)',
                    }}
                  />
                </div>
                {/* Reflection effect */}
                <div 
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-30"
                  style={{ background: '#00ffff' }}
                />
              </div>
            </div>

            {/* Right: Text Block */}
            <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-rajdhani font-semibold neon-text-yellow">
            Meet Aimee — Product Director, AI Strategist, and Dog Mom.
          </h1>
              
              <h2 className="text-xl md:text-2xl font-josefin italic neon-text-pink">
                Exploring how Artificial Intelligence can amplify Human Intelligence.
              </h2>

              <div className="space-y-4 font-ibm" style={{ color: '#e6e6e6', lineHeight: '1.5em' }}>
                <p>
                  I'm Aimee Farabee, a Product Director turned AI enablement nerd and quasi-AI developer who turns messy, ambiguous problems into governed, scalable, genuinely human solutions.
                </p>
                
                <p>
                  For more than 15 years, I've lived inside the machinery of large, complex enterprises, including Express Scripts, Cigna, American Express, and now Charles River Laboratories. I've led teams through digital transformation long before "AI strategy" became a buzzword.
                </p>
                
                <p>
                  I've built my career at the intersection of technology, business, and human needs. My work is guided by a belief that great products do more than deliver features; they solve meaningful problems in smart, scalable ways.
                </p>
                
                <p>
                  My recent focus has been leading the charge on early enterprise AI adoption and pioneering the strategic rollout of generative AI solutions at Charles River. To continually lead these complex, cross-functional initiatives, I secured an Applied Generative AI Specialization, deepening my hands-on expertise in AI theory, productization, and governance, guaranteeing the safe and valuable integration of new platform capabilities.
                </p>
                
                <p>
                  I believe AI should not feel mysterious or intimidating. It should feel usable. It should feel safe. It should feel like a capability that lifts people up, not something that replaces them.
                </p>
                
                <p>
                  AI with Aimee is my digital portfolio, where I bring that philosophy to life. It's my blend of experimentation, practical workflows, and neon flavored creativity. Each project featured here represents both curiosity and intent: a commitment to making AI usable, ethical, and impactful within the enterprise.
                </p>
              </div>
            </div>
          </div>

          {/* Social Icons & CTA */}
          <div className="mb-20 mt-8">
            <div className="flex flex-col items-center gap-8">
            <div className="flex gap-6">
              {[
                { icon: Linkedin, href: 'https://www.linkedin.com/in/aimee-farabee/', label: 'LinkedIn', external: true },
                { icon: Github, href: 'https://github.com/afarabee', label: 'GitHub', external: true },
                { icon: Mail, href: 'mailto:genai-aims@gmail.com', label: 'Email', external: false },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noopener noreferrer' : undefined}
                  className="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none cursor-pointer"
                  style={{
                    borderColor: '#00ffff',
                    boxShadow: '0 0 6px #33ffff, 0 0 14px #99ffff',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f50ca0';
                    e.currentTarget.style.boxShadow = '0 0 3px #cf33c3, 0 0 8px #9a00ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#00ffff';
                    e.currentTarget.style.boxShadow = '0 0 6px #33ffff, 0 0 14px #99ffff';
                  }}
                >
                  <social.icon size={24} className="neon-text-cyan" />
                </a>
              ))}
            </div>

            <Button
              onClick={async () => {
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
              }}
              className="hero-button text-sm"
              style={{ 
                width: '240px',
                fontSize: '0.9rem',
                padding: '1.25rem 1.5rem'
              }}
            >
              Download Resume (PDF)
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* Glowing Divider between About and Projects */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-4/5 max-w-4xl"
        style={{
          background: 'linear-gradient(90deg, #f50ca0, #b8f2e3)',
          boxShadow: '0 0 10px rgba(245, 12, 160, 0.6), 0 0 20px rgba(184, 242, 227, 0.4)',
          filter: 'blur(0.5px)',
          zIndex: 20
        }}
      />

      {/* Section Divider */}
      <SectionDivider variant="curve" color="#0f0b1d" />
    </section>
  );
};

export default AboutSection;
