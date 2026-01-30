import { Download, Linkedin, Calendar, Briefcase, Award, Brain, Clock, Rocket, Shield, CreditCard } from 'lucide-react';
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

  const achievements = [
    {
      icon: Brain,
      title: 'SARA GenAI',
      description: '98% reduction in research time (3 mins) at Charles River Labs',
      color: 'cyan',
    },
    {
      icon: Clock,
      title: 'Behavioral Health Platform',
      description: '97% reduction in wait times (1.5 days) through dedicated API platform',
      color: 'pink',
    },
    {
      icon: Rocket,
      title: '97-Day MVP Launch',
      description: 'Rapid product development from concept to market',
      color: 'orange',
    },
    {
      icon: Shield,
      title: 'AI Governance',
      description: '100+ use cases governed with enterprise-grade compliance',
      color: 'purple',
    },
    {
      icon: CreditCard,
      title: 'Walmart Bluebird',
      description: '575k accounts opened through innovative fintech solution',
      color: 'yellow',
    },
  ];

  const getColorStyles = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      pink: {
        bg: 'rgba(245, 12, 160, 0.1)',
        border: '1px solid hsl(var(--color-pink) / 0.4)',
        text: 'hsl(var(--color-pink))',
      },
      orange: {
        bg: 'rgba(255, 140, 0, 0.1)',
        border: '1px solid rgba(255, 140, 0, 0.4)',
        text: 'rgb(255, 180, 100)',
      },
      purple: {
        bg: 'rgba(168, 85, 247, 0.1)',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        text: 'rgb(192, 132, 252)',
      },
      cyan: {
        bg: 'rgba(0, 255, 255, 0.1)',
        border: '1px solid hsl(var(--color-cyan) / 0.4)',
        text: 'hsl(var(--color-cyan))',
      },
      yellow: {
        bg: 'rgba(249, 249, 64, 0.1)',
        border: '1px solid hsl(var(--color-yellow) / 0.4)',
        text: 'hsl(var(--color-yellow))',
      },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NeuralNetworkBackground />
      <Navigation />
      
      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section with Gradient */}
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
              className="text-4xl md:text-6xl font-rajdhani font-bold mb-4 relative z-10"
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
              
              <a 
                href="/projects" 
              >
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

          {/* Key Achievements Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Award 
                size={28} 
                style={{ color: 'rgb(255, 180, 100)' }}
              />
              <h3 
                className="text-2xl font-rajdhani font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #ff8c00 0%, #f50ca0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Key Achievements
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const styles = getColorStyles(achievement.color);
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: styles.bg,
                      border: styles.border,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <achievement.icon 
                        size={24} 
                        className="flex-shrink-0 mt-1"
                        style={{ color: styles.text }}
                      />
                      <div>
                        <h4 
                          className="font-rajdhani font-semibold text-lg mb-1"
                          style={{ color: styles.text }}
                        >
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-muted-foreground font-ibm">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Neon Divider */}
          <div 
            className="h-[2px] w-full max-w-2xl mx-auto mb-16 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 140, 0, 0.6) 20%, rgba(245, 12, 160, 0.8) 50%, rgba(139, 92, 246, 0.6) 80%, transparent 100%)',
              boxShadow: '0 0 20px rgba(245, 12, 160, 0.4)',
            }}
          />

          {/* Download CTA */}
          <div className="text-center">
            <p className="text-muted-foreground font-ibm mb-6">
              View my complete professional background and experience
            </p>
            <Button 
              onClick={handleDownload} 
              className="hero-button" 
              style={{ padding: '1.5rem 3rem' }}
            >
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
