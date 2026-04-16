import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OrganKey = "brain" | "heart" | "lungs" | "liver";

interface OrganMember {
  name: string;
  role: string;
  photo: string;
  label: string;
  skills: string[];
  vision: string;
  color: string;
}

const organMembers: Record<OrganKey, OrganMember> = {
  brain: {
    name: "Theodor Abdo",
    role: "Founder & Producer",
    photo: "/images/team/theodor.jpg",
    label: "The Brain",
    skills: ["Strategic Vision", "Creative Direction", "Business Leadership"],
    vision: "Every great production starts with a bold idea. I see beyond what's in front of us — turning raw concepts into stories that move people.",
    color: "#c9a84c",
  },
  heart: {
    name: "Violette Ouais",
    role: "Art Director",
    photo: "/images/team/violette.jpg",
    label: "The Heart",
    skills: ["Visual Design", "Set Direction", "Emotional Storytelling"],
    vision: "Art isn't just what you see — it's what you feel. I pour passion into every frame, every color, every texture.",
    color: "#e74c3c",
  },
  lungs: {
    name: "Rudi Abi Hanna",
    role: "Sound Engineer & Designer",
    photo: "/images/team/rudi.jpg",
    label: "The Lungs",
    skills: ["Sound Design", "Audio Mixing", "Live Production"],
    vision: "Sound is the breath of a production. It gives life, rhythm, and emotion to everything the audience experiences.",
    color: "#3498db",
  },
  liver: {
    name: "Elie Saliba",
    role: "Production Manager",
    photo: "/images/team/elie-saliba.jpg",
    label: "The Backbone",
    skills: ["Operations", "Problem Solving", "Logistics"],
    vision: "I make sure every moving piece works behind the scenes — so the magic in front of the camera never stops.",
    color: "#8B6914",
  },
};

const organOrder: OrganKey[] = ["brain", "heart", "lungs", "liver"];

const organIcons: Record<OrganKey, React.ReactNode> = {
  brain: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C9.243 2 7 4.243 7 7c0 .587.121 1.147.316 1.673A3.497 3.497 0 005 12c0 1.025.452 1.94 1.156 2.578A3.49 3.49 0 005 17c0 1.93 1.57 3.5 3.5 3.5.444 0 .866-.092 1.26-.244A2.994 2.994 0 0012 22a2.994 2.994 0 002.24-1.744c.394.152.816.244 1.26.244 1.93 0 3.5-1.57 3.5-3.5 0-.897-.35-1.706-.903-2.322A3.49 3.49 0 0019 12a3.497 3.497 0 00-2.316-3.327C16.879 8.147 17 7.587 17 7c0-2.757-2.243-5-5-5z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  lungs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <path d="M12 2v8m0 0c-3 1-7 3-7 8 0 2.5 2 4 4 4s3-1 3-3v-9zm0 0c3 1 7 3 7 8 0 2.5-2 4-4 4s-3-1-3-3v-9z" />
    </svg>
  ),
  liver: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18l6 3.75v7.14l-6 3.75-6-3.75V7.93l6-3.75z" />
    </svg>
  ),
};

/* Positions of the interactive hotspots on the body SVG (percentage-based) */
const organHotspots: Record<OrganKey, { cx: number; cy: number }> = {
  brain: { cx: 100, cy: 38 },
  heart: { cx: 90, cy: 152 },
  lungs: { cx: 118, cy: 148 },
  liver: { cx: 84, cy: 192 },
};

