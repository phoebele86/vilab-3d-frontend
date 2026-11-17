import { SectionHeading } from '@/components/home/SectionHeading'

const STEPS = [
  {
    title: 'Đọc câu hỏi mở đầu',
    body: 'Mỗi bài bắt đầu bằng một câu hỏi gắn với bài trên lớp, ví dụ: khi con lắc đi xuống, thế năng của nó chuyển thành gì?',
  },
  {
    title: 'Thay đổi thông số',
    body: 'Kéo thanh trượt để đổi độ dài dây, khối lượng, nồng độ hay nhiệt độ, rồi quan sát mô hình 3D thay đổi ngay.',
  },
  {
    title: 'Ghi lại kết quả',
    body: 'Điền số liệu vào bảng như trong vở thí nghiệm, sau đó trả lời câu hỏi cuối bài để tự kiểm tra.',
  },
]

export const LessonFlowSection = () => (
  <section id="cach-hoc" aria-labelledby="cach-hoc-title" className="scroll-mt-4 py-20 lg:py-24">
    <SectionHeading id="cach-hoc-title" title="Một bài mô phỏng gồm ba bước" />

    <ol className="mt-12 mb-0 grid gap-10 pl-0 md:grid-cols-3">
      {STEPS.map(({ title, body }, index) => (
        <li key={title} className="max-w-sm list-none">
          <span aria-hidden="true" className="block font-chalk text-6xl leading-none text-purple-ink">
            {index + 1}.
          </span>
          <h3 className="mt-3 mb-0 text-xl font-bold text-ink">{title}</h3>
          <p className="mt-2 mb-0 leading-relaxed text-ink-soft">{body}</p>
        </li>
      ))}
    </ol>
  </section>
)
