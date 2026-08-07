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

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  handle: string;
  age: string;
  /**
   * Versi panjang yang muncul di popup "Baca selengkapnya". Kalau kosong,
   * popup jatuh ke `body` — isinya jadi sama persis dengan kartunya.
   */
  story?: string;
}

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

export interface Capability {
  title: string;
  body: string;
  icon: string;
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
  tagline: 'Membangun merek lewat Custompedia, lalu mengemasnya lewat Parcelin.',
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
  { id: 'about', label: 'Perjalanan', href: '#about', icon: 'user' },
  { id: 'work', label: 'Karya', href: '#work', icon: 'briefcase' },
  { id: 'capabilities', label: 'Layanan', href: '#capabilities', icon: 'layers' },
  { id: 'clients', label: 'Klien', href: '#clients', icon: 'people' },
  { id: 'faq', label: 'FAQ', href: '#faq', icon: 'question' },
];

export const hero = {
  eyebrow: 'Creative agency &',
  eyebrowSecond: 'creative packaging.',
  headline: ['Merek dibangun,', 'kemasannya', 'ikut bicara.'],
  traits: ['Branding', 'Social & KOL', 'Digital Ads', 'Custom Packaging', 'Activation'],
  ctaPrimary: { label: 'Ngobrol Dulu', href: brand.bookingUrl },
  ctaSecondary: { label: 'Lihat Karya', href: '#work' },
};

/**
 * Angka besar di sidebar. `label` dirender satu baris utuh di bawah angkanya,
 * jadi tahan tetap pendek — dua kata pas, tiga kata mulai memaksa kartunya
 * melebar. Angkanya klaim publik Parcelin (950+ bisnis terlayani).
 */
export const stats: Stat[] = [{ value: '950+', label: 'Bisnis dibantu' }];

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
 * TODO: hanya tahun 2017 (berdirinya Parcelin) yang terkonfirmasi dari
 * informasi publik. Tahun pada entri lain adalah perkiraan urutan cerita —
 * mohon dikoreksi sebelum rilis.
 */
