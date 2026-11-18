import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { LabShell } from '@/components/layout/LabShell'
import { LensPanel } from '@/features/physics/lens/LensPanel'
import { LensScene } from '@/features/physics/lens/LensScene'
import { getLensImage, type LensSetup } from '@/features/physics/lens/lensOptics'
import { useLocalizedText } from '@/hooks/useLocalizedText'
import type { LabProps } from '@/types/lab'

const DEFAULT_SETUP: LensSetup = {
  lensType: 'converging',
  focalLength: 10,
  objectDistance: 25,
  objectHeight: 3,
}

const readNumber = (value: unknown, fallback: number) => {
  const number = Number(value)
  return value !== null && Number.isFinite(number) && number > 0 ? number : fallback
}

// Lesson config comes from models_3d.config; ?d=&f=&h=&type= lets a solved problem open the same setup.
const resolveSetup = (config: Record<string, unknown>, params: URLSearchParams): LensSetup => ({
  lensType: (params.get('type') ?? config.lensType) === 'diverging' ? 'diverging' : 'converging',
  focalLength: readNumber(params.get('f') ?? config.focalLength, DEFAULT_SETUP.focalLength),
  objectDistance: readNumber(params.get('d') ?? config.objectDistance, DEFAULT_SETUP.objectDistance),
  objectHeight: readNumber(params.get('h') ?? config.objectHeight, DEFAULT_SETUP.objectHeight),
})

export const LensLab = ({ model, lessonLabel, toolbar }: LabProps) => {
  const localize = useLocalizedText()
  const [searchParams] = useSearchParams()
  const [setup, setSetup] = useState(() => resolveSetup(model.config, searchParams))
  const image = getLensImage(setup)
  const updateSetup = (patch: Partial<LensSetup>) => setSetup((current) => ({ ...current, ...patch }))

  return (
    <LabShell
      title={localize(model.name)}
      lessonLabel={lessonLabel}
      toolbar={toolbar}
      scene={<LensScene setup={setup} image={image} />}
      panel={<LensPanel setup={setup} image={image} onChange={updateSetup} />}
    />
  )
}
