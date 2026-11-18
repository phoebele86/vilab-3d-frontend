import type { ReactNode } from 'react'

import { OrganLab } from '@/features/biology/organ/OrganLab'
import { MoleculeLab } from '@/features/chemistry/molecules/MoleculeLab'
import { ReactionLab } from '@/features/chemistry/reaction/ReactionLab'
import { LensLab } from '@/features/physics/lens/LensLab'
import type { LabProps } from '@/types/lab'

// models_3d.kind/key → the lab that renders it; null when the frontend has no lab for that model yet.
export const renderLab = (props: LabProps): ReactNode => {
  if (props.model.kind === 'glb') return <OrganLab {...props} />
  switch (props.model.key) {
    case 'lens':
      return <LensLab {...props} />
    case 'molecules':
      return <MoleculeLab {...props} />
    case 'reaction':
      return <ReactionLab {...props} />
    default:
      return null
  }
}
