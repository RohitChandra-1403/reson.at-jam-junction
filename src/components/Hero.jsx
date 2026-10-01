import React from 'react';
import { Radio, ChevronRight, Sparkles, Music, Users, MapPin, Play, Ticket, Disc } from 'lucide-react';
import heroCommunityImg from '../assets/hero-reson-jam.jpg';

export default function Hero({ onRSVPClick }) {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-14 pb-20 md:pb-28 select-none">
      {/* Background ambient visualizer glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[750px] h-[750px] bg-violet-600/40 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute w-[550px] h-[550px] bg-amber-500/30 rounded-full blur-[130px] mix-blend-screen animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-amber-400 mb-6 backdrop-blur-md shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase font-mono">
                Next Session: This Weekend • Bangalore
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.08] text-white">
              Where Music <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-amber-300 to-sunset-500">
                Resonates.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed font-normal">
              Step into <strong>Jam Junction</strong> by <strong>reson.at</strong> — Bangalore’s soulful unplugged jam sanctuary. 
              Bring your guitar, cajon, voice, or simply pull up a chair. No stage, no rehearsals, zero pressure.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button 
                onClick={onRSVPClick}
                className="relative group overflow-hidden px-8 py-4 rounded-full font-black text-white text-lg tracking-wide transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-600/50 active:scale-95 animate-ticket-flash bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 flex items-center justify-center gap-2.5"
                style={{ color: '#FFFFFF' }}
              >
                {/* Sweeping Shimmer Beam */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none animate-shimmer-sweep" />

                <Ticket className="w-5 h-5 text-white" />
                <span>Book Tickets</span>
                <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a 
                href="#jam-pad"
                className="px-7 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-violet-400/40 rounded-full font-semibold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-white/5 active:scale-95"
              >
                <Music className="w-5 h-5 text-amber-400" />
                <span>Try Jam Lounge</span>
              </a>
            </div>

            {/* Quick Community Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">50+</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">Jammers / Circle</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">Unplugged Soul</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-violet-400">0%</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">Stage Fright</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Photo Showcase with Spinning Vinyl Peaking Out */}
          <div className="lg:col-span-6 relative">
            
            {/* Spinning Vinyl Record Disc Peaking from behind the photo */}
            <div className="hidden sm:block absolute -top-8 -right-8 w-44 h-44 rounded-full bg-zinc-950 border-[5px] border-zinc-900 shadow-2xl z-0 animate-spin-slow opacity-90 pointer-events-none">
              {/* Vinyl Grooves rings */}
              <div className="absolute inset-2.5 rounded-full border border-white/10" />
              <div className="absolute inset-5 rounded-full border border-white/10" />
              <div className="absolute inset-8 rounded-full border border-white/10" />
              <div className="absolute inset-11 rounded-full border border-white/10" />
              {/* Vinyl Center Label */}
              <div className="absolute inset-14 rounded-full bg-gradient-to-tr from-amber-500 to-sunset-500 flex flex-col items-center justify-center text-[7px] font-mono font-bold text-white shadow-inner">
                <span>RESON@</span>
                <span className="text-[6px] opacity-75">33 RPM</span>
              </div>
            </div>

            {/* Ambient Aura Frame */}
            <div className="relative group z-10">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 via-amber-500 to-sunset-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-700"></div>

              {/* Main Photo Card */}
              <div className="relative rounded-2xl overflow-hidden bg-dusk-900 border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
                
                {/* Community Photo */}
                <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden">
                  <img 
                    src={heroCommunityImg} 
                    alt="Reson@ Jam Junction Community in the Lounge" 
                    className="w-full h-full object-cover object-center filter saturate-[1.08] contrast-[1.05] transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle Dark Vignette & Gradient for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 pointer-events-none" />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      Reson@ Jam Floor
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-900/80 backdrop-blur-md border border-violet-400/30 text-xs font-semibold text-violet-200">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      50+ Jammers Strong
                    </span>
                  </div>

                  {/* Bottom Overlay with Real Quote & Equalizer */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="inline-block text-amber-400 font-mono font-semibold text-xs tracking-wider uppercase mb-1">
                        Community Spotlight
                      </span>
                      <p className="text-white text-sm sm:text-base font-bold leading-tight drop-shadow-md">
                        "One room, endless chords, genuine connection."
                      </p>
                    </div>

                    {/* Animated Equalizer Bars */}
                    <div className="flex items-end gap-1 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15" title="Sounding live">
                      <div className="w-1 bg-amber-400 rounded-full animate-equalizer-1"></div>
                      <div className="w-1 bg-violet-400 rounded-full animate-equalizer-2"></div>
                      <div className="w-1 bg-sunset-500 rounded-full animate-equalizer-3"></div>
                      <div className="w-1 bg-amber-300 rounded-full animate-equalizer-4"></div>
                    </div>
                  </div>

                </div>

                {/* Photo Caption Strip */}
                <div className="px-5 py-3.5 bg-black/85 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs sm:text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Real memories from the <strong>Jam Junction Lounge</strong></span>
                  </div>
                  <a 
                    href="#gallery" 
                    className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 hover:underline ml-2 whitespace-nowrap"
                  >
                    View Diary <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>

            {/* Floating Decorative Instrument Card */}
            <div className="hidden md:flex absolute -bottom-6 -left-6 bg-dusk-900/95 border border-white/20 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl items-center gap-3 animate-bounce z-20" style={{ animationDuration: '4s' }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-sunset-500 flex items-center justify-center text-xl shadow-md">
                🎸
              </div>
              <div>
                <p className="text-xs font-bold text-white">All Instruments Welcomed</p>
                <p className="text-[11px] text-gray-400 font-medium">Guitars, Ukes, Percussion & Vocals</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
