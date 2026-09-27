import React from 'react';

export default function CommunityGallery() {
  // Mock data for polaroids
  const polaroids = [
    { img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400&h=400", caption: "Late night acoustic circle 🌙", rotation: "-rotate-2" },
    { img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=400&h=400", caption: "Finding harmonies together", rotation: "rotate-3" },
    { img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=400&h=400", caption: "When the cajon drops! 🥁", rotation: "-rotate-1" },
    { img: "https://images.unsplash.com/photo-1471478338271-e9451a37c95b?auto=format&fit=crop&q=80&w=400&h=400", caption: "Soulful vocals from last weekend", rotation: "rotate-2" },
  ];

  return (
    <section id="gallery" className="py-24 bg-dusk-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">The <span className="text-violet-500">Vibe</span> Check</h2>
            <p className="text-gray-400">Moments from past Jam Junctions.</p>
          </div>
          <a 
            href="https://www.instagram.com/reson.at" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Follow @reson.at
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {polaroids.map((item, idx) => (
            <div key={idx} className={`bg-white p-4 pb-16 shadow-xl rounded-sm ${item.rotation} hover:scale-105 hover:rotate-0 transition-all duration-300 relative group`}>
              <div className="aspect-square bg-gray-200 overflow-hidden mb-4">
                <img src={item.img} alt="Jam Session" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <p className="text-dusk-900 font-sans font-medium text-center text-sm absolute bottom-6 w-[calc(100%-2rem)]">{item.caption}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-24 text-center">
          <blockquote className="text-2xl md:text-3xl font-display italic text-gray-300 max-w-3xl mx-auto leading-relaxed">
            "It's not about playing perfectly. It's about playing together. The moment everyone locks into the same groove, that's where the magic happens."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
