import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { MathUtils, type MeshStandardMaterial } from 'three'

import type { LabView, Subject, SubjectKey } from '@/types/subject'

type StationProps = {
  subject: Subject
  position: [number, number, number]
  labelHeight: number
  labelLayer: RefObject<HTMLElement>
  activeView: LabView
  onSelect: (key: SubjectKey) => void
  children: ReactNode
}

export const Station = ({
  subject,
  position,
  labelHeight,
  labelLayer,
  activeView,
  onSelect,
  children,
}: StationProps) => {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const ringMaterial = useRef<MeshStandardMaterial>(null)
  const isActive = activeView === subject.key
  const isDimmed = activeView !== 'all' && !isActive

  useFrame((_, delta) => {
    if (!ringMaterial.current) return
    const target = isActive ? 1.8 : isHovered ? 1.1 : 0.3
    ringMaterial.current.emissiveIntensity = MathUtils.damp(
      ringMaterial.current.emissiveIntensity,
      target,
      6,
      delta,
    )
  })

  useEffect(() => {
    document.body.style.cursor = isHovered ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [isHovered])

  return (
    <group position={position}>
      <group
        onClick={(event) => {
          event.stopPropagation()
          onSelect(subject.key)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setIsHovered(true)
        }}
        onPointerOut={() => setIsHovered(false)}
      >
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[1.05, 1.12, 0.08, 48]} />
          <meshStandardMaterial color="#2c3e3a" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.93, 1.0, 64]} />
          <meshStandardMaterial
            ref={ringMaterial}
            color={subject.chalkColor}
            emissive={subject.chalkColor}
            emissiveIntensity={0.3}
            toneMapped={false}
          />
        </mesh>
        <group position={[0, 0.08, 0]}>{children}</group>
      </group>

      {/* A fixed portal target avoids drei unmounting the first label when the canvas event source changes */}
      <Html position={[0, labelHeight, 0]} center zIndexRange={[20, 0]} portal={labelLayer}>
        <button
          type="button"
          onClick={() => onSelect(subject.key)}
          aria-pressed={isActive}
          className={`pointer-events-auto cursor-pointer rounded-md px-2 py-1 text-center font-chalk whitespace-nowrap chalk-glow transition-opacity duration-300 ${
            isDimmed ? 'opacity-45 hover:opacity-90' : 'opacity-100'
          }`}
        >
          <span
            className={`block text-[26px] leading-none ${isActive ? 'underline decoration-2 underline-offset-6' : ''}`}
            style={{ color: subject.chalkColor }}
          >
            {t(`subjects.${subject.key}.name`)}
          </span>
          <span className="mt-1 hidden text-[17px] leading-none text-chalk/80 sm:block">{t(`subjects.${subject.key}.modelName`)}</span>
        </button>
      </Html>
    </group>
  )
}
