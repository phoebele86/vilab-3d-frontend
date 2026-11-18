import type { Ref } from 'react'
import type { Group, Material } from 'three'

// Parallel sticks for single, double and triple bonds, offset sideways from the bond axis.
const BOND_OFFSETS: Record<number, number[]> = { 1: [0], 2: [-0.09, 0.09], 3: [-0.13, 0, 0.13] }

type BondMeshProps = {
  order: number
  material: Material
  ref?: Ref<Group>
}

export const BondMesh = ({ order, material, ref }: BondMeshProps) => (
  <group ref={ref}>
    {(BOND_OFFSETS[order] ?? [0]).map((offset) => (
      <mesh key={offset} position={[offset, 0, 0]} material={material}>
        <cylinderGeometry args={[0.055, 0.055, 1, 12]} />
      </mesh>
    ))}
  </group>
)
