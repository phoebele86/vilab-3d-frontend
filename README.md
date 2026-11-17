# vilab-3d-frontend

Giao diện web của **ViLab 3D**: phòng thí nghiệm ảo 3D hỗ trợ dạy và học môn Khoa học tự nhiên THCS
(Vật lý, Hóa học, Sinh học).

Tác giả: **Phoebe Le**

## Hệ thống gồm

| Repo | Vai trò |
| --- | --- |
| `vilab-3d-frontend` | Giao diện React + Three.js (repo này) |
| `vilab-3d-backend` | API FastAPI, PostgreSQL + pgvector, RAG |
| `vilab-3d-assets` | File mô hình 3D `.glb` |
| `vilab-3d-llm` | Cấu hình model Qwen, script và bộ đánh giá |

## Công nghệ

React 19, Vite, TypeScript, Three.js (React Three Fiber + drei), Tailwind CSS v4, Ant Design v6,
React Router, TanStack Query, zustand.

## Chạy ở local

Cần backend chạy ở `http://localhost:8000` (xem `vilab-3d-backend`). Mọi request `/api/*` được proxy của Vite
chuyển tới backend, nên không phát sinh lỗi CORS.

```bash
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
npm run dev -- --host    # mở cho điện thoại cùng Wi-Fi
```

| Lệnh | Tác dụng |
| --- | --- |
| `npm run build` | Type-check rồi build production vào `dist/` |
| `npm run typecheck` | Chỉ type-check |
| `npm run lint` | Lint bằng oxlint |
| `npm run gen:api` | Sinh `src/lib/api-types.ts` từ `/openapi.json` của backend (backend phải đang chạy) |

| Biến môi trường | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `VITE_API_BASE` | `/api/v1` | Địa chỉ gốc của API |
| `VITE_ASSET_URL` | `/api/assets` | Địa chỉ gốc của file 3D |

## Đường dẫn

| URL | Nội dung |
| --- | --- |
| `/` | Trang chủ với phòng thí nghiệm 3D |
| `/models/<đường-dẫn>` | Xem một file 3D bất kỳ, ví dụ `/models/sinh/tim.glb` |

## Cấu trúc thư mục

```
src/
├── components/
│   ├── home/      # Các phần của trang chủ
│   ├── lab/       # Cảnh 3D trên trang chủ
│   ├── layout/    # Header, footer, logo
│   └── viewer/    # ModelViewer
├── data/          # Nội dung tĩnh (môn học, lộ trình)
├── hooks/
├── lib/           # api.ts, api-types.ts (sinh tự động), assets.ts, queryClient.ts
├── pages/
├── theme/         # Theme antd
├── types/
├── App.tsx        # Router
└── main.tsx
```

Quy ước code xem `CLAUDE.md` ở thư mục workspace.
