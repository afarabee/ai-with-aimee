import { Zap } from 'lucide-react';
import GlowCard from '@/components/ui/glow-card';

const skillCategories = [
  {
    category: 'AI & Machine Learning',
    skills: ['Generative AI', 'LLM Integration', 'AI Governance', 'MLOps', 'Prompt Engineering'],
    color: 'cyan',
  },
  {
    category: 'Product Management',
    skills: ['Roadmap Strategy', 'Agile/Scrum', 'User Research', 'Data Analytics', 'Go-to-Market'],
    color: 'pink',
  },
  {
    category: 'Leadership',
    skills: ['Team Building', 'Cross-functional Leadership', 'Stakeholder Management', 'Executive Presentation'],
    color: 'orange',
  },
  {
    category: 'Technical',
    skills: ['API Design', 'Cloud Platforms', 'SQL/Data Modeling', 'System Architecture'],
    color: 'purple',
  },
];

const getSkillColor = (color: string) => {
  const colors: Record<string, { glowHex: string; border: string; text: string }> = {
    cyan: {
      glowHex: '#00ffff',
      border: 'hsl(var(--color-cyan) / 0.4)',
      text: 'hsl(var(--color-cyan))',
    },
    pink: {
      glowHex: '#f50ca0',
      border: 'hsl(var(--color-pink) / 0.4)',
      text: 'hsl(var(--color-pink))',
    },
    orange: {
      glowHex: '#ff8c00',
      border: 'rgba(255, 140, 0, 0.4)',
      text: 'rgb(255, 180, 100)',
    },
    purple: {
      glowHex: '#8b5cf6',
      border: 'rgba(139, 92, 246, 0.4)',
      text: 'rgb(192, 132, 252)',
    },
  };
  return colors[color] || colors.cyan;
};

const ResumeSkills = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Zap 
          size={28} 
          style={{ color: 'hsl(var(--color-cyan))' }}
        />
        <h3 
          className="text-2xl font-rajdhani font-semibold"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--color-cyan)) 0%, hsl(var(--color-yellow)) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Core Competencies
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillCategories.map((category, index) => {
          const colorStyles = getSkillColor(category.color);
          return (
            <GlowCard
              key={index}
              glowColor={colorStyles.glowHex}
              className="!p-0"
            >
              <h4 
                className="font-rajdhani font-semibold text-lg mb-3"
                style={{ color: colorStyles.text }}
              >
                {category.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, sIndex) => (
                  <span
                    key={sIndex}
                    className="px-3 py-1 rounded-full text-sm font-ibm"
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: `1px solid ${colorStyles.border}`,
                      color: 'hsl(var(--foreground) / 0.9)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlowCard>
          );
        })}
      </div>
    </section>
  );
};

export default ResumeSkills;
