import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { getServices, type Service } from "@/services/services";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// Replace each `href` below with the real social profile URL
const socials: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/beyondpublicitymena?igsh=enRjdjN2Z2hiYjU4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-4 h-4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1JHU3gRMVv/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M13.5 21.95V13.5h2.85l.43-3.3h-3.28V8.1c0-.96.27-1.6 1.64-1.6h1.75V3.54A23.4 23.4 0 0 0 14.32 3.4c-2.54 0-4.28 1.55-4.28 4.4v2.4H7.18v3.3h2.86v8.45h3.46z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.4v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    let alive = true;
    getServices()
      .then((data) => { if (alive) setServices(data); })
      .catch((err) => console.error("Footer: failed to load services", err));
    return () => { alive = false; };
  }, []);

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
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/40 hover:border-white hover:text-white transition-all duration-300"
                >
                  {s.icon}
                </a>
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
                { label: "Services", id: "services" },
                { label: "Portfolio", id: "portfolio" },
                { label: "About Us", id: "about" },
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
            {services.length === 0 ? (
              <p className="text-white/30 text-xs font-light italic">Loading…</p>
            ) : (
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollTo("services")}
                      className="text-white/40 text-sm font-light hover:text-white transition-colors duration-300 flex items-center gap-2 group text-left"
                    >
                      <span className="w-0 h-px bg-[#ffffff] group-hover:w-4 transition-all duration-300 flex-shrink-0" />
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-light tracking-wider">
            © {new Date().getFullYear()} BeyondPublicity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-white/25 text-xs font-light hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/25 text-xs font-light hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
          <p className="text-white/20 text-xs font-light">
            Beirut, Lebanon 🇱🇧
          </p>
        </div>
      </div>
    </footer>
  );
}
