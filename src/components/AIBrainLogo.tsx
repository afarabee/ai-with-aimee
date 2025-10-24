const AIBrainLogo = () => {
  // Define nodes for feed-forward neural network (organic positioning)
  const layer1 = [
    { x: 20, y: 35 },
    { x: 20, y: 60 },
    { x: 20, y: 85 },
  ];
  
  const layer2 = [
    { x: 45, y: 25 },
    { x: 45, y: 50 },
    { x: 45, y: 65 },
    { x: 45, y: 90 },
  ];
  
  const layer3 = [
    { x: 70, y: 30 },
    { x: 70, y: 52 },
    { x: 70, y: 73 },
    { x: 70, y: 95 },
  ];
  
  const layer4 = [
    { x: 95, y: 45 },
    { x: 95, y: 70 },
  ];

  // Generate connections between layers
  const connections = [
    // Layer 1 to Layer 2
    ...layer1.flatMap((n1, i) => 
      layer2.map((n2, j) => ({ x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y, delay: i * 0.2 + j * 0.1 }))
    ),
    // Layer 2 to Layer 3
    ...layer2.flatMap((n2, i) => 
      layer3.map((n3, j) => ({ x1: n2.x, y1: n2.y, x2: n3.x, y2: n3.y, delay: i * 0.15 + j * 0.12 }))
    ),
    // Layer 3 to Layer 4
    ...layer3.flatMap((n3, i) => 
      layer4.map((n4, j) => ({ x1: n3.x, y1: n3.y, x2: n4.x, y2: n4.y, delay: i * 0.18 + j * 0.13 }))
    ),
  ];

  const allNodes = [...layer1, ...layer2, ...layer3, ...layer4];

  return (
    <div className="w-80 h-80 bg-gradient-to-br from-lavender-fog/40 via-rose-quartz/30 to-sage-gray/20 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/20 shadow-2xl">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          {/* Define drop shadow filters */}
          <defs>
            <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
              <feOffset dx="0" dy="1" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Draw connections */}
          {connections.map((conn, i) => (
            <line
              key={`conn-${i}`}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke="white"
              strokeWidth="1.5"
              opacity="0.5"
              filter="url(#lineShadow)"
            >
              <animate
                attributeName="opacity"
                values="0.4;0.7;0.4"
                dur="3s"
                begin={`${conn.delay}s`}
                repeatCount="indefinite"
              />
            </line>
          ))}
          
          {/* Draw nodes */}
          {allNodes.map((node, i) => (
            <circle
              key={`node-${i}`}
              cx={node.x}
              cy={node.y}
              r="5"
              fill="white"
              opacity="0.95"
              filter="url(#nodeShadow)"
            >
              <animate
                attributeName="r"
                values="5;6.5;5"
                dur="2.5s"
                begin={`${i * 0.15}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default AIBrainLogo;
