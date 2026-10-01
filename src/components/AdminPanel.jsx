import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Search, Filter, Download, Plus, CheckCircle2, Clock, 
  Users, User, Ticket, Trash2, ArrowUpDown, RefreshCw, 
  ShieldCheck, QrCode, Music2, Check, ExternalLink, Calendar,
  Sparkles, AlertCircle, FileSpreadsheet, Eye
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  getAllTickets, saveTicket, updateTicketStatus, 
  deleteTicket, exportTicketsToCSV, resetDemoTickets,
  generateVerificationUrl 
} from '../utils/ticketStore';

const INSTRUMENT_OPTIONS = [
  'All Roles',
  'Guitarist',
  'Vocalist',
  'Percussionist',
  'Keyboardist',
  'Other Instrument',
  'Listener / Supporter'
];

export default function AdminPanel({ onClose, onOpenScanner }) {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, CHECKED_IN, CONFIRMED
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [sortBy, setSortBy] = useState('RECENT'); // RECENT, SEATS_DESC, NAME_ASC
  const [copiedTxn, setCopiedTxn] = useState(null);
  const [inspectTicket, setInspectTicket] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Attendee Form State (Manual Registration)
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    handle: '',
    memberCount: 1,
    instrument: 'Guitarist',
    songRequest: ''
  });

  const loadData = () => {
    setTickets(getAllTickets());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Copy transaction ID to clipboard
  const handleCopy = (txn) => {
    navigator.clipboard.writeText(txn);
    setCopiedTxn(txn);
    setTimeout(() => setCopiedTxn(null), 2000);
  };

  // Toggle check-in status
  const handleToggleStatus = (ticket) => {
    const nextStatus = ticket.status === 'Checked In' ? 'Confirmed' : 'Checked In';
    const updated = updateTicketStatus(ticket.transactionId, nextStatus);
    setTickets(updated);
  };

  // Delete registration
  const handleDelete = (ticket) => {
    if (window.confirm(`Are you sure you want to remove registration for ${ticket.mainPerson} (${ticket.transactionId})?`)) {
      const updated = deleteTicket(ticket.transactionId);
      setTickets(updated);
      if (inspectTicket?.transactionId === ticket.transactionId) {
        setInspectTicket(null);
      }
    }
  };

  // Reset sample demo data
  const handleResetDemo = () => {
    if (window.confirm('Reset registration list to default demo jam attendees?')) {
      const reset = resetDemoTickets();
      setTickets(reset);
    }
  };

  // Create manual walk-in registration
  const handleCreateWalkIn = (e) => {
    e.preventDefault();
    if (!newAttendee.name.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const txnId = 'TXN-JJ-' + Math.floor(1000000 + Math.random() * 9000000);
    const ticketId = 'TKT-RESON-2026-' + Math.floor(1000 + Math.random() * 9000);

    const ticketData = {
      ticketId,
      transactionId: txnId,
      mainPerson: newAttendee.name.trim(),
      memberCount: Number(newAttendee.memberCount) || 1,
      instrument: newAttendee.instrument,
      songRequest: newAttendee.songRequest.trim() || 'Walk-in Acoustic Vibe',
      handle: newAttendee.handle.trim() || '@walkin_jammer',
      bookedAt: now.toISOString(),
      bookedAtFormatted: formattedDate,
      status: 'Checked In', // Walk-ins at gate are usually checked in right away
      checkedInAt: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    saveTicket(ticketData);
    loadData();
    setShowAddModal(false);
    setNewAttendee({
      name: '',
      handle: '',
      memberCount: 1,
      instrument: 'Guitarist',
      songRequest: ''
    });
  };

  // Analytics KPIs
  const stats = useMemo(() => {
    const totalBookings = tickets.length;
    const totalMembers = tickets.reduce((sum, t) => sum + (Number(t.memberCount) || 1), 0);
    const checkedInTickets = tickets.filter(t => t.status === 'Checked In');
    const checkedInMembers = checkedInTickets.reduce((sum, t) => sum + (Number(t.memberCount) || 1), 0);
    const checkInRate = totalMembers > 0 ? Math.round((checkedInMembers / totalMembers) * 100) : 0;
    
    // Group by instrument
    const rolesCount = {};
    tickets.forEach(t => {
      const role = t.instrument || 'Jammer';
      rolesCount[role] = (rolesCount[role] || 0) + (Number(t.memberCount) || 1);
    });

    return {
      totalBookings,
      totalMembers,
      checkedInTickets: checkedInTickets.length,
      checkedInMembers,
      checkInRate,
      rolesCount
    };
  }, [tickets]);

  // Filtered & Sorted Tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(t => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches = 
            t.mainPerson?.toLowerCase().includes(q) ||
            t.transactionId?.toLowerCase().includes(q) ||
            t.ticketId?.toLowerCase().includes(q) ||
            t.handle?.toLowerCase().includes(q) ||
            t.songRequest?.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Status filter
        if (statusFilter === 'CHECKED_IN' && t.status !== 'Checked In') return false;
        if (statusFilter === 'CONFIRMED' && t.status === 'Checked In') return false;

        // Role filter
        if (roleFilter !== 'All Roles' && t.instrument !== roleFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'SEATS_DESC') {
          return (b.memberCount || 1) - (a.memberCount || 1);
        }
        if (sortBy === 'NAME_ASC') {
          return (a.mainPerson || '').localeCompare(b.mainPerson || '');
        }
        // Default RECENT
        return new Date(b.bookedAt || 0) - new Date(a.bookedAt || 0);
      });
  }, [tickets, searchQuery, statusFilter, roleFilter, sortBy]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-black/85 backdrop-blur-xl">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-7xl h-[92vh] max-h-[920px] bg-gradient-to-b from-[#151128] via-[#0e0c1a] to-[#0a0814] border border-violet-500/30 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-left">
        
        {/* Top Glowing Strip */}
        <div className="h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400" />

        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-amber-500 p-0.5 shadow-md shadow-violet-600/30">
              <div className="w-full h-full bg-dusk-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
                  reson.at Admin Portal
                </h2>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live Registration Tracker
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Track attendees, verify QR codes, admit members, and export event data
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/25"
              title="Add Walk-In Attendee"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Walk-In</span>
            </button>

            <button
              onClick={() => exportTicketsToCSV(tickets)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Export all registrations to CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            {onOpenScanner && (
              <button
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Launch QR Camera Scanner"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Scanner</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analytics KPI Ribbon */}
        <div className="px-5 py-3.5 bg-black/40 border-b border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Total Bookings</p>
              <p className="text-xl font-black text-white">{stats.totalBookings}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Members Registered</p>
              <p className="text-xl font-black text-amber-300">{stats.totalMembers} <span className="text-xs font-normal text-gray-400">Seats</span></p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Gate Admitted</p>
              <p className="text-xl font-black text-emerald-400">
                {stats.checkedInMembers} <span className="text-xs font-normal text-gray-400">({stats.checkInRate}%)</span>
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Pending Gate Entry</p>
              <p className="text-xl font-black text-cyan-300">{stats.totalMembers - stats.checkedInMembers}</p>
            </div>
          </div>

        </div>

        {/* Filter & Search Toolbar */}
        <div className="px-5 py-3 border-b border-white/5 bg-white/[0.01] flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, TXN ID, handle, or song..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            
            {/* Status Segmented Buttons */}
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'ALL' 
                    ? 'bg-violet-600 text-white shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                onClick={() => setStatusFilter('CHECKED_IN')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'CHECKED_IN' 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Admitted ({stats.checkedInTickets})
              </button>
              <button
                onClick={() => setStatusFilter('CONFIRMED')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'CONFIRMED' 
                    ? 'bg-amber-600 text-white shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pending ({tickets.length - stats.checkedInTickets})
              </button>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-violet-500 text-xs"
            >
              {INSTRUMENT_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-dusk-900 text-white">
                  {opt}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 text-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-violet-500 text-xs"
            >
              <option value="RECENT" className="bg-dusk-900 text-white">Most Recent</option>
              <option value="SEATS_DESC" className="bg-dusk-900 text-white">Most Seats (Group First)</option>
              <option value="NAME_ASC" className="bg-dusk-900 text-white">Name (A - Z)</option>
            </select>

            {/* Reset Demo button */}
            <button
              onClick={handleResetDemo}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-amber-300 border border-white/10"
              title="Reset sample attendee list"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

        {/* Registrations List (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <Ticket className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-base font-bold text-gray-300">No Registrations Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {searchQuery 
                  ? `No matches for "${searchQuery}". Try clearing search or filters.` 
                  : 'No tickets booked yet. Add a walk-in attendee or reset sample demo attendees.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setRoleFilter('All Roles'); }}
                  className="mt-4 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isCheckedIn = ticket.status === 'Checked In';
              const qrUrl = generateVerificationUrl(ticket.transactionId, ticket);

              return (
                <div 
                  key={ticket.transactionId}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCheckedIn
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                      : 'bg-white/[0.03] border-white/10 hover:border-violet-500/40'
                  }`}
                >
                  {/* Left: Attendee Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    
                    {/* Role Icon Avatar */}
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-amber-500/30 border border-white/15 flex items-center justify-center shrink-0 text-xl shadow-inner">
                      {ticket.instrument === 'Guitarist' ? '🎸' :
                       ticket.instrument === 'Vocalist' ? '🎙️' :
                       ticket.instrument === 'Percussionist' ? '🥁' :
                       ticket.instrument === 'Keyboardist' ? '🎹' : '🎵'}
                    </div>

                    {/* Information */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-white truncate">
                          {ticket.mainPerson}
                        </span>
                        
                        {/* Member Count Pill */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Users className="w-3 h-3" />
                          <span>{ticket.memberCount} {ticket.memberCount > 1 ? 'Members' : 'Member'}</span>
                        </span>

                        {/* Status Pill */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isCheckedIn 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}>
                          {isCheckedIn ? '✓ Admitted' : 'Pending Entry'}
                        </span>
                      </div>

                      {/* Sub-row: Handle, Instrument, and Song */}
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                        <span className="text-violet-400 font-medium">{ticket.handle || '@attendee'}</span>
                        <span>•</span>
                        <span className="text-gray-300">{ticket.instrument}</span>
                        {ticket.songRequest && (
                          <>
                            <span>•</span>
                            <span className="italic text-gray-400 truncate max-w-xs" title={ticket.songRequest}>
                              ♫ "{ticket.songRequest}"
                            </span>
                          </>
                        )}
                      </div>

                      {/* Transaction ID & Booking Time */}
                      <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500 mt-1.5 flex-wrap">
                        <span 
                          onClick={() => handleCopy(ticket.transactionId)}
                          className="hover:text-emerald-400 cursor-pointer flex items-center gap-1 transition-colors"
                          title="Click to copy Transaction ID"
                        >
                          <span>{ticket.transactionId}</span>
                          {copiedTxn === ticket.transactionId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : null}
                        </span>
                        <span>|</span>
                        <span>Booked: {ticket.bookedAtFormatted || 'Recent'}</span>
                        {ticket.checkedInAt && (
                          <>
                            <span>|</span>
                            <span className="text-emerald-400">Admitted at {ticket.checkedInAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions Controls */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    
                    {/* Toggle Check In Button */}
                    <button
                      onClick={() => handleToggleStatus(ticket)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                        isCheckedIn
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      }`}
                      title={isCheckedIn ? 'Click to undo gate check-in' : 'Admit attendee at venue gate'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isCheckedIn ? 'Admitted' : 'Admit'}</span>
                    </button>

                    {/* View QR Pass Modal Button */}
                    <button
                      onClick={() => setInspectTicket(ticket)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                      title="Inspect Attendee QR Pass"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Delete Registration */}
                    <button
                      onClick={() => handleDelete(ticket)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-gray-400 hover:text-rose-400 transition-colors"
                      title="Delete / cancel registration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Status Bar */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Showing {filteredTickets.length} of {tickets.length} registrations</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Jam Junction Gate Desk</span>
          </div>
        </div>

      </div>

      {/* Inspect Ticket QR Pass Modal */}
      {inspectTicket && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1b1535] to-[#0f0b1e] border-2 border-violet-500/50 rounded-3xl p-6 shadow-2xl text-center text-white">
            <button 
              onClick={() => setInspectTicket(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono tracking-widest text-violet-400 uppercase font-bold">
              reson.at Entry Pass
            </span>
            <h4 className="text-xl font-black mt-1">{inspectTicket.mainPerson}</h4>
            <p className="text-xs text-amber-300 font-semibold mt-0.5">
              {inspectTicket.memberCount} {inspectTicket.memberCount > 1 ? 'Members Group Ticket' : 'Single Member Ticket'}
            </p>

            {/* QR Code */}
            <div className="my-5 p-4 bg-white rounded-2xl inline-block shadow-lg">
              <QRCodeSVG 
                value={generateVerificationUrl(inspectTicket.transactionId, inspectTicket)}
                size={160}
                level="M"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-left space-y-1 font-mono">
              <p className="text-gray-400">Txn: <span className="text-white font-bold">{inspectTicket.transactionId}</span></p>
              <p className="text-gray-400">Role: <span className="text-amber-300 font-sans font-semibold">{inspectTicket.instrument}</span></p>
              <p className="text-gray-400">Booked: <span className="text-gray-200">{inspectTicket.bookedAtFormatted}</span></p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  handleToggleStatus(inspectTicket);
                  setInspectTicket({
                    ...inspectTicket,
                    status: inspectTicket.status === 'Checked In' ? 'Confirmed' : 'Checked In'
                  });
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  inspectTicket.status === 'Checked In'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {inspectTicket.status === 'Checked In' ? '✓ Admitted' : 'Admit Now'}
              </button>
              <button
                onClick={() => setInspectTicket(null)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Walk-In Attendee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#181232] to-[#0c0919] border border-violet-500/40 rounded-3xl p-6 shadow-2xl text-left text-white">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black font-display text-white">
              Add Walk-In Attendee
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Quick registration for guests arriving directly at the door
            </p>

            <form onSubmit={handleCreateWalkIn} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Main Attendee Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Number of Members
                  </label>
                  <select
                    value={newAttendee.memberCount}
                    onChange={(e) => setNewAttendee({ ...newAttendee, memberCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-dusk-900 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Member' : 'Members'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Role / Instrument
                  </label>
                  <select
                    value={newAttendee.instrument}
                    onChange={(e) => setNewAttendee({ ...newAttendee, instrument: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dusk-900 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Guitarist">Guitarist</option>
                    <option value="Vocalist">Vocalist</option>
                    <option value="Percussionist">Percussionist</option>
                    <option value="Keyboardist">Keyboardist</option>
                    <option value="Other Instrument">Other</option>
                    <option value="Listener / Supporter">Listener</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Instagram Handle / Phone (Optional)
                </label>
                <input
                  type="text"
                  value={newAttendee.handle}
                  onChange={(e) => setNewAttendee({ ...newAttendee, handle: e.target.value })}
                  placeholder="@handle or phone"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Song / Jam Request
                </label>
                <input
                  type="text"
                  value={newAttendee.songRequest}
                  onChange={(e) => setNewAttendee({ ...newAttendee, songRequest: e.target.value })}
                  placeholder="e.g. Wonderwall / Acoustic Jam"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Register & Admit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
