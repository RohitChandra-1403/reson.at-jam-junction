import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, Sparkles, ExternalLink } from 'lucide-react';
import heroCommunityImg from '../assets/hero-reson-jam.jpg';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Jam Junction Family",
    subtitle: "50+ creators united at Reson@ lounge",
    category: "Jam Fam",
    img: heroCommunityImg,
    isCommunityPhoto: true,
    isVideo: false,
    tag: "🔴 Live from Bangalore Lounge"
  },
  {
    id: 2,
    title: "Acoustic Sunset Chords",
    subtitle: "Fingerpicking melodies & original songs",
    category: "Acoustic Circles",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=900&h=1200",
    isVideo: false,
    tag: "Acoustic Vibing"
  },
  {
    id: 3,
    title: "Vocal Crossroads",
    subtitle: "Raw unplugged four-part harmonies",
    category: "Harmonies",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=900&h=1200",
    isVideo: true,
    tag: "Soulful Vocals"
  },
  {
    id: 4,
    title: "The Cajon Drop",
    subtitle: "Rhythmic pulses that set the room bouncing",
    category: "Cajon & Beats",
    img: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=900&h=1200",
    isVideo: false,
    tag: "Rhythm & Percussion"
  },
  {
    id: 5,
    title: "Midnight Unplugged",
    subtitle: "When the lights dim and the magic strikes",
    category: "Late Night",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=900&h=1200",
    isVideo: true,
    tag: "Late Jam Sessions"
  },
  {
    id: 6,
    title: "Circle of Stories",
    subtitle: "Laughter, lyrics, and shared memories",
    category: "Jam Fam",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=900&h=1200",
    isVideo: false,
    tag: "Community Bonds"
  }
];

const CATEGORIES = ["All Moments", "Jam Fam", "Acoustic Circles", "Harmonies", "Cajon & Beats", "Late Night"];

export default function CommunityGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Moments");
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startXRef = useRef(0);
  const currentDragRef = useRef(0);
  const containerRef = useRef(null);

  // Filter items based on active category
  const filteredItems = selectedCategory === "All Moments" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  const total = filteredItems.length;

  // Keep active index within bounds
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  // --- Touch & Mouse drag handlers for mobile & desktop swiping ---
  const handleTouchStart = (e) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    currentDragRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    currentDragRef.current = diff;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 45; // Minimum swipe distance in px
    if (currentDragRef.current > threshold) {
      handlePrev();
    } else if (currentDragRef.current < -threshold) {
      handleNext();
    }
    setDragOffset(0);
    currentDragRef.current = 0;
  };

  // Mouse drag support
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentDragRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    currentDragRef.current = diff;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 50;
    if (currentDragRef.current > threshold) {
      handlePrev();
    } else if (currentDragRef.current < -threshold) {
      handleNext();
    }
    setDragOffset(0);
    currentDragRef.current = 0;
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  return (
    <section id="gallery" className="py-24 bg-dusk-900 relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[850px] h-[500px] bg-violet-600/30 rounded-full blur-[140px]"></div>
        <div className="w-[500px] h-[400px] bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Glass/White Card Container matching Dribbble inspiration */}
        <div className="bg-white text-gray-900 rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.4)] border border-white/80 p-6 sm:p-10 md:p-14 overflow-hidden relative backdrop-blur-xl">
          
          {/* Header Block */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-block text-xs font-extrabold tracking-[0.25em] text-violet-700 uppercase mb-2">
              GALLERY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight">
              My Visual Diary
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 font-medium">
              See the world through our lens: adventures, soulful chords, and moments in photos and videos
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6 sm:mt-8">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-black text-white shadow-md shadow-black/20 scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200/60'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}

              <a
                href="https://www.instagram.com/reson.at"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:border-black hover:text-black transition-all flex items-center gap-1.5"
              >
                <span>View More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 3D Coverflow Carousel Container with Touch & Drag */}
          <div 
            ref={containerRef}
            className="relative h-[360px] sm:h-[430px] md:h-[480px] w-full flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {filteredItems.map((item, idx) => {
              // Calculate relative offset from active index
              let offset = idx - activeIndex;

              // Handle cyclic wrap around if desired, or clamped
              const isActive = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;
              const isFarPrev = offset === -2;
              const isFarNext = offset === 2;

              // Hide cards too far out
              if (Math.abs(offset) > 2) return null;

              // Compute horizontal shift in px + real-time drag offset
              let translateX = offset * 210 + (isDragging ? dragOffset * 0.75 : 0);
              let scale = 1;
              let zIndex = 20;
              let opacity = 1;
              let rotateY = 0;

              if (isActive) {
                scale = 1.15; // Center photo POP OUT effect
                zIndex = 35;
                opacity = 1;
                rotateY = isDragging ? dragOffset * 0.05 : 0;
              } else if (isPrev) {
                scale = 0.9;
                zIndex = 25;
                opacity = 0.85;
                translateX = -180 + (isDragging ? dragOffset * 0.75 : 0);
                rotateY = 12;
              } else if (isNext) {
                scale = 0.9;
                zIndex = 25;
                opacity = 0.85;
                translateX = 180 + (isDragging ? dragOffset * 0.75 : 0);
                rotateY = -12;
              } else if (isFarPrev) {
                scale = 0.75;
                zIndex = 15;
                opacity = 0.45;
                translateX = -320 + (isDragging ? dragOffset * 0.75 : 0);
                rotateY = 22;
              } else if (isFarNext) {
                scale = 0.75;
                zIndex = 15;
                opacity = 0.45;
                translateX = 320 + (isDragging ? dragOffset * 0.75 : 0);
                rotateY = -22;
              }

              return (
                <div
                  key={item.id}
                  onClick={() => !isActive && setActiveIndex(idx)}
                  className={`absolute top-1/2 left-1/2 w-[220px] sm:w-[280px] md:w-[320px] aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden select-none cursor-pointer transition-all ${
                    isDragging ? 'duration-75' : 'duration-500 ease-out'
                  } ${
                    isActive 
                      ? 'shadow-[0_25px_60px_rgba(0,0,0,0.45)] ring-4 ring-white/90' 
                      : 'shadow-lg hover:opacity-95'
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${translateX}px, 0, 0) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
                    zIndex,
                    opacity,
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
                    draggable="false"
                  />

                  {/* Gradient Scrim for readable badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white tracking-wide border border-white/20">
                      {item.tag}
                    </span>
                  </div>

                  {/* Center Pop-out Video Play Icon */}
                  {item.isVideo && (
                    <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  )}

                  {/* Bottom Captions (Active Pop-Out card has rich details) */}
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none text-left">
                    <h3 className="text-white font-black text-base sm:text-lg leading-snug drop-shadow-md">
                      {item.title}
                    </h3>
                    {isActive && (
                      <p className="text-gray-300 text-xs sm:text-sm mt-0.5 line-clamp-1 font-medium transition-opacity duration-300">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Bottom Arrow Controls matching Dribbble mockup */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 hover:border-black bg-white text-gray-800 hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Previous photo"
              aria-label="Previous photo"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Pagination indicator dots */}
            <div className="flex items-center gap-1.5 px-3">
              {filteredItems.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dotIdx === activeIndex 
                      ? 'w-6 bg-black' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 hover:border-black bg-white text-gray-800 hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Next photo"
              aria-label="Next photo"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Swipe Hint for Mobile / Touch Users */}
          <div className="text-center mt-3">
            <span className="text-[11px] text-gray-400 font-medium tracking-wide flex items-center justify-center gap-1.5">
              <span>👈 Drag or swipe with finger to pop photos 👉</span>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
