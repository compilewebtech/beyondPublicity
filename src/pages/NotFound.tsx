import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="font-inter text-[120px] leading-none font-bold text-white/10 mb-4">
          404
        </div>
        <h1 className="font-inter text-3xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-white/50 text-sm font-light mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-white text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#fcea00] transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/#contact"
            className="px-6 py-3 border border-white/20 text-white/60 text-xs tracking-widest uppercase font-light hover:border-[#fcea00] hover:text-[#fcea00] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
