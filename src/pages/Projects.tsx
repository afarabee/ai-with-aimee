import { useState, useEffect } from 'react';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import GlowCard from '@/components/ui/glow-card';
import { Button } from '@/components/ui/button';
import AboutBackground from '@/components/AboutBackground';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Projects = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  // Fetch projects from database
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'Active')
        .order('display_order', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Map database fields to component structure
  const projects = projectsData?.map(project => ({
    title: project.project_title,
    subtitle: project.subtitle,
    description: [
      `Challenge: ${project.challenge}`,
      `Solution: ${project.solution}`,
      `Impact: ${project.impact}`
    ],
    tags: project.technologies || [],
    links: {
      github: project.github_link || undefined,
      demo: project.project_page_link || undefined
    }
  })) || [];

  useEffect(() => {
    // Initialize visible cards state based on projects count
    setVisibleCards(new Array(projects.length).fill(false));
  }, [projects.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [projects.length]);

  return (
    <div className="min-h-screen relative bg-background">
      <AboutBackground />
      
      {/* Alternating dark overlay for visual contrast */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'rgba(0, 0, 0, 0.1)' }}
      />
      
      <Navigation />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-rajdhani font-semibold mb-4 neon-text-pink">
              Projects & Applied AI Work
            </h1>
            <p className="text-xl md:text-2xl font-josefin italic neon-text-cyan">
              Each project is a window into machines and minds collaborating.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              ))
            ) : projects.length > 0 ? projects.map((project, index) => (
              <div
                key={index}
                data-index={index}
                className={`project-card hover-lift transition-all duration-700 ${
                  visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <GlowCard 
                  style={{
                    borderRadius: '16px',
                    backgroundColor: 'rgba(25, 10, 40, 0.85)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(180, 242, 227, 0.4)',
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), 0 0 35px rgba(245, 12, 160, 0.2)',
                    padding: '24px'
                  }}
                >
                  {/* Project Title */}
                  <h3 className="text-2xl font-rajdhani font-semibold mb-2 neon-text-yellow">
                    {project.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-lg font-josefin italic mb-4 neon-text-pink">
                    {project.subtitle}
                  </p>

                  {/* Description bullets */}
                  <div className="space-y-2 mb-6">
                    {project.description.map((line, idx) => (
                      <p key={idx} className="font-ibm text-sm" style={{ color: '#e6e6e6', lineHeight: '1.4em' }}>
                        • {line}
                      </p>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded text-xs font-titillium font-semibold neon-text-cyan transition-all duration-300 hover:scale-110"
                        style={{ 
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(0, 255, 255, 0.3)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        aria-label="View on GitHub"
                        className="transition-all duration-300 hover:scale-110 neon-text-cyan"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        aria-label="View Demo"
                        className="transition-all duration-300 hover:scale-110 neon-text-cyan"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </GlowCard>
              </div>
            )) : (
              <div className="col-span-full text-center py-20">
                <p 
                  className="text-2xl font-josefin italic neon-text-cyan"
                >
                  Each shines a light on how machines and minds co-create.
                </p>
                <div 
                  className="w-32 h-1 mx-auto mt-4"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #f50ca0, transparent)',
                    boxShadow: '0 0 8px rgba(245, 12, 160, 0.5)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4">
            <Button className="hero-button px-8 py-6 text-base flex items-center gap-2">
              Explore My Prompt Library →
            </Button>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-16 mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-montserrat transition-all duration-300"
              style={{
                color: '#ffffff',
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
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
