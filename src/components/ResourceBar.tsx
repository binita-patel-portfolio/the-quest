import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero",     label: "The Hero"  },
  { id: "projects", label: "The Quest" },
  { id: "games",    label: "The Board" },
  { id: "contact",  label: "The Lobby" },
];

/* ─── Wall Sconce ─────────────────────────────────────────────────────────── */
const WallSconce = ({ progress }: { progress: number }) => {
  const [flicker, setFlicker] = useState({ sx: 1, sy: 1, tx: 0, o: 1, rot: 0 });
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; x: number; delay: number }[]>([]);
  const timer    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const smokeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const smokeId  = useRef(0);

  const isExtinguished = progress >= 98;
  const flameFade = progress > 90 ? Math.max(0, 1 - (progress - 90) / 8) : 1;

  // Constant flicker
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

  // Smoke particles near extinguished
  useEffect(() => {
    if (progress > 88) {
      smokeRef.current = setInterval(() => {
        setSmokeParticles(prev => {
          const cleaned = prev.filter(p => p.id > smokeId.current - 6);
          return [...cleaned, { id: ++smokeId.current, x: (Math.random() - 0.5) * 6, delay: Math.random() * 0.3 }];
        });
      }, isExtinguished ? 300 : 600);
    } else {
      if (smokeRef.current) clearInterval(smokeRef.current);
      setSmokeParticles([]);
    }
    return () => { if (smokeRef.current) clearInterval(smokeRef.current); };
  }, [progress, isExtinguished]);

  // Candle burns down — top descends, body shrinks
  const maxWaxH = 32;
  const minWaxH = 4;
  const waxBottom = 74; // flush to SVG bottom
  const waxH   = maxWaxH - ((maxWaxH - minWaxH) * (progress / 100));
  const waxTop = waxBottom - waxH;
  const wickY  = waxTop - 1;

  // Flame paths
  const flameBaseY = wickY - 1;
  const outerFlame = "M0,-17 C6,-12 7,-4 4.5,-0.8 C2.2,1.5 -2.2,1.5 -4.5,-0.8 C-7,-4 -6,-12 0,-17 Z";
  const midFlame   = "M0,-12 C3.8,-7.5 5,-2.5 3,0 C1.5,1.2 -1.5,1.2 -3,0 C-5,-2.5 -3.8,-7.5 0,-12 Z";
  const coreFlame  = "M0,-7 C2,-4.5 2.2,-1.5 1.2,0.2 C0.6,1 -0.6,1 -1.2,0.2 C-2.2,-1.5 -2,-4.5 0,-7 Z";

  const haloOpacity = 0.5 * flicker.o * flameFade;

  // Drips
  const drip1 = progress > 20 ? Math.min(1, (progress - 20) / 25) : 0;
  const drip2 = progress > 45 ? Math.min(1, (progress - 45) / 25) : 0;
  const drip3 = progress > 65 ? Math.min(1, (progress - 65) / 20) : 0;

  // candle cx = 36 (right portion of SVG)
  const cx = 36;

  return (
    /*
      SVG viewport: 90 wide × 76 tall
      Wall plate mounts on the RIGHT edge (x≈82–90), flush to top.
      J-arm sweeps left-and-down, cup/bobeche sits at bottom holding the candle.
    */
    <svg
      width="90" height="76"
      viewBox="0 0 90 76"
      fill="none"
      overflow="visible"
      style={{ display: "block", margin: 0, verticalAlign: "bottom" }}
    >
      <defs>
        {/* ── Polished brass gradients ── */}
        <linearGradient id="brassArm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(40 60% 28%)" />
          <stop offset="18%"  stopColor="hsl(42 70% 42%)" />
          <stop offset="40%"  stopColor="hsl(44 90% 62%)" />
          <stop offset="60%"  stopColor="hsl(44 95% 72%)" />
          <stop offset="78%"  stopColor="hsl(42 75% 48%)" />
          <stop offset="100%" stopColor="hsl(40 55% 30%)" />
        </linearGradient>
        <linearGradient id="brassArmV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="hsl(44 90% 68%)" />
          <stop offset="50%"  stopColor="hsl(42 80% 50%)" />
          <stop offset="100%" stopColor="hsl(40 60% 32%)" />
        </linearGradient>
        <linearGradient id="brassPlate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(40 55% 30%)" />
          <stop offset="40%"  stopColor="hsl(44 90% 60%)" />
          <stop offset="100%" stopColor="hsl(40 50% 25%)" />
        </linearGradient>
        <radialGradient id="brassCup" cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="hsl(44 95% 78%)" />
          <stop offset="50%"  stopColor="hsl(43 85% 55%)" />
          <stop offset="100%" stopColor="hsl(40 60% 30%)" />
        </radialGradient>
        <linearGradient id="waxBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(30 18% 62%)" />
          <stop offset="30%"  stopColor="hsl(0 0% 96%)" />
          <stop offset="50%"  stopColor="hsl(0 0% 99%)" />
          <stop offset="70%"  stopColor="hsl(0 0% 94%)" />
          <stop offset="100%" stopColor="hsl(30 18% 60%)" />
        </linearGradient>
        <radialGradient id="meltTop" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="hsl(0 0% 97%)" />
          <stop offset="100%" stopColor="hsl(30 12% 78%)" />
        </radialGradient>
        {/* ── Glow / filters ── */}
        <filter id="scHalo" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="scFlameGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="scSmoke" x="-200%" y="-300%" width="500%" height="600%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="brassSheen" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ══════════════════════════════════════════
          WALL PLATE — right edge, full navbar height
          ══════════════════════════════════════════ */}
      {/* Back shadow */}
      <rect x="84" y="0" width="9" height="76" rx="1" fill="hsl(40 30% 12%)" opacity="0.6" />
      {/* Plate face */}
      <rect x="83" y="0" width="7" height="76" rx="1.5" fill="url(#brassPlate)" />
      {/* Plate highlight stripe */}
      <rect x="85" y="2" width="1.5" height="72" rx="0.8" fill="hsl(44 95% 82%)" opacity="0.5" />
      {/* Mounting screws */}
      <circle cx="86.5" cy="10" r="2" fill="url(#brassCup)" />
      <circle cx="86.5" cy="10" r="0.7" fill="hsl(44 90% 78%)" />
      <circle cx="86.5" cy="66" r="2" fill="url(#brassCup)" />
      <circle cx="86.5" cy="66" r="0.7" fill="hsl(44 90% 78%)" />

      {/* ══════════════════════════════════════════
          J-CURVE ARM — sweeps from plate to cup
          ══════════════════════════════════════════ */}
      {/* Arm shadow */}
      <path
        d={`M83,18 C76,18 64,20 58,32 C52,44 52,58 ${cx + 2},62`}
        stroke="hsl(40 30% 12%)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Arm dark edge (bottom) */}
      <path
        d={`M83,20 C76,20 64,22 58,34 C52,46 52,60 ${cx},64`}
        stroke="hsl(40 50% 25%)"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arm main brass */}
      <path
        d={`M83,18 C76,18 64,20 58,32 C52,44 52,58 ${cx},62`}
        stroke="url(#brassArm)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#brassSheen)"
      />
      {/* Arm highlight (top specular) */}
      <path
        d={`M83,17 C76,17 64,19 58,31 C52,43 52,57 ${cx},61`}
        stroke="hsl(44 95% 82%)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      {/* ══════════════════════════════════════════
          BOBECHE / CUP — holds the candle
          ══════════════════════════════════════════ */}
      {/* Cup shadow */}
      <ellipse cx={cx + 1} cy="66" rx="11" ry="3.5" fill="hsl(40 30% 12%)" opacity="0.5" />
      {/* Cup body */}
      <ellipse cx={cx} cy="64" rx="11" ry="3.5" fill="url(#brassCup)" />
      {/* Cup rim highlight */}
      <ellipse cx={cx} cy="63" rx="9" ry="1.8" fill="hsl(44 95% 80%)" opacity="0.4" />
      {/* Collar beneath cup */}
      <rect x={cx - 5} y="64" width="10" height="3.5" rx="0.5" fill="url(#brassArmV)" />
      {/* Collar base ring */}
      <ellipse cx={cx} cy="68" rx="5.5" ry="1.5" fill="url(#brassCup)" />

      {/* ══════════════════════════════════════════
          SMOKE
          ══════════════════════════════════════════ */}
      {smokeParticles.map(p => (
        <motion.ellipse
          key={p.id}
          cx={cx + p.x}
          cy={flameBaseY - 10}
          rx="3" ry="2"
          fill="hsl(220 10% 75%)"
          filter="url(#scSmoke)"
          initial={{ opacity: 0.5, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -28, scale: 2.5, x: p.x * 2 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: p.delay }}
        />
      ))}

      {/* ══════════════════════════════════════════
          AMBIENT HALO
          ══════════════════════════════════════════ */}
      {flameFade > 0 && (
        <ellipse
          cx={cx} cy={flameBaseY - 5}
          rx="13" ry="10"
          fill="hsl(38 100% 58%)"
          opacity={haloOpacity}
          filter="url(#scHalo)"
        />
      )}

      {/* ══════════════════════════════════════════
          FLAME
          ══════════════════════════════════════════ */}
      {flameFade > 0 && (
        <g transform={`translate(${cx}, ${flameBaseY})`} filter="url(#scFlameGlow)">
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

      {/* ══════════════════════════════════════════
          WICK
          ══════════════════════════════════════════ */}
      <line
        x1={cx} y1={wickY - 0.5} x2={cx} y2={waxTop + 2}
        stroke="hsl(25 30% 22%)" strokeWidth="1.4" strokeLinecap="round"
      />

      {/* ══════════════════════════════════════════
          CANDLE BODY
          ══════════════════════════════════════════ */}
      <rect x={cx - 7} y={waxTop} width="14" height={waxH} fill="url(#waxBody)" rx="1.5" />

      {/* Melted concave top */}
      <ellipse cx={cx} cy={waxTop} rx="7" ry={1.8 + (progress / 100) * 1.2} fill="url(#meltTop)" opacity="0.9" />

      {/* Puddle at cup */}
      {progress > 50 && (
        <ellipse
          cx={cx} cy={waxBottom - 4}
          rx={4 + (progress - 50) / 22}
          ry={1 + (progress - 50) / 90}
          fill="hsl(0 0% 90%)"
          opacity={Math.min(0.55, (progress - 50) / 60)}
        />
      )}

      {/* Drip 1 — left */}
      {drip1 > 0 && (
        <path
          d={`M${cx - 5} ${waxTop + 2} Q${cx - 7} ${waxTop + 8} ${cx - 6.5} ${Math.min(waxTop + 16, waxBottom - 8)}`}
          stroke="hsl(0 0% 88%)" strokeWidth="2" strokeLinecap="round" fill="none" opacity={drip1}
        />
      )}
      {/* Drip 2 — right */}
      {drip2 > 0 && (
        <path
          d={`M${cx + 5} ${waxTop + 3} Q${cx + 7} ${waxTop + 9} ${cx + 6} ${Math.min(waxTop + 17, waxBottom - 7)}`}
          stroke="hsl(0 0% 86%)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity={drip2}
        />
      )}
      {/* Drip 3 — center-left */}
      {drip3 > 0 && (
        <path
          d={`M${cx - 2} ${waxTop + 1} Q${cx - 4} ${waxTop + 7} ${cx - 3} ${Math.min(waxTop + 13, waxBottom - 9)}`}
          stroke="hsl(0 0% 91%)" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity={drip3}
        />
      )}
    </svg>
  );
};

