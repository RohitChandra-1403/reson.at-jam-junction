import React from 'react';
import { Radio, ChevronRight } from 'lucide-react';

export default function Hero({ onRSVPClick }) {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      {/* Background visualizer effect (mocked with CSS) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[800px] h-[800px] bg-violet-600 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-amber-500 rounded-full blur-[100px] mix-blend-screen animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-500 mb-8 backdrop-blur-sm">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">Next Session: This Weekend</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            Where Music <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sunset-500">
              Resonates
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join <strong>Jam Junction</strong> — a collaborative, soulful community jamming event uniting singers, instrumentalists, and music enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onRSVPClick}
              className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-600/30 flex items-center justify-center gap-2"
            >
              Join The Circle <ChevronRight className="w-5 h-5" />
            </button>
            <a 
              href="#jam-pad"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              Listen To The Vibe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
