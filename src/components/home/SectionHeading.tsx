import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  title: string
  children?: ReactNode
}

export const SectionHeading = ({ id, title, children }: SectionHeadingProps) => (
  <div className="max-w-3xl">
    <h2
      id={id}
      className="m-0 text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.12] font-extrabold tracking-[-0.02em] text-purple-ink"
    >
      {title}
    </h2>
    {children && <p className="mt-4 mb-0 max-w-2xl text-lg leading-relaxed text-ink-soft">{children}</p>}
  </div>
)
