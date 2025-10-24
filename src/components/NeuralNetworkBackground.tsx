import { useEffect, useRef } from "react";
import Delaunator from "delaunator";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulseIntensity: number;
  pulseTarget: number;
  nextDirectionChange: number;
  flashIntensity: number;
  nextFlashTime: number;
}

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create nodes in a more uniform distribution
    const nodeCount = 50;
    const nodes: Node[] = [];
    
    // Create grid-based layout with randomization for organic feel
    const cols = Math.ceil(Math.sqrt(nodeCount * (canvas.width / canvas.height)));
    const rows = Math.ceil(nodeCount / cols);
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;
    
    for (let i = 0; i < nodeCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const baseX = (col + 0.5) * cellWidth;
      const baseY = (row + 0.5) * cellHeight;
      
      // Add randomization within cell
      const randomOffset = Math.min(cellWidth, cellHeight) * 0.4;
      
      nodes.push({
        x: baseX + (Math.random() - 0.5) * randomOffset,
        y: baseY + (Math.random() - 0.5) * randomOffset,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        pulseIntensity: 0,
        pulseTarget: 0,
        nextDirectionChange: Math.random() * 300 + 200,
        flashIntensity: 0,
        nextFlashTime: Math.random() * 1000 + 500,
      });
    }

    let triangulation: Delaunator<number[]> | null = null;
    let frameCount = 0;
    let lastPulseTime = 0;
    let pulsingNodes = new Set<number>();

    const recalculateTriangulation = () => {
      const points = nodes.map(node => [node.x, node.y]);
      triangulation = new Delaunator(points.flat());
    };

    recalculateTriangulation();

    const triggerPulse = (nodeIndex: number) => {
      if (pulsingNodes.size >= 2) return; // Limit simultaneous pulses
      
      nodes[nodeIndex].pulseTarget = 1;
      pulsingNodes.add(nodeIndex);
      
      // Propagate to adjacent nodes after delay
      setTimeout(() => {
        if (!triangulation) return;
        
        const adjacentNodes = new Set<number>();
        for (let i = 0; i < triangulation.triangles.length; i++) {
          if (triangulation.triangles[i] === nodeIndex) {
            const nextIndex = (i % 3 === 2) ? i - 2 : i + 1;
            const prevIndex = (i % 3 === 0) ? i + 2 : i - 1;
            adjacentNodes.add(triangulation.triangles[nextIndex]);
            adjacentNodes.add(triangulation.triangles[prevIndex]);
          }
        }
        
        adjacentNodes.forEach(adjIndex => {
          if (adjIndex !== nodeIndex && pulsingNodes.size < 3) {
            nodes[adjIndex].pulseTarget = 0.5;
            pulsingNodes.add(adjIndex);
          }
        });
      }, 200);
    };

    const animate = () => {
      ctx.fillStyle = "rgba(10, 0, 20, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "rgba(10, 0, 20, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frameCount++;

      // Recalculate triangulation every 15 frames
      if (frameCount % 15 === 0) {
        recalculateTriangulation();
      }

      // Trigger random pulse every 5-8 seconds
      const now = Date.now();
      if (now - lastPulseTime > (5000 + Math.random() * 3000) && pulsingNodes.size < 2) {
        const randomNode = Math.floor(Math.random() * nodes.length);
        triggerPulse(randomNode);
        lastPulseTime = now;
      }

      // Update nodes
      nodes.forEach((node, index) => {
        // Slow omnidirectional drift
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Random direction changes
        node.nextDirectionChange--;
        if (node.nextDirectionChange <= 0) {
          node.vx += (Math.random() - 0.5) * 0.0625;
          node.vy += (Math.random() - 0.5) * 0.0625;
          
          // Clamp speed
          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          if (speed > 0.1875) {
            node.vx = (node.vx / speed) * 0.1875;
            node.vy = (node.vy / speed) * 0.1875;
          }
          
          node.nextDirectionChange = Math.random() * 300 + 200;
        }
        
        // Random yellow flashes
        node.nextFlashTime -= 16; // ~60fps frame time
        if (node.nextFlashTime <= 0 && Math.random() < 0.008) {
          node.flashIntensity = 1;
          node.nextFlashTime = Math.random() * 5000 + 2500;
        }
        
        // Fade flash
        if (node.flashIntensity > 0) {
          node.flashIntensity -= 0.032;
          if (node.flashIntensity < 0) node.flashIntensity = 0;
        }
        
        // Update pulse
        const pulseSpeed = 0.02;
        if (node.pulseIntensity < node.pulseTarget) {
          node.pulseIntensity += pulseSpeed;
          if (node.pulseIntensity >= node.pulseTarget) {
            node.pulseIntensity = node.pulseTarget;
          }
        } else if (node.pulseIntensity > node.pulseTarget) {
          node.pulseIntensity -= pulseSpeed * 0.5;
          if (node.pulseIntensity <= 0.05) {
            node.pulseIntensity = 0;
            node.pulseTarget = 0;
            pulsingNodes.delete(index);
          }
        }
      });

      // Draw triangular connections
      if (triangulation) {
        const triangles = triangulation.triangles;
        
        for (let i = 0; i < triangles.length; i += 3) {
          const p1 = nodes[triangles[i]];
          const p2 = nodes[triangles[i + 1]];
          const p3 = nodes[triangles[i + 2]];
          
          if (!p1 || !p2 || !p3) continue;
          
          // Calculate center for logo proximity
          const centerX = (p1.x + p2.x + p3.x) / 3;
          const centerY = (p1.y + p2.y + p3.y) / 3;
          const logoX = canvas.width * 0.25;
          const logoY = canvas.height * 0.5;
          const distFromLogo = Math.sqrt(Math.pow(centerX - logoX, 2) + Math.pow(centerY - logoY, 2));
          const logoProximity = Math.max(0, 1 - distFromLogo / (canvas.width * 0.3));
          const dimFactor = 1 - (logoProximity * 0.2);
          
          // Average pulse intensity for this triangle
          const avgPulse = (p1.pulseIntensity + p2.pulseIntensity + p3.pulseIntensity) / 3;
          
          // Draw three edges of the triangle
          const drawEdge = (n1: Node, n2: Node) => {
          // Increased brightness by 60%
          const usePink = Math.random() < 0.6;
          const color = usePink ? '255, 79, 174' : '0, 255, 255';
          const baseOpacity = usePink ? 0.084 : 0.1008;
          const pulseBoost = avgPulse * 0.1344;
          const finalOpacity = (baseOpacity + pulseBoost) * dimFactor;
            
            ctx.strokeStyle = `rgba(${color}, ${finalOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          };
          
          drawEdge(p1, p2);
          drawEdge(p2, p3);
          drawEdge(p3, p1);
        }
      }

      // Draw nodes (mostly invisible, visible during pulses)
      nodes.forEach((node) => {
        const logoX = canvas.width * 0.25;
        const logoY = canvas.height * 0.5;
        const distFromLogo = Math.sqrt(Math.pow(node.x - logoX, 2) + Math.pow(node.y - logoY, 2));
        const logoProximity = Math.max(0, 1 - distFromLogo / (canvas.width * 0.3));
        const dimFactor = 1 - (logoProximity * 0.2);
        
        // Yellow flash or pink/yellow pulse
        const hasFlash = node.flashIntensity > 0;
        const useYellow = hasFlash || (node.pulseIntensity > 0.7 && Math.random() < 0.2);
        const nodeColor = useYellow ? '249, 249, 64' : '242, 127, 155';
        
        // Increased brightness by 60%
        const baseOpacity = 0.0336;
        const pulseOpacity = node.pulseIntensity * 0.3024;
        const flashOpacity = node.flashIntensity * 0.6;
        const finalOpacity = (baseOpacity + pulseOpacity + flashOpacity) * dimFactor;
        
        if (finalOpacity > 0.028) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 6);
          gradient.addColorStop(0, `rgba(${nodeColor}, ${finalOpacity})`);
          gradient.addColorStop(1, `rgba(${nodeColor}, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "linear-gradient(135deg, #0a0014 0%, #1a0a2e 100%)" }}
    />
  );
};

export default NeuralNetworkBackground;
