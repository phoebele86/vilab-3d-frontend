import type { Vector3Tuple } from '@/types/api'

export const REACTION_STAGES = [
  { key: 'reactants', end: 0.15 },
  { key: 'break', end: 0.35 },
  { key: 'rearrange', end: 0.75 },
  { key: 'form', end: 0.95 },
  { key: 'products', end: 1 },
] as const

const [, BREAK, REARRANGE, FORM] = REACTION_STAGES.map((stage, index, stages) => ({
  start: index === 0 ? 0 : stages[index - 1].end,
  end: stage.end,
}))

// Atoms drift this far outward from their molecule centre while old bonds break.
const SPREAD = 0.35

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const getPhase = (progress: number, { start, end }: { start: number; end: number }) =>
  clamp01((progress - start) / (end - start))

export const getStageIndex = (progress: number) =>
  REACTION_STAGES.findIndex(({ end }) => progress <= end)

export const getBondOpacities = (progress: number) => ({
  reactants: 1 - getPhase(progress, BREAK),
  products: getPhase(progress, FORM),
})

export const getAtomPosition = (
  from: Vector3Tuple,
  to: Vector3Tuple,
  moleculeCentre: Vector3Tuple,
  progress: number,
): Vector3Tuple => {
  const spread = SPREAD * easeInOut(getPhase(progress, BREAK))
  const travel = easeInOut(getPhase(progress, REARRANGE))
  return [0, 1, 2].map((axis) => {
    const loosened = from[axis] + (from[axis] - moleculeCentre[axis]) * spread
    return loosened + (to[axis] - loosened) * travel
  }) as Vector3Tuple
}
