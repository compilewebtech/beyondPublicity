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
    <section id="team" className="relative py-28 bg-[#080808]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-white" />
            <span className="text-white text-xs tracking-[0.4em] uppercase font-light">The People</span>
            <div className="h-px w-12 bg-white" />
          </div>
          <h2 className="font-inter text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the Team
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
              className="px-6 py-2 border border-white/40 text-white text-xs tracking-widest uppercase font-light hover:bg-[#fcea00] hover:text-black transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40 text-sm font-light">Team members coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-10">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: Math.min(i * 0.08, 0.4) }}
                className="text-center"
              >
                <div className="aspect-[3/4] mb-5 overflow-hidden">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-inter text-5xl font-bold text-white/20">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                </div>

                <h3 className="font-inter text-sm sm:text-base font-bold tracking-widest uppercase text-white">
                  {member.name}
                </h3>
                <p className="text-[#fcea00] text-[10px] sm:text-xs tracking-widest uppercase font-light mt-2">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="text-white/70 text-xs font-light leading-relaxed mt-3 max-w-[18rem] mx-auto">
                    {member.bio}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
