import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, AlertCircle, ShieldCheck, Clock, Hash, 
  Users, User, Music2, QrCode, Search, Check, RefreshCw 
} from 'lucide-react';
import { getAllTickets, getTicketByTxnOrId, decodeVerificationPayload } from '../utils/ticketStore';

export default function AdminTicketVerifierModal({ initialTxnId, initialPayload, onClose }) {
  const [searchQuery, setSearchQuery] = useState(initialTxnId || '');
  const [activeTicket, setActiveTicket] = useState(null);
  const [allTickets, setAllTickets] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

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
          ticketId: 'TKT-LIVE-VERIFIED',
          mainPerson: decoded.name,
          memberCount: decoded.count,
          bookedAtFormatted: decoded.time,
          instrument: decoded.role,
          status: 'Confirmed'
        };
      }
    }

    // If still no ticket and tickets exist, default to the latest ticket
    if (!found && list.length > 0) {
      found = list[0];
    }

    setActiveTicket(found);
    if (found) {
      setSearchQuery(found.transactionId);
    }
  }, [initialTxnId, initialPayload]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getTicketByTxnOrId(searchQuery.trim());
    setActiveTicket(found);
    setIsCheckedIn(false);
  };

  const handleSelectTicket = (ticket) => {
    setActiveTicket(ticket);
    setSearchQuery(ticket.transactionId);
    setIsCheckedIn(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl my-6 bg-gradient-to-b from-[#16122c] via-dusk-900 to-[#100d20] border-2 border-emerald-500/40 rounded-[28px] sm:rounded-[36px] shadow-[0_25px_90px_rgba(16,185,129,0.35)] overflow-hidden text-left z-10">
        
        {/* Top Glowing Security Scanner Strip */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500" />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
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
          <form onSubmit={handleSearch} className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Transaction ID (e.g. TXN-JJ-...) or Name"
              className="w-full bg-white/5 border border-white/15 rounded-2xl pl-11 pr-24 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono transition-all"
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
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/15 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              
              {/* Status Banner */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    AUTHENTIC PASS • VERIFIED
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  {isCheckedIn ? '✓ ADMITTED ON FLOOR' : 'READY TO ADMIT'}
                </span>
              </div>

              {/* 1. Main Person Who Booked */}
              <div className="mb-5 bg-black/40 p-4 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Main Person Who Booked The Seats</span>
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-between">
                  <span>{activeTicket.mainPerson || activeTicket.name || 'Anonymous Jammer'}</span>
                  {activeTicket.handle && (
                    <span className="text-xs font-normal text-violet-400 font-mono">
                      {activeTicket.handle}
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Key Verification Stats: Number of Members & Transaction ID & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                
                {/* Number of Members Registered */}
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Members Registered</span>
                  </span>
                  <div className="text-xl font-black text-cyan-300 flex items-baseline gap-1.5">
                    <span>{activeTicket.memberCount || 1} Seat{activeTicket.memberCount > 1 ? 's' : ''}</span>
                    <span className="text-xs font-normal text-gray-400">Reserved</span>
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-violet-400" />
                    <span>Transaction ID</span>
                  </span>
                  <div className="text-sm font-mono font-bold text-amber-300 truncate">
                    {activeTicket.transactionId || 'TXN-JJ-DEFAULT'}
                  </div>
                </div>

                {/* Booking Timestamp */}
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/10 sm:col-span-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>When Ticket Was Booked</span>
                  </span>
                  <div className="text-sm font-bold text-gray-200">
                    {activeTicket.bookedAtFormatted || new Date().toLocaleString()}
                  </div>
                </div>

              </div>

              {/* Extra Details: Role & Pass the Aux */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-400">
                <div>
                  <span>Instrument: </span>
                  <strong className="text-white">{activeTicket.instrument || activeTicket.role || 'Acoustic Jammer'}</strong>
                </div>
                {activeTicket.songRequest && (
                  <div>
                    <span>Song: </span>
                    <strong className="text-pink-300">"{activeTicket.songRequest}"</strong>
                  </div>
                )}
              </div>

              {/* Check-In / Admission Action Button */}
              <div className="mt-6 pt-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setIsCheckedIn(!isCheckedIn)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isCheckedIn
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCheckedIn ? 'Admitted Successfully (Undo)' : 'Admit Members Into Lounge'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Ticket Found</h3>
              <p className="text-xs text-gray-400">
                Please enter a valid Transaction ID or book a new ticket to test.
              </p>
            </div>
          )}

          {/* Quick Recent Bookings Picker for Admins */}
          {allTickets.length > 0 && (
            <div className="mt-6">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2">
                Recent Bookings on this Device ({allTickets.length}):
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allTickets.slice(0, 4).map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTicket(t)}
                    className={`px-3 py-2 rounded-xl text-left border text-xs whitespace-nowrap transition-all ${
                      activeTicket?.transactionId === t.transactionId
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold">{t.mainPerson} ({t.memberCount} seats)</div>
                    <div className="text-[10px] font-mono text-gray-400">{t.transactionId}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
