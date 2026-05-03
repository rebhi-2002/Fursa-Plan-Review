import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '../../lib/video/animations';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Fursa Arabic
      setTimeout(() => setPhase(2), 2000),  // English translation & subtitle
      setTimeout(() => setPhase(3), 3500),  // Accent elements
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      
      {/* Background slow scale to keep motion alive */}
      <motion.div 
        className="absolute inset-0 border-[1px] border-[#1D4ED8]/20 m-12 rounded-3xl"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="overflow-hidden mb-4">
          <motion.h1 
            className="text-[12vw] font-bold text-white leading-none font-['Cairo']"
            initial={{ y: "100%", rotate: 5 }}
            animate={phase >= 1 ? { y: 0, rotate: 0 } : { y: "100%", rotate: 5 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            فُرصة
          </motion.h1>
        </div>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-[#FBBF24]"></div>
            <span className="text-[2vw] tracking-[0.3em] text-[#FBBF24] font-medium uppercase">FURSA</span>
            <div className="h-[1px] w-12 bg-[#FBBF24]"></div>
          </div>
          
          <h2 className="text-[3vw] font-light text-white/90 tracking-tight">
            Opportunity. Rebuilt.
          </h2>
        </motion.div>
      </div>
    </motion.div>
  );
}
