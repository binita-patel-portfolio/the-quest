import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero",     label: "The Hero"  },
  { id: "projects", label: "The Quest" },
  { id: "games",    label: "The Board" },
  { id: "contact",  label: "The Lobby" },
];

// Map section index (0-3) to a scroll % range
const SECTION_RANGES = [
  [0, 25],
  [25, 50],
  [50, 75],
  [75, 100],
];

// Returns 0..3 float position of candle across sections
const getCandlePos = (progress: number): number => {
  for (let i = 0; i < SECTION_RANGES.length; i++) {
    const [lo, hi] = SECTION_RANGES[i];
    if (progress <= hi) {
      const t = (progress - lo) / (hi - lo);
      return i + Math.max(0, Math.min(1, t));
    }
  }
  return 4;
};

// ── Candle SVG ────────────────────────────────────────────────────────────────
const Candle = ({
  progress,
  pulse,
}: {
  progress: number;
  pulse: boolean;
}) => {
  const [flicker, setFlicker] = useState({ sx: 1, sy: 1, tx: 0, o: 1, rot: 0 });
  const [smokeParticles, setSmokeParticles] = useState<
    { id: number; x: number }[]
  >([]);
  const flickerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smokeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const smokeId = useRef(0);

  // Flicker SLOWS as scroll increases (fast at 0 → almost still at 100)
  const flickerInterval = 55 + (progress / 100) * 320; // 55ms → 375ms
  const flickerAmt = 0.22 - (progress / 100) * 0.18;  // 0.22 → 0.04

  const isExtinguished = progress >= 98;
  const flameFade = progress > 90 ? Math.max(0, 1 - (progress - 90) / 8) : 1;

  useEffect(() => {
    const tick = () => {
      if (!isExtinguished) {
        setFlicker({
          sx:  1 - flickerAmt + Math.random() * flickerAmt * 2,
          sy:  0.92 + Math.random() * (0.16 - (progress / 100) * 0.12),
          tx:  (Math.random() - 0.5) * (2.5 - (progress / 100) * 2),
          o:   0.9 + Math.random() * 0.1,
          rot: (Math.random() - 0.5) * (8 - (progress / 100) * 7),
        });
      }
      flickerTimer.current = setTimeout(tick, flickerInterval + Math.random() * 40);
    };
    flickerTimer.current = setTimeout(tick, flickerInterval);
    return () => { if (flickerTimer.current) clearTimeout(flickerTimer.current); };
  }, [progress, flickerInterval, flickerAmt, isExtinguished]);

  // Smoke when nearly burnt out
  useEffect(() => {
    if (progress > 88) {
      smokeTimer.current = setInterval(() => {
        setSmokeParticles(prev => {
          const cleaned = prev.filter(p => p.id > smokeId.current - 5);
          return [...cleaned, { id: ++smokeId.current, x: (Math.random() - 0.5) * 6 }];
        });
      }, isExtinguished ? 280 : 700);
    } else {
      if (smokeTimer.current) clearInterval(smokeTimer.current);
      setSmokeParticles([]);
    }
    return () => { if (smokeTimer.current) clearInterval(smokeTimer.current); };
  }, [progress, isExtinguished]);

  // Wax burns down
  const maxWaxH = 36;
  const minWaxH = 5;
  const waxBottom = 52;
  const waxH  = maxWaxH - (maxWaxH - minWaxH) * (progress / 100);
  const waxTop = waxBottom - waxH;
  const wickY  = waxTop - 1;
  const flameBaseY = wickY - 1;

  // Glow — steady, pulse override
  const baseGlow = 0.42 * flicker.o * flameFade;
  const haloOpacity = pulse ? 0.9 : baseGlow;
  const haloRx = pulse ? 18 : 11;
  const haloRy = pulse ? 14 : 8;

  // Drips
  const d1 = progress > 20 ? Math.min(1, (progress - 20) / 25) : 0;
  const d2 = progress > 45 ? Math.min(1, (progress - 45) / 25) : 0;
  const d3 = progress > 65 ? Math.min(1, (progress - 65) / 20) : 0;

  const outerFlame = "M0,-17 C6,-12 7,-4 4.5,-0.8 C2.2,1.5 -2.2,1.5 -4.5,-0.8 C-7,-4 -6,-12 0,-17 Z";
  const midFlame   = "M0,-12 C3.8,-7.5 5,-2.5 3,0 C1.5,1.2 -1.5,1.2 -3,0 C-5,-2.5 -3.8,-7.5 0,-12 Z";
  const coreFlame  = "M0,-7 C2,-4.5 2.2,-1.5 1.2,0.2 C0.6,1 -0.6,1 -1.2,0.2 C-2.2,-1.5 -2,-4.5 0,-7 Z";

  return (
    <svg
      width="30"
      height="62"
      viewBox="0 0 30 62"
      fill="none"
      overflow="visible"
      style={{ marginTop: "22px" }}
    >
      <defs>
        <linearGradient id="cWax" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 62%)" />
          <stop offset="22%"  stopColor="hsl(30 10% 93%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 99%)"   />
          <stop offset="78%"  stopColor="hsl(30 10% 91%)" />
          <stop offset="100%" stopColor="hsl(30 18% 60%)" />
        </linearGradient>
        <linearGradient id="cRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 55%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 88%)"   />
          <stop offset="100%" stopColor="hsl(30 18% 53%)" />
        </linearGradient>
        <radialGradient id="cMelt" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="hsl(0 0% 97%)" />
          <stop offset="100%" stopColor="hsl(30 12% 78%)" />
        </radialGradient>

        <filter id="cHalo" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation={pulse ? 9 : 7} />
        </filter>
        <filter id="cFlame" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="cSmoke" x="-200%" y="-300%" width="500%" height="600%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* Smoke */}
      {smokeParticles.map(p => (
        <motion.ellipse
          key={p.id}
          cx={15 + p.x} cy={flameBaseY - 10}
          rx="3" ry="2"
          fill="hsl(220 10% 75%)"
          filter="url(#cSmoke)"
          initial={{ opacity: 0.5, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -26, scale: 2.4, x: p.x * 2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      ))}

      {/* Halo glow */}
      {flameFade > 0 && (
        <motion.ellipse
          cx="15" cy={flameBaseY - 5}
          rx={haloRx} ry={haloRy}
          fill={pulse ? "hsl(55 100% 70%)" : "hsl(38 100% 58%)"}
          filter="url(#cHalo)"
          animate={{ opacity: haloOpacity, rx: haloRx, ry: haloRy }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Flame */}
      {flameFade > 0 && (
        <g transform={`translate(15, ${flameBaseY})`} filter="url(#cFlame)">
          <g
            style={{
              transformOrigin: "0px 0px",
              transform: `scaleX(${flicker.sx}) scaleY(${flicker.sy}) translateX(${flicker.tx}px) rotate(${flicker.rot}deg)`,
              opacity: flicker.o * flameFade * (pulse ? 1 : 1),
              transition: `transform ${flickerInterval}ms ease-out, opacity 0.15s ease-out`,
            }}
          >
            <path d={outerFlame} fill={pulse ? "hsl(43 100% 60%)" : "hsl(28 100% 48%)"} opacity="0.9" />
            <path d={midFlame}   fill={pulse ? "hsl(55 100% 80%)" : "hsl(43 100% 60%)"} />
            <path d={coreFlame}  fill="hsl(55 100% 95%)" />
          </g>
        </g>
      )}

      {/* Wick */}
      <line
        x1="15" y1={wickY - 0.5} x2="15" y2={waxTop + 2}
        stroke="hsl(25 30% 22%)" strokeWidth="1.4" strokeLinecap="round"
      />

      {/* Wax body */}
      <rect x="6" y={waxTop} width="18" height={waxH} fill="url(#cWax)" rx="1.5" />
      <ellipse cx="15" cy={waxTop} rx="9" ry={2 + (progress / 100) * 1.5}
        fill="url(#cMelt)" opacity="0.9" />

      {/* Puddle */}
      {progress > 50 && (
        <ellipse
          cx="15" cy={waxBottom + 1}
          rx={4.5 + (progress - 50) / 20} ry={1 + (progress - 50) / 90}
          fill="hsl(0 0% 90%)"
          opacity={Math.min(0.55, (progress - 50) / 65)}
        />
      )}

      {/* Bottom shadow */}
      <ellipse cx="15" cy={waxBottom + 0.5} rx="8" ry="1.1"
        fill="hsl(30 18% 50%)" opacity="0.22" />

      {/* Drips */}
      {d1 > 0 && (
        <path d={`M8 ${waxTop + 2} Q6.5 ${waxTop + 9} 7 ${Math.min(waxTop + 16, waxBottom - 4)}`}
          stroke="hsl(0 0% 88%)" strokeWidth="2.1" strokeLinecap="round" fill="none" opacity={d1} />
      )}
      {d2 > 0 && (
        <path d={`M22 ${waxTop + 3} Q23.5 ${waxTop + 10} 22.8 ${Math.min(waxTop + 18, waxBottom - 3)}`}
          stroke="hsl(0 0% 86%)" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity={d2} />
      )}
      {d3 > 0 && (
        <path d={`M12 ${waxTop + 1} Q10.5 ${waxTop + 7} 11 ${Math.min(waxTop + 13, waxBottom - 5)}`}
          stroke="hsl(0 0% 91%)" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity={d3} />
      )}
    </svg>
  );
};

// ── ResourceBar ───────────────────────────────────────────────────────────────
const ResourceBar = () => {
  const [progress, setProgress]   = useState(0);
  const [active, setActive]       = useState("hero");
  const [candlePulse, setCandlePulse] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Candle X position — slides across nav buttons
  const [candleX, setCandleX] = useState(0);

  // Pulse listener — fired from HeroSection
  useEffect(() => {
    const onPulse = () => {
      setCandlePulse(true);
      setTimeout(() => setCandlePulse(false), 1200);
    };
    window.addEventListener("candle-pulse", onPulse);
    return () => window.removeEventListener("candle-pulse", onPulse);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? (window.scrollY / total) * 100 : 0;
      setProgress(p);
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 250) {
          setActive(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update candle X whenever progress changes
  useEffect(() => {
    const pos = getCandlePos(progress); // 0..4 float
    const idx = Math.min(3, Math.floor(pos));
    const frac = pos - idx;

    const cur = btnRefs.current[idx];
    const next = btnRefs.current[Math.min(3, idx + 1)];
    if (!cur) return;

    const navEl = navRef.current;
    if (!navEl) return;
    const navRect = navEl.getBoundingClientRect();
    const curRect = cur.getBoundingClientRect();
    const curCenter = curRect.left + curRect.width / 2 - navRect.left;

    if (next && idx < 3) {
      const nextRect = next.getBoundingClientRect();
      const nextCenter = nextRect.left + nextRect.width / 2 - navRect.left;
      setCandleX(curCenter + (nextCenter - curCenter) * frac);
    } else {
      setCandleX(curCenter);
    }
  }, [progress]);

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
      <div className="px-5 pt-3 pb-2 max-w-5xl mx-auto flex items-center gap-6">

        {/* Logo */}
        <div className="shrink-0">
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

        {/* Nav + sliding candle wrapper */}
        <div className="hidden md:block flex-1 relative" ref={navRef}>
          <nav className="flex items-center gap-1">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                ref={el => { btnRefs.current[i] = el; }}
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

          {/* Sliding candle game piece */}
          <AnimatePresence>
            <motion.div
              className="absolute top-0 pointer-events-none"
              style={{ left: candleX, transform: "translateX(-50%)" }}
              animate={{ left: candleX }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
            >
              <Candle progress={progress} pulse={candlePulse} />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </motion.header>
  );
};

export default ResourceBar;
