import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#1D4ED8]"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="text-center relative z-10">
        <motion.div 
          className="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          {/* Briefcase SVG */}
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="42" y="80" width="116" height="82" rx="10" fill="white" opacity="0.95"/>
            <rect x="42" y="80" width="116" height="18" rx="10" fill="white"/>
            <path d="M76 80 C76 65 124 65 124 80" stroke="white" stroke-width="8" stroke-linecap="round" fill="none"/>
            <rect x="90" y="116" width="20" height="14" rx="4" fill="#1E293B"/>
            <rect x="42" y="116" width="116" height="14" fill="white" opacity="0.2"/>
            
            <motion.circle 
              cx="152" cy="52" r="10" fill="#FBBF24"
              initial={{ scale: 0 }}
              animate={phase >= 2 ? { scale: [0, 1.5, 1] } : { scale: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            <motion.path 
              d="M152 44 L153.5 49.5 L159 51 L153.5 52.5 L152 58 L150.5 52.5 L145 51 L150.5 49.5 Z" fill="white"
              initial={{ scale: 0 }}
              animate={phase >= 2 ? { scale: [0, 1.5, 1] } : { scale: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </svg>

          {/* Ripple effect */}
          {phase >= 2 && (
            <motion.div 
              className="absolute inset-0 border-4 border-white rounded-full"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}
        </motion.div>

        <motion.h2 
          className="text-[4vw] font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          Application Sent
        </motion.h2>

        <motion.p 
          className="text-[2vw] text-white/80 font-['Cairo']"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        >
          تم إرسال الطلب بنجاح
        </motion.p>
      </div>

      {/* Floating particles specific to this scene */}
      {phase >= 2 && [...Array(10)].map((_, i) => (
        <motion.div
          key={`part-${i}`}
          className="absolute w-2 h-2 bg-[#FBBF24] rounded-full"
          initial={{ 
            opacity: 1, 
            scale: 0,
            x: "50vw",
            y: "40vh" 
          }}
          animate={{ 
            opacity: 0,
            scale: Math.random() * 2 + 1,
            x: `calc(50vw + ${Math.random() * 40 - 20}vw)`,
            y: `calc(40vh + ${Math.random() * 40 - 20}vh)`
          }}
          transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
