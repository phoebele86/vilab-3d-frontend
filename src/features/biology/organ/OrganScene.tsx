import { Bounds, OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Box3, Mesh, MeshStandardMaterial, Vector3, type Group, type Object3D } from 'three'

import { SceneCanvas, SceneLabel } from '@/components/common/SceneCanvas'
import { useLocalizedText } from '@/hooks/useLocalizedText'
import { assetUrl } from '@/lib/assets'
import type { ModelStructure } from '@/types/api'

const EXPLODE_DISTANCE = 0.8
const boundingBox = new Box3()

const findStructure = (object: Object3D | null, names: Set<string>): string | null => {
  if (!object) return null
  return names.has(object.name) ? object.name : findStructure(object.parent, names)
}

const isInside = (object: Object3D | null, name: string): boolean =>
  object !== null && (object.name === name || isInside(object.parent, name))

type OrganModelProps = {
  path: string
  structures: ModelStructure[]
  selected: string | null
  hovered: string | null
  explode: number
  isIsolated: boolean
  onHover: (node: string | null) => void
  onSelect: (node: string | null) => void
}

const OrganModel = ({ path, structures, selected, hovered, explode, isIsolated, onHover, onSelect }: OrganModelProps) => {
  const localize = useLocalizedText()
  const { scene: source } = useGLTF(assetUrl(path))
  const names = useMemo(() => new Set(structures.map(({ node }) => node)), [structures])
  const labelAnchor = useRef<Group>(null)

  const { scene, parts } = useMemo(() => {
    const scene = source.clone(true)
    // Parts share materials by category, so each mesh gets its own copy before highlighting.
    scene.traverse((object) => {
      if (object instanceof Mesh) object.material = (object.material as MeshStandardMaterial).clone()
    })
    scene.updateMatrixWorld(true)
    const centre = boundingBox.setFromObject(scene).getCenter(new Vector3())

    // Only leaf structures move apart; a group such as "right-lung" moves with its lobes.
    const leaves = [...names].filter((name) =>
      [...names].every((other) => other === name || !scene.getObjectByName(name)?.getObjectByName(other)),
    )
    const parts = leaves.flatMap((name) => {
      const object = scene.getObjectByName(name)
      if (!object?.parent) return []
      const partCentre = new Box3().setFromObject(object).getCenter(new Vector3())
      const target = object.getWorldPosition(new Vector3()).addScaledVector(partCentre.sub(centre), EXPLODE_DISTANCE)
      return [{ object, origin: object.position.clone(), exploded: object.parent.worldToLocal(target) }]
    })
    return { scene, parts }
  }, [source, names])

  useLayoutEffect(() => {
    parts.forEach(({ object, origin, exploded }) => object.position.lerpVectors(origin, exploded, explode))
  }, [parts, explode])

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return
      const material = object.material as MeshStandardMaterial
      const isSelected = selected !== null && isInside(object, selected)
      const isHovered = hovered !== null && isInside(object, hovered)
      const isFaded = isIsolated && selected !== null && !isSelected
      material.emissive.set(isSelected ? '#f5c451' : isHovered ? '#8cc7f2' : '#000000')
      material.emissiveIntensity = isSelected ? 0.5 : isHovered ? 0.35 : 0
      material.transparent = isFaded
      material.opacity = isFaded ? 0.15 : 1
      material.depthWrite = !isFaded
    })
    document.body.style.cursor = hovered ? 'pointer' : ''
  }, [scene, selected, hovered, isIsolated])

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  useFrame(() => {
    const target = selected ? scene.getObjectByName(selected) : null
    if (target && labelAnchor.current) boundingBox.setFromObject(target).getCenter(labelAnchor.current.position)
  })

  const label = localize(structures.find(({ node }) => node === selected)?.label)

  return (
    <>
      <primitive
        object={scene}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation()
          onHover(findStructure(event.object, names))
        }}
        onPointerOut={() => onHover(null)}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation()
          onSelect(findStructure(event.object, names))
        }}
      />
      <group ref={labelAnchor}>
        {label && (
          <SceneLabel center zIndexRange={[20, 0]}>
            <span className="rounded-md bg-board-deep/85 px-2 py-1 font-chalk text-lg whitespace-nowrap text-chalk">
              {label}
            </span>
          </SceneLabel>
        )}
      </group>
    </>
  )
}

export const OrganScene = (props: OrganModelProps) => (
  // Models are in metres (a heart is ~15 cm), so the near plane must sit close to the camera.
  <SceneCanvas
    camera={{ position: [0, 0, 0.6], fov: 40, near: 0.01, far: 20 }}
    dpr={[1, 2]}
    gl={{ alpha: true }}
    onPointerMissed={() => props.onSelect(null)}
  >
    <hemisphereLight args={['#ffffff', '#1f3b33', 1.1]} />
    <directionalLight position={[1, 2, 3]} intensity={1.6} />
    <directionalLight position={[-2, -1, -2]} intensity={0.5} />
    <Suspense fallback={null}>
      <Bounds fit clip margin={1.3}>
        <OrganModel {...props} />
      </Bounds>
    </Suspense>
    <OrbitControls makeDefault enablePan={false} />
  </SceneCanvas>
)
