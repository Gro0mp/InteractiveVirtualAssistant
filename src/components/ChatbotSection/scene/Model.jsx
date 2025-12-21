import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const modelPath = '/models/lapwing/character3.glb'

// ---------------- MODEL COMPONENT ---------------- //
export default function Model({ isSpeaking = false, poseFromChat = null, morphsFromChat = null, ...props }) {
    const groupRef = useRef(null)
    const { nodes, materials, scene, animations } = useGLTF(modelPath)

    const mixer = useRef(null)
    const actions = useRef({})
    const current = useRef(null)

    // --- PROCEDURAL BREATHING REFS ---
    const chestL = useRef(null)
    const chestR = useRef(null)
    const shoulderL = useRef(null)
    const shoulderR = useRef(null)
    const baseChestScale = useRef(new THREE.Vector3())
    const baseShoulderLScale = useRef(new THREE.Vector3())
    const baseShoulderRScale = useRef(new THREE.Vector3())

    // --- HEAD MESH REF FOR MORPH TARGETS ---
    const headMesh = useRef(null)

    // --- BLINKING STATE ---
    const blinkTimer = useRef(0)
    const nextBlinkTime = useRef(Math.random() * 3 + 2) // Random time between 2-5 seconds
    const isBlinking = useRef(false)
    const blinkProgress = useRef(0)

    // --- MOUTH ANIMATION STATE ---
    const mouthTimer = useRef(0)

    // --- SET UP ANIMATIONS ---
    useEffect(() => {
        if (!scene || !animations.length) return

        mixer.current = new THREE.AnimationMixer(scene)

        animations.forEach((clip) => {
            const action = mixer.current.clipAction(clip)

            const isPose = clip.name.endsWith('_A')

            if (isPose) {
                action.setLoop(THREE.LoopOnce, 1)
                action.clampWhenFinished = true
            } else {
                action.setLoop(THREE.LoopRepeat, 2)
            }

            actions.current[clip.name] = action
        })

        // Start pose
        if (actions.current['Neutral_A']) {
            current.current = actions.current['Neutral_A']
            current.current.play()
        }

        // --- FIND BONES FOR BREATHING ---
        chestL.current = nodes['DEF-breastL']
        chestR.current = nodes['DEF-breastR']
        shoulderL.current = nodes['DEF-shoulderL']
        shoulderR.current = nodes['DEF-shoulderR']

        if (chestL.current && chestR.current) {
            baseChestScale.current.copy(chestL.current.scale)
        }

        if (shoulderL.current) {
            baseShoulderLScale.current.copy(shoulderL.current.scale)
        }
        if (shoulderR.current) {
            baseShoulderRScale.current.copy(shoulderR.current.scale)
        }

        // --- FIND HEAD MESH ---
        headMesh.current = nodes['Head']

        return () => mixer.current?.stopAllAction()
    }, [scene, animations])

    // --- LEVA GUI ---
    // Debug mode control
    const { debugMode } = useControls('Debug', {
        debugMode: { value: false, label: 'Enable GUI Control (Override Props)' },
    })

    const { pose } = useControls('Poses', {
        pose: {
            value: 'Neutral_A',
            options: {
                Neutral: 'Neutral_A',
                Thinking: 'Thinking_A',
                FlippingOff: 'FlippingOff_A',
                HandsOnHips: 'HandsOnHips_A',
                ThumbsUp: 'ThumbsUp_A',
            },
        },
    }, { collapsed: !debugMode })

    const { breathing, breathStrength, breathSpeed } = useControls('Breathing', {
        breathing: true,
        breathStrength: { value: 0.02, min: 0, max: 0.05, step: 0.001 },
        breathSpeed: { value: 1.5, min: 0.5, max: 3, step: 0.1 },
    })

    const { enableBlinking, blinkSpeed, blinkFrequency } = useControls('Blinking', {
        enableBlinking: true,
        blinkSpeed: { value: 0.15, min: 0.05, max: 0.5, step: 0.01, label: 'Blink Speed (s)' },
        blinkFrequency: { value: 3, min: 1, max: 10, step: 0.5, label: 'Avg Time Between Blinks (s)' },
    })

    // --- SHAPE KEY (MORPH TARGET) CONTROLS ---
    const morphControls = useControls('Shape Keys', {
        'Eyebrows - Angry': { value: 0, min: 0, max: 1, step: 0.01 },
        'Eyebrows - Sad': { value: 0, min: 0, max: 1, step: 0.01 },
        'Right Eye - Closed': { value: 0, min: 0, max: 1, step: 0.01 },
        'Left Eye - Closed': { value: 0, min: 0, max: 1, step: 0.01 },
        'Both Eyes - Closed': { value: 0, min: 0, max: 1, step: 0.01 },
        'Mouth - Happy': { value: 0, min: 0, max: 1, step: 0.01 },
        'Mouth - Sad': { value: 0, min: 0, max: 1, step: 0.01 },
        'Mouth - A': { value: 0, min: 0, max: 1, step: 0.01 },
    }, { collapsed: !debugMode })

    // --- POSE TRANSITION (from chat or GUI) ---
    useEffect(() => {
        // In debug mode, use GUI controls. Otherwise, use props or default to Neutral
        let targetPose = debugMode ? pose : (poseFromChat || 'Neutral_A')

        console.log('Pose transition triggered:', { debugMode, guiPose: pose, poseFromChat, targetPose })

        const next = actions.current[targetPose]
        if (!next || next === current.current) return

        next.reset().fadeIn(0.35).play()

        if (current.current && current.current !== next) {
            current.current.fadeOut(0.35)
        }

        current.current = next
    }, [pose, poseFromChat, debugMode])

    // --- UPDATE LOOP FOR BREATHING, BLINKING & MORPH TARGETS ---
    useFrame((state, delta) => {
        mixer.current?.update(delta)

        // --- BREATHING ---
        if (breathing && chestL.current) {
            const t = state.clock.getElapsedTime()
            const breath = Math.sin(t * breathSpeed) * breathStrength

            chestL.current.scale.set(
                baseChestScale.current.x * (1 + breath * 0.05),
                baseChestScale.current.y * (1 + breath),
                baseChestScale.current.z
            )

            chestR.current.scale.set(
                baseChestScale.current.x * (1 + breath * 0.05),
                baseChestScale.current.y * (1 + breath),
                baseChestScale.current.z
            )

            shoulderL.current.scale.set(
                baseShoulderLScale.current.x * (1 + breath * 0.8),
                baseShoulderLScale.current.y * (1 + breath),
                baseShoulderLScale.current.z
            )

            shoulderR.current.scale.set(
                baseShoulderRScale.current.x * (1 + breath * 0.8),
                baseShoulderRScale.current.y * (1 + breath),
                baseShoulderRScale.current.z
            )
        }

        // --- BLINKING LOGIC ---
        if (enableBlinking && headMesh.current) {
            blinkTimer.current += delta

            if (!isBlinking.current && blinkTimer.current >= nextBlinkTime.current) {
                // Start blink
                isBlinking.current = true
                blinkProgress.current = 0
                blinkTimer.current = 0
            }

            if (isBlinking.current) {
                blinkProgress.current += delta / blinkSpeed

                if (blinkProgress.current >= 1) {
                    // End blink
                    isBlinking.current = false
                    blinkProgress.current = 0
                    blinkTimer.current = 0
                    // Set next random blink time
                    nextBlinkTime.current = Math.random() * blinkFrequency + blinkFrequency / 2
                }
            }
        }

        // --- MOUTH ANIMATION WHILE SPEAKING ---
        if (isSpeaking) {
            mouthTimer.current += delta
        }

        // --- APPLY MORPH TARGETS ---
        if (headMesh.current && headMesh.current.morphTargetInfluences) {
            const dict = headMesh.current.morphTargetDictionary

            // In debug mode, use GUI controls. Otherwise, use props or default to 0
            const activeMorphs = debugMode ? morphControls : (morphsFromChat || {})

            Object.keys(morphControls).forEach((key) => {
                const index = dict[key]
                if (index !== undefined) {
                    let value = activeMorphs[key] || 0

                    // Override with blinking
                    if (enableBlinking && key === 'Both Eyes - Closed' && isBlinking.current) {
                        // Smooth blink curve (ease in/out)
                        const t = blinkProgress.current
                        const blinkCurve = t < 0.5
                            ? 2 * t * t
                            : 1 - Math.pow(-2 * t + 2, 2) / 2
                        value = Math.max(value, blinkCurve)
                    }

                    // Override Mouth - A with talking animation (only if not in debug mode or debug allows it)
                    if (isSpeaking && key === 'Mouth - A') {
                        // Create varied mouth movement while speaking
                        const mouthCycle = Math.sin(mouthTimer.current * 8) * 0.5 + 0.5
                        const mouthNoise = Math.sin(mouthTimer.current * 15.7) * 0.2
                        value = Math.max(value, (mouthCycle + mouthNoise) * 0.7)
                    }

                    headMesh.current.morphTargetInfluences[index] = value
                }
            })
        }
    })

    // --- DEBUG LOGGING ---
    // console.log('Nodes:', nodes)
    // console.log('Materials:', materials)
    // console.log('Scene:', scene)
    // if (headMesh.current) {
    //     console.log('Head Morph Dictionary:', headMesh.current.morphTargetDictionary)
    // }

    return (
        <group ref={groupRef} {...props} scale={5} position={[1, -0.2, 4]} rotation={[0, Math.PI / 6, 0]} castShadow={true} receiveShadow={true}>
            <primitive object={scene} />
        </group>
    )
}

useGLTF.preload(modelPath)