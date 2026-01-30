import { Award, Brain, Clock, Rocket, Shield, CreditCard } from 'lucide-react';

const achievements = [
  {
    icon: Brain,
    title: 'SARA GenAI',
    description: '98% reduction in research time (3 mins) at Charles River Labs',
    color: 'cyan',
  },
  {
    icon: Clock,
    title: 'Behavioral Health Platform',
    description: '97% reduction in wait times (1.5 days) through dedicated API platform',
    color: 'pink',
  },
  {
    icon: Rocket,
    title: '97-Day MVP Launch',
    description: 'Rapid product development from concept to market',
    color: 'orange',
  },
  {
    icon: Shield,
    title: 'AI Governance',
    description: '100+ use cases governed with enterprise-grade compliance',
    color: 'purple',
  },
  {
    icon: CreditCard,
    title: 'Walmart Bluebird',
    description: '575k accounts opened through innovative fintech solution',
    color: 'yellow',
  },
];

const getColorStyles = (color: string) => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    pink: {
      bg: 'rgba(245, 12, 160, 0.1)',
      border: '1px solid hsl(var(--color-pink) / 0.4)',
      text: 'hsl(var(--color-pink))',
    },
    orange: {
      bg: 'rgba(255, 140, 0, 0.1)',
      border: '1px solid rgba(255, 140, 0, 0.4)',
      text: 'rgb(255, 180, 100)',
    },
    purple: {
      bg: 'rgba(168, 85, 247, 0.1)',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      text: 'rgb(192, 132, 252)',
    },
    cyan: {
      bg: 'rgba(0, 255, 255, 0.1)',
      border: '1px solid hsl(var(--color-cyan) / 0.4)',
      text: 'hsl(var(--color-cyan))',
    },
    yellow: {
      bg: 'rgba(249, 249, 64, 0.1)',
      border: '1px solid hsl(var(--color-yellow) / 0.4)',
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
            <div
              key={index}
              className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: styles.bg,
                border: styles.border,
                backdropFilter: 'blur(10px)',
              }}
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
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ResumeAchievements;
