import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Sliders, Volume2 } from 'lucide-react';

export default function VirtualJamPad() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const audioContextRef = useRef(null);
  const ambientNodeRef = useRef(null);

  // Simple synthesizer for chords
  const playChord = (frequencies) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 2);
    });
  };

  const chords = [
    { name: 'C', freqs: [261.63, 329.63, 392.00] },
    { name: 'G', freqs: [392.00, 493.88, 587.33] },
    { name: 'Am', freqs: [220.00, 261.63, 329.63] },
    { name: 'F', freqs: [349.23, 440.00, 523.25] },
    { name: 'Em', freqs: [329.63, 392.00, 493.88] },
    { name: 'Dm', freqs: [293.66, 349.23, 440.00] },
  ];

  // Mock ambient noise generator (brown noise for cafe murmur vibe)
  const toggleBeat = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    if (isPlaying) {
      if (ambientNodeRef.current) {
        ambientNodeRef.current.stop();
        ambientNodeRef.current.disconnect();
      }
      setIsPlaying(false);
    } else {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      const gain = ctx.createGain();
      gain.gain.value = ambientVolume;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      ambientNodeRef.current = noise;
      setIsPlaying(true);
    }
  };

  return (
    <section id="jam-pad" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Virtual <span className="text-violet-500">Jam Lounge</span></h2>
          <p className="text-gray-400">Trigger live acoustic chords and set the mood. Try it out!</p>
        </div>

        <div className="glass-panel p-8 md:p-12">
          {/* Visualizer bars mock */}
          <div className="flex justify-center items-end h-32 gap-2 mb-12 opacity-50">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-3 bg-gradient-to-t from-violet-600 to-amber-500 rounded-t-full transition-all duration-150"
                style={{ 
                  height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
                  animation: isPlaying ? `pulse-slow ${Math.random() * 2 + 1}s infinite alternate` : 'none'
                }}
              ></div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {chords.map((chord) => (
              <button
                key={chord.name}
                onClick={() => playChord(chord.freqs)}
                className="neo-brutalist bg-white text-dusk-900 font-bold py-6 rounded-xl text-2xl hover:bg-amber-100 active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                {chord.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-black/30 p-6 rounded-2xl border border-white/5">
            <button 
              onClick={toggleBeat}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-colors ${isPlaying ? 'bg-red-500/20 text-red-500' : 'bg-violet-600 text-white hover:bg-violet-500'}`}
            >
              {isPlaying ? <><Square className="fill-current w-4 h-4" /> Stop Vibe</> : <><Play className="fill-current w-4 h-4" /> Cafe Murmur Lo-fi</>}
            </button>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Volume2 className="text-gray-400 w-5 h-5" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-full md:w-48 accent-amber-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
