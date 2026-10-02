import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Square, Volume2, Sparkles, Music2, 
  RotateCcw, Sliders, Radio, Disc, Mic2, Heart
} from 'lucide-react';

const CHORDS = [
  { 
    name: 'Cmaj7', 
    label: 'Warm & Dreamy', 
    key: '1', 
    color: 'from-amber-500/20 to-orange-600/30',
    border: 'hover:border-amber-400 group-hover:shadow-amber-500/30',
    accent: '#F59E0B',
    freqs: [130.81, 196.00, 246.94, 329.63, 392.00, 493.88] 
  },
  { 
    name: 'Gadd9', 
    label: 'Bright Acoustic', 
    key: '2', 
    color: 'from-emerald-500/20 to-teal-600/30',
    border: 'hover:border-emerald-400 group-hover:shadow-emerald-500/30',
    accent: '#10B981',
    freqs: [98.00, 146.83, 196.00, 293.66, 392.00, 440.00] 
  },
  { 
    name: 'Am9', 
    label: 'Soulful & Deep', 
    key: '3', 
    color: 'from-violet-500/20 to-purple-600/30',
    border: 'hover:border-violet-400 group-hover:shadow-violet-500/30',
    accent: '#8B5CF6',
    freqs: [110.00, 164.81, 220.00, 261.63, 329.63, 392.00] 
  },
  { 
    name: 'Fmaj7', 
    label: 'Lush Indie', 
    key: '4', 
    color: 'from-pink-500/20 to-rose-600/30',
    border: 'hover:border-pink-400 group-hover:shadow-pink-500/30',
    accent: '#EC4899',
    freqs: [87.31, 130.81, 174.61, 220.00, 261.63, 329.63] 
  },
  { 
    name: 'Em7', 
    label: 'Intimate Folk', 
    key: '5', 
    color: 'from-blue-500/20 to-indigo-600/30',
    border: 'hover:border-blue-400 group-hover:shadow-blue-500/30',
    accent: '#38BDF8',
    freqs: [82.41, 123.47, 164.81, 196.00, 246.94, 329.63] 
  },
  { 
    name: 'Dm7', 
    label: 'Mellow Velvet', 
    key: '6', 
    color: 'from-amber-400/20 to-yellow-600/30',
    border: 'hover:border-yellow-400 group-hover:shadow-yellow-500/30',
    accent: '#FBBF24',
    freqs: [146.83, 220.00, 261.63, 349.23, 440.00] 
  },
];

const BEAT_PRESETS = [
  { id: 'cajon', name: '🥁 Acoustic Cajon & Shaker', tempo: 84 },
  { id: 'lofi', name: '☕ Vinyl & Rain Murmur', tempo: 75 },
  { id: 'lounge', name: '🌙 Late Night Reverb Jam', tempo: 90 },
];

