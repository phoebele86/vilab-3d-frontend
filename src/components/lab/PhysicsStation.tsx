import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

const GRAVITY = 9.8
// One scene unit equals one metre, so the period is 2π√(L/g) ≈ 2.5 s
const LENGTH = 1.6
const PIVOT_Y = 2.3
const START_ANGLE = 0.55
const SUBSTEPS = 4

const METAL = { color: '#aab3bb', metalness: 0.8, roughness: 0.3 }

export const PhysicsStation = () => {
  const arm = useRef<Group>(null)
  const motion = useRef({ theta: START_ANGLE, omega: 0 })

  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 30) / SUBSTEPS
    const state = motion.current
    // Semi-implicit Euler on θ'' = -(g/L)·sin θ keeps the swing energy stable
    for (let i = 0; i < SUBSTEPS; i++) {
      state.omega += -(GRAVITY / LENGTH) * Math.sin(state.theta) * step
      state.theta += state.omega * step
    }
    if (arm.current) arm.current.rotation.z = state.theta
  })

  return (
    <group>
      {/* Posts run along z so the bob swings sideways without hitting them */}
      {[-0.7, 0.7].map((z) => (
        <mesh key={z} position={[0, PIVOT_Y / 2, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, PIVOT_Y, 16]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      ))}
      <mesh position={[0, PIVOT_Y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.48, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>

      <mesh position={[0, PIVOT_Y, 0]} rotation={[0, 0, -Math.PI / 2 - START_ANGLE]}>
        <torusGeometry args={[LENGTH * 0.42, 0.01, 8, 48, START_ANGLE * 2]} />
        <meshBasicMaterial color="#eef1e8" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, PIVOT_Y - LENGTH / 2, 0]}>
        <cylinderGeometry args={[0.005, 0.005, LENGTH, 6]} />
        <meshBasicMaterial color="#eef1e8" transparent opacity={0.25} />
      </mesh>

      <group ref={arm} position={[0, PIVOT_Y, 0]}>
        <mesh position={[0, -LENGTH / 2, 0]}>
          <cylinderGeometry args={[0.012, 0.012, LENGTH, 8]} />
          <meshStandardMaterial color="#eef1e8" />
        </mesh>
        <mesh position={[0, -LENGTH, 0]} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#5aa9e6" metalness={0.35} roughness={0.25} />
        </mesh>
      </group>
    </group>
  )
}
