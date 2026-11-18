import { useLayoutEffect, useMemo, useRef } from 'react'
import { MeshStandardMaterial, Vector3, type Group } from 'three'

import { SceneLabel } from '@/components/common/SceneCanvas'
import { BondMesh } from '@/features/chemistry/BondMesh'
import { orientBond } from '@/features/chemistry/bondGeometry'
import { getElementStyle } from '@/features/chemistry/elements'
import type { MoleculeStructure, Vector3Tuple } from '@/types/api'

type StaticBondProps = {
  start: Vector3Tuple
  end: Vector3Tuple
  order: number
  material: MeshStandardMaterial
}

const StaticBond = ({ start, end, order, material }: StaticBondProps) => {
  const group = useRef<Group>(null)
  useLayoutEffect(() => {
    if (group.current) orientBond(group.current, new Vector3(...start), new Vector3(...end))
  }, [start, end])
  return <BondMesh ref={group} order={order} material={material} />
}

type MoleculeModelProps = {
  structure: MoleculeStructure
  showLabels: boolean
}

export const MoleculeModel = ({ structure, showLabels }: MoleculeModelProps) => {
  const bondMaterial = useMemo(() => new MeshStandardMaterial({ color: '#d9ded2', roughness: 0.4 }), [])
  const { atoms, bonds } = structure

  return (
    <group>
      {atoms.map(({ el, pos }, index) => {
        const style = getElementStyle(el)
        return (
          <group key={index} position={pos}>
            <mesh>
              <sphereGeometry args={[style.radius, 32, 32]} />
              <meshStandardMaterial color={style.color} roughness={0.35} />
            </mesh>
            {showLabels && (
              <SceneLabel center zIndexRange={[10, 0]}>
                <span className="font-semibold text-board-deep drop-shadow-[0_0_2px_#fff]">{el}</span>
              </SceneLabel>
            )}
          </group>
        )
      })}
      {bonds.map(([a, b, order]) => (
        <StaticBond
          key={`${a}-${b}`}
          start={atoms[a].pos}
          end={atoms[b].pos}
          order={order}
          material={bondMaterial}
        />
      ))}
    </group>
  )
}
