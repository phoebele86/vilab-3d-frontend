import { Bounds, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import { MeshStandardMaterial, Vector3, type Group, type Mesh } from 'three'

import { SceneCanvas } from '@/components/common/SceneCanvas'
import { BondMesh } from '@/features/chemistry/BondMesh'
import { orientBond } from '@/features/chemistry/bondGeometry'
import { getElementStyle } from '@/features/chemistry/elements'
import { useReactionPlayback } from '@/features/chemistry/reaction/playbackStore'
import { getAtomPosition, getBondOpacities } from '@/features/chemistry/reaction/reactionTimeline'
import type { BondTuple, ReactionDetail, Vector3Tuple } from '@/types/api'

const getCentre = (points: Vector3Tuple[]): Vector3Tuple =>
  [0, 1, 2].map((axis) => points.reduce((sum, point) => sum + point[axis], 0) / points.length) as Vector3Tuple

// Every moving atom keeps its reactant index; product bonds are re-indexed onto those atoms.
const buildLayout = ({ left, right, mapping }: ReactionDetail) => {
  const targetOf = new Map(mapping.map(([from, to]) => [from, to]))
  const sourceOf = new Map(mapping.map(([from, to]) => [to, from]))
  const moleculeIds = [...new Set(left.atoms.map(({ molecule }) => molecule))]
  const centres = new Map(
    moleculeIds.map((id) => [
      id,
      getCentre(left.atoms.filter(({ molecule }) => molecule === id).map(({ pos }) => pos)),
    ]),
  )

  return {
    atoms: left.atoms.map(({ el, pos, molecule }, index) => ({
      el,
      from: pos,
      to: right.atoms[targetOf.get(index) ?? index].pos,
      centre: centres.get(molecule) ?? pos,
    })),
    reactantBonds: left.bonds,
    productBonds: right.bonds.map(
      ([a, b, order]): BondTuple => [sourceOf.get(a) ?? a, sourceOf.get(b) ?? b, order],
    ),
  }
}

const createBondMaterials = () => ({
  reactants: new MeshStandardMaterial({ color: '#d9ded2', roughness: 0.4, transparent: true }),
  products: new MeshStandardMaterial({ color: '#f5c451', roughness: 0.4, transparent: true }),
})

const ReactionAtoms = ({ reaction }: { reaction: ReactionDetail }) => {
  const layout = useMemo(() => buildLayout(reaction), [reaction])
  const positions = useMemo(() => layout.atoms.map(({ from }) => new Vector3(...from)), [layout])
  const [materials] = useState(createBondMaterials)
  // Bond opacity changes every frame, so the materials are mutated through a ref.
  const materialsRef = useRef(materials)
  const atomRefs = useRef<(Mesh | null)[]>([])
  const reactantBondRefs = useRef<(Group | null)[]>([])
  const productBondRefs = useRef<(Group | null)[]>([])

  useFrame((_, delta) => {
    const playback = useReactionPlayback.getState()
    if (playback.isPlaying) playback.advance(delta)
    const { progress } = useReactionPlayback.getState()

    layout.atoms.forEach(({ from, to, centre }, index) => {
      positions[index].set(...getAtomPosition(from, to, centre, progress))
      atomRefs.current[index]?.position.copy(positions[index])
    })

    const opacity = getBondOpacities(progress)
    materialsRef.current.reactants.opacity = opacity.reactants
    materialsRef.current.products.opacity = opacity.products
    const placeBonds = (bonds: BondTuple[], groups: (Group | null)[], isVisible: boolean) =>
      bonds.forEach(([a, b], index) => {
        const group = groups[index]
        if (!group) return
        group.visible = isVisible
        if (isVisible) orientBond(group, positions[a], positions[b])
      })
    placeBonds(layout.reactantBonds, reactantBondRefs.current, opacity.reactants > 0.01)
    placeBonds(layout.productBonds, productBondRefs.current, opacity.products > 0.01)
  })

  return (
    <group>
      {layout.atoms.map(({ el, from }, index) => {
        const style = getElementStyle(el)
        return (
          <mesh
            key={index}
            position={from}
            ref={(mesh) => {
              atomRefs.current[index] = mesh
            }}
          >
            <sphereGeometry args={[style.radius, 32, 32]} />
            <meshStandardMaterial color={style.color} roughness={0.35} />
          </mesh>
        )
      })}
      {layout.reactantBonds.map(([a, b, order], index) => (
        <BondMesh
          key={`r-${a}-${b}`}
          order={order}
          material={materials.reactants}
          ref={(group) => {
            reactantBondRefs.current[index] = group
          }}
        />
      ))}
      {layout.productBonds.map(([a, b, order], index) => (
        <BondMesh
          key={`p-${a}-${b}`}
          order={order}
          material={materials.products}
          ref={(group) => {
            productBondRefs.current[index] = group
          }}
        />
      ))}
    </group>
  )
}

export const ReactionScene = ({ reaction }: { reaction: ReactionDetail }) => (
  <SceneCanvas camera={{ position: [0, 0, 14], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
    <ambientLight intensity={0.7} />
    <directionalLight position={[4, 6, 8]} intensity={1.6} />
    <Bounds key={reaction.equation_key} fit clip margin={1.5}>
      <ReactionAtoms reaction={reaction} />
    </Bounds>
    <OrbitControls makeDefault enablePan={false} />
  </SceneCanvas>
)
