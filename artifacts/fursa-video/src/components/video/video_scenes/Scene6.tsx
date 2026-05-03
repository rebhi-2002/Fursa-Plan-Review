import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#FBBF24]"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative z-10 text-center w-full max-w-4xl px-12">
        
        {/* Animated connection lines */}
        <div className="relative h-32 mb-12 flex items-center justify-center w-full">
          {/* Employer node */}
          <motion.div 
            className="absolute left-[20%] w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg z-10"
            initial={{ scale: 0 }}
            animate={phase >= 1 ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div className="w-8 h-8 rounded bg-[#1D4ED8]/20"></div>
          </motion.div>

          {/* Seeker node */}
          <motion.div 
            className="absolute right-[20%] w-16 h-16 rounded-full bg-[#1E293B] flex items-center justify-center shadow-lg z-10"
            initial={{ scale: 0 }}
            animate={phase >= 1 ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20"></div>
          </motion.div>

          {/* Connection line */}
          <div className="absolute left-[20%] right-[20%] h-1 bg-white/30 rounded">
            <motion.div 
              className="h-full bg-white rounded"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>

          {/* Center Match icon */}
          <motion.div 
            className="absolute w-20 h-20 rounded-full bg-[#1D4ED8] flex items-center justify-center shadow-xl z-20"
            initial={{ scale: 0, rotate: -45 }}
            animate={phase >= 2 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 200 }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </motion.div>
        </div>

        <motion.h2 
          className="text-[5vw] font-bold text-[#1E293B] leading-none mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          The Connection is Made
        </motion.h2>

        <motion.p 
          className="text-[2.5vw] text-[#1E293B]/80 font-['Cairo'] font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.1 }}
        >
          تم التوظيف
        </motion.p>
      </div>
      
      {/* Background ripple */}
      {phase >= 2 && (
        <motion.div 
          className="absolute w-64 h-64 bg-white/20 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 10, opacity: 0 }}
          transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}
