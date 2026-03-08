import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BGA_FRIEND_URL = "https://boardgamearena.com/player?id=93647301";
const BGA_PLAY_URL   = "https://en.boardgamearena.com/";
const PLAYER_NAME    = "Its_Me_Raghi";

const GAMES: { name: string; note: string; color: string; fg: string }[] = [
  { name: "Castles of Burgundy", note: "My absolute #1 — but you can never roll a 1! The dice gods keep this gem safe.", color: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },
  { name: "Wingspan",            note: "Birds, eggs, and habitats — the most beautiful game ever made.",                color: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },
  { name: "Great Western Trail", note: "Cattle drives, buildings, and a hand-crafted engine — deeply satisfying.",      color: "hsl(var(--bauhaus-red))",    fg: "hsl(var(--bauhaus-white))" },
  { name: "Terraforming Mars",   note: "Turning a red planet green — card combos are chef's kiss.",                     color: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },
  { name: "Carcassonne",         note: "Tile by tile a world is built — never gets old.",                               color: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },
  { name: "Dominion",            note: "The original deck-builder — every kingdom is a new puzzle.",                   color: "hsl(var(--bauhaus-red))",    fg: "hsl(var(--bauhaus-white))" },
  { name: "Harmonies",           note: "Placing tokens to create beautiful landscapes — so peaceful.",                 color: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },
  { name: "Alhambra",            note: "Building a palace tile by tile — managing currencies is the fun part.",        color: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },
  { name: "Robinson Crusoe",     note: "Co-op survival on a deserted island — brutally hard and brilliant.",           color: "hsl(var(--bauhaus-red))",    fg: "hsl(var(--bauhaus-white))" },
  { name: "Otys",                note: "Diving for resources in a layered grid — uniquely clever mechanics.",          color: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },
  { name: "Castles of Tuscany",  note: "A lighter sibling of Burgundy — still incredibly rewarding.",                 color: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },
  { name: "Arboretum",           note: "A card game about trees — stunning art and cutthroat scoring.",                color: "hsl(var(--bauhaus-red))",    fg: "hsl(var(--bauhaus-white))" },
];

// Strict 3-colour palette: Blue · Orange · Yellow
// Grid is 6 cols × 2 rows — each cell differs from all its neighbours.
//        col→  0      1      2      3      4      5
// row 0:       B      Y      O      Y      B      O
// row 1:       O      B      Y      B      O      Y
const TILE_PALETTE = [
  { bg: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },  //  1  B  (Card #1 anchor)
  { bg: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },  //  2  Y
  { bg: "hsl(25 100% 52%)",           fg: "hsl(var(--bauhaus-white))" },  //  3  O
  { bg: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },  //  4  Y
  { bg: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },  //  5  B
  { bg: "hsl(25 100% 52%)",           fg: "hsl(var(--bauhaus-white))" },  //  6  O
  { bg: "hsl(25 100% 52%)",           fg: "hsl(var(--bauhaus-white))" },  //  7  O
  { bg: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },  //  8  B
  { bg: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },  //  9  Y
  { bg: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },  // 10  B
  { bg: "hsl(25 100% 52%)",           fg: "hsl(var(--bauhaus-white))" },  // 11  O
  { bg: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },  // 12  Y
];

const DieFace = ({ value, rolling }: { value: number; rolling: boolean }) => {
  const dots: [number, number][][] = [
    [[50, 50]],
    [[25, 25], [75, 75]],
    [[25, 25], [50, 50], [75, 75]],
    [[25, 25], [75, 25], [25, 75], [75, 75]],
    [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]],
  ];
  const positions = dots[(value - 1)] ?? dots[0];
  return (
    <motion.div
      animate={rolling ? { rotate: [0, 15, -12, 18, -8, 0], scale: [1, 1.1, 0.95, 1.08, 0.98, 1] } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
      style={{
        width: 90, height: 90,
        background: "hsl(var(--bauhaus-white))",
        border: "3px solid hsl(var(--bauhaus-black))",
        boxShadow: "4px 4px 0 hsl(var(--bauhaus-black))",
        position: "relative", overflow: "hidden",
      }}
    >
      <svg width="90" height="90" viewBox="0 0 100 100" className="absolute inset-0">
        {positions.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={7} fill="hsl(var(--bauhaus-black))" />
        ))}
      </svg>
    </motion.div>
  );
};

