import React from 'react';
import { Radio, ChevronRight, Sparkles, Music, Users, MapPin, Play, Ticket, Disc } from 'lucide-react';
import heroCommunityImg from '@/assets/images/hero-reson-jam.jpg';
import { RollingText } from '@/components/v1/skiper27';

export default function Hero({ onRSVPClick }) {
  return (
    <section className="relative min-h-[90vh] sm:min-h-[94vh] flex flex-col justify-between overflow-hidden select-none">
      
      {/* 1. Full-Bleed Main Community Photo Canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={heroCommunityImg} 
          alt="Reson@ Jam Junction Community in the Lounge" 
          className="w-full h-full object-cover object-[center_30%] filter brightness-[0.96] contrast-[1.05] saturate-[1.08] scale-[1.01] transition-transform duration-700"
        />
        
        {/* Crisp, Targeted Scrims - Kept away from faces to keep photo bright and clear */}
        {/* Top-down navbar contrast scrim */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none" />

        {/* Bottom transition into next section */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-dusk-900 via-dusk-900/70 to-transparent pointer-events-none" />

        {/* Subtle radial concert glow accents */}
        <div className="absolute -top-16 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* 2. Top Banner Row: Live Status Beacon & Community Pill */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 flex flex-wrap items-center justify-between gap-3">
        {/* Live Jam Weekend Status Beacon */}
        <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/70 border border-emerald-500/50 text-emerald-300 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase">
            NEXT SESSION: THIS WEEKEND • BANGALORE
          </span>
        </div>

        {/* Community Proof Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 text-xs font-semibold text-gray-200 backdrop-blur-xl shadow-lg">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Real Community Lounge • 50+ Jammers</span>
        </div>
      </div>

      {/* 3. Hero Main Narrative Center Block (Overlaid with Frosted Glass for Total Legibility) */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-auto py-6 sm:py-10">
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-black/65 border border-white/20 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          
          {/* Skiper UI (Skiper27) Animated Rolling Text Banner */}
          <div className="inline-flex items-center gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white/10 border border-violet-400/40 backdrop-blur-md shadow-md mb-3 sm:mb-4 group hover:border-amber-400/60 transition-all">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-pink-500 to-violet-600 p-0.5 shrink-0 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 shrink-0">
                MOTTO:
              </span>
              <RollingText 
                text="Connect , Create and Resonate "
                speed={0.04}
                duration={0.6}
                loop={true}
                loopInterval={4000}
                className="text-xs sm:text-sm font-bold font-display tracking-tight text-amber-200"
              />
            </div>
          </div>

          {/* Refined Headline with Requested Phrasing & Balanced Size */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] mb-3 sm:mb-4">
            Where{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400">
              Creativity
            </span>{' '}
            <br className="hidden sm:inline" />
            Resonates.
          </h1>

          {/* Soulful Narrative Paragraph */}
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal drop-shadow-sm mb-6 max-w-xl">
            Step into <strong>Jam Junction</strong> by <strong>reson.at</strong> — Bangalore’s soulful unplugged jam sanctuary. 
            Bring your guitar, cajon, voice, or simply pull up a chair. No stage, no rehearsals, zero pressure.
          </p>

          {/* Premium Action Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            
            {/* Primary Action Button: Book Tickets */}
            <button 
              onClick={onRSVPClick}
              className="relative group overflow-hidden px-6 py-3.5 rounded-full font-bold text-white text-sm sm:text-base tracking-wide transition-all transform hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(139,92,246,0.5)] bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 flex items-center justify-center gap-2.5 border border-white/30"
              style={{ color: '#FFFFFF' }}
            >
              {/* Sweeping Shimmer Beam */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none animate-shimmer-sweep" />

              <Ticket className="w-4 h-4 text-white fill-white/20" />
              <span>Book Tickets Now</span>
              <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Action: Virtual Jam Pad */}
            <a 
              href="#jam-pad"
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-violet-400/60 font-semibold text-sm sm:text-base transition-all backdrop-blur-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-600/20 active:scale-95"
            >
              <Music className="w-4 h-4 text-amber-400" />
              <span>Try Jam Lounge</span>
            </a>

            {/* Tertiary Action: Visual Diary */}
            <a 
              href="#gallery"
              className="px-4 py-3.5 rounded-full bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white border border-white/15 hover:border-white/30 font-semibold text-xs sm:text-sm transition-all backdrop-blur-xl flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Visual Diary</span>
              <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
            </a>

          </div>

        </div>
      </div>

      {/* 4. Bottom Floating Stats & Live Equalizer Dock */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="p-4 sm:p-5 rounded-3xl bg-black/75 border border-white/15 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Community Highlights Metric Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 divide-x divide-white/10 text-center sm:text-left w-full md:w-auto">
            <div className="pr-2 sm:pr-4">
              <div className="text-2xl sm:text-3xl font-black text-white">50+</div>
              <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">Jammers / Circle</div>
            </div>
            <div className="px-3 sm:px-6">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
              <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">Unplugged Soul</div>
            </div>
            <div className="pl-3 sm:pl-6">
              <div className="text-2xl sm:text-3xl font-black text-violet-400">0%</div>
              <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">Stage Fright</div>
            </div>
          </div>

          {/* Live Soundwave Indicator & Policy */}
          <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
                COMMUNITY SANCTUARY
              </span>
              <p className="text-xs sm:text-sm font-semibold text-gray-200">
                🎸 All Instruments & Voices Welcomed
              </p>
            </div>

            {/* Animated Equalizer Bars */}
            <div className="flex items-end gap-1 bg-white/5 px-3 py-2 rounded-xl border border-white/10 shrink-0" title="Sounding live in Bangalore">
              <div className="w-1 bg-amber-400 rounded-full animate-equalizer-1"></div>
              <div className="w-1 bg-violet-400 rounded-full animate-equalizer-2"></div>
              <div className="w-1 bg-sunset-500 rounded-full animate-equalizer-3"></div>
              <div className="w-1 bg-amber-300 rounded-full animate-equalizer-4"></div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
