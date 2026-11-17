const WOOD = '#9a6640'
const WOOD_DARK = '#6e4529'

const LEG_POSITIONS: [number, number][] = [
  [-4.3, -1.85],
  [4.3, -1.85],
  [-4.3, 1.85],
  [4.3, 1.85],
]

// Bench top surface sits at y = 0
export const LabBench = () => (
  <group>
    <mesh position={[0, -0.12, 0]} receiveShadow>
      <boxGeometry args={[9.4, 0.24, 4.4]} />
      <meshStandardMaterial color={WOOD} roughness={0.75} />
    </mesh>
    <mesh position={[0, -0.27, 2.19]}>
      <boxGeometry args={[9.4, 0.1, 0.04]} />
      <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
    </mesh>
    {LEG_POSITIONS.map(([x, z]) => (
      <mesh key={`${x}:${z}`} position={[x, -1.45, z]}>
        <boxGeometry args={[0.2, 2.4, 0.2]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>
    ))}
  </group>
)
