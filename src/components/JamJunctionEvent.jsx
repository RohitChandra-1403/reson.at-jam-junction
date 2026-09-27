import React from 'react';
import { Mic2, Guitar, CircleDashed, Users } from 'lucide-react';

export default function JamJunctionEvent() {
  const features = [
    { icon: <CircleDashed className="w-8 h-8 text-amber-500" />, title: "The Icebreaker Warmup", desc: "Start the night with easy singalongs to break the ice and tune our voices together." },
    { icon: <Guitar className="w-8 h-8 text-violet-500" />, title: "Indie Acoustic Circle", desc: "Pass the aux, or rather, the spotlight. Share your original tunes or favorite indie covers." },
    { icon: <Mic2 className="w-8 h-8 text-sunset-500" />, title: "Genre Crossroads", desc: "Where jazz meets folk, and pop meets soul. Spontaneous mashups and unexpected harmonies." },
    { icon: <Users className="w-8 h-8 text-white" />, title: "Grand Singalong", desc: "The epic finale where everyone joins in. No pressure, just pure musical connection." }
  ];

  return (
    <section id="jam-junction" className="py-24 bg-black/40 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">What is <span className="text-amber-500">Jam Junction?</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A zero-pressure jam floor. Spontaneous acoustic circles, unplugged harmonies, and a space where every note belongs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-panel p-8 hover:bg-white/10 transition-colors group">
              <div className="bg-dusk-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-violet-900/40 to-amber-900/20 border border-white/10 text-center">
          <h3 className="text-2xl font-bold mb-4">Bring Your Instrument (Or Just Yourself)</h3>
          <p className="text-gray-300">
            Guitars, Ukuleles, Keyboards, Percussion/Cajon, Flutes, Vocals, or just clapping along. 
            All skill levels are welcome. It's about the vibe, not the virtuosity.
          </p>
        </div>
      </div>
    </section>
  );
}
