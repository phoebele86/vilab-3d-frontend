import type { Ray } from '@/features/physics/lens/lensOptics'

// Chalk colours so the three principal rays stay distinguishable on the board.
export const RAY_COLORS: Record<Ray['key'], string> = {
  parallel: '#f5c451',
  center: '#8cc7f2',
  focal: '#f29bb8',
}
