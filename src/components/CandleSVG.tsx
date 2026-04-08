import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const CandleSVG = ({ progress }: { progress: number }) => {
  const [flicker, setFlicker] = useState({ sx: 1, sy: 1, tx: 0, o: 1, rot: 0 });
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; x: number; delay: number }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smokeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const smokeId = useRef(0);

  const isExtinguished = progress >= 98;
  const flameFade = progress > 90 ? Math.max(0, 1 - (progress - 90) / 8) : 1;

  useEffect(() => {
    const tick = () => {
      if (!isExtinguished) {
        setFlicker({
          sx:  0.88 + Math.random() * 0.24,
          sy:  0.90 + Math.random() * 0.20,
          tx:  (Math.random() - 0.5) * 2.5,
          o:   0.88 + Math.random() * 0.12,
          rot: (Math.random() - 0.5) * 8,
        });
      }
      timer.current = setTimeout(tick, 60 + Math.random() * 50);
    };
    timer.current = setTimeout(tick, 60);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [isExtinguished]);

  useEffect(() => {
    if (progress > 88) {
      smokeTimer.current = setInterval(() => {
        setSmokeParticles(prev => {
          const cleaned = prev.filter(p => p.id > smokeId.current - 6);
          return [...cleaned, { id: ++smokeId.current, x: (Math.random() - 0.5) * 6, delay: Math.random() * 0.3 }];
        });
      }, isExtinguished ? 300 : 600);
    } else {
      if (smokeTimer.current) clearInterval(smokeTimer.current);
      setSmokeParticles([]);
    }
    return () => { if (smokeTimer.current) clearInterval(smokeTimer.current); };
  }, [progress, isExtinguished]);

  const maxWaxH = 38;
  const minWaxH = 5;
  const waxBottom = 68;
  const waxH = maxWaxH - ((maxWaxH - minWaxH) * (progress / 100));
  const waxTop = waxBottom - waxH;
  const wickY  = waxTop - 1;

  const flameBaseY = wickY - 1;
  const outerFlame = "M0,-17 C6,-12 7,-4 4.5,-0.8 C2.2,1.5 -2.2,1.5 -4.5,-0.8 C-7,-4 -6,-12 0,-17 Z";
  const midFlame   = "M0,-12 C3.8,-7.5 5,-2.5 3,0 C1.5,1.2 -1.5,1.2 -3,0 C-5,-2.5 -3.8,-7.5 0,-12 Z";
  const coreFlame  = "M0,-7 C2,-4.5 2.2,-1.5 1.2,0.2 C0.6,1 -0.6,1 -1.2,0.2 C-2.2,-1.5 -2,-4.5 0,-7 Z";

  const haloOpacity = 0.45 * flicker.o * flameFade;

  const drip1Opacity = progress > 20 ? Math.min(1, (progress - 20) / 25) : 0;
  const drip2Opacity = progress > 40 ? Math.min(1, (progress - 40) / 25) : 0;
  const drip3Opacity = progress > 60 ? Math.min(1, (progress - 60) / 20) : 0;

  return (
    <svg width="32" height="68" viewBox="0 0 32 68" fill="none" overflow="visible" style={{ display: "block", margin: 0, verticalAlign: "bottom" }} aria-hidden="true" role="img">
      <defs>
        <linearGradient id="waxGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 62%)" />
          <stop offset="22%"  stopColor="hsl(30 10% 93%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 99%)"   />
          <stop offset="78%"  stopColor="hsl(30 10% 91%)" />
          <stop offset="100%" stopColor="hsl(30 18% 60%)" />
        </linearGradient>
        <linearGradient id="rimGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 55%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 88%)"   />
          <stop offset="100%" stopColor="hsl(30 18% 53%)" />
        </linearGradient>
        <radialGradient id="meltTop" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="hsl(0 0% 97%)" />
          <stop offset="100%" stopColor="hsl(30 12% 78%)" />
        </radialGradient>
        <filter id="halo2" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="flameGlow2" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="smoke" x="-200%" y="-300%" width="500%" height="600%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {smokeParticles.map(p => (
        <motion.ellipse
          key={p.id}
          cx={16 + p.x} cy={flameBaseY - 10}
          rx="3" ry="2"
          fill="hsl(220 10% 75%)" filter="url(#smoke)"
          initial={{ opacity: 0.5, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -28, scale: 2.5, x: p.x * 2 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: p.delay }}
        />
      ))}

      {flameFade > 0 && (
        <ellipse cx="16" cy={flameBaseY - 5} rx="12" ry="9"
          fill="hsl(38 100% 58%)" opacity={haloOpacity} filter="url(#halo2)" />
      )}

      {flameFade > 0 && (
        <g transform={`translate(16, ${flameBaseY})`} filter="url(#flameGlow2)">
          <g style={{
            transformOrigin: "0px 0px",
            transform: `scaleX(${flicker.sx}) scaleY(${flicker.sy}) translateX(${flicker.tx}px) rotate(${flicker.rot}deg)`,
            opacity: flicker.o * flameFade,
            transition: "transform 0.06s ease-out, opacity 0.15s ease-out",
          }}>
            <path d={outerFlame} fill="hsl(28 100% 48%)" opacity="0.9" />
            <path d={midFlame}   fill="hsl(43 100% 60%)" />
            <path d={coreFlame}  fill="hsl(55 100% 92%)" />
          </g>
        </g>
      )}

      <line x1="16" y1={wickY - 0.5} x2="16" y2={waxTop + 2}
        stroke="hsl(25 30% 22%)" strokeWidth="1.4" strokeLinecap="round" />

      <rect x="7" y={waxTop} width="18" height={waxH}
        fill="url(#waxGrad2)" rx="1.5" />

      <ellipse cx="16" cy={waxTop} rx="9" ry={2 + (progress / 100) * 1.5}
        fill="url(#meltTop)" opacity="0.9" />

      {progress > 50 && (
        <ellipse cx="16" cy={waxBottom + 1}
          rx={5 + (progress - 50) / 20} ry={1.2 + (progress - 50) / 80}
          fill="hsl(0 0% 90%)" opacity={Math.min(0.6, (progress - 50) / 60)} />
      )}

      <ellipse cx="16" cy={waxBottom + 0.5} rx="8.5" ry="1.2"
        fill="hsl(30 18% 50%)" opacity="0.25" />

      {drip1Opacity > 0 && (
        <path d={`M9 ${waxTop + 2} Q7.2 ${waxTop + 9} 7.8 ${Math.min(waxTop + 17, waxBottom - 4)}`}
          stroke="hsl(0 0% 88%)" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity={drip1Opacity} />
      )}
      {drip2Opacity > 0 && (
        <path d={`M23 ${waxTop + 3} Q24.5 ${waxTop + 10} 23.8 ${Math.min(waxTop + 19, waxBottom - 3)}`}
          stroke="hsl(0 0% 86%)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity={drip2Opacity} />
      )}
      {drip3Opacity > 0 && (
        <path d={`M13 ${waxTop + 1} Q11.5 ${waxTop + 7} 12 ${Math.min(waxTop + 14, waxBottom - 5)}`}
          stroke="hsl(0 0% 91%)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={drip3Opacity} />
      )}
    </svg>
  );
};

export default CandleSVG;
