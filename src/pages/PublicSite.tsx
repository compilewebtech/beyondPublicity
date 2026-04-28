import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollingImages from "@/components/scrollingImages";

export default function PublicSite() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "services", "portfolio", "team", "contact"];
      const scrollY = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white font-raleway overflow-x-hidden">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#fcea00] focus:text-black focus:font-semibold focus:text-sm focus:tracking-widest focus:uppercase"
      >
        Skip to main content
      </a>
      <Navbar activeSection={activeSection} />
      <Hero />
      <Services />
      <ScrollingImages />
      <Portfolio limit={6} />
      <About />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}
