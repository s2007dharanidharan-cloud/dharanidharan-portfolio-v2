import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════
   ENGINE 3D — Corrected node color map from geometry analysis
   ═══════════════════════════════════════════════════════════

  VERIFIED PART → NODE MAPPING (from GLB bounding box analysis):
  ──────────────────────────────────────────────────────────────
  Node  0  → ENGINE BLOCK main body (512×256×508)        → transparent white-gray
  Node  3  → CRANKSHAFT body (Y:-105..+106, Z full span, 7704 verts, asymmetric X = counterweights) → RED
  Node 34  → OIL PAN / sump (Y:-127..0, bottom only)    → BLACK
  Node 35  → CRANKSHAFT FRONT PULLEY (circular Ø165, at Z=257-303) → RED
  Nodes 1,2 → CRANK END CAPS (Ø132×22 at Z=±246)        → RED
  Node 36  → FRONT TIMING COVER (flat plate, 491×313×52) → mid-gray
  Node 37  → RIGHT CYLINDER HEAD (+X side)               → brown/copper
  Node101  → LEFT CYLINDER HEAD (−X side)                → brown/copper
  Node167  → VALVE COVER (top, 382×80×457)               → BLUE
  Node168  → RIGHT EXHAUST MANIFOLD (+X outer)           → BROWN-RED
  Node169  → LEFT EXHAUST MANIFOLD (−X outer)            → BROWN-RED
  Node165  → LEFT EXHAUST PIPE (extends −X)              → BROWN-RED
  Node166  → RIGHT EXHAUST PIPE (extends +X)             → BROWN-RED
  Node174  → INTERCOOLER / upper pipe                    → dark gray
  Node175  → INTAKE HOSE large                           → dark gray
  Nodes 170,171 → TURBO INLET FLANGES                   → yellow
  Nodes 172,173 → TURBOCHARGER HOUSINGS                 → yellow
  Nodes 176,177 → TURBO IMPELLER WHEELS                 → yellow
  Pistons ×6 (8,13,18,23,28,33) + sub-parts             → blue
*/

const NODE_COLOR_MAP = {}

function assign(nodes, color, opacity, transparent) {
  nodes.forEach(n => {
    NODE_COLOR_MAP[n] = { color, opacity: opacity || 1, transparent: transparent || false }
  })
}

// ── ENGINE BLOCK → transparent white-gray
assign([0], '#B8C0CC', 0.18, true)

// ── CRANKSHAFT ASSEMBLY → RED
//    Node 3  = crankshaft body (journals + counterweights, full Z span, Y centered)
//    Node 35 = front crankshaft pulley / harmonic balancer
//    Nodes 1,2 = rear end cap seals at Z=±246
assign([3, 35, 1, 2], '#CC1A1A', 1)

// ── OIL PAN (bottom sump, Y:-127..0) → BLACK
assign([34], '#111114', 1)

// ── FRONT TIMING COVER (flat plate at Z=280) → mid-gray
assign([36], '#00040a', 0.18, true)

// ── CYLINDER HEADS both sides → brown/copper (distinct from exhaust manifold)
assign([37, 101], '#eceae6', 1)

// ── VALVE COVER top → BLUE
assign([167], '#e08916', 1)

// ── EXHAUST MANIFOLDS both sides + exhaust pipes → BROWN-RED
assign([168, 169, 165, 166], '#473bf1', 1)

// ── INTAKE HOSES / INTERCOOLER → dark gray
assign([174, 175], '#3D3D45', 1)

// ── PISTON SUB-ASSEMBLIES (×6) → blue
// Piston bodies
assign([8, 13, 18, 23, 28, 33], '#3bb8df', 1)
// Connecting rods
assign([4, 9, 14, 19, 24, 29], '#3bb8df', 1)
// Piston rings
assign([5, 10, 15, 20, 25, 30], '#3bb8df', 1)
// Wrist pins
assign([6, 11, 16, 21, 26, 31], '#3bb8df', 1)
// Pin bolts / big-end caps
assign([7, 12, 17, 22, 27, 32], '#3bb8df', 1)

// ── TURBOCHARGER ASSEMBLY → yellow
assign([170, 171], '#E8C820', 1) // inlet flanges
assign([172, 173], '#E8C820', 1) // housings
assign([176, 177], '#E8C820', 1) // impeller wheels

// ── HEAD BOLTS ×12 → silver-gray
assign([46, 110, 92, 156, 47, 111, 48, 112, 45, 109, 44, 108], '#909898', 1)

// ── CYLINDER SIDE FLANGES ×12 → silver-gray
assign([49, 113, 56, 63, 70, 77, 84, 120, 127, 134, 141, 148], '#909898', 1)

// ── OUTER BOLTS ×8 → silver-gray
assign([97, 98, 99, 100, 161, 162, 163, 164], '#909898', 1)

// ── BOLT FACES ×12 → silver-gray
assign([136, 115, 58, 72, 79, 86, 122, 143, 150, 51, 65, 129], '#909898', 1)

// ── TINY STUDS ×12 → silver-gray
assign([57, 78, 85, 121, 142, 149, 64, 128, 50, 71, 114, 135], '#909898', 1)

// ── BOLT HEADS small ×24 → silver-gray
assign([68, 69, 54, 55, 132, 133, 139, 140, 61, 62, 75, 76,
        118, 125, 126, 82, 83, 89, 90, 146, 147, 153, 154, 119], '#909898', 1)

// ── SPARK PLUGS tiny → light silver
assign([67, 66, 130, 131, 52, 117, 116, 53, 59, 60, 73, 74,
        123, 124, 80, 81, 87, 88, 144, 145, 151, 152, 137, 138,
        93, 94, 95, 96, 157, 158, 159, 160], '#D0D8E0', 1)

