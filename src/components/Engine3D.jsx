import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

/* ════════════════════════════════════════════════════
   ENGINE 3D — Full area, bright unique part colors,
   transparent cylinders so pistons are visible,
   subtle explode (small distance), all parts move.
   ════════════════════════════════════════════════════ */

/* 
  Rich, bright, highly differentiated palette — 32 colors.
  Each part gets a UNIQUE color (no cycling repeats for nearby parts).
  Cylinder-like parts get transparency so pistons show through.
*/
const PART_COLORS = [
  '#f1efef', // engine body transparent white
  '#111010', // orange
  '#FFD700', // golden yellow
  '#39FF14', // neon green
  '#00FFFF', // cyan
  '#0080FF', // bright blue
  '#BF00FF', // violet
  '#FF00FF', // magenta
  '#FF1493', // deep pink
  '#00FF7F', // spring green
  '#FF8C00', // dark orange
  '#00BFFF', // deep sky blue
  '#7FFF00', // chartreuse
  '#FF69B4', // hot pink
  '#40E0D0', // turquoise
  '#9370DB', // medium purple
  '#20B2AA', // light sea green
  '#FF4500', // orange red
  '#1E90FF', // dodger blue
  '#ADFF2F', // green yellow
  '#FF6347', // tomato
  '#00FA9A', // medium spring green
  '#DA70D6', // orchid
  '#FFA500', // orange
  '#32CD32', // lime green
  '#FF007F', // rose
  '#00CED1', // dark turquoise
  '#FFB347', // peach orange
  '#87CEEB', // sky blue
  '#DDA0DD', // plum
  '#98FB98', // pale green
  '#F0E68C', // khaki
]

/* Keywords that suggest cylinder / bore shape — these get transparency */
const CYLINDER_HINTS = [
  'cylinder', 'bore', 'liner', 'sleeve', 'block', 'barrel',
  'housing', 'shell', 'case', 'body', 'cover', 'head',
]

function looksLikeCylinder(name = '') {
  const n = name.toLowerCase()
  return CYLINDER_HINTS.some(h => n.includes(h))
}

/* 
  Detect if a mesh is likely a cylinder by checking geometry aspect ratio.
  If the bounding box is roughly cylindrical (height >> width similar),
  it might be a piston bore. We also check by name.
*/
function isCylindricalMesh(mesh) {
  if (looksLikeCylinder(mesh.name)) return true
  const box = new THREE.Box3().setFromObject(mesh)
  const size = box.getSize(new THREE.Vector3())
  const maxXZ = Math.max(size.x, size.z)
  const minXZ = Math.min(size.x, size.z)
  // roughly cylindrical: XZ are similar to each other and height is > 0.5x width
  if (maxXZ > 0 && minXZ / maxXZ > 0.55 && size.y > maxXZ * 0.4) return true
  return false
}

function RealEngine({ explodeT }) {
  const { scene } = useGLTF('/models/engine.glb')
  const group = useRef()

  const prepared = useMemo(() => {
    const clone = scene.clone(true)

    // Compute overall bounding box center
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    const meshEntries = []
    let i = 0

    clone.traverse((child) => {
      if (!child.isMesh) return

      // Unique color per part — spread across the palette with a prime step
      // so adjacent parts (sequential indices) are far apart in color
      const colorIndex = (i * 7) % PART_COLORS.length
      const hexColor = PART_COLORS[colorIndex]
      const color = new THREE.Color(hexColor)

      const cylindrical = isCylindricalMesh(child)

      if (cylindrical) {
        // Transparent cylinder so pistons inside are visible
        child.material = new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.3,
          roughness: 0.1,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          depthWrite: false,
          transmission: 0.7,
          thickness: 0.5,
        })
      } else {
        child.material = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.55,
          roughness: 0.28,
          envMapIntensity: 1.2,
        })
      }

      child.castShadow = !cylindrical
      child.receiveShadow = true

      // Explode direction: from center to mesh center
      const meshBox = new THREE.Box3().setFromObject(child)
      const meshCenter = meshBox.getCenter(new THREE.Vector3())
      const dir = meshCenter.clone().sub(center)

      if (dir.lengthSq() < 0.0001) {
        dir.set(
          (Math.random() - 0.5),
          (Math.random() - 0.5),
          (Math.random() - 0.5)
        )
      }
      dir.normalize()

      child.userData.basePosition = child.position.clone()
      child.userData.explodeDir = dir
      // Scale explode distance to model size — small movement (8% of model size)
      child.userData.explodeDist = maxDim * 0.08 + Math.random() * maxDim * 0.04
      child.userData.isCylindrical = cylindrical

      meshEntries.push(child)
      i++
    })

    return { object: clone, meshEntries, center, maxDim }
  }, [scene])

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12

    prepared.meshEntries.forEach((mesh) => {
      const dist = mesh.userData.explodeDist
      const offset = mesh.userData.explodeDir.clone().multiplyScalar(explodeT * dist)
      mesh.position.copy(mesh.userData.basePosition).add(offset)
    })
  })

  return (
    <group ref={group}>
      <primitive object={prepared.object} />
    </group>
  )
}

