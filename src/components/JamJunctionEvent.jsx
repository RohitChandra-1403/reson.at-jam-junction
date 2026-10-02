import React from 'react';
import { Mic2, Guitar, CircleDashed, Users, Volume2, Radio, Sparkles, Disc } from 'lucide-react';

export default function JamJunctionEvent() {
  const pedals = [
    { 
      number: "01",
      icon: <CircleDashed className="w-6 h-6 text-amber-400" />, 
      title: "The Icebreaker Warmup", 
      genre: "Tuning & Chorus",
      desc: "Start the night with easy acoustic singalongs to tune voices together and melt away stage fright.",
      knobs: ["KEY: C", "TEMPO: 80"],
      led: "bg-amber-400 shadow-[0_0_12px_#f59e0b]",
      accent: "border-amber-500/30 group-hover:border-amber-400"
    },
    { 
      number: "02",
      icon: <Guitar className="w-6 h-6 text-violet-400" />, 
      title: "Indie Acoustic Circle", 
      genre: "Unplugged Originals",
      desc: "Pass the spotlight across the circle. Share original songs, indie favorites, or soulful fingerstyle chords.",
      knobs: ["ACOUSTIC: 100%", "RAW VIBE"],
      led: "bg-violet-400 shadow-[0_0_12px_#8b5cf6]",
      accent: "border-violet-500/30 group-hover:border-violet-400"
    },
    { 
      number: "03",
      icon: <Mic2 className="w-6 h-6 text-pink-400" />, 
      title: "Genre Crossroads", 
      genre: "Mashup & Improvisation",
      desc: "Where Bollywood meets indie rock, and jazz chords meet folk rhythms. Spontaneous jams with zero rehearsals.",
      knobs: ["GAIN: 10", "ECHO: ON"],
      led: "bg-pink-400 shadow-[0_0_12px_#ec4899]",
      accent: "border-pink-500/30 group-hover:border-pink-400"
    },
    { 
      number: "04",
      icon: <Users className="w-6 h-6 text-emerald-400" />, 
      title: "Grand Room Singalong", 
      genre: "Full Ensemble Harmony",
      desc: "The epic finale where 50+ voices and instruments harmonize together. No solos, just pure shared resonance.",
      knobs: ["CHORUS: MAX", "SOUL: ∞"],
      led: "bg-emerald-400 shadow-[0_0_12px_#10b981]",
      accent: "border-emerald-500/30 group-hover:border-emerald-400"
    }
  ];

  return (
    <section id="jam-junction" className="py-14 sm:py-24 bg-dusk-900 border-y border-white/5 relative overflow-hidden select-none">
      
      {/* Background soundwave grid texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Format & Flow</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            How The Jam <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-violet-400">Flows</span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-400 mt-2 sm:mt-3 font-medium">
            Four organic phases of an unforgettable acoustic night. No stage barriers, no judgment.
          </p>
        </div>

        {/* 4 Boutique Stompbox / Pedal-Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pedals.map((pedal, idx) => (
            <div 
              key={idx} 
              className={`group relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-white/[0.07] to-white/[0.02] border ${pedal.accent} transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] flex flex-col justify-between backdrop-blur-xl`}
            >
              {/* Top Stompbox Faceplate */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  {/* Glowing LED Pilot Lamp */}
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${pedal.led}`} />
                    <span className="font-mono text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      PHASE {pedal.number}
                    </span>
                  </div>

                  {/* 1/4" Jack Nut Accent */}
                  <div className="w-6 h-6 rounded-full border-2 border-white/20 bg-dusk-900 flex items-center justify-center shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  </div>
                </div>

                {/* Stomp Icon & Title */}
                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {pedal.icon}
                </div>

                <div className="text-[11px] font-mono font-bold tracking-wider text-amber-400 uppercase mb-1">
                  {pedal.genre}
                </div>
                <h3 className="text-xl font-black text-white mb-2 leading-tight">
                  {pedal.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed font-normal">
                  {pedal.desc}
                </p>
              </div>

              {/* Bottom Control Knobs Aesthetic */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                {pedal.knobs.map((knob, kIdx) => (
                  <span 
                    key={kIdx} 
                    className="font-mono text-[10px] font-semibold text-gray-400 px-2 py-1 rounded bg-black/40 border border-white/5"
                  >
                    {knob}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* All Instruments Welcome Stage-Rider Banner */}
        <div className="mt-10 sm:mt-16 p-5 sm:p-10 rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-violet-950/60 via-black/80 to-amber-950/40 border border-violet-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 backdrop-blur-xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 text-left">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0">
              🎸
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                STAGE RIDER & GEAR POLICY
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Bring Your Instrument (Or Just Your Voice)
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl leading-relaxed">
                Acoustic Guitars, Ukuleles, Keyboards, Cajons, Flutes, Violins, or just clapping along. 
                We have backup acoustic instruments ready in the lounge for you!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
            <div className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-white/5 border border-white/15 text-[11px] sm:text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>All Skill Levels</span>
            </div>
            <div className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-white/5 border border-white/15 text-[11px] sm:text-xs font-bold text-white flex items-center gap-2">
              <span>Zero Auditions</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
