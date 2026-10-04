import React from 'react';
import { ChevronRight, Sparkles, Music, Ticket } from 'lucide-react';
import heroCommunityImg from '@/assets/images/hero-reson-jam.jpg';
import { RollingText } from '@/components/v1/skiper27';
import { ParticleText } from '@/components/v1/ParticleText';

export default function Hero({ onRSVPClick }) {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-between overflow-hidden select-none">
      
      {/* 1. Main Community Photo Canvas with Dedicated Contrast Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={heroCommunityImg} 
          alt="Reson@ Jam Junction Community in the Lounge" 
          className="w-full h-full object-cover object-[center_30%] filter brightness-[0.96] contrast-[1.05] saturate-[1.08] scale-[1.01] transition-transform duration-700"
        />
        
        {/* Strong Left-to-Right Dark Gradient: Calms the background behind text for instant legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-dusk-900/95 via-dusk-900/80 md:via-dusk-900/60 to-dusk-900/20 pointer-events-none" />

        {/* Top & Bottom Atmospheric Transitions */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-dusk-900 via-dusk-900/70 to-transparent pointer-events-none" />

        {/* Subtle Ambient Concert Lighting Glow */}
        <div className="absolute -top-16 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* 2. Hero Content: Structured Visual Hierarchy with Generous Breathing Space */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-auto py-12 sm:py-20 lg:py-24">
        {/* Narrower text column to prevent clutter and focus attention */}
        <div className="max-w-xl text-left">
          
          {/* Visual Hierarchy 1: Small Introductory Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md shadow-sm mb-6 group hover:border-amber-400/50 transition-all">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <RollingText 
              text="Connect , Create and Resonate"
              speed={0.04}
              duration={0.6}
              loop={true}
              loopInterval={4000}
              className="text-xs font-bold font-display tracking-tight text-amber-200"
            />
          </div>

          {/* Visual Hierarchy 2: Main Heading (ParticleText Animation) */}
          <div className="flex flex-col items-start gap-1 sm:gap-2 mb-6">
            <ParticleText 
              text="Where"
              particleColor="#fbbf24"
              particleCount={25}
              textClassName="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
            />
            <ParticleText 
              text="Creativity"
              particleColor="#ec4899"
              particleCount={40}
              textClassName="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-violet-300 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
            />
            <ParticleText 
              text="Resonates."
              particleColor="#a78bfa"
              particleCount={30}
              textClassName="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
            />
          </div>

          {/* Visual Hierarchy 3: Short Supporting Description */}
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal mb-8 max-w-lg drop-shadow-sm">
            Bangalore's soulful unplugged jam sanctuary. Bring your guitar, cajon, voice, or simply pull up a chair. Zero pressure, pure acoustics.
          </p>

          {/* Visual Hierarchy 4 & 5: Primary CTA & Secondary CTA */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Primary CTA: Book Tickets */}
            <button 
              onClick={onRSVPClick}
              className="relative group overflow-hidden px-7 py-3.5 rounded-full font-bold text-white text-sm sm:text-base tracking-wide transition-all transform hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(139,92,246,0.5)] bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 flex items-center justify-center gap-2.5 border border-white/30"
              style={{ color: '#FFFFFF' }}
            >
              {/* Sweeping Shimmer Beam */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none animate-shimmer-sweep" />

              <Ticket className="w-4 h-4 text-white fill-white/20" />
              <span>Book Tickets Now</span>
              <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA: Try Jam Lounge */}
            <a 
              href="#jam-pad"
              className="px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/20 hover:border-violet-400/50 font-semibold text-sm sm:text-base transition-all backdrop-blur-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-600/20 active:scale-95"
            >
              <Music className="w-4 h-4 text-amber-400" />
              <span>Try Jam Lounge</span>
            </a>

          </div>

        </div>
      </div>

      {/* 3. Bottom Floating Stats & Live Equalizer Dock - Classy Luxury Glass Dock */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="px-6 py-4 sm:px-8 sm:py-5 rounded-2xl sm:rounded-full bg-gradient-to-r from-black/50 via-black/35 to-black/50 backdrop-blur-2xl border border-white/15 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22),0_15px_45px_rgba(0,0,0,0.6)] hover:border-white/25 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Community Highlights Metric Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 divide-x divide-white/15 text-center sm:text-left w-full md:w-auto items-center">
            <div className="pr-2 sm:pr-4">
              <div className="flex items-baseline justify-center sm:justify-start gap-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">50</span>
                <span className="text-amber-400 font-bold text-lg">+</span>
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-300/80 mt-0.5 font-medium">Jammers / Circle</div>
            </div>
            
            <div className="px-3 sm:px-6">
              <div className="flex items-baseline justify-center sm:justify-start gap-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-300 drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]">100</span>
                <span className="text-amber-400 font-bold text-lg">%</span>
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-300/80 mt-0.5 font-medium">Unplugged Soul</div>
            </div>
            
            <div className="pl-3 sm:pl-6">
              <div className="flex items-baseline justify-center sm:justify-start gap-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-violet-300 drop-shadow-[0_2px_12px_rgba(167,139,250,0.35)]">0</span>
                <span className="text-violet-400 font-bold text-lg">%</span>
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-300/80 mt-0.5 font-medium">Stage Fright</div>
            </div>
          </div>

          {/* Live Soundwave Indicator & Classy Acoustic Tag */}
          <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-white/15 pt-3 md:pt-0 md:pl-8 w-full md:w-auto justify-between md:justify-end">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300 font-semibold drop-shadow-sm">
                  ACOUSTIC SANCTUARY
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-zinc-200 mt-0.5 drop-shadow-sm">
                🎸 All Instruments & Voices Welcomed
              </p>
            </div>

            {/* Minimalist Studio Equalizer Bar Capsule */}
            <div className="flex items-end gap-1.5 bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/10 shrink-0 backdrop-blur-md shadow-inner" title="Live Sounding Bangalore">
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
