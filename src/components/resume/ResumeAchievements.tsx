import { Award, Brain, Clock, Rocket, Shield, CreditCard, Zap } from 'lucide-react';
import GlowCard from '@/components/ui/glow-card';

const achievements = [
  {
    icon: Brain,
    title: 'SARA GenAI',
    description: '98% reduction in scientific reporting cycle time (3 hrs → 3 mins) at Charles River Labs',
    color: 'cyan',
  },
  {
    icon: Clock,
    title: 'Behavioral Health Platform',
    description: '97% reduction in behavioral health wait times (48 days → 1.5 days) through dedicated API platform',
    color: 'pink',
  },
  {
    icon: Rocket,
    title: '97-Day MVP Launch',
    description: 'Zero-to-one MVP integrating 5 vendors and coordinating 10+ internal teams',
    color: 'orange',
  },
  {
    icon: Shield,
    title: 'AI Governance Framework',
    description: '100+ AI use cases evaluated through enterprise governance framework with CIO-led AI Council',
    color: 'purple',
  },
  {
    icon: CreditCard,
    title: 'Walmart Bluebird',
    description: '575k+ accounts, $275M loads in 3 months at American Express',
    color: 'yellow',
  },
  {
    icon: Zap,
    title: 'Agentic AI Workflows',
    description: '80% reduction in user story creation time and 50% faster refinement cycles',
    color: 'cyan',
  },
];

const getColorStyles = (color: string) => {
  const colors: Record<string, { glowHex: string; text: string }> = {
    pink: {
      glowHex: '#f50ca0',
      text: 'hsl(var(--color-pink))',
    },
    orange: {
      glowHex: '#ff8c00',
      text: 'rgb(255, 180, 100)',
    },
    purple: {
      glowHex: '#a855f7',
      text: 'rgb(192, 132, 252)',
    },
    cyan: {
      glowHex: '#00ffff',
      text: 'hsl(var(--color-cyan))',
    },
    yellow: {
      glowHex: '#f9f940',
      text: 'hsl(var(--color-yellow))',
    },
  };
  return colors[color] || colors.cyan;
};

const ResumeAchievements = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Award 
          size={28} 
          style={{ color: 'rgb(255, 180, 100)' }}
        />
        <h3 
          className="text-2xl font-rajdhani font-semibold"
          style={{
            background: 'linear-gradient(135deg, #ff8c00 0%, #f50ca0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Key Achievements
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => {
          const styles = getColorStyles(achievement.color);
          return (
            <GlowCard
              key={index}
              glowColor={styles.glowHex}
              className="!p-0"
            >
              <div className="flex items-start gap-4">
                <achievement.icon 
                  size={24} 
                  className="flex-shrink-0 mt-1"
                  style={{ color: styles.text }}
                />
                <div>
                  <h4 
                    className="font-rajdhani font-semibold text-lg mb-1"
                    style={{ color: styles.text }}
                  >
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-muted-foreground font-ibm">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </section>
  );
};

export default ResumeAchievements;
