interface SectionDividerProps {
  variant?: 'wave' | 'angle' | 'curve';
  flip?: boolean;
  color?: string;
}

const SectionDivider = ({ variant = 'wave', flip = false, color = '#0d061a' }: SectionDividerProps) => {
  const renderPath = () => {
    switch (variant) {
      case 'angle':
        return 'M0,0 L100,100 L0,100 Z';
      case 'curve':
        return 'M0,50 Q50,0 100,50 L100,100 L0,100 Z';
      case 'wave':
      default:
        return 'M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z';
    }
  };

  return (
    <div 
      className="absolute left-0 right-0 w-full overflow-hidden pointer-events-none z-20"
      style={{
        bottom: 0,
        height: '80px',
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d={renderPath()}
          fill={color}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
