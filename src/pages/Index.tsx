import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BlogSection />
      <ProjectsSection />
      
      {/* Dual CTA Buttons */}
      <div className="relative py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-3">
            <a 
              href="/blog"
              className="hero-button px-8 py-6 text-base font-montserrat flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer focus:ring-2 focus:ring-cyan-400/50 focus:outline-none text-white"
              style={{
                background: `linear-gradient(135deg, hsl(var(--clr-pink) / 0.2), hsl(var(--neon-purple) / 0.2))`,
                border: `2px solid hsl(var(--clr-pink))`,
                boxShadow: `0 0 15px hsl(var(--clr-pink) / 0.4)`,
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 0 20px hsl(var(--clr-pink) / 0.6), 0 0 30px hsl(var(--clr-pink) / 0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 0 15px hsl(var(--clr-pink) / 0.4)`;
              }}
            >
              View All Blog Posts →
            </a>
            <a 
              href="/projects"
              className="hero-button px-8 py-6 text-base font-montserrat flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer focus:ring-2 focus:ring-cyan-400/50 focus:outline-none text-white"
              style={{
                background: `linear-gradient(135deg, hsl(var(--clr-cyan) / 0.15), hsl(var(--neon-purple) / 0.2))`,
                border: `2px solid hsl(var(--clr-cyan))`,
                boxShadow: `0 0 15px hsl(var(--clr-cyan) / 0.4)`,
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 0 20px hsl(var(--clr-cyan) / 0.6), 0 0 30px hsl(var(--clr-cyan) / 0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 0 15px hsl(var(--clr-cyan) / 0.4)`;
              }}
            >
              View All Projects →
            </a>
          </div>
        </div>
      </div>
      
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
