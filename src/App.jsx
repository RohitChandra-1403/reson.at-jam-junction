import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollGuitarAnimation from './components/ScrollGuitarAnimation';
import GsapAmbientEffects from './components/GsapAmbientEffects';
import VirtualJamPad from './components/VirtualJamPad';
import JamJunctionEvent from './components/JamJunctionEvent';
import RSVPModal from './components/RSVPModal';
import AdminTicketVerifierModal from './components/AdminTicketVerifierModal';
import AdminPanel from './components/AdminPanel';
import CommunityGallery from './components/CommunityGallery';
import AnonymousChat from './components/AnonymousChat';
import TeamMembers from './components/TeamMembers';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { ShieldCheck, QrCode, LayoutDashboard } from 'lucide-react';

function App() {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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

    // Ensure page refresh always starts cleanly at the top if no hash link
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
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
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
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
      <Footer onOpenAdmin={() => setIsAdminPanelOpen(true)} />

      {/* Floating Admin Controls Quick Dock (Bottom-Left) */}
      <div className="fixed bottom-3.5 left-3.5 sm:bottom-6 sm:left-6 z-40 flex items-center gap-1.5 sm:gap-2">
        {/* Admin Dashboard Button */}
        <button
          onClick={() => setIsAdminPanelOpen(true)}
          className="p-2 sm:px-4 sm:py-2.5 rounded-full bg-dusk-900/90 hover:bg-violet-950/90 border border-violet-500/40 text-violet-300 hover:text-white text-xs font-bold shadow-[0_8px_25px_rgba(139,92,246,0.3)] backdrop-blur-md transition-all flex items-center gap-2 group hover:scale-105"
          title="Open Admin Registration Tracker Dashboard"
          aria-label="Open Admin Panel"
        >
          <span className="p-1 rounded-full bg-violet-500/20 group-hover:bg-violet-500/40 text-violet-300">
            <LayoutDashboard className="w-3.5 h-3.5" />
          </span>
          <span className="hidden sm:inline">Admin Panel</span>
        </button>

        {/* Quick QR Scanner Button */}
        <button
          onClick={() => setIsVerifierOpen(true)}
          className="p-2 sm:p-2.5 rounded-full bg-dusk-900/90 hover:bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 shadow-[0_8px_25px_rgba(16,185,129,0.3)] backdrop-blur-md transition-all hover:scale-105"
          title="Open Gate QR Camera Scanner"
          aria-label="Open QR Scanner"
        >
          <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

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

      {/* Admin Registrations Tracker Panel */}
      {isAdminPanelOpen && (
        <AdminPanel
          onClose={() => setIsAdminPanelOpen(false)}
          onOpenScanner={() => setIsVerifierOpen(true)}
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

      {/* Anonymous Community Chat Dialog ("Connect, Create, Resonate") */}
      {isChatOpen && (
        <AnonymousChat onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
}

export default App;
