import React, { useState, useRef } from 'react';
import { 
  X, CheckCircle, Music2, Ticket, Sparkles, Mic2, 
  Guitar, Disc, Drum, Radio, Share2, Download, Users, QrCode, 
  ExternalLink, Plus, Trash2, Upload, Image as ImageIcon,
  Mail, Phone, AlertCircle, Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { saveTicket, generateVerificationUrl } from '../utils/ticketStore';

const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const AUDIENCE_CATEGORIES = [
  { 
    id: 'Artist', 
    label: 'Artist', 
    sub: 'Instrumentalist / Musician', 
    icon: '🎸',
    gradient: 'from-violet-600 to-indigo-600'
  },
  { 
    id: 'Singers or Vocals', 
    label: 'Singers / Vocals', 
    sub: 'Lead & Backing Vocals', 
    icon: '🎙️',
    gradient: 'from-pink-600 to-rose-600'
  },
  { 
    id: 'Listener', 
    label: 'Listener', 
    sub: 'Music Lover & Audience', 
    icon: '🎧',
    gradient: 'from-amber-500 to-orange-600'
  },
];

export default function RSVPModal({ onClose, onOpenVerifier }) {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  // Form State
  const [mainPerson, setMainPerson] = useState('');
  const [otherMembers, setOtherMembers] = useState([]);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [audienceCategory, setAudienceCategory] = useState('Artist');
  const [recommendedSong, setRecommendedSong] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState({});
  const [generatedTicket, setGeneratedTicket] = useState(null);

  // Add / Remove Extra Members
  const handleAddMember = () => {
    if (otherMembers.length >= 9) return; // Max 10 total
    setOtherMembers([...otherMembers, '']);
  };

  const handleUpdateMember = (index, value) => {
    const updated = [...otherMembers];
    updated[index] = value;
    setOtherMembers(updated);
  };

  const handleRemoveMember = (index) => {
    const updated = otherMembers.filter((_, i) => i !== index);
    setOtherMembers(updated);
  };

  // Payment Screenshot File Upload
  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, screenshot: 'Please upload a valid image file (PNG, JPG, WebP)' }));
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPaymentScreenshot(event.target.result);
      setErrors(prev => ({ ...prev, screenshot: null }));
    };
    reader.readAsDataURL(file);
  };

  // Indian Phone Validator: 10 digits starting with 6, 7, 8, or 9 (with optional +91 or 0 prefix)
  const validatePhone = (num) => {
    const cleaned = num.trim().replace(/[\s-]/g, '');
    const indianPhoneRegex = /^(?:\+?91|0)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(cleaned);
  };

  // Email Validator
  const validateEmail = (mail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(mail.trim());
  };

  // Submit & Validation
  const handleGeneratePass = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!mainPerson.trim()) {
      newErrors.mainPerson = 'Main person name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com)';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number (starts with 6, 7, 8, or 9)';
    }

    if (!utrNumber.trim()) {
      newErrors.utrNumber = 'Transaction / UTR number is required for entry verification';
    }

    if (!paymentScreenshot) {
      newErrors.screenshot = 'Please upload your payment transaction screenshot';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of modal to see errors
      return;
    }

    setErrors({});

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const cleanMembers = otherMembers.map(m => m.trim()).filter(Boolean);
    const totalCount = 1 + cleanMembers.length;
    const txnId = utrNumber.trim().toUpperCase().startsWith('UTR') 
      ? utrNumber.trim().toUpperCase() 
      : 'TXN-JJ-' + Math.floor(1000000 + Math.random() * 9000000);
    const ticketId = 'TKT-RESON-2026-' + Math.floor(1000 + Math.random() * 9000);

    const ticketData = {
      ticketId,
      transactionId: txnId,
      utrNumber: utrNumber.trim(),
      mainPerson: mainPerson.trim(),
      otherMembers: cleanMembers,
      memberCount: totalCount,
      audienceCategory,
      instrument: audienceCategory,
      recommendedSong: recommendedSong.trim(),
      songRequest: recommendedSong.trim(),
      handle: handle.trim() ? (handle.startsWith('@') ? handle.trim() : '@' + handle.trim()) : '',
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      paymentScreenshot,
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
      
      {/* VIP Concert Pass / Holographic Ticket Modal */}
      <div className="relative w-full max-w-xl my-6 bg-gradient-to-b from-[#181330] via-dusk-900 to-[#100c22] border-2 border-violet-500/40 rounded-[28px] sm:rounded-[36px] shadow-[0_25px_90px_rgba(139,92,246,0.4)] overflow-hidden text-left z-10 max-h-[92vh] flex flex-col">
        
        {/* Holographic Iridescent Shimmer Aura Header */}
        <div className="shrink-0 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500" />
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          
          {/* Lanyard Clip Hole at Top */}
          <div className="w-full flex justify-center pb-3">
            <div className="w-16 h-2 rounded-full bg-white/20 border border-white/30 shadow-inner" />
          </div>

          {step === 1 ? (
            <div>
              {/* Ticket Header & Festival Branding */}
              <div className="mb-6 border-b border-dashed border-white/15 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-[10px] sm:text-xs font-mono font-bold text-violet-300 uppercase tracking-widest">
                    <Ticket className="w-3 h-3 text-amber-400" />
                    JAM JUNCTION PASS
                  </span>
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    LIVE RESERVATION
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
                  <span>Book Your Jam Ticket</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                  Fill details, upload payment proof & receive your scannable entry QR pass.
                </p>
              </div>
              
              {/* Form */}
              <form onSubmit={handleGeneratePass} className="space-y-4">
                
                {/* 1. Name of Main Person Booking */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mic2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Main Person Name <span className="text-pink-500">*</span></span>
                    </span>
                    <span className="text-[11px] text-gray-400 lowercase font-normal">primary attendee</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    className={`w-full bg-white/5 border ${errors.mainPerson ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-violet-400'} rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-all font-medium`}
                    placeholder="Full name of the main person booking"
                    value={mainPerson}
                    onChange={e => {
                      setMainPerson(e.target.value);
                      if (errors.mainPerson) setErrors({ ...errors, mainPerson: null });
                    }}
                  />
                  {errors.mainPerson && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.mainPerson}
                    </p>
                  )}
                </div>

                {/* Additional Members List with '+' Button */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Other Members / Friends</span>
                      <span className="text-[11px] font-normal text-gray-400 normal-case">(optional)</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="px-2.5 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/40 text-violet-300 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {otherMembers.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">
                      Booking for yourself only (1 Seat). Click "+ Add Member" to register accompanying friends.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {otherMembers.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-500 w-5">#{idx + 2}</span>
                          <input
                            type="text"
                            placeholder={`Member #${idx + 2} Full Name`}
                            value={member}
                            onChange={(e) => handleUpdateMember(idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 transition-colors"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-amber-300/90 border-t border-white/5">
                    <span>Total Seats Reserved:</span>
                    <span className="font-bold">{1 + otherMembers.length} {1 + otherMembers.length > 1 ? 'Members Pass' : 'Solo Pass'}</span>
                  </div>
                </div>

                {/* 2. Transaction / UTR Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Transaction / UTR Number <span className="text-pink-500">*</span></span>
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal">UPI / IMPS reference</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    className={`w-full bg-white/5 border ${errors.utrNumber ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-emerald-400'} rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all`}
                    placeholder="e.g. 481920394812 or TXN918237"
                    value={utrNumber}
                    onChange={e => {
                      setUtrNumber(e.target.value);
                      if (errors.utrNumber) setErrors({ ...errors, utrNumber: null });
                    }}
                  />
                  {errors.utrNumber && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.utrNumber}
                    </p>
                  )}
                </div>

                {/* 3. Upload Screenshot of Transaction */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload Transaction Screenshot <span className="text-pink-500">*</span></span>
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal">payment proof</span>
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />

                  {paymentScreenshot ? (
                    <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={paymentScreenshot} 
                          alt="Transaction Screenshot" 
                          className="w-12 h-12 rounded-xl object-cover border border-emerald-500/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{screenshotName || 'screenshot.png'}</p>
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Payment proof attached
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentScreenshot(null);
                          setScreenshotName('');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 text-xs font-semibold transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full py-4 px-4 rounded-2xl border-2 border-dashed ${errors.screenshot ? 'border-rose-500 bg-rose-500/5' : 'border-white/20 hover:border-violet-400 bg-white/[0.02] hover:bg-white/[0.05]'} transition-all flex flex-col items-center justify-center gap-1.5 group`}
                    >
                      <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-violet-400 transition-colors" />
                      <span className="text-xs font-bold text-gray-300 group-hover:text-white">
                        Click to browse or drop payment screenshot
                      </span>
                      <span className="text-[10px] text-gray-500">Supports JPG, PNG, WebP</span>
                    </button>
                  )}

                  {errors.screenshot && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.screenshot}
                    </p>
                  )}
                </div>

                {/* 4. Category of Audience */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Category of Audience <span className="text-pink-500">*</span></span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {AUDIENCE_CATEGORIES.map((cat) => {
                      const isSelected = audienceCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setAudienceCategory(cat.id)}
                          className={`p-3 rounded-2xl text-center transition-all border flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-gradient-to-b from-violet-600/90 to-purple-800/90 text-white border-violet-400 shadow-lg shadow-violet-600/30 scale-[1.02]'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                          }`}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="text-xs font-black leading-tight">{cat.label}</span>
                          <span className="text-[10px] text-gray-400 leading-tight hidden sm:block">{cat.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Recommended Song */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Disc className="w-3.5 h-3.5 text-pink-400" />
                    <span>Recommend a Song for the Jam</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-400 transition-all font-medium"
                    placeholder="Track name or artist (e.g. Yellow - Coldplay, Kabira)"
                    value={recommendedSong}
                    onChange={e => setRecommendedSong(e.target.value)}
                  />
                </div>

                {/* 6. Contact Details (Email, Indian Phone, Instagram Handle) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Email ID (with validation) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-violet-400" />
                      <span>Email ID <span className="text-pink-500">*</span></span>
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      className={`w-full bg-white/5 border ${errors.email ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-violet-400'} rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none transition-all`}
                    />
                    {errors.email && (
                      <p className="text-rose-400 text-[11px] mt-1 leading-tight">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Number (Indian valid format) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Phone Number <span className="text-pink-500">*</span></span>
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 9820123456"
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: null });
                      }}
                      className={`w-full bg-white/5 border ${errors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-emerald-400'} rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none font-mono transition-all`}
                    />
                    {errors.phone && (
                      <p className="text-rose-400 text-[11px] mt-1 leading-tight">{errors.phone}</p>
                    )}
                  </div>

                </div>

                {/* Instagram Handle (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram Handle <span className="text-gray-500 font-normal lowercase">(optional)</span></span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="@your_instagram_handle"
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-pink-400 transition-all"
                  />
                </div>

                {/* Flashing Animated Submit Button */}
                <button 
                  type="submit" 
                  className="w-full py-3.5 mt-2 rounded-2xl font-black text-white text-sm sm:text-base tracking-wide relative overflow-hidden animate-ticket-flash bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:opacity-95 shadow-xl shadow-violet-600/40 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                  style={{ color: '#FFFFFF' }}
                >
                  <Ticket className="w-4 h-4 text-white" />
                  <span>Generate Official QR Ticket</span>
                </button>

              </form>

            </div>
          ) : (
            /* STEP 2: GENERATED TICKET PASS WITH SCANNABLE QR CODE */
            <div className="flex flex-col items-center text-center">
              
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-3 border border-emerald-500/40">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>

              <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                Ticket Confirmed & Generated
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                You're Ready for Jam Junction!
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mt-1">
                Save your entry pass. Show this QR code to the admin at the gate for instant check-in.
              </p>

              {/* Physical Pass Style Card */}
              <div className="w-full mt-5 bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl p-5 shadow-2xl relative overflow-hidden text-left">
                
                {/* Header Strip inside Ticket */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-violet-300 font-bold block">
                      reson.at Community
                    </span>
                    <span className="text-base font-black text-white">Jam Junction 2026</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                    Official Pass
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Main Person</span>
                    <span className="font-bold text-white text-sm truncate block">{generatedTicket.mainPerson}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Total Attendees</span>
                    <span className="font-bold text-amber-300 text-sm">
                      {generatedTicket.memberCount} {generatedTicket.memberCount > 1 ? 'Members' : 'Member (Solo)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Audience Category</span>
                    <span className="font-semibold text-violet-300">{generatedTicket.audienceCategory}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">UTR / Txn ID</span>
                    <span className="font-mono text-emerald-400 font-bold text-[11px] truncate block">
                      {generatedTicket.utrNumber || generatedTicket.transactionId}
                    </span>
                  </div>
                </div>

                {/* Other Members List if any */}
                {generatedTicket.otherMembers && generatedTicket.otherMembers.length > 0 && (
                  <div className="mb-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Accompanying Members:</span>
                    <p className="text-gray-200 font-medium">
                      {generatedTicket.otherMembers.join(', ')}
                    </p>
                  </div>
                )}

                {/* Recommended Song if any */}
                {generatedTicket.recommendedSong && (
                  <div className="mb-3 text-xs text-gray-300 flex items-center gap-1.5">
                    <Disc className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="italic truncate">"{generatedTicket.recommendedSong}"</span>
                  </div>
                )}

                {/* QR Code Container */}
                <div className="pt-3 border-t border-dashed border-white/15 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Admin Gate QR Code</span>
                    <span className="text-xs font-bold text-emerald-400 block">Scan to verify all details</span>
                    <p className="text-[10px] text-gray-400 leading-tight">
                      Shows name, members, UTR, screenshot proof & contact info
                    </p>
                  </div>

                  {/* Crisp Vector QR Code */}
                  <div className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0 flex items-center justify-center">
                    <QRCodeSVG 
                      value={verificationUrl} 
                      size={105}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>

              </div>
              
              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3 mt-5">
                <button 
                  onClick={() => {
                    onClose();
                    if (onOpenVerifier && generatedTicket) {
                      onOpenVerifier(generatedTicket.transactionId);
                    }
                  }}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Test Admin Scan View</span>
                </button>

                <button 
                  onClick={onClose} 
                  className="py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs sm:text-sm transition-all"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
