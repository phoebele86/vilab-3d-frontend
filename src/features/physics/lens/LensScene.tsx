import { Line, OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DoubleSide, Vector2 } from 'three'

import { SceneCanvas, SceneLabel } from '@/components/common/SceneCanvas'
import {
  getPrincipalRays,
  type LensImage,
  type LensSetup,
  type LensType,
} from '@/features/physics/lens/lensOptics'
import { RAY_COLORS } from '@/features/physics/lens/rayColors'

// Scene units are centimetres, the same as the lens setup.
const X_MIN = -50
const X_MAX = 60
const LENS_RADIUS = 14
const AXIS_TICKS = Array.from({ length: 11 }, (_, i) => X_MIN + i * 10)

const getHalfThickness = (lensType: LensType, radius: number) => {
  const edge = (radius / LENS_RADIUS) ** 2
  return lensType === 'converging' ? 0.15 + 1.1 * (1 - edge) : 0.25 + 1.1 * edge
}

const buildLensProfile = (lensType: LensType) => {
  const radii = Array.from({ length: 25 }, (_, i) => (i / 24) * LENS_RADIUS)
  return [
    ...radii.map((r) => new Vector2(r, -getHalfThickness(lensType, r))),
    ...radii.toReversed().map((r) => new Vector2(r, getHalfThickness(lensType, r))),
  ]
}

type ArrowProps = {
  x: number
  height: number
  color: string
  isGhost?: boolean
}

const Arrow = ({ x, height, color, isGhost = false }: ArrowProps) => {
  const length = Math.abs(height)
  const head = Math.min(1.6, length * 0.4)
  const shaft = length - head
  const material = <meshStandardMaterial color={color} transparent={isGhost} opacity={isGhost ? 0.45 : 1} />

  return (
    // A negative Y scale flips the arrow for inverted images.
    <group position={[x, 0, 0]} scale={[1, Math.sign(height) || 1, 1]}>
      <mesh position={[0, shaft / 2, 0]}>
        <cylinderGeometry args={[0.18, 0.18, shaft, 12]} />
        {material}
      </mesh>
      <mesh position={[0, shaft + head / 2, 0]}>
        <coneGeometry args={[0.6, head, 20]} />
        {material}
      </mesh>
    </group>
  )
}

const AxisLabel = ({ x, y = -2.4, text }: { x: number; y?: number; text: string }) => (
  <SceneLabel position={[x, y, 0]} center zIndexRange={[10, 0]}>
    <span className="pointer-events-none font-chalk text-base whitespace-nowrap text-chalk">{text}</span>
  </SceneLabel>
)

type LensSceneProps = {
  setup: LensSetup
  image: LensImage | null
}

export const LensScene = ({ setup, image }: LensSceneProps) => {
  const { t } = useTranslation()
  const profile = useMemo(() => buildLensProfile(setup.lensType), [setup.lensType])
  const rays = getPrincipalRays(setup, image, X_MAX)
  const f = setup.focalLength
  const isImageVisible =
    image !== null && image.distance > X_MIN && image.distance < X_MAX && Math.abs(image.height) < 30

  return (
    <SceneCanvas camera={{ position: [5, 6, 95], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[20, 30, 40]} intensity={1.4} />

      <Line points={[[X_MIN, 0, 0], [X_MAX, 0, 0]]} color="#b9c4b8" lineWidth={1} />
      {AXIS_TICKS.map((x) => (
        <Line key={x} points={[[x, -0.5, 0], [x, 0.5, 0]]} color="#b9c4b8" lineWidth={1} />
      ))}

      {/* Lathe revolves around Y; rotating it puts the optical axis along X. */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <latheGeometry args={[profile, 64]} />
        <meshStandardMaterial
          color="#bfe3f2"
          transparent
          opacity={0.35}
          roughness={0.05}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {[-2 * f, -f, f, 2 * f].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#eef1e8" />
        </mesh>
      ))}
      <AxisLabel x={-f} text="F" />
      <AxisLabel x={f} text="F′" />
      <AxisLabel x={-2 * f} text="2F" />
      <AxisLabel x={2 * f} text="2F′" />
      <AxisLabel x={0} y={-LENS_RADIUS - 2} text="O" />

      <Arrow x={-setup.objectDistance} height={setup.objectHeight} color="#f5c451" />
      <AxisLabel x={-setup.objectDistance} y={setup.objectHeight + 2} text={t('lens.objectLabel')} />

      {isImageVisible && (
        <>
          <Arrow x={image.distance} height={image.height} color="#c4a7f5" isGhost={!image.isReal} />
          <AxisLabel
            x={image.distance}
            y={image.height + Math.sign(image.height || 1) * 2}
            text={image.isReal ? t('lens.realImageLabel') : t('lens.virtualImageLabel')}
          />
        </>
      )}

      {rays.map(({ key, path, extension }) => (
        <group key={key}>
          <Line points={path.map(([x, y]) => [x, y, 0])} color={RAY_COLORS[key]} lineWidth={2} />
          {extension && (
            <Line
              points={extension.map(([x, y]) => [x, y, 0])}
              color={RAY_COLORS[key]}
              lineWidth={1.5}
              dashed
              dashSize={1.2}
              gapSize={0.9}
            />
          )}
        </group>
      ))}

      <OrbitControls
        makeDefault
        target={[5, 0, 0]}
        enablePan={false}
        minDistance={40}
        maxDistance={150}
        minAzimuthAngle={-0.9}
        maxAzimuthAngle={0.9}
        minPolarAngle={Math.PI / 2 - 0.7}
        maxPolarAngle={Math.PI / 2 + 0.4}
      />
    </SceneCanvas>
  )
}