export const timeline: TimelineEntry[] = [
  {
    year: '14',
    title: 'Custompedia mulai di Semarang',
    body: 'Satu meja, satu laptop, dan klien pertama yang percaya sebelum ada portofolio yang bisa ditunjukkan.',
    handle: '@awalmula',
    age: '12 tahun lalu',
    story:
      'Custompedia berangkat dari pekerjaan desain yang datang satu-satu, tanpa kantor dan tanpa tim. Klien pertama tidak membeli portofolio — mereka membeli kesediaan untuk mengangkat telepon dan menyelesaikan urusan. Cara kerja itu yang kemudian jadi standar internal: apa pun skala proyeknya, yang dijanjikan harus selesai.',
  },
  {
    year: '16',
    title: 'Dari desain ke strategi merek',
    body: 'Klien tidak butuh konten bagus — mereka butuh konten yang menjual. Sejak itu setiap pekerjaan dimulai dari brief bisnis.',
    handle: '@strategi',
    age: '10 tahun lalu',
    story:
      'Titik baliknya sederhana: beberapa desain yang paling dibanggakan ternyata tidak menggerakkan penjualan sama sekali. Sejak itu setiap proyek dibuka dengan pertanyaan bisnis — siapa yang beli, berapa marginnya, apa yang menghambat orang membeli — sebelum satu pun visual dibuat. Custompedia berhenti menjual jasa desain dan mulai menjual arah.',
  },
  {
    year: '17',
    title: 'Parcelin Creative Indonesia berdiri',
    body: 'Banyak klien punya merek rapi tapi kemasannya asal. Parcelin lahir untuk menutup jarak antara identitas merek dan barang yang dipegang pembeli.',
    handle: '@parcelin',
    age: '9 tahun lalu',
    story:
      'Parcelin berdiri pada 2017 sebagai lini kedua, bukan cabang agensi. Alasannya datang dari lapangan: merek yang sudah dibangun rapi di layar sering rontok begitu produknya sampai di tangan pembeli dengan kemasan seadanya. Menangani kemasan berarti menangani pabrik, material, dan toleransi cetak — disiplin yang sama sekali berbeda dari kerja kreatif, dan justru itu yang membuatnya berkembang jadi bisnis sendiri.',
  },
  {
    year: '19',
    title: 'Layanan agensi jadi utuh',
    body: 'KOL, iklan berbayar, OOH, sampai event masuk satu atap. Satu klien bisa ditangani dari strategi sampai eksekusi tanpa dioper ke pihak lain.',
    handle: '@satuatap',
    age: '7 tahun lalu',
    story:
      'Menambah layanan bukan soal memperbanyak daftar harga, tapi soal memperpendek rantai. Ketika KOL, iklan, produksi konten, OOH, dan event ditangani tim yang sama, klien berhenti jadi penerjemah antar vendor — dan pesan mereknya tidak berubah bentuk di setiap perpindahan tangan.',
  },
  {
    year: '21',
    title: 'MOQ rendah untuk UMKM',
    body: 'Kemasan bagus selama ini terkunci di pesanan besar. Parcelin membuka pintu untuk pesanan kecil tanpa menurunkan mutu cetak.',
    handle: '@umkm',
    age: '5 tahun lalu',
    story:
      'Hambatan terbesar UMKM bukan selera, tapi minimum order. Menurunkan MOQ berarti menata ulang cara produksi dijadwalkan dan digabung, bukan sekadar memangkas angka di penawaran. Hasilnya: usaha rumahan bisa memakai kotak yang setara dengan merek besar, dan itu yang membuat produk mereka layak masuk rak yang sama.',
  },
  {
    year: '24',
    title: '950+ bisnis lewat Parcelin',
    body: 'Dari usaha rumahan sampai perusahaan multinasional — kemasan produk, hampers, PR package, dan merchandise.',
    handle: '@sembilanratus',
    age: '2 tahun lalu',
    story:
      'Angka 950+ menarik bukan karena besarnya, tapi karena rentangnya: warung kopi satu gerai dan perusahaan multinasional dilayani lini produksi yang sama. Rentang itu memaksa prosesnya rapi — brief, mockup, sampel, produksi — karena proses yang hanya jalan untuk klien besar akan langsung patah di pesanan kecil.',
  },
  {
    year: '26',
    title: 'Masih di jalur yang sama',
    body: 'Dua bendera, satu prinsip: merek dibangun dari masalah bisnisnya, dan diselesaikan sampai ke barang yang dipegang pembeli.',
    handle: '@sekarang',
    age: 'hari ini',
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

export const capabilities = {
  headline: ['Yang Anda', 'Dapatkan'],
  label: 'Lima pilar, dua bendera',
  /**
   * Kata bertanda `[chip]` diganti chip ikon oleh WhatYouGet.astro. Jumlah
   * `[chip]` HARUS sama dengan jumlah `items` — chip ke-n mengambil item ke-n,
   * dan item yang tidak kebagian chip tidak akan pernah bisa dibuka.
   */
  paragraph:
    'Merek dirancang, [chip] kanalnya dijalankan, [chip] iklannya diukur, [chip] kemasannya diproduksi, [chip] dan aktivasinya turun ke lapangan [chip] — semua di bawah satu penanggung jawab.',
  items: [
    {
      title: 'Branding & Identitas',
      body: 'Positioning, identitas visual, dan panduan merek yang bisa dipakai tim internal tanpa kami. Custompedia.',
      icon: 'spark',
    },
    {
      title: 'Social & KOL',
      body: 'Kanal harian dan kampanye kreator: perencanaan, produksi, publikasi, sampai laporan. Custompedia.',
      icon: 'people',
    },
    {
      title: 'Digital Advertising',
      body: 'Iklan berbayar yang diukur sampai angka penjualan, plus audit belanja iklan yang sudah berjalan. Custompedia.',
      icon: 'gauge',
    },
    {
      title: 'Custom Packaging',
      body: 'Kotak, kemasan produk, hampers, dan PR package. MOQ rendah, dari UMKM sampai multinasional. Parcelin.',
      icon: 'layers',
    },
    {
      title: 'Aktivasi, Merch & Event',
      body: 'Peluncuran, POI, OOH, merchandise, dan event — barang dan kemasannya dikerjakan sekaligus.',
      icon: 'bolt',
    },
  ] satisfies Capability[],
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
