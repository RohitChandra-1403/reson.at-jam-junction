import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GsapAmbientEffects() {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseBlob1Ref = useRef(null);
  const mouseBlob2Ref = useRef(null);
  const rafMouseRef = useRef(null);

  // Floating musical particles data
  const particles = [
    { symbol: '♪', x: '8%', y: '15%', size: 'text-2xl', color: 'text-violet-400/25' },
    { symbol: '♫', x: '92%', y: '22%', size: 'text-3xl', color: 'text-amber-400/20' },
    { symbol: '✨', x: '18%', y: '45%', size: 'text-xl', color: 'text-pink-400/25' },
    { symbol: '♩', x: '85%', y: '55%', size: 'text-2xl', color: 'text-violet-400/20' },
    { symbol: '♭', x: '6%', y: '72%', size: 'text-3xl', color: 'text-cyan-400/20' },
    { symbol: '♬', x: '90%', y: '82%', size: 'text-2xl', color: 'text-amber-400/25' },
    { symbol: '♪', x: '14%', y: '90%', size: 'text-2xl', color: 'text-violet-400/20' },
    { symbol: '✨', x: '78%', y: '35%', size: 'text-lg', color: 'text-amber-300/30' },
  ];

  useEffect(() => {
    // 1. Continuous GSAP Floating Note Particles Animation (GPU accelerated with will-change)
    particlesRef.current.forEach((el, index) => {
      if (!el) return;
      const duration = 4.5 + (index % 3) * 1.5;
      const yOffset = 25 + (index % 4) * 10;
      const xOffset = 15 + (index % 3) * 8;

      gsap.to(el, {
        y: `-=${yOffset}`,
        x: `+=${xOffset}`,
        rotation: (index % 2 === 0 ? 1 : -1) * (15 + index * 5),
        opacity: (index % 2 === 0 ? 0.3 : 0.15),
        duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.3,
      });
    });

    // 2. Throttled Mouse Parallax on Background Blobs
    let mousePending = false;
    let latestE = null;

    const handleMouseMove = (e) => {
      latestE = e;
      if (!mousePending) {
        mousePending = true;
        rafMouseRef.current = requestAnimationFrame(() => {
          if (latestE) {
            const moveX = (latestE.clientX - window.innerWidth / 2) * 0.03;
            const moveY = (latestE.clientY - window.innerHeight / 2) * 0.03;

            if (mouseBlob1Ref.current) {
              gsap.to(mouseBlob1Ref.current, {
                x: moveX,
                y: moveY,
                duration: 1.5,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            }
            if (mouseBlob2Ref.current) {
              gsap.to(mouseBlob2Ref.current, {
                x: -moveX,
                y: -moveY,
                duration: 1.8,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            }
          }
          mousePending = false;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 3. Acoustic Soundwave Ripple on Click/Tap anywhere on page
    const handleClick = (e) => {
      if (['input', 'textarea', 'select'].includes(e.target?.tagName?.toLowerCase())) return;

      const ripple = document.createElement('div');
      ripple.className = 'fixed pointer-events-none z-[999] rounded-full border border-violet-400/50 will-change-transform';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.transform = 'translate3d(-50%, -50%, 0)';
      ripple.style.width = '12px';
      ripple.style.height = '12px';
      ripple.style.boxShadow = '0 0 12px rgba(139,92,246,0.5)';

      document.body.appendChild(ripple);

      gsap.to(ripple, {
        width: 130,
        height: 130,
        opacity: 0,
        borderWidth: 0.5,
        duration: 0.65,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove();
        }
      });
    };

    window.addEventListener('click', handleClick, { passive: true });

    // 4. Smooth One-Time Section Reveal (Runs once per section to avoid re-triggering jank)
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const headings = entry.target.querySelectorAll('h2, .section-heading');
          if (headings.length > 0) {
            gsap.fromTo(
              headings,
              { y: 25, opacity: 0.8 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
            );
          }
          // Unobserve so it never fires again during ongoing scrolling!
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (rafMouseRef.current) cancelAnimationFrame(rafMouseRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 will-change-transform" 
      aria-hidden="true"
    >
      {/* Hardware-accelerated GPU Ambient Blobs (reduced blur radius for fast 60fps rendering) */}
      <div 
        ref={mouseBlob1Ref}
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[80px] will-change-transform" 
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
      <div 
        ref={mouseBlob2Ref}
        className="absolute bottom-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-amber-500/12 blur-[75px] mix-blend-screen will-change-transform" 
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* Floating Animated Musical Notes */}
      {particles.map((p, idx) => (
        <span
          key={idx}
          ref={(el) => (particlesRef.current[idx] = el)}
          className={`absolute select-none font-bold ${p.size} ${p.color}`}
          style={{
            left: p.x,
            top: p.y,
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
