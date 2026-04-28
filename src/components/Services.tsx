import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getServices, type Service } from "@/services/services";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    let alive = true;
    getServices()
      .then((data) => {
        if (!alive) return;
        setServices(data);
        setIndex(0);
      })
      .catch((err) => {
        console.error("Failed to load services", err);
        if (alive) setError(true);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  useEffect(() => load(), [load]);

  const total = services.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  const at = (offset: number) => services[(index + offset + total) % total];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (total === 0) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const current = services[index];

  return (
    <section id="services" className="relative py-28 bg-[#080808] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#ffffff]" />
            <span className="text-white text-xs tracking-[0.4em] uppercase font-light">What We Do</span>
            <div className="h-px w-12 bg-[#ffffff]" />
          </div>
          <h2 className="font-inter text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-white">Services</span>
          </h2>
          <p className="text-white/50 text-base font-light max-w-2xl mx-auto">
            Full-service marketing, design, and production — built around what your brand needs to grow.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-sm font-light mb-4">Having trouble loading services.</p>
            <button
              onClick={load}
              className="px-6 py-2 border border-white/40 text-white text-xs tracking-widest uppercase font-light hover:bg-[#fcea00] hover:text-black transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : total === 0 || !current ? (
          <div className="text-center py-12">
            <p className="text-white/40 text-sm font-light">Services coming soon.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="relative flex items-center justify-center gap-3 sm:gap-5">
              {total > 1 && (
                <PeekCard service={at(-1)} side="left" onClick={prev} />
              )}

              <div
                className="relative w-full sm:w-[60%] max-w-md"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                    className="relative aspect-[4/5] border border-white/10 overflow-hidden bg-[#0a0a0a] shadow-2xl"
                  >
                    {current.backgroundUrl ? (
                      <img
                        src={current.backgroundUrl}
                        alt={current.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#1a1a1a]" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />

                    {/* Default: title + counter */}
                    <motion.div
                      className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
                      animate={{ opacity: hovered ? 0 : 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="w-12 h-12 border border-[#fcea00]/60 flex items-center justify-center text-[#fcea00] mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d={current.iconPath} />
                        </svg>
                      </div>
                      <h3 className="font-inter text-2xl md:text-3xl font-bold text-white leading-tight">
                        {current.title}
                      </h3>
                    </motion.div>

                    {/* Hover: sub-items */}
                    <motion.div
                      className="absolute inset-0 flex flex-col p-6 md:p-8 bg-black/85 backdrop-blur-sm overflow-y-auto"
                      initial={false}
                      animate={{ opacity: hovered ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ pointerEvents: hovered ? "auto" : "none" }}
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 border border-[#fcea00]/60 flex items-center justify-center text-[#fcea00] flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d={current.iconPath} />
                          </svg>
                        </div>
                        <h3 className="font-inter text-lg md:text-xl font-bold text-white leading-tight">{current.title}</h3>
                      </div>

                      <div className="flex flex-col gap-4">
                        {current.subItems.map((sub, si) => (
                          <div key={`${si}-${sub.title}`} className="border-l-2 border-[#fcea00]/60 pl-3">
                            <span className="font-inter text-xs md:text-sm font-semibold text-white block mb-0.5">{sub.title}</span>
                            {sub.description && (
                              <p className="text-white/60 text-[11px] font-light leading-relaxed">{sub.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {total > 1 && (
                <PeekCard service={at(1)} side="right" onClick={next} />
              )}
            </div>

            {/* Controls */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous service"
                  className="w-11 h-11 border border-white/20 bg-black/60 text-white flex items-center justify-center hover:bg-[#fcea00] hover:text-black hover:border-[#fcea00] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                <div className="flex items-center gap-2">
                  {services.map((svc, i) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Go to ${svc.title}`}
                      className={`h-1.5 transition-all ${
                        i === index ? "w-8 bg-[#fcea00]" : "w-3 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next service"
                  className="w-11 h-11 border border-white/20 bg-black/60 text-white flex items-center justify-center hover:bg-[#fcea00] hover:text-black hover:border-[#fcea00] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PeekCard({ service, side, onClick }: { service: Service; side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${service.title}`}
      className={`hidden sm:block relative aspect-[4/5] w-[18%] max-w-[170px] border border-white/10 overflow-hidden opacity-40 hover:opacity-70 transition-all cursor-pointer ${
        side === "left" ? "-mr-1" : "-ml-1"
      }`}
    >
      {service.backgroundUrl ? (
        <img
          src={service.backgroundUrl}
          alt={service.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#1a1a1a]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      <div className="absolute inset-0 flex items-end p-3">
        <h4 className="font-inter text-xs sm:text-sm font-bold text-white/80 leading-tight truncate w-full">
          {service.title}
        </h4>
      </div>
    </button>
  );
}
