import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero",     label: "The Hero"  },
  { id: "projects", label: "The Quest" },
  { id: "games",    label: "The Board" },
  { id: "contact",  label: "The Lobby" },
];

// Candle — fixed body, flame GROWS with scroll progress
const Candle = ({ progress }: { progress: number }) => {
  const [flicker, setFlicker] = useState({ sx: 1, sy: 1, tx: 0, o: 1, rot: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flicker speed & intensity increases with progress
  const flickerIntensity = 0.12 + (progress / 100) * 0.28;
  const flickerSpeed     = 50  + (1 - progress / 100) * 70; // faster at high scroll

  useEffect(() => {
    const tick = () => {
      setFlicker({
        sx:  1 - flickerIntensity + Math.random() * flickerIntensity * 2,
        sy:  0.90 + Math.random() * 0.22,
        tx:  (Math.random() - 0.5) * (1.5 + (progress / 100) * 3),
        o:   0.85 + Math.random() * 0.15,
        rot: (Math.random() - 0.5) * (5 + (progress / 100) * 10),
      });
      timer.current = setTimeout(tick, flickerSpeed + Math.random() * 40);
    };
    timer.current = setTimeout(tick, flickerSpeed);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [progress, flickerIntensity, flickerSpeed]);

  // Fixed candle body
  const waxH   = 36;
  const waxTop = 52 - waxH;         // = 16
  const wickY  = waxTop - 1;        // = 15

  // Flame grows from tiny (progress=0) to tall (progress=100)
  const flameScale = 0.45 + (progress / 100) * 0.9; // 0.45 → 1.35
  const flameBaseY = wickY - 1;

  // Glow intensifies with progress
  const haloOpacity  = (0.15 + (progress / 100) * 0.55) * flicker.o;
  const haloRx       = 10 + (progress / 100) * 14;
  const haloRy       = 8  + (progress / 100) * 12;
  const glowBlur     = 6  + (progress / 100) * 12;

  // Flame paths centred at (0,0)
  const outerFlame = "M0,-18 C6,-13 8,-5 5,-1 C2.5,1.5 -2.5,1.5 -5,-1 C-8,-5 -6,-13 0,-18 Z";
  const midFlame   = "M0,-13 C4,-8 5.5,-3 3.2,-0.4 C1.6,1 -1.6,1 -3.2,-0.4 C-5.5,-3 -4,-8 0,-13 Z";
  const coreFlame  = "M0,-8 C2,-5.2 2.4,-2 1.3,0 C0.7,1 -0.7,1 -1.3,0 C-2.4,-2 -2,-5.2 0,-8 Z";

  return (
    <svg width="30" height="62" viewBox="0 0 30 62" fill="none" overflow="visible">
      <defs>
        {/* 3D cylindrical wax body */}
        <linearGradient id="waxGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 62%)" />
          <stop offset="22%"  stopColor="hsl(30 10% 93%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 99%)"   />
          <stop offset="78%"  stopColor="hsl(30 10% 91%)" />
          <stop offset="100%" stopColor="hsl(30 18% 60%)" />
        </linearGradient>
        <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 55%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 88%)"   />
          <stop offset="100%" stopColor="hsl(30 18% 53%)" />
        </linearGradient>

        {/* Dynamic halo blur — increases with scroll */}
        <filter id="halo" x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation={glowBlur} />
        </filter>

        {/* Flame glow filter */}
        <filter id="flameGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={1.5 + (progress / 100) * 2.5} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* AMBIENT HALO — grows and warms with scroll */}
      <ellipse
        cx="15" cy={flameBaseY - 6}
        rx={haloRx} ry={haloRy}
        fill="hsl(38 100% 58%)"
        opacity={haloOpacity}
        filter="url(#halo)"
        style={{ transition: "opacity 0.2s ease-out" }}
      />

      {/* Secondary deep-orange halo at high scroll */}
      {progress > 40 && (
        <ellipse
          cx="15" cy={flameBaseY - 4}
          rx={haloRx * 0.6} ry={haloRy * 0.5}
          fill="hsl(16 100% 55%)"
          opacity={(progress - 40) / 100 * 0.4 * flicker.o}
          filter="url(#halo)"
        />
      )}

      {/* FLAME — scaled by progress */}
      <g transform={`translate(15, ${flameBaseY})`} filter="url(#flameGlow)">
        <g
          style={{
            transformOrigin: "0px 0px",
            transform: `scale(${flameScale}) scaleX(${flicker.sx}) scaleY(${flicker.sy}) translateX(${flicker.tx}px) rotate(${flicker.rot}deg)`,
            opacity: flicker.o,
            transition: "transform 0.06s ease-out, opacity 0.06s ease-out",
          }}
        >
          <path d={outerFlame} fill="hsl(28 100% 48%)" opacity="0.9" />
          <path d={midFlame}   fill="hsl(43 100% 60%)" />
          <path d={coreFlame}  fill="hsl(55 100% 92%)" />
        </g>
      </g>

      {/* WICK */}
      <line
        x1="15" y1={wickY - 0.5} x2="15" y2={waxTop + 3}
        stroke="hsl(25 30% 22%)" strokeWidth="1.4" strokeLinecap="round"
      />

      {/* CANDLE BODY */}
      <rect x="6" y={waxTop} width="18" height={waxH}
        fill="url(#waxGrad)" rx="1.5" />

      {/* Top rim */}
      <ellipse cx="15" cy={waxTop} rx="9" ry="2"
        fill="url(#rimGrad)" opacity="0.8" />

      {/* Bottom grounding shadow */}
      <ellipse cx="15" cy={waxTop + waxH - 0.5} rx="8.5" ry="1.2"
        fill="hsl(30 18% 50%)" opacity="0.3" />

      {/* Left wax drip */}
      {progress > 25 && (
        <path
          d={`M8 ${waxTop + 3} Q6.5 ${waxTop + 10} 7 ${waxTop + 16}`}
          stroke="hsl(0 0% 88%)" strokeWidth="2.2" strokeLinecap="round" fill="none"
          opacity={Math.min(1, (progress - 25) / 30)}
        />
      )}
      {/* Right wax drip */}
      {progress > 45 && (
        <path
          d={`M21 ${waxTop + 4} Q22.5 ${waxTop + 11} 22 ${waxTop + 18}`}
          stroke="hsl(0 0% 86%)" strokeWidth="1.8" strokeLinecap="round" fill="none"
          opacity={Math.min(1, (progress - 45) / 30)}
        />
      )}
    </svg>
  );
};

const ResourceBar = () => {
  const [progress, setProgress] = useState(0);
  const [active, setActive]     = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? (window.scrollY / total) * 100 : 0;
      setProgress(p);
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 250) { setActive(s.id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
      style={{
        background: "hsl(220 20% 8% / 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid hsl(0 0% 100% / 0.08)",
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="px-5 py-2 max-w-5xl mx-auto flex items-center gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="px-2.5 py-1"
            style={{
              background: "hsl(var(--bauhaus-yellow))",
              border: "2px solid hsl(var(--bauhaus-black))",
            }}
          >
            <span className="font-title text-xs tracking-[0.1em] uppercase" style={{ color: "hsl(var(--bauhaus-black))" }}>
              Binita
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
              className="px-3 py-1.5 font-mono-game text-[10px] tracking-wider transition-all duration-150 cursor-pointer"
              style={
                active === s.id
                  ? { color: "hsl(var(--bauhaus-white))", background: "hsl(var(--bauhaus-red))", fontWeight: 700 }
                  : { color: "hsl(0 0% 85%)" }
              }
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Candle — right side, no percentage text */}
        <div className="ml-auto shrink-0 flex items-center">
          <Candle progress={progress} />
        </div>

      </div>
    </motion.header>
  );
};

export default ResourceBar;
