import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero",     label: "The Hero"  },
  { id: "projects", label: "The Quest" },
  { id: "games",    label: "The Board" },
  { id: "contact",  label: "The Lobby" },
];


// Candle — realistic 3D premium candle with glow halo
const Candle = ({ progress }: { progress: number }) => {
  const [flicker, setFlicker] = useState({ sx: 1, sy: 1, tx: 0, o: 1, rot: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (progress >= 98) return;
    const tick = () => {
      setFlicker({
        sx:  0.80 + Math.random() * 0.40,
        sy:  0.85 + Math.random() * 0.30,
        tx:  (Math.random() - 0.5) * 2.2,
        o:   0.88 + Math.random() * 0.12,
        rot: (Math.random() - 0.5) * 7,
      });
      timer.current = setTimeout(tick, 60 + Math.random() * 90);
    };
    timer.current = setTimeout(tick, 60);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [progress]);

  const maxH = 38;
  const minH = 5;
  const waxH      = maxH - ((maxH - minH) * progress) / 100;
  const waxTop    = 56 - waxH;
  const flameBaseY = waxTop - 1;
  const burnedOut  = progress >= 98;
  const flameOpacity = Math.max(0, 1 - (progress / 100) * 0.55);

  // Teardrop flame paths centred at (0,0) = flame base
  const outerFlame = "M0,-17 C5.5,-12 7.5,-5 4.5,-1 C2.5,1.5 -2.5,1.5 -4.5,-1 C-7.5,-5 -5.5,-12 0,-17 Z";
  const midFlame   = "M0,-12 C3.5,-8 5,-3.5 3,-0.5 C1.5,1 -1.5,1 -3,-0.5 C-5,-3.5 -3.5,-8 0,-12 Z";
  const coreFlame  = "M0,-7.5 C1.8,-5 2.2,-2 1.2,0 C0.6,0.9 -0.6,0.9 -1.2,0 C-2.2,-2 -1.8,-5 0,-7.5 Z";

  return (
    <svg width="26" height="58" viewBox="0 0 26 58" fill="none" overflow="visible">
      <defs>
        {/* Cylindrical 3D body gradient — light centre, shadowed edges */}
        <linearGradient id="waxGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 68%)" />
          <stop offset="22%"  stopColor="hsl(30 10% 94%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 99%)" />
          <stop offset="78%"  stopColor="hsl(30 10% 92%)" />
          <stop offset="100%" stopColor="hsl(30 18% 65%)" />
        </linearGradient>
        {/* Top ellipse rim gradient */}
        <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 60%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 90%)" />
          <stop offset="100%" stopColor="hsl(30 18% 58%)" />
        </linearGradient>
        {/* Soft ambient halo blur */}
        <filter id="halo" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* Flame inner glow */}
        <filter id="flameGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* AMBIENT HALO — warm glow cast onto nav bar */}
      {!burnedOut && (
        <ellipse
          cx="13" cy={flameBaseY - 7}
          rx="14" ry="11"
          fill="hsl(38 100% 58%)"
          opacity={0.28 * flicker.o * flameOpacity}
          filter="url(#halo)"
          style={{ transition: "opacity 0.08s ease-out, cy 0.15s ease-out" }}
        />
      )}

      {/* FLAME */}
      {!burnedOut && (
        <g transform={`translate(13, ${flameBaseY})`} filter="url(#flameGlow)">
          <g
            style={{
              transformOrigin: "0px 0px",
              transform: `scaleX(${flicker.sx}) scaleY(${flicker.sy}) translateX(${flicker.tx}px) rotate(${flicker.rot}deg)`,
              opacity: flicker.o * flameOpacity,
              transition: "transform 0.06s ease-out, opacity 0.06s ease-out",
            }}
          >
            <path d={outerFlame} fill="hsl(28 100% 50%)" opacity="0.88" />
            <path d={midFlame}   fill="hsl(43 100% 62%)" />
            <path d={coreFlame}  fill="hsl(55 100% 93%)" />
          </g>
        </g>
      )}

      {/* Smoke wisps when burned out */}
      {burnedOut && (
        <g opacity="0.4">
          <circle cx="13" cy={waxTop - 5}  r="1.5" fill="hsl(220 8% 60%)" />
          <circle cx="11" cy={waxTop - 9}  r="1"   fill="hsl(220 8% 60%)" />
          <circle cx="14" cy={waxTop - 13} r="0.8" fill="hsl(220 8% 60%)" />
        </g>
      )}

      {/* WICK */}
      <line x1="13" y1={waxTop - 1} x2="13" y2={waxTop + 3.5}
        stroke="hsl(25 30% 25%)" strokeWidth="1.3" strokeLinecap="round" />

      {/* CANDLE BODY — 3D gradient, no border */}
      <rect x="5" y={waxTop} width="16" height={waxH}
        fill="url(#waxGrad)" rx="1.5" />

      {/* Top ellipse rim for cylindrical depth */}
      <ellipse cx="13" cy={waxTop} rx="8" ry="1.8"
        fill="url(#rimGrad)" opacity="0.75" />

      {/* Bottom shadow line for grounding */}
      <ellipse cx="13" cy={waxTop + waxH - 0.5} rx="7.5" ry="1"
        fill="hsl(30 18% 55%)" opacity="0.35" />

      {/* Wax drip — left (clamped to candle body height) */}
      {progress > 20 && waxH > 6 && (() => {
        const maxLen = Math.min(14, waxH - 4);
        return (
          <path d={`M7 ${waxTop + 2} Q5.5 ${waxTop + maxLen * 0.55} 6 ${waxTop + maxLen}`}
            stroke="hsl(0 0% 88%)" strokeWidth="2.2" strokeLinecap="round" fill="none"
            opacity={Math.min(1, (progress - 20) / 35) * Math.min(1, (waxH - 6) / 6)} />
        );
      })()}
      {/* Wax drip — right (clamped to candle body height) */}
      {progress > 38 && waxH > 6 && (() => {
        const maxLen = Math.min(15, waxH - 3);
        return (
          <path d={`M18 ${waxTop + 3} Q19.5 ${waxTop + maxLen * 0.58} 19 ${waxTop + maxLen}`}
            stroke="hsl(0 0% 86%)" strokeWidth="1.8" strokeLinecap="round" fill="none"
            opacity={Math.min(1, (progress - 38) / 28) * Math.min(1, (waxH - 6) / 6)} />
        );
      })()}
    </svg>
  );
};

const ResourceBar = () => {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("hero");

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
      {/* Nav content */}
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
                  ? {
                      color: "hsl(var(--bauhaus-white))",
                      background: "hsl(var(--bauhaus-red))",
                      fontWeight: 700,
                    }
                  : {
                      color: "hsl(0 0% 85%)",
                    }
              }
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Candle */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <Candle progress={progress} />
          <span
            className="font-mono-game text-[9px] tabular-nums"
            style={{
              color: progress >= 98 ? "hsl(0 0% 100% / 0.22)" : "hsl(55 100% 78%)",
              minWidth: "2.2rem",
              textAlign: "right",
              display: "inline-block",
            }}
          >
            {Math.round(progress)}%
          </span>
        </div>

      </div>
    </motion.header>
  );
};

export default ResourceBar;
