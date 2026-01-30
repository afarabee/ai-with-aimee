import { Download, Linkedin, Calendar, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RESUME_URL } from '@/constants/urls';

const ResumeHeader = () => {
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
    <header 
      className="text-center mb-16 p-10 rounded-3xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.15) 0%, rgba(245, 12, 160, 0.2) 50%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid rgba(245, 12, 160, 0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Gradient glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255, 140, 0, 0.1) 0%, transparent 50%)',
        }}
      />
      
      <h1 
        className="text-4xl md:text-6xl font-rajdhani font-bold mb-2 relative z-10"
        style={{
          background: 'linear-gradient(135deg, #ff8c00 0%, #f50ca0 50%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 40px rgba(245, 12, 160, 0.3)',
        }}
      >
        AIMEE FARABEE
      </h1>
      
      {/* Tagline */}
      <p 
        className="text-lg md:text-xl font-rajdhani font-semibold tracking-widest mb-4 relative z-10"
        style={{ color: 'hsl(var(--color-cyan))' }}
      >
        ⚡ AI SYSTEMS THAT ACTUALLY WORK
      </p>
      
      <h2 className="text-lg md:text-xl font-josefin text-foreground/90 mb-8 relative z-10">
        Enterprise AI and Product Executive
      </h2>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 relative z-10">
        <a 
          href="https://calendly.com" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            className="font-ibm"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.2) 0%, rgba(245, 12, 160, 0.2) 100%)',
              border: '1px solid rgba(255, 140, 0, 0.5)',
              color: 'rgb(255, 180, 100)',
            }}
          >
            <Calendar size={18} className="mr-2" />
            Book Time
          </Button>
        </a>
        
        <a href="/projects">
          <Button 
            className="font-ibm"
            style={{
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              color: 'rgb(192, 132, 252)',
            }}
          >
            <Briefcase size={18} className="mr-2" />
            Portfolio
          </Button>
        </a>
        
        <a 
          href="https://www.linkedin.com/in/aimee-farabee/"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            className="font-ibm"
            style={{
              background: 'rgba(0, 255, 255, 0.15)',
              border: '1px solid hsl(var(--color-cyan) / 0.5)',
              color: 'hsl(var(--color-cyan))',
            }}
          >
            <Linkedin size={18} className="mr-2" />
            LinkedIn
          </Button>
        </a>
        
        <Button 
          onClick={handleDownload}
          className="font-ibm"
          style={{
            background: 'rgba(245, 12, 160, 0.2)',
            border: '1px solid hsl(var(--color-pink) / 0.5)',
            color: 'hsl(var(--color-pink))',
          }}
        >
          <Download size={18} className="mr-2" />
          PDF
        </Button>
      </div>
    </header>
  );
};

export default ResumeHeader;
