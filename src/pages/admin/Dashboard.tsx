import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolioItems } from "@/services/portfolio";
import { getSlides } from "@/services/slideshow";
import { getClients } from "@/services/clients";

export default function Dashboard() {
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [items, slides, clients] = await Promise.all([
          getPortfolioItems(),
          getSlides(),
          getClients(),
        ]);
        setPortfolioCount(items.length);
        setSlideCount(slides.length);
        setClientCount(clients.length);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    {
      label: "Portfolio Items",
      value: portfolioCount,
      link: "/admin/portfolio",
      action: "Manage Portfolio",
    },
    {
      label: "Hero Slides",
      value: slideCount,
      link: "/admin/slideshow",
      action: "Manage Slideshow",
    },
    {
      label: "Clients",
      value: clientCount,
      link: "/admin/clients",
      action: "Manage Clients",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/40 text-sm font-light">Overview of your website content</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="border border-white/10 bg-white/[0.02] p-6">
            <p className="text-white/40 text-xs tracking-widest uppercase font-light mb-2">
              {card.label}
            </p>
            <p className="font-inter text-3xl font-bold text-white mb-4">{card.value}</p>
            <Link
              to={card.link}
              className="text-white/50 text-xs tracking-widest uppercase font-light hover:text-white transition-colors"
            >
              {card.action} →
            </Link>
          </div>
        ))}
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-6">
        <h2 className="font-inter text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/portfolio?action=add"
            className="px-5 py-2.5 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors"
          >
            Add Portfolio Item
          </Link>
          <Link
            to="/admin/slideshow"
            className="px-5 py-2.5 border border-white/20 text-white/60 text-xs tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
          >
            Upload Slide
          </Link>
          <Link
            to="/admin/team"
            className="px-5 py-2.5 border border-white/20 text-white/60 text-xs tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
          >
            Edit Team
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 border border-white/20 text-white/60 text-xs tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
          >
            View Live Site
          </Link>
        </div>
      </div>
    </div>
  );
}
