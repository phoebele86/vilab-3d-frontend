import { create } from 'zustand'

// One full play-through of the animation at 1× speed
const DURATION_SECONDS = 8

type PlaybackState = {
  progress: number
  isPlaying: boolean
  speed: number
  play: () => void
  pause: () => void
  restart: () => void
  seek: (progress: number) => void
  setSpeed: (speed: number) => void
  advance: (deltaSeconds: number) => void
}

export const useReactionPlayback = create<PlaybackState>()((set) => ({
  progress: 0,
  isPlaying: false,
  speed: 1,
  play: () => set(({ progress }) => ({ isPlaying: true, progress: progress >= 1 ? 0 : progress })),
  pause: () => set({ isPlaying: false }),
  restart: () => set({ progress: 0, isPlaying: true }),
  seek: (progress) => set({ progress, isPlaying: false }),
  setSpeed: (speed) => set({ speed }),
  advance: (deltaSeconds) =>
    set(({ progress, speed }) => {
      const next = Math.min(1, progress + (deltaSeconds * speed) / DURATION_SECONDS)
      return { progress: next, isPlaying: next < 1 }
    }),
}))
