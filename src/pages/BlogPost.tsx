import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch blog post by slug
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });


  if (isLoading) {
    return (
      <div className="min-h-screen relative" style={{
        background: 'linear-gradient(to bottom, #1a0f1f 0%, #000000 100%)'
      }}>
        <Navigation />
        <main className="relative z-10 pt-32 pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            <p 
              className="text-xl"
              style={{
                color: '#b8f2e3',
                textShadow: '0 0 15px rgba(184, 242, 227, 0.7)'
              }}
            >
              Loading post...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen relative" style={{
        background: 'linear-gradient(to bottom, #1a0f1f 0%, #000000 100%)'
      }}>
        <Navigation />
        <main className="relative z-10 pt-32 pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            <h1 
              className="text-4xl font-rajdhani font-bold mb-4"
              style={{
                color: '#f50ca0',
                textShadow: '0 0 20px rgba(245, 12, 160, 0.8)'
              }}
            >
              Post Not Found
            </h1>
            <p 
              className="text-xl mb-8"
              style={{
                color: '#b8f2e3',
                textShadow: '0 0 15px rgba(184, 242, 227, 0.7)'
              }}
            >
              The blog post you're looking for doesn't exist.
            </p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 font-montserrat font-semibold transition-all duration-300"
              style={{
                color: '#b8f2e3',
                textShadow: '0 0 15px rgba(184, 242, 227, 0.7)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f50ca0';
                e.currentTarget.style.textShadow = '0 0 20px rgba(245, 12, 160, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#b8f2e3';
                e.currentTarget.style.textShadow = '0 0 15px rgba(184, 242, 227, 0.7)';
              }}
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(to bottom, #1a0f1f 0%, #000000 100%)'
    }}>
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Banner */}
        <section className="relative max-w-[900px] mx-auto px-10 mt-10 mb-10">
          {post.banner_image ? (
            <div 
              className="w-full aspect-video overflow-hidden"
              style={{
                borderRadius: '12px',
                border: '2px solid rgba(184, 242, 227, 0.6)',
                boxShadow: '0 0 25px rgba(184, 242, 227, 0.5)',
              }}
            >
              <img
                src={post.banner_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-full aspect-video flex items-center justify-center"
              style={{
                borderRadius: '12px',
                border: '2px solid rgba(184, 242, 227, 0.6)',
                boxShadow: '0 0 25px rgba(184, 242, 227, 0.5), inset 0 0 30px rgba(184, 242, 227, 0.2)',
                background: 'rgba(26, 15, 31, 0.6)',
              }}
            >
              <p 
                className="text-lg font-montserrat"
                style={{
                  color: '#b8f2e3',
                  textShadow: '0 0 20px rgba(184, 242, 227, 0.7)'
                }}
              >
                Banner image missing
              </p>
            </div>
          )}
        </section>

        {/* Article Content */}
        <article className="relative">
          <div className="max-w-[900px] mx-auto px-10" style={{ paddingTop: '40px' }}>
            {/* Title */}
            <h1 
              className="font-shadows text-center mb-6"
              style={{
                fontSize: '2.2rem',
                color: '#f50ca0',
                textShadow: '0 0 20px rgba(245, 12, 160, 0.8), 0 0 30px rgba(245, 12, 160, 0.4)',
                lineHeight: '1.2'
              }}
            >
              {post.title}
            </h1>

            {/* Glowing Divider */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-48 h-1 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, rgba(245, 12, 160, 0) 0%, rgba(245, 12, 160, 0.8) 25%, rgba(184, 242, 227, 0.8) 75%, rgba(184, 242, 227, 0) 100%)',
                  boxShadow: '0 0 20px rgba(245, 12, 160, 0.6), 0 0 30px rgba(184, 242, 227, 0.4)',
                }}
              />
            </div>

            {/* Meta Info */}
            <div 
              className="flex items-center justify-center gap-2 text-sm"
              style={{ 
                color: '#b8f2e3',
                marginBottom: '24px',
                textShadow: '0 0 10px rgba(184, 242, 227, 0.5)'
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

            {/* Excerpt */}
            <div style={{ marginBottom: '24px' }}>
              <p 
                className="text-lg font-josefin italic text-center leading-relaxed"
                style={{
                  color: '#b8f2e3',
                  textShadow: '0 0 15px rgba(184, 242, 227, 0.5)'
                }}
              >
                {post.excerpt}
              </p>
            </div>

            {/* Body Content */}
            <div 
              className="font-ibm text-base md:text-lg"
              style={{ 
                color: '#d8f5ef',
                lineHeight: '1.6'
              }}
            >
              {post.body.split('\n').map((paragraph: string, index: number) => (
                paragraph.trim() ? (
                  <p key={index} style={{ marginBottom: '24px', lineHeight: '1.6' }}>
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </div>
        </article>

        {/* Footer CTA */}
        <section className="py-16">
          <div className="max-w-[900px] mx-auto px-10">
            <div 
              className="text-center p-10 backdrop-blur-md"
              style={{
                borderRadius: '12px',
                background: 'rgba(26, 15, 31, 0.6)',
                border: '2px solid rgba(184, 242, 227, 0.4)',
                boxShadow: '0 0 25px rgba(184, 242, 227, 0.3)',
              }}
            >
              <p 
                className="text-xl md:text-2xl font-rajdhani font-semibold mb-6"
                style={{
                  color: '#b8f2e3',
                  textShadow: '0 0 20px rgba(184, 242, 227, 0.6)'
                }}
              >
                AI with Aimee — Intelligence with a Twist
              </p>
              <Link 
                to="/blog"
                className="inline-flex items-center gap-2 text-base font-montserrat font-bold transition-all duration-300"
                style={{
                  color: '#f50ca0',
                  textShadow: '0 0 20px rgba(245, 12, 160, 0.7)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#b8f2e3';
                  e.currentTarget.style.textShadow = '0 0 20px rgba(184, 242, 227, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#f50ca0';
                  e.currentTarget.style.textShadow = '0 0 20px rgba(245, 12, 160, 0.7)';
                }}
              >
                <ArrowLeft size={18} />
                Back to All Posts
              </Link>
            </div>

            {/* Back to Home Link */}
            <div className="text-center mt-8">
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
