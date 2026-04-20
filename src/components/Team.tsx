import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTeamMembers, type TeamMember } from "@/services/team";

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    let alive = true;
    getTeamMembers()
      .then((data) => { if (alive) setMembers(data); })
      .catch((err) => {
        console.error("Failed to load team", err);
        if (alive) setError(true);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  useEffect(() => load(), [load]);

  return (
    <section id="team" className="relative py-28 bg-[#080808] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff]/40 to-transparent" />
      <div className="absolute -left-40 bottom-1/4 w-80 h-80 bg-[#ffffff]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 top-1/3 w-60 h-60 bg-[#ffffff]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#ffffff]" />
            <span className="text-white text-xs tracking-[0.4em] uppercase font-light">The People</span>
            <div className="h-px w-12 bg-[#ffffff]" />
          </div>
          <h2 className="font-inter text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the <span className="text-white">Team</span>
          </h2>
          <p className="text-white/50 text-base font-light max-w-2xl mx-auto">
            The people behind every production — bringing vision, craft, and heart to every project.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-sm font-light mb-4">Having trouble loading the team.</p>
            <button
              onClick={load}
              className="px-6 py-2 border border-white/40 text-white text-xs tracking-widest uppercase font-light hover:bg-white hover:text-black transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40 text-sm font-light">Team members coming soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative border border-white/5 bg-white/[0.02] hover:border-[#ffffff]/40 hover:bg-[#ffffff]/[0.04] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-[#ffffff] group-hover:w-full transition-all duration-500" />

                <div className="aspect-square overflow-hidden bg-white/[0.02] relative">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-inter text-5xl font-bold text-white/30">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="p-6">
                  <h3 className="font-inter text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-white text-xs tracking-widest uppercase font-light mb-3 opacity-70">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-white/50 text-sm font-light leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
