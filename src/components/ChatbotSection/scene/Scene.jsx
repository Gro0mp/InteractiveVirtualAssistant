import {Canvas, useLoader, useThree} from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

import Model from './Model.jsx';
import ModernRoom from './ModernRoom.jsx';
import {useEffect} from "react";

/* ---------------- HDRI MAP ---------------- */

const backgrounds = new Map([
    ['night_street', '/hdris/cobblestone_street_night_4k.hdr'],
    ['outdoors', '/hdris/lilienstein_4k.hdr'],
]);

/* ---------- HDRI VISUAL SPHERE ---------- */

function HDRISphere({ y = -1.2, hdri }) {
    const texture = useLoader(RGBELoader, backgrounds.get(hdri));

    return (
        <mesh position={[0, y, 0]}>
            <sphereGeometry args={[60, 64, 64]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
                toneMapped={false}
            />
        </mesh>
    );
}

/* ---------- CAMERA CONTROLLER ---------- */

function CameraController({ fov, position, rotation }) {
    const { camera } = useThree();

    useEffect(() => {
        camera.fov = fov;
        camera.updateProjectionMatrix();
    }, [fov, camera]);

    useEffect(() => {
        camera.position.set(position[0], position[1], position[2]);
    }, [position, camera]);

    useEffect(() => {
        camera.rotation.set(rotation[0], rotation[1], rotation[2]);
    }, [rotation, camera]);

    return null;
}


/* ---------------- SCENE ---------------- */

export function Scene({ isSpeaking = false, pose = null, expressions = null }) {
    const {
        hdri,
        envIntensity,
        envBlur,
        sphereY,
        shadowOpacity,
        shadowBlur,
        shadowScale,
        camFov,
        camX,
        camY,
        camZ,
        camRotX,
        camRotY,
        camRotZ,
    } = useControls('Scene Controls', {
        hdri: {
            value: 'outdoors',
            options: {
                Outdoors: 'outdoors',
                NightStreet: 'night_street',
            },
        },

        envIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
        envBlur: { value: 0.4, min: 0, max: 1, step: 0.01 },

        sphereY: { value: -2, min: -5, max: 0, step: 0.1 },

        shadowOpacity: { value: 0.35, min: 0, max: 1, step: 0.01 },
        shadowBlur: { value: 2.5, min: 0, max: 10, step: 0.1 },
        shadowScale: { value: 10, min: 1, max: 30, step: 1 },

        camFov: { value: 35, min: 30, max: 90, step: 1 },
        camX: { value: 4.5, min: -20, max: 20, step: 0.5 },
        camY: { value: 7.5, min: -20, max: 20, step: 0.5 },
        camZ: { value: 10, min: -20, max: 20, step: 0.5 },

        camRotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        camRotY: { value: 0.5, min: -Math.PI, max: Math.PI, step: 0.01 },
        camRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },


    });

    return (
        <div className="scene-container">
            {/* LEVA GUI */}
            <Leva collapsed />

            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{
                    position: [8, 10, 16],
                    fov: camFov.value }}
            >
                {/* HDRI LIGHTING */}
                <Environment
                    files={backgrounds.get(hdri)}
                    intensity={envIntensity}
                    blur={envBlur.value}
                />

                {/* VISUAL HDRI */}
                <HDRISphere
                    key={hdri}
                    hdri={hdri}
                    y={sphereY.value}
                />

                {/* CONTACT SHADOWS */}
                <ContactShadows
                    position={[0, 0.01, 0]}
                    opacity={shadowOpacity.value}
                    scale={shadowScale.value}
                    blur={shadowBlur.value}
                    far={4}
                />

                {/* CAMERA CONTROLLER */}
                <CameraController
                    fov={camFov}
                    position={[camX, camY, camZ]}
                    rotation={[camRotX, camRotY, camRotZ]}
                />

                {/* MODEL - Pass props from chatbot */}
                <Model
                    isSpeaking={isSpeaking}
                    poseFromChat={pose}
                    morphsFromChat={expressions}
                />
                <ModernRoom />

            </Canvas>
        </div>
    );
}