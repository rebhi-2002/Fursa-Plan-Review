import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene5() {
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
      className="absolute inset-0 flex items-center justify-center bg-[#0F172A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-12 right-12 text-right">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          className="text-[#1D4ED8] font-medium tracking-widest uppercase text-sm"
        >
          02 — Employer
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-12 grid grid-cols-2 gap-16 items-center">
        
        {/* Left: Copy */}
        <div className="space-y-8">
          <motion.h2 
            className="text-[4vw] font-bold text-white leading-tight font-['Cairo']"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          >
            نحو نمو الأعمال
            <span className="block text-[3vw] text-white/60 font-['Outfit'] mt-2">Find the right talent.</span>
          </motion.h2>
          
          <motion.p 
            className="text-[1.8vw] text-white/70 font-light"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          >
            Post opportunities. Review candidates. <br/>
            Build your team with local talent.
          </motion.p>
        </div>

        {/* Right: UI Mockup Desktop */}
        <div className="relative w-full aspect-[16/10] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Top nav */}
          <div className="h-12 border-b border-gray-200 flex items-center px-4 bg-gray-50">
            <div className="w-24 h-4 bg-[#1D4ED8] rounded"></div>
            <div className="ml-auto flex gap-4">
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 -mt-2"></div>
            </div>
          </div>
          
          <div className="p-6 flex gap-6 h-full">
            {/* Sidebar */}
            <div className="w-1/4 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-100 rounded w-full"></div>
              <div className="h-8 bg-gray-100 rounded w-full"></div>
            </div>
            
            {/* Main content area */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-end mb-6">
                <div className="w-48 h-6 bg-gray-800 rounded"></div>
                <div className="w-24 h-8 bg-[#1D4ED8] rounded text-xs flex items-center justify-center text-white font-bold">+ New</div>
              </div>
              
              {/* Candidate Card 1 */}
              <motion.div 
                className="w-full h-20 border border-gray-200 rounded-lg p-4 flex items-center shadow-sm relative overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Selection highlight */}
                <motion.div 
                  className="absolute inset-0 bg-[#1D4ED8]/5"
                  initial={{ opacity: 0 }}
                  animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                />
                
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
                <div className="space-y-2 flex-1">
                  <div className="w-32 h-4 bg-gray-800 rounded"></div>
                  <div className="w-24 h-3 bg-gray-400 rounded"></div>
                </div>
                <motion.div 
                  className="w-20 h-8 bg-[#FBBF24] rounded flex items-center justify-center text-white text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={phase >= 3 ? { scale: 1 } : { scale: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  ACCEPT
                </motion.div>
              </motion.div>

              {/* Candidate Card 2 */}
              <motion.div 
                className="w-full h-20 border border-gray-200 rounded-lg p-4 flex items-center"
                initial={{ opacity: 0, x: 20 }}
                animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
                <div className="space-y-2 flex-1">
                  <div className="w-40 h-4 bg-gray-800 rounded"></div>
                  <div className="w-20 h-3 bg-gray-400 rounded"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
