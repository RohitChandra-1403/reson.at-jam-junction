// Component: Skiper27 (Rolling Text)
// Source: Skiper UI (@skiper-ui/skiper27)
// Attribution: Skiper UI (https://skiper-ui.com)

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * RollingText (Skiper27)
 * Scroll & timed-triggered 3D rolling text animation with staggered letter delays
 *
 * @param {string} text - Text to animate
 * @param {number} speed - Stagger delay between characters (seconds)
 * @param {number} duration - Animation duration for rolling motion
 * @param {string} className - Additional CSS classes
 * @param {boolean} loop - Whether the rolling animation cycles automatically
 * @param {number} loopInterval - Time in milliseconds between cycles
 */
export function RollingText({
  text = "Connect , Create and Resonate ",
  speed = 0.05,
  duration = 0.6,
  className = "",
  loop = true,
  loopInterval = 4500,
  style = {}
}) {
  const [cycleKey, setCycleKey] = useState(0);
  const characters = Array.from(text);
  const totalChars = characters.length;
  const middleIndex = Math.floor(totalChars / 2);

  // Periodic re-roll trigger
  useEffect(() => {
    if (!loop) return;
    const interval = setInterval(() => {
      setCycleKey(prev => prev + 1);
    }, loopInterval);
    return () => clearInterval(interval);
  }, [loop, loopInterval]);

  const handleHover = () => {
    setCycleKey(prev => prev + 1);
  };

  return (
    <span
      className={`inline-flex items-center flex-wrap cursor-pointer select-none perspective-[1000px] ${className}`}
      onMouseEnter={handleHover}
      style={style}
      aria-label={text}
    >
      {characters.map((char, index) => {
        // Stagger distance: calculated from center outwards or sequentially
        const distanceFromCenter = Math.abs(index - middleIndex);
        const charDelay = distanceFromCenter * speed;
        const isSpace = char === ' ';

        return (
          <span
            key={`${index}-${cycleKey}`}
            className="relative inline-block overflow-hidden leading-tight"
            style={{
              height: '1.25em',
              verticalAlign: 'middle',
              display: 'inline-block'
            }}
          >
            {/* Top Rolling Character (Sliding Up Out) */}
            <motion.span
              className="inline-block transform-gpu will-change-transform"
              initial={{ y: '0%', opacity: 1, rotateX: 0 }}
              animate={{ 
                y: '-110%', 
                opacity: 0,
                rotateX: -45
              }}
              transition={{
                duration: duration,
                delay: charDelay,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {isSpace ? '\u00A0' : char}
            </motion.span>

            {/* Bottom Rolling Character (Sliding Up Into View) */}
            <motion.span
              className="absolute left-0 top-0 inline-block transform-gpu will-change-transform"
              initial={{ y: '110%', opacity: 0, rotateX: 45 }}
              animate={{ 
                y: '0%', 
                opacity: 1,
                rotateX: 0
              }}
              transition={{
                duration: duration,
                delay: charDelay,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {isSpace ? '\u00A0' : char}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

export default RollingText;
