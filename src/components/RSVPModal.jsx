import React, { useState } from 'react';
import { 
  X, CheckCircle, Music2, Ticket, Sparkles, Mic2, 
  Guitar, Disc, Drum, Radio, Share2, Download, Users, QrCode, ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { saveTicket, generateVerificationUrl } from '../utils/ticketStore';

const INSTRUMENTS = [
  { id: 'Guitarist', label: 'Guitar / Uke', icon: '🎸' },
  { id: 'Vocalist', label: 'Lead / Backing Vocals', icon: '🎙️' },
  { id: 'Percussionist', label: 'Cajon / Beats', icon: '🥁' },
  { id: 'Keyboardist', label: 'Keys / Synth', icon: '🎹' },
  { id: 'Other Instrument', label: 'Flute / Violin / Other', icon: '🎻' },
  { id: 'Listener / Supporter', label: 'Pure Listener & Vibes', icon: '🎧' },
];

export default function RSVPModal({ onClose, onOpenVerifier }) {
  const [step, setStep] = useState(1);
  const [memberCount, setMemberCount] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    role: 'Guitarist',
    songRequest: ''
  });

  const [generatedTicket, setGeneratedTicket] = useState(null);

  const handleGeneratePass = (e) => {
    e.preventDefault();

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const txnId = 'TXN-JJ-' + Math.floor(1000000 + Math.random() * 9000000);
    const ticketId = 'TKT-RESON-2026-' + Math.floor(1000 + Math.random() * 9000);

    const ticketData = {
      ticketId,
      transactionId: txnId,
      mainPerson: formData.name.trim() || 'Jammer Member',
      memberCount: memberCount,
      instrument: formData.role,
      songRequest: formData.songRequest,
      handle: formData.handle,
      bookedAt: now.toISOString(),
      bookedAtFormatted: formattedDate,
      status: 'Confirmed'
    };

    saveTicket(ticketData);
    setGeneratedTicket(ticketData);
    setStep(2);

    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#F59E0B', '#FF5722', '#8B5CF6', '#EC4899', '#38BDF8']
    });
  };

  const verificationUrl = generatedTicket 
    ? generateVerificationUrl(generatedTicket.transactionId, generatedTicket) 
    : '';

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
                  LIVE RESERVATION
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
                <span>Book Your Jam Ticket</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                Reserve seats & generate an official scannable QR ticket for entry.
              </p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleGeneratePass} className="space-y-4">
              
              {/* Main Person Who Booked */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Mic2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Main Person Name <span className="text-pink-500">*</span></span>
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all font-medium"
                  placeholder="Primary contact / who is booking the seats?"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Number of Members Registered */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Number of Members / Seats</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMemberCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        memberCount === num
                          ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white border-white/50 shadow-md shadow-violet-500/40 scale-105'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      {num} {num === 1 ? 'Seat' : 'Seats'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instrument & Role Selector Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
                  <Guitar className="w-3.5 h-3.5 text-violet-400" />
                  <span>Your Vibe / Instrument</span>
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
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-400 transition-all"
                  placeholder="What track MUST the circle jam together?"
                  value={formData.songRequest}
                  onChange={e => setFormData({...formData, songRequest: e.target.value})}
                />
              </div>

              {/* Flashing Animated Submit Button */}
              <button 
                type="submit" 
                className="w-full py-4 mt-2 rounded-2xl font-black text-white text-base tracking-wide relative overflow-hidden animate-ticket-flash bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:opacity-95 shadow-xl shadow-violet-600/40 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                style={{ color: '#FFFFFF' }}
              >
                <Ticket className="w-5 h-5 text-white" />
                <span>Generate Official QR Ticket</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>

            </form>

            {/* Ticket Tear Notch Cutouts */}
            <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-dusk-900 border-r-2 border-violet-500/40" />
            <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-dusk-900 border-l-2 border-violet-500/40" />

          </div>
        ) : (
          
          /* Step 2: High-End Scannable QR Ticket Card */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
            
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mb-3 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CheckCircle className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">Ticket Confirmed!</h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 mb-5">
              Show this QR code at the door for instant admin scanner verification.
            </p>
            
            {/* The Digital Scannable VIP Pass */}
            <div className="w-full bg-gradient-to-br from-[#1e1346] via-[#120e24] to-[#25131e] p-5 sm:p-6 rounded-2xl border-2 border-amber-400/60 shadow-2xl relative overflow-hidden text-left">
              
              {/* Top Foil Band with Transaction ID */}
              <div className="flex items-center justify-between border-b border-dashed border-white/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                    ALL-ACCESS QR PASS
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-gray-300">
                  {generatedTicket?.transactionId}
                </span>
              </div>

              {/* Main Person & Member Count */}
              <div className="my-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-violet-300">
                  Main Person Who Booked
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mt-0.5 mb-1.5">
                  {generatedTicket?.mainPerson}
                </h3>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-xs font-bold text-cyan-300">
                    <Users className="w-3.5 h-3.5" />
                    <span>{generatedTicket?.memberCount} Member{generatedTicket?.memberCount > 1 ? 's' : ''} Registered</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 text-xs font-semibold text-amber-300">
                    <span>{generatedTicket?.instrument}</span>
                  </span>
                </div>
              </div>

              {/* Booking Time & Venue */}
              <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Booked On</span>
                  <span className="text-white font-mono text-[11px]">
                    {generatedTicket?.bookedAtFormatted}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Venue</span>
                  <span className="text-white font-bold">Reson@ Jam Lounge</span>
                </div>
              </div>

              {/* Real Scannable QR Code Section */}
              <div className="flex items-center justify-between pt-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase block mb-1">
                    ✓ SCAN TO VERIFY TICKET
                  </span>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Admin camera scan displays booking time, seats, and primary identity.
                  </p>
                </div>

                {/* Actual Scannable QR Code */}
                <div className="bg-white p-2.5 rounded-xl shadow-lg shrink-0 flex items-center justify-center">
                  <QRCodeSVG 
                    value={verificationUrl} 
                    size={96}
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>

            </div>
            
            {/* Action Buttons: Test Admin Verification & Done */}
            <div className="w-full flex flex-col sm:flex-row gap-3 mt-6">
              <button 
                onClick={() => {
                  onClose();
                  if (onOpenVerifier && generatedTicket) {
                    onOpenVerifier(generatedTicket.transactionId);
                  }
                }}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Test Admin Scan View</span>
              </button>

              <button 
                onClick={onClose} 
                className="py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all"
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
