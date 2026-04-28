import { Link } from "react-router-dom";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";

export default function AllProjects() {
  return (
    <div className="bg-[#0a0a0a] text-white font-raleway min-h-screen">
      <header className="border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-inter text-lg font-bold">
            Beyond<span className="text-white">Publicity</span>
          </Link>
          <Link
            to="/#portfolio"
            className="inline-flex items-center gap-2 text-white/60 text-xs tracking-widest uppercase font-light hover:text-[#fcea00] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      <Portfolio />
      <Footer />
    </div>
  );
}
