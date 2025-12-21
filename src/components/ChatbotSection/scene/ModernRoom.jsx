import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const room = '/models/modern_room.glb';

export default function ModernRoom(props) {
    const groupRef = useRef(null)
    const { nodes, materials, scene } = useGLTF(room);

    return (
        <group ref={groupRef} {...props} dispose={null} scale={7} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <primitive object={scene}/>
        </group>
    )
}