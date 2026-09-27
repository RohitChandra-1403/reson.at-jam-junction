import React from 'react';
import { Music2 } from 'lucide-react';

export default function Navbar({ onRSVPClick }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-dusk-900/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 cursor-pointer">
            <Music2 className="text-violet-500 w-8 h-8" />
            <span className="font-bold text-2xl tracking-tighter text-white">reson.at</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#jam-junction" className="text-gray-300 hover:text-amber-500 transition-colors text-sm font-medium uppercase tracking-wide">The Event</a>
            <a href="#jam-pad" className="text-gray-300 hover:text-amber-500 transition-colors text-sm font-medium uppercase tracking-wide">Jam Pad</a>
            <a href="#gallery" className="text-gray-300 hover:text-amber-500 transition-colors text-sm font-medium uppercase tracking-wide">Gallery</a>
            <a href="https://www.instagram.com/reson.at" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-violet-500 transition-colors text-sm font-medium uppercase tracking-wide">IG</a>
          </div>
          <div>
            <button onClick={onRSVPClick} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-violet-500/30">
              RSVP NOW
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
