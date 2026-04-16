import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSlides } from "@/services/slideshow";

const headlines = [
  "Redefining the Art of Storytelling",
  "Crafting Cinematic Brilliance",
  "Where Innovation Meets Impact",
];

const fallbackSlides = [
  "/images/hero-bg.jpg",
  "/images/about-bg.jpg",
  "/images/team-bg.jpg",
];

export default function Hero() {
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>(fallbackSlides);

  useEffect(() => {
    getSlides()
      .then((items) => {
        if (items.length > 0) setSlides(items.map((s) => s.url));
      })
      .catch(() => {});
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Slideshow */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${slides[currentSlide % slides.length]}')` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Gradient overlays (always on top of slides) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0a0a0a] z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-[1]" />

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-0.5 transition-all duration-500 ${
              i === currentSlide
                ? "w-10 bg-[#ffffff]"
                : "w-5 bg-white/25 hover:bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Tag line 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-px w-12 bg-[#ffffff]" />
          <span className="text-white text-xs tracking-[0.4em] uppercase font-light font-raleway">
            Lebanon's Premier Production House
          </span>
          <div className="h-px w-12 bg-[#ffffff]" />
        </motion.div>
*/}
        {/* Logo Text */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-inter text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-none tracking-wider"
        >
          TURN VISION<br />INTO IMPACT
        </motion.h1>

        {/* Rotating Headline }
        <div className="h-16 flex items-center justify-center mb-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentHeadline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-3xl font-light text-white/90 font-raleway"
            >
              {headlines[currentHeadline]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-white/60 text-sm md:text-base font-light tracking-wider max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          We cover every aspect of production, turning ideas into cinematic brilliance,
          compelling ads, immersive experiences, and gripping movies.
        </motion.p>

        {/* Stats }
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-12 mt-20 border-t border-white/10 pt-12"
        >
          {[
            { number: "10+", label: "Years Experience" },
            { number: "500+", label: "Projects Completed" },
            { number: "50+", label: "Team Members" },
            { number: "30+", label: "Awards Won" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-inter text-3xl md:text-4xl font-bold text-white">
                {stat.number}
              </div>
              <div className="text-white/50 text-xs tracking-widest uppercase mt-1 font-light">
                {stat.label}
              </div>
            </motion.div> 
          ))
        </motion.div>*/}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
      </motion.div>
    </section>
  );
}
