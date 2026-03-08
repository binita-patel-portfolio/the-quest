import { motion } from "framer-motion";

interface ExpCard {
  rank: string;
  title: string;
  company: string;
  period: string;
  desc: string;
  bg: string;
  fg: string;
  accent: string;
  tag: string;
}

const EXPERIENCE: ExpCard[] = [
  {
    rank: "01",
    title: "Senior SEO Analyst",
    company: "Kinesso",
    period: "Oct 2024 – Present",
    desc: "Leading technical SEO and data-driven strategies to grow organic visibility for enterprise clients.",
    bg: "hsl(var(--bauhaus-blue))",
    fg: "hsl(var(--bauhaus-white))",
    accent: "hsl(55 100% 70%)",
    tag: "current",
  },
  {
    rank: "02",
    title: "Personalization Specialist",
    company: "Bounteous",
    period: "Mar 2021 – Sep 2024",
    desc: "Ran A/B tests, conducted technical SEO audits, analyzed performance data, and presented quarterly strategy reviews for client accounts.",
    bg: "hsl(var(--bauhaus-red))",
    fg: "hsl(var(--bauhaus-white))",
    accent: "hsl(55 100% 70%)",
    tag: "cro & seo",
  },
  {
    rank: "03",
    title: "SEO Analyst",
    company: "BreezeMaxWeb",
    period: "Jul 2020 – Mar 2021",
    desc: "Performed on-page optimization, technical audits, and site improvements for WordPress & Shopify client sites.",
    bg: "hsl(var(--bauhaus-yellow))",
    fg: "hsl(var(--bauhaus-black))",
    accent: "hsl(218 100% 30%)",
    tag: "seo",
  },
  {
    rank: "04",
    title: "Co-Owner",
    company: "Quesada Burritos & Tacos",
    period: "Jan 2024 – Present",
    desc: "Running operations, staffing, and local SEO strategies to drive foot traffic and community presence.",
    bg: "hsl(var(--bauhaus-black))",
    fg: "hsl(var(--bauhaus-white))",
    accent: "hsl(55 100% 63%)",
    tag: "business",
  },
  {
    rank: "05",
    title: "Frontend Developer",
    company: "Electroweb (Internship)",
    period: "2015 – 2016",
    desc: "Built and maintained web pages with HTML/CSS — focused on clean structure and performance.",
    bg: "hsl(0 0% 100%)",
    fg: "hsl(var(--bauhaus-black))",
    accent: "hsl(var(--bauhaus-blue))",
    tag: "dev",
  },
];

const ExperienceCard = ({ card, index }: { card: ExpCard; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay: index * 0.07 }}
    className="cursor-default overflow-hidden relative"
    style={{
      background: card.bg,
      color: card.fg,
      border: "2px solid hsl(var(--bauhaus-black))",
      boxShadow: "4px 4px 0 hsl(var(--bauhaus-black))",
      transition: "transform 0.12s ease, box-shadow 0.12s ease",
    }}
    whileHover={{ y: -4, x: -4 }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 hsl(var(--bauhaus-black))"; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "4px 4px 0 hsl(var(--bauhaus-black))"; }}
  >
    {/* Giant rank watermark */}
    <span
      className="absolute font-title select-none pointer-events-none"
      style={{
        fontSize: "6rem",
        lineHeight: 1,
        bottom: -10,
        right: 8,
        color: card.fg === "hsl(var(--bauhaus-white))" ? "hsl(0 0% 100% / 0.08)" : "hsl(0 0% 0% / 0.06)",
        letterSpacing: "-0.04em",
      }}
    >
      {card.rank}
    </span>

    {/* Tag strip */}
    <div
      className="px-4 py-1.5 font-title text-[9px] tracking-[0.25em] uppercase"
      style={{
        background: "hsl(var(--bauhaus-black) / 0.15)",
        borderBottom: "2px solid hsl(var(--bauhaus-black) / 0.2)",
        color: card.accent,
      }}
    >
      {card.tag}
    </div>

    {/* Content */}
    <div className="px-5 pt-4 pb-2">
      <h3 className="font-title text-lg leading-tight mb-1">{card.title}</h3>
    </div>

    <div className="px-5 pb-1 font-body-serif text-[11px] font-medium" style={{ opacity: 0.6 }}>
      {card.company}
    </div>

    <div className="px-5 pb-3 font-body-serif text-sm leading-relaxed font-medium" style={{ opacity: 0.88 }}>
      {card.desc}
    </div>

    <div className="px-5 pb-4 font-title text-[9px] tracking-widest uppercase" style={{ opacity: 0.45 }}>
      {card.period}
    </div>
  </motion.div>
);

const ProjectsSection = () => (
  <section id="projects" className="py-24 px-6 relative">
    <div className="max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-4"
      >
        {/* Section label tab */}
        <div
          className="inline-block px-3 py-1 mb-4 font-title text-[9px] tracking-[0.3em] uppercase"
          style={{
            background: "hsl(var(--bauhaus-red))",
            color: "hsl(var(--bauhaus-white))",
          }}
        >
          The Quest
        </div>
        <h2
          className="font-title leading-none mb-4"
          style={{ fontSize: "clamp(2rem, 8vw, 5rem)" }}
        >
          CAREER
          <br />
          <span style={{ color: "hsl(var(--bauhaus-red))" }}>TIMELINE</span>
        </h2>
        <p className="font-body-serif text-base max-w-md leading-relaxed font-medium opacity-60 mb-12">
          Professional milestones — each one a step forward.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {EXPERIENCE.map((card, i) => (
          <ExperienceCard key={card.title} card={card} index={i} />
        ))}
      </div>


    </div>
  </section>
);

export default ProjectsSection;
