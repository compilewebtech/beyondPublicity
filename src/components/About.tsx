import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase font-light">About Us</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Beyond Conventional{" "}
              <span className="text-[#c9a84c]">Limits</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-6 font-light">
              Welcome to BeyondPublicity Productions, where we redefine the art of storytelling
              beyond conventional limits. Our team is dedicated to crafting excellence,
              ensuring your project transforms into an exceptional final product.
            </p>
            <p className="text-white/60 text-base leading-relaxed mb-6 font-light">
              Join us in this creative realm, where innovation meets impact, and every
              project is an opportunity to leave a lasting impression.
            </p>
            <p className="text-white/60 text-base leading-relaxed mb-10 font-light">
              Based in Lebanon, we serve clients across the Middle East and beyond,
              bringing cinematic vision to every production — from commercials and
              documentaries to feature films and immersive experiences.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z", title: "Visionary Directors", desc: "Creative leaders who bring unique perspectives" },
                { icon: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z", title: "Expert Cinematographers", desc: "Capturing every frame with precision" },
                { icon: "M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664", title: "Post-Production Pros", desc: "Polishing every detail to perfection" },
                { icon: "M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z", title: "Sound Engineers", desc: "Crafting immersive audio experiences" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium mb-1">{item.title}</h4>
                    <p className="text-white/40 text-xs font-light leading-relaxed">{item.desc}</p>
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
              <div className="absolute -top-4 -left-4 w-2/3 h-2/3 border-l-2 border-t-2 border-[#c9a84c]/50 pointer-events-none z-10" />
              <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-r-2 border-b-2 border-[#c9a84c]/50 pointer-events-none z-10" />

              <img
                src="/images/about-bg.jpg"
                alt="BeyondPublicity Productions Studio"
                className="w-full h-[500px] object-cover grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-sm border border-[#c9a84c]/30 px-6 py-4"
              >
                <div className="font-cinzel text-[#c9a84c] text-2xl font-bold">10+</div>
                <div className="text-white/60 text-xs tracking-widest uppercase font-light mt-1">
                  Years of Excellence
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
