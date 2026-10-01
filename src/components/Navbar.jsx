import React, { useState, useEffect } from 'react';
import { Music2, Ticket, Sparkles, Menu, X, Radio, ArrowRight, QrCode } from 'lucide-react';

export default function Navbar({ onRSVPClick, onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position to enhance navbar transparency and shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Event', href: '#jam-junction' },
    { label: 'Jam Pad', href: '#jam-pad' },
    { label: 'Visual Diary', href: '#gallery' },
    { label: 'Team Members', href: '#team-members' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dusk-900/90 backdrop-blur-xl border-b border-violet-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.7)] py-3' 
          : 'bg-dusk-900/60 backdrop-blur-md border-b border-white/10 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Live Status */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className="flex items-center gap-2.5 group cursor-pointer"
              title="reson.at Jam Junction"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-600 to-amber-500 p-0.5 shadow-md shadow-violet-600/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-dusk-900 rounded-[10px] flex items-center justify-center">
                  <Music2 className="text-amber-400 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-amber-400 transition-all">
                  reson.at
                </span>
              </div>
            </a>

            {/* Live Weekend Status Indicator Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>JAM WEEKEND LIVE</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-lg shadow-inner">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="relative px-3.5 py-1.5 rounded-full text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 group overflow-hidden"
              >
                <span className="relative z-10">{link.label}</span>
                {/* Hover subtle glowing background */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200 -z-0" />
              </a>
            ))}

            <a 
              href="https://www.instagram.com/reson.at" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3.5 py-1.5 rounded-full text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>@reson.at</span>
            </a>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-1 rounded-full text-xs font-bold text-violet-300 bg-violet-500/10 hover:bg-violet-500/25 border border-violet-500/30 transition-all ml-1 flex items-center gap-1.5"
                title="Open Admin Registration Dashboard"
              >
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Action Button: Eye-Catching Flashing "Book Tickets" Button */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onRSVPClick}
              className="relative group overflow-hidden px-6 py-2.5 sm:px-7 sm:py-3 rounded-full font-black text-white text-sm sm:text-base tracking-wide transition-all transform active:scale-95 animate-ticket-flash bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:opacity-95"
              style={{
                color: '#FFFFFF', // Guaranteed pure white font
              }}
              title="Click to Book Your Tickets"
            >
              {/* Sweeping Shimmer Beam Animation passing across the button */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none animate-shimmer-sweep" />

              {/* Button content */}
              <span className="relative z-10 flex items-center gap-2 font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                <Ticket className="w-4 h-4 text-white fill-white/20 animate-bounce" style={{ animationDuration: '2s' }} />
                <span>Book Tickets</span>
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-4 pb-5 px-4 rounded-2xl bg-dusk-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-base font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </a>
            ))}

            <a
              href="https://www.instagram.com/reson.at"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-base font-semibold text-amber-400 hover:bg-white/10 transition-colors"
            >
              Follow @reson.at on Instagram
            </a>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/30 flex items-center justify-between hover:bg-violet-500/20 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  <span>Admin Panel & Tracker</span>
                </span>
                <span className="text-xs bg-violet-500/20 px-2 py-0.5 rounded-full text-violet-300 font-bold">Portal</span>
              </button>
            )}

            {/* Mobile Flashing Book Tickets Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRSVPClick();
              }}
              className="w-full mt-2 py-3 rounded-full font-black text-white text-base tracking-wide relative overflow-hidden animate-ticket-flash bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 flex items-center justify-center gap-2"
              style={{ color: '#FFFFFF' }}
            >
              <Ticket className="w-5 h-5 text-white" />
              <span>Book Tickets Now</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
