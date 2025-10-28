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
              className="btn-hero pink px-8 py-6 text-base font-montserrat flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer focus:ring-2 focus:ring-pink-400/50 focus:outline-none"
            >
              View All Blog Posts →
            </a>
            <a 
              href="/projects"
              className="btn-hero px-8 py-6 text-base font-montserrat flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
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
