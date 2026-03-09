import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero",     label: "The Hero"  },
  { id: "projects", label: "The Quest" },
  { id: "games",    label: "The Board" },
  { id: "contact",  label: "The Lobby" },
];

// Candle — flame grows and SLOWS DOWN as scroll deepens, extinguishes at ~98%
const Candle = ({ progress }: { progress: number }) => {
  const [flicker, setFlicker] = useState({ sx: 1, sy: 1, tx: 0, rot: 0, o: 1 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const burnedOut = progress >= 98;

  // Flicker interval: FAST at 0% (55ms) → VERY SLOW at 95% (900ms)
  const flickerInterval = 55 + (Math.min(progress, 95) / 95) * 845;

  // Flicker magnitude shrinks to near-zero as we approach burn-out
  const mag = Math.max(0, 1 - progress / 97);

  useEffect(() => {
    if (burnedOut) {
      setFlicker({ sx: 1, sy: 1, tx: 0, rot: 0, o: 0 });
      return;
    }
    const tick = () => {
      setFlicker({
        sx:  1 + (Math.random() - 0.5) * 0.55 * mag,
        sy:  1 + (Math.random() - 0.5) * 0.30 * mag,
        tx:  (Math.random() - 0.5) * 2.8 * mag,
        rot: (Math.random() - 0.5) * 14 * mag,
        o:   0.82 + Math.random() * 0.18 * mag,
      });
      timer.current = setTimeout(tick, flickerInterval + Math.random() * 60);
    };
    timer.current = setTimeout(tick, flickerInterval);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [progress, flickerInterval, mag, burnedOut]);

  // Candle body burns down with scroll: 34px → 6px
  const waxH   = Math.max(6, 34 - (progress / 100) * 28);
  const waxTop = 50 - waxH;
  const wickTip = waxTop - 1;

  // Flame is fixed size — only flicker changes, not height
  const flameH = 16;
  const flameW = 1;

  // Fixed teardrop flame paths
  const outer = `M0,${-flameH} C${flameH * 0.38},${-flameH * 0.72} ${flameH * 0.5},${-flameH * 0.3} ${flameH * 0.3},-1 C${flameH * 0.16},1 ${-flameH * 0.16},1 ${-flameH * 0.3},-1 C${-flameH * 0.5},${-flameH * 0.3} ${-flameH * 0.38},${-flameH * 0.72} 0,${-flameH} Z`;
  const mid   = `M0,${-flameH * 0.72} C${flameH * 0.26},${-flameH * 0.5} ${flameH * 0.32},${-flameH * 0.18} ${flameH * 0.2},-0.3 C${flameH * 0.1},0.7 ${-flameH * 0.1},0.7 ${-flameH * 0.2},-0.3 C${-flameH * 0.32},${-flameH * 0.18} ${-flameH * 0.26},${-flameH * 0.5} 0,${-flameH * 0.72} Z`;
  const core  = `M0,${-flameH * 0.45} C${flameH * 0.12},${-flameH * 0.28} ${flameH * 0.14},${-flameH * 0.08} ${flameH * 0.08},0 C${flameH * 0.04},0.5 ${-flameH * 0.04},0.5 ${-flameH * 0.08},0 C${-flameH * 0.14},${-flameH * 0.08} ${-flameH * 0.12},${-flameH * 0.28} 0,${-flameH * 0.45} Z`;

  // Glow: dim at top → blazing near bottom
  const haloOpacity = 0.12 + (progress / 100) * 0.52;
  const haloR       = 8   + (progress / 100) * 16;
  const glowBlur    = 6   + (progress / 100) * 14;

  return (
    <svg
      width="28" height="60"
      viewBox="0 0 28 60"
      fill="none"
      overflow="visible"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="waxBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 60%)" />
          <stop offset="20%"  stopColor="hsl(30 10% 92%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 99%)"   />
          <stop offset="80%"  stopColor="hsl(30 10% 90%)" />
          <stop offset="100%" stopColor="hsl(30 18% 58%)" />
        </linearGradient>
        <linearGradient id="waxRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 15% 54%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 88%)"   />
          <stop offset="100%" stopColor="hsl(30 15% 52%)" />
        </linearGradient>

        <filter id="candleHalo" x="-500%" y="-500%" width="1100%" height="1100%">
          <feGaussianBlur stdDeviation={glowBlur} />
        </filter>
        <filter id="flameGlow" x="-120%" y="-80%" width="340%" height="260%">
          <feGaussianBlur stdDeviation={1.2 + (progress / 100) * 2.8} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* OUTER AMBIENT HALO — grows with scroll depth */}
      {!burnedOut && (
        <ellipse
          cx="14" cy={wickTip - 5}
          rx={haloR} ry={haloR * 0.75}
          fill="hsl(38 100% 56%)"
          opacity={haloOpacity * flicker.o}
          filter="url(#candleHalo)"
          style={{ transition: "opacity 0.3s ease-out" }}
        />
      )}

      {/* DEEP RED secondary corona past 50% */}
      {!burnedOut && progress > 50 && (
        <ellipse
          cx="14" cy={wickTip - 3}
          rx={haloR * 0.5} ry={haloR * 0.35}
          fill="hsl(16 100% 52%)"
          opacity={((progress - 50) / 50) * 0.38 * flicker.o}
          filter="url(#candleHalo)"
        />
      )}

      {/* FLAME */}
      {!burnedOut && (
        <g transform={`translate(14, ${wickTip})`} filter="url(#flameGlow)">
          <g
            style={{
              transformOrigin: "0px 0px",
              transform: `scaleX(${flameW * flicker.sx}) scaleY(${flicker.sy}) translateX(${flicker.tx}px) rotate(${flicker.rot}deg)`,
              opacity: flicker.o,
              // transition easing mirrors interval — slow at end
              transition: `transform ${(flickerInterval * 0.9).toFixed(0)}ms ease-out, opacity ${(flickerInterval * 0.8).toFixed(0)}ms ease-out`,
            }}
          >
            <path d={outer} fill="hsl(28 100% 48%)" opacity="0.88" />
            <path d={mid}   fill="hsl(43 100% 60%)" />
            <path d={core}  fill="hsl(55 100% 94%)" />
          </g>
        </g>
      )}

      {/* SMOKE — 3 wisps after burnout */}
      {burnedOut && (
        <g>
          <motion.circle
            cx="14" cy={wickTip - 4}
            r="1.8" fill="hsl(220 8% 62%)"
            animate={{ cy: [wickTip - 4, wickTip - 14], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.circle
            cx="12" cy={wickTip - 8}
            r="1.2" fill="hsl(220 8% 58%)"
            animate={{ cy: [wickTip - 8, wickTip - 18], opacity: [0.35, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          />
          <motion.circle
            cx="16" cy={wickTip - 12}
            r="0.9" fill="hsl(220 8% 55%)"
            animate={{ cy: [wickTip - 12, wickTip - 22], opacity: [0.25, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
          />
        </g>
      )}

      {/* WICK */}
      <line
        x1="14" y1={wickTip} x2="14" y2={waxTop + 4}
        stroke="hsl(25 30% 22%)" strokeWidth="1.4" strokeLinecap="round"
      />

      {/* CANDLE BODY */}
      <rect x="5" y={waxTop} width="18" height={waxH}
        fill="url(#waxBody)" rx="1.5" />

      {/* Top cylindrical rim */}
      <ellipse cx="14" cy={waxTop} rx="9" ry="2.2"
        fill="url(#waxRim)" opacity="0.82" />

      {/* Bottom ground shadow */}
      <ellipse cx="14" cy={waxTop + waxH - 0.5} rx="8" ry="1.3"
        fill="hsl(30 15% 48%)" opacity="0.28" />

      {/* Wax drip left — visible from start, disappears when candle too short */}
      {waxH > 10 && (
        <path
          d={`M7 ${waxTop + 2} Q5.5 ${waxTop + Math.min(8, waxH * 0.45)} 6.2 ${waxTop + Math.min(14, waxH * 0.75)}`}
          stroke="hsl(0 0% 90%)" strokeWidth="2.2" strokeLinecap="round" fill="none"
          opacity={Math.min(1, (waxH - 10) / 10)}
        />
      )}
      {/* Wax drip right — visible from start, disappears when candle too short */}
      {waxH > 14 && (
        <path
          d={`M21 ${waxTop + 3} Q22.5 ${waxTop + Math.min(10, waxH * 0.5)} 21.8 ${waxTop + Math.min(16, waxH * 0.78)}`}
          stroke="hsl(0 0% 87%)" strokeWidth="1.9" strokeLinecap="round" fill="none"
          opacity={Math.min(1, (waxH - 14) / 10)}
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
      className="fixed top-0 left-0 right-0 z-50"
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
            <span
              className="font-title text-xs tracking-[0.1em] uppercase"
              style={{ color: "hsl(var(--bauhaus-black))" }}
            >
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
                  : { color: "hsl(0 0% 75%)" }
              }
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Candle — flush right, no text */}
        <div className="ml-auto shrink-0 flex items-center justify-center" style={{ width: 28, height: 44, overflow: "visible" }}>
          <Candle progress={progress} />
        </div>

      </div>
    </motion.header>
  );
};

export default ResourceBar;
