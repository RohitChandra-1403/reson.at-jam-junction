import React from 'react';
import { Heart, Users } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TEAM = [
  {
    id: 1,
    name: "Rohit Chandra",
    role: "Founder & Community Lead",
    instrument: "Vocals & Acoustic Guitar",
    bio: "Cultivating Bangalore's unplugged jam sanctuary where bedroom guitarists, shower singers, and seasoned musicians jam as equals.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=750",
    social: { ig: "https://instagram.com/reson.at", li: "https://linkedin.com" }
  },
  {
    id: 2,
    name: "Aarav Mehta",
    role: "Acoustic & Audio Curator",
    instrument: "Keys & Sound Craft",
    bio: "Obsessed with natural room acoustics and raw dynamics, ensuring every acoustic chord resonates warmly throughout the circle.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=750",
    social: { ig: "https://instagram.com/reson.at", li: "https://linkedin.com" }
  },
  {
    id: 3,
    name: "Pooja Nair",
    role: "Floor Host & Vocal Lead",
    instrument: "Lead Vocals & Cajon",
    bio: "Breaks the ice, orchestrates spontaneous four-part harmonies, and makes sure first-time jammers feel immediately welcomed.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=750",
    social: { ig: "https://instagram.com/reson.at", li: "https://linkedin.com" }
  },
  {
    id: 4,
    name: "Devika Sharma",
    role: "Creative Director & Visuals",
    instrument: "Violin & Photography",
    bio: "Documenting authentic smiles, candid rehearsals, and the raw creative connections that define our weekend community circles.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&h=750",
    social: { ig: "https://instagram.com/reson.at", li: "https://linkedin.com" }
  }
];

export default function TeamMembers() {
  return (
    <section 
      id="team-members" 
      className="py-20 sm:py-28 bg-dusk-900 relative overflow-hidden select-none border-t border-white/[0.06]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>The Circle Hosts</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400">Core Crew</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 mt-3 font-normal leading-relaxed">
            The community organizers and musicians dedicated to keeping Jam Junction authentic, welcoming, and pressure-free.
          </p>
        </div>

        {/* Consistent 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <div
              key={member.id}
              className="group relative rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-xl"
            >
              <div>
                {/* 1. Consistent Portrait Ratio & Lighting Treatment */}
                <div className="relative aspect-[4/4.5] rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/10">
                  <img 
                    src={member.img} 
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-[center_20%] filter brightness-[0.98] contrast-[1.04] saturate-[1.05] group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />

                  {/* Gradient Scrim for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                  {/* Clean Instrument Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[11px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                      {member.instrument}
                    </span>
                  </div>
                </div>

                {/* 2. Scannable Typography: Name & Role */}
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-400 mt-1 uppercase tracking-wider font-mono">
                    {member.role}
                  </p>
                  
                  {/* 3. Concise 2-3 Line Description */}
                  <p className="text-sm text-zinc-300 leading-relaxed font-normal mt-3 line-clamp-3">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* 4. Minimal, Clean Social Links */}
              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Core Host</span>
                <div className="flex items-center gap-2">
                  <a 
                    href={member.social.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white flex items-center justify-center transition-colors text-xs"
                    aria-label={`${member.name} Instagram`}
                  >
                    <InstagramIcon />
                  </a>
                  <a 
                    href={member.social.li}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white flex items-center justify-center transition-colors text-xs"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <LinkedinIcon />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Join The Crew Callout */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-6 py-3 rounded-full bg-white/[0.04] border border-white/10 text-sm text-zinc-300 backdrop-blur-md">
            <span>Want to volunteer, host an acoustic session, or join the crew?</span>
            <a 
              href="https://www.instagram.com/reson.at" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 font-semibold hover:underline"
            >
              DM @reson.at on Instagram →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
