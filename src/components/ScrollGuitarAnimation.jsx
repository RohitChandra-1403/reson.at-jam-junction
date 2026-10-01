import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, ArrowDown, ArrowUp } from 'lucide-react';

export default function ScrollGuitarAnimation() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notes, setNotes] = useState([]);
  const [isStrumming, setIsStrumming] = useState(false);
  
  const railRef = useRef(null);
  const guitarSliderRef = useRef(null);
  const progressBeamRef = useRef(null);
  const percentTextRef = useRef(null);

  const lastScrollY = useRef(0);
  const lastNoteTime = useRef(0);
  const noteCounter = useRef(0);
  const audioCtxRef = useRef(null);
  const rafId = useRef(null);
  const currentProgressRef = useRef(0);

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

        osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + 1.2);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.035);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.035 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 1.3);
      });
    } catch {
      // Audio autoplay policy
    }
  }, [soundEnabled]);

  // High-performance RAF scroll tracker with direct GPU transform (zero layout reflow)
  useEffect(() => {
    let isTicking = false;

    const updateGuitarPosition = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(currentY / docHeight, 0), 1) : 0;
      currentProgressRef.current = progress;

      const diff = currentY - lastScrollY.current;
      const isDown = diff >= 0;
      const speed = Math.min(Math.abs(diff), 30);
      const tilt = isDown ? -8 - (speed * 0.3) : 6 + (speed * 0.3);

      // Direct GPU transform on guitar slider (no layout reflow or state re-renders!)
      if (guitarSliderRef.current && railRef.current) {
        const railHeight = railRef.current.clientHeight - 80;
        const translateY = progress * railHeight + 12;
        guitarSliderRef.current.style.transform = `translate3d(-50%, ${translateY}px, 0) rotate(${tilt}deg)`;
      }

      // Direct update to progress bar height
      if (progressBeamRef.current) {
        progressBeamRef.current.style.height = `${progress * 100}%`;
      }

      // Direct update to percentage text
      if (percentTextRef.current) {
        percentTextRef.current.innerText = `${Math.round(progress * 100)}% Jammed`;
      }

      // Throttled musical note generation (max once every 350ms while scrolling)
      const now = performance.now();
      if (Math.abs(diff) > 25 && now - lastNoteTime.current > 350) {
        lastNoteTime.current = now;
        const symbols = ['♪', '♫', '♬', '🎸', '✨'];
        const colors = ['#8B5CF6', '#F59E0B', '#EC4899', '#38BDF8'];
        const newNote = {
          id: noteCounter.current++,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          x: (Math.random() - 0.5) * 50,
          y: Math.random() * 15,
        };

        setNotes((prev) => [...prev.slice(-3), newNote]);
        setTimeout(() => {
          setNotes((prev) => prev.filter((n) => n.id !== newNote.id));
        }, 1100);
      }

      lastScrollY.current = currentY;
      isTicking = false;
    };

    const handleScroll = () => {
      if (!isTicking) {
        isTicking = true;
        rafId.current = requestAnimationFrame(updateGuitarPosition);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set position
    updateGuitarPosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleManualStrum = () => {
    setIsStrumming(true);
    const fret = Math.floor(currentProgressRef.current * 12);
    playGuitarStrum(fret);
    setTimeout(() => setIsStrumming(false), 500);
  };

  const scrollTo = (direction) => {
    if (direction === 'bottom') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside 
      className="fixed right-3 md:right-8 top-20 bottom-16 z-40 flex items-center pointer-events-none select-none will-change-transform"
      aria-label="Guitar Scroll Indicator"
    >
      {/* Vertical Fretboard Rail (Scroll Track) */}
      <div 
        ref={railRef} 
        className="relative h-[78vh] w-12 md:w-16 flex flex-col items-center justify-between"
      >
        
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
            ref={progressBeamRef}
            className="w-full bg-gradient-to-b from-amber-400 to-violet-500 rounded-full shadow-[0_0_12px_#8b5cf6]"
            style={{ height: '0%' }}
          />
        </div>

        {/* Top Headstock Control Button */}
        <button
          onClick={() => scrollTo('top')}
          className="pointer-events-auto group relative -mt-3 p-1.5 rounded-full bg-dusk-900/90 border border-violet-500/40 text-violet-300 hover:text-white hover:border-violet-400 hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"
          title="Scroll to Top"
        >
          <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span className="sr-only">Scroll to top</span>
        </button>

        {/* Sliding Animated Guitar Body with Direct GPU Compositor transform */}
        <div 
          ref={guitarSliderRef}
          className="absolute left-1/2 top-0 pointer-events-auto cursor-pointer group will-change-transform"
          style={{ 
            transform: 'translate3d(-50%, 12px, 0) rotate(-8deg)',
            transition: 'transform 0.05s linear'
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
              }}
            >
              {note.symbol}
            </span>
          ))}

          {/* Strum wave ripples on click */}
          {isStrumming && (
            <div className="absolute -inset-3 rounded-full bg-violet-500/25 blur-md animate-ping pointer-events-none" />
          )}

          {/* SVG Acoustic Guitar Detailed Illustration */}
          <div className="relative filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform">
            <svg 
              width="54" 
              height="78" 
              viewBox="0 0 100 150" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              <defs>
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
              </defs>

              {/* Headstock & Tuning Pegs */}
              <rect x="44" y="2" width="12" height="24" rx="3" fill="#3B1C0B" stroke="#B45309" strokeWidth="1" />
              <circle cx="39" cy="6" r="3" fill="#D4AF37" />
              <circle cx="39" cy="14" r="3" fill="#D4AF37" />
              <circle cx="39" cy="22" r="3" fill="#D4AF37" />
              <circle cx="61" cy="6" r="3" fill="#D4AF37" />
              <circle cx="61" cy="14" r="3" fill="#D4AF37" />
              <circle cx="61" cy="22" r="3" fill="#D4AF37" />

              {/* Guitar Neck & Frets */}
              <rect x="46" y="24" width="8" height="42" fill="url(#neckGrad)" />
              {[30, 36, 42, 48, 54, 60].map((fretY, i) => (
                <line key={i} x1="46" y1={fretY} x2="54" y2={fretY} stroke="#E5E7EB" strokeWidth="0.8" opacity="0.8" />
              ))}

              {/* Guitar Body */}
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

              {/* Pickguard */}
              <path 
                d="M 52 90 C 60 90, 64 96, 62 108 C 60 114, 53 112, 52 110 Z" 
                fill="#18181B" 
                opacity="0.8" 
              />

              {/* Soundhole */}
              <circle cx="50" cy="94" r="12" fill="#0A0604" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="50" cy="94" r="9" fill="#000000" stroke="#7C2D12" strokeWidth="0.8" />
              <circle cx="50" cy="94" r="6" fill="#050302" />

              {/* Bridge */}
              <rect x="40" y="122" width="20" height="6" rx="2" fill="#2E1065" stroke="#8B5CF6" strokeWidth="1" />

              {/* Guitar Strings */}
              <line x1="47" y1="6" x2="43" y2="125" stroke="#E5E7EB" strokeWidth="0.7" />
              <line x1="48.2" y1="6" x2="46" y2="125" stroke="#E5E7EB" strokeWidth="0.7" />
              <line x1="49.4" y1="6" x2="49" y2="125" stroke="#D1D5DB" strokeWidth="0.8" />
              <line x1="50.6" y1="6" x2="52" y2="125" stroke="#D1D5DB" strokeWidth="0.8" />
              <line x1="51.8" y1="6" x2="55" y2="125" stroke="#9CA3AF" strokeWidth="0.9" />
              <line x1="53" y1="6" x2="57" y2="125" stroke="#9CA3AF" strokeWidth="1" />

              <text x="50" y="16" fill="#F59E0B" fontSize="5" fontWeight="bold" textAnchor="middle">@</text>
            </svg>
          </div>

          {/* Floating Tooltip Pill showing scroll progress */}
          <div className="absolute left-[-110px] md:left-[-125px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-dusk-900/90 border border-violet-500/40 text-violet-200 text-xs font-semibold shadow-xl backdrop-blur-md whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span ref={percentTextRef}>0% Jammed</span>
          </div>
        </div>

        {/* Bottom Controls */}
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
            className="group p-1.5 rounded-full bg-dusk-900/90 border border-violet-500/40 text-violet-300 hover:text-white hover:border-violet-400 hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"
            title="Scroll to Bottom"
          >
            <ArrowDown className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-y-0.5 transition-transform" />
            <span className="sr-only">Scroll to bottom</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
