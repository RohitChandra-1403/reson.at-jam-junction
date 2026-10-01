import React, { useState } from 'react';
import { 
  X, CheckCircle, Music2, Ticket, Sparkles, Mic2, 
  Guitar, Disc, Drum, Radio, Share2, Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INSTRUMENTS = [
  { id: 'Guitarist', label: 'Guitar / Uke', icon: '🎸' },
  { id: 'Vocalist', label: 'Lead / Backing Vocals', icon: '🎙️' },
  { id: 'Percussionist', label: 'Cajon / Beats', icon: '🥁' },
  { id: 'Keyboardist', label: 'Keys / Synth', icon: '🎹' },
  { id: 'Other Instrument', label: 'Flute / Violin / Other', icon: '🎻' },
  { id: 'Listener / Supporter', label: 'Pure Listener & Vibes', icon: '🎧' },
];

export default function RSVPModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    role: 'Guitarist',
    songRequest: ''
  });

  const serialNumber = 'JJ-2026-VIP-' + Math.floor(1000 + Math.random() * 9000);

  const handleGeneratePass = (e) => {
    e.preventDefault();
    setStep(2);
    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#F59E0B', '#FF5722', '#8B5CF6', '#EC4899', '#38BDF8']
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dimmed backdrop with soundwave blur */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Authentic Backstage VIP Concert Pass / Holographic Ticket Modal */}
      <div className="relative w-full max-w-lg my-6 bg-gradient-to-b from-dusk-900 via-dusk-900 to-[#120e24] border-2 border-violet-500/40 rounded-[28px] sm:rounded-[36px] shadow-[0_25px_90px_rgba(139,92,246,0.4)] overflow-hidden text-left z-10">
        
        {/* Holographic Iridescent Shimmer Aura Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500" />
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lanyard Clip Hole at Top */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-16 h-2 rounded-full bg-white/20 border border-white/30 shadow-inner" />
        </div>

        {step === 1 ? (
          <div className="p-6 sm:p-8">
            
            {/* Ticket Header & Festival Branding */}
            <div className="mb-6 border-b border-dashed border-white/15 pb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-[10px] sm:text-xs font-mono font-bold text-violet-300 uppercase tracking-widest">
                  <Ticket className="w-3 h-3 text-amber-400" />
                  ALL-ACCESS PASS
                </span>
                <span className="font-mono text-xs text-amber-400 font-bold">
                  {serialNumber}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
                <span>Book Your Jam Ticket</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                Claim your spot on the floor & mint your official Reson@ lanyard pass.
              </p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleGeneratePass} className="space-y-5">
              
              {/* Name / Musician Moniker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Mic2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Name or Artist Moniker <span className="text-pink-500">*</span></span>
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all font-medium"
                  placeholder="e.g. Maya or @jammermaya"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Instrument & Role Selector Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
                  <Guitar className="w-3.5 h-3.5 text-violet-400" />
                  <span>Your Instrument / Role</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {INSTRUMENTS.map((inst) => {
                    const isSelected = formData.role === inst.id;
                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: inst.id })}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-violet-600/90 to-pink-600/90 text-white border-white/40 shadow-md shadow-violet-500/30 scale-[1.02]'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-base">{inst.icon}</span>
                        <span className="truncate">{inst.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pass the Aux Song Request */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
                  <span>"Pass The Aux" Song Request</span>
                </label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-400 transition-all"
                  placeholder="What track MUST the circle jam together?"
                  value={formData.songRequest}
                  onChange={e => setFormData({...formData, songRequest: e.target.value})}
                />
              </div>

              {/* Instagram Handle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Instagram Handle <span className="text-gray-500 font-normal">(Optional for jam tag)</span>
                </label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-400 transition-all"
                  placeholder="@yourhandle"
                  value={formData.handle}
                  onChange={e => setFormData({...formData, handle: e.target.value})}
                />
              </div>

              {/* Flashing Animated Submit Button */}
              <button 
                type="submit" 
                className="w-full py-4 mt-2 rounded-2xl font-black text-white text-base tracking-wide relative overflow-hidden animate-ticket-flash bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:opacity-95 shadow-xl shadow-violet-600/40 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                style={{ color: '#FFFFFF' }}
              >
                <Ticket className="w-5 h-5 text-white" />
                <span>Claim Official Backstage Pass</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>

            </form>

            {/* Ticket Tear Notch Cutouts on Left and Right Sides */}
            <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-dusk-900 border-r-2 border-violet-500/40" />
            <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-dusk-900 border-l-2 border-violet-500/40" />

          </div>
        ) : (
          
          /* Step 2: High-End Holographic Backstage Pass Presentation */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
            
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">You're On The Jam List!</h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 mb-6">
              Show this pass at the lounge door. Welcome to the circle.
            </p>
            
            {/* The Digital Lanyard Hologram Pass Card */}
            <div className="w-full bg-gradient-to-br from-[#1e1346] via-[#120e24] to-[#25131e] p-6 rounded-2xl border-2 border-amber-400/50 shadow-2xl relative overflow-hidden text-left group">
              
              {/* Top Foil Band */}
              <div className="flex items-center justify-between border-b border-dashed border-white/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                    BACKSTAGE ALL-ACCESS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">{serialNumber}</span>
              </div>

              {/* Pass Holder Information */}
              <div className="my-4">
                <p className="text-[10px] uppercase font-bold tracking-wider text-violet-300">Jammer Name</p>
                <h3 className="text-3xl font-black text-white tracking-tight leading-none mt-0.5 mb-1.5">
                  {formData.name || 'Indie Musician'}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-xs font-semibold text-amber-300">
                  <span>{formData.role}</span>
                </div>
              </div>

              {/* Event Location & Track */}
              <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Venue</span>
                  <span className="text-white font-bold">Reson@ Jam Lounge</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Pass the Aux Song</span>
                  <span className="text-pink-300 font-semibold truncate block">
                    {formData.songRequest ? `"${formData.songRequest}"` : 'Free Jam Choice'}
                  </span>
                </div>
              </div>

              {/* Bottom Authentic Barcode & QR Code Section */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  {/* Barcode visual lines */}
                  <div className="flex items-center gap-[2px] h-9 mb-1">
                    {[3, 1, 4, 1, 2, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1].map((w, i) => (
                      <div 
                        key={i} 
                        className="bg-white/80 rounded-sm h-full" 
                        style={{ width: `${w * 1.5}px` }} 
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-gray-400 tracking-widest">VALID FOR NEXT SESSION</span>
                </div>

                <div className="w-14 h-14 bg-white p-1 rounded-lg shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-dusk-900 rounded flex flex-col items-center justify-center text-white">
                    <Music2 className="w-6 h-6 text-amber-400" />
                    <span className="text-[7px] font-mono">RESON</span>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Buttons */}
            <div className="w-full flex gap-3 mt-6">
              <button 
                onClick={onClose} 
                className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-600/30"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
