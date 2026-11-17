import { Logo } from '@/components/layout/Logo'

const CURRENT_YEAR = new Date().getFullYear()

export const AppFooter = () => (
  <footer className="bg-board text-chalk-dim">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <Logo className="text-chalk" />
      <p className="m-0">Dự án được phát triển bởi Phoebe Le.</p>
      <p className="m-0">© {CURRENT_YEAR} ViLab 3D</p>
    </div>
  </footer>
)
