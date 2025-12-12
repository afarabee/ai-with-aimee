import { Linkedin, Github, Mail } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import aimeeHeadshot from '@/assets/aimee-headshot.jpg';
import { RESUME_URL } from '@/constants/urls';
const About = () => {
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Main About Section */}
      <section className="relative min-h-screen py-32 px-6">
        {/* Dark violet gradient background */}
        <div className="absolute inset-0 -z-10" style={{
        background: 'linear-gradient(135deg, #0d061a 0%, #1a0b2e 50%, #2d1b3d 100%)'
      }} />
        
        {/* Ambient glow effects */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 -z-10" style={{
        background: 'hsl(320 95% 50%)'
      }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-15 -z-10" style={{
        background: 'hsl(180 100% 56%)'
      }} />
        
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-rajdhani font-bold mb-6" style={{
            color: 'hsl(320 95% 50%)',
            textShadow: '0 0 20px hsl(320 95% 50% / 0.8), 0 0 40px hsl(320 95% 50% / 0.4)'
          }}>
              Meet Aimee
            </h1>
            
            <div className="hero-divider" aria-hidden="true" />
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
            {/* Left: Portrait */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-80 h-80">
                <div className="w-full h-full rounded-full overflow-hidden border-4 relative" style={{
                borderColor: 'hsl(180 100% 56%)',
                boxShadow: '0 0 8px hsl(180 100% 56% / 0.6), 0 0 20px hsl(180 100% 56% / 0.4), inset 0 0 40px hsl(320 95% 50% / 0.15)'
              }}>
                  <img src={aimeeHeadshot} alt="Aimee Farabee - AI Strategist and Product Director" className="w-full h-full object-cover" style={{
                  objectPosition: 'center 30%',
                  transform: 'scale(1.2)'
                }} />
                </div>
                {/* Reflection effect */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full blur-2xl opacity-30" style={{
                background: 'hsl(180 100% 56%)'
              }} />
              </div>
            </div>

            {/* Right: Bio Text */}
            <div className="space-y-6 font-ibm" style={{
            color: '#e6e6e6',
            lineHeight: '1.6'
          }}>
              <p>
                I'm Aimee Farabee, a product director turned AI enablement nerd who loves taking messy, ambiguous problems and turning them into governed, scalable, genuinely human solutions.
              </p>
              
              <p>
                For more than 15 years, I have worked inside large and complex enterprises including Express Scripts, Cigna, American Express, and now Charles River Laboratories. I lead teams through digital transformation long before AI strategy became a trending topic. My work lives at the intersection of product, people, and emerging technology, where success is measured by repeatable systems, measurable outcomes, and teams who feel empowered rather than overwhelmed.
              </p>
              
              <p>
                At CRL, I helped shape the early wave of enterprise AI adoption. My work includes delivering generative AI products powered by fine tuned LLMs trained on proprietary CRL data, launching governance councils and champion networks, and creating structured frameworks that let teams use AI safely, responsibly, and productively.
              </p>
              
              <p>
                I believe AI should not feel mysterious or intimidating. It should feel usable. It should feel ethical. It should feel like a capability that lifts people up, not something that replaces them.
              </p>
              
              <p>
                AI with Aimee is where I bring that philosophy to life. It is a blend of experimentation, governance, practical workflows, and neon flavored creativity. It is a space for builders, skeptics, and anyone who is AI curious to understand how this technology really works in high trust environments. I share the wins, the lessons, the failures, and the frameworks that make AI adoption stick.
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mt-20 mb-12">
            {[{
            icon: Linkedin,
            href: 'https://www.linkedin.com/in/aimee-farabee/',
            label: 'LinkedIn',
            external: true
          }, {
            icon: Github,
            href: 'https://github.com/afarabee',
            label: 'GitHub',
            external: true
          }, {
            icon: Mail,
            href: 'mailto:genai-aims@gmail.com',
            label: 'Email',
            external: false
          }].map((social, index) => <a key={index} href={social.href} aria-label={social.label} target={social.external ? '_blank' : undefined} rel={social.external ? 'noopener noreferrer' : undefined} className="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none cursor-pointer" style={{
            borderColor: 'hsl(180 100% 56%)',
            boxShadow: '0 0 8px hsl(180 100% 56% / 0.6), 0 0 16px hsl(180 100% 56% / 0.4)'
          }} onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'hsl(320 95% 50%)';
            e.currentTarget.style.boxShadow = '0 0 12px hsl(320 95% 50% / 0.7), 0 0 20px hsl(320 95% 50% / 0.5)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }} onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'hsl(180 100% 56%)';
            e.currentTarget.style.boxShadow = '0 0 8px hsl(180 100% 56% / 0.6), 0 0 16px hsl(180 100% 56% / 0.4)';
            e.currentTarget.style.transform = 'scale(1)';
          }}>
                <social.icon size={28} className="neon-text-cyan" />
              </a>)}
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col items-center gap-6 mt-8">
            {/* Neon divider */}
            <div className="w-full max-w-md h-px" style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(180 100% 56%) 30%, hsl(320 95% 50%) 70%, transparent 100%)',
            opacity: 0.5,
            boxShadow: '0 0 8px hsl(180 100% 56% / 0.4)'
          }} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mt-4">
              <Button onClick={async () => {
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
            }} className="btn-hero text-sm transition-all duration-400" style={{
              width: '220px',
              fontSize: '0.9rem',
              padding: '1rem 1.5rem'
            }}>
                Download Resume (PDF)
              </Button>
              
              <Link to="/projects">
                <Button className="btn-hero text-sm transition-all duration-400" style={{
                width: '220px',
                fontSize: '0.9rem',
                padding: '1rem 1.5rem'
              }}>
                  <span>View My Projects</span>
                </Button>
              </Link>
              
              <Link to="/blog">
                <Button className="btn-hero text-sm transition-all duration-400" style={{
                width: '220px',
                fontSize: '0.9rem',
                padding: '1rem 1.5rem'
              }}>
                  <span>Read My Blog</span>
                </Button>
              </Link>
            </div>

            {/* Back to Home Link */}
            <Link to="/" className="text-sm mt-8 transition-all duration-300 group" style={{
            color: '#ffffff',
            textShadow: '0 0 6px rgba(242, 127, 155, 0.5)'
          }} onMouseEnter={e => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.textShadow = '0 0 12px rgba(242, 127, 155, 0.8), 0 0 20px rgba(242, 127, 155, 0.4)';
            e.currentTarget.style.textDecoration = 'underline';
          }} onMouseLeave={e => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.textShadow = '0 0 6px rgba(242, 127, 155, 0.5)';
            e.currentTarget.style.textDecoration = 'none';
          }}>
              <span className="inline-flex items-center gap-2">
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
                Back to Home
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;