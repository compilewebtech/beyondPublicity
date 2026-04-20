import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAbout, iconPathFor, DEFAULT_ABOUT, type AboutContent } from "@/services/about";

export default function About() {
  const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT);

  const load = useCallback(() => {
    let alive = true;
    getAbout()
      .then((data) => {
        if (!alive || !data) return;
        setContent({
          paragraphs: data.paragraphs.length > 0 ? data.paragraphs : DEFAULT_ABOUT.paragraphs,
          highlights: data.highlights.length > 0 ? data.highlights : DEFAULT_ABOUT.highlights,
          imageUrl: data.imageUrl || DEFAULT_ABOUT.imageUrl,
          imageAlt: data.imageAlt || DEFAULT_ABOUT.imageAlt,
          statValue: data.statValue || DEFAULT_ABOUT.statValue,
          statLabel: data.statLabel || DEFAULT_ABOUT.statLabel,
        });
      })
      .catch((err) => console.error("About: failed to load", err));
    return () => { alive = false; };
  }, []);

  useEffect(() => load(), [load]);

  return (
    <section id="about" className="relative py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff]/40 to-transparent" />
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#ffffff]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#ffffff]" />
          <span className="text-white text-xs tracking-[0.4em] uppercase font-light">About Us</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            {content.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-white/60 text-base leading-relaxed font-light ${
                  i === content.paragraphs.length - 1 ? "mb-10" : "mb-6"
                }`}
              >
                {p}
              </p>
            ))}

            <div className="grid grid-cols-2 gap-6">
              {content.highlights.map((item, i) => (
                <motion.div
                  key={`${item.title}-${i}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 border border-[#ffffff]/30 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={iconPathFor(item.iconKey)} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium mb-1">{item.title}</h4>
                    <p className="text-white/40 text-xs font-light leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Image + decorative */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-2/3 h-2/3 border-l-2 border-t-2 border-[#ffffff]/50 pointer-events-none z-10" />
              <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-r-2 border-b-2 border-[#ffffff]/50 pointer-events-none z-10" />

              <img
                src={content.imageUrl}
                alt={content.imageAlt}
                className="w-full h-[500px] object-cover grayscale-[20%]"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src !== window.location.origin + DEFAULT_ABOUT.imageUrl) {
                    img.src = DEFAULT_ABOUT.imageUrl;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />

              {content.statValue && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-sm border border-[#ffffff]/30 px-6 py-4"
                >
                  <div className="font-inter text-white text-2xl font-bold">{content.statValue}</div>
                  <div className="text-white/60 text-xs tracking-widest uppercase font-light mt-1">
                    {content.statLabel}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
