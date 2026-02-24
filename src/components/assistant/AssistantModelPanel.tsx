import React, { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Box } from 'lucide-react'

function FallbackOrb() {
  return (
    <mesh>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial
        color={new THREE.Color('#7c3aed')}
        roughness={0.35}
        metalness={0.2}
        emissive={new THREE.Color('#22d3ee')}
        emissiveIntensity={0.18}
      />
    </mesh>
  )
}

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene} />
}

export function AssistantModelPanel({
  modelUrl = '/models/assistant.glb',
}: {
  modelUrl?: string
}) {
  const [hasModelError, setHasModelError] = useState(false)

  // If the model 404s or fails parsing, drei throws inside Suspense. We'll use a manual
  // preflight to avoid hard-crashing the canvas.
  const safeUrl = useMemo(() => modelUrl?.trim() || '', [modelUrl])

  return (
    <section className="relative h-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
      <header className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3">
        <div>
          <div className="text-sm font-extrabold tracking-[-0.01em] text-slate-900">Virtual Assistant</div>
          <div className="mt-0.5 text-[12px] text-slate-500">3D avatar preview</div>
        </div>
      </header>

      <div className="relative h-[520px] w-full sm:h-[640px] lg:h-full">
        <Canvas camera={{ position: [0, 0.2, 3.2], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={['#ffffff']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 4]} intensity={1.15} />
          <directionalLight position={[-6, 2, -3]} intensity={0.35} />

          <group position={[0, -0.15, 0]}>
            {!hasModelError && safeUrl ? (
              <Suspense fallback={<FallbackOrb />}>
                <ErrorBoundary3D onError={() => setHasModelError(true)}>
                  <Model url={safeUrl} />
                </ErrorBoundary3D>
              </Suspense>
            ) : (
              <FallbackOrb />
            )}
          </group>

          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.7} />
          <Environment preset="city" />
        </Canvas>

        {hasModelError && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 text-[12px] text-slate-600 shadow-[0_12px_30px_rgba(11,18,32,0.10)] backdrop-blur">
              <div className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-700">
                <Box className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">No model loaded</div>
                <div className="mt-0.5">Add a GLB at <span className="font-mono">public/models/assistant.glb</span> to render your avatar.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

class ErrorBoundary3D extends React.Component<{ onError: () => void; children: React.ReactNode }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

// Prevent drei warning spam when the file doesn't exist.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
useGLTF.preload?.('/models/assistant.glb')
