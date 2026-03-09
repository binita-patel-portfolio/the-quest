import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero",     label: "The Hero"  },
  { id: "projects", label: "The Quest" },
  { id: "games",    label: "The Board" },
  { id: "contact",  label: "The Lobby" },
];

const G  = "hsl(45 72% 52%)";   // gold
const GD = "hsl(38 55% 32%)";   // dark gold
const GL = "hsl(52 90% 76%)";   // light gold highlight

// 5 candle arm endpoints [armAttachX, armAttachY, candleX, candleY]
const ARMS = [
  { sx: 18,  sy: 61, cx: 13,  cy: 106 },
  { sx: 42,  sy: 57, cx: 42,  cy: 88  },
  { sx: 70,  sy: 54, cx: 70,  cy: 88  },
  { sx: 98,  sy: 57, cx: 98,  cy: 88  },
  { sx: 122, sy: 61, cx: 127, cy: 106 },
] as const;

interface Flicker { sx: number; sy: number; tx: number; o: number; rot: number }

const rndFlicker = (): Flicker => ({
  sx:  0.80 + Math.random() * 0.40,
  sy:  0.85 + Math.random() * 0.30,
  tx:  (Math.random() - 0.5) * 2.5,
  o:   0.80 + Math.random() * 0.20,
  rot: (Math.random() - 0.5) * 14,
});

// ── Individual tiny chandelier flame ──────────────────────────────────────────
const Flame = ({
  cx, cy, flicker, fade,
}: { cx: number; cy: number; flicker: Flicker; fade: number }) => {
  if (fade <= 0) return null;
  return (
    <g>
      {/* Ambient halo */}
      <ellipse
        cx={cx} cy={cy - 4}
        rx="7" ry="5.5"
        fill="hsl(38 100% 58%)"
        opacity={0.48 * flicker.o * fade}
        filter="url(#hC)"
      />
      {/* Flame */}
      <g transform={`translate(${cx},${cy})`} filter="url(#fgC)">
        <g style={{
          transformOrigin: "0 0",
          transform: `scaleX(${flicker.sx}) scaleY(${flicker.sy}) translateX(${flicker.tx}px) rotate(${flicker.rot}deg)`,
          opacity: flicker.o * fade,
          transition: "transform 0.06s ease-out, opacity 0.25s",
        }}>
          <path d="M0,-11 C4.5,-7.5 5,-2.5 2.8,-0.5 C1.3,0.9 -1.3,0.9 -2.8,-0.5 C-5,-2.5 -4.5,-7.5 0,-11 Z"
                fill="hsl(28 100% 48%)" opacity="0.9"/>
          <path d="M0,-7.5 C2.8,-4.5 3.2,-1 1.6,0.3 C0.7,0.9 -0.7,0.9 -1.6,0.3 C-3.2,-1 -2.8,-4.5 0,-7.5 Z"
                fill="hsl(43 100% 62%)"/>
          <path d="M0,-4 C1.3,-2.2 1.4,-0.5 0.5,0.2 C0.2,0.5 -0.2,0.5 -0.5,0.2 C-1.4,-0.5 -1.3,-2.2 0,-4 Z"
                fill="hsl(55 100% 93%)"/>
        </g>
      </g>
    </g>
  );
};

