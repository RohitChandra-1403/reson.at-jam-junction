import React, { useState } from 'react';
import { X, CheckCircle, Music2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RSVPModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    role: 'Listener/Supporter',
    songRequest: ''
  });

  const handleGeneratePass = (e) => {
    e.preventDefault();
    setStep(2);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FF5722', '#8B5CF6']
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-dusk-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden neo-brutalist">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <X className="w-6 h-6" />
        </button>

        {step === 1 ? (
          <div className="p-8">
            <h2 className="text-3xl font-black mb-2 text-white">Join The Circle</h2>
            <p className="text-gray-400 mb-8">Generate your VIP Jam Junction Pass.</p>
            
            <form onSubmit={handleGeneratePass} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name / Moniker</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="How should we call you?"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Vibe / Instrument</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors appearance-none"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option className="bg-dusk-900">Listener / Supporter</option>
                  <option className="bg-dusk-900">Vocalist</option>
                  <option className="bg-dusk-900">Guitarist</option>
                  <option className="bg-dusk-900">Keyboardist</option>
                  <option className="bg-dusk-900">Percussionist</option>
                  <option className="bg-dusk-900">Other Instrument</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram Handle (Optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="@yourhandle"
                  value={formData.handle}
                  onChange={e => setFormData({...formData, handle: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">"Pass the Aux" Song Request</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="What's a song we MUST play?"
                  value={formData.songRequest}
                  onChange={e => setFormData({...formData, songRequest: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-lg transition-colors">
                Generate VIP Pass
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
            <h2 className="text-3xl font-black mb-2 text-white">You're on the list!</h2>
            <p className="text-gray-400 mb-8">Save this pass or show it at the door.</p>
            
            {/* The Digital Pass */}
            <div className="w-full bg-gradient-to-br from-violet-900 to-dusk-900 p-6 rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full"></div>
              
              <div className="flex items-center gap-2 mb-8">
                <Music2 className="text-violet-400 w-6 h-6" />
                <span className="font-bold tracking-tight text-white/80">reson.at</span>
              </div>
              
              <div className="mb-8">
                <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-1">VIP Jam Pass</p>
                <h3 className="text-2xl font-black text-white">{formData.name || 'Jammer'}</h3>
                <p className="text-gray-300">{formData.role}</p>
              </div>
              
              <div className="flex justify-between items-end border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs text-gray-500">Event</p>
                  <p className="font-semibold text-white text-sm">Jam Junction</p>
                </div>
                {/* Mock QR */}
                <div className="w-16 h-16 bg-white p-1 rounded">
                  <div className="w-full h-full bg-black flex flex-wrap p-[1px] gap-[1px]">
                     {/* Just random squares for QR mock */}
                     {[...Array(25)].map((_, i) => (
                       <div key={i} className={`w-[20%] h-[20%] ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
