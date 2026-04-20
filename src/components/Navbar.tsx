import { useState, useEffect } from "react";

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => scrollTo("#home")}
          className="flex items-center gap-2.5 group"
          aria-label="BeyondPublicity — Home"
        >
          <img
            src="/images/beyondlogo.png"
            alt=""
            aria-hidden="true"
            className="h-9 w-9 object-contain invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
          <span className="font-inter text-white text-lg font-bold tracking-[0.2em] leading-none">
            BeyondPublicity
          </span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => scrollTo(link.href)}
                className={`relative text-sm tracking-widest font-light uppercase transition-colors duration-300 ${
                  activeSection === link.href.replace("#", "")
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                } after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-white after:transition-all after:duration-300 ${
                  activeSection === link.href.replace("#", "")
                    ? "after:w-full"
                    : "after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => scrollTo("#contact")}
          className="hidden md:block px-6 py-2 border border-[#ffffff] text-white text-xs tracking-widest uppercase font-medium hover:bg-[#ffffff] hover:text-black transition-all duration-300"
        >
          Consultation
        </button>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-[#ffffff] transition-transform duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#ffffff] transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#ffffff] transition-transform duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-black/95 backdrop-blur-md`}
      >
        <ul className="flex flex-col px-6 py-4 gap-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => scrollTo(link.href)}
                className={`text-sm tracking-widest uppercase font-light ${
                  activeSection === link.href.replace("#", "")
                    ? "text-white"
                    : "text-white/70"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => scrollTo("#contact")}
              className="px-6 py-2 border border-[#ffffff] text-white text-xs tracking-widest uppercase font-medium hover:bg-[#ffffff] hover:text-black transition-all duration-300 mt-2"
            >
              Consultation
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
