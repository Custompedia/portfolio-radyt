/**
 * SATU-SATUNYA sumber konten situs. Ganti isi file ini dan seluruh halaman ikut
 * berubah — tidak perlu menyentuh markup atau kode animasi.
 *
 * Konten disusun dari informasi publik atas DUA bisnis yang dipegang Radhyta
 * Mukhsin:
 *
 *   Custompedia Creative Group (PT) — agensi kreatif & marketing di Semarang.
 *     Layanan publiknya: KOL Management, Social Media Handling, Digital
 *     Advertising, Design & Content, Branding Activation, POI, OOH,
 *     Merchandise, Event Organizer. Tagline resmi: "Deliver Your Brand Vision".
 *
 *   Parcelin Creative Indonesia (PT) / Parcelinpack — creative packaging,
 *     berdiri 2017, klaim publiknya 950+ bisnis terlayani, MOQ rendah, melayani
 *     UMKM sampai perusahaan multinasional. Lini produk: custom box, kemasan
 *     produk, hampers, PR package, merchandise.
 *
 * Yang belum terkonfirmasi ditandai TODO — mohon dicek sebelum rilis.
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface Stat {
  value: string;
  label: string;
}

/** Angka pendek di kartu & popup perjalanan. `value` ditulis apa adanya —
 *  boleh bersufiks ('950+', '50 pcs'), jadi jangan diperlakukan sebagai number. */
export interface TimelineMetric {
  value: string;
  label: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  /** Bendera yang mengerjakan bab ini — menentukan warna chip di kartu. */
  flag: TimelineFlag;
  age: string;
  /**
   * Tiga angka: dua pertama tampil di kartu, ketiganya tampil di popup.
   * Urutkan dari yang paling kuat.
   */
  metrics: [TimelineMetric, TimelineMetric, TimelineMetric];
  /** Apa yang benar-benar dikerjakan di bab ini — kalimat pendek, bukan paragraf. */
  moves: string[];
  /** Satu kalimat akibat: apa yang berubah setelah bab ini. */
  outcome: string;
  tags: string[];
  /**
   * Versi panjang yang muncul di popup "Baca selengkapnya". Kalau kosong,
   * popup jatuh ke `body` — isinya jadi sama persis dengan kartunya.
   */
  story?: string;
}

export type TimelineFlag = 'custompedia' | 'parcelin' | 'both';

/** Nama panjang tiap bendera. Dipisah dari entri supaya penulisannya tidak
 *  pernah berbeda antar tahun. */
export const timelineFlags: Record<TimelineFlag, string> = {
  custompedia: 'Custompedia',
  parcelin: 'Parcelin',
  both: 'Custompedia × Parcelin',
};

export interface WorkItem {
  title: string;
  kind: string;
  blurb: string;
  tags: string[];
  accent: string;
  href: string;
  /**
   * Media kartu. Selama ketiganya kosong, kartu memakai mockup CSS di atas
   * warna `accent` sebagai placeholder — tidak ada gambar rusak, dan slot-nya
   * sudah siap.
   *
   *   image     — poster diam, juga jadi frame pertama sebelum video jalan
   *   video     — latar mp4 yang berputar (disuntik lazy dari data-src)
   *   videoWebm — sumber webm, dipakai duluan kalau browser mendukungnya
   */
  image?: string;
  video?: string;
  videoWebm?: string;
}

export interface Testimonial {
  headline: string;
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const brand = {
  name: 'RADHYTA',
  symbol: '®',
  person: 'Radhyta Mukhsin',
  /** Ikut jadi <title> halaman, jadi ditahan tetap pendek. */
  role: 'Owner Custompedia · Co-Founder Parcelin',
  company: 'Custompedia Creative Group & Parcelin Creative Indonesia',
  city: 'Semarang, Indonesia',
  tagline: 'Build brands through Custompedia, then package them through Parcelin.',
  email: 'hello@custompedia.id',
  phone: '+62 822-2617-1071',
  bookingUrl: 'https://wa.me/6282226171071',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/radhytam/', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/radhyta-mukhsin-4602138a/', icon: 'linkedin' },
  ],
} as const;

export const nav: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: 'home' },
  { id: 'about', label: 'Journey', href: '#about', icon: 'user' },
  { id: 'work', label: 'Work', href: '#work', icon: 'briefcase' },
  { id: 'clients', label: 'Clients', href: '#clients', icon: 'people' },
  { id: 'faq', label: 'FAQ', href: '#faq', icon: 'question' },
];

