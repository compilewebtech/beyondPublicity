import { motion } from "framer-motion";

const services = [
  {
    icon: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
    title: "Film Production",
    description: "From concept to final cut, we produce full-length feature films, short films, and cinematic productions that captivate audiences worldwide.",
  },
  {
    icon: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-1.5-3.75c.621 0 1.125.504 1.125 1.125v1.5",
    title: "Commercial Advertising",
    description: "Compelling TV commercials, brand films, and digital ads that connect with audiences and drive results for leading brands across the region.",
  },
  {
    icon: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
    title: "Documentary Production",
    description: "Authentic, gripping documentaries that tell real stories with depth, nuance, and an unwavering commitment to truth and human connection.",
  },
  {
    icon: "M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z",
    title: "Music Video Production",
    description: "Visually stunning music videos that amplify your artistry, blending creative direction with technical excellence to create memorable visual experiences.",
  },
  {
    icon: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z",
    title: "Photography",
    description: "Professional photography services for campaigns, events, portraits, and editorial — capturing moments and moods with artistic precision.",
  },
  {
    icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
    title: "Post-Production",
    description: "State-of-the-art editing, color grading, VFX, sound design, and finishing — transforming raw footage into polished cinematic masterpieces.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-28 bg-[#080808] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase font-light">What We Do</span>
            <div className="h-px w-12 bg-[#c9a84c]" />
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-[#c9a84c]">Services</span>
          </h2>
          <p className="text-white/50 text-base font-light max-w-2xl mx-auto">
            We cover every aspect of production, turning ideas into cinematic brilliance,
            compelling ads, immersive experiences, and gripping movies.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative p-8 border border-white/5 bg-white/[0.02] hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all duration-500 cursor-default"
            >
              <div className="absolute top-0 left-0 w-0 h-0.5 bg-[#c9a84c] group-hover:w-full transition-all duration-500" />

              <div className="text-[#c9a84c] mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                </svg>
              </div>
              <h3 className="font-cinzel text-lg font-semibold text-white mb-3 group-hover:text-[#c9a84c] transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-[#c9a84c]/0 group-hover:text-[#c9a84c] transition-all duration-300">
                <span className="text-xs tracking-widest uppercase font-light">Learn More</span>
                <svg className="w-4 h-4 -translate-x-2 group-hover:translate-x-0 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
