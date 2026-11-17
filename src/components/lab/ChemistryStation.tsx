import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { DoubleSide, Quaternion, Vector2, Vector3, type Group, type Mesh } from 'three'

import type { StationModelProps } from '@/components/lab/types'

type Point = [number, number, number]

// Erlenmeyer flask cross-section as [radius, height]
const FLASK_PROFILE: [number, number][] = [
  [0.001, 0],
  [0.6, 0],
  [0.66, 0.06],
  [0.66, 0.12],
  [0.22, 1.05],
  [0.2, 1.12],
  [0.2, 1.52],
  [0.25, 1.58],
]

const LIQUID_TOP = 0.55
const getBodyRadius = (y: number) => 0.66 - ((y - 0.12) * 0.44) / 0.93

const LIQUID_PROFILE: [number, number][] = [
  [0.001, 0.02],
  [0.58, 0.02],
  [0.62, 0.08],
  [getBodyRadius(LIQUID_TOP) - 0.03, LIQUID_TOP],
  [0.001, LIQUID_TOP],
]

const toPoints = (profile: [number, number][]) => profile.map(([x, y]) => new Vector2(x, y))

// Deterministic pseudo-random so bubbles stay identical between renders
const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

const BUBBLES = Array.from({ length: 10 }, (_, index) => ({
  angle: seeded(index, 1) * Math.PI * 2,
  radius: 0.08 + seeded(index, 2) * 0.3,
  speed: 0.25 + seeded(index, 3) * 0.35,
  phase: seeded(index, 4),
  size: 0.025 + seeded(index, 5) * 0.025,
}))

const Bubbles = () => {
  const meshes = useRef<(Mesh | null)[]>([])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    BUBBLES.forEach((bubble, index) => {
      const mesh = meshes.current[index]
      if (!mesh) return
      const progress = (time * bubble.speed + bubble.phase) % 1
      const wobble = Math.sin(time * 3 + index) * 0.015
      mesh.position.set(
        Math.cos(bubble.angle) * bubble.radius + wobble,
        0.06 + progress * (LIQUID_TOP - 0.1),
        Math.sin(bubble.angle) * bubble.radius,
      )
      mesh.scale.setScalar(0.6 + progress * 0.6)
    })
  })

  return BUBBLES.map((bubble, index) => (
    <mesh
      key={index}
      ref={(mesh) => {
        meshes.current[index] = mesh
      }}
    >
      <sphereGeometry args={[bubble.size, 12, 12]} />
      <meshStandardMaterial color="#fff6d8" transparent opacity={0.85} roughness={0.1} />
    </mesh>
  ))
}

const UP = new Vector3(0, 1, 0)

const Bond = ({ from, to }: { from: Point; to: Point }) => {
  const { position, quaternion, length } = useMemo(() => {
    const start = new Vector3(...from)
    const direction = new Vector3(...to).sub(start)
    return {
      position: start.clone().addScaledVector(direction, 0.5),
      quaternion: new Quaternion().setFromUnitVectors(UP, direction.clone().normalize()),
      length: direction.length(),
    }
  }, [from, to])

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.045, 0.045, length, 12]} />
      <meshStandardMaterial color="#d9ded2" roughness={0.4} />
    </mesh>
  )
}

// H–O–H bond angle of water is about 104.5°
const HALF_BOND_ANGLE = (104.5 / 2) * (Math.PI / 180)
const BOND_LENGTH = 0.42
const OXYGEN: Point = [0, 0, 0]
const HYDROGENS: Point[] = [1, -1].map((side) => [
  side * Math.sin(HALF_BOND_ANGLE) * BOND_LENGTH,
  -Math.cos(HALF_BOND_ANGLE) * BOND_LENGTH,
  0,
])

const WaterMolecule = ({ reducedMotion }: StationModelProps) => {
  const molecule = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!reducedMotion && molecule.current) molecule.current.rotation.y += delta * 0.6
  })

  return (
    <group ref={molecule}>
      <mesh position={OXYGEN} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#e0605a" roughness={0.35} />
      </mesh>
      {HYDROGENS.map((hydrogen) => (
        <group key={hydrogen[0]}>
          <Bond from={OXYGEN} to={hydrogen} />
          <mesh position={hydrogen} castShadow>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#f4f5f0" roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export const ChemistryStation = ({ reducedMotion }: StationModelProps) => {
  const flaskPoints = useMemo(() => toPoints(FLASK_PROFILE), [])
  const liquidPoints = useMemo(() => toPoints(LIQUID_PROFILE), [])

  return (
    <group>
      <mesh renderOrder={1}>
        <latheGeometry args={[liquidPoints, 48]} />
        <meshStandardMaterial
          color="#f5c451"
          emissive="#b8860b"
          emissiveIntensity={0.25}
          transparent
          opacity={0.88}
          roughness={0.2}
        />
      </mesh>
      <Bubbles />
      <mesh renderOrder={2} castShadow>
        <latheGeometry args={[flaskPoints, 48]} />
        <meshStandardMaterial
          color="#dff2ee"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.1}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <group position={[0, 2.3, 0]}>
        {reducedMotion ? (
          <WaterMolecule reducedMotion />
        ) : (
          <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.6}>
            <WaterMolecule reducedMotion={false} />
          </Float>
        )}
      </group>
    </group>
  )
}
