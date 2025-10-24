import { useState } from "react";
import { Mail, Linkedin, Github } from "lucide-react";
import { toast } from "sonner";
import GlowCard from "./ui/glow-card";
import SectionDivider from "./SectionDivider";
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you for your message! I'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };
  return <section id="contact" className="relative py-24 pb-32 bg-background" style={{ paddingTop: '100px' }}>
      {/* Bottom fade-out gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10" style={{
      background: 'linear-gradient(to bottom, transparent, #0d061a)'
    }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-rajdhani text-4xl md:text-5xl font-semibold neon-text-pink mb-8">Let's Connect</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <GlowCard as="a" href="mailto:genai-aims@gmail.com">
            <Mail className="w-8 h-8 neon-text-cyan mx-auto mb-4" />
            <h3 className="neon-text-cyan font-rajdhani font-semibold mb-2">Email</h3>
            <p className="font-ibm text-sm" style={{
            color: '#e6e6e6'
          }}>genai-aims@gmail.com</p>
          </GlowCard>
          
          <GlowCard as="a" href="https://linkedin.com/in/aimeefarabee" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-8 h-8 neon-text-pink mx-auto mb-4" />
            <h3 className="neon-text-pink font-rajdhani font-semibold mb-2">LinkedIn</h3>
            <p className="font-ibm text-sm text-center" style={{
            color: '#e6e6e6'
          }}>linkedin.com/in/aimeefarabee</p>
          </GlowCard>
          
          <GlowCard as="a" href="https://github.com/afarabee" target="_blank" rel="noopener noreferrer">
            <Github className="w-8 h-8 neon-text-cyan mx-auto mb-4" />
            <h3 className="neon-text-cyan font-rajdhani font-semibold mb-2">GitHub</h3>
            <p className="font-ibm text-sm" style={{
            color: '#e6e6e6'
          }}>github.com/afarabee</p>
          </GlowCard>
        </div>
        
        <GlowCard>
          <h3 className="text-2xl font-rajdhani font-semibold neon-text-yellow mb-6">Send me a message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="w-full px-4 py-3 rounded bg-muted/50 text-white/80 placeholder-cyan-500/50 border border-cyan-500/30 focus:shadow-[0_0_20px_rgba(0,255,255,0.6)] focus:outline-none transition-all" />
              <input type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} className="w-full px-4 py-3 rounded bg-muted/50 text-white/80 placeholder-cyan-500/50 border border-cyan-500/30 focus:shadow-[0_0_20px_rgba(0,255,255,0.6)] focus:outline-none transition-all" />
            </div>
            <textarea placeholder="Your Message" rows={4} value={formData.message} onChange={e => setFormData({
            ...formData,
            message: e.target.value
          })} className="w-full px-4 py-3 rounded bg-muted/50 text-white/80 placeholder-cyan-500/50 border border-cyan-500/30 focus:shadow-[0_0_20px_rgba(0,255,255,0.6)] focus:outline-none resize-none transition-all"></textarea>
            <button type="submit" disabled={isSubmitting} className="hero-button px-8 py-3 disabled:opacity-50">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </GlowCard>
      </div>

      {/* Section Divider */}
      <SectionDivider variant="curve" color="#0d061a" flip />
    </section>;
};
export default ContactSection;