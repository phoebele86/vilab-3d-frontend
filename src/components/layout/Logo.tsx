type LogoProps = {
  className?: string
}

export const Logo = ({ className = '' }: LogoProps) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden="true">
      <path
        d="M26 12h12M28 12v14L16 48a4 4 0 0 0 3.5 6h25a4 4 0 0 0 3.5-6L36 26V12"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="44" r="3.4" fill="#8cc7f2" />
      <circle cx="34" cy="38" r="3.4" fill="#f5c451" />
      <circle cx="40" cy="46" r="3.4" fill="#f29bb8" />
    </svg>
    <span className="text-xl font-extrabold tracking-[-0.02em]">ViLab 3D</span>
  </span>
)