/* ─── Resource Bar ────────────────────────────────────────────────────────── */
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
      className="fixed top-0 left-0 right-0 z-50 overflow-visible"
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
      <div className="px-5 pt-3 pb-0 max-w-5xl mx-auto flex items-center gap-6">

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

        {/* Wall Sconce — right edge, overflows navbar bottom */}
        <div
          className="ml-auto shrink-0"
          style={{ padding: 0, margin: 0, lineHeight: 0, alignSelf: "flex-end", marginBottom: "-1px" }}
        >
          <WallSconce progress={progress} />
        </div>

      </div>
    </motion.header>
  );
};

export default ResourceBar;
  { id: "hero",     label: "The Hero"  },
  { id: "projects", label: "The Quest" },
  { id: "games",    label: "The Board" },
  { id: "contact",  label: "The Lobby" },
];

const Candle = ({ progress }: { progress: number }) => {
  const [flicker, setFlicker] = useState({ sx: 1, sy: 1, tx: 0, o: 1, rot: 0 });
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; x: number; delay: number }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smokeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const smokeId = useRef(0);

  const isExtinguished = progress >= 98;
  const flameFade = progress > 90 ? Math.max(0, 1 - (progress - 90) / 8) : 1;

  // Constant flicker — same intensity throughout
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

  // Smoke particles when nearly extinguished
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

  // Candle burns DOWN — wax top descends, body shrinks
  const maxWaxH = 38;
  const minWaxH = 5;
  const waxBottom = 68;                                          // fixed bottom — flush with SVG bottom edge
  const waxH = maxWaxH - ((maxWaxH - minWaxH) * (progress / 100)); // shrinks
  const waxTop = waxBottom - waxH;
  const wickY  = waxTop - 1;

  // Flame — fixed size, always same, just flickers
  const flameBaseY = wickY - 1;
  const outerFlame = "M0,-17 C6,-12 7,-4 4.5,-0.8 C2.2,1.5 -2.2,1.5 -4.5,-0.8 C-7,-4 -6,-12 0,-17 Z";
  const midFlame   = "M0,-12 C3.8,-7.5 5,-2.5 3,0 C1.5,1.2 -1.5,1.2 -3,0 C-5,-2.5 -3.8,-7.5 0,-12 Z";
  const coreFlame  = "M0,-7 C2,-4.5 2.2,-1.5 1.2,0.2 C0.6,1 -0.6,1 -1.2,0.2 C-2.2,-1.5 -2,-4.5 0,-7 Z";

  // Glow — steady
  const haloOpacity = 0.45 * flicker.o * flameFade;

  // Wax drips based on progress
  const drip1Opacity = progress > 20 ? Math.min(1, (progress - 20) / 25) : 0;
  const drip2Opacity = progress > 40 ? Math.min(1, (progress - 40) / 25) : 0;
  const drip3Opacity = progress > 60 ? Math.min(1, (progress - 60) / 20) : 0;

  return (
    <svg width="32" height="68" viewBox="0 0 32 68" fill="none" overflow="visible" style={{ display: "block", margin: 0, verticalAlign: "bottom" }}>
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
        {/* Melted top — rounded rim when low */}
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

      {/* SMOKE PARTICLES */}
      {smokeParticles.map(p => (
        <motion.ellipse
          key={p.id}
          cx={16 + p.x}
          cy={flameBaseY - 10}
          rx="3" ry="2"
          fill="hsl(220 10% 75%)"
          filter="url(#smoke)"
          initial={{ opacity: 0.5, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -28, scale: 2.5, x: p.x * 2 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: p.delay }}
        />
      ))}

      {/* AMBIENT HALO */}
      {flameFade > 0 && (
        <ellipse
          cx="16" cy={flameBaseY - 5}
          rx="12" ry="9"
          fill="hsl(38 100% 58%)"
          opacity={haloOpacity}
          filter="url(#halo2)"
        />
      )}

      {/* FLAME */}
      {flameFade > 0 && (
        <g transform={`translate(16, ${flameBaseY})`} filter="url(#flameGlow2)">
          <g
            style={{
              transformOrigin: "0px 0px",
              transform: `scaleX(${flicker.sx}) scaleY(${flicker.sy}) translateX(${flicker.tx}px) rotate(${flicker.rot}deg)`,
              opacity: flicker.o * flameFade,
              transition: "transform 0.06s ease-out, opacity 0.15s ease-out",
            }}
          >
            <path d={outerFlame} fill="hsl(28 100% 48%)" opacity="0.9" />
            <path d={midFlame}   fill="hsl(43 100% 60%)" />
            <path d={coreFlame}  fill="hsl(55 100% 92%)" />
          </g>
        </g>
      )}

      {/* WICK */}
      <line
        x1="16" y1={wickY - 0.5} x2="16" y2={waxTop + 2}
        stroke="hsl(25 30% 22%)" strokeWidth="1.4" strokeLinecap="round"
      />

      {/* CANDLE BODY — shrinks from top */}
      <rect x="7" y={waxTop} width="18" height={waxH}
        fill="url(#waxGrad2)" rx="1.5" />

      {/* Melted concave top */}
      <ellipse cx="16" cy={waxTop} rx="9" ry={2 + (progress / 100) * 1.5}
        fill="url(#meltTop)" opacity="0.9" />

      {/* Puddle at base — grows as candle melts */}
      {progress > 50 && (
        <ellipse
          cx="16" cy={waxBottom + 1}
          rx={5 + (progress - 50) / 20}
          ry={1.2 + (progress - 50) / 80}
          fill="hsl(0 0% 90%)"
          opacity={Math.min(0.6, (progress - 50) / 60)}
        />
      )}

      {/* Bottom grounding shadow */}
      <ellipse cx="16" cy={waxBottom + 0.5} rx="8.5" ry="1.2"
        fill="hsl(30 18% 50%)" opacity="0.25" />

      {/* Wax drip 1 — left */}
      {drip1Opacity > 0 && (
        <path
          d={`M9 ${waxTop + 2} Q7.2 ${waxTop + 9} 7.8 ${Math.min(waxTop + 17, waxBottom - 4)}`}
          stroke="hsl(0 0% 88%)" strokeWidth="2.2" strokeLinecap="round" fill="none"
          opacity={drip1Opacity}
        />
      )}
      {/* Wax drip 2 — right */}
      {drip2Opacity > 0 && (
        <path
          d={`M23 ${waxTop + 3} Q24.5 ${waxTop + 10} 23.8 ${Math.min(waxTop + 19, waxBottom - 3)}`}
          stroke="hsl(0 0% 86%)" strokeWidth="1.8" strokeLinecap="round" fill="none"
          opacity={drip2Opacity}
        />
      )}
      {/* Wax drip 3 — center-left, late */}
      {drip3Opacity > 0 && (
        <path
          d={`M13 ${waxTop + 1} Q11.5 ${waxTop + 7} 12 ${Math.min(waxTop + 14, waxBottom - 5)}`}
          stroke="hsl(0 0% 91%)" strokeWidth="1.5" strokeLinecap="round" fill="none"
          opacity={drip3Opacity}
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
      <div className="px-5 pt-3 pb-0 max-w-5xl mx-auto flex items-center gap-6">

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

        {/* Candle — right side, flush to navbar bottom */}
        <div className="ml-auto shrink-0" style={{ padding: 0, margin: 0, lineHeight: 0, alignSelf: "flex-end", marginBottom: "-1px" }}>
          <Candle progress={progress} />
        </div>

      </div>
    </motion.header>
  );
};

export default ResourceBar;