// ─── Terminal Overlay ────────────────────────────────────────────────────────
const TERMINAL_LINES = [
  "> ERROR: Result '1' is mathematically unreachable with 2d6.",
  "> Current scope: [2 - 12].",
  "> STATUS: Legend-tier favorite is locked.",
  "> ACTION: Please authenticate via LinkedIn to decrypt.",
];

const VERIFY_LINES = [
  "> [SYSTEM]: LinkedIn Handshake Verified.",
  "> [SYSTEM]: Identity Confirmed: Binita Patel, Senior SEO Analyst.",
];

const SUCCESS_LINES = [
  "> Authentication Success.",
  "> Profile Verified: Binita Patel, Senior SEO Analyst.",
  "> Access Granted: Game #1 is revealed in the LinkedIn 'Featured' section.",
];

type Phase = "typing" | "ready" | "waiting" | "verifying" | "done";

const TerminalOverlay = ({ onClose }: { onClose: () => void }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [verifyLines, setVerifyLines] = useState<number>(0);
  const [successLines, setSuccessLines] = useState<number>(0);

  // typing phase
  useEffect(() => {
    if (phase !== "typing") return;
    if (visibleLines < TERMINAL_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 520);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("ready"), 400);
      return () => clearTimeout(t);
    }
  }, [phase, visibleLines]);

  // waiting — listen for tab return
  useEffect(() => {
    if (phase !== "waiting") return;
    const onVisible = () => {
      if (document.visibilityState === "visible") setPhase("verifying");
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [phase]);

  // verifying — show 2 system lines with 500ms delay each
  useEffect(() => {
    if (phase !== "verifying") return;
    if (verifyLines < VERIFY_LINES.length) {
      const t = setTimeout(() => setVerifyLines(v => v + 1), 500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("done"), 400);
      return () => clearTimeout(t);
    }
  }, [phase, verifyLines]);

  // done — show success lines
  useEffect(() => {
    if (phase !== "done") return;
    if (successLines < SUCCESS_LINES.length) {
      const t = setTimeout(() => setSuccessLines(v => v + 1), 600);
      return () => clearTimeout(t);
    }
  }, [phase, successLines]);

  const handleLinkedIn = () => {
    window.open("https://www.linkedin.com/in/binitapatel266/", "_blank", "noopener,noreferrer");
    setPhase("waiting");
  };

  const isDone      = phase === "done";
  const isWaiting   = phase === "waiting";
  const isVerifying = phase === "verifying";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "hsl(0 0% 0% / 0.82)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-xl font-mono"
          style={{
            background: "hsl(220 20% 6%)",
            border: `2px solid ${isDone ? "hsl(120 100% 40% / 0.9)" : "hsl(120 100% 40% / 0.6)"}`,
            boxShadow: "6px 6px 0 hsl(0 0% 0%)",
            transition: "border-color 0.4s",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{ background: "hsl(220 20% 10%)", borderBottom: "1px solid hsl(120 100% 40% / 0.3)" }}
          >
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "hsl(120 100% 40% / 0.6)" }}>
              game-1.exe
            </span>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6 cursor-pointer font-bold text-[11px] leading-none"
              style={{
                background: "hsl(var(--bauhaus-yellow))",
                color: "hsl(var(--bauhaus-black))",
                border: "none",
              }}
            >
              ✕
            </button>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-3 min-h-[200px]">

            {/* Error lines — cleared once verifying starts */}
            {phase !== "verifying" && phase !== "done" && TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div key={`init-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }} className="text-sm leading-relaxed"
                style={{ color: i === 0 ? "hsl(0 90% 65%)" : i === 3 ? "hsl(55 100% 65%)" : "hsl(120 80% 60%)" }}
              >
                {line}
              </motion.div>
            ))}

            {/* Blinking cursor while typing */}
            {phase === "typing" && (
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
                className="inline-block w-2.5 h-4 align-middle" style={{ background: "hsl(120 80% 60%)" }} />
            )}

            {/* Auth button */}
            {phase === "ready" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pt-3">
                <motion.button onClick={handleLinkedIn}
                  whileHover={{ y: -2, boxShadow: "0 0 18px hsl(55 100% 55% / 0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center px-5 py-2.5 text-xs tracking-widest uppercase cursor-pointer"
                  style={{ background: "hsl(55 100% 55%)", color: "hsl(220 20% 6%)", border: "2px solid hsl(55 100% 65%)", boxShadow: "0 0 10px hsl(55 100% 55% / 0.3)", fontWeight: 700 }}
                >
                  [ sudo authenticate --linkedin ]
                </motion.button>
              </motion.div>
            )}

            {/* Waiting for handshake */}
            {isWaiting && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pt-2 space-y-2">
                <div className="flex items-center gap-2 text-xs tracking-widest" style={{ color: "hsl(55 100% 65%)" }}>
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.1, repeat: Infinity }}>●</motion.span>
                  &gt; Waiting for Handshake...
                </div>
                <div className="text-[10px] tracking-wide opacity-50" style={{ color: "hsl(120 60% 60%)" }}>
                  Return to this tab after authenticating.
                </div>
              </motion.div>
            )}

            {/* Verification sequence */}
            {(isVerifying || isDone) && VERIFY_LINES.slice(0, verifyLines).map((line, i) => (
              <motion.div key={`verify-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }} className="text-sm leading-relaxed"
                style={{ color: "hsl(55 100% 70%)" }}
              >
                {line}
              </motion.div>
            ))}

            {/* Verifying cursor */}
            {isVerifying && (
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}
                className="inline-block w-2.5 h-4 align-middle" style={{ background: "hsl(55 100% 65%)" }} />
            )}

            {/* Success lines */}
            {isDone && SUCCESS_LINES.slice(0, successLines).map((line, i) => (
              <motion.div key={`success-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }} className="text-sm leading-relaxed font-bold"
                style={{ color: "hsl(120 90% 62%)" }}
              >
                {line}
              </motion.div>
            ))}

            {/* Final blinking cursor */}
            {isDone && successLines >= SUCCESS_LINES.length && (
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
                className="inline-block w-2.5 h-4 align-middle" style={{ background: "hsl(120 90% 62%)" }} />
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Single art-wall tile
const ArtTile = ({
  index, game, isGame1, isGame1Revealed, isRevealed, onGame1Click,
}: {
  index: number;
  game: typeof GAMES[number];
  isGame1: boolean;
  isGame1Revealed?: boolean;
  isRevealed: boolean;
  onGame1Click?: () => void;
}) => {
  const n = index + 1;
  const palette = TILE_PALETTE[index];
  const isWhiteFg = palette.fg === "hsl(var(--bauhaus-white))";

  if (isGame1 && !isGame1Revealed) {
    return (
      <motion.button
        onClick={onGame1Click}
        initial={{ x: 0 }}
        animate={{
          x: [0, -6, 6, -5, 5, -3, 3, -2, 2, 0],
          rotate: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
        }}
        transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
        whileHover={{ scale: 1.04, y: -4 }}
        className="relative flex flex-col items-center justify-center overflow-hidden cursor-pointer w-full"
        style={{
          background: "hsl(var(--bauhaus-blue))",
          aspectRatio: "1 / 1.1",
          border: "3px solid hsl(var(--bauhaus-black))",
          boxShadow: "4px 4px 0 hsl(var(--bauhaus-black))",
          outline: "none",
        }}
      >
        <span
          className="font-title select-none leading-none"
          style={{ fontSize: "clamp(2.5rem, 10vw, 4.5rem)", color: "hsl(var(--bauhaus-white))", opacity: 0.95 }}
        >
          ?
        </span>
        <span
          className="absolute bottom-2 left-0 right-0 text-center font-title text-[7px] tracking-[0.18em] uppercase"
          style={{ color: "hsl(var(--bauhaus-white) / 0.6)" }}
        >
          Top Pick · Click
        </span>
        <span
          className="absolute font-title select-none pointer-events-none"
          style={{ fontSize: "clamp(4rem, 14vw, 7rem)", lineHeight: 1, bottom: -8, right: 4, color: "hsl(0 0% 100% / 0.08)", letterSpacing: "-0.05em" }}
        >
          1
        </span>
      </motion.button>
    );
  }

  // Card #1 after LinkedIn reveal — animate in as vibrant blue tile
  if (isGame1 && isGame1Revealed) {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: [0.85, 1.08, 1], opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-col overflow-hidden"
        style={{
          background: "hsl(var(--bauhaus-blue))",
          color: "hsl(var(--bauhaus-white))",
          border: "3px solid hsl(var(--bauhaus-black))",
          boxShadow: "6px 6px 0 hsl(var(--bauhaus-black))",
          aspectRatio: "1 / 1.1",
          outline: "3px solid hsl(120 90% 62% / 0.7)",
          outlineOffset: "2px",
        }}
      >
        <span
          className="absolute font-title select-none pointer-events-none"
          style={{ fontSize: "clamp(3.5rem, 12vw, 6rem)", lineHeight: 1, bottom: -8, right: 4, color: "hsl(0 0% 100% / 0.12)", letterSpacing: "-0.05em" }}
        >
          1
        </span>
        <div className="relative z-10 flex flex-col h-full p-3 gap-1">
          <span className="font-title text-[8px] tracking-[0.18em] uppercase" style={{ color: "hsl(0 0% 100% / 0.75)" }}>#1</span>
          <span className="font-title text-sm leading-tight mt-0.5">{game.name}</span>
          <div className="flex-1" />
          <span className="font-title text-[7px] uppercase tracking-widest" style={{ color: "hsl(120 90% 72%)" }}>
            revealed
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={isRevealed ? { scale: [1, 1.06, 1], opacity: 1 } : {}}
      initial={{ opacity: isRevealed ? 1 : 0.4 }}
      whileHover={!isRevealed ? { opacity: 0.55 } : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative flex flex-col overflow-hidden"
      style={{
        background: palette.bg,
        color: palette.fg,
        border: `3px solid hsl(var(--bauhaus-black))`,
        boxShadow: isRevealed ? "6px 6px 0 hsl(var(--bauhaus-black))" : "2px 2px 0 hsl(var(--bauhaus-black))",
        aspectRatio: "1 / 1.1",
        transition: "box-shadow 0.3s, opacity 0.4s",
        outline: isRevealed ? "3px solid hsl(var(--bauhaus-white) / 0.6)" : "none",
        outlineOffset: "2px",
        opacity: isRevealed ? 1 : 0.4,
      }}
    >
      {/* Giant number — art-wall centrepiece */}
      <span
        className="absolute font-title select-none pointer-events-none"
        style={{
          fontSize: "clamp(3.5rem, 12vw, 6rem)",
          lineHeight: 1,
          bottom: -8,
          right: 4,
          color: isWhiteFg ? "hsl(0 0% 100% / 0.18)" : "hsl(0 0% 0% / 0.12)",
          letterSpacing: "-0.05em",
        }}
      >
        {n}
      </span>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-3 gap-1">
        <span
          className="font-title text-[8px] tracking-[0.18em] uppercase"
          style={{ color: isWhiteFg ? "hsl(0 0% 100% / 0.75)" : "hsl(0 0% 0% / 0.6)" }}
        >
          #{n}
        </span>
        {isRevealed
          ? <span className="font-title text-sm leading-tight mt-0.5">{game.name}</span>
          : <span className="font-title text-lg leading-none" style={{ opacity: 0.5 }}>—</span>
        }
        <div className="flex-1" />
        <span
          className="font-title text-[7px] uppercase tracking-widest"
          style={{
            color: isWhiteFg ? "hsl(0 0% 100% / 0.8)" : "hsl(0 0% 0% / 0.65)",
            opacity: 1,
          }}
        >
          {isRevealed ? "revealed" : "roll to discover"}
        </span>
      </div>
    </motion.div>
  );
};

const BoardGamesSection = () => {
  const [die1, setDie1] = useState<number | null>(null);
  const [die2, setDie2] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const rollCount = useRef(0);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true); setRevealed(false);
    let ticks = 0;
    const interval = setInterval(() => {
      setDie1(Math.ceil(Math.random() * 6));
      setDie2(Math.ceil(Math.random() * 6));
      ticks++;
      if (ticks > 8) {
        clearInterval(interval);
        const f1 = Math.ceil(Math.random() * 6);
        const f2 = Math.ceil(Math.random() * 6);
        setDie1(f1); setDie2(f2);
        setRolling(false);
        rollCount.current += 1;
        setTimeout(() => setRevealed(true), 200);
      }
    }, 60);
  };

  const total      = die1 !== null && die2 !== null ? die1 + die2 : null;
  const gameIdx    = total !== null ? total - 1 : null;
  const game       = gameIdx !== null ? GAMES[gameIdx] : null;
  // Always derive reveal colours from the gallery tile palette so they stay in sync
  const revealPalette = gameIdx !== null ? TILE_PALETTE[gameIdx] : null;
  const revealBg   = revealPalette?.bg  ?? "hsl(var(--bauhaus-blue))";
  const revealFg   = revealPalette?.fg  ?? "hsl(var(--bauhaus-white))";
  const isLightBg  = revealFg === "hsl(var(--bauhaus-black))";

  return (
    <section id="games" className="py-28 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          {/* Label tab */}
          <div
            className="inline-block px-3 py-1 mb-4 font-title text-[9px] tracking-[0.3em] uppercase"
            style={{
              background: "hsl(var(--bauhaus-blue))",
              color: "hsl(var(--bauhaus-white))",
            }}
          >
            The Board
          </div>
          <h2
            className="font-title leading-none mb-4"
            style={{ fontSize: "clamp(2rem, 8vw, 5rem)" }}
          >
            MY TOP 12
            <br />
            <span style={{ color: "hsl(var(--bauhaus-red))" }}>BOARD GAMES</span>
          </h2>
          <p className="font-body-serif text-base max-w-md leading-relaxed font-medium opacity-60">
            Roll two dice (2–12) to discover a game from my top 12!
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-8">

          {/* Dice tray */}
          <div
            className="flex items-center gap-8 p-10 relative overflow-hidden"
            style={{
              background: "hsl(var(--bauhaus-blue))",
              border: "3px solid hsl(var(--bauhaus-black))",
              boxShadow: "6px 6px 0 hsl(var(--bauhaus-black))",
            }}
          >
            {/* Bauhaus corner accent */}
            <div className="absolute top-0 right-0 flex">
              <div style={{ width: 12, height: 52, background: "hsl(var(--bauhaus-red))", borderLeft: "2px solid hsl(var(--bauhaus-black))" }} />
              <div style={{ width: 8, height: 52, background: "hsl(var(--bauhaus-yellow))", borderLeft: "2px solid hsl(var(--bauhaus-black))" }} />
            </div>

            {die1 !== null ? <DieFace value={die1} rolling={rolling} /> : (
              <div style={{ width: 90, height: 90, background: "hsl(0 0% 100% / 0.1)", border: "3px dashed hsl(0 0% 100% / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(0 0% 100% / 0.3)", fontSize: 32, fontFamily: "var(--font-title)" }}>?</div>
            )}

            <div className="flex flex-col items-center gap-1">
              <span className="font-title text-2xl" style={{ color: "hsl(var(--bauhaus-yellow))" }}>
                {total !== null ? `= ${total}` : "+"}
              </span>
              <span className="font-title text-[9px] tracking-[0.25em] uppercase" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
                {total !== null ? `game #${total}` : "roll"}
              </span>
            </div>

            {die2 !== null ? <DieFace value={die2} rolling={rolling} /> : (
              <div style={{ width: 90, height: 90, background: "hsl(0 0% 100% / 0.1)", border: "3px dashed hsl(0 0% 100% / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(0 0% 100% / 0.3)", fontSize: 32, fontFamily: "var(--font-title)" }}>?</div>
            )}
          </div>

          {/* Roll Button */}
          <motion.button
            onClick={rollDice}
            disabled={rolling}
            whileHover={{ y: -3, x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 font-title text-xs tracking-[0.2em] cursor-pointer disabled:opacity-50 uppercase"
            style={{
              background: rolling ? "hsl(var(--bauhaus-yellow) / 0.7)" : "hsl(var(--bauhaus-yellow))",
              color: "hsl(var(--bauhaus-black))",
              border: "3px solid hsl(var(--bauhaus-black))",
              boxShadow: "4px 4px 0 hsl(var(--bauhaus-black))",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseEnter={(e) => { if (!rolling) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0 hsl(var(--bauhaus-black))"; }}
          >
            {rolling ? "Rolling…" : "🎲 Roll the Dice"}
          </motion.button>

          {/* Game Reveal Card */}
          <AnimatePresence mode="wait">
            {revealed && game && total !== null && (
              <motion.div
                key={`${total}-${rollCount.current}`}
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full max-w-lg overflow-hidden"
                style={{
                  background: revealBg, color: revealFg,
                  border: "3px solid hsl(var(--bauhaus-black))",
                  boxShadow: "6px 6px 0 hsl(var(--bauhaus-black))",
                }}
              >
                {/* Card header strip */}
                <div
                  className="px-6 py-3 flex items-center justify-between"
                  style={{ background: "hsl(var(--bauhaus-black))", borderBottom: "2px solid hsl(var(--bauhaus-black))" }}
                >
                  <span className="font-title text-[10px] tracking-[0.2em] uppercase" style={{ color: "hsl(var(--bauhaus-yellow))" }}>
                    Game #{total}
                  </span>
                  <span className="font-title text-[10px] tracking-[0.15em]" style={{ color: "hsl(0 0% 100% / 0.45)" }}>
                    {die1} + {die2}
                  </span>
                </div>

                <div className="px-6 py-6 space-y-4">
                  <h3 className="font-title text-2xl leading-tight">{game.name}</h3>
                  <p className="font-body-serif text-base leading-relaxed font-medium opacity-85">
                    "{game.note}"
                  </p>
                  <div
                    className="p-4 space-y-3"
                    style={{
                      background: "hsl(var(--bauhaus-black) / 0.15)",
                      border: `2px solid ${isLightBg ? "hsl(0 0% 0% / 0.15)" : "hsl(0 0% 100% / 0.2)"}`,
                    }}
                  >
                    <p className="font-title text-[10px] tracking-[0.15em] uppercase opacity-70">
                      Wanna play? Join me on Board Game Arena!
                    </p>
                    <p className="font-body-serif text-sm font-medium opacity-80">
                      I'm <strong>{PLAYER_NAME}</strong> — add me and let's play!
                    </p>
                    <div className="flex gap-2">
                      <motion.a
                        href={BGA_FRIEND_URL} target="_blank" rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        className="flex-1 flex items-center justify-center px-4 py-2.5 font-title text-[9px] tracking-widest uppercase cursor-pointer"
                        style={{ background: revealFg, color: revealBg, border: "2px solid hsl(var(--bauhaus-black))", boxShadow: "2px 2px 0 hsl(var(--bauhaus-black))" }}
                      >
                        Add Its_Me_Raghi
                      </motion.a>
                      <motion.a
                        href={BGA_PLAY_URL} target="_blank" rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        className="flex items-center justify-center px-4 py-2.5 font-title text-[9px] tracking-widest uppercase cursor-pointer"
                        style={{ background: "transparent", color: revealFg, border: `2px solid ${isLightBg ? "hsl(0 0% 0% / 0.2)" : "hsl(0 0% 100% / 0.3)"}` }}
                      >
                        Visit BGA
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Art Wall — 12 tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            {/* Gallery wall frame */}
            <div
              className="p-4 sm:p-6 relative"
              style={{
                background: "hsl(var(--bauhaus-black) / 0.03)",
                border: "3px solid hsl(var(--bauhaus-black))",
                boxShadow: "8px 8px 0 hsl(var(--bauhaus-black))",
              }}
            >
              {/* Wall label tab */}
              <div
                className="absolute -top-4 left-6 px-3 py-1 font-title text-[8px] tracking-[0.2em] uppercase"
                style={{
                  background: "hsl(var(--bauhaus-black))",
                  color: "hsl(var(--bauhaus-yellow))",
                }}
              >
                Gallery · Top 12
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                {GAMES.map((g, i) => (
                  <motion.div
                    key={g.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <ArtTile
                      index={i}
                      game={g}
                      isGame1={i === 0}
                      isRevealed={total === i + 1 && revealed}
                      onGame1Click={() => setTerminalOpen(true)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
      {terminalOpen && <TerminalOverlay onClose={() => setTerminalOpen(false)} />}
    </section>
  );
};

export default BoardGamesSection;
