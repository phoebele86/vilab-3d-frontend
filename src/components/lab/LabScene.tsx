import { CameraControls, CameraControlsImpl, Sparkles } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useRef, type ComponentType, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Vector3 } from 'three'

import { SUBJECT_BY_KEY } from '@/data/subjects'
import type { LabView, SubjectKey } from '@/types/subject'
import { BiologyStation } from '@/components/lab/BiologyStation'
import { ChemistryStation } from '@/components/lab/ChemistryStation'
import { LabBench } from '@/components/lab/LabBench'
import { PhysicsStation } from '@/components/lab/PhysicsStation'
import { Station } from '@/components/lab/Station'
import type { StationModelProps } from '@/components/lab/types'

type Point = [number, number, number]

type LabSceneProps = {
  activeView: LabView
  onSelect: (key: SubjectKey) => void
  reducedMotion: boolean
}

const FOV = 38
const HALF_FOV_TAN = Math.tan(((FOV / 2) * Math.PI) / 180)

const STATIONS: { key: SubjectKey; position: Point; labelHeight: number; Model: ComponentType<StationModelProps> }[] = [
  { key: 'physics', position: [-2.7, 0, 0.3], labelHeight: 3.0, Model: PhysicsStation },
  { key: 'chemistry', position: [0, 0, -0.5], labelHeight: 3.15, Model: ChemistryStation },
  { key: 'biology', position: [2.7, 0, 0.3], labelHeight: 3.0, Model: BiologyStation },
]

// halfWidth is how much of the scene must stay visible, so narrow screens pull the camera back
const VIEWS: Record<LabView, { target: Point; direction: Point; halfWidth: number; minDistance: number }> = {
  all: { target: [0, 1.1, 0], direction: [0, 0.38, 1], halfWidth: 4.5, minDistance: 9 },
  physics: { target: [-2.7, 1.3, 0.3], direction: [-0.18, 0.32, 1], halfWidth: 1.4, minDistance: 4.8 },
  chemistry: { target: [0, 1.45, -0.5], direction: [0, 0.32, 1], halfWidth: 1.4, minDistance: 4.8 },
  biology: { target: [2.7, 1.35, 0.3], direction: [0.18, 0.32, 1], halfWidth: 1.4, minDistance: 4.8 },
}

const getCameraPose = (view: LabView, aspect: number) => {
  const { target, direction, halfWidth, minDistance } = VIEWS[view]
  const distance = Math.max(minDistance, halfWidth / (HALF_FOV_TAN * aspect))
  const targetVector = new Vector3(...target)
  return {
    position: new Vector3(...direction).normalize().multiplyScalar(distance).add(targetVector),
    target: targetVector,
  }
}

const CameraRig = ({ activeView, reducedMotion }: Omit<LabSceneProps, 'onSelect'>) => {
  const controls = useRef<CameraControlsImpl>(null)
  const isPlaced = useRef(false)
  const aspect = useThree(({ size }) => size.width / Math.max(size.height, 1))

  // Left-drag / one-finger rotate only, so the mouse wheel keeps scrolling the page
  useEffect(() => {
    if (!controls.current) return
    const { ACTION } = CameraControlsImpl
    Object.assign(controls.current.mouseButtons, { wheel: ACTION.NONE, middle: ACTION.NONE, right: ACTION.NONE })
    Object.assign(controls.current.touches, { two: ACTION.NONE, three: ACTION.NONE })
  }, [])

  useEffect(() => {
    const { position, target } = getCameraPose(activeView, aspect)
    const shouldAnimate = isPlaced.current && !reducedMotion
    controls.current?.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, shouldAnimate)
    isPlaced.current = true
  }, [activeView, aspect, reducedMotion])

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={0.55}
      minDistance={3}
      maxDistance={22}
      minPolarAngle={0.3}
      maxPolarAngle={1.45}
      minAzimuthAngle={-1.0}
      maxAzimuthAngle={1.0}
    />
  )
}

export const LabScene = ({ activeView, onSelect, reducedMotion }: LabSceneProps) => {
  const { t } = useTranslation()
  const labelLayer = useRef<HTMLDivElement>(null)

  return (
    <div className="scene-fade relative h-full w-full">
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        camera={{ fov: FOV, position: [0, 4.6, 11] }}
        gl={{ antialias: true, alpha: true }}
        aria-label={t('hero.sceneLabel')}
        role="img"
      >
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#eef1e8', '#1f3b33', 0.6]} />
        <directionalLight
          position={[4, 9, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0005}
        />
        <pointLight position={[0, 3.5, 2.5]} intensity={6} distance={9} color="#fff3d6" />

        <LabBench />

        {STATIONS.map(({ key, position, labelHeight, Model }) => (
          <Station
            key={key}
            subject={SUBJECT_BY_KEY[key]}
            position={position}
            labelHeight={labelHeight}
            labelLayer={labelLayer as RefObject<HTMLElement>}
            activeView={activeView}
            onSelect={onSelect}
          >
            <Model reducedMotion={reducedMotion} />
          </Station>
        ))}

        {!reducedMotion && (
          <Sparkles
            count={45}
            scale={[11, 4.5, 6]}
            position={[0, 2.2, 0]}
            size={2.2}
            speed={0.18}
            opacity={0.35}
            color="#eef1e8"
          />
        )}

        <CameraRig activeView={activeView} reducedMotion={reducedMotion} />
      </Canvas>
      <div ref={labelLayer} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  )
}
