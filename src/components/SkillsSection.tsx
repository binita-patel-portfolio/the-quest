import { motion } from "framer-motion";

interface Skill {
  label: string;
  sublabel: string;
  icon: string;
  color: string; // semantic hsl key
  level: number; // 1–5
}

const SKILL_GROUPS: { group: string; emoji: string; color: string; skills: Skill[] }[] = [
  {
    group: "SEO",
    emoji: "🔍",
    color: "hsl(142 42% 30%)",
    skills: [
      { label: "On-Page SEO", sublabel: "Core optimisation", icon: "📄", color: "forest", level: 5 },
      { label: "Technical SEO", sublabel: "Crawl & indexing", icon: "⚙️", color: "ore", level: 5 },
      { label: "Keyword Research", sublabel: "Strategy & intent", icon: "🎯", color: "wheat", level: 5 },
      { label: "Link Building", sublabel: "Authority & outreach", icon: "🔗", color: "brick", level: 4 },
      { label: "Local SEO", sublabel: "Maps & GBP", icon: "📍", color: "mars", level: 4 },
      { label: "International SEO", sublabel: "hreflang & geo", icon: "🌍", color: "water", level: 3 },
      { label: "E-E-A-T", sublabel: "Quality signals", icon: "⭐", color: "city", level: 4 },
      { label: "Schema Markup", sublabel: "Structured data", icon: "🏷️", color: "ore", level: 3 },
    ],
  },
  {
    group: "CRO & Analytics",
    emoji: "📊",
    color: "hsl(280 45% 35%)",
    skills: [
      { label: "CRO", sublabel: "Conversion optimisation", icon: "📈", color: "mars", level: 4 },
      { label: "A/B Testing", sublabel: "Experimentation", icon: "🧪", color: "sheep", level: 4 },
      { label: "Core Web Vitals", sublabel: "Performance", icon: "⚡", color: "ore", level: 4 },
      { label: "GA4", sublabel: "Google Analytics", icon: "📊", color: "water", level: 5 },
      { label: "Looker Studio", sublabel: "Reporting", icon: "🗂️", color: "city", level: 4 },
      { label: "Log Analysis", sublabel: "Server logs", icon: "🖥️", color: "brick", level: 3 },
    ],
  },
  {
    group: "Tools",
    emoji: "🛠️",
    color: "hsl(38 45% 32%)",
    skills: [
      { label: "Ahrefs", sublabel: "SEO toolset", icon: "🔭", color: "forest", level: 5 },
      { label: "SEMrush", sublabel: "Research & audit", icon: "🌐", color: "wheat", level: 4 },
      { label: "Google Search Console", sublabel: "GSC", icon: "🔎", color: "water", level: 5 },
      { label: "Screaming Frog", sublabel: "Site crawler", icon: "🐸", color: "desert", level: 4 },
    ],
  },
  {
    group: "Web & Content",
    emoji: "💻",
    color: "hsl(340 55% 32%)",
    skills: [
      { label: "WordPress", sublabel: "CMS & dev", icon: "📝", color: "sheep", level: 4 },
      { label: "HTML / CSS", sublabel: "Frontend", icon: "🎨", color: "mars", level: 4 },
      { label: "Content Strategy", sublabel: "Editorial planning", icon: "✍️", color: "wheat", level: 5 },
      { label: "Digital PR", sublabel: "Outreach", icon: "📢", color: "city", level: 4 },
    ],
  },
];

const TERRAIN_TEXT: Record<string, string> = {
  forest:  "hsl(142 52% 65%)",
  wheat:   "hsl(46 72% 65%)",
  ore:     "hsl(220 30% 70%)",
  brick:   "hsl(12 65% 65%)",
  sheep:   "hsl(95 45% 60%)",
  desert:  "hsl(38 55% 65%)",
  water:   "hsl(214 60% 65%)",
  mars:    "hsl(12 72% 72%)",
  city:    "hsl(260 45% 70%)",
};

const TERRAIN_BG: Record<string, string> = {
  forest:  "hsl(142 42% 13%)",
  wheat:   "hsl(46 55% 13%)",
  ore:     "hsl(220 18% 14%)",
  brick:   "hsl(12 50% 12%)",
  sheep:   "hsl(95 30% 12%)",
  desert:  "hsl(38 40% 13%)",
  water:   "hsl(214 45% 12%)",
  mars:    "hsl(12 62% 12%)",
  city:    "hsl(260 32% 14%)",
};

