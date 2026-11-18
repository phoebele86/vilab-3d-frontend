export type LensType = 'converging' | 'diverging'

// All lengths in cm; the lens sits at x = 0 and the object stands on the left at x = -objectDistance.
export type LensSetup = {
  lensType: LensType
  focalLength: number
  objectDistance: number
  objectHeight: number
}

export type LensImage = {
  distance: number
  height: number
  magnification: number
  isReal: boolean
}

export type Point = [number, number]

export type Ray = {
  key: 'parallel' | 'center' | 'focal'
  path: Point[]
  // Dashed backward extension that meets at a virtual image
  extension: Point[] | null
}

const EPSILON = 1e-6

export const OBJECT_POSITIONS = [
  { key: 'beyond-2f', label: 'd > 2f', factor: 2.5 },
  { key: 'at-2f', label: 'd = 2f', factor: 2 },
  { key: 'between-f-2f', label: 'f < d < 2f', factor: 1.5 },
  { key: 'at-f', label: 'd = f', factor: 1 },
  { key: 'inside-f', label: 'd < f', factor: 0.5 },
] as const

export type ObjectPositionKey = (typeof OBJECT_POSITIONS)[number]['key']

const getSignedFocalLength = ({ lensType, focalLength }: LensSetup) =>
  lensType === 'converging' ? focalLength : -focalLength

// Thin lens equation 1/f = 1/d + 1/d'; no image forms when the object sits at the focal point.
export const getLensImage = (setup: LensSetup): LensImage | null => {
  const f = getSignedFocalLength(setup)
  const d = setup.objectDistance
  if (Math.abs(d - f) < EPSILON) return null

  const distance = (d * f) / (d - f)
  const magnification = -distance / d
  return { distance, height: magnification * setup.objectHeight, magnification, isReal: distance > 0 }
}

export const getObjectPosition = ({ focalLength, objectDistance }: LensSetup): ObjectPositionKey => {
  const ratio = objectDistance / focalLength
  if (Math.abs(ratio - 2) < EPSILON) return 'at-2f'
  if (Math.abs(ratio - 1) < EPSILON) return 'at-f'
  if (ratio > 2) return 'beyond-2f'
  return ratio > 1 ? 'between-f-2f' : 'inside-f'
}

// Three principal rays from the object's tip, traced up to x = xMax.
export const getPrincipalRays = (setup: LensSetup, image: LensImage | null, xMax: number): Ray[] => {
  const f = getSignedFocalLength(setup)
  const { objectDistance: d, objectHeight: h } = setup
  const tip: Point = [-d, h]
  const backTo = (from: Point): Point[] | null =>
    image && !image.isReal ? [from, [image.distance, image.height]] : null

  const rays: Ray[] = [
    // Parallel to the axis, then through (or away from) the focal point: y = h(1 - x/f)
    { key: 'parallel', path: [tip, [0, h], [xMax, h * (1 - xMax / f)]], extension: backTo([0, h]) },
    { key: 'center', path: [tip, [0, 0], [xMax, (-h * xMax) / d]], extension: backTo([0, 0]) },
  ]
  if (image) {
    rays.push({
      key: 'focal',
      path: [tip, [0, image.height], [xMax, image.height]],
      extension: backTo([0, image.height]),
    })
  }
  return rays
}
