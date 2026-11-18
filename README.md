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
| `npm test` | Chạy unit test (vitest) cho các hàm tính toán |
| `npm run gen:api` | Sinh `src/lib/api-types.ts` từ `/openapi.json` của backend (backend phải đang chạy) |

| Biến môi trường | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `VITE_API_BASE` | `/api/v1` | Địa chỉ gốc của API |
| `VITE_ASSET_URL` | `/api/assets` | Địa chỉ gốc của file 3D |

## Đường dẫn

| URL | Nội dung |
| --- | --- |
| `/` | Trang chủ với phòng thí nghiệm 3D |
| `/lab` | Danh sách bài học đã có mô hình 3D (đọc từ API) |
| `/lessons/<slug>` | Mô hình 3D của một bài, ví dụ `/lessons/9-physics-8` (thấu kính), `/lessons/8-chemistry-2` (phản ứng), `/lessons/8-biology-33` (tim) |
| `/lessons/9-physics-8?d=15&f=10` | Mở mô phỏng thấu kính ở đúng thông số của một bài toán (`d`, `f`, `h`, `type=diverging`) |
| `/models/<đường-dẫn>` | Xem một file 3D bất kỳ, ví dụ `/models/biology/heart.glb` |

Trang bài học chọn trình mô phỏng theo `kind` và `key` của mô hình trong bảng `models_3d` (xem `src/features/labs.tsx`).

## Cấu trúc thư mục

```
src/
├── components/
│   ├── common/    # SceneCanvas (canvas + lớp nhãn), SceneNotice
│   ├── home/      # Các phần của trang chủ
│   ├── lab/       # Cảnh 3D trên trang chủ
│   ├── layout/    # Header, footer, logo, LabShell
│   └── viewer/    # ModelViewer
├── features/
│   ├── physics/lens/        # Mô phỏng thấu kính
│   ├── chemistry/           # Trình xem phân tử, mô phỏng phản ứng
│   ├── biology/organ/       # Trình xem cơ quan (tim, phổi)
│   └── labs.tsx             # models_3d → trình mô phỏng
├── data/          # Nội dung tĩnh (môn học, lộ trình)
├── hooks/         # useLessons, useLocalizedText, usePrefersReducedMotion
├── i18n/          # khởi tạo i18next, đổi và lưu ngôn ngữ
├── locales/       # vi.ts (mặc định), en.ts: toàn bộ chữ giao diện
├── lib/           # api.ts, api-types.ts (sinh tự động), assets.ts, queryClient.ts
├── types/         # api.ts (bí danh kiểu từ API), lab.ts, subject.ts
├── pages/
├── theme/         # Theme antd
├── App.tsx        # Router
└── main.tsx
```

## Đa ngôn ngữ

Giao diện có tiếng Việt (mặc định) và tiếng Anh, chuyển bằng nút VI/EN ở thanh trên cùng; lựa chọn được lưu trong
trình duyệt.

- Chữ giao diện: thêm khóa vào `src/locales/vi.ts` và bản dịch vào `src/locales/en.ts`, rồi dùng `t('khóa')`.
  `en.ts` khai báo kiểu `Translation` của `vi.ts`, nên thiếu khóa là type-check báo lỗi.
- Nội dung từ API (tên bài, tên mô hình, nhãn bộ phận, tên chất) có dạng `{ vi, en }`; hiển thị bằng
  `useLocalizedText()`, tự lùi về tiếng Việt khi chưa có bản dịch.
- Thêm ngôn ngữ mới: tạo `src/locales/<mã>.ts`, thêm vào `LANGUAGES` trong `src/i18n/index.ts`, và bổ sung khóa
  `<mã>` cho nội dung trong backend.

Quy ước code xem `CLAUDE.md` ở thư mục workspace.