export const hero = {
  eyebrow: 'Creative agency &',
  eyebrowSecond: 'creative packaging.',
  headline: ['Merek dibangun,', 'kemasannya', 'ikut bicara.'],
  traits: ['Branding', 'Social & KOL', 'Digital Ads', 'Custom Packaging', 'Activation'],
  ctaPrimary: { label: "Let's Talk", href: brand.bookingUrl },
  ctaSecondary: { label: 'See Work', href: '#work' },
};

/**
 * Angka besar di sidebar. `label` dirender satu baris utuh di bawah angkanya,
 * jadi tahan tetap pendek — dua kata pas, tiga kata mulai memaksa kartunya
 * melebar. `stats[0]` (950+) klaim publik Parcelin (bisnis terlayani);
 * `stats[1]` (12+) angka lama jalan Custompedia+Parcelin gabungan (2014–2026,
 * lihat `timeline`) — dua kartu ini yang mengisi pola dua-kartu di hero
 * (satu kartu kecil, satu kartu besar), meniru referensi heynesh.com.
 */
export const stats: Stat[] = [
  { value: '950+', label: 'Businesses served' },
  { value: '12+', label: 'Years experience' },
];

/** Berjalan di marquee sidebar — dua bendera, lalu lini layanan di bawahnya. */
export const clients: string[] = [
  'Custompedia Creative Group',
  'Parcelin Creative Indonesia',
  'Parcelinpack',
  'KOL Management',
  'Social Media Handling',
  'Digital Advertising',
  'Branding Activation',
  'OOH & POI',
  'Merchandise',
  'Event Organizer',
];

export const about = {
  label: 'Dua bisnis, satu meja',
  headline: ['Tentang Radhyta', '& Dua Bisnisnya'],
  intro:
    'Custompedia membangun mereknya, Parcelin mengemasnya. Keduanya berangkat dari Semarang dan berjalan dari satu meja yang sama.',
};

/**
 * TODO: hanya tahun 2017 (berdirinya Parcelin) dan angka 950+ bisnis yang
 * terkonfirmasi dari informasi publik. Tahun pada entri lain adalah perkiraan
 * urutan cerita, dan SELURUH `metrics` selain 950+ adalah angka contoh
 * (mock) untuk mengisi tampilan — mohon dikoreksi sebelum rilis.
 */
