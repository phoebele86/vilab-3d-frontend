import type { GradePlan, Subject, SubjectKey } from '@/types/subject'

// Tailwind class names are written in full so the Tailwind scanner can find them
export const SUBJECTS: Subject[] = [
  {
    key: 'ly',
    name: 'Vật lý',
    modelName: 'con lắc đơn',
    chalkColor: '#8cc7f2',
    textChalkClass: 'text-physics',
    textInkClass: 'text-physics-ink',
    borderInkClass: 'border-physics-ink',
    tagline: 'Lực, năng lượng, ánh sáng, điện và từ: những thứ quan sát được thì đo được.',
    description:
      'Mỗi mô phỏng có thanh trượt để đổi thông số như độ dài dây, khối lượng hay hiệu điện thế, kèm đồ thị cập nhật ngay khi vật chuyển động.',
    simulations: [
      'Con lắc đơn và sự chuyển hóa cơ năng',
      'Đường đi của ánh sáng qua gương, lăng kính, thấu kính',
      'Mạch điện và định luật Ohm',
      'Hệ Mặt Trời và các pha của Mặt Trăng',
    ],
  },
  {
    key: 'hoa',
    name: 'Hóa học',
    modelName: 'bình tam giác và phân tử nước',
    chalkColor: '#f5c451',
    textChalkClass: 'text-chemistry',
    textInkClass: 'text-chemistry-ink',
    borderInkClass: 'border-chemistry-ink',
    tagline: 'Từ nguyên tử đến phản ứng: nhìn thấy những gì mắt thường không thấy.',
    description:
      'Xoay phân tử ở mọi góc, ghép nguyên tử thành chất, và thử những phản ứng không đủ an toàn để làm thật trên lớp.',
    simulations: [
      'Mô hình nguyên tử Rutherford – Bohr',
      'Phân tử và liên kết hóa học trong không gian 3D',
      'Phản ứng hóa học và định luật bảo toàn khối lượng',
      'Thang pH với acid, base và muối',
    ],
  },
  {
    key: 'sinh',
    name: 'Sinh học',
    modelName: 'chuỗi xoắn kép DNA',
    chalkColor: '#f29bb8',
    textChalkClass: 'text-biology',
    textInkClass: 'text-biology-ink',
    borderInkClass: 'border-biology-ink',
    tagline: 'Tế bào, cơ thể người và di truyền: mở từng lớp ra để học.',
    description:
      'Phóng to từ cơ thể xuống tế bào, tách từng hệ cơ quan, và theo dõi DNA nhân đôi theo từng bước.',
    simulations: [
      'Cấu tạo tế bào động vật và tế bào thực vật',
      'Quang hợp và hô hấp tế bào',
      'Các hệ cơ quan trong cơ thể người',
      'DNA, nhiễm sắc thể và quy luật di truyền Mendel',
    ],
  },
]

export const SUBJECT_BY_KEY = Object.fromEntries(
  SUBJECTS.map((subject) => [subject.key, subject]),
) as Record<SubjectKey, Subject>

// Planned topics per grade, following the 2018 national Natural Science curriculum
export const ROADMAP: GradePlan[] = [
  {
    grade: 6,
    topics: {
      ly: [
        'Lực và biểu diễn lực',
        'Lực ma sát',
        'Khối lượng và trọng lượng',
        'Biến dạng của lò xo',
        'Năng lượng và sự chuyển hóa năng lượng',
        'Chuyển động nhìn thấy của Mặt Trời, Mặt Trăng',
        'Hệ Mặt Trời và Ngân Hà',
      ],
      hoa: [
        'Các thể của chất và sự chuyển thể',
        'Oxygen và không khí',
        'Vật liệu, nhiên liệu, nguyên liệu',
        'Hỗn hợp, dung dịch và cách tách chất',
      ],
      sinh: [
        'Kính lúp và kính hiển vi quang học',
        'Tế bào – đơn vị cơ sở của sự sống',
        'Từ tế bào đến cơ thể',
        'Virus và vi khuẩn',
        'Nguyên sinh vật và nấm',
        'Đa dạng thực vật và động vật',
      ],
    },
  },
  {
    grade: 7,
    topics: {
      ly: [
        'Tốc độ và đồ thị quãng đường – thời gian',
        'Sóng âm, độ cao và độ to của âm',
        'Phản xạ ánh sáng và ảnh qua gương phẳng',
        'Nam châm và từ trường',
        'Từ trường Trái Đất',
      ],
      hoa: [
        'Nguyên tử và mô hình nguyên tử',
        'Nguyên tố hóa học',
        'Sơ lược bảng tuần hoàn',
        'Phân tử, đơn chất và hợp chất',
        'Liên kết ion và liên kết cộng hóa trị',
        'Hóa trị và công thức hóa học',
      ],
      sinh: [
        'Quang hợp ở thực vật',
        'Hô hấp tế bào',
        'Trao đổi khí, nước và chất dinh dưỡng',
        'Cảm ứng ở sinh vật',
        'Sinh trưởng, phát triển và sinh sản',
      ],
    },
  },
  {
    grade: 8,
    topics: {
      ly: [
        'Khối lượng riêng',
        'Áp suất chất lỏng và áp suất khí quyển',
        'Lực đẩy Archimedes',
        'Moment lực và đòn bẩy',
        'Mạch điện và tác dụng của dòng điện',
        'Truyền nhiệt và sự nở vì nhiệt',
      ],
      hoa: [
        'Phản ứng hóa học và định luật bảo toàn khối lượng',
        'Mol và tỉ khối chất khí',
        'Nồng độ dung dịch',
        'Tốc độ phản ứng và chất xúc tác',
        'Acid, base và thang pH',
        'Oxide, muối và phân bón hóa học',
      ],
      sinh: [
        'Hệ vận động',
        'Hệ tiêu hóa',
        'Máu và hệ tuần hoàn',
        'Hệ hô hấp và hệ bài tiết',
        'Hệ thần kinh và các giác quan',
        'Hệ sinh thái và cân bằng tự nhiên',
      ],
    },
  },
  {
    grade: 9,
    topics: {
      ly: [
        'Động năng, thế năng và cơ năng',
        'Công và công suất',
        'Khúc xạ ánh sáng và lăng kính',
        'Thấu kính và kính lúp',
        'Định luật Ohm và điện trở',
        'Cảm ứng điện từ và dòng điện xoay chiều',
      ],
      hoa: [
        'Kim loại và dãy hoạt động hóa học',
        'Phi kim',
        'Hydrocarbon: alkane và alkene',
        'Ethylic alcohol và acetic acid',
        'Lipid, carbohydrate và protein',
        'Polymer',
      ],
      sinh: [
        'Gene và DNA',
        'Nhiễm sắc thể',
        'Phiên mã và dịch mã',
        'Quy luật di truyền Mendel',
        'Đột biến',
        'Tiến hóa và chọn lọc tự nhiên',
      ],
    },
  },
]
