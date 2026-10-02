import React, { useState, useEffect, useRef } from 'react';
import { 
  X, CheckCircle, AlertCircle, ShieldCheck, Clock, Hash, 
  Users, User, Music2, QrCode, Search, Check, RefreshCw,
  Mail, Phone, Disc, Image as ImageIcon, ExternalLink,
  Camera, CameraOff, Sparkles, ChevronRight, Eye, AlertTriangle
} from 'lucide-react';
import jsQR from 'jsqr';
import { getAllTickets, getTicketByTxnOrId, decodeVerificationPayload, updateTicketStatus } from '../utils/ticketStore';

export default function AdminTicketVerifierModal({ initialTxnId, initialPayload, onClose }) {
  const [viewMode, setViewMode] = useState(initialTxnId || initialPayload ? 'DETAILS' : 'SCANNER');
  const [cameraState, setCameraState] = useState('PROMPT'); // 'PROMPT', 'STARTING', 'SCANNING', 'DENIED', 'ERROR'
  const [cameraError, setCameraError] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialTxnId || '');
  const [activeTicket, setActiveTicket] = useState(null);
  const [allTickets, setAllTickets] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Play audio chime for scanner beep
  const playBeep = (freq = 880) => {
    try {
      if (!audioCtxRef.current) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtxRef.current = new AudioClass();
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (!audioCtxRef.current) return;

      const now = audioCtxRef.current.currentTime;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  };

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Load ticket data on mount or when search changes
  useEffect(() => {
    const list = getAllTickets();
    setAllTickets(list);

    let found = null;
    if (initialTxnId) {
      found = getTicketByTxnOrId(initialTxnId);
    }

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

    if (found) {
      setActiveTicket(found);
      setSearchQuery(found.utrNumber || found.transactionId);
      setViewMode('DETAILS');
    }
  }, [initialTxnId, initialPayload]);

  // Request user camera permission and start streaming
  const handleConfirmStartCamera = async () => {
    setCameraState('STARTING');
    setCameraError('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API is not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Back camera preferred on phones
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraState('SCANNING');
        startScanLoop();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      stopCamera();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('DENIED');
        setCameraError('Camera permission was denied. You can allow camera in browser settings or search manually below.');
      } else {
        setCameraState('ERROR');
        setCameraError(err.message || 'Unable to start camera.');
      }
    }
  };

  // Continuous frame scanning loop with jsQR
  const startScanLoop = () => {
    const scan = () => {
      if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        animFrameRef.current = requestAnimationFrame(scan);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (qrCode && qrCode.data) {
        handleQrDetected(qrCode.data);
        return;
      }

      animFrameRef.current = requestAnimationFrame(scan);
    };

    animFrameRef.current = requestAnimationFrame(scan);
  };

  // Handle detected QR Code string
  const handleQrDetected = (dataString) => {
    stopCamera();
    playBeep(987.77); // Success beep chime
    if (navigator.vibrate) navigator.vibrate([60, 40, 80]);

    let detectedTxn = dataString.trim();
    let detectedData = null;

    // Check if the QR code is a full verification URL
    if (dataString.includes('?') && dataString.includes('verify=')) {
      try {
        const url = new URL(dataString, window.location.origin);
        detectedTxn = url.searchParams.get('verify') || detectedTxn;
        detectedData = url.searchParams.get('data');
      } catch {
        const match = dataString.match(/verify=([^&]+)/);
        if (match) detectedTxn = match[1];
        const dataMatch = dataString.match(/data=([^&]+)/);
        if (dataMatch) detectedData = dataMatch[1];
      }
    }

    let found = getTicketByTxnOrId(detectedTxn);

    if (!found && detectedData) {
      const decoded = decodeVerificationPayload(detectedData);
      if (decoded) {
        found = {
          transactionId: decoded.txn,
          utrNumber: decoded.utr || decoded.txn,
          ticketId: 'TKT-LIVE-SCANNED',
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

    if (found) {
      setActiveTicket(found);
      setSearchQuery(found.utrNumber || found.transactionId);
      setViewMode('DETAILS');
    } else {
      // Create instant fallback ticket with the scanned ID
      const fallback = {
        transactionId: detectedTxn,
        utrNumber: detectedTxn,
        ticketId: 'TKT-LIVE-SCANNED',
        mainPerson: 'Gate Scanned Attendee',
        otherMembers: [],
        memberCount: 1,
        audienceCategory: 'Artist',
        instrument: 'Artist',
        recommendedSong: 'Acoustic Jam',
        email: '',
        phone: '',
        handle: '',
        bookedAtFormatted: new Date().toLocaleString(),
        status: 'Confirmed'
      };
      setActiveTicket(fallback);
      setSearchQuery(detectedTxn);
      setViewMode('DETAILS');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getTicketByTxnOrId(searchQuery.trim());
    setActiveTicket(found);
    setViewMode('DETAILS');
  };

  const handleSelectTicket = (ticket) => {
    stopCamera();
    setActiveTicket(ticket);
    setSearchQuery(ticket.utrNumber || ticket.transactionId);
    setViewMode('DETAILS');
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

  const handleOpenScanner = () => {
    setActiveTicket(null);
    setViewMode('SCANNER');
    setCameraState('PROMPT');
  };

  const isCheckedIn = activeTicket?.status === 'Checked In';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={() => {
          stopCamera();
          onClose();
        }}
      />

      <div className="relative w-full max-w-2xl my-6 bg-gradient-to-b from-[#16122c] via-dusk-900 to-[#100d20] border-2 border-emerald-500/40 rounded-[28px] sm:rounded-[36px] shadow-[0_25px_90px_rgba(16,185,129,0.35)] overflow-hidden text-left z-10 max-h-[92vh] flex flex-col">
        
        {/* Top Glowing Security Scanner Strip */}
        <div className="shrink-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500" />

        {/* Close Button */}
        <button 
          onClick={() => {
            stopCamera();
            onClose();
          }} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  GATE CHECK-IN SYSTEM
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Live Camera QR Scanner
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {viewMode === 'DETAILS' ? (
                <button
                  onClick={handleOpenScanner}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Scan Next QR</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  Scanner Active
                </span>
              )}
            </div>
          </div>

          {/* VIEW MODE 1: LIVE CAMERA QR SCANNER */}
          {viewMode === 'SCANNER' && (
            <div className="space-y-4">
              
              {/* Permission Confirmation Screen (Asked first from user) */}
              {cameraState === 'PROMPT' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                    <Camera className="w-8 h-8 animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white font-display">
                      Confirm Camera Access
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                      Jam Junction Gate Scanner requires permission to use your camera to scan and authenticate attendee QR entry passes in real time.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 max-w-md mx-auto flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Your video stream runs strictly on-device in your browser. No camera video is recorded or stored.</span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <button
                      onClick={handleConfirmStartCamera}
                      className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Allow Camera & Scan</span>
                    </button>

                    <button
                      onClick={() => setViewMode('DETAILS')}
                      className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-sm transition-all"
                    >
                      Manual Search
                    </button>
                  </div>
                </div>
              )}

              {/* Starting Camera Spinner */}
              {cameraState === 'STARTING' && (
                <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10 space-y-3">
                  <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-white">Starting device camera...</p>
                  <p className="text-xs text-gray-400">Please click "Allow" if prompted by your browser</p>
                </div>
              )}

              {/* Live Camera Viewfinder & Laser HUD */}
              {cameraState === 'SCANNING' && (
                <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.3)] bg-black aspect-video sm:aspect-[4/3] max-h-[420px] flex items-center justify-center">
                  
                  {/* Real Live Video Feed */}
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover" 
                    playsInline 
                    muted 
                  />

                  {/* Hidden Canvas for QR Frame Analysis */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* High-tech Viewfinder HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
                    
                    {/* Top status indicator */}
                    <div className="px-3.5 py-1 rounded-full bg-black/75 border border-emerald-500/50 backdrop-blur-md text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>CAMERA LIVE • POSITION QR CODE IN SQUARE</span>
                    </div>

                    {/* Central Target Square with Animated Scanning Laser */}
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-emerald-400/80 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                      
                      {/* Corner Target Markers */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400" />

                      {/* Moving Laser Beam */}
                      <div 
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-laser"
                        style={{
                          animation: 'laser-scan 2s ease-in-out infinite alternate'
                        }}
                      />
                    </div>

                    {/* Bottom instructions */}
                    <div className="text-[11px] text-white/90 bg-black/70 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                      Hold attendee ticket QR code steady in front of camera
                    </div>
                  </div>

                  {/* Stop Camera Button */}
                  <button
                    onClick={() => {
                      stopCamera();
                      setCameraState('PROMPT');
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all z-20 pointer-events-auto"
                    title="Stop Camera"
                  >
                    <CameraOff className="w-4 h-4" />
                  </button>

                </div>
              )}

              {/* Denied / Error State */}
              {(cameraState === 'DENIED' || cameraState === 'ERROR') && (
                <div className="p-6 rounded-3xl bg-rose-950/30 border border-rose-500/40 text-center space-y-3">
                  <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Camera Access Not Available</h4>
                  <p className="text-xs text-rose-300 max-w-md mx-auto">{cameraError}</p>
                  
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={handleConfirmStartCamera}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                    >
                      Try Camera Again
                    </button>
                    <button
                      onClick={() => setViewMode('DETAILS')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                    >
                      Use Manual UTR Search
                    </button>
                  </div>
                </div>
              )}

              {/* Laser animation style */}
              <style>{`
                @keyframes laser-scan {
                  0% { top: 5%; }
                  100% { top: 92%; }
                }
              `}</style>

            </div>
          )}

          {/* Quick Search & Barcode Lookup Bar */}
          <form onSubmit={handleSearch} className="relative my-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Or type UTR Number, Transaction ID, or Attendee Name"
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

          {/* VIEW MODE 2: VERIFICATION DETAILS DISPLAY */}
          {viewMode === 'DETAILS' && activeTicket && (
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
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center gap-1">
                    <span>👑 {activeTicket.mainPerson}</span>
                    <span className="text-[10px] text-cyan-400">(Primary)</span>
                  </span>

                  {Array.isArray(activeTicket.otherMembers) && activeTicket.otherMembers.map((name, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-gray-200 text-xs">
                      #{i + 2} {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Transaction / UTR Number & Booking Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Transaction / UTR Number</span>
                  </span>
                  <div className="text-xs sm:text-sm font-mono font-bold text-amber-300 select-all truncate">
                    {activeTicket.utrNumber || activeTicket.transactionId}
                  </div>
                </div>

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
                        Click image to cross-verify UTR & payment amount
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-white/5 text-xs text-gray-400 italic flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>No screenshot uploaded (Walk-in entry). Check UTR manually.</span>
                  </div>
                )}
              </div>

              {/* 5. Recommended Song & Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block flex items-center gap-1">
                    <Disc className="w-3.5 h-3.5 text-pink-400" />
                    <span>Recommended Song</span>
                  </span>
                  <p className="text-gray-200 font-semibold truncate">
                    {activeTicket.recommendedSong || activeTicket.songRequest || 'None submitted'}
                  </p>
                </div>

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
                  </div>
                </div>
              </div>

              {/* Actions: Admit Button & Scan Next */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
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

                <button
                  onClick={handleOpenScanner}
                  className="py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan Next Ticket</span>
                </button>
              </div>

            </div>
          )}

          {/* Recent Registrations Quick Selector */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-xs font-mono uppercase text-gray-400 block mb-3">
              Recent Registrations (Quick Verify)
            </span>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
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
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
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
