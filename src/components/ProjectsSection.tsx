import { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import GlowCard from './ui/glow-card';
import SectionDivider from './SectionDivider';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectsSection = () => {
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
    <section id="projects" className="relative min-h-screen" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      {/* Background - same as About page */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, hsl(var(--clr-bg-dark)) 0%, hsl(var(--clr-bg-deep)) 100%)`
          }}
        />
        
        {/* Cyan-to-Violet gradient overlay at top */}
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(112, 94, 99, 0.2), transparent)',
          }}
        />
        
        {/* Lighter, slower floating particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? `hsl(var(--clr-cyan))` : `hsl(var(--clr-pink))`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${15 + Math.random() * 25}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom fade-out gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, transparent, hsl(var(--clr-bg-deep)))`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-rajdhani font-semibold mb-4 neon-text-yellow">
            Projects & Applied AI Work
          </h1>
          <p className="text-xl md:text-2xl font-josefin italic neon-text-pink">
            Each shines a light on how machines and minds can co-create.
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
              className={`project-card transition-all ease-in-out ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDuration: '0.5s' }}
            >
              <GlowCard>
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
                    <p key={idx} className="font-ibm text-sm" style={{ color: 'hsl(var(--clr-text-light))', lineHeight: '1.5em' }}>
                      • {line}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded text-xs font-titillium font-semibold neon-text-cyan hover:neon-text-pink"
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid hsl(var(--clr-cyan) / 0.3)`,
                        transition: 'var(--transition-smooth)'
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
                      className="neon-text-cyan hover:neon-text-pink"
                      style={{ transition: 'var(--transition-smooth)' }}
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      aria-label="View Demo"
                      className="neon-text-cyan hover:neon-text-pink"
                      style={{ transition: 'var(--transition-smooth)' }}
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </GlowCard>
            </div>
          )) : (
            <div className="col-span-full text-center py-20">
              <p className="text-2xl font-josefin italic neon-text-cyan">
                Each shines a light on how machines and minds co-create.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>

      {/* Section Divider */}
      <SectionDivider variant="angle" color="#0d061a" />
    </section>
  );
};

export default ProjectsSection;