export default function VirtualJamPad() {
  const [activeChord, setActiveChord] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('cajon');
  const [isBeatPlaying, setIsBeatPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [instrumentType, setInstrumentType] = useState('acoustic'); // 'acoustic' | 'keys'
  const [strumSpeed, setStrumSpeed] = useState('normal'); // 'normal' | 'arpeggio'
  const [jamHistory, setJamHistory] = useState([]);
  const [isLooping, setIsLooping] = useState(false);

  // Audio Context & nodes
  const audioCtxRef = useRef(null);
  const beatTimerRef = useRef(null);
  const beatStepRef = useRef(0);
  const loopTimerRef = useRef(null);
  const recordedChordsRef = useRef([]);

  // Initialize or return AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Synthesize realistic acoustic chord with staggered strum & body resonance
  const playAcousticChord = useCallback((frequencies, chordName) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    setActiveChord(chordName);
    setJamHistory(prev => [chordName, ...prev.slice(0, 5)]);

    const now = ctx.currentTime;
    const stagger = strumSpeed === 'arpeggio' ? 0.08 : 0.032;

    frequencies.forEach((freq, idx) => {
      const startTime = now + idx * stagger;

      // Primary string oscillator
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      if (instrumentType === 'acoustic') {
        osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq * 2, startTime); // 1st harmonic octave

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, startTime);
        filter.frequency.exponentialRampToValueAtTime(320, startTime + 1.6);
        filter.Q.value = 3;
      } else {
        // Warm Rhodes keys
        osc.type = 'sine';
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(freq, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, startTime);
        filter.frequency.exponentialRampToValueAtTime(450, startTime + 1.8);
      }

      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope
      const peakGain = 0.12 * volume;
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + (instrumentType === 'acoustic' ? 1.8 : 2.2));

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      subOsc.start(startTime);
      osc.stop(startTime + 2.0);
      subOsc.stop(startTime + 2.0);
    });

    // Reset pad glow after 500ms
    setTimeout(() => {
      setActiveChord((current) => (current === chordName ? null : current));
    }, 450);
  }, [getAudioContext, instrumentType, strumSpeed, volume]);

  // Procedural synthesized Cajon, Shaker & Murmur drum engine
  const playDrumStep = useCallback((preset, step) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (preset === 'cajon') {
      // Step 0: Bass cajon thud (Kick)
      if (step % 4 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.16);
        gain.gain.setValueAtTime(0.25 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      }

      // Step 2 & 6: Cajon high slap / snare
      if (step === 2 || step === 6) {
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1200;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.18 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      }

      // Continuous subtle shaker on every step
      const shakerBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const sData = shakerBuffer.getChannelData(0);
      for (let i = 0; i < sData.length; i++) sData[i] = (Math.random() * 2 - 1) * 0.15;
      const sNoise = ctx.createBufferSource();
      sNoise.buffer = shakerBuffer;
      const sFilter = ctx.createBiquadFilter();
      sFilter.type = 'bandpass';
      sFilter.frequency.value = 6500;
      const sGain = ctx.createGain();
      sGain.gain.setValueAtTime((step % 2 === 0 ? 0.07 : 0.04) * volume, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      sNoise.connect(sFilter);
      sFilter.connect(sGain);
      sGain.connect(ctx.destination);
      sNoise.start(now);
    } else if (preset === 'lofi') {
      // Soft vinyl crackle & warm jazz brush
      if (Math.random() > 0.4) {
        const b = ctx.createBuffer(1, 200, ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < 200; i++) d[i] = (Math.random() * 2 - 1) * 0.05;
        const src = ctx.createBufferSource();
        src.buffer = b;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.03 * volume, now);
        src.connect(g);
        g.connect(ctx.destination);
        src.start(now);
      }
      if (step === 0 || step === 4) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.2);
        g.gain.setValueAtTime(0.18 * volume, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      }
    } else {
      // Late night ambient pad pulse
      if (step % 4 === 0) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, now);
        g.gain.setValueAtTime(0.12 * volume, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      }
    }
  }, [getAudioContext, volume]);

  // Toggle Rhythm Beat
  const toggleBeat = () => {
    if (isBeatPlaying) {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
      setIsBeatPlaying(false);
      beatStepRef.current = 0;
    } else {
      getAudioContext();
      setIsBeatPlaying(true);
      const activeSetting = BEAT_PRESETS.find(p => p.id === selectedPreset) || BEAT_PRESETS[0];
      const intervalMs = (60 / (activeSetting.tempo * 2)) * 1000;

      beatTimerRef.current = setInterval(() => {
        playDrumStep(selectedPreset, beatStepRef.current);
        beatStepRef.current = (beatStepRef.current + 1) % 8;
      }, intervalMs);
    }
  };

  // Restart beat if preset changes while playing
  useEffect(() => {
    if (isBeatPlaying) {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
      const activeSetting = BEAT_PRESETS.find(p => p.id === selectedPreset) || BEAT_PRESETS[0];
      const intervalMs = (60 / (activeSetting.tempo * 2)) * 1000;
      beatTimerRef.current = setInterval(() => {
        playDrumStep(selectedPreset, beatStepRef.current);
        beatStepRef.current = (beatStepRef.current + 1) % 8;
      }, intervalMs);
    }
    return () => {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
    };
  }, [selectedPreset, isBeatPlaying, playDrumStep]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, []);

  // Keyboard shortcut triggers (keys 1-6)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) return;
      const chord = CHORDS.find(c => c.key === e.key);
      if (chord) {
        e.preventDefault();
        playAcousticChord(chord.freqs, chord.name);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playAcousticChord]);

  // Autoplay progression loop demo
  const toggleLoopDemo = () => {
    if (isLooping) {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      setIsLooping(false);
    } else {
      setIsLooping(true);
      let chordIdx = 0;
      // Classic soulful progression: Cmaj7 -> Am9 -> Fmaj7 -> Gadd9
      const loopOrder = [0, 2, 3, 1];
      playAcousticChord(CHORDS[loopOrder[0]].freqs, CHORDS[loopOrder[0]].name);
      
      loopTimerRef.current = setInterval(() => {
        chordIdx = (chordIdx + 1) % loopOrder.length;
        const targetChord = CHORDS[loopOrder[chordIdx]];
        playAcousticChord(targetChord.freqs, targetChord.name);
      }, 1600);
    }
  };

  return (
    <section id="jam-pad" className="py-14 sm:py-24 relative overflow-hidden select-none border-t border-white/5 bg-dusk-900">
      
      {/* Background ambient lighting aura */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[800px] h-[500px] bg-violet-600/35 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="w-[500px] h-[400px] bg-amber-500/25 rounded-full blur-[130px] mix-blend-screen"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Interactive Sound Studio</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-amber-300 to-sunset-500">Jam Lounge</span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-300 mt-2 sm:mt-3 font-medium">
            Tap acoustic chords, layer organic cajon beats, and discover your progression. Zero experience needed!
          </p>
        </div>

        {/* The Main Console Station */}
        <div className="relative rounded-2xl sm:rounded-[40px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-4 sm:p-10 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          
          {/* Top Control Bar: Instrument Mode & Strum Type & Visualizer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            
            {/* Instrument Mode Toggle */}
            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setInstrumentType('acoustic')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  instrumentType === 'acoustic'
                    ? 'bg-gradient-to-r from-amber-500 to-sunset-500 text-white shadow-md shadow-amber-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🎸 Acoustic Guitar</span>
              </button>
              <button
                onClick={() => setInstrumentType('keys')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  instrumentType === 'keys'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🎹 Rhodes Keys</span>
              </button>
            </div>

            {/* Strum Speed Selector & Progression Looper */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStrumSpeed(s => (s === 'normal' ? 'arpeggio' : 'normal'))}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                title="Toggle Strum Technique"
              >
                <Sliders className="w-3.5 h-3.5 text-violet-400" />
                <span>Style: <strong className="text-white capitalize">{strumSpeed}</strong></span>
              </button>

              <button
                onClick={toggleLoopDemo}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isLooping 
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 animate-pulse' 
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                }`}
                title="Play a soulful progression loop automatically"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin' : ''}`} />
                <span>{isLooping ? 'Looping Chords...' : 'Auto-Jam Loop'}</span>
              </button>
            </div>

          </div>

          {/* Dynamic 28-Bar Live Spectrum Audio Visualizer */}
          <div className="my-8 py-4 px-6 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full ${activeChord || isBeatPlaying ? 'bg-emerald-400 animate-ping' : 'bg-gray-600'}`} />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {activeChord ? `Sounding: ${activeChord}` : isBeatPlaying ? 'Rhythm Floor Active' : 'Ready To Jam'}
              </span>
            </div>

            {/* Equalizer Frequency Columns */}
            <div className="flex items-end justify-center h-14 gap-1.5 sm:gap-2 flex-grow max-w-lg mx-auto">
              {[...Array(24)].map((_, i) => {
                const isLit = activeChord !== null || isBeatPlaying;
                // Height calculation based on active state and bar index
                const randomOffset = ((i * 7) % 10) / 10;
                const baseHeight = isLit ? Math.min(100, Math.max(15, (randomOffset * 70) + (activeChord ? 30 : 20))) : 12;

                return (
                  <div
                    key={i}
                    className="w-1.5 sm:w-2 rounded-t-full transition-all duration-150"
                    style={{
                      height: `${baseHeight}%`,
                      background: isLit 
                        ? 'linear-gradient(to top, #8B5CF6, #F59E0B, #EC4899)' 
                        : 'rgba(255,255,255,0.1)',
                      boxShadow: isLit ? '0 0 10px rgba(139,92,246,0.6)' : 'none'
                    }}
                  />
                );
              })}
            </div>

            {/* Recent Chord Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1 shrink-0 text-xs text-gray-400 font-mono">
              <span className="text-gray-500">History:</span>
              {jamHistory.slice(0, 3).map((ch, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-bold">
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* 6 Luminous Interactive MPC Chord Trigger Pads */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 my-5 sm:my-8">
            {CHORDS.map((chord) => {
              const isActive = activeChord === chord.name;

              return (
                <button
                  key={chord.name}
                  onClick={() => playAcousticChord(chord.freqs, chord.name)}
                  className={`group relative p-3.5 sm:p-7 rounded-xl sm:rounded-3xl border transition-all duration-200 transform active:scale-95 text-left flex flex-col justify-between overflow-hidden shadow-xl ${
                    isActive
                      ? `scale-105 border-white bg-gradient-to-br ${chord.color} shadow-2xl`
                      : `bg-white/[0.04] hover:bg-white/[0.08] border-white/10 ${chord.border}`
                  }`}
                  style={{
                    boxShadow: isActive ? `0 0 35px ${chord.accent}66` : undefined
                  }}
                >
                  {/* Subtle ambient internal glow on active */}
                  {isActive && (
                    <div 
                      className="absolute -inset-4 rounded-3xl blur-xl opacity-75 pointer-events-none" 
                      style={{ background: chord.accent }} 
                    />
                  )}

                  {/* Top Bar on Pad: Key shortcut & voicing */}
                  <div className="relative z-10 flex items-center justify-between w-full mb-2 sm:mb-3">
                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-wide uppercase group-hover:text-gray-200 truncate pr-1">
                      {chord.label}
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-mono text-gray-300 font-semibold group-hover:border-amber-400/50 shrink-0">
                      Key [{chord.key}]
                    </span>
                  </div>

                  {/* Chord Big Display */}
                  <div className="relative z-10 my-1 sm:my-2">
                    <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1.5 sm:gap-2">
                      <span>{chord.name}</span>
                      <span className="text-[10px] sm:text-xs font-normal text-gray-400">
                        {instrumentType === 'acoustic' ? '6-str' : 'poly'}
                      </span>
                    </h3>
                  </div>

                  {/* Bottom Pad Hint */}
                  <div className="relative z-10 flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/10 text-[11px] sm:text-xs text-gray-400">
                    <span className="group-hover:text-amber-400 font-medium transition-colors flex items-center gap-1">
                      <span>Tap to Strum</span>
                    </span>
                    <span 
                      className="w-2 h-2 rounded-full transition-transform group-hover:scale-150"
                      style={{ background: chord.accent }}
                    />
                  </div>

                </button>
              );
            })}
          </div>

          {/* Bottom Control Bar: Organic Beat Rhythm Station & Volume */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 sm:pt-8 border-t border-white/10 bg-black/40 -mx-4 sm:-mx-10 md:-mx-12 -mb-4 sm:-mb-10 md:-mb-12 p-4 sm:p-8 rounded-b-2xl sm:rounded-b-[40px]">
            
            {/* Beat Selector & Play Button */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={toggleBeat}
                className={`px-6 py-3.5 rounded-full font-bold text-sm transition-all flex items-center gap-2.5 shadow-lg active:scale-95 ${
                  isBeatPlaying
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse'
                    : 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-violet-600/30'
                }`}
              >
                {isBeatPlaying ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Rhythm</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Rhythm Vibe</span>
                  </>
                )}
              </button>

              {/* Presets Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {BEAT_PRESETS.map((preset) => {
                  const isCurrent = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isCurrent
                          ? 'bg-amber-400/20 border border-amber-400/50 text-amber-300'
                          : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Master Fader */}
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
              <Volume2 className="text-gray-400 w-5 h-5 shrink-0" />
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-28 sm:w-36 accent-amber-400 cursor-pointer"
                  title={`Master Volume: ${Math.round(volume * 100)}%`}
                />
                <span className="text-xs font-mono text-gray-400 w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Interactive Keyboard & Pro Tips Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-amber-400 font-bold">1 - 6</span>
            <span>Press number keys on your keyboard to trigger chords instantly</span>
          </div>
          <div className="flex items-center gap-2 text-violet-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try combining <strong>Cmaj7</strong> → <strong>Am9</strong> → <strong>Fmaj7</strong> → <strong>Gadd9</strong></span>
          </div>
        </div>

      </div>
    </section>
  );
}