// Fallback for any unmapped node
const FALLBACK = '#909898'

function RealEngine({ explodeT }) {
  const { scene } = useGLTF('/models/engine.glb')
  const groupRef = useRef()
  const fitted = useRef(false)

  const prepared = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    const meshEntries = []
    let nodeIndex = 0

    clone.traverse((child) => {
      if (!child.isMesh) return

      const cfg = NODE_COLOR_MAP[nodeIndex] || { color: FALLBACK, opacity: 1, transparent: false }
      const isTransparent = cfg.transparent

      if (isTransparent) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(cfg.color),
          metalness: 0.2,
          roughness: 0.05,
          transparent: true,
          opacity: cfg.opacity,
          side: THREE.DoubleSide,
          depthWrite: false,
          transmission: 0.65,
        })
      } else {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cfg.color),
          metalness: 0.58,
          roughness: 0.28,
        })
      }

      child.castShadow = !isTransparent
      child.receiveShadow = true

      const mb = new THREE.Box3().setFromObject(child)
      const mc = mb.getCenter(new THREE.Vector3())
      const dir = mc.clone().sub(center)
      if (dir.lengthSq() < 0.001) dir.set(Math.random() - .5, Math.random() - .5, Math.random() - .5)
      dir.normalize()

      child.userData.basePos = child.position.clone()
      child.userData.dir = dir
      child.userData.dist = maxDim * (0.06 + Math.random() * 0.025)

      meshEntries.push(child)
      nodeIndex++
    })

    return { object: clone, meshEntries }
  }, [scene])

  useFrame(({ camera }, delta) => {
    if (!fitted.current && groupRef.current) {
      const b = new THREE.Box3().setFromObject(groupRef.current)
      if (!b.isEmpty()) {
        const sz = b.getSize(new THREE.Vector3())
        const c = b.getCenter(new THREE.Vector3())
        const d = Math.max(sz.x, sz.y, sz.z)
        camera.position.set(c.x + d * 0.3, c.y + d * 0.2, c.z + d * 2.8)
        camera.lookAt(c)
        camera.near = d * 0.001
        camera.far = d * 25
        camera.updateProjectionMatrix()
        fitted.current = true
      }
    }
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.10
    prepared.meshEntries.forEach(mesh => {
      const offset = mesh.userData.dir.clone().multiplyScalar(explodeT * mesh.userData.dist)
      mesh.position.copy(mesh.userData.basePos).add(offset)
    })
  })

  return (
    <group ref={groupRef}>
      <primitive object={prepared.object} />
    </group>
  )
}

function ExplodeController({ trigger, children }) {
  const t = useRef(0)
  const dir = useRef(0)
  const [, force] = useState(0)

  useFrame((_, delta) => {
    if (dir.current !== 0) {
      t.current = Math.max(0, Math.min(1, t.current + dir.current * delta * 1.1))
      if (t.current >= 1 || t.current <= 0) dir.current = 0
      force(v => v + 1)
    }
  })

  useMemo(() => {
    if (trigger > 0) dir.current = t.current >= 0.95 ? -1 : 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return children(t.current)
}

function Loader() {
  return <mesh><boxGeometry args={[0.001, 0.001, 0.001]} /><meshBasicMaterial visible={false} /></mesh>
}

export default function Engine3D() {
  const [explodeTrigger, setExplodeTrigger] = useState(0)
  const [exploded, setExploded] = useState(false)

  return (
    <div
      onClick={() => { setExplodeTrigger(v => v + 1); setExploded(v => !v) }}
      style={{ width: '100%', height: '100%', cursor: 'pointer', position: 'relative', touchAction: 'none', minHeight: 400 }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 55% 50%, rgba(26,86,204,0.10) 0%, rgba(8,145,178,0.05) 50%, transparent 80%)',
        pointerEvents: 'none', borderRadius: 16,
      }} />

 <Canvas
  shadows
  camera={{ position: [0, 400, 6000], fov: 28, near: 1, far: 15000 }}
  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  style={{ background: 'transparent', width: '100%', height: '100%' }}
  dpr={[1, 1.5]}
>
        <ambientLight intensity={1.1} />
        <directionalLight position={[400, 600, 350]} intensity={2.4} castShadow color="#fff8f0" />
        <directionalLight position={[-350, 250, -300]} intensity={1.1} color="#e0eeff" />
        <directionalLight position={[0, -300, 200]} intensity={0.6} color="#ffe8c0" />
        <pointLight position={[300, 200, 300]} color="#c0d8ff" intensity={1.3} distance={2000} />
        <pointLight position={[-250, 100, -200]} color="#ffd080" intensity={0.9} distance={1800} />

        <Suspense fallback={<Loader />}>
          <Center>
            <ExplodeController trigger={explodeTrigger}>
              {(t) => <RealEngine explodeT={t} />}
            </ExplodeController>
          </Center>
        </Suspense>

        <OrbitControls enableZoom enablePan rotateSpeed={0.6} zoomSpeed={0.8} />
      </Canvas>

      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center',
        fontSize: '.68rem', fontFamily: 'var(--ff-mono,monospace)',
        color: 'rgba(255,255,255,.38)', letterSpacing: '.08em', pointerEvents: 'none',
      }}>
        drag to rotate · scroll to zoom · click to {exploded ? 'assemble' : 'explode'}
      </div>

      {exploded && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(26,86,204,0.82)', border: '1px solid rgba(100,140,255,0.5)',
          borderRadius: 6, padding: '3px 9px', fontSize: '.62rem',
          fontFamily: 'var(--ff-mono,monospace)', color: '#c8d8ff',
          letterSpacing: '.1em', pointerEvents: 'none',
        }}>EXPLODE VIEW</div>
      )}
    </div>
  )
}

useGLTF.preload('/models/engine.glb')