// ── Chandelier SVG ─────────────────────────────────────────────────────────────
const Chandelier = ({ progress }: { progress: number }) => {
  const [flickers, setFlickers] = useState<Flicker[]>(() => ARMS.map(() => rndFlicker()));
  const timer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const isOut    = progress >= 98;
  const flameFade = progress > 90 ? Math.max(0, 1 - (progress - 90) / 8) : 1;

  // Self-scheduling timeout — interval increases as scroll deepens (after 60%)
  useEffect(() => {
    if (isOut) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    const tick = () => {
      setFlickers(ARMS.map(() => rndFlicker()));
      const p = progressRef.current;
      const delay = p < 60
        ? 78
        : 78 + ((p - 60) / 38) * 2400;   // 78 ms → ~2478 ms at 98%
      timer.current = setTimeout(tick, delay);
    };
    timer.current = setTimeout(tick, 78);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [isOut]);

  return (
    <svg
      width="140" height="160"
      viewBox="0 0 140 160"
      overflow="visible"
      style={{ display: "block" }}
    >
      <defs>
        <filter id="hC" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
        <filter id="fgC" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── CHAIN ── */}
      <line x1="70" y1="0" x2="70" y2="13" stroke={G} strokeWidth="1.6"/>
      {[15, 20, 25].map(y => (
        <ellipse key={y} cx="70" cy={y} rx="4.5" ry="2.1"
          fill="none" stroke={G} strokeWidth="1.2"/>
      ))}
      <line x1="70" y1="27" x2="70" y2="34" stroke={G} strokeWidth="1.6"/>

      {/* ── CROWN DISC ── */}
      <circle cx="70" cy="38.5" r="6" fill={GD} stroke={G} strokeWidth="1.3"/>
      <circle cx="70" cy="38.5" r="2.8" fill={G} opacity="0.85"/>
      {/* tiny crown spikes */}
      {[-8,-4,0,4,8].map((dx,i) => (
        <line key={i}
          x1={70+dx} y1="33" x2={70+dx*0.6} y2="30"
          stroke={G} strokeWidth="0.9" opacity="0.7"/>
      ))}

      {/* ── VERTICAL ROD ── */}
      <line x1="70" y1="44" x2="70" y2="58" stroke={G} strokeWidth="2"/>

      {/* ── HORIZONTAL BAR — upward arch ── */}
      <path d="M13,64 Q70,54 127,64"
        fill="none" stroke={G} strokeWidth="2.2" filter="url(#glow)"/>
      {/* sheen highlight */}
      <path d="M13,63 Q70,53 127,63"
        fill="none" stroke={GL} strokeWidth="0.6" opacity="0.55"/>

      {/* Bar end ornaments */}
      <circle cx="13"  cy="64" r="4" fill={GD} stroke={G} strokeWidth="1.1"/>
      <circle cx="127" cy="64" r="4" fill={GD} stroke={G} strokeWidth="1.1"/>
      <circle cx="13"  cy="64" r="1.5" fill={GL} opacity="0.7"/>
      <circle cx="127" cy="64" r="1.5" fill={GL} opacity="0.7"/>

      {/* ── CENTRE CRYSTAL PENDANT ── */}
      <line x1="70" y1="58" x2="70" y2="66" stroke={G} strokeWidth="1.3"/>
      <path d="M65.5,66 L70,78 L74.5,66 Z"
        fill={G} opacity="0.6" stroke={GL} strokeWidth="0.6"/>
      <line x1="67" y1="68.5" x2="73" y2="68.5" stroke={GL} strokeWidth="0.5" opacity="0.7"/>

      {/* ── ARMS ── */}
      {/* Far left  */ }
      <path d="M18,62 C16,75 13,90 13,106"   fill="none" stroke={G} strokeWidth="1.4"/>
      {/* Near left */}
      <path d="M42,58 Q41,72 42,88"           fill="none" stroke={G} strokeWidth="1.4"/>
      {/* Centre    */}
      <line x1="70" y1="58" x2="70" y2="88"  stroke={G} strokeWidth="1.4"/>
      {/* Near right*/}
      <path d="M98,58 Q99,72 98,88"           fill="none" stroke={G} strokeWidth="1.4"/>
      {/* Far right */}
      <path d="M122,62 C124,75 127,90 127,106" fill="none" stroke={G} strokeWidth="1.4"/>

      {/* ── CANDLES + FLAMES ── */}
      {ARMS.map(({ cx, cy }, i) => (
        <g key={i}>
          {/* Wax cup rim */}
          <path d={`M${cx-5},${cy} Q${cx},${cy-3} ${cx+5},${cy}`}
            fill="none" stroke={G} strokeWidth="1.4"/>
          {/* Cup drip sides */}
          <line x1={cx-5} y1={cy} x2={cx-4} y2={cy+3}
            stroke={GD} strokeWidth="0.8"/>
          <line x1={cx+5} y1={cy} x2={cx+4} y2={cy+3}
            stroke={GD} strokeWidth="0.8"/>
          {/* Candle body */}
          <rect x={cx-4} y={cy} width={8} height={12} rx={1.5}
            fill="hsl(0 0% 93%)" stroke={GD} strokeWidth="0.6"/>
          {/* Candle highlight */}
          <line x1={cx-1.5} y1={cy+2} x2={cx-1.5} y2={cy+9}
            stroke="hsl(0 0% 100%)" strokeWidth="1.2" opacity="0.4"/>
          {/* Wick */}
          <line x1={cx} y1={cy} x2={cx} y2={cy-2.5}
            stroke="hsl(25 30% 20%)" strokeWidth="0.9" strokeLinecap="round"/>
          {/* Flame */}
          <Flame cx={cx} cy={cy - 1} flicker={flickers[i]} fade={flameFade}/>
        </g>
      ))}
    </svg>
  );
};

// ── Resource Bar ───────────────────────────────────────────────────────────────
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
    <>
      {/* ── Dark curtain — all flames out at 98% ── */}
      <AnimatePresence>
        {progress >= 98 && (
          <motion.div
            key="dark-overlay"
            className="fixed inset-0 z-40 pointer-events-none"
            style={{ background: "hsl(220 25% 6%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.78 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── Chandelier — hangs from top-right corner ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 24,
          zIndex: 51,
          pointerEvents: "none",
          lineHeight: 0,
        }}
      >
        <Chandelier progress={progress} />
      </div>

      {/* ── Navigation bar ── */}
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
        <div className="px-5 pt-3 pb-2.5 max-w-5xl mx-auto flex items-center gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="px-2.5 py-1"
              style={{
                background: "hsl(var(--bauhaus-yellow))",
                border: "2px solid hsl(var(--bauhaus-black))",
              }}
            >
              <span className="font-title text-xs tracking-[0.1em] uppercase"
                    style={{ color: "hsl(var(--bauhaus-black))" }}>
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

        </div>
      </motion.header>
    </>
  );
};

export default ResourceBar;