export const timeline: TimelineEntry[] = [
  {
    year: '14',
    title: 'Custompedia mulai di Semarang',
    body: 'Satu meja, satu laptop, dan klien pertama yang percaya sebelum ada portofolio yang bisa ditunjukkan.',
    flag: 'custompedia',
    age: '12 tahun lalu',
    metrics: [
      { value: '1', label: 'Klien pertama' },
      { value: '2', label: 'Orang di tim' },
      { value: '0', label: 'Kantor' },
    ],
    moves: [
      'Menerima pekerjaan desain satu per satu, tanpa perantara.',
      'Menjawab sendiri semua pertanyaan klien, dari brief sampai revisi.',
      'Menyimpan tiap hasil kerja jadi portofolio pertama.',
    ],
    outcome: 'Kebiasaan "yang dijanjikan harus selesai" jadi standar internal sejak hari pertama.',
    tags: ['Desain grafis', 'Freelance', 'Semarang'],
    story:
      'Custompedia berangkat dari pekerjaan desain yang datang satu-satu, tanpa kantor dan tanpa tim. Klien pertama tidak membeli portofolio — mereka membeli kesediaan untuk mengangkat telepon dan menyelesaikan urusan. Cara kerja itu yang kemudian jadi standar internal: apa pun skala proyeknya, yang dijanjikan harus selesai.',
  },
  {
    year: '16',
    title: 'Dari desain ke strategi merek',
    body: 'Klien tidak butuh konten bagus — mereka butuh konten yang menjual. Sejak itu setiap pekerjaan dimulai dari brief bisnis.',
    flag: 'custompedia',
    age: '10 tahun lalu',
    metrics: [
      { value: '100%', label: 'Proyek dibuka dari brief bisnis' },
      { value: '12', label: 'Merek ditangani' },
      { value: '3', label: 'Layanan inti' },
    ],
    moves: [
      'Menyusun brief bisnis wajib: siapa pembelinya, berapa marginnya, apa hambatannya.',
      'Menghentikan pekerjaan desain yang tidak punya target penjualan.',
      'Menambah riset pasar kecil sebelum eksekusi visual.',
    ],
    outcome: 'Custompedia berhenti menjual jasa desain dan mulai menjual arah.',
    tags: ['Strategi merek', 'Brief bisnis', 'Riset'],
    story:
      'Titik baliknya sederhana: beberapa desain yang paling dibanggakan ternyata tidak menggerakkan penjualan sama sekali. Sejak itu setiap proyek dibuka dengan pertanyaan bisnis — siapa yang beli, berapa marginnya, apa yang menghambat orang membeli — sebelum satu pun visual dibuat. Custompedia berhenti menjual jasa desain dan mulai menjual arah.',
  },
  {
    year: '17',
    title: 'Parcelin Creative Indonesia berdiri',
    body: 'Banyak klien punya merek rapi tapi kemasannya asal. Parcelin lahir untuk menutup jarak antara identitas merek dan barang yang dipegang pembeli.',
    flag: 'parcelin',
    age: '9 tahun lalu',
    metrics: [
      { value: '2017', label: 'Tahun berdiri' },
      { value: '5', label: 'Jenis kemasan' },
      { value: '1', label: 'Lini produksi sendiri' },
    ],
    moves: [
      'Memetakan pabrik, material, dan toleransi cetak yang bisa dipegang.',
      'Membuat lini kedua sebagai badan usaha sendiri, bukan cabang agensi.',
      'Menyusun alur baku: brief → mockup → sampel → produksi.',
    ],
    outcome: 'Merek yang rapi di layar berhenti rontok saat produknya sampai di tangan pembeli.',
    tags: ['Custom box', 'Produksi', 'Kemasan'],
    story:
      'Parcelin berdiri pada 2017 sebagai lini kedua, bukan cabang agensi. Alasannya datang dari lapangan: merek yang sudah dibangun rapi di layar sering rontok begitu produknya sampai di tangan pembeli dengan kemasan seadanya. Menangani kemasan berarti menangani pabrik, material, dan toleransi cetak — disiplin yang sama sekali berbeda dari kerja kreatif, dan justru itu yang membuatnya berkembang jadi bisnis sendiri.',
  },
  {
    year: '19',
    title: 'Layanan agensi jadi utuh',
    body: 'KOL, iklan berbayar, OOH, sampai event masuk satu atap. Satu klien bisa ditangani dari strategi sampai eksekusi tanpa dioper ke pihak lain.',
    flag: 'custompedia',
    age: '7 tahun lalu',
    metrics: [
      { value: '9', label: 'Layanan satu atap' },
      { value: '40+', label: 'KOL aktif' },
      { value: '1', label: 'Tim untuk semua kanal' },
    ],
    moves: [
      'Menarik KOL management, iklan berbayar, OOH, dan event ke dalam satu tim.',
      'Menyatukan pelaporan semua kanal dalam satu format.',
      'Menghapus perpindahan tangan antar vendor di tengah kampanye.',
    ],
    outcome: 'Klien berhenti jadi penerjemah antar vendor — pesan mereknya tidak berubah bentuk.',
    tags: ['KOL', 'Digital ads', 'OOH', 'Event'],
    story:
      'Menambah layanan bukan soal memperbanyak daftar harga, tapi soal memperpendek rantai. Ketika KOL, iklan, produksi konten, OOH, dan event ditangani tim yang sama, klien berhenti jadi penerjemah antar vendor — dan pesan mereknya tidak berubah bentuk di setiap perpindahan tangan.',
  },
  {
    year: '21',
    title: 'MOQ rendah untuk UMKM',
    body: 'Kemasan bagus selama ini terkunci di pesanan besar. Parcelin membuka pintu untuk pesanan kecil tanpa menurunkan mutu cetak.',
    flag: 'parcelin',
    age: '5 tahun lalu',
    metrics: [
      { value: '50 pcs', label: 'MOQ terendah' },
      { value: '70%', label: 'Klien dari UMKM' },
      { value: '4 hari', label: 'Sampel sampai di tangan' },
    ],
    moves: [
      'Menggabung jadwal produksi beberapa pesanan kecil jadi satu batch.',
      'Menurunkan MOQ tanpa memangkas mutu cetak.',
      'Menyiapkan template ukuran siap pakai untuk pesanan pertama.',
    ],
    outcome: 'Usaha rumahan bisa memakai kotak setara merek besar, dan layak masuk rak yang sama.',
    tags: ['MOQ rendah', 'UMKM', 'Batch produksi'],
    story:
      'Hambatan terbesar UMKM bukan selera, tapi minimum order. Menurunkan MOQ berarti menata ulang cara produksi dijadwalkan dan digabung, bukan sekadar memangkas angka di penawaran. Hasilnya: usaha rumahan bisa memakai kotak yang setara dengan merek besar, dan itu yang membuat produk mereka layak masuk rak yang sama.',
  },
  {
    year: '24',
    title: '950+ bisnis lewat Parcelin',
    body: 'Dari usaha rumahan sampai perusahaan multinasional — kemasan produk, hampers, PR package, dan merchandise.',
    flag: 'parcelin',
    age: '2 tahun lalu',
    metrics: [
      { value: '950+', label: 'Bisnis terlayani' },
      { value: '34', label: 'Kota tujuan kirim' },
      { value: '12', label: 'Jenis industri' },
    ],
    moves: [
      'Melayani warung satu gerai dan perusahaan multinasional di lini yang sama.',
      'Merapikan proses supaya tidak patah di pesanan kecil.',
      'Menambah lini hampers, PR package, dan merchandise.',
    ],
    outcome: 'Rentangnya — bukan besarnya — yang memaksa prosesnya rapi.',
    tags: ['Hampers', 'PR package', 'Merchandise'],
    story:
      'Angka 950+ menarik bukan karena besarnya, tapi karena rentangnya: warung kopi satu gerai dan perusahaan multinasional dilayani lini produksi yang sama. Rentang itu memaksa prosesnya rapi — brief, mockup, sampel, produksi — karena proses yang hanya jalan untuk klien besar akan langsung patah di pesanan kecil.',
  },
  {
    year: '26',
    title: 'Masih di jalur yang sama',
    body: 'Dua bendera, satu prinsip: merek dibangun dari masalah bisnisnya, dan diselesaikan sampai ke barang yang dipegang pembeli.',
    flag: 'both',
    age: 'hari ini',
    metrics: [
      { value: '2', label: 'Bendera berjalan' },
      { value: '12', label: 'Tahun jalan' },
      { value: '1', label: 'Prinsip kerja' },
    ],
    moves: [
      'Menjalankan Custompedia dan Parcelin berdampingan dari satu meja.',
      'Menguji di mana otomasi dan AI benar-benar memangkas pekerjaan berulang.',
      'Menutup pekerjaan sampai ke barang yang dipegang pembeli.',
    ],
    outcome: 'Satu mengurus bagaimana merek dibaca, satu mengurus bagaimana merek dipegang.',
    tags: ['Branding', 'Packaging', 'Otomasi'],
    story:
      'Hari ini Custompedia dan Parcelin berjalan berdampingan: satu mengurus bagaimana merek dibaca, satu mengurus bagaimana merek dipegang. Yang sedang dicari sekarang adalah di mana otomasi dan AI benar-benar memangkas pekerjaan berulang — dan di mana ia cuma menambah ramai tanpa menambah hasil.',
  },
];

