import React, { useState, useRef } from 'react';
import { Music2, Mail, ArrowUpRight, ArrowUp, Heart, Sparkles, Send, Check } from 'lucide-react';

const LETTERS = [
  { char: 'R', color: 'hover:text-[#8B5CF6]', glow: 'hover:drop-shadow-[0_0_35px_#8b5cf6]', note: 130.81 },
  { char: 'E', color: 'hover:text-[#EC4899]', glow: 'hover:drop-shadow-[0_0_35px_#ec4899]', note: 164.81 },
  { char: 'S', color: 'hover:text-[#F59E0B]', glow: 'hover:drop-shadow-[0_0_35px_#f59e0b]', note: 196.00 },
  { char: 'O', color: 'hover:text-[#FF5722]', glow: 'hover:drop-shadow-[0_0_35px_#ff5722]', note: 246.94 },
  { char: 'N', color: 'hover:text-[#38BDF8]', glow: 'hover:drop-shadow-[0_0_35px_#38bdf8]', note: 293.66 },
  { char: '.', color: 'hover:text-[#10B981]', glow: 'hover:drop-shadow-[0_0_35px_#10b981]', note: 329.63 },
  { char: 'A', color: 'hover:text-[#A855F7]', glow: 'hover:drop-shadow-[0_0_35px_#a855f7]', note: 392.00 },
  { char: 'T', color: 'hover:text-[#FBBF24]', glow: 'hover:drop-shadow-[0_0_35px_#fbbf24]', note: 440.00 },
];

export default function Footer() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const audioCtxRef = useRef(null);

  // Play a soft acoustic harmonic note on letter hover
  const playHoverNote = (freq) => {
    try {
      if (!audioCtxRef.current) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtxRef.current = new AudioClass();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (!audioCtxRef.current) return;

      const now = audioCtxRef.current.currentTime;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // Audio autoplay policy
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black pt-20 pb-12 border-t border-white/10 relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[700px] h-[350px] bg-violet-600/30 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Brand & Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 text-left">
            <div className="flex items-center gap-2.5 mb-5 group cursor-pointer" onClick={scrollToTop}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-violet-600/30">
                <Music2 className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-black text-2xl tracking-tighter text-white">
                reson.at
              </span>
            </div>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6 font-normal">
              Bangalore’s zero-pressure unplugged jamming sanctuary. Uniting singers, acoustic guitarists, cajon players, and music enthusiasts under one intimate roof.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NEXT JAM FLOOR: THIS WEEKEND</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-3 text-left">
            <h4 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Explore The Circle
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#jam-junction" className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>How The Jam Flows</span>
                </a>
              </li>
              <li>
                <a href="#jam-pad" className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>Virtual Jam Lounge</span>
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>Visual Diary Gallery</span>
                </a>
              </li>
              <li>
                <a href="#team-members" className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>Core Crew</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>Backstage FAQ</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter Box */}
          <div className="md:col-span-4 text-left">
            <h4 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Stay In Tune
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed font-normal">
              Receive secret venue locations & dates for the next Jam Junction session.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/15 rounded-full px-4 py-3 pr-28 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 transition-all"
              />
              <button 
                type="submit" 
                className={`absolute right-1 top-1 bottom-1 px-4 rounded-full text-xs font-bold text-white transition-all flex items-center gap-1.5 ${
                  subscribed 
                    ? 'bg-emerald-600' 
                    : 'bg-violet-600 hover:bg-violet-500 active:scale-95 shadow-md shadow-violet-600/30'
                }`}
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tuned In!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <a 
                href="https://www.instagram.com/reson.at" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <span>Follow @reson.at on Instagram</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
        
        {/* Massive Interactive Typographic Display: RESON.AT */}
        <div className="pt-14 pb-8 text-center overflow-visible w-full">
          <div className="flex items-center justify-center flex-nowrap gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 tracking-tighter max-w-5xl mx-auto px-4">
            {LETTERS.map((item, index) => {
              const isHovered = hoveredIndex === index;

              return (
                <span
                  key={index}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    playHoverNote(item.note);
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`cursor-pointer inline-block font-black font-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[6.2rem] leading-none transition-all duration-300 transform select-none ${
                    isHovered
                      ? `scale-115 -translate-y-3 ${item.color} ${item.glow} z-20`
                      : 'text-white/[0.08] hover:text-white/20'
                  }`}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  title={`Hover for harmonic chime: ${item.char}`}
                >
                  {item.char}
                </span>
              );
            })}
          </div>
          
          <p className="text-[11px] font-mono tracking-widest text-gray-500 uppercase mt-4">
            Move cursor over each letter to hear notes & light up the stage
          </p>
        </div>

        {/* Bottom Legal & Back to Top Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} reson.at. Made with soul for the music community.</p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Vibe</a>
            
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[11px]">Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