function BodyIllustration({ activeOrgan }: { activeOrgan: OrganKey | null }) {
  const active = activeOrgan ? organMembers[activeOrgan] : null;

  return (
    <svg viewBox="0 0 200 420" className="w-full h-full max-w-[260px] mx-auto" fill="none">
      {/* Head */}
      <ellipse cx="100" cy="45" rx="32" ry="38"
        fill={activeOrgan === "brain" ? `${active!.color}20` : "#c9a84c10"}
        stroke={activeOrgan === "brain" ? active!.color : "#c9a84c"}
        strokeWidth="1.5" strokeOpacity={activeOrgan === "brain" ? 0.8 : 0.3}
      />
      {/* Neck */}
      <rect x="88" y="80" width="24" height="20" rx="8" fill="#c9a84c08" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.2" />
      {/* Torso */}
      <path d="M60 100 Q50 100 45 120 L35 200 Q32 220 45 230 L65 250 Q80 260 100 260 Q120 260 135 250 L155 230 Q168 220 165 200 L155 120 Q150 100 140 100 Z"
        fill="#c9a84c08" stroke="#c9a84c" strokeWidth="1.5" strokeOpacity="0.25" />
      {/* Left arm */}
      <path d="M60 105 Q40 110 25 145 L15 195 Q10 210 18 215 Q25 220 30 210 L50 160"
        fill="#c9a84c05" stroke="#c9a84c" strokeWidth="1.5" strokeOpacity="0.2" />
      {/* Right arm */}
      <path d="M140 105 Q160 110 175 145 L185 195 Q190 210 182 215 Q175 220 170 210 L150 160"
        fill="#c9a84c05" stroke="#c9a84c" strokeWidth="1.5" strokeOpacity="0.2" />
      {/* Left leg */}
      <path d="M75 255 L65 330 Q60 360 55 380 Q52 395 60 400 Q68 405 72 395 L80 360 L85 260"
        fill="#c9a84c05" stroke="#c9a84c" strokeWidth="1.5" strokeOpacity="0.2" />
      {/* Right leg */}
      <path d="M125 255 L135 330 Q140 360 145 380 Q148 395 140 400 Q132 405 128 395 L120 360 L115 260"
        fill="#c9a84c05" stroke="#c9a84c" strokeWidth="1.5" strokeOpacity="0.2" />

      {/* Organ glows */}
      {activeOrgan === "brain" && (
        <motion.ellipse cx="100" cy="40" rx="22" ry="20"
          fill={active!.color} fillOpacity={0.25}
          animate={{ fillOpacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {activeOrgan === "heart" && (
        <motion.circle cx="90" cy="152" r="16"
          fill={active!.color} fillOpacity={0.3}
          animate={{ fillOpacity: [0.15, 0.4, 0.15], scale: [1, 1.08, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {activeOrgan === "lungs" && (
        <motion.ellipse cx="118" cy="148" rx="20" ry="24"
          fill={active!.color} fillOpacity={0.25}
          animate={{ fillOpacity: [0.1, 0.3, 0.1], ry: [24, 28, 24] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      {activeOrgan === "liver" && (
        <motion.ellipse cx="84" cy="192" rx="22" ry="16"
          fill={active!.color} fillOpacity={0.25}
          animate={{ fillOpacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* Interactive hotspots */}
      {organOrder.map((key) => {
        const spot = organHotspots[key];
        const member = organMembers[key];
        const isActive = activeOrgan === key;
        return (
          <g key={key}>
            {/* Pulse ring */}
            {!isActive && (
              <motion.circle
                cx={spot.cx} cy={spot.cy} r="14"
                fill="none" stroke={member.color} strokeWidth="1"
                animate={{ r: [14, 22], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {/* Active ring */}
            {isActive && (
              <motion.circle
                cx={spot.cx} cy={spot.cy} r="16"
                fill="none" stroke={member.color} strokeWidth="2"
                strokeOpacity={0.6}
                animate={{ r: [16, 20, 16], strokeOpacity: [0.6, 0.3, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function Team() {
  const [activeOrgan, setActiveOrgan] = useState<OrganKey | null>(null);
  const activeMember = activeOrgan ? organMembers[activeOrgan] : null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="team" className="relative py-28 bg-[#080808] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
      <div className="absolute -left-40 bottom-1/4 w-80 h-80 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 top-1/3 w-60 h-60 bg-[#c9a84c]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase font-light">The People</span>
            <div className="h-px w-12 bg-[#c9a84c]" />
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the <span className="text-[#c9a84c]">Team</span>
          </h2>
          <p className="text-white/50 text-base font-light max-w-2xl mx-auto">
            One body, many talents. Each part of our team brings something vital to the table.
            Click an organ to discover who drives that part of our creative machine.
          </p>
        </motion.div>

        {/* Main layout: Body + Info panel */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left: Body illustration with organ buttons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative max-w-[320px] mx-auto">
              <BodyIllustration activeOrgan={activeOrgan} />

              {/* Clickable organ buttons overlaid */}
              {organOrder.map((key) => {
                const spot = organHotspots[key];
                const member = organMembers[key];
                const isActive = activeOrgan === key;
                // Convert SVG coordinates to percentages (viewBox is 200x420)
                const left = `${(spot.cx / 200) * 100}%`;
                const top = `${(spot.cy / 420) * 100}%`;

                return (
                  <motion.button
                    key={key}
                    onClick={() => setActiveOrgan(isActive ? null : key)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left, top }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center border-2 backdrop-blur-sm transition-all duration-300 ${
                        isActive
                          ? "bg-white/15 border-white/50 shadow-lg"
                          : "bg-white/5 border-white/15 hover:border-white/30 hover:bg-white/10"
                      }`}
                      style={{ color: member.color, boxShadow: isActive ? `0 0 24px ${member.color}30` : "none" }}
                    >
                      {organIcons[key]}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Organ legend below body */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {organOrder.map((key) => {
                const member = organMembers[key];
                const isActive = activeOrgan === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveOrgan(isActive ? null : key)}
                    className={`flex items-center gap-2 px-3 py-1.5 border text-xs tracking-wider uppercase font-light transition-all duration-300 ${
                      isActive
                        ? "border-white/30 bg-white/5"
                        : "border-white/5 hover:border-white/15"
                    }`}
                  >
                    <span style={{ color: member.color }}>{organIcons[key]}</span>
                    <span className={isActive ? "text-white" : "text-white/40"}>{member.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Info panel */}
          <div className="min-h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              {activeMember && activeOrgan ? (
                <motion.div
                  key={activeOrgan}
                  initial={{ opacity: 0, x: 30, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.97 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 28 }}
                  className="w-full"
                >
                  <div className="border border-white/10 bg-white/[0.02] p-8 relative overflow-hidden">
                    {/* Accent line */}
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: activeMember.color, opacity: 0.6 }} />
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                      style={{ backgroundColor: activeMember.color, opacity: 0.05 }} />

                    {/* Photo + Name */}
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 flex-shrink-0"
                        style={{ borderColor: activeMember.color }}>
                        <img
                          src={activeMember.photo}
                          alt={activeMember.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-white/5 font-cinzel font-bold text-xl" style="color:${activeMember.color}">${activeMember.name.split(" ").map(n => n[0]).join("")}</div>`;
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-xs tracking-widest uppercase font-semibold mb-1"
                          style={{ color: activeMember.color }}>
                          {activeMember.label}
                        </div>
                        <h3 className="font-cinzel text-2xl font-bold text-white">
                          {activeMember.name}
                        </h3>
                        <p className="text-white/40 text-sm font-light">{activeMember.role}</p>
                      </div>
                    </div>

                    {/* Vision quote */}
                    <div className="mb-6 pl-4 border-l-2" style={{ borderColor: `${activeMember.color}60` }}>
                      <p className="text-white/60 text-sm font-light leading-relaxed italic">
                        "{activeMember.vision}"
                      </p>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase font-light mb-3">Core Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {activeMember.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 text-xs font-light tracking-wider border"
                            style={{
                              borderColor: `${activeMember.color}30`,
                              color: activeMember.color,
                              backgroundColor: `${activeMember.color}08`,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center py-16"
                >
                  <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#c9a84c]/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#c9a84c]/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                    </svg>
                  </div>
                  <p className="text-white/30 text-sm font-light mb-2">
                    Click on any organ to discover
                  </p>
                  <p className="text-white/20 text-xs font-light">
                    the person behind that role
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Additional team members strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <p className="text-center text-white/25 text-[10px] tracking-widest uppercase mb-6">Also Part of the Team</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Maroun Rizk", role: "Production Coordinator" },
              { name: "Elie Abou Nasr", role: "Music Composer" },
              { name: "& More Talents", role: "Growing Every Day" },
            ].map((m) => (
              <div key={m.name} className="border border-white/5 bg-white/[0.01] p-4 text-center">
                <p className="text-white/70 text-sm font-medium font-cinzel">{m.name}</p>
                <p className="text-[#c9a84c]/60 text-[10px] tracking-wider uppercase font-light mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16 p-10 border border-[#c9a84c]/20 bg-[#c9a84c]/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a84c]/5 to-transparent pointer-events-none" />
          <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Build Your Team?
          </h3>
          <p className="text-white/50 text-sm font-light mb-8 max-w-xl mx-auto">
            Whether you need visionary directors, adept cinematographers, or meticulous
            post-production specialists, we've got the talent to elevate your project.
          </p>
          <button
            onClick={() => scrollTo("contact")}
            className="px-8 py-4 bg-[#c9a84c] text-black text-sm tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/30"
          >
            Start a Consultation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
