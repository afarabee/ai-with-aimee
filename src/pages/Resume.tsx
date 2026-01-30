import { Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { Button } from '@/components/ui/button';
import { RESUME_URL } from '@/constants/urls';
import ResumeHeader from '@/components/resume/ResumeHeader';
import ResumeSummary from '@/components/resume/ResumeSummary';
import ResumeAchievements from '@/components/resume/ResumeAchievements';
import ResumeExperience from '@/components/resume/ResumeExperience';
import ResumeEducation from '@/components/resume/ResumeEducation';
import ResumeSkills from '@/components/resume/ResumeSkills';

const Resume = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch(RESUME_URL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Aimee-Farabee-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(RESUME_URL, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NeuralNetworkBackground />
      <Navigation />
      
      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          <ResumeHeader />
          
          <ResumeSummary />
          
          <ResumeAchievements />
          
          {/* Neon Divider */}
          <div 
            className="h-[2px] w-full max-w-2xl mx-auto mb-12 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 140, 0, 0.6) 20%, rgba(245, 12, 160, 0.8) 50%, rgba(139, 92, 246, 0.6) 80%, transparent 100%)',
              boxShadow: '0 0 20px rgba(245, 12, 160, 0.4)',
            }}
          />
          
          <ResumeExperience />
          
          <ResumeEducation />
          
          <ResumeSkills />

          {/* Download CTA */}
          <div 
            className="text-center p-8 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.1) 0%, rgba(245, 12, 160, 0.15) 50%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(245, 12, 160, 0.2)',
            }}
          >
            <p className="text-lg text-foreground/90 font-ibm mb-6">
              Ready to discuss how AI can transform your organization?
            </p>
            <Button 
              onClick={handleDownload} 
              className="hero-button" 
              style={{ padding: '1.5rem 3rem' }}
            >
              <Download size={20} className="mr-2" />
              Download Complete Resume
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resume;