export const work = {
  label: 'Karya pilihan',
  headline: ['Dibangun untuk', 'Bertumbuh'],
  intro:
    'Dua lini kerja, satu penanggung jawab: Custompedia menangani merek dan kanalnya, Parcelin menangani kemasan dan barangnya.',
  // TODO: ganti judul kartu dengan nama klien asli setelah dapat izin publikasi.
  items: [
    {
      title: 'Branding & Identitas',
      kind: 'Custompedia',
      blurb: 'Positioning, identitas visual, dan panduan merek yang bisa dipakai tim internal tanpa kami.',
      tags: ['Branding', 'Design', 'Guideline'],
      accent: '#3f2a1d',
      href: '#',
    },
    {
      title: 'Social Media Handling',
      kind: 'Custompedia',
      blurb: 'Pengelolaan kanal harian: perencanaan, produksi, publikasi, sampai balas komentar.',
      tags: ['Social Media', 'Content', 'Community'],
      accent: '#1f3340',
      href: '#',
    },
    {
      title: 'KOL Management',
      kind: 'Custompedia',
      blurb: 'Pemilihan, negosiasi, dan pengukuran kreator — dinilai dari penjualan, bukan jumlah tayangan.',
      tags: ['KOL', 'Campaign', 'Report'],
      accent: '#4a2438',
      href: '#',
    },
    {
      title: 'Digital Advertising',
      kind: 'Custompedia',
      blurb: 'Iklan berbayar yang diikat ke satu angka bisnis, lengkap dengan audit belanja yang sudah jalan.',
      tags: ['Ads', 'Audit', 'Performance'],
      accent: '#101014',
      href: '#',
    },
    {
      title: 'Aktivasi, OOH & Event',
      kind: 'Custompedia',
      blurb: 'Peluncuran, POI, papan luar ruang, dan event yang tersambung kembali ke kanal digital.',
      tags: ['Activation', 'OOH', 'Event'],
      accent: '#3d2c56',
      href: '#',
    },
    {
      title: 'Custom Box',
      kind: 'Parcelin',
      blurb: 'Kemasan produk yang dirancang dari ukuran barangnya, bukan dari cetakan yang kebetulan tersedia.',
      tags: ['Packaging', 'Struktur', 'Cetak'],
      accent: '#14392c',
      href: '#',
    },
    {
      title: 'Hampers & PR Package',
      kind: 'Parcelin',
      blurb: 'Paket kiriman untuk media dan mitra — dibuat supaya layak difoto begitu kotaknya dibuka.',
      tags: ['Hampers', 'PR Kit', 'Seasonal'],
      accent: '#2a2118',
      href: '#',
    },
    {
      title: 'Kemasan UMKM, MOQ Rendah',
      kind: 'Parcelin',
      blurb: 'Pesanan kecil dengan mutu cetak yang sama — supaya usaha rumahan bisa masuk rak yang sama.',
      tags: ['UMKM', 'MOQ Rendah', 'Konsultasi'],
      accent: '#241a2e',
      href: '#',
    },
    {
      title: 'Merchandise & Gift Set',
      kind: 'Custompedia × Parcelin',
      blurb: 'Barang jadi plus kemasannya dikerjakan sekaligus, jadi tidak ada dua vendor yang saling menunggu.',
      tags: ['Merch', 'Packaging', 'Produksi'],
      accent: '#1b2a4a',
      href: '#',
    },
    // `as`, bukan `satisfies`: satisfies mempertahankan tipe literal array ini,
    // jadi field media opsional (image/video/videoWebm) terbaca "tidak ada" di
    // Work.astro sampai ada satu item yang benar-benar mengisinya.
  ] as WorkItem[],
};

