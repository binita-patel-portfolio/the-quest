// GitHub sync test ✅
import { useEffect, useState } from "react";
import ResourceBar from "@/components/ResourceBar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import BoardGamesSection from "@/components/BoardGamesSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll-driven background: white → deep charcoal with warm orange glow
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0; // 0–1
      setScrollProgress(p);

      if (p >= 0.98) {
        // Victory dark: deep charcoal #1A1A1A with orange radial glow
        document.body.style.backgroundColor = "#1A1A1A";
        document.body.style.backgroundImage =
          "radial-gradient(ellipse 60% 50% at 50% 60%, hsl(28 100% 40% / 0.18) 0%, transparent 70%)";
        document.body.style.color = "hsl(35 30% 88%)"; // warm off-white
      } else {
        const hue = Math.round(p * 220);
        const sat = Math.round(p * 15);
        const lit = Math.round(98 - p * 90);
        document.body.style.backgroundColor = `hsl(${hue} ${sat}% ${lit}%)`;
        document.body.style.backgroundImage = "none";
        if (lit < 50) {
          document.body.style.color = "hsl(35 30% 88%)"; // warm off-white in dark
        } else {
          document.body.style.color = "hsl(220 15% 10%)";
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isVictory = scrollProgress >= 0.98;

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Full-page subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(218 100% 34% / 0.04) 1px, transparent 1px),
            linear-gradient(90deg, hsl(218 100% 34% / 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <ResourceBar />

      <main className="pt-14">
        <HeroSection isVictory={isVictory} />

        {/* Thick Bauhaus divider */}
        <div style={{ height: 4, background: "hsl(var(--bauhaus-blue))", margin: "0 0" }} />

        <ProjectsSection />

        <div style={{ height: 4, background: "hsl(var(--bauhaus-red))", margin: "0 0" }} />

        <BoardGamesSection />

        <div style={{ height: 4, background: "hsl(var(--bauhaus-yellow))", margin: "0 0" }} />

        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
