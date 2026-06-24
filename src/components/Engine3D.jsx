import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Bounds, Center } from '@react-three/drei'
import * as THREE from 'three'

/* ════════════════════════════════════════════════════
   REAL ENGINE MODEL — loaded from /models/engine.glb
   (exported from the user's actual Creo V6 assembly)
   Drag to orbit (360°), auto-rotates when idle,
   click to explode parts outward, click again to reassemble.
   ════════════════════════════════════════════════════ */

const THEME_COLORS = [
  '#7C3AED', // purple
  '#0891B2', // cyan
  '#D97706', // gold
  '#9CA3AF', // neutral metal
]

/* Loads the GLB, centers it, recolors parts (since STEP export has no
   material data), and handles the explode animation by pushing each
   mesh outward from the model's center along its own direction vector. */
function RealEngine({ explodeT }) {
  const { scene } = useGLTF('/models/engine.glb')
  const group = useRef()

  // Clone once, assign colors + compute explode directions per mesh
  const prepared = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())

    const meshEntries = []
    let i = 0
    clone.traverse((child) => {
      if (child.isMesh) {
        // recolor — cycle through theme palette so the model isn't flat gray
        const color = THEME_COLORS[i % THEME_COLORS.length]
        child.material = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.65,
          roughness: 0.35,
        })
        child.castShadow = true
        child.receiveShadow = true

        // direction from overall center to this mesh's own center = explode direction
        const meshBox = new THREE.Box3().setFromObject(child)
        const meshCenter = meshBox.getCenter(new THREE.Vector3())
        const dir = meshCenter.clone().sub(center)
        if (dir.lengthSq() < 0.0001) dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        dir.normalize()

        child.userData.basePosition = child.position.clone()
        child.userData.explodeDir = dir
        meshEntries.push(child)
        i++
      }
    })

    return { object: clone, meshEntries, center }
  }, [scene])

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15
    prepared.meshEntries.forEach((mesh) => {
      const offset = mesh.userData.explodeDir.clone().multiplyScalar(explodeT * 40)
      mesh.position.copy(mesh.userData.basePosition).add(offset)
    })
  })

  return (
    <group ref={group}>
      <primitive object={prepared.object} />
    </group>
  )
}

/* animates the explode amount 0→1→0 on click */
function ExplodeController({ trigger, children }) {
  const t = useRef(0)
  const dir = useRef(0)
  const [, force] = useState(0)

  useFrame((_, delta) => {
    if (dir.current !== 0) {
      t.current += dir.current * delta * 0.9
      if (t.current >= 1) { t.current = 1; dir.current = -1 }
      if (t.current <= 0) { t.current = 0; dir.current = 0 }
      force(v => v + 1)
    }
  })

  useMemo(() => {
    if (trigger > 0) dir.current = 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return children(t.current)
}

/* fits the camera to the model size automatically so it always fills the frame */
function AutoFitCamera({ children }) {
  return (
    <Bounds fit clip observe margin={1.15}>
      <Center>{children}</Center>
    </Bounds>
  )
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.001, 0.001, 0.001]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  )
}

export default function Engine3D({ size = 320, fill = false }) {
  const [explodeTrigger, setExplodeTrigger] = useState(0)

  const wrapperStyle = fill
    ? { width: '100%', height: '100%', minHeight: 320 }
    : { width: size, height: size }

  return (
    <div
      onClick={() => setExplodeTrigger(v => v + 1)}
      style={{
        ...wrapperStyle,
        cursor: 'pointer',
        position: 'relative',
        touchAction: 'none',
      }}
      title="Drag to rotate · Click to explode view"
    >
      {/* glow behind the canvas, matches site theme */}
      <div style={{
        position: 'absolute', inset: -30, borderRadius: '24px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.16), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Canvas
        shadows
        camera={{ position: [350, 220, 420], fov: 40, near: 1, far: 5000 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[400, 500, 300]} intensity={1.6} castShadow />
        <pointLight position={[-300, -150, -250]} color="#0891B2" intensity={1.3} />
        <pointLight position={[300, 150, 250]} color="#7C3AED" intensity={1.2} />

        <Suspense fallback={<Loader />}>
          <AutoFitCamera>
            <ExplodeController trigger={explodeTrigger}>
              {(t) => <RealEngine explodeT={t} />}
            </ExplodeController>
          </AutoFitCamera>
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={150}
          maxDistance={1200}
          rotateSpeed={0.55}
        />
      </Canvas>

      {/* hint label */}
      <div style={{
        position: 'absolute', bottom: -30, left: 0, right: 0,
        textAlign: 'center', fontSize: '.68rem', fontFamily: 'var(--ff-mono)',
        color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', pointerEvents: 'none',
      }}>
        drag to rotate · scroll to zoom · click to explode
      </div>
    </div>
  )
}

/* Preload so the model starts fetching as soon as the JS bundle runs,
   rather than waiting for first render. */
useGLTF.preload('/models/engine.glb')
