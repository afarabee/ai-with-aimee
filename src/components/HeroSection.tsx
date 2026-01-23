import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/ai-with-aimee-logo-transparent.png";
import NeuralNetworkBackground from "./NeuralNetworkBackground";
import SectionDivider from "./SectionDivider";
const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const phrases = ["AI Strategist", "AI Pragmatist", "AI Catalyst"];
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let timeout: NodeJS.Timeout;
    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
      timeout = setTimeout(() => {}, 500);
    } else {
      const timeoutDuration = isDeleting ? 50 : 100;
      timeout = setTimeout(() => {
        setDisplayText(isDeleting ? currentPhrase.substring(0, displayText.length - 1) : currentPhrase.substring(0, displayText.length + 1));
      }, timeoutDuration);
    }
    return () => clearTimeout(timeout);
  }, [displayText, currentPhraseIndex, isDeleting]);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };
  return <section id="home" className="min-h-screen flex items-center pt-20 pb-16 relative overflow-hidden">
      {/* Animated Neural Network Background */}
      <NeuralNetworkBackground />
      
      {/* Bottom fade-out gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{
      background: 'linear-gradient(to bottom, transparent, #0d061a)'
    }} />
      
      <div className="max-w-6xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img src={logoImage} alt="AI with Aimee Logo" className="w-full max-w-3xl drop-shadow-[0_0_60px_rgba(0,255,255,0.4)] scale-[1.375] opacity-0" style={{
            animation: 'fadeIn 0.5s ease-in forwards',
            animationDelay: '0.2s'
          }} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl mb-4 font-rajdhani font-semibold uppercase tracking-wide neon-text-cyan">
              <div>Product Leader Turned</div>
              <div className="typing-animation neon-text-yellow min-w-0 overflow-visible">{displayText}</div>
            </h1>
            
            <p className="text-xl md:text-3xl font-josefin italic mb-6 neon-text-pink">
              Turning AI curiosity into real-world capability—one product practitioner at a time.
            </p>
            
            <p className="text-base mb-8 font-ibm" style={{
            color: '#e6e6e6',
            lineHeight: '1.6em'
          }}>My mission is to build the next generation of AI-fluent product leaders. By combining product management discipline with AI fluency, I help teams move from strategy to implementation through clear frameworks, responsible governance, and practical tools. I believe AI works best when it's ethical, actionable, and designed to amplify human intelligence, not replace it.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => scrollToSection("projects")}
              className="btn-hero transition-transform duration-300"
            >
              <span>View Projects</span>
            </button>
            <button
              onClick={() => scrollToSection("blog")}
              className="btn-hero transition-transform duration-300"
            >
              <span>Read Blog</span>
            </button>
            </div>
            
            <Link to="/about" className="text-sm neon-text-cyan/80 hover:neon-text-cyan transition-all duration-300 flex items-center gap-2 group">
              Learn more about me 
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Section Divider */}
      <SectionDivider variant="wave" color="#0f0b1d" />
    </section>;
};
export default HeroSection;
