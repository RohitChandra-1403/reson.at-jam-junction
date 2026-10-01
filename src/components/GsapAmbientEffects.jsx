import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GsapAmbientEffects() {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseBlob1Ref = useRef(null);
  const mouseBlob2Ref = useRef(null);

  // Floating musical particles data
  const particles = [
    { symbol: '♪', x: '8%', y: '15%', size: 'text-2xl', color: 'text-violet-400/30' },
    { symbol: '♫', x: '92%', y: '22%', size: 'text-3xl', color: 'text-amber-400/25' },
    { symbol: '✨', x: '18%', y: '45%', size: 'text-xl', color: 'text-pink-400/30' },
    { symbol: '♩', x: '85%', y: '55%', size: 'text-2xl', color: 'text-violet-400/25' },
    { symbol: '♭', x: '6%', y: '72%', size: 'text-3xl', color: 'text-cyan-400/25' },
    { symbol: '♬', x: '90%', y: '82%', size: 'text-2xl', color: 'text-amber-400/30' },
    { symbol: '♪', x: '14%', y: '90%', size: 'text-2xl', color: 'text-violet-400/25' },
    { symbol: '✨', x: '78%', y: '35%', size: 'text-lg', color: 'text-amber-300/35' },
  ];

  useEffect(() => {
    // 1. Continuous GSAP Floating Note Particles Animation
    particlesRef.current.forEach((el, index) => {
      if (!el) return;
      const duration = 4 + (index % 3) * 1.5;
      const yOffset = 25 + (index % 4) * 10;
      const xOffset = 15 + (index % 3) * 8;

      gsap.to(el, {
        y: `-=${yOffset}`,
        x: `+=${xOffset}`,
        rotation: (index % 2 === 0 ? 1 : -1) * (15 + index * 5),
        opacity: (index % 2 === 0 ? 0.35 : 0.2),
        duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.3,
      });
    });

    // 2. Interactive Mouse Parallax on Background Blobs
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.04;
      const moveY = (clientY - window.innerHeight / 2) * 0.04;

      if (mouseBlob1Ref.current) {
        gsap.to(mouseBlob1Ref.current, {
          x: moveX,
          y: moveY,
          duration: 1.8,
          ease: 'power2.out',
        });
      }
      if (mouseBlob2Ref.current) {
        gsap.to(mouseBlob2Ref.current, {
          x: -moveX * 1.2,
          y: -moveY * 1.2,
          duration: 2.2,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 3. Acoustic Soundwave Ripple on Click/Tap anywhere on page
    const handleClick = (e) => {
      // Don't trigger on interactive inputs
      if (['input', 'textarea', 'select'].includes(e.target?.tagName?.toLowerCase())) return;

      const rippleContainer = document.createElement('div');
      rippleContainer.className = 'fixed pointer-events-none z-[999] rounded-full border border-violet-400/60';
      rippleContainer.style.left = `${e.clientX}px`;
      rippleContainer.style.top = `${e.clientY}px`;
      rippleContainer.style.transform = 'translate(-50%, -50%)';
      rippleContainer.style.width = '10px';
      rippleContainer.style.height = '10px';
      rippleContainer.style.boxShadow = '0 0 15px rgba(139,92,246,0.6)';

      document.body.appendChild(rippleContainer);

      gsap.to(rippleContainer, {
        width: 140,
        height: 140,
        opacity: 0,
        borderWidth: 0.5,
        duration: 0.75,
        ease: 'power2.out',
        onComplete: () => {
          rippleContainer.remove();
        }
      });
    };

    window.addEventListener('click', handleClick, { passive: true });

    // 4. Smooth Section Reveal Enhancer
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const headings = entry.target.querySelectorAll('h2, .section-heading');
          if (headings.length > 0) {
            gsap.fromTo(
              headings,
              { y: 30, opacity: 0.8 },
              { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', overwrite: 'auto' }
            );
          }
        }
      });
    }, { threshold: 0.1 });

    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0" 
      aria-hidden="true"
    >
      {/* Dynamic GSAP Parallax Ambient Blobs */}
      <div 
        ref={mouseBlob1Ref}
        className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[160px]" 
      />
      <div 
        ref={mouseBlob2Ref}
        className="absolute bottom-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-amber-500/10 blur-[150px] mix-blend-screen" 
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
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
