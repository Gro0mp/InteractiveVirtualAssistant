// src/components/dashboard/MiniOrbLink.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function MiniOrbLink() {
    return (
        <Link
            to="/"
            aria-label="Back to landing page"
            title="Back to landing page"
            className="absolute top-8 left-12 z-20 block h-[54px] w-[54px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative h-full w-full rounded-full"
            >
                <motion.div
                    animate={{ y: [0, -2, 0], scale: [1, 1.02, 1] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full opacity-[0.18] blur-[14px]"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(124,58,237,1), rgba(34,211,238,1), rgba(59,130,246,1))",
                    }}
                />

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[6px] rounded-full border border-violet-200/30 bg-gradient-to-tr from-white/10 to-transparent shadow-[0_18px_40px_rgba(11,18,32,0.10)] backdrop-blur-[6px]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at center, rgba(124, 58, 237, 0.10) 0%, transparent 70%)",
                    }}
                >
                    <div className="absolute left-1/4 top-1/4 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    <div className="absolute bottom-1/3 right-1/4 h-[6px] w-[6px] rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <div className="absolute right-1/5 top-1/2 h-1 w-1 rounded-full bg-violet-300" />
                </motion.div>

                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-1 rounded-full border border-dashed border-violet-200/40"
                />
            </motion.div>
        </Link>
    );
}
