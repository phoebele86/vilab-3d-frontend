import { Html } from '@react-three/drei'
import { Canvas, type CanvasProps } from '@react-three/fiber'
import { createContext, useContext, useRef, type ComponentProps, type RefObject } from 'react'

const LabelLayerContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

// drei <Html> unmounts its first label when the canvas event source changes during setup,
// so every label renders into this fixed overlay instead.
export const SceneCanvas = ({ children, ...canvasProps }: CanvasProps) => {
  const labelLayer = useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-full w-full">
      <LabelLayerContext value={labelLayer}>
        <Canvas {...canvasProps}>{children}</Canvas>
      </LabelLayerContext>
      <div ref={labelLayer} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  )
}

export const SceneLabel = (props: ComponentProps<typeof Html>) => {
  const labelLayer = useContext(LabelLayerContext)
  return <Html {...props} portal={(labelLayer ?? undefined) as RefObject<HTMLElement> | undefined} />
}