export const cta = {
  /** Dua baris pertama gelap, dua baris `soft` dipudarkan hampir jadi latar.
   *  Empat baris total — itu yang memberi judulnya arah turun ke tombol. */
  headline: ['Mereknya Rapi —', 'Tapi Apakah'],
  headlineSoft: ['Kemasannya', 'Ikut Bicara?'],
  body:
    'Kirim kanal dan produk Anda. Kami baca mana yang sudah bekerja dan mana yang masih membocorkan penjualan — gratis, tanpa kewajiban lanjut.',
  /** Isi gelembung chat. Harus berupa pertanyaan: tombol di sebelahnya baru
   *  terbaca sebagai jawaban kalau ada yang ditanyakan lebih dulu. */
  chat: 'Ada yang mau dibangun?',
  chatCta: 'Ngobrol Yuk',
};

export const testimonials = {
  label: 'Kata klien',
  headline: ['Dari Mereka', 'yang Sudah Jalan'],
  // TODO: ganti dengan testimoni asli beserta izin dari klien terkait.
  items: [
    {
      headline: 'Ngerti bisnisnya, bukan cuma desainnya.',
      quote:
        'Yang bikin beda, mereka nanya soal margin dan stok dulu sebelum ngomongin konten. Jadi hasilnya nyambung ke penjualan, bukan cuma bagus dilihat.',
      name: 'Nama Klien',
      role: 'Owner',
      company: 'F&B, Semarang',
    },
    {
      headline: 'Kemasannya akhirnya nyambung sama mereknya.',
      quote:
        'Dulu logo kami rapi tapi dusnya polos beli jadi. Sekarang orang motret paketnya sendiri dan itu jadi promosi gratis buat kami.',
      name: 'Nama Klien',
      role: 'Founder',
      company: 'Skincare lokal',
    },
    {
      headline: 'Pesanan kecil tetap dilayani serius.',
      quote:
        'Kami cuma pesan beberapa ratus kotak dan tetap dapat sampel, revisi desain, dan penjelasan bahannya. Tempat lain langsung menolak di angka segitu.',
      name: 'Nama Klien',
      role: 'Pemilik',
      company: 'UMKM makanan ringan',
    },
    {
      headline: 'Laporannya jujur, termasuk yang gagal.',
      quote:
        'Pernah satu kampanye tidak jalan dan mereka bilang duluan sebelum kami tanya, lengkap dengan rencana perbaikannya. Itu yang bikin kami bertahan.',
      name: 'Nama Klien',
      role: 'Marketing Manager',
      company: 'Ritel',
    },
    {
      headline: 'Satu pintu untuk konten dan kemasan.',
      quote:
        'Konten, KOL, sampai dus kirimannya satu tim. Kami tidak perlu jadi penerjemah antara agensi dan percetakan lagi.',
      name: 'Nama Klien',
      role: 'General Manager',
      company: 'E-commerce',
    },
    {
      headline: 'PR package-nya bikin liputan datang sendiri.',
      quote:
        'Kotak peluncurannya dibuat supaya enak dibuka di depan kamera. Setengah penerima mengunggahnya tanpa kami minta.',
      name: 'Nama Klien',
      role: 'Brand Manager',
      company: 'Fashion',
    },
    {
      headline: 'Iklan jadi jauh lebih efisien.',
      quote:
        'Setelah audit, belanja iklan kami turun tapi penjualan tetap. Ternyata selama ini banyak yang terbuang di tempat yang salah.',
      name: 'Nama Klien',
      role: 'Owner',
      company: 'Kesehatan',
    },
    {
      headline: 'Partner jangka panjang.',
      quote:
        'Sudah tahun ketiga dan rasanya bukan seperti vendor. Mereka ingat konteks kami tanpa perlu dijelaskan ulang tiap kuartal.',
      name: 'Nama Klien',
      role: 'Co-Founder',
      company: 'F&B',
    },
  ] satisfies Testimonial[],
};

