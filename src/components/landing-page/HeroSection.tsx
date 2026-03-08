import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { GridBackground } from "../ui/GridBackground.tsx";
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.tsx";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type FloatingOrbCardProps = {
  className: string;
  delay: number;
  duration: number;
  /** How far from center the card spawns (px) */
  spawnRadiusPx?: { min: number; max: number };
  /** Max drift while hanging (px) */
  driftPx?: number;
  children: React.ReactNode;
};

function FloatingOrbCard({
  className,
  delay,
  duration,
  spawnRadiusPx = { min: 55, max: 95 },
  driftPx = 14,
  children
}: FloatingOrbCardProps) {
  const [cycle, setCycle] = useState(0);

  const { startX, startY, driftX, driftY } = useMemo(() => {
    // Pick a random point on a ring around the orb.
    const angle = Math.random() * Math.PI * 2;
    const r = randInt(spawnRadiusPx.min, spawnRadiusPx.max);

    const sx = Math.round(Math.cos(angle) * r);
    const sy = Math.round(Math.sin(angle) * r);

    // Small drift while it “hangs”.
    const dx = randInt(-driftPx, driftPx);
    const dy = randInt(-driftPx, driftPx);

    return { startX: sx, startY: sy, driftX: dx, driftY: dy };
  }, [cycle, spawnRadiusPx.min, spawnRadiusPx.max, driftPx]);

  return (
    <motion.div
      key={cycle}
      initial={{ x: startX, y: startY, opacity: 0, scale: 0.98 }}
      animate={{
        x: [startX, 0, driftX, 0],
        y: [startY, 0, driftY, 0],
        opacity: [0, 1, 1, 0],
        scale: [0.98, 1, 1, 0.98]
      }}
      transition={{
        delay,
        duration,
        ease: 'easeInOut',
        times: [0, 0.18, 0.86, 1]
      }}
      onAnimationComplete={() => {
        // Remount + re-roll a new random spawn point each cycle.
        // Use a timeout so the next cycle starts AFTER the (next) delay.
        const ms = Math.max(0, delay * 1000);
        window.setTimeout(() => setCycle((c) => c + 1), ms);
      }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  // Check authentication status to conditionally render dashboard or signup button
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <GridBackground/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5
              }}>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Meet IVA, Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-cyan-500">
                  Intelligent
                </span>{' '}
                <br />
                Virtual Assistant
              </h1>
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.1
              }}
              className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">

              Automate tasks, manage schedules, and streamline your workflow
              with AI-powered intelligence. Set up in seconds. No complexity.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.2
              }}
              className="flex flex-col sm:flex-row gap-4 mb-8">
              {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto px-8" variant={"secondary"}>
                      Dashboard
                    </Button>
                  </Link>
              ) : (
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto px-8" variant={"secondary"}>
                      Get Started Free
                    </Button>
                  </Link>
              )}
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto group"
                leftIcon={
                <Play className="w-4 h-4 fill-current group-hover:text-violet-600 transition-colors" />
                }>

                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.3
              }}
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">

              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-black-600 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-black-600 mr-2" />
                Free forever plan
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-black-600 mr-2" />
                Cancel anytime
              </div>
            </motion.div>
          </div>

          {/* Right Visual - Animated Orb */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
            className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center">

            {/* Main Orb Container */}
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
              {/* Core Gradient Sphere */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-cyan-400 to-blue-500 opacity-20 blur-3xl" />


              {/* Inner Sphere with Mesh Effect */}
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute inset-4 rounded-full border border-violet-200/30 bg-gradient-to-tr from-white/10 to-transparent backdrop-blur-sm shadow-2xl"
                style={{
                  backgroundImage:
                  'radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, transparent 70%)'
                }}>

                {/* Decorative dots/stars on the sphere surface */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-violet-300 rounded-full" />
              </motion.div>

              {/* Orbiting Elements */}
              <motion.div
                animate={{
                  rotate: -360
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute inset-[-20px] rounded-full border border-dashed border-violet-200/40" />


              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute inset-[-60px] rounded-full border border-slate-100/50">

                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-violet-500 rounded-full shadow-lg" />
              </motion.div>

              {/* Floating Cards/UI Elements for "Assistant" feel */}
              <FloatingOrbCard
                className="absolute -right-12 top-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/50"
                delay={0.5}
                duration={7}
                spawnRadiusPx={{ min: 70, max: 120 }}
                driftPx={16}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Task Completed</div>
                    <div className="text-sm font-semibold text-slate-900">
                      Meeting Scheduled
                    </div>
                  </div>
                </div>
              </FloatingOrbCard>

              <FloatingOrbCard
                className="absolute -left-8 bottom-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/50"
                delay={1.2}
                duration={8}
                spawnRadiusPx={{ min: 70, max: 120 }}
                driftPx={16}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Status</div>
                    <div className="text-sm font-semibold text-slate-900">
                      Analyzing Data...
                    </div>
                  </div>
                </div>
              </FloatingOrbCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}