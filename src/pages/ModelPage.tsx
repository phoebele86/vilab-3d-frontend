import { Link, useParams } from 'react-router-dom'

import { ModelViewer } from '@/components/viewer/ModelViewer'

// Renders any asset by its relative path, e.g. /models/sinh/tim.glb
export const ModelPage = () => {
  const { '*': path = '' } = useParams()

  return (
    <div className="bg-board flex h-dvh flex-col text-chalk">
      <header className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link to="/" className="font-semibold text-chalk-dim hover:text-chalk">
          Về trang chủ
        </Link>
        <p className="m-0 truncate font-chalk text-xl chalk-glow">{path}</p>
      </header>
      <div className="min-h-0 flex-1">
        {path ? (
          <ModelViewer path={path} />
        ) : (
          <p className="p-8 text-center text-chalk-dim">Thêm đường dẫn mô hình vào URL, ví dụ /models/sinh/tim.glb</p>
        )}
      </div>
    </div>
  )
}
