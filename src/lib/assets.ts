const ASSET_URL = import.meta.env.VITE_ASSET_URL ?? '/api/assets'

// Build the full URL of a 3D asset from its relative path, e.g. "sinh/tim.glb"
export const assetUrl = (path: string) => `${ASSET_URL}/${path}`
