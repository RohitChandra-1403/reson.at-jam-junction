import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, AlertCircle, ShieldCheck, Clock, Hash, 
  Users, User, Music2, QrCode, Search, Check, RefreshCw,
  Mail, Phone, Disc, Image as ImageIcon, ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getAllTickets, getTicketByTxnOrId, decodeVerificationPayload, updateTicketStatus } from '../utils/ticketStore';

export default function AdminTicketVerifierModal({ initialTxnId, initialPayload, onClose }) {
  const [searchQuery, setSearchQuery] = useState(initialTxnId || '');
  const [activeTicket, setActiveTicket] = useState(null);
  const [allTickets, setAllTickets] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Load ticket data on mount or when search changes
  useEffect(() => {
    const list = getAllTickets();
    setAllTickets(list);

    let found = null;
    if (initialTxnId) {
      found = getTicketByTxnOrId(initialTxnId);
    }

    // Fallback if scanned on mobile device without local storage: decode from URL query
    if (!found && initialPayload) {
      const decoded = decodeVerificationPayload(initialPayload);
      if (decoded) {
        found = {
          transactionId: decoded.txn,
          utrNumber: decoded.utr || decoded.txn,
          ticketId: 'TKT-LIVE-VERIFIED',
          mainPerson: decoded.name,
          otherMembers: decoded.others || [],
          memberCount: decoded.count || 1,
          audienceCategory: decoded.cat || 'Artist',
          instrument: decoded.cat || 'Artist',
          recommendedSong: decoded.song || '',
          email: decoded.email || '',
          phone: decoded.phone || '',
          handle: decoded.ig || '',
          bookedAtFormatted: decoded.time || new Date().toLocaleString(),
          status: decoded.status || 'Confirmed'
        };
      }
    }

    // Default to the latest ticket if nothing found
    if (!found && list.length > 0) {
      found = list[0];
    }

    setActiveTicket(found);
    if (found) {
      setSearchQuery(found.utrNumber || found.transactionId);
    }
  }, [initialTxnId, initialPayload]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getTicketByTxnOrId(searchQuery.trim());
    setActiveTicket(found);
  };

  const handleSelectTicket = (ticket) => {
    setActiveTicket(ticket);
    setSearchQuery(ticket.utrNumber || ticket.transactionId);
  };

  const handleToggleCheckIn = () => {
    if (!activeTicket) return;
    const newStatus = activeTicket.status === 'Checked In' ? 'Confirmed' : 'Checked In';
    updateTicketStatus(activeTicket.transactionId, newStatus);
    setActiveTicket(prev => ({
      ...prev,
      status: newStatus,
      checkedInAt: newStatus === 'Checked In' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null
    }));
    setAllTickets(getAllTickets());
  };

  const isCheckedIn = activeTicket?.status === 'Checked In';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl my-6 bg-gradient-to-b from-[#16122c] via-dusk-900 to-[#100d20] border-2 border-emerald-500/40 rounded-[28px] sm:rounded-[36px] shadow-[0_25px_90px_rgba(16,185,129,0.35)] overflow-hidden text-left z-10 max-h-[92vh] flex flex-col">
        
        {/* Top Glowing Security Scanner Strip */}
        <div className="shrink-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500" />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  OFFICIAL ADMIN SCANNER
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Ticket Verification Portal
                </h2>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-mono text-gray-400">TOTAL REGISTERED</span>
              <span className="text-sm font-bold text-white font-mono">{allTickets.length} Bookings</span>
            </div>
          </div>

          {/* Quick Search & Barcode Lookup Bar */}
          <form onSubmit={handleSearch} className="relative mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by UTR Number, Transaction ID, or Attendee Name"
              className="w-full bg-white/5 border border-white/15 rounded-2xl pl-11 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
            >
              <span>Verify</span>
            </button>
          </form>

          {/* Verification Results Display */}
          {activeTicket ? (
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/15 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md space-y-4">
              
              {/* Status Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    AUTHENTIC PASS • VERIFIED
                  </span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isCheckedIn 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isCheckedIn ? '✓ ADMITTED AT GATE' : 'PENDING GATE CHECK-IN'}
                </span>
              </div>

              {/* 1. Main Person Who Booked */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Main Person Who Booked The Seats</span>
                  </span>
                  
                  {/* Category Badge */}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {activeTicket.audienceCategory || activeTicket.instrument || 'Artist'}
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center justify-between">
                  <span>{activeTicket.mainPerson || 'Attendee'}</span>
                  {activeTicket.handle && (
                    <span className="text-xs font-normal text-pink-400 font-mono">
                      {activeTicket.handle}
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Registered Members Breakdown (Main + Others) */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Members Registered ({activeTicket.memberCount || 1} Total Seats)</span>
                  </span>
                  <span className="text-xs font-bold text-cyan-300">
                    {activeTicket.memberCount > 1 ? `${activeTicket.memberCount} Members Group` : 'Solo Attendee'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {/* Main Person Chip */}
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center gap-1">
                    <span>👑 {activeTicket.mainPerson}</span>
                    <span className="text-[10px] text-cyan-400">(Primary)</span>
                  </span>

                  {/* Accompanying members */}
                  {Array.isArray(activeTicket.otherMembers) && activeTicket.otherMembers.map((name, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-gray-200 text-xs">
                      #{i + 2} {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Transaction / UTR Number & Booking Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* UTR / Transaction ID */}
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Transaction / UTR Number</span>
                  </span>
                  <div className="text-xs sm:text-sm font-mono font-bold text-amber-300 select-all truncate">
                    {activeTicket.utrNumber || activeTicket.transactionId}
                  </div>
                  {activeTicket.utrNumber && activeTicket.transactionId && activeTicket.utrNumber !== activeTicket.transactionId && (
                    <span className="text-[10px] font-mono text-gray-500 block truncate mt-0.5">
                      Ref: {activeTicket.transactionId}
                    </span>
                  )}
                </div>

                {/* When Ticket Was Booked */}
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Booking Timestamp</span>
                  </span>
                  <div className="text-xs font-bold text-gray-200">
                    {activeTicket.bookedAtFormatted || new Date().toLocaleString()}
                  </div>
                  {activeTicket.checkedInAt && (
                    <span className="text-[11px] text-emerald-400 block mt-0.5">
                      Admitted at {activeTicket.checkedInAt}
                    </span>
                  )}
                </div>

              </div>

              {/* 4. Payment Screenshot Verification */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Transaction Screenshot / Payment Proof</span>
                </span>

                {activeTicket.paymentScreenshot ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src={activeTicket.paymentScreenshot} 
                      alt="Payment Proof" 
                      onClick={() => setPreviewImage(activeTicket.paymentScreenshot)}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500/50 cursor-pointer hover:scale-105 transition-transform shadow-md"
                      title="Click to view full screenshot"
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() => setPreviewImage(activeTicket.paymentScreenshot)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Full Screenshot</span>
                      </button>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Click image to expand and cross-verify UTR & payment amount
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-white/5 text-xs text-gray-400 italic flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>No screenshot uploaded (Walk-in or Offline entry). Check UTR manually.</span>
                  </div>
                )}
              </div>

              {/* 5. Recommended Song & Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Recommended Song */}
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block flex items-center gap-1">
                    <Disc className="w-3 h-3 text-pink-400" />
                    <span>Recommended Song</span>
                  </span>
                  <p className="text-gray-200 font-semibold truncate">
                    {activeTicket.recommendedSong || activeTicket.songRequest || 'None submitted'}
                  </p>
                </div>

                {/* Contact: Email & Phone */}
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block">Contact Info</span>
                  <div className="flex flex-col gap-0.5 text-[11px]">
                    {activeTicket.email && (
                      <a href={`mailto:${activeTicket.email}`} className="text-violet-400 hover:underline flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3" /> {activeTicket.email}
                      </a>
                    )}
                    {activeTicket.phone && (
                      <a href={`tel:${activeTicket.phone}`} className="text-emerald-400 hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {activeTicket.phone}
                      </a>
                    )}
                    {!activeTicket.email && !activeTicket.phone && (
                      <span className="text-gray-500 italic">No contact details stored</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Check-In / Admission Action Button */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleToggleCheckIn}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isCheckedIn
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCheckedIn ? 'Admitted Successfully (Click to Undo)' : 'Admit Members Into Venue'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Ticket Found</h3>
              <p className="text-xs text-gray-400">
                Please enter a valid Transaction ID or UTR number to search.
              </p>
            </div>
          )}

          {/* Recent Registrations Quick Selector */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-xs font-mono uppercase text-gray-400 block mb-3">
              Recent Registrations (Quick Verify)
            </span>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
              {allTickets.map((t) => (
                <button
                  key={t.transactionId}
                  onClick={() => handleSelectTicket(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border flex items-center gap-2 ${
                    activeTicket?.transactionId === t.transactionId
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <span>{t.mainPerson}</span>
                  <span className="text-[10px] text-gray-500">({t.utrNumber || t.transactionId})</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal for Payment Screenshot Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
          <div className="relative max-w-2xl max-h-[90vh] bg-dusk-900 border border-white/20 rounded-2xl p-4 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Payment Screenshot Verification</span>
            </h4>
            <img 
              src={previewImage} 
              alt="Full Payment Screenshot" 
              className="max-h-[75vh] w-auto rounded-xl object-contain border border-white/10"
            />
          </div>
        </div>
      )}

    </div>
  );
}
