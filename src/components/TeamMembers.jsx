import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Music2, Sparkles, Heart, Mic2, Guitar, Headphones, Radio, ExternalLink } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TEAM = [
  {
    id: 1,
    name: "Rohit Chandra",
    role: "Founder & Community Lead",
    instrument: "Vocals & Acoustic Guitar",
    icon: <Guitar className="w-4 h-4 text-amber-400" />,
    bio: "Building the sanctuary where every singer, guitarist, and bathroom artist finds their musical tribe in Bangalore.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=750",
    tags: ["Acoustic", "Circle Host"],
    social: { ig: "https://instagram.com", li: "https://linkedin.com" }
  },
  {
    id: 2,
    name: "Aarav Mehta",
    role: "Acoustic & Audio Curator",
    instrument: "Keys & Sound Engineering",
    icon: <Headphones className="w-4 h-4 text-violet-400" />,
    bio: "Obsessed with natural acoustics, warm room tones, and ensuring every note in the circle is felt deeply.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=750",
    tags: ["Sound Tech", "Rhodes"],
    social: { ig: "https://instagram.com", li: "https://linkedin.com" }
  },
  {
    id: 3,
    name: "Pooja Nair",
    role: "Floor Host & Vocal Lead",
    instrument: "Lead Vocals & Cajon",
    icon: <Mic2 className="w-4 h-4 text-pink-400" />,
    bio: "The voice that breaks the ice, leads four-part harmonies, and gets even the shyest listeners clapping along.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=750",
    tags: ["Harmonies", "Icebreakers"],
    social: { ig: "https://instagram.com", li: "https://linkedin.com" }
  },
  {
    id: 4,
    name: "Devika Sharma",
    role: "Creative Director & Visuals",
    instrument: "Violin & Photography",
    icon: <Radio className="w-4 h-4 text-emerald-400" />,
    bio: "Documenting raw emotions, candid smiles, and timeless frames from our weekend jam sessions.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&h=750",
    tags: ["Visuals", "Violin"],
    social: { ig: "https://instagram.com", li: "https://linkedin.com" }
  }
];

export default function TeamMembers() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  // GSAP Scroll Animation using IntersectionObserver + GSAP Timelines
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Animate Header
            tl.fromTo(
              headerRef.current.children,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }
            );

            // Animate Cards with dynamic 3D back bounce & stagger
            tl.fromTo(
              cardsRef.current,
              { y: 70, opacity: 0, scale: 0.88, rotateX: 10 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotateX: 0,
                duration: 0.9,
                stagger: 0.14,
                ease: 'back.out(1.4)'
              },
              '-=0.4'
            );
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Card Interactive Hover with GSAP
  const handleMouseEnter = (idx) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    gsap.to(card, {
      y: -10,
      scale: 1.02,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (idx) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  return (
    <section 
      id="team-members" 
      ref={sectionRef} 
      className="py-24 bg-dusk-900 relative overflow-hidden select-none border-t border-white/5"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
        <div className="w-[850px] h-[550px] bg-violet-600/35 rounded-full blur-[160px]" />
        <div className="w-[600px] h-[400px] bg-amber-500/20 rounded-full blur-[140px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>The Humans Behind The Music</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-amber-300 to-sunset-500">Core Crew</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mt-3 font-medium">
            Musicians, curators, and soul-seekers dedicated to making every Jam Junction unforgettable.
          </p>
        </div>

        {/* GSAP Animated Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM.map((member, idx) => (
            <div
              key={member.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
              className="group relative rounded-[28px] overflow-hidden bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-5 shadow-2xl backdrop-blur-xl transition-colors hover:border-violet-500/50 flex flex-col justify-between"
            >
              {/* Member Image Card */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-dusk-900 border border-white/10">
                <img 
                  src={member.img} 
                  alt={member.name}
                  className="w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.05] group-hover:scale-105 transition-transform duration-700" 
                />

                {/* Dark gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

                {/* Instrument Chip Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white">
                    {member.icon}
                    <span>{member.instrument.split('&')[0]}</span>
                  </span>
                </div>

                {/* Tags on photo */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {member.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-md text-[10px] font-semibold text-gray-200 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio & Details */}
              <div className="text-left flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider mt-0.5 mb-2.5">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal line-clamp-3">
                    {member.bio}
                  </p>
                </div>

                {/* Social Connect Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400/30" />
                    <span>Jam Fam</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={member.social.ig}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-violet-600 hover:text-white text-gray-300 flex items-center justify-center transition-all text-xs"
                      aria-label={`${member.name} Instagram`}
                    >
                      <InstagramIcon />
                    </a>
                    <a
                      href={member.social.li}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-violet-600 hover:text-white text-gray-300 flex items-center justify-center transition-all text-xs"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <LinkedinIcon />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Join The Crew Callout */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md">
            <span>Want to volunteer, host an acoustic session, or join the team?</span>
            <a 
              href="https://www.instagram.com/reson.at" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 font-bold hover:underline"
            >
              DM @reson.at →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
