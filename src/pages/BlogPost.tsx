import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import AboutBackground from "@/components/AboutBackground";
import { parseMarkdownContent } from "@/utils/markdownParser";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Check for reduced motion preference
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
            textShadow: '0 0 15px hsl(var(--color-cyan) / 0.7)',
          }}
        >
          Loading post...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <h1 
            className="text-4xl font-rajdhani font-bold mb-4"
            style={{
              color: 'hsl(var(--color-pink))',
              textShadow: '0 0 20px hsl(var(--color-pink) / 0.8)',
            }}
          >
            Post Not Found
          </h1>
          <p 
            className="text-lg mb-6 font-ibm"
            style={{
              color: 'hsl(var(--color-light-text))',
            }}
          >
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-base font-montserrat font-bold transition-all duration-300"
            style={{
              color: 'hsl(var(--color-cyan))',
              textShadow: '0 0 15px hsl(var(--color-cyan) / 0.6)',
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
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Banner with Animated Background */}
      <section className="relative py-16 overflow-hidden">
        {/* AboutBackground for consistent dark gradient */}
        <AboutBackground />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating code snippets */}
          {!prefersReducedMotion && [...Array(8)].map((_, i) => (
            <div
              key={`snippet-${i}`}
              className="absolute text-xs font-mono opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: 'hsl(var(--color-cyan))',
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + i}s`,
              }}
            >
              {['{ AI }', '[Data]', '<Code/>', 'λ fn'][i % 4]}
            </div>
          ))}
          
          {/* Neural network nodes */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <radialGradient id="node-glow">
                <stop offset="0%" stopColor="hsl(var(--color-cyan))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--color-pink))" stopOpacity="0" />
              </radialGradient>
            </defs>
            {!prefersReducedMotion && [...Array(12)].map((_, i) => (
              <circle
                key={i}
                cx={`${(i * 8.33) + 10}%`}
                cy={`${30 + Math.sin(i) * 20}%`}
                r="4"
                fill="url(#node-glow)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>

        {/* Hero Content Container */}
        <div 
          className="max-w-5xl mx-auto px-6 relative z-10 text-center py-12 rounded-3xl backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--color-shadow) / 0.3) 0%, hsl(var(--color-violet) / 0.5) 100%)',
            border: '2px solid hsl(var(--color-cyan) / 0.3)',
            boxShadow: '0 0 40px hsl(var(--color-cyan) / 0.2), 0 0 80px hsl(var(--color-pink) / 0.1)',
          }}
        >
          {/* Title */}
          <h1 className="blog-h1 mb-4 animate-fade-in">
            {post.title}
          </h1>
          
          {/* Subtitle (if exists) */}
          {(post as any).subtitle && (
            <p className="blog-subtitle mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {(post as any).subtitle}
            </p>
          )}
          
          {/* Author */}
          <div className="blog-author mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            by {(post as any).author || 'Aimee Farabee'}
          </div>
          
          {/* Date with Icon */}
          <div 
            className="flex items-center justify-center gap-2 text-sm animate-fade-in"
            style={{ 
              color: 'hsl(var(--color-cyan) / 0.8)',
              textShadow: '0 0 8px hsl(var(--color-cyan) / 0.4)',
              animationDelay: '0.6s'
            }}
          >
            <Calendar size={16} />
            <span>
              {new Date(post.date_published).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="relative py-16">
        <div className="max-w-[740px] mx-auto px-6">
          {/* Excerpt (if exists) */}
          {post.excerpt && (
            <>
              <p className="blog-subtitle text-center mb-8">
                {post.excerpt}
              </p>
              <div className="blog-divider" />
            </>
          )}
          
          {/* Body Content with Markdown Support */}
          <div className="blog-body space-y-6">
            {parseMarkdownContent(post.body)}
          </div>
        </div>
      </article>

      {/* Footer Signature */}
      <section className="py-16">
        <div className="max-w-[740px] mx-auto px-6">
          {/* Cyan divider line */}
          <div className="blog-divider mb-8" />
          
          {/* Signature */}
          <div className="text-center mb-6">
            <p 
              className="text-2xl font-rajdhani font-semibold"
              style={{
                color: 'hsl(var(--color-cyan))',
                textShadow: '0 0 20px hsl(var(--color-cyan) / 0.6)',
              }}
            >
              AI with Aimee · Intelligence with a Twist
            </p>
          </div>
          
          {/* Back to Blog Link */}
          <div className="text-center mb-4">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-base font-montserrat font-bold transition-all duration-300"
              style={{
                color: 'hsl(var(--color-pink))',
                textShadow: '0 0 15px hsl(var(--color-pink) / 0.6)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'hsl(var(--color-cyan))';
                e.currentTarget.style.textShadow = '0 0 20px hsl(var(--color-cyan) / 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsl(var(--color-pink))';
                e.currentTarget.style.textShadow = '0 0 15px hsl(var(--color-pink) / 0.6)';
              }}
            >
              <ArrowLeft size={18} />
              Back to Blog
            </Link>
          </div>
          
          {/* Back to Home Link */}
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-montserrat transition-all duration-300"
              style={{
                color: 'hsl(var(--color-pink))',
                textShadow: '0 0 8px hsl(var(--color-pink) / 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 12px hsl(var(--color-pink) / 0.8), 0 0 20px hsl(var(--color-pink) / 0.4)';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px hsl(var(--color-pink) / 0.5)';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
