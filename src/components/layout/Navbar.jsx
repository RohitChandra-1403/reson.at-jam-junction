import React, { useState, useEffect } from 'react';
import { Music2, Ticket, Menu, X, ArrowRight, MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Navbar({ onRSVPClick, onOpenAdmin, onOpenChat }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Event', href: '#jam-junction' },
    { label: 'Jam Pad', href: '#jam-pad' },
    { label: 'Visual Diary', href: '#gallery' },
    { label: 'Team', href: '#team-members' },
  ];

  const secondaryLinks = [
    { label: 'FAQ', href: '#faq' },
    { label: 'Instagram', href: 'https://www.instagram.com/reson.at', external: true },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dusk-900/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] py-3' 
          : 'bg-dusk-900/40 backdrop-blur-md border-b border-white/[0.06] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* 1. Brand Logo */}
          <a 
            href="#" 
            className="flex items-center gap-2.5 group cursor-pointer"
            title="reson.at Jam Junction"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-600 to-amber-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-dusk-900 rounded-[10px] flex items-center justify-center">
                <Music2 className="text-amber-400 w-4.5 h-4.5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
              reson.at
            </span>
          </a>

          {/* 2. Primary Navigation Links (Clean, No Distracting Pill Borders) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors relative py-1 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* 3. Action Group: Subtle Chat Icon + Standout Primary CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Anonymous Messaging Trigger (Clean, unobtrusive with alert indicator) */}
            <button
              onClick={onOpenChat}
              className="relative p-2 rounded-full text-zinc-300 hover:text-amber-300 hover:bg-white/10 transition-colors focus:outline-none"
              title="Anonymous Community Chat"
              aria-label="Open Anonymous Community Chat (4+ messages)"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
            </button>

            {/* Standout Primary Action: Book Tickets */}
            <button 
              onClick={onRSVPClick}
              className="relative group overflow-hidden px-4.5 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-white text-xs sm:text-sm tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-violet-600/30 bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 flex items-center gap-2"
              style={{ color: '#FFFFFF' }}
              title="Click to Book Your Tickets"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none group-hover:animate-shimmer-sweep" />
              <Ticket className="w-4 h-4 text-white fill-white/20" />
              <span>Book Tickets</span>
            </button>

            {/* Responsive Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* 4. Responsive Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-5 px-4 rounded-2xl bg-dusk-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </a>
            ))}

            <div className="h-[1px] bg-white/10 my-1" />

            {/* Secondary Options */}
            {secondaryLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.external && <ExternalLink className="w-3.5 h-3.5 text-amber-400" />}
              </a>
            ))}

            {/* Admin Portal in Mobile Drawer */}
            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full mt-1 py-2 px-3.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between text-left"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                  <span>Admin Panel & Tracker</span>
                </span>
              </button>
            )}

            {/* Mobile Chat Link */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full mt-1 py-2.5 px-4 rounded-xl text-xs font-bold text-amber-300 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Anonymous Chat</span>
              </span>
              <span className="text-[10px] bg-pink-500 text-white font-extrabold px-1.5 py-0.5 rounded-full">
                4+ new
              </span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
