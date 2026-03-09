import { motion } from "framer-motion";

const WHAT_I_DO = [
  {
    rank: "I",
    label: "SEO & CRO",
    desc: "Technical SEO, Core Web Vitals, A/B testing and conversion-focused improvements.",
    bg: "hsl(var(--bauhaus-blue))",
    fg: "hsl(var(--bauhaus-white))",
    accent: "hsl(55 100% 70%)",
  },
  {
    rank: "II",
    label: "Web Development",
    desc: "SEO-friendly WordPress pages — clean structure and performance first.",
    bg: "hsl(var(--bauhaus-red))",
    fg: "hsl(var(--bauhaus-white))",
    accent: "hsl(55 100% 70%)",
  },
  {
    rank: "III",
    label: "Business",
    desc: "Co-owner of Quesada Burritos & Tacos — operations, staffing, local SEO.",
    bg: "hsl(var(--bauhaus-yellow))",
    fg: "hsl(var(--bauhaus-black))",
    accent: "hsl(218 100% 30%)",
  },
];

const HeroSection = () => (
  <section id="hero" className="relative py-24 px-6 overflow-hidden">

    <div className="max-w-4xl mx-auto relative">

      {/* Small role label */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 mb-6 px-3 py-1"
        style={{
          border: "2px solid hsl(var(--bauhaus-blue))",
          background: "hsl(var(--bauhaus-blue) / 0.06)",
        }}
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "hsl(var(--bauhaus-blue))" }}>
          Senior SEO Analyst · CRO Specialist · Frontend Developer
        </span>
      </motion.div>

      {/* NAME */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 70, damping: 18 }}
        className="mb-6"
      >
        <h1
          className="font-title leading-none"
          style={{
            fontSize: "clamp(5rem, 22vw, 11rem)",
            letterSpacing: "-0.03em",
            color: "hsl(var(--bauhaus-blue))",
          }}
        >
          BINITA
        </h1>
      </motion.div>



      {/* Buttons */}
      <motion.div
        className="flex flex-wrap gap-3 mb-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { label: "Email",     href: "mailto:binitapatel266@gmail.com",             bg: "hsl(var(--bauhaus-yellow))", fg: "hsl(var(--bauhaus-black))" },
          { label: "LinkedIn",  href: "https://www.linkedin.com/in/binitapatel266/", bg: "hsl(var(--bauhaus-blue))",   fg: "hsl(var(--bauhaus-white))" },
          { label: "Etsy Shop", href: "https://www.etsy.com/ca/shop/MadeByBinita",  bg: "hsl(25 100% 52%)",           fg: "hsl(var(--bauhaus-white))" },
        ].map(({ label, href, bg, fg }) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            whileHover={{ y: -3, x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 font-title text-xs tracking-[0.15em] uppercase cursor-pointer"
            style={{
              background: bg, color: fg,
              border: "2px solid hsl(var(--bauhaus-black))",
              boxShadow: "3px 3px 0 hsl(var(--bauhaus-black))",
              transition: "box-shadow 0.1s, transform 0.1s",
            }}
          >
            {label}
          </motion.a>
        ))}
      </motion.div>

      {/* About — clean card with left border accent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        {/* Card label tab */}
        <div
          className="inline-block px-3 py-1 mb-0 font-title text-[9px] tracking-[0.3em] uppercase"
          style={{
            background: "hsl(var(--bauhaus-blue))",
            color: "hsl(var(--bauhaus-white))",
          }}
        >
          The Hero
        </div>
        <div
          className="p-7"
          style={{
            borderLeft: "6px solid hsl(var(--bauhaus-blue))",
            border: "2px solid hsl(var(--bauhaus-black) / 0.12)",
            borderLeftWidth: 6,
            borderLeftColor: "hsl(var(--bauhaus-blue))",
            background: "hsl(var(--bauhaus-blue) / 0.03)",
          }}
        >
          <p className="font-body-serif text-base leading-relaxed font-medium mb-3">
            I'm a{" "}
            <strong style={{ color: "hsl(var(--bauhaus-blue))" }}>Senior SEO Analyst</strong>{" "}
            who tweaks websites, runs experiments, and occasionally convinces Google to behave.
          </p>
          <p className="font-body-serif text-base leading-relaxed font-medium">
            Outside work, I manage a{" "}
            <strong style={{ color: "hsl(var(--bauhaus-red))" }}>Quesada Burritos & Tacos</strong>{" "}
            location,{" "}
            <span
              onMouseEnter={() => window.dispatchEvent(new CustomEvent("candle-pulse"))}
              style={{
                color: "hsl(38 100% 58%)",
                fontWeight: 700,
                cursor: "default",
                textDecoration: "underline dotted",
                textUnderlineOffset: "3px",
              }}
            >
              make candles
            </span>
            , paint things you probably shouldn't hang on a wall, and play board games.
          </p>
        </div>
      </motion.div>

      {/* What I do — Game Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-title text-xs tracking-[0.3em] uppercase opacity-50">The Lab</span>
          <div className="flex-1 h-0.5" style={{ background: "hsl(var(--bauhaus-black) / 0.12)" }} />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ border: "2px solid hsl(var(--bauhaus-black))" }}
        >
          {WHAT_I_DO.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="p-6 cursor-default relative overflow-hidden"
              style={{
                background: item.bg, color: item.fg,
                borderLeft: i > 0 ? "2px solid hsl(var(--bauhaus-black))" : "none",
              }}
            >
              {/* Big roman numeral watermark */}
              <span
                className="absolute font-title select-none pointer-events-none"
                style={{
                  fontSize: "5rem",
                  lineHeight: 1,
                  bottom: -8,
                  right: 8,
                  color: item.fg === "hsl(var(--bauhaus-white))" ? "hsl(0 0% 100% / 0.1)" : "hsl(0 0% 0% / 0.08)",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.rank}
              </span>
              <div className="relative z-10">
                <div className="font-title text-[11px] tracking-[0.2em] mb-3 uppercase" style={{ color: item.accent }}>
                  {item.label}
                </div>
                <p className="font-body-serif text-sm leading-relaxed font-medium opacity-90">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>


    </div>
  </section>
);

export default HeroSection;
