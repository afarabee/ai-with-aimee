import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import GlowCard from "./ui/glow-card";
import ScrollIndicator from "./ScrollIndicator";
import SectionDivider from "./SectionDivider";

const BlogSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasEntered) {
            setIsVisible(true);
            setHasEntered(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasEntered]);

  useEffect(() => {
    if (!isVisible) return;

    // Start rotation after 0.5s delay
    const initialDelay = setTimeout(() => {
      rotationTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % 5);
      }, 5000);
    }, 500);

    return () => {
      clearTimeout(initialDelay);
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }
    };
  }, [isVisible]);

  const handlePrevious = () => {
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
    }
    setActiveIndex((prev) => (prev - 1 + 5) % 5);
    rotationTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 5000);
  };

  const handleNext = () => {
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
    }
    setActiveIndex((prev) => (prev + 1) % 5);
    rotationTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 5000);
  };
  const blogPosts = [
    {
      id: 1,
      date: "March 15, 2024",
      title: "My AI Journey",
      description: "Reflecting on the challenges, breakthroughs, and resources that helped me get started with ML. From linear regression to neural networks - here's what I learned.",
      readTime: "5 min read",
      slug: "my-ai-journey",
    },
    {
      id: 2,
      date: "March 8, 2024",
      title: "Agents Aren't Always the Answer",
      description: "Why AI agents aren't always the solution you need. Exploring when to use agents and when simpler approaches work better.",
      readTime: "6 min read",
      slug: "agents-arent-the-answer",
    },
    {
      id: 3,
      date: "March 8, 2024",
      title: "Prompting for PMs",
      description: "How my background in product strategy actually gave me advantages in understanding AI systems, and what skills transferred over.",
      readTime: "7 min read",
      slug: "prompting-for-pms",
    },
    {
      id: 4,
      date: "February 28, 2024",
      title: "Case Study: Rolling out AI @ CRL",
      description: "Step-by-step walkthrough of creating a simple neural network from scratch. The mistakes I made and how I debugged them.",
      readTime: "10 min read",
      slug: "rolling-out-ai-at-crl",
    },
  ];

  return (
    <>
      <section
        ref={sectionRef}
        id="blog"
        className="blog-carousel-wrapper relative bg-background overflow-hidden"
        style={{ paddingTop: '100px', paddingBottom: '100px' }}
      >
        {/* Cyan-to-Violet gradient overlay at top */}
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(112, 94, 99, 0.3), transparent)',
          }}
        />

        {/* Circular platform glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] pointer-events-none z-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse, rgba(0, 255, 255, 0.35), transparent)',
            filter: 'blur(60px)',
          }}
        />

        {/* Bottom fade-out gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(112, 94, 99, 0.2))',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10 carousel-container">
          <h2 className="font-rajdhani text-4xl md:text-5xl font-semibold text-center neon-text-pink mb-12">
            Latest Blog Posts
          </h2>

          {/* Carousel Section */}
          <div className="blog-carousel-section">
            {/* 3D Carousel Container */}
            <div
              className="relative carousel-container"
              style={{ perspective: '1200px', minHeight: '500px', paddingBottom: '0', marginBottom: '0' }}
            >
              {/* Pink radial spotlight behind active card */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-0 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 12, 160, 0.2) 0%, transparent 70%)',
                  opacity: isVisible ? 1 : 0,
                }}
              />
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Carousel Cards */}
                <div className="relative w-full max-w-2xl mx-auto" style={{ transformStyle: 'preserve-3d' }}>
                  {blogPosts.map((post, index) => {
                    const isActive = index === activeIndex;
                    const offset = (index - activeIndex + 5) % 5;

                    // Calculate 3D position
                    let transform = '';
                    let opacity = 0;
                    let zIndex = 0;

                    if (offset === 0) {
                      // Active card - center front with strong spotlight
                      transform = 'translateX(0) translateZ(30px) scale(1.1) rotateY(0deg)';
                      opacity = isVisible ? 1 : 0;
                      zIndex = 2;
                    } else if (offset === 1) {
                      // Next card - slightly right, dimmed
                      transform = 'translateX(60%) translateZ(-50px) scale(0.9) rotateY(-15deg)';
                      opacity = isVisible ? 0.6 : 0;
                      zIndex = 1;
                    } else if (offset === 3) {
                      // Previous card - slightly left, dimmed
                      transform = 'translateX(-60%) translateZ(-50px) scale(0.9) rotateY(15deg)';
                      opacity = isVisible ? 0.6 : 0;
                      zIndex = 1;
                    } else {
                      // Hidden cards
                      transform = 'translateX(0) translateZ(-100px) scale(0.7)';
                      opacity = 0;
                      zIndex = 0;
                    }

                    const content = (
                      <Link 
                        to={`/blog/${post.slug}`} 
                        style={{ textDecoration: 'none' }}
                        tabIndex={isActive ? 0 : -1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && isActive) {
                            e.currentTarget.click();
                          }
                        }}
                      >
                        <div style={{ padding: '20px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          <div
                            className="neon-text-yellow text-sm mb-2 font-titillium font-semibold"
                            style={{ lineHeight: '1.4' }}
                          >
                            {post.date}
                          </div>
                          <h3
                            className="text-2xl font-rajdhani font-semibold neon-text-cyan mb-4"
                            style={{ lineHeight: '1.4', whiteSpace: 'normal', wordWrap: 'break-word' }}
                          >
                            {post.title}
                          </h3>
                          <p
                            className="font-ibm text-sm mb-4"
                            style={{ color: '#e6e6e6', lineHeight: '1.4', whiteSpace: 'normal', wordWrap: 'break-word' }}
                          >
                            {post.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="neon-text-yellow text-sm font-titillium">{post.readTime}</span>
                            <span className="neon-text-pink hover:neon-text-cyan font-montserrat font-medium flex items-center gap-1 transition-colors">
                              Read More <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );

                    return (
                      <div
                        key={post.id}
                        className="absolute top-0 left-0 w-full ease-in-out"
                        style={{
                          transform,
                          opacity,
                          zIndex,
                          transformStyle: 'preserve-3d',
                          filter: isActive ? 'brightness(1)' : 'brightness(0.7) blur(1px)',
                          pointerEvents: isActive ? 'auto' : 'none',
                          transition: 'all 1s ease-in-out',
                        }}
                      >
                        <GlowCard
                          className="block"
                          style={{
                            backgroundColor: isActive ? 'rgba(25, 10, 40, 0.9)' : 'rgba(25, 10, 40, 0.75)',
                            backdropFilter: isActive ? 'blur(4px)' : 'none',
                            boxShadow: isActive
                              ? '0 0 25px #f27f9b, 0 0 40px #b8f2e3'
                              : '0 0 10px rgba(0, 255, 255, 0.2)',
                            border: isActive ? '1px solid rgba(180, 242, 227, 0.5)' : '1px solid rgba(0, 255, 255, 0.1)',
                          }}
                        >
                          {content}
                        </GlowCard>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 md:left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(15, 11, 29, 0.8)',
                    border: '2px solid rgba(0, 255, 255, 0.5)',
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(242, 127, 155, 0.8)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(242, 127, 155, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                  }}
                >
                  <ChevronLeft className="w-6 h-6 neon-text-cyan" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-0 md:right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(15, 11, 29, 0.8)',
                    border: '2px solid rgba(0, 255, 255, 0.5)',
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(242, 127, 155, 0.8)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(242, 127, 155, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                  }}
                >
                  <ChevronRight className="w-6 h-6 neon-text-cyan" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Background wrapper to ensure it's under the button */}
        <div className="wave-background">
          <SectionDivider variant="wave" color="#0d061a" />
        </div>
      </section>
    </>
  );
};

export default BlogSection;
