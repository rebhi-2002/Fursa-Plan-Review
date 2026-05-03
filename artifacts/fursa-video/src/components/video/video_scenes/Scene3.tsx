import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-12 left-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          className="text-[#FBBF24] font-medium tracking-widest uppercase text-sm"
        >
          01 — Job Seeker
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
        
        {/* Left: UI Mockup */}
        <div className="relative w-full aspect-[9/16] max-h-[80vh] mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-[#1E293B]">
          {/* Header */}
          <div className="h-24 bg-[#1D4ED8] flex items-end p-6 pb-4">
            <div className="w-8 h-8 rounded-full bg-white/20"></div>
            <div className="ml-4 space-y-2">
              <div className="h-3 w-24 bg-white/40 rounded"></div>
              <div className="h-4 w-32 bg-white rounded"></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            <motion.div 
              className="w-full h-32 rounded-xl bg-gray-100 p-4 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded bg-[#1D4ED8]/10"></div>
                <div className="w-20 h-6 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center">
                  <div className="w-12 h-2 bg-[#1D4ED8] rounded"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
              </div>
            </motion.div>

            <motion.div 
              className="w-full h-32 rounded-xl bg-gray-100 p-4 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded bg-[#1D4ED8]/10"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/3 h-3 bg-gray-200 rounded"></div>
              </div>
            </motion.div>
          </div>

          {/* Action indicator */}
          <motion.div 
            className="absolute bottom-8 right-8 w-14 h-14 bg-[#FBBF24] rounded-full shadow-lg flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={phase >= 4 ? { scale: [0, 1.2, 1] } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-6 h-6 border-t-2 border-r-2 border-white transform rotate-45 -translate-x-1"></div>
          </motion.div>
        </div>

        {/* Right: Copy */}
        <div className="space-y-8">
          <motion.h2 
            className="text-[4vw] font-bold text-white leading-tight font-['Cairo']"
            initial={{ opacity: 0, x: 30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          >
            البحث عن عمل
            <span className="block text-[3vw] text-white/60 font-['Outfit'] mt-2">Find your path.</span>
          </motion.h2>
          
          <motion.p 
            className="text-[1.8vw] text-white/70 font-light"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          >
            Create a profile. Upload a CV. <br/>
            Browse opportunities tailored for Gaza.
          </motion.p>
        </div>

      </div>
    </motion.div>
  );
}
