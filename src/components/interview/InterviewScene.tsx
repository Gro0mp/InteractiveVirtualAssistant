import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Assistant } from '../assistant/Assistant'

type Props = {
    animationName?: string
}

export function InterviewScene({ animationName }: Props) {
    return (
        <div className="h-full w-full rounded-2xl border border-slate-200/70 bg-white/60 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur overflow-hidden">
            <div className="h-full w-full relative">
                <Canvas camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 1000 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={15} />
                    <pointLight position={[-5, 5, -5]} intensity={0.5} />
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
