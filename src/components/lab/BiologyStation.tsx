import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { CatmullRomCurve3, Vector3, type Group } from 'three'

import type { StationModelProps } from '@/components/lab/types'

type Base = 'A' | 'T' | 'G' | 'C'

const PAIR_COUNT = 22
const TURNS = 2
const RADIUS = 0.45
const BOTTOM = 0.3
const HEIGHT = 2.2
const STRAND_A_COLOR = '#f29bb8'
const STRAND_B_COLOR = '#eef1e8'
const SEQUENCE = 'ATGCGTACCTAGGCATTCGAAT'

const BASE_COLORS: Record<Base, string> = {
  A: '#f5c451',
  T: '#8cc7f2',
  G: '#7fd6a4',
  C: '#e0605a',
}
const COMPLEMENT: Record<Base, Base> = { A: 'T', T: 'A', G: 'C', C: 'G' }

const RUNGS = Array.from({ length: PAIR_COUNT }, (_, index) => {
  const progress = index / (PAIR_COUNT - 1)
  const base = SEQUENCE[index % SEQUENCE.length] as Base
  return {
    y: BOTTOM + progress * HEIGHT,
    angle: progress * TURNS * Math.PI * 2,
    base,
    pair: COMPLEMENT[base],
  }
})

const toStrand = (offset: number) =>
  new CatmullRomCurve3(
    RUNGS.map(({ y, angle }) => new Vector3(Math.cos(angle + offset) * RADIUS, y, Math.sin(angle + offset) * RADIUS)),
  )

const STRANDS = [
  { curve: toStrand(0), color: STRAND_A_COLOR },
  { curve: toStrand(Math.PI), color: STRAND_B_COLOR },
]

export const BiologyStation = ({ reducedMotion }: StationModelProps) => {
  const helix = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!reducedMotion && helix.current) helix.current.rotation.y += delta * 0.45
  })

  return (
    <group ref={helix}>
      {STRANDS.map(({ curve, color }) => (
        <mesh key={color} castShadow>
          <tubeGeometry args={[curve, 160, 0.04, 10, false]} />
          <meshStandardMaterial color={color} roughness={0.35} />
        </mesh>
      ))}

      {RUNGS.map(({ y, angle, base, pair }) => (
        // Rotating by -angle around y maps (x, 0, 0) onto the strand point at that angle
        <group key={y} position={[0, y, 0]} rotation={[0, -angle, 0]}>
          {[
            { x: RADIUS / 2, color: BASE_COLORS[base] },
            { x: -RADIUS / 2, color: BASE_COLORS[pair] },
          ].map(({ x, color }) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, RADIUS, 8]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
          ))}
          {[
            { x: RADIUS, color: STRAND_A_COLOR },
            { x: -RADIUS, color: STRAND_B_COLOR },
          ].map(({ x, color }) => (
            <mesh key={x} position={[x, 0, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color={color} roughness={0.35} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
