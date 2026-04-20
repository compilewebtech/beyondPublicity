import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLegalPage, defaultFor, type LegalPage, type LegalPageId } from "@/services/legal";

interface Props {
  id: LegalPageId;
}

export default function LegalPageView({ id }: Props) {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getLegalPage(id)
      .then((data) => {
        if (!alive) return;
        setPage(data ?? defaultFor(id));
      })
      .catch(() => {
        if (alive) setPage(defaultFor(id));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [id]);

  const otherId: LegalPageId = id === "privacy" ? "terms" : "privacy";
  const otherLabel = id === "privacy" ? "Terms of Service" : "Privacy Policy";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-raleway">
      <header className="border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-inter text-lg font-bold tracking-widest">
            BeyondPublicity
          </Link>
          <Link
            to="/"
            className="text-white/50 text-xs tracking-widest uppercase font-light hover:text-white transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {loading || !page ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-10">
              <p className="text-white/40 text-xs tracking-widest uppercase font-light mb-3">Legal</p>
              <h1 className="font-inter text-4xl font-bold text-white mb-3">{page.title}</h1>
              {page.lastUpdated && (
                <p className="text-white/40 text-sm font-light">Last updated: {page.lastUpdated}</p>
              )}
            </div>

            <div className="space-y-8 text-white/70 text-sm font-light leading-relaxed">
              {page.sections.map((section, i) => (
                <section key={i}>
                  {section.heading && (
                    <h2 className="font-inter text-lg font-semibold text-white mb-3">{section.heading}</h2>
                  )}
                  {section.body.split(/\n\s*\n/).map((para, j) => (
                    <p key={j} className={j > 0 ? "mt-3" : ""}>
                      {para}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-6 text-xs tracking-widest uppercase font-light">
              <Link to={`/${otherId}`} className="text-white/50 hover:text-white transition-colors">
                {otherLabel} →
              </Link>
              <Link to="/" className="text-white/50 hover:text-white transition-colors">
                Home
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
