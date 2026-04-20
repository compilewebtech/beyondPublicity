import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPortfolioItems, type PortfolioItem } from "@/services/portfolio";
import { getCategories, type Category } from "@/services/categories";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    let alive = true;
    Promise.all([getPortfolioItems(), getCategories()])
      .then(([items, cats]) => {
        if (!alive) return;
        setProjects(items);
        setCategories(cats);
      })
      .catch((err) => {
        console.error("Portfolio: failed to load", err);
        if (alive) setError(true);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  useEffect(() => load(), [load]);

  const filterTabs = useMemo(() => ["All", ...categories.map((c) => c.name)], [categories]);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="relative py-28 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff]/40 to-transparent" />
      <div className="absolute left-0 top-1/4 w-72 h-72 bg-[#ffffff]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-[#ffffff]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#ffffff]" />
            <span className="text-white text-xs tracking-[0.4em] uppercase font-light">Our Work</span>
            <div className="h-px w-12 bg-[#ffffff]" />
          </div>
          <h2 className="font-inter text-4xl md:text-5xl font-bold text-white mb-4">
            Featured <span className="text-white">Projects</span>
          </h2>
          <p className="text-white/50 text-base font-light max-w-xl mx-auto">
            Come with a project, leave with a product. A showcase of our finest productions.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filterTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2.5 text-xs tracking-widest uppercase font-light transition-all duration-300 border overflow-hidden ${
                activeCategory === cat
                  ? "bg-[#ffffff] text-black border-[#ffffff] font-medium"
                  : "border-white/20 text-white/60 hover:border-[#ffffff]/60 hover:text-white"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[#ffffff] -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-white/60 text-sm font-light mb-4">Having trouble loading the portfolio.</p>
            <button
              onClick={load}
              className="px-6 py-2 border border-white/40 text-white text-xs tracking-widest uppercase font-light hover:bg-white hover:text-black transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-white/40 text-sm font-light italic">
            {projects.length === 0 ? "New work coming soon." : "No projects in this category yet."}
          </div>
        )}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setActiveVideo(project.videoId)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden border border-white/10 group-hover:border-[#ffffff]/40 transition-colors duration-500">
                  <motion.img
                    src={`https://img.youtube.com/vi/${project.videoId}/maxresdefault.jpg`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: hoveredId === project.id ? 1.08 : 1 }}
                    transition={{ duration: 0.7 }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = `https://img.youtube.com/vi/${project.videoId}/mqdefault.jpg`;
                    }}
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-[#ffffff]/20 border-2 border-[#ffffff] flex items-center justify-center backdrop-blur-sm"
                      animate={{
                        scale: hoveredId === project.id ? 1.15 : 1,
                        backgroundColor: hoveredId === project.id ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.2)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-black/70 border border-[#ffffff]/30 backdrop-blur-sm">
                      <span className="text-white text-[10px] tracking-widest uppercase font-light">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="absolute top-4 right-4 text-white/40 text-xs font-light">
                    {project.year}
                  </div>

                  {/* Bottom info overlay */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-5"
                    initial={false}
                    animate={{ y: hoveredId === project.id ? 0 : 10, opacity: hoveredId === project.id ? 1 : 0.7 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-inter text-base font-semibold text-white group-hover:text-white transition-colors duration-300 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-white/50 text-xs font-light leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://www.youtube.com/@BeyondPublicityproductions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#ffffff]/50 text-white text-sm tracking-widest uppercase font-light hover:bg-[#ffffff] hover:text-black transition-all duration-300 group/yt"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            View All on YouTube
            <svg className="w-4 h-4 -translate-x-1 group-hover/yt:translate-x-0 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors text-sm tracking-widest uppercase flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full border border-[#ffffff]/30"
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
