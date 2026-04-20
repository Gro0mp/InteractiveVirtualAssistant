'use client'

import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {useAnimations, useGLTF} from '@react-three/drei'

type AssistantProps = React.JSX.IntrinsicElements['group'] & {
    animationName?: string; // Name of the one-shot animation to play
    idleAnimation?: string; // Name of the idle animation to loop when not doing one-shots
}

export function Assistant({ animationName, idleAnimation, ...props }: AssistantProps) {
    const groupRef = useRef<THREE.Group>(null)
    const { scene, animations } = useGLTF('/models/robot3.glb')
    const { actions, names, mixer } = useAnimations(animations, groupRef)

    console.log(animations)

    useEffect(() => {
        // Start all animations when the component mounts
        const idleName = idleAnimation || names[0] // Default to first animation if no idle specified
        if (idleName && actions[idleName]) {
            const idle = actions[idleName]
            idle?.setLoop(THREE.LoopRepeat, Infinity)
            idle?.play()
        }
        return () => {
            // Cleanup: stop all actions on unmount
            Object.values(actions).forEach((action) => action?.stop())
        }
    }, [actions, names, idleAnimation])

    useEffect(() => {
        if (!animationName || !actions[animationName]) {
            return
        }
        const idleName = idleAnimation ?? names[0]
        const idleAction = idleName ? actions[idleName] : null
        const oneShotAction = actions[animationName]!

        // Configure the one-shot
        oneShotAction.reset()
        oneShotAction.setLoop(THREE.LoopOnce, 1)
        oneShotAction.clampWhenFinished = true

        // Crossfade from idle to the one-shot
        if (idleAction) {
            oneShotAction.crossFadeFrom(idleAction, 0.3, true)
        }
        oneShotAction.play()

        // When done, crossfade back to idle
        const onFinished = (e: { action: THREE.AnimationAction }) => {
            if (e.action === oneShotAction && idleAction) {
                idleAction.reset()
                idleAction.setLoop(THREE.LoopRepeat, Infinity)
                idleAction.crossFadeFrom(oneShotAction, 0.3, true)
                idleAction.play()
            }
        }
        mixer.addEventListener('finished', onFinished)
        return () => {
            mixer.removeEventListener('finished', onFinished)
        }
    }, [animationName, actions, names, mixer, idleAnimation])

    return (
        <group ref={groupRef} {...props} dispose={null}>
            <primitive object={scene} />
        </group>
    )
}

useGLTF.preload('/models/robot.glb')
