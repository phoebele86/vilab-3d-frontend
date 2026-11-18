import { describe, expect, it } from 'vitest'

import { getElementFacts } from '@/features/chemistry/molecules/moleculeFacts'

describe('getElementFacts', () => {
  it('counts atoms and derives valence from bond orders in CO2', () => {
    const facts = getElementFacts({
      atoms: [
        { el: 'O', pos: [-1.2, 0, 0] },
        { el: 'C', pos: [0, 0, 0] },
        { el: 'O', pos: [1.2, 0, 0] },
      ],
      bonds: [
        [0, 1, 2],
        [1, 2, 2],
      ],
    })

    expect(facts).toEqual([
      { symbol: 'O', count: 2, bondsPerAtom: 2 },
      { symbol: 'C', count: 1, bondsPerAtom: 4 },
    ])
  })
})
