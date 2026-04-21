import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff]/40 to-transparent" />
      <div className="absolute right-0 top-1/3 w-96 h-96 bg-[#ffffff]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-72 h-72 bg-[#ffffff]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#ffffff]" />
            <span className="text-white text-xs tracking-[0.4em] uppercase font-light">Get In Touch</span>
            <div className="h-px w-12 bg-[#ffffff]" />
          </div>
          <h2 className="font-inter text-4xl md:text-5xl font-bold text-white mb-4">
            Let's <span className="text-white">Connect</span>
          </h2>
          <p className="text-white/50 text-base font-light max-w-xl mx-auto">
            Ready to bring your vision to life? Choose the way that works best for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendly */}
          <motion.a
            href="https://calendly.com/theodorabdo/30min"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative border border-white/10 bg-white/[0.02] p-10 text-center hover:border-[#ffffff]/40 hover:bg-[#ffffff]/5 transition-all duration-500"
          >
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#ffffff]/40 rounded-full flex items-center justify-center group-hover:border-[#ffffff] group-hover:bg-[#ffffff]/10 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>

            <h3 className="font-inter text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors duration-300">
              Schedule a Free Consultation
            </h3>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
              Book a free 30-minute call to discuss your project, vision, and how we can bring it to life.
            </p>

            <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold group-hover:bg-[#d4b86a] transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Book 30 Min — Free
            </span>
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/+96176186334"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="group relative border border-white/10 bg-white/[0.02] p-10 text-center hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all duration-500"
          >
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#25D366]/40 rounded-full flex items-center justify-center group-hover:border-[#25D366] group-hover:bg-[#25D366]/10 transition-all duration-300">
              <svg className="w-8 h-8 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>

            <h3 className="font-inter text-xl font-semibold text-white mb-3 group-hover:text-[#25D366] transition-colors duration-300">
              Message Us on WhatsApp
            </h3>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
              Have a quick question or want to start a conversation? Reach out directly on WhatsApp.
            </p>

            <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-xs tracking-widest uppercase font-semibold group-hover:bg-[#22c55e] transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              Get In Touch
            </span>
          </motion.a>
        </div>

        {/* Contact info */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          {[
            {
              label: "Location",
              value: "Beirut, Lebanon",
              href: null,
              icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
            },
            {
              label: "Email",
              value: "beyondpublicitymena@gmail.com",
              href: "mailto:beyondpublicitymena@gmail.com",
              icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
            },
            {
              label: "Phone",
              value: "+961 76 186 334",
              href: "tel:+96176186334",
              icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
            },
          ].map((item, i) => {
            const body = (
              <>
                <div className="flex-shrink-0 w-10 h-10 border border-[#ffffff]/30 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white/30 text-[10px] tracking-widest uppercase font-light">{item.label}</p>
                  <p className="text-white/70 text-sm font-light truncate">{item.value}</p>
                </div>
              </>
            );

            const wrapperClass =
              "flex items-center gap-4 border border-white/5 bg-white/[0.01] p-4 transition-colors duration-300" +
              (item.href ? " hover:border-[#ffffff]/30 hover:bg-white/[0.03]" : "");

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                {item.href ? (
                  <a href={item.href} className={wrapperClass}>{body}</a>
                ) : (
                  <div className={wrapperClass}>{body}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
