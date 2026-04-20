'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Assistant } from '../assistant/Assistant'

type Props = {
    animationName?: string
}

export function InterviewScene({ animationName }: Props) {
    return (
        <div className="h-full w-full relative bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors duration-300">
            {/* Corner accents — matching CTA section */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500 z-10" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500 z-10" aria-hidden />
            <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500 z-10" aria-hidden />
            <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500 z-10" aria-hidden />

            {/* Terminal header bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-1.5 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="ml-3 text-[9px] text-neutral-400 dark:text-neutral-600 font-mono tracking-widest uppercase">
                    IVA — Interview Assistant
                </span>
                {animationName && (
                    <span className="ml-auto inline-flex items-center gap-1.5 text-[9px] font-mono text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30 px-2 py-0.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        {animationName.toUpperCase()}
                    </span>
                )}
            </div>

            <div className="h-full w-full pt-10">
                <Canvas camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 1000 }}>
                    <ambientLight intensity={0.85} />
                    <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow={true} />
                    <directionalLight position={[-4, 2, -3]} intensity={0.35} />
                    <Suspense fallback={null}>
                        <Assistant
                            position={[0, -3.2, 1]}
                            scale={3}
                            animationName={animationName}
                            idleAnimation={'Idle'}
                        />
                        <Environment preset="studio" />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    )
}