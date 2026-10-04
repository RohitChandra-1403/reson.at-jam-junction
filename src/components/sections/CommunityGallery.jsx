import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ExternalLink, X, ChevronLeft, ChevronRight, Image as ImageIcon, Camera } from 'lucide-react';
import heroCommunityImg from '@/assets/images/hero-reson-jam.jpg';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Jam Junction Family",
    subtitle: "50+ creators united at Reson@ lounge circle in Bangalore",
    category: "Jam Fam",
    img: heroCommunityImg,
    isVideo: false,
    aspect: "aspect-[4/3]"
  },
  {
    id: 2,
    title: "Acoustic Sunset Chords",
    subtitle: "Raw acoustic fingerpicking and soulful melodies",
    category: "Acoustic Circles",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=900&h=1200",
    isVideo: false,
    aspect: "aspect-[3/4]"
  },
  {
    id: 3,
    title: "Vocal Crossroads",
    subtitle: "Spontaneous four-part harmonies and mashups",
    category: "Harmonies",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=900&h=900",
    isVideo: true,
    aspect: "aspect-square"
  },
  {
    id: 4,
    title: "The Cajon Drop",
    subtitle: "Rhythmic beats and percussion that got the whole room pulsing",
    category: "Cajon & Beats",
    img: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=900&h=1200",
    isVideo: false,
    aspect: "aspect-[3/4]"
  },
  {
    id: 5,
    title: "Midnight Unplugged",
    subtitle: "When the lights dim and spontaneous improvisation begins",
    category: "Late Night",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=900&h=600",
    isVideo: true,
    aspect: "aspect-[16/10]"
  },
  {
    id: 6,
    title: "Circle of Stories",
    subtitle: "Laughter, lyrics, and shared musical memories between sets",
    category: "Jam Fam",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=900&h=1100",
    isVideo: false,
    aspect: "aspect-[4/5]"
  },
  {
    id: 7,
    title: "Strings & Harmonica",
    subtitle: "Soulful indie folk fusion created on the fly",
    category: "Acoustic Circles",
    img: "https://images.unsplash.com/photo-1465225314224-587cd83d322b?auto=format&fit=crop&q=80&w=900&h=900",
    isVideo: false,
    aspect: "aspect-square"
  },
  {
    id: 8,
    title: "All-Room Acoustic Chorus",
    subtitle: "Everyone singing in unison with no microphones needed",
    category: "Harmonies",
    img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=900&h=1200",
    isVideo: true,
    aspect: "aspect-[3/4]"
  }
];

const CATEGORIES = ["All Moments", "Jam Fam", "Acoustic Circles", "Harmonies", "Cajon & Beats", "Late Night"];

export default function CommunityGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All Moments");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Filter items
  const filteredItems = selectedCategory === "All Moments" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-dusk-900 border-t border-white/[0.06] relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. Header Section (Deliberate Type Scale: 44-56px heading, 16-18px subtitle) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Memories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-tight">
            The Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400">Diary</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 mt-3 font-normal leading-relaxed">
            Raw, unfiltered moments from our weekend jam circles. Real people, authentic harmonies.
          </p>
        </div>

        {/* 2. Single-Line Category Filter Bar with Horizontal Scrolling on Mobile */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-2 mb-10 gap-2 sm:gap-2.5 px-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-white text-dusk-900 shadow-md font-bold'
                    : 'bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.12] border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3. Clean Masonry Gallery Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-white/[0.03]"
            >
              {/* Media Image */}
              <div className={`w-full overflow-hidden ${item.aspect}`}>
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Video Play Badge for Video Content */}
              {item.isVideo && (
                <div 
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-violet-600 group-hover:to-pink-500 transition-all"
                  title="Watch Video Clip"
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              )}

              {/* Category Pill Tag */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold border border-white/15">
                  {item.category}
                </span>
              </div>

              {/* Bottom Caption Information */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 pointer-events-none text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-200 mt-1 line-clamp-1 font-normal opacity-90 group-hover:opacity-100 transition-opacity">
                  {item.subtitle}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* 4. Dedicated "View More" Separate Action Area Below Gallery */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Want to see more live clips & stories?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              We update weekly jam reels and artist spotlights on our official channel.
            </p>
          </div>

          <a
            href="https://www.instagram.com/reson.at"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 hover:border-white/40 transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Explore Full Instagram Archive</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </a>
        </div>

      </div>

      {/* 5. Interactive Lightbox Modal */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
            }}
            className="absolute left-3 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hover:scale-110 active:scale-95"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
            }}
            className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hover:scale-110 active:scale-95"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div 
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden max-h-[70vh] border border-white/20 shadow-2xl bg-black">
              <img
                src={activeItem.img}
                alt={activeItem.title}
                className="w-full h-full max-h-[70vh] object-contain"
              />
              {activeItem.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Lightbox Caption & Metadata */}
            <div className="mt-4 text-center max-w-xl">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold border border-white/15">
                {activeItem.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                {activeItem.title}
              </h3>
              <p className="text-sm text-zinc-300 mt-1 font-normal">
                {activeItem.subtitle}
              </p>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
