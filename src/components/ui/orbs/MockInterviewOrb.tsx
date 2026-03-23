import { motion } from "framer-motion";
import React from "react";
import { Speech } from "lucide-react";
import { Link } from "react-router-dom";

export function MockInterviewOrb() {
    return (
        <Link to="/interview">
            {/* Right Visual - Animated Orb */}
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
                    duration: 0.8,
                    delay: 0.2
                }}
                className="relative h-[100px] lg:h-[200px] w-full flex items-center justify-center will-change-transform transform-gpu hover:scale-110 cursor-pointer">

                {/* Main Orb Container */}
                <div className="relative w-[100px] h-[100px] sm:w-[400px] sm:h-[400px]">
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
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-indigo-400 to-blue-500 opacity-20 blur-3xl will-change-transform transform-gpu"/>


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
                        className="absolute inset-4 rounded-full border border-violet-200/30 bg-gradient-to-tr from-white/10 to-transparent shadow-2xl will-change-transform transform-gpu"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, transparent 70%)'
                        }}>

                        {/* Decorative dots/stars on the sphere surface */}
                        <div
                            className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"/>
                        <div
                            className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"/>
                        <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-violet-300 rounded-full"/>
                    </motion.div>

                    {/* Center file icon */}
                    <motion.div
                        initial={{opacity: 0, y: 14}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.6, ease: 'easeOut'}}
                        className="pointer-events-none absolute inset-0 z-10 grid place-items-center will-change-transform transform-gpu scale-150">
                        {/* Soft in-orb glow */}
                        <div
                            className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-cyan-300/25 via-blue-400/15 to-violet-400/20 blur-2xl"/>

                        {/* Glass badge */}
                        <div
                            className="relative rounded-full w-20 h-20 sm:w-24 sm:h-24 grid place-items-center bg-gradient-to-br from-white/18 to-white/5 backdrop-blur-xl border border-white/25 shadow-[0_20px_50px_rgba(56,189,248,0.22)]">
                            <Speech
                                className="w-10 h-10 sm:w-12 sm:h-12 text-white/95 drop-shadow-[0_10px_20px_rgba(56,189,248,0.35)]"/>
                        </div>
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
                        className="absolute inset-[-20px] rounded-full border border-dashed border-violet-200/40"/>


                </div>
            </motion.div>
        </Link>
    )
}
