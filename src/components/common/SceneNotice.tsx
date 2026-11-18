type SceneNoticeProps = {
  text: string
}

export const SceneNotice = ({ text }: SceneNoticeProps) => (
  <div className="flex h-full items-center justify-center p-6">
    <p className="m-0 max-w-sm text-center font-chalk text-xl leading-snug text-chalk-dim chalk-glow">{text}</p>
  </div>
)
