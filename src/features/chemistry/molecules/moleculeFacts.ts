import type { MoleculeStructure } from '@/types/api'

export type ElementFact = {
  symbol: string
  count: number
  // Sum of bond orders around one atom, i.e. its valence in this molecule
  bondsPerAtom: number
}

export const getElementFacts = ({ atoms, bonds }: MoleculeStructure): ElementFact[] => {
  const bondTotals = atoms.map(
    (_, index) =>
      bonds.filter(([a, b]) => a === index || b === index).reduce((sum, [, , order]) => sum + order, 0),
  )
  const symbols = [...new Set(atoms.map(({ el }) => el))]

  return symbols.map((symbol) => {
    const indexes = atoms.flatMap(({ el }, index) => (el === symbol ? [index] : []))
    return { symbol, count: indexes.length, bondsPerAtom: Math.max(...indexes.map((i) => bondTotals[i])) }
  })
}
