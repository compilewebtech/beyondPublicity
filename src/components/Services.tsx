import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getServices, type Service } from "@/services/services";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getServices()
      .then((data) => { if (alive) setServices(data); })
      .catch((err) => console.error("Failed to load services", err))
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <section id="services" className="relative py-28 bg-[#080808] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff]/20 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#ffffff]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
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
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40 text-sm font-light">Services coming soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.3) }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col border border-white/5 bg-white/[0.02] hover:border-[#ffffff]/40 hover:bg-[#ffffff]/[0.04] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-[#ffffff] group-hover:w-full transition-all duration-500" />

                <div className="p-6 border-b border-white/5">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-white mb-4 group-hover:border-white/40 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={service.iconPath} />
                    </svg>
                  </div>
                  <div className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-light mb-2">
                    {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </div>
                  <h3 className="font-inter text-xl font-bold text-white leading-tight">
                    {service.title}
                  </h3>
                </div>

                <div className="flex flex-col flex-1 divide-y divide-white/5">
                  {service.subItems.map((sub) => (
                    <div key={sub.number + sub.title} className="p-5">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-white/40 text-xs tracking-widest font-light">{sub.number}</span>
                        <span className="font-inter text-sm font-semibold text-white">{sub.title}</span>
                      </div>
                      <p className="text-white/50 text-xs font-light leading-relaxed">{sub.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
