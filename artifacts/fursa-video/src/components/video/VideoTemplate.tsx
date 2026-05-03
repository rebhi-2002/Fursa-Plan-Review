import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';

export const SCENE_DURATIONS: Record<string, number> = {
  hero: 6000,
  problem: 7000,
  seeker: 8000,
  application: 6000,
  employer: 8000,
  match: 6000,
  close: 8000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Scene1,
  problem: Scene2,
  seeker: Scene3,
  application: Scene4,
  employer: Scene5,
  match: Scene6,
  close: Scene7,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0F172A] font-['Outfit']">

      {/* Persistent Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep blue glow */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-20 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #1D4ED8, transparent)' }}
          animate={{
            x: ['-20%', '20%', '-10%'],
            y: ['-20%', '10%', '-30%'],
            scale: [1, 1.2, 0.9]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Gold accent glow */}
        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, #FBBF24, transparent)' }}
          animate={{
            x: ['50%', '10%', '60%'],
            y: ['50%', '80%', '40%'],
            opacity: sceneIndex === 0 || sceneIndex === 6 ? 0.15 : 0.05,
            scale: sceneIndex === 0 || sceneIndex === 6 ? 1.5 : 1
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
          }}
        />
      </div>

      {/* Persistent Midground Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 17 + 3) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [0, -80],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              delay: (i * 0.7) % 5,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
