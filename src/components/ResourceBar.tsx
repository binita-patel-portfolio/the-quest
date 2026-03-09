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

  // Candle burns down
  const maxWaxH = 30;
  const minWaxH = 4;
  const waxBottom = 74;
  const waxH   = maxWaxH - ((maxWaxH - minWaxH) * (progress / 100));
  const waxTop = waxBottom - waxH;
  const wickY  = waxTop - 1;
  const flameBaseY = wickY - 1;

  // Flame paths
  const outerFlame = "M0,-17 C6,-12 7,-4 4.5,-0.8 C2.2,1.5 -2.2,1.5 -4.5,-0.8 C-7,-4 -6,-12 0,-17 Z";
  const midFlame   = "M0,-12 C3.8,-7.5 5,-2.5 3,0 C1.5,1.2 -1.5,1.2 -3,0 C-5,-2.5 -3.8,-7.5 0,-12 Z";
  const coreFlame  = "M0,-7 C2,-4.5 2.2,-1.5 1.2,0.2 C0.6,1 -0.6,1 -1.2,0.2 C-2.2,-1.5 -2,-4.5 0,-7 Z";

  const haloOpacity = 0.5 * flicker.o * flameFade;

  const drip1 = progress > 20 ? Math.min(1, (progress - 20) / 25) : 0;
  const drip2 = progress > 45 ? Math.min(1, (progress - 45) / 25) : 0;
  const drip3 = progress > 65 ? Math.min(1, (progress - 65) / 20) : 0;

  // Candle centerline x inside SVG
  const cx = 34;

  return (
    /*
      SVG: 92 wide × 76 tall
      Wall plate: right edge (x≈84-92), full height
      J-arm: curves from plate down-left to cup at bottom
      Cup/bobeche holds candle at bottom-left area
    */
    <svg
      width="92" height="76"
      viewBox="0 0 92 76"
      fill="none"
      overflow="visible"
      style={{ display: "block", margin: 0, verticalAlign: "bottom" }}
    >
      <defs>
        {/* Polished brass — horizontal sheen */}
        <linearGradient id="brassH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(40 55% 25%)" />
          <stop offset="15%"  stopColor="hsl(42 70% 40%)" />
          <stop offset="38%"  stopColor="hsl(44 88% 60%)" />
          <stop offset="55%"  stopColor="hsl(45 95% 72%)" />
          <stop offset="75%"  stopColor="hsl(42 78% 48%)" />
          <stop offset="100%" stopColor="hsl(40 52% 28%)" />
        </linearGradient>
        {/* Polished brass — vertical sheen for arm */}
        <linearGradient id="brassV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="hsl(44 90% 70%)" />
          <stop offset="45%"  stopColor="hsl(43 82% 52%)" />
          <stop offset="100%" stopColor="hsl(40 58% 30%)" />
        </linearGradient>
        {/* Wall plate gradient */}
        <linearGradient id="brassPlate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="hsl(40 50% 22%)" />
          <stop offset="35%"  stopColor="hsl(44 88% 58%)" />
          <stop offset="65%"  stopColor="hsl(44 92% 65%)" />
          <stop offset="100%" stopColor="hsl(40 48% 22%)" />
        </linearGradient>
        {/* Bobeche cup */}
        <radialGradient id="brassCup" cx="40%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="hsl(45 95% 80%)" />
          <stop offset="45%"  stopColor="hsl(43 85% 55%)" />
          <stop offset="100%" stopColor="hsl(40 58% 28%)" />
        </radialGradient>
        {/* Wax body */}
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

        {/* Filters */}
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
        <filter id="brassGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="0.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── WALL PLATE ── */}
      {/* Shadow behind plate */}
      <rect x="85" y="0" width="9" height="76" rx="1" fill="hsl(40 20% 8%)" opacity="0.7" />
      {/* Plate */}
      <rect x="84" y="0" width="7.5" height="76" rx="1.5" fill="url(#brassPlate)" />
      {/* Highlight stripe */}
      <rect x="86.5" y="3" width="1.5" height="70" rx="0.8" fill="hsl(45 95% 85%)" opacity="0.45" />
      {/* Screws */}
      <circle cx="87.5" cy="10" r="2.2" fill="url(#brassCup)" />
      <circle cx="87.5" cy="10" r="0.8" fill="hsl(45 90% 80%)" />
      <circle cx="87.5" cy="66" r="2.2" fill="url(#brassCup)" />
      <circle cx="87.5" cy="66" r="0.8" fill="hsl(45 90% 80%)" />

      {/* ── J-CURVE ARM ── */}
      {/* Drop shadow */}
      <path
        d={`M84,20 C74,20 60,22 54,36 C48,50 50,62 ${cx + 1},66`}
        stroke="hsl(40 20% 8%)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      {/* Dark underside edge */}
      <path
        d={`M84,22 C74,22 60,24 54,38 C48,52 50,64 ${cx},68`}
        stroke="hsl(40 45% 22%)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Main brass arm */}
      <path
        d={`M84,19 C74,19 60,21 54,35 C48,49 50,62 ${cx},66`}
        stroke="url(#brassH)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        filter="url(#brassGlow)"
      />
      {/* Top specular highlight */}
      <path
        d={`M84,18 C74,18 60,20 54,34 C48,48 50,61 ${cx},65`}
        stroke="hsl(45 95% 84%)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* ── BOBECHE / CUP ── */}
      {/* Cup shadow */}
      <ellipse cx={cx + 1} cy="70" rx="12" ry="3.8" fill="hsl(40 20% 8%)" opacity="0.5" />
      {/* Cup dish */}
      <ellipse cx={cx} cy="68" rx="12" ry="3.8" fill="url(#brassCup)" />
      {/* Cup highlight */}
      <ellipse cx={cx - 1} cy="67" rx="8.5" ry="1.8" fill="hsl(45 95% 82%)" opacity="0.38" />
      {/* Collar */}
      <rect x={cx - 5.5} y="68" width="11" height="4" rx="0.6" fill="url(#brassV)" />
      {/* Base ring */}
      <ellipse cx={cx} cy="72.5" rx="6" ry="1.6" fill="url(#brassCup)" />

      {/* ── SMOKE ── */}
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

      {/* ── HALO ── */}
      {flameFade > 0 && (
        <ellipse
          cx={cx} cy={flameBaseY - 5}
          rx="14" ry="11"
          fill="hsl(38 100% 58%)"
          opacity={haloOpacity}
          filter="url(#scHalo)"
        />
      )}

      {/* ── FLAME ── */}
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

      {/* ── WICK ── */}
      <line
        x1={cx} y1={wickY - 0.5} x2={cx} y2={waxTop + 2}
        stroke="hsl(25 30% 22%)" strokeWidth="1.4" strokeLinecap="round"
      />

      {/* ── CANDLE BODY ── */}
      <rect x={cx - 7} y={waxTop} width="14" height={waxH} fill="url(#waxBody)" rx="1.5" />

      {/* Melted top */}
      <ellipse cx={cx} cy={waxTop} rx="7" ry={1.8 + (progress / 100) * 1.2} fill="url(#meltTop)" opacity="0.9" />

      {/* Wax puddle */}
      {progress > 50 && (
        <ellipse
          cx={cx} cy={waxBottom - 2}
          rx={4.5 + (progress - 50) / 22}
          ry={1 + (progress - 50) / 90}
          fill="hsl(0 0% 90%)"
          opacity={Math.min(0.55, (progress - 50) / 60)}
        />
      )}

      {/* Drip 1 */}
      {drip1 > 0 && (
        <path
          d={`M${cx - 5} ${waxTop + 2} Q${cx - 7} ${waxTop + 8} ${cx - 6.5} ${Math.min(waxTop + 16, waxBottom - 8)}`}
          stroke="hsl(0 0% 88%)" strokeWidth="2" strokeLinecap="round" fill="none" opacity={drip1}
        />
      )}
      {/* Drip 2 */}
      {drip2 > 0 && (
        <path
          d={`M${cx + 5} ${waxTop + 3} Q${cx + 7} ${waxTop + 9} ${cx + 6} ${Math.min(waxTop + 17, waxBottom - 7)}`}
          stroke="hsl(0 0% 86%)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity={drip2}
        />
      )}
      {/* Drip 3 */}
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
