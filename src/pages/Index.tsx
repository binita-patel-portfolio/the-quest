// GitHub sync test ✅
import { useEffect } from "react";
import ResourceBar from "@/components/ResourceBar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import BoardGamesSection from "@/components/BoardGamesSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  // Scroll-driven background: white → cobalt blue → near black
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0; // 0–1

      // Interpolate: 0 = hsl(0 0% 98%), 1 = hsl(220 15% 8%)
      // Hue: 0 → 220
      // Saturation: 0% → 15%
      // Lightness: 98% → 8%
      const hue = Math.round(p * 220);
      const sat = Math.round(p * 15);
      const lit = Math.round(98 - p * 90);
      document.body.style.backgroundColor = `hsl(${hue} ${sat}% ${lit}%)`;

      // Also flip text color at ~50% darkness
      if (lit < 50) {
        document.body.style.color = "hsl(0 0% 95%)";
      } else {
        document.body.style.color = "hsl(220 15% 10%)";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <HeroSection />

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
