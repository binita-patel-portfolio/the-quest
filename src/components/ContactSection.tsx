import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";

const LINKS = [
  {
    icon: Mail,
    label: "Email",
    display: "binitapatel266@gmail.com",
    href: "mailto:binitapatel266@gmail.com",
    bg: "hsl(var(--bauhaus-yellow))",
    fg: "hsl(var(--bauhaus-black))",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    display: "/in/binitapatel266",
    href: "https://www.linkedin.com/in/binitapatel266/",
    bg: "hsl(var(--bauhaus-blue))",
    fg: "hsl(var(--bauhaus-white))",
  },
  {
    icon: null,
    label: "Etsy",
    display: "MadeByBinita",
    href: "https://www.etsy.com/ca/shop/MadeByBinita",
    bg: "hsl(25 100% 52%)",
    fg: "hsl(var(--bauhaus-white))",
  },
];

const ContactSection = () => (
  <section id="contact" className="py-24 px-6 relative overflow-hidden">
    <div className="max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Label tab */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-block px-3 py-1 font-title text-[9px] tracking-[0.3em] uppercase"
            style={{
              background: "hsl(var(--bauhaus-yellow))",
              color: "hsl(var(--bauhaus-black))",
            }}
          >
            The Lobby
          </div>
        </div>

        {/* Heading */}
        <h2
          className="font-title leading-none mb-12"
          style={{ fontSize: "clamp(2rem, 8vw, 5rem)" }}
        >
          <span style={{ display: "block", color: "hsl(var(--bauhaus-white))" }}>
            LET'S
          </span>
          <span style={{ display: "block", color: "hsl(var(--bauhaus-red))" }}>
            CONNECT
          </span>
        </h2>

        {/* Link cards */}
        <div
          className="flex flex-col sm:flex-row"
          style={{ border: "2px solid hsl(var(--bauhaus-black))", boxShadow: "3px 3px 0 hsl(var(--bauhaus-black))", marginBottom: "0.5rem" }}
        >
          {LINKS.map(({ icon: Icon, label, display, href, bg, fg }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, x: -4 }}
              className="flex-1 flex flex-col items-center gap-3 p-6"
              style={{
                background: bg, color: fg,
                borderLeft: i > 0 ? "2px solid hsl(var(--bauhaus-black))" : "none",
                transition: "transform 0.1s",
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center"
                style={{ background: "hsl(0 0% 0% / 0.12)" }}>
                {Icon && <Icon size={18} style={{ color: fg }} />}
                {!Icon && <span className="font-title text-lg">{label[0].toUpperCase()}</span>}
              </div>
              <div>
                <div className="font-title text-[11px] tracking-[0.2em] uppercase mb-0.5">{label}</div>
                <div className="font-title text-[9px] tracking-widest opacity-60">{display}</div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mb-12" />
      </motion.div>

      {/* Footer */}
      <div
        className="mt-16 pt-5 flex items-center justify-center"
        style={{ borderTop: "3px solid hsl(var(--bauhaus-white) / 0.3)" }}
      >
        <span className="font-title text-[9px] tracking-[0.25em] uppercase" style={{ color: "hsl(var(--bauhaus-white))", opacity: 0.5 }}>
          Binita Patel
        </span>
      </div>
    </div>
  </section>
);

export default ContactSection;
