import { describe, expect, it } from 'vitest'

import {
  getAtomPosition,
  getBondOpacities,
  getStageIndex,
  REACTION_STAGES,
} from '@/features/chemistry/reaction/reactionTimeline'

describe('reaction timeline', () => {
  it('walks through the five stages in order', () => {
    expect([0, 0.2, 0.5, 0.8, 1].map(getStageIndex)).toEqual([0, 1, 2, 3, 4])
    expect(REACTION_STAGES.at(-1)?.end).toBe(1)
  })

  it('fades reactant bonds out before product bonds fade in', () => {
    expect(getBondOpacities(0)).toEqual({ reactants: 1, products: 0 })
    expect(getBondOpacities(0.5)).toEqual({ reactants: 0, products: 0 })
    expect(getBondOpacities(1)).toEqual({ reactants: 0, products: 1 })
  })

  it('moves each atom from its reactant to its product position', () => {
    const from: [number, number, number] = [1, 0, 0]
    const to: [number, number, number] = [5, 2, 0]

    getAtomPosition(from, to, [0, 0, 0], 0).forEach((value, axis) => expect(value).toBeCloseTo(from[axis]))
    getAtomPosition(from, to, [0, 0, 0], 1).forEach((value, axis) => expect(value).toBeCloseTo(to[axis]))
    // Fully loosened away from the molecule centre, not yet travelling
    expect(getAtomPosition(from, to, [0, 0, 0], 0.35)[0]).toBeCloseTo(1.35)
  })
})
