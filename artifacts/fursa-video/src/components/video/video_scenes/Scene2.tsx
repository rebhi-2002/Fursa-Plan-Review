import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0F172A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full max-w-6xl mx-auto px-12 grid grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div className="overflow-hidden">
            <motion.h2 
              className="text-[5vw] font-bold text-white leading-[1.1] font-['Cairo']"
              initial={{ y: "100%" }}
              animate={phase >= 1 ? { y: 0 } : { y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              غزة
            </motion.h2>
            <motion.h2 
              className="text-[4vw] font-bold text-white/50 leading-[1.1]"
              initial={{ y: "100%" }}
              animate={phase >= 1 ? { y: 0 } : { y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.1 }}
            >
              Gaza.
            </motion.h2>
          </div>
          
          <motion.div 
            className="w-24 h-1 bg-[#1D4ED8]"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={phase >= 1 ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          <motion.p 
            className="text-[2vw] text-white/70 font-light leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            Displacement. Unemployment. <br/>
            An economy paused, but resilience unbroken.
          </motion.p>
        </div>

        <div className="relative h-[60vh]">
          <motion.div 
            className="absolute inset-0 border border-white/10 rounded-2xl p-8 flex flex-col justify-center bg-white/5 backdrop-blur-sm"
            initial={{ opacity: 0, x: 50 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <motion.div 
              className="text-[#FBBF24] text-[6vw] font-bold tracking-tighter"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              85%
            </motion.hdiv>
            <p className="text-[1.5vw] text-white/60 mt-2 uppercase tracking-widest">
              Unemployment Rate
            </p>
            <div className="mt-12 space-y-4">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#1D4ED8]"
                  initial={{ width: 0 }}
                  animate={phase >= 3 ? { width: "85%" } : { width: 0 }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