/* Animates explode 0→1 on click, reverses on next click */
function ExplodeController({ trigger, children }) {
  const t = useRef(0)
  const dir = useRef(0)
  const [, force] = useState(0)

  useFrame((_, delta) => {
    if (dir.current !== 0) {
      t.current += dir.current * delta * 1.2
      if (t.current >= 1) { t.current = 1; dir.current = 0 }
      if (t.current <= 0) { t.current = 0; dir.current = 0 }
      force(v => v + 1)
    }
  })

  // Toggle: if fully exploded, collapse; otherwise explode
  useMemo(() => {
    if (trigger > 0) {
      dir.current = t.current >= 0.95 ? -1 : 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return children(t.current)
}

/* Auto-fits camera by computing model bounds and positioning camera */
function SceneSetup({ children }) {
  return (
    <Center>
      {children}
    </Center>
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

export default function Engine3D() {
  const [explodeTrigger, setExplodeTrigger] = useState(0)
  const [exploded, setExploded] = useState(false)

  const handleClick = () => {
    setExplodeTrigger(v => v + 1)
    setExploded(v => !v)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        touchAction: 'none',
        minHeight: 400,
      }}
    >
      {/* Ambient glow behind canvas */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(100,60,220,0.18) 0%, rgba(0,200,255,0.08) 50%, transparent 80%)',
        pointerEvents: 'none',
        borderRadius: '16px',
      }} />

      <Canvas
        shadows
        camera={{ position: [0, 0, 600], fov: 45, near: 1, far: 8000 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
        onCreated={({ camera, scene: threeScene }) => {
          // After model loads, fit camera to it
          setTimeout(() => {
            const box = new THREE.Box3().setFromObject(threeScene)
            if (!box.isEmpty()) {
              const s = box.getSize(new THREE.Vector3())
              const c = box.getCenter(new THREE.Vector3())
              const maxD = Math.max(s.x, s.y, s.z)
              camera.position.set(c.x + maxD * 0.6, c.y + maxD * 0.4, c.z + maxD * 1.1)
              camera.lookAt(c)
              camera.near = maxD * 0.001
              camera.far = maxD * 20
              camera.updateProjectionMatrix()
            }
          }, 800)
        }}
      >
        {/* Bright multi-angle lighting for vivid colors */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[500, 600, 400]} intensity={2.0} castShadow color="#ffffff" />
        <directionalLight position={[-400, 300, -300]} intensity={1.2} color="#e8f4ff" />
        <directionalLight position={[0, -400, 200]} intensity={0.7} color="#fff5e0" />
        <pointLight position={[300, 200, 300]} color="#ff80ff" intensity={1.5} distance={2000} />
        <pointLight position={[-300, 100, -200]} color="#00ffcc" intensity={1.2} distance={2000} />
        <pointLight position={[0, -200, 400]} color="#ffaa00" intensity={0.9} distance={2000} />

        <Suspense fallback={<Loader />}>
          <SceneSetup>
            <ExplodeController trigger={explodeTrigger}>
              {(t) => <RealEngine explodeT={t} />}
            </ExplodeController>
          </SceneSetup>
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          autoRotate={false}
        />
      </Canvas>

      {/* Status hint */}
      <div style={{
        position: 'absolute', bottom: 10, left: 0, right: 0,
        textAlign: 'center', fontSize: '.7rem',
        fontFamily: 'var(--ff-mono, monospace)',
        color: 'rgba(255,255,255,.45)',
        letterSpacing: '.08em', pointerEvents: 'none',
        userSelect: 'none',
      }}>
        drag to rotate · scroll to zoom · click to {exploded ? 'assemble' : 'explode'}
      </div>

      {/* Explode indicator */}
      {exploded && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(124,58,237,0.85)',
          border: '1px solid rgba(167,139,250,0.6)',
          borderRadius: '6px',
          padding: '4px 10px',
          fontSize: '.65rem',
          fontFamily: 'var(--ff-mono, monospace)',
          color: '#e9d5ff',
          letterSpacing: '.1em',
          pointerEvents: 'none',
        }}>
          EXPLODE VIEW
        </div>
      )}
    </div>
  )
}

useGLTF.preload('/models/engine.glb')
