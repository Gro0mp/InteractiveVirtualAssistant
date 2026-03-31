'use client'

import { Suspense, useEffect, useRef } from 'react'
import {Canvas} from '@react-three/fiber'
import { Environment, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type Props = {
    className?: string
}

function Robot2({ animationName = 'Sitting' }: { animationName?: string }) {
    const group = useRef<THREE.Group>(null)
    const { scene, animations } = useGLTF('/models/robot2.glb')
    const { actions, names } = useAnimations(animations, group)

    useEffect(() => {
        const clipName =
            (animationName && actions[animationName] ? animationName : names[0]) ?? null

        if (!clipName) return

        Object.values(actions).forEach((a) => a?.stop())
        const act = actions[clipName]
        if (!act) return

        act.reset()
        act.setLoop(THREE.LoopRepeat, Infinity)
        act.play()

        return () => {
            act.stop()
        }
    }, [actions, names, animationName])

    return (
        <group ref={group} dispose={null} scale={1.17} position={[0.5, 1.85, 0]}>
            <primitive object={scene} />
        </group>
    )
}


export function HeroSectionAssistant({ className }: Props) {
    return (
        <div className={className}>
            <Canvas
                shadows
                camera={{ position: [0, 4.65, 6.2], fov: 52 }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.85} />
                <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow={true} />
                <directionalLight position={[-4, 2, -3]} intensity={0.35} />

                <Suspense fallback={null}>
                    <Robot2 animationName="Sitting" />
                    <Environment preset="studio" />
                </Suspense>

                {/* Optional ground shadow */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
                    <planeGeometry args={[8, 8]} />
                    <shadowMaterial opacity={0.18} />
                </mesh>
            </Canvas>
        </div>
    )
}

useGLTF.preload('/models/robot2.glb')