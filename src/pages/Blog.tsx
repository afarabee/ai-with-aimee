import { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AboutBackground from '@/components/AboutBackground';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface CardSpotlight {
  x: number;
  y: number;
  isHovered: boolean;
}

const Blog = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [cardSpotlights, setCardSpotlights] = useState<Map<string, CardSpotlight>>(new Map());

  // Fetch blogs from Supabase
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date_published', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Infinite scroll handler
  const handleLoadMore = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && blogPosts && displayCount < blogPosts.length) {
      setDisplayCount(prev => Math.min(prev + 3, blogPosts.length));
    }
  }, [blogPosts, displayCount]);

  // Card visibility observer
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

    const cards = document.querySelectorAll('.blog-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [blogPosts, displayCount]);

  // Spotlight effect handlers
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLElement>, cardId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCardSpotlights(prev => new Map(prev).set(cardId, { x, y, isHovered: true }));
  }, []);

  const handleCardMouseEnter = useCallback((cardId: string) => {
    setCardSpotlights(prev => new Map(prev).set(cardId, { x: 0, y: 0, isHovered: true }));
  }, []);

  const handleCardMouseLeave = useCallback((cardId: string) => {
    setCardSpotlights(prev => {
      const newMap = new Map(prev);
      newMap.delete(cardId);
      return newMap;
    });
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleLoadMore, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore]);

  const displayedPosts = blogPosts?.slice(0, displayCount) || [];

  return (
    <div className="min-h-screen relative bg-background">
      <AboutBackground />
      
      {/* Dark overlay for visual contrast */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'rgba(0, 0, 0, 0.1)' }}
      />
      
      <Navigation />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-rajdhani font-bold mb-4 neon-text-pink">
              Insights & Stories
            </h1>
            <p className="text-xl md:text-2xl font-josefin neon-text-cyan">
              Reflections on AI, Product, and Practical Know-How.
            </p>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-xl neon-text-cyan">Loading posts...</p>
            </div>
          ) : displayedPosts && displayedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {displayedPosts.map((post, index) => {
                  const wordCount = post.body?.split(' ').length || 0;
                  const readTime = Math.ceil(wordCount / 200);
                  const cardId = `blog-card-${post.id}`;
                  const spotlight = cardSpotlights.get(cardId);
                  const isHovered = spotlight?.isHovered || false;
                  
                  return (
                    <article
                      key={post.id}
                      data-index={index}
                      className={`blog-card group relative transition-all duration-700 ${
                        visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      } ${isHovered ? 'scale-[1.03]' : 'scale-100'}`}
                      style={{
                        borderRadius: '16px',
                        background: 'rgba(25, 10, 40, 0.85)',
                        backdropFilter: 'blur(4px)',
                        border: isHovered 
                          ? '1px solid rgba(57, 225, 227, 0.6)' 
                          : '1px solid rgba(180, 242, 227, 0.3)',
                        boxShadow: isHovered
                          ? '0 0 25px rgba(57, 225, 227, 0.7), 0 0 50px rgba(57, 225, 227, 0.4)'
                          : '0 0 20px rgba(0, 255, 255, 0.3), 0 0 35px rgba(245, 12, 160, 0.2)',
                        overflow: 'hidden',
                        transition: 'all 0.4s ease-out'
                      }}
                      onMouseMove={(e) => handleCardMouseMove(e, cardId)}
                      onMouseEnter={() => handleCardMouseEnter(cardId)}
                      onMouseLeave={() => handleCardMouseLeave(cardId)}
                    >
                      {/* Spotlight overlay */}
                      {isHovered && spotlight && (
                        <div
                          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(500px circle at ${spotlight.x}px ${spotlight.y}px, rgba(57, 225, 227, 0.35), transparent 40%)`,
                            mixBlendMode: 'soft-light',
                            opacity: 1
                          }}
                        />
                      )}
                      
                      {/* Mobile static glow */}
                      <div
                        className="absolute inset-0 pointer-events-none md:hidden"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(57, 225, 227, 0.2), transparent 70%)',
                          mixBlendMode: 'soft-light'
                        }}
                      />
                      {/* Thumbnail - 16:9 Aspect Ratio */}
                      <a href={`/blog/${post.slug}`} className="block">
                        <div className="w-full aspect-video overflow-hidden relative">
                          <img
                            src={post.banner_image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop'}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                      </a>

                      {/* Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h2 className="text-2xl font-rajdhani font-bold mb-3 neon-text-pink group-hover:neon-text-yellow transition-all duration-300">
                          <a href={`/blog/${post.slug}`}>
                            {post.title}
                          </a>
                        </h2>

                        {/* Excerpt */}
                        <p className="font-ibm text-sm mb-4 leading-relaxed neon-text-cyan line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: '#b4f2e3' }}>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.date_published).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {readTime} min read
                          </span>
                        </div>

                        {/* Read Link */}
                        <a
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 font-montserrat font-bold text-sm neon-text-pink hover:neon-text-cyan transition-all duration-300 group-hover:gap-3"
                        >
                          Read →
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Load More Button */}
              {displayCount < (blogPosts?.length || 0) && (
                <div className="text-center">
                  <button
                    onClick={() => setDisplayCount(prev => Math.min(prev + 6, blogPosts.length))}
                    className="hero-button px-10 py-4 text-base font-montserrat font-bold transition-all duration-300 focus:ring-2 focus:ring-pink-400/50 focus:outline-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(245, 12, 160, 0.2), rgba(155, 81, 224, 0.2))',
                      border: '2px solid #f50ca0',
                      color: '#f50ca0',
                      textShadow: '0 0 10px rgba(245, 12, 160, 0.8)',
                      boxShadow: '0 0 20px rgba(245, 12, 160, 0.4)'
                    }}
                  >
                    Load More Posts →
                  </button>
                </div>
              )}

              {/* Hidden infinite scroll trigger */}
              <div ref={loadMoreRef} className="h-1" />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl neon-text-cyan mb-4">No blog posts yet.</p>
              <p className="neon-text-pink">Check back soon for new content!</p>
            </div>
          )}

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

export default Blog;
