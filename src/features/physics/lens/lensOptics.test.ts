import { describe, expect, it } from 'vitest'

import {
  getLensImage,
  getObjectPosition,
  getPrincipalRays,
  type LensSetup,
} from '@/features/physics/lens/lensOptics'

const converging = (objectDistance: number): LensSetup => ({
  lensType: 'converging',
  focalLength: 10,
  objectDistance,
  objectHeight: 2,
})

describe('getLensImage', () => {
  it('forms a real, inverted, enlarged image when f < d < 2f', () => {
    const image = getLensImage(converging(15))
    expect(image?.distance).toBeCloseTo(30)
    expect(image?.height).toBeCloseTo(-4)
    expect(image?.isReal).toBe(true)
  })

  it('forms a same-size real image at 2f when d = 2f', () => {
    const image = getLensImage(converging(20))
    expect(image?.distance).toBeCloseTo(20)
    expect(image?.magnification).toBeCloseTo(-1)
  })

  it('forms a virtual, upright, enlarged image inside the focal length (magnifier)', () => {
    const image = getLensImage(converging(5))
    expect(image?.distance).toBeCloseTo(-10)
    expect(image?.height).toBeCloseTo(4)
    expect(image?.isReal).toBe(false)
  })

  it('forms no image when the object is at the focal point', () => {
    expect(getLensImage(converging(10))).toBeNull()
  })

  it('always forms a virtual, upright, smaller image with a diverging lens', () => {
    const image = getLensImage({ ...converging(15), lensType: 'diverging' })
    expect(image?.distance).toBeCloseTo(-6)
    expect(image?.magnification).toBeCloseTo(0.4)
    expect(image?.isReal).toBe(false)
  })
})

describe('getObjectPosition', () => {
  it.each([
    [25, 'beyond-2f'],
    [20, 'at-2f'],
    [15, 'between-f-2f'],
    [10, 'at-f'],
    [5, 'inside-f'],
  ])('classifies d = %i cm as %s', (distance, expected) => {
    expect(getObjectPosition(converging(distance))).toBe(expected)
  })
})

describe('getPrincipalRays', () => {
  it('sends all three rays through the real image point', () => {
    const setup = converging(15)
    const image = getLensImage(setup)!
    const rays = getPrincipalRays(setup, image, image.distance)

    expect(rays).toHaveLength(3)
    rays.forEach(({ path, extension }) => {
      const [x, y] = path.at(-1)!
      expect(x).toBeCloseTo(image.distance)
      expect(y).toBeCloseTo(image.height)
      expect(extension).toBeNull()
    })
  })

  it('draws backward extensions that meet at a virtual image', () => {
    const setup = converging(5)
    const image = getLensImage(setup)!
    const rays = getPrincipalRays(setup, image, 40)

    rays.forEach(({ extension }) => {
      expect(extension?.at(-1)).toEqual([image.distance, image.height])
    })
  })

  it('omits the focal ray when no image forms', () => {
    expect(getPrincipalRays(converging(10), null, 40).map((ray) => ray.key)).toEqual([
      'parallel',
      'center',
    ])
  })
})
