import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollGuitarAnimation from './components/ScrollGuitarAnimation';
import GsapAmbientEffects from './components/GsapAmbientEffects';
import VirtualJamPad from './components/VirtualJamPad';
import JamJunctionEvent from './components/JamJunctionEvent';
import RSVPModal from './components/RSVPModal';
import AdminTicketVerifierModal from './components/AdminTicketVerifierModal';
import CommunityGallery from './components/CommunityGallery';
import TeamMembers from './components/TeamMembers';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { ShieldCheck, QrCode } from 'lucide-react';

function App() {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [verifierTxnId, setVerifierTxnId] = useState('');
  const [verifierPayload, setVerifierPayload] = useState('');

  // Check if page was loaded via a QR code camera scan (contains ?verify=TXN-... or ?data=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const verifyTxn = params.get('verify');
      const verifyData = params.get('data');

      if (verifyTxn || verifyData) {
        setVerifierTxnId(verifyTxn || '');
        setVerifierPayload(verifyData || '');
        setIsVerifierOpen(true);
      }
    } catch (err) {
      console.error('Error parsing verification query params:', err);
    }
  }, []);

  const handleCloseVerifier = () => {
    setIsVerifierOpen(false);
    // Clean URL query params without reloading
    if (window.history && window.history.replaceState && window.location.search) {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  };

  return (
    <div className="min-h-screen bg-dusk-900 text-gray-100 overflow-x-hidden selection:bg-violet-500 selection:text-white relative">
      <GsapAmbientEffects />
      <Navbar 
        onRSVPClick={() => setIsRSVPModalOpen(true)} 
        onOpenAdmin={() => setIsVerifierOpen(true)}
      />
      <ScrollGuitarAnimation />
      <main>
        <Hero onRSVPClick={() => setIsRSVPModalOpen(true)} />
        <JamJunctionEvent />
        <VirtualJamPad />
        <CommunityGallery />
        <TeamMembers />
        <FAQ />
      </main>
      <Footer onOpenAdmin={() => setIsVerifierOpen(true)} />

      {/* Floating Admin Scanner Quick Access Trigger */}
      <button
        onClick={() => setIsVerifierOpen(true)}
        className="fixed bottom-6 left-6 z-40 px-3.5 py-2 rounded-full bg-dusk-900/80 hover:bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-bold shadow-[0_4px_20px_rgba(16,185,129,0.25)] backdrop-blur-md transition-all flex items-center gap-2 group hover:scale-105"
        title="Admin Entry Verification Portal"
      >
        <span className="p-1 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30">
          <QrCode className="w-3.5 h-3.5" />
        </span>
        <span>Admin Scanner</span>
      </button>

      {/* Ticket Booking Modal */}
      {isRSVPModalOpen && (
        <RSVPModal 
          onClose={() => setIsRSVPModalOpen(false)} 
          onOpenVerifier={(txnId) => {
            setVerifierTxnId(txnId);
            setIsVerifierOpen(true);
          }}
        />
      )}

      {/* Admin QR Code Verification & Check-in Modal */}
      {isVerifierOpen && (
        <AdminTicketVerifierModal
          initialTxnId={verifierTxnId}
          initialPayload={verifierPayload}
          onClose={handleCloseVerifier}
        />
      )}
    </div>
  );
}

export default App;
