import { GraduationCap, Award } from 'lucide-react';

const education = [
  {
    degree: 'MBA, Business Administration',
    school: 'University of Southern California – Marshall School of Business',
    year: '2012',
    honors: 'Dean\'s List',
  },
  {
    degree: 'BS, Computer Science',
    school: 'University of California, Los Angeles',
    year: '2008',
    honors: 'Magna Cum Laude',
  },
];

const certifications = [
  'Applied Generative AI Specialization – Coursera/DeepLearning.AI',
  'AI for Humanity – Certified Practitioner',
  'Certified Scrum Product Owner (CSPO)',
  'AWS Cloud Practitioner',
];

const ResumeEducation = () => {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Education */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap 
              size={28} 
              style={{ color: 'rgb(192, 132, 252)' }}
            />
            <h3 
              className="text-2xl font-rajdhani font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, hsl(var(--color-pink)) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Education
            </h3>
          </div>
          
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="p-5 rounded-xl"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h4 
                  className="text-lg font-rajdhani font-semibold mb-1"
                  style={{ color: 'rgb(192, 132, 252)' }}
                >
                  {edu.degree}
                </h4>
                <p className="text-foreground/90 font-ibm mb-1">
                  {edu.school}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span style={{ color: 'hsl(var(--color-cyan))' }}>{edu.year}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{edu.honors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Certifications */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Award 
              size={28} 
              style={{ color: 'hsl(var(--color-yellow))' }}
            />
            <h3 
              className="text-2xl font-rajdhani font-semibold"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--color-yellow)) 0%, rgb(255, 180, 100) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Certifications
            </h3>
          </div>
          
          <div
            className="p-5 rounded-xl"
            style={{
              background: 'rgba(249, 249, 64, 0.05)',
              border: '1px solid hsl(var(--color-yellow) / 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <ul className="space-y-3">
              {certifications.map((cert, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-3 text-foreground/90 font-ibm"
                >
                  <span 
                    className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'hsl(var(--color-yellow))' }}
                  />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeEducation;
