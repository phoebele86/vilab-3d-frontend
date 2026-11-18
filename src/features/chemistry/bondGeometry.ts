import { Vector3, type Group } from 'three'

const UP = new Vector3(0, 1, 0)
const direction = new Vector3()

type Point = { x: number; y: number; z: number }

// Stretches a unit-height bond group between two atoms.
export const orientBond = (group: Group, start: Point, end: Point) => {
  direction.set(end.x - start.x, end.y - start.y, end.z - start.z)
  const length = direction.length()
  group.position.set((start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2)
  group.quaternion.setFromUnitVectors(UP, direction.normalize())
  group.scale.set(1, length, 1)
}
