const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5">
      {/* Top bar with gold line */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#ffffff] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="font-inter text-white text-2xl font-bold tracking-widest block">
                BeyondPublicity
              </span>
            </div>
            <div className="flex gap-3 mt-6">
              {["IG", "YT", "FB", "LI"].map((s) => (
                <button
                  key={s}
                  className="w-9 h-9 border border-white/10 text-white/30 text-xs font-light hover:border-[#ffffff] hover:text-white transition-all duration-300"
                  aria-label={s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase font-light mb-6 border-b border-white/5 pb-3">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", id: "home" },
                { label: "About Us", id: "about" },
                { label: "Services", id: "services" },
                { label: "Portfolio", id: "portfolio" },
                { label: "Our Team", id: "team" },
                { label: "Contact", id: "contact" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-white/40 text-sm font-light hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[#ffffff] group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase font-light mb-6 border-b border-white/5 pb-3">
              Services
            </h4>
            <ul className="space-y-3">
              {[
                "Film Production",
                "Commercial Ads",
                "Documentary",
                "Music Videos",
                "Photography",
                "Post-Production",
              ].map((s) => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo("services")}
                    className="text-white/40 text-sm font-light hover:text-white transition-colors duration-300 flex items-center gap-2 group text-left"
                  >
                    <span className="w-0 h-px bg-[#ffffff] group-hover:w-4 transition-all duration-300 flex-shrink-0" />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-light tracking-wider">
            © {new Date().getFullYear()} BeyondPublicity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-white/25 text-xs font-light hover:text-white transition-colors duration-300">
              Privacy Policy
            </button>
            <button className="text-white/25 text-xs font-light hover:text-white transition-colors duration-300">
              Terms of Service
            </button>
          </div>
          <p className="text-white/20 text-xs font-light">
            Beirut, Lebanon 🇱🇧
          </p>
        </div>
      </div>
    </footer>
  );
}
