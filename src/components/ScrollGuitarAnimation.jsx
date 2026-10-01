import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, ArrowDown, ArrowUp, Sparkles } from 'lucide-react';

export default function ScrollGuitarAnimation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notes, setNotes] = useState([]);
  const [activeFret, setActiveFret] = useState(0);
  const [isStrumming, setIsStrumming] = useState(false);
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);
  const noteCounter = useRef(0);
  const audioCtxRef = useRef(null);

  // Play an acoustic guitar pluck/chord synthesized via Web Audio API
  const playGuitarStrum = useCallback((fretIndex = 0) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (!audioCtxRef.current) return;
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const now = audioCtxRef.current.currentTime;
      // Acoustic guitar chords (Em7 -> G -> Cadd9 -> D -> Em)
      const chordPitches = [
        [82.4, 123.4, 164.8, 196.0, 246.9, 329.6], // E standard
        [98.0, 123.4, 146.8, 196.0, 293.7, 392.0], // G maj
        [130.8, 164.8, 196.0, 261.6, 329.6],       // C add9
        [146.8, 220.0, 293.7, 369.9],              // D maj
        [110.0, 164.8, 220.0, 261.6, 329.6],       // A min7
      ];

      const chord = chordPitches[fretIndex % chordPitches.length];

      chord.forEach((freq, idx) => {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        const filter = audioCtxRef.current.createBiquadFilter();

        // Warm acoustic string harmonic
        osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + 1.2);

        // Pluck envelope
        gain.gain.setValueAtTime(0.0001, now + idx * 0.035);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.035 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 1.3);
      });
    } catch {
      // Audio autoplay or permissions prevented
    }
  }, [soundEnabled]);

  // Handle scroll events with progress, direction, note particles & strumming
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(currentY / docHeight, 0), 1) : 0;
      
      const dir = currentY > lastScrollY.current ? 'down' : 'up';
      setScrollDirection(dir);
      setScrollProgress(progress);
      setIsScrolling(true);

      const fret = Math.floor(progress * 12);
      setActiveFret(fret);

      // Spawn floating musical notes along the path
      if (Math.abs(currentY - lastScrollY.current) > 30) {
        const symbols = ['♪', '♫', '♬', '♩', '🎸', '✨', '🎶'];
        const colors = ['#8B5CF6', '#F59E0B', '#EC4899', '#38BDF8', '#10B981'];
        const newNote = {
          id: noteCounter.current++,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          x: (Math.random() - 0.5) * 60,
          y: Math.random() * 20,
          rotate: (Math.random() - 0.5) * 45,
        };

        setNotes((prev) => [...prev.slice(-8), newNote]);

        // Auto remove note after animation
        setTimeout(() => {
          setNotes((prev) => prev.filter((n) => n.id !== newNote.id));
        }, 1200);
      }

      lastScrollY.current = currentY;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleManualStrum = () => {
    setIsStrumming(true);
    playGuitarStrum(activeFret);
    setTimeout(() => setIsStrumming(false), 600);
  };

  const scrollTo = (direction) => {
    if (direction === 'bottom') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Rotation and sway based on scroll direction & speed
  const tiltAngle = isScrolling 
    ? (scrollDirection === 'down' ? -18 : 12) 
    : (isStrumming ? 8 : -8);

  const percent = Math.round(scrollProgress * 100);

  return (
    <div 
      className="fixed right-3 md:right-8 top-20 bottom-16 z-40 flex items-center pointer-events-none select-none"
      aria-label="Guitar Scroll Indicator"
    >
      {/* Vertical Fretboard Rail (Scroll Track) */}
      <div className="relative h-[78vh] w-12 md:w-16 flex flex-col items-center justify-between">
        
        {/* Fretboard background beam with string lines */}
        <div className="absolute inset-y-0 w-2 md:w-2.5 bg-gradient-to-b from-amber-500/20 via-violet-600/30 to-amber-500/20 rounded-full backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
          {/* Fret marker ticks */}
          {[0, 15, 30, 45, 60, 75, 90, 100].map((fret) => (
            <div 
              key={fret} 
              className="absolute left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white/20"
              style={{ top: `${fret}%` }}
            >
              {fret === 60 && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute -top-[2px] left-1/2 -translate-x-1/2 shadow-[0_0_6px_#f59e0b]"></div>
              )}
            </div>
          ))}

          {/* Active progress glow beam */}
          <div 
            className="w-full bg-gradient-to-b from-amber-400 to-violet-500 rounded-full transition-all duration-150 shadow-[0_0_12px_#8b5cf6]"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Top Headstock Control Button */}
        <button
          onClick={() => scrollTo('top')}
          className="pointer-events-auto group relative -mt-3 p-1.5 rounded-full bg-dusk-900/90 border border-violet-500/40 text-violet-300 hover:text-white hover:border-violet-400 hover:scale-110 transition-all shadow-lg backdrop-blur-sm"
          title="Scroll to Top"
        >
          <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span className="sr-only">Scroll to top</span>
        </button>

        {/* Sliding Animated Guitar Body that moves as you scroll to the bottom */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 pointer-events-auto cursor-pointer transition-[top] ease-out duration-100 group"
          style={{ 
            top: `calc(${scrollProgress * 86}% + 12px)`,
            transform: `translate(-50%, -50%) rotate(${tiltAngle}deg)`,
            transition: isScrolling ? 'transform 0.2s ease, top 0.08s ease-out' : 'transform 0.4s ease, top 0.2s ease-out'
          }}
          onClick={handleManualStrum}
          title="Click to Strum Acoustic Chord!"
        >
          {/* Floating musical notes emitted on scroll */}
          {notes.map((note) => (
            <span
              key={note.id}
              className="absolute pointer-events-none text-base md:text-xl font-bold animate-float-note drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{
                color: note.color,
                left: `${note.x}px`,
                bottom: `${20 + note.y}px`,
                transform: `rotate(${note.rotate}deg)`,
              }}
            >
              {note.symbol}
            </span>
          ))}

          {/* Strum wave ripples */}
          {(isScrolling || isStrumming) && (
            <div className="absolute -inset-3 rounded-full bg-violet-500/20 blur-md animate-ping pointer-events-none" />
          )}

          {/* SVG Acoustic Guitar Detailed Illustration */}
          <div className="relative filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform">
            <svg 
              width="58" 
              height="84" 
              viewBox="0 0 100 150" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              <defs>
                {/* Acoustic Wood / Sunburst Gradients */}
                <radialGradient id="bodySunburst" cx="50%" cy="65%" r="65%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="45%" stopColor="#D97706" />
                  <stop offset="80%" stopColor="#7C2D12" />
                  <stop offset="100%" stopColor="#1E100A" />
                </radialGradient>
                <linearGradient id="neckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#451A03" />
                  <stop offset="50%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
                <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>

              {/* Headstock & Tuning Pegs */}
              <rect x="44" y="2" width="12" height="24" rx="3" fill="#3B1C0B" stroke="#B45309" strokeWidth="1" />
              {/* Pegs Left */}
              <circle cx="39" cy="6" r="3" fill="#D4AF37" />
              <circle cx="39" cy="14" r="3" fill="#D4AF37" />
              <circle cx="39" cy="22" r="3" fill="#D4AF37" />
              {/* Pegs Right */}
              <circle cx="61" cy="6" r="3" fill="#D4AF37" />
              <circle cx="61" cy="14" r="3" fill="#D4AF37" />
              <circle cx="61" cy="22" r="3" fill="#D4AF37" />

              {/* Guitar Neck & Frets */}
              <rect x="46" y="24" width="8" height="42" fill="url(#neckGrad)" />
              {/* Silver Frets */}
              {[30, 36, 42, 48, 54, 60].map((fretY, i) => (
                <line key={i} x1="46" y1={fretY} x2="54" y2={fretY} stroke="#E5E7EB" strokeWidth="0.8" opacity="0.8" />
              ))}

              {/* Guitar Body (Classic Acoustic Curvature) */}
              <path 
                d="M 50 62 
                   C 66 62, 78 72, 76 88 
                   C 74 100, 68 103, 73 112 
                   C 80 123, 78 142, 50 142 
                   C 22 142, 20 123, 27 112 
                   C 32 103, 26 100, 24 88 
                   C 22 72, 34 62, 50 62 Z" 
                fill="url(#bodySunburst)" 
                stroke="#FBBF24" 
                strokeWidth="1.5" 
              />

              {/* Pickguard (Teardrop shape) */}
              <path 
                d="M 52 90 C 60 90, 64 96, 62 108 C 60 114, 53 112, 52 110 Z" 
                fill="#18181B" 
                opacity="0.8" 
              />

              {/* Soundhole with Rosette Rings */}
              <circle cx="50" cy="94" r="12" fill="#0A0604" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="50" cy="94" r="9" fill="#000000" stroke="#7C2D12" strokeWidth="0.8" />
              <circle cx="50" cy="94" r="6" fill="#050302" />

              {/* Bridge */}
              <rect x="40" y="122" width="20" height="6" rx="2" fill="#2E1065" stroke="#8B5CF6" strokeWidth="1" />
              <circle cx="43" cy="125" r="1" fill="#FFFFFF" />
              <circle cx="46" cy="125" r="1" fill="#FFFFFF" />
              <circle cx="49" cy="125" r="1" fill="#FFFFFF" />
              <circle cx="52" cy="125" r="1" fill="#FFFFFF" />
              <circle cx="55" cy="125" r="1" fill="#FFFFFF" />
              <circle cx="57" cy="125" r="1" fill="#FFFFFF" />

              {/* Guitar Strings (6 vibrating lines) */}
              <line 
                x1="47" y1="6" x2="43" y2="125" 
                stroke={isScrolling ? '#FDE047' : '#E5E7EB'} 
                strokeWidth="0.7" 
                className={isScrolling ? 'animate-pulse' : ''} 
              />
              <line 
                x1="48.2" y1="6" x2="46" y2="125" 
                stroke={isScrolling ? '#FDE047' : '#E5E7EB'} 
                strokeWidth="0.7" 
              />
              <line 
                x1="49.4" y1="6" x2="49" y2="125" 
                stroke={isScrolling ? '#38BDF8' : '#D1D5DB'} 
                strokeWidth="0.8" 
              />
              <line 
                x1="50.6" y1="6" x2="52" y2="125" 
                stroke={isScrolling ? '#38BDF8' : '#D1D5DB'} 
                strokeWidth="0.8" 
              />
              <line 
                x1="51.8" y1="6" x2="55" y2="125" 
                stroke={isScrolling ? '#EC4899' : '#9CA3AF'} 
                strokeWidth="0.9" 
              />
              <line 
                x1="53" y1="6" x2="57" y2="125" 
                stroke={isScrolling ? '#EC4899' : '#9CA3AF'} 
                strokeWidth="1" 
              />

              {/* Reson@ Emblem on Headstock */}
              <text x="50" y="16" fill="#F59E0B" fontSize="5" fontWeight="bold" textAnchor="middle">@</text>
            </svg>
          </div>

          {/* Floating Tooltip Pill showing scroll progress */}
          <div className="absolute left-[-110px] md:left-[-125px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-dusk-900/90 border border-violet-500/40 text-violet-200 text-xs font-semibold shadow-xl backdrop-blur-md whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>{percent}% Jammed</span>
          </div>
        </div>

        {/* Bottom Scroll-To-End / Sound Control Button */}
        <div className="pointer-events-auto -mb-3 flex flex-col items-center gap-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-full border transition-all shadow-lg backdrop-blur-sm ${
              soundEnabled 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30' 
                : 'bg-dusk-900/90 border-white/20 text-gray-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Strum Sound: ON (Click to mute)' : 'Strum Sound: MUTED (Click to enable)'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4" />
            )}
            <span className="sr-only">Toggle guitar strum sound</span>
          </button>

          <button
            onClick={() => scrollTo('bottom')}
            className="group p-1.5 rounded-full bg-dusk-900/90 border border-violet-500/40 text-violet-300 hover:text-white hover:border-violet-400 hover:scale-110 transition-all shadow-lg backdrop-blur-sm"
            title="Scroll to Bottom"
          >
            <ArrowDown className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-y-0.5 transition-transform" />
            <span className="sr-only">Scroll to bottom</span>
          </button>
        </div>

      </div>
    </div>
  );
}
