import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Music2, Sparkles, Volume2 } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    { 
      q: "Do I need to be a professional or experienced musician?", 
      a: "Absolutely not! Jam Junction is designed specifically as a zero-pressure sanctuary. Whether you only know three chords on an acoustic guitar, sing along in the shower, or play professionally, everyone has a place on our floor." 
    },
    { 
      q: "Should I bring my own instrument or gear?", 
      a: "Yes, bring your instrument if you have one! We always have house acoustic guitars, a cajon, shakers, and a keyboard in the lounge passing around, but bringing your own axe lets you play comfortably anytime." 
    },
    { 
      q: "Can I just come to listen and soak in the vibes?", 
      a: "100%! Half the magic of an acoustic circle is the listeners who clap, snap their fingers, and sing back the choruses. You don't have to touch an instrument to be an essential part of the room." 
    },
    { 
      q: "What genres do we jam at Reson@?", 
      a: "Everything from indie folk and 90s acoustic rock to Bollywood unpluggled, blues progressions, pop singalongs, and spontaneous mashups. Whatever songs people call out in the circle!" 
    },
    { 
      q: "How does the 'Book Tickets' / Backstage Pass work?", 
      a: "Click 'Book Tickets' to reserve your spot on the floor. Once you enter your moniker and instrument/vibe, you'll receive your digital VIP pass to show at the door. Sessions fill up quickly to keep the jam intimate!" 
    }
  ];

  return (
    <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative select-none">
      
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[600px] h-[350px] bg-violet-600/30 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
            <Music2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Musician & Jammer Intel</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Backstage <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-violet-400">FAQ</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-2 font-medium">
            Everything you need to know before stepping onto the jam floor.
          </p>
        </div>

        {/* Music-Styled Accordion Cards with Guitar Pick Toggle */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div 
                key={idx} 
                className={`rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-xl ${
                  isOpen 
                    ? 'bg-gradient-to-r from-white/[0.08] to-white/[0.03] border-violet-500/50 shadow-[0_10px_30px_rgba(139,92,246,0.15)]' 
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Guitar Pick Icon Indicator */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-amber-400 text-black rotate-12 scale-110 shadow-md shadow-amber-400/30' : 'bg-white/10 text-gray-400'
                    }`}>
                      <span className="text-xs font-black">🎸</span>
                    </div>

                    <h3 className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                      isOpen ? 'text-white' : 'text-gray-200 hover:text-white'
                    }`}>
                      {faq.q}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-violet-600/30 text-violet-300 border-violet-500/40' : 'text-gray-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-gray-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                    <p className="pl-11">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
