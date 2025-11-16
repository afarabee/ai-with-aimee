import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, ArrowLeft, Github, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import AboutBackground from "@/components/AboutBackground";
import { parseMarkdownContent } from "@/utils/markdownParser";
import { format } from "date-fns";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Active')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="text-2xl font-rajdhani"
          style={{
            color: 'hsl(var(--color-cyan))',
            textShadow: '0 0 15px hsl(var(--color-cyan) / 0.7)'
          }}
        >
          Loading project...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <h1 
            className="text-4xl font-rajdhani font-bold mb-4"
            style={{
              color: 'hsl(var(--color-pink))',
              textShadow: '0 0 20px hsl(var(--color-pink) / 0.8)'
            }}
          >
            Project Not Found
          </h1>
          <p 
            className="text-lg mb-6 font-ibm"
            style={{ color: 'hsl(var(--color-light-text))' }}
          >
            The project you're looking for doesn't exist or is no longer available.
          </p>
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-base font-montserrat font-bold transition-all duration-300"
            style={{
              color: 'hsl(var(--color-cyan))',
              textShadow: '0 0 15px hsl(var(--color-cyan) / 0.6)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'hsl(var(--color-pink))';
              e.currentTarget.style.textShadow = '0 0 20px hsl(var(--color-pink) / 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'hsl(var(--color-cyan))';
              e.currentTarget.style.textShadow = '0 0 15px hsl(var(--color-cyan) / 0.6)';
            }}
          >
            <ArrowLeft size={18} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative pt-24 md:pt-32 pb-16 overflow-hidden min-h-[40vh]">
        <AboutBackground />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {!prefersReducedMotion && [...Array(8)].map((_, i) => (
            <div
              key={`snippet-${i}`}
              className="absolute text-xs font-mono opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: 'hsl(var(--color-cyan))',
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + i}s`
              }}
            >
              {['{ AI }', '[Data]', '<Code/>', 'λ fn'][i % 4]}
            </div>
          ))}
        </div>

        {/* Thumbnail Image */}
        {project.thumbnail && (
          <div className="relative max-w-5xl mx-auto px-6 mb-8">
            <img 
              src={project.thumbnail} 
              alt={project.project_title}
              className="w-full rounded-lg"
              style={{
                border: '2px solid hsl(var(--color-cyan) / 0.4)',
                boxShadow: '0 0 30px hsl(var(--color-cyan) / 0.3), 0 8px 20px hsl(var(--color-shadow) / 0.5)'
              }}
            />
          </div>
        )}

        {/* Header Content */}
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="blog-h1 mb-4">
            {project.project_title}
          </h1>
          
          {project.subtitle && (
            <p 
              className="text-xl md:text-2xl font-josefin italic mb-6"
              style={{
                color: 'hsl(var(--color-light-text))',
                textShadow: '0 0 10px hsl(var(--color-cyan) / 0.3)'
              }}
            >
              {project.subtitle}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-center gap-4 text-sm font-ibm mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: 'hsl(var(--color-cyan))' }} />
              <time style={{ color: 'hsl(var(--color-light-text))' }}>
                {format(new Date(project.date_published), 'MMMM d, yyyy')}
              </time>
            </div>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {project.technologies.map((tech: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-montserrat"
                  style={{
                    backgroundColor: 'hsl(var(--color-violet) / 0.3)',
                    border: '1px solid hsl(var(--color-cyan) / 0.4)',
                    color: 'hsl(var(--color-cyan))',
                    textShadow: '0 0 8px hsl(var(--color-cyan) / 0.5)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="flex items-center justify-center gap-4">
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: 'hsl(var(--color-violet) / 0.3)',
                  border: '1px solid hsl(var(--color-cyan) / 0.4)',
                  color: 'hsl(var(--color-cyan))'
                }}
              >
                <Github size={18} />
                View on GitHub
              </a>
            )}
            {project.project_page_link && (
              <a
                href={project.project_page_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: 'hsl(var(--color-pink) / 0.3)',
                  border: '1px solid hsl(var(--color-pink) / 0.4)',
                  color: 'hsl(var(--color-pink))'
                }}
              >
                <ExternalLink size={18} />
                View Demo
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Project Body */}
      <article className="relative py-16">
        <div className="absolute inset-0" style={{ background: 'hsl(var(--clr-bg-deep))' }} />
        
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="prose prose-invert max-w-none">
            {parseMarkdownContent(project.body)}
          </div>

          {/* Back to Projects Link */}
          <div className="mt-16 pt-8 border-t" style={{ borderColor: 'hsl(var(--color-cyan) / 0.2)' }}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-base font-montserrat font-bold transition-all duration-300"
              style={{
                color: 'hsl(var(--color-cyan))',
                textShadow: '0 0 15px hsl(var(--color-cyan) / 0.6)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'hsl(var(--color-pink))';
                e.currentTarget.style.textShadow = '0 0 20px hsl(var(--color-pink) / 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsl(var(--color-cyan))';
                e.currentTarget.style.textShadow = '0 0 15px hsl(var(--color-cyan) / 0.6)';
              }}
            >
              <ArrowLeft size={18} />
              Back to All Projects
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