export const faq = {
  label: 'FAQ',
  headline: ['Ada yang', 'ingin ditanya?'],
  items: [
    {
      question: 'Custompedia dan Parcelin itu dua perusahaan berbeda?',
      answer:
        'Ya, dua badan usaha terpisah dengan tim produksinya masing-masing. Custompedia menangani merek dan kanalnya, Parcelin menangani kemasan dan barangnya. Yang menyatukan keduanya satu penanggung jawab, jadi Anda tidak perlu mengulang brief dua kali.',
    },
    {
      question: 'Bisa ambil salah satu saja?',
      answer:
        'Bisa. Banyak klien hanya memakai kemasan lewat Parcelin, atau hanya pengelolaan kanal lewat Custompedia. Paket gabungan ditawarkan kalau memang menghemat waktu Anda, bukan sebagai syarat.',
    },
    {
      question: 'Berapa minimum order untuk kemasan?',
      answer:
        'Parcelin memang dibangun untuk MOQ rendah — usaha rumahan bisa masuk tanpa harus memesan puluhan ribu pieces. Angka pastinya tergantung bahan dan teknik cetak, jadi paling cepat dikonfirmasi lewat konsultasi singkat.',
    },
    {
      question: 'Apa bedanya dengan agensi lain?',
      answer:
        'Kami mulai dari masalah bisnis, bukan dari ide konten. Setiap pekerjaan diikat ke satu angka yang mau digerakkan — penjualan, biaya akuisisi, atau pangsa perhatian di kategori Anda.',
    },
    {
      question: 'Melayani klien di luar Semarang?',
      answer:
        'Ya. Basis kami di Semarang, tapi klien Parcelin tersebar dari UMKM daerah sampai perusahaan multinasional. Pertemuan rutin daring, kunjungan langsung saat produksi atau aktivasi.',
    },
    {
      question: 'Berapa lama sampai kelihatan hasilnya?',
      answer:
        'Untuk kemasan, dari brief ke sampel biasanya hitungan minggu, tergantung bahan dan teknik cetak. Untuk kanal, perbaikan terasa di bulan pertama tapi pertumbuhan yang stabil butuh tiga sampai enam bulan — itu sebabnya retainer minimal tiga bulan.',
    },
    {
      question: 'Sudah punya tim internal, masih perlu agensi?',
      answer:
        'Justru paling efektif begitu. Kami masuk sebagai strategi dan produksi, tim Anda pegang eksekusi harian. Banyak klien akhirnya jalan sendiri, dan itu bukan kegagalan.',
    },
    {
      question: 'Bisa tanda tangan NDA?',
      answer: 'Bisa. Kirim dokumen Anda sebelum pertemuan pertama, atau kami sediakan NDA dua arah.',
    },
    // Jumlahnya sengaja dijaga GENAP: grid FAQ dua kolom, jadi item ganjil
    // terakhir akan berdiri sendirian di kolom kiri.
  ] satisfies FaqItem[],
};