const TERRAIN_BORDER: Record<string, string> = {
  forest:  "hsl(142 42% 30%)",
  wheat:   "hsl(46 65% 38%)",
  ore:     "hsl(220 18% 38%)",
  brick:   "hsl(12 55% 35%)",
  sheep:   "hsl(95 38% 34%)",
  desert:  "hsl(38 45% 38%)",
  water:   "hsl(214 48% 38%)",
  mars:    "hsl(12 72% 40%)",
  city:    "hsl(260 35% 38%)",
};

const LevelPips = ({ level, color }: { level: number; color: string }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="w-1.5 h-1.5 rounded-full transition-all"
        style={{
          background: i <= level ? color : `${color}30`,
          boxShadow: i <= level ? `0 0 4px ${color}80` : "none",
        }}
      />
    ))}
  </div>
);

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const text   = TERRAIN_TEXT[skill.color]   ?? "hsl(40 30% 65%)";
  const bg     = TERRAIN_BG[skill.color]     ?? "hsl(35 22% 13%)";
  const border = TERRAIN_BORDER[skill.color] ?? "hsl(42 30% 25%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.03 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 18 }}
      className="flex flex-col gap-2 p-3.5 rounded-xl border cursor-default"
      style={{ background: bg, borderColor: border, boxShadow: `0 2px 12px ${border}30` }}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-xl leading-none">{skill.icon}</span>
        <LevelPips level={skill.level} color={text} />
      </div>
      <div>
        <div className="font-title text-xs font-bold leading-tight" style={{ color: text }}>
          {skill.label}
        </div>
        <div className="font-body-serif text-[10px] mt-0.5" style={{ color: `${text}80` }}>
          {skill.sublabel}
        </div>
      </div>
    </motion.div>
  );
};

const SkillsSection = () => (
  <section id="skills" className="py-24 px-6 relative overflow-hidden">
    {/* Soft polka dot bg */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.018]"
      style={{
        backgroundImage: "radial-gradient(circle, hsl(340 60% 60%) 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px",
      }}
    />

    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, type: "spring" }}
        className="mb-14 text-center"
      >
        <div className="inline-flex items-center gap-3 mb-5 px-4 py-2 rounded border border-border/60 bg-secondary/50">
          <span className="text-sm">✨</span>
          <span className="font-title text-xs tracking-[0.35em] text-muted-foreground uppercase">
            Skill Map · What I Bring
          </span>
        </div>
        <h2 className="font-title font-black text-5xl md:text-6xl text-parchment leading-tight mb-3">
          MY<br />
          <span style={{ color: "hsl(340 70% 65%)" }}>SKILLS</span>
        </h2>
        <p className="text-muted-foreground font-body-serif text-lg max-w-md mx-auto leading-relaxed">
          A quick look at what I do — hover any card for a closer look. 🌸
        </p>
      </motion.div>

      {/* Skill groups */}
      <div className="space-y-10">
        {SKILL_GROUPS.map((group, gi) => (
          <motion.div
            key={group.group}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
          >
            {/* Group label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-base">{group.emoji}</span>
              <span
                className="font-title text-xs tracking-[0.3em] uppercase"
                style={{ color: group.color }}
              >
                {group.group}
              </span>
              <div className="flex-1 h-px" style={{ background: `${group.color}40` }} />
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {group.skills.map((skill, si) => (
                <SkillCard key={skill.label} skill={skill} index={gi * 8 + si} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Level legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex items-center gap-4 justify-center flex-wrap"
      >
        <span className="font-title text-[10px] tracking-widest text-muted-foreground uppercase">Proficiency</span>
        {[
          { label: "Familiar", level: 2 },
          { label: "Skilled",  level: 3 },
          { label: "Advanced", level: 4 },
          { label: "Expert",   level: 5 },
        ].map(({ label, level }) => (
          <div key={label} className="flex items-center gap-1.5">
            <LevelPips level={level} color="hsl(340 65% 60%)" />
            <span className="font-title text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SkillsSection;
