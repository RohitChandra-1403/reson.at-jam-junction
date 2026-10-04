import React from 'react';
import { Mic2, Guitar, CircleDashed, Users, Radio, Sparkles } from 'lucide-react';

export default function JamJunctionEvent() {
  const phases = [
    { 
      number: "01",
      timelineLabel: "Warmup",
      icon: <CircleDashed className="w-5 h-5 text-amber-400" />, 
      title: "The Icebreaker Warmup", 
      genre: "Tuning & Easy Chords",
      desc: "Start the night with relaxed acoustic singalongs to tune voices together and melt away stage fright before the circle begins.",
      activeBadge: "bg-amber-400/10 text-amber-400 border border-amber-400/30"
    },
    { 
      number: "02",
      timelineLabel: "Circle",
      icon: <Guitar className="w-5 h-5 text-violet-400" />, 
      title: "Indie Acoustic Circle", 
      genre: "Originals & Covers",
      desc: "Pass the spotlight across the circle. Share original songs, indie favorites, or soulful fingerstyle chords in a supportive circle.",
      activeBadge: "bg-violet-400/10 text-violet-400 border border-violet-400/30"
    },
    { 
      number: "03",
      timelineLabel: "Crossroads",
      icon: <Mic2 className="w-5 h-5 text-pink-400" />, 
      title: "Genre Crossroads", 
      genre: "Spontaneous Mashup",
      desc: "Where Bollywood meets indie rock and jazz chords meet folk rhythms. Spontaneous jams with zero rehearsals and zero pressure.",
      activeBadge: "bg-pink-400/10 text-pink-400 border border-pink-400/30"
    },
    { 
      number: "04",
      timelineLabel: "Finale",
      icon: <Users className="w-5 h-5 text-emerald-400" />, 
      title: "Grand Room Singalong", 
      genre: "Full Ensemble Harmony",
      desc: "The epic finale where 50+ voices and instruments harmonize together. No solos, no barriers, just pure shared collective resonance.",
      activeBadge: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
    }
  ];

  return (
    <section id="jam-junction" className="pt-16 sm:pt-24 pb-20 sm:pb-28 bg-dusk-900 border-t border-white/[0.06] relative overflow-hidden select-none">
      
      {/* Subtle background ambient texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section (Consistent Spacing: 16-20px heading-to-subtitle) */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Format & Flow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            How The Jam <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400">Flows</span>
          </h2>

          {/* Heading to Subtitle Gap: 16-20px (mt-4 sm:mt-5) */}
          <p className="text-base sm:text-lg text-zinc-400 mt-4 sm:mt-5 font-normal leading-relaxed">
            Four organic stages of an acoustic gathering. No stage barriers, no judgment, pure collective music.
          </p>
        </div>

        {/* Subtitle to Content Gap: 48-56px (mt-12 sm:mt-14) */}
        <div className="mt-12 sm:mt-14">
          
          {/* Subtle Progression Timeline (Connecting the 4 stages on desktop) */}
          <div className="hidden lg:block relative mb-8 px-6">
            <div className="absolute top-4 left-16 right-16 h-0.5 bg-gradient-to-r from-amber-400/40 via-pink-400/40 to-emerald-400/40 z-0" />
            <div className="relative z-10 grid grid-cols-4 text-center">
              {phases.map((phase, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${phase.activeBadge} bg-dusk-900 shadow-md`}>
                    {phase.number}
                  </div>
                  <span className="text-[11px] font-mono tracking-wider text-zinc-400 mt-2 uppercase font-medium">
                    {phase.timelineLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Simplified, Classy Phase Cards (Inside Padding: 24-32px, Clear Title-to-Desc Gap) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {phases.map((phase, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-2xl p-6 sm:p-7 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] flex flex-col justify-between backdrop-blur-xl"
              >
                <div>
                  {/* Top Header: Phase Badge & Clean Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
                      PHASE {phase.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {phase.icon}
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                    {phase.title}
                  </h3>

                  {/* Increased Space between Heading and Description (16-20px) */}
                  <p className="text-sm text-zinc-300/90 leading-relaxed font-normal mt-4">
                    {phase.desc}
                  </p>
                </div>

                {/* Simplified Card Footer: Clean Subtle Pill */}
                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  <span className="inline-flex text-[11px] font-medium text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/5">
                    {phase.genre}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Stage-Rider & Gear Policy Banner */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-violet-950/40 via-black/60 to-amber-950/30 border border-white/10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-pink-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shadow-sm shrink-0">
              🎸
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                STAGE RIDER & GEAR POLICY
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                Bring Your Instrument (Or Just Your Voice)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl leading-relaxed">
                Guitars, Ukuleles, Keyboards, Cajons, Flutes, Violins, or simple rhythm clapping. 
                Backup acoustic instruments are provided in the lounge.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Skill Levels</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-200">
              <span>Zero Auditions</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
