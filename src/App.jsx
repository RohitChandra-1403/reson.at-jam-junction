import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollGuitarAnimation from './components/ScrollGuitarAnimation';
import GsapAmbientEffects from './components/GsapAmbientEffects';
import VirtualJamPad from './components/VirtualJamPad';
import JamJunctionEvent from './components/JamJunctionEvent';
import RSVPModal from './components/RSVPModal';
import CommunityGallery from './components/CommunityGallery';
import TeamMembers from './components/TeamMembers';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dusk-900 text-gray-100 overflow-x-hidden selection:bg-violet-500 selection:text-white relative">
      <GsapAmbientEffects />
      <Navbar onRSVPClick={() => setIsRSVPModalOpen(true)} />
      <ScrollGuitarAnimation />
      <main>
        <Hero onRSVPClick={() => setIsRSVPModalOpen(true)} />
        <JamJunctionEvent />
        <VirtualJamPad />
        <CommunityGallery />
        <TeamMembers />
        <FAQ />
      </main>
      <Footer />
      {isRSVPModalOpen && <RSVPModal onClose={() => setIsRSVPModalOpen(false)} />}
    </div>
  );
}

export default App;
