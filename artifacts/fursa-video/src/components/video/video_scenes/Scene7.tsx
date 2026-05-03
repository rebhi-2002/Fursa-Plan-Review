import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0F172A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Dramatic central light */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center opacity-30"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-[80vw] h-[80vw] rounded-full" style={{ background: 'radial-gradient(circle, #FBBF24 0%, transparent 60%)' }}></div>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Mark */}
        <motion.div 
          className="w-32 h-32 mb-12 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" rx="40" fill="#1D4ED8"/>
            <rect width="200" height="200" rx="40" fill="url(#grad2)" opacity="0.3"/>
            <rect x="42" y="80" width="116" height="82" rx="10" fill="white" opacity="0.95"/>
            <rect x="42" y="80" width="116" height="18" rx="10" fill="white"/>
            <path d="M76 80 C76 65 124 65 124 80" stroke="white" stroke-width="8" stroke-linecap="round" fill="none"/>
            <rect x="90" y="116" width="20" height="14" rx="4" fill="#1D4ED8"/>
            <rect x="42" y="116" width="116" height="14" fill="white" opacity="0.2"/>
            
            <motion.circle 
              cx="152" cy="52" r="10" fill="#FBBF24"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path 
              d="M152 44 L153.5 49.5 L159 51 L153.5 52.5 L152 58 L150.5 52.5 L145 51 L150.5 49.5 Z" fill="white"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <defs>
              <linearGradient id="grad2" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#3B82F6"/>
                <stop offset="100%" stop-color="#1E3A8A"/>
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.h1 
          className="text-[6vw] font-bold text-white leading-none font-['Cairo'] mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
        >
          فُرصة
        </motion.h1>

        <motion.p 
          className="text-[2.5vw] text-white/80 font-light tracking-wide text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Every person deserves a chance.
        </motion.p>
      </div>
    </motion.div>
  );
}
