import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

import { assetUrl } from '@/lib/assets'

type ModelViewerProps = {
  path: string
}

const Model = ({ path }: ModelViewerProps) => {
  // useGLTF decodes Draco and meshopt compressed files
  const { scene } = useGLTF(assetUrl(path))
  return <primitive object={scene} />
}

export const ModelViewer = ({ path }: ModelViewerProps) => (
  <Canvas camera={{ position: [0, 0, 3] }}>
    <ambientLight intensity={0.6} />
    <directionalLight position={[2, 2, 2]} intensity={1.5} />
    <Suspense fallback={null}>
      {/* Fit any model to the view regardless of its original scale */}
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <Model path={path} />
        </Center>
      </Bounds>
    </Suspense>
    <OrbitControls makeDefault />
  </Canvas>
)
