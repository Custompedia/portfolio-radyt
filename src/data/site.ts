/**
 * SATU-SATUNYA sumber konten situs. Ganti isi file ini dan seluruh halaman ikut
 * berubah — tidak perlu menyentuh markup atau kode animasi.
 *
 * Profil, layanan, dan angka di bawah disusun dari informasi publik
 * Custompedia (Instagram @custompedia, profil LinkedIn, Google Business).
 * Bagian yang belum terkonfirmasi ditandai TODO — mohon dicek sebelum rilis.
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
   * popup jatuh ke `body` — isinya jadi sama persis dengan kartunya, jadi
   * TODO: isi ini kalau tombolnya memang mau berguna.
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

export interface PricingTier {
  name: string;
  price: string;
  unit?: string;
  intro: string;
  features: string[];
  footnote: string;
  featured?: boolean;
  /** Nama ikon di Icon.astro. Tiap paket harus beda — dua ikon yang sama
   *  membuat ketiganya terbaca sebagai varian dari hal yang sama. */
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
  name: 'RADYT',
  symbol: '®',
  person: 'Radhyta Mukhsin',
  role: 'Founder & Brand Strategist',
  company: 'Custompedia Creative Group',
  city: 'Semarang, Indonesia',
  tagline: 'Membangun merek yang bertahan, bukan sekadar konten yang ramai sehari.',
  // TODO: konfirmasi alamat email yang dipakai untuk inbound.
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
  { id: 'services', label: 'Paket', href: '#services', icon: 'bolt' },
  { id: 'clients', label: 'Klien', href: '#clients', icon: 'people' },
  { id: 'faq', label: 'FAQ', href: '#faq', icon: 'question' },
];

export const hero = {
  eyebrow: 'Strategy-engineered',
  eyebrowSecond: 'creative agency.',
  headline: ['Kami bangun', 'merek —', 'bukan momen.'],
  traits: ['Branding', 'Management', 'Digital Activation', 'Audit', 'Performance'],
  ctaPrimary: { label: 'Ngobrol Dulu', href: brand.bookingUrl },
  ctaSecondary: { label: 'Lihat Karya', href: '#work' },
};

/** Angka besar di sidebar. `count` memicu animasi odometer. */
export const stats: Stat[] = [
  { value: '12', label: 'Tahun jalan' },
  { value: '168K', label: 'Followers' },
];

/** Nama yang berjalan di marquee sidebar — sub-brand & lini usaha grup. */
export const clients: string[] = [
  'Customfluencer',
  'Customlab',
  'Customclick',
  'Custompedia ADV',
  'Parcelin Creative',
  'Custompedia Merch',
  'Custom Event',
];

export const about = {
  label: 'Mulai kecil, tumbuh besar',
  headline: ['Tentang Radyt', '& Perjalanannya'],
  intro:
    'Dua belas tahun lalu Custompedia dimulai dari satu meja di Semarang. Yang terjadi setelahnya lebih enak ditunjukkan daripada dijelaskan.',
};

export const timeline: TimelineEntry[] = [
  {
    year: '14',
    title: 'Custompedia lahir di Semarang',
    body: 'Satu meja, satu laptop, dan klien pertama yang percaya sebelum ada portofolio yang bisa ditunjukkan. Dari situ semuanya berangkat.',
    handle: '@awalmula',
    age: '12 tahun lalu',
  },
  {
    year: '16',
    title: 'Dari desain ke strategi',
    body: 'Klien tidak butuh konten bagus — mereka butuh konten yang menjual. Sejak itu setiap pekerjaan dimulai dari brief bisnis, bukan brief visual.',
    handle: '@strategi',
    age: '10 tahun lalu',
  },
  {
    year: '18',
    title: 'Tim pertama, proses pertama',
    body: 'Dari kerja sendirian jadi punya tim. Yang paling sulit bukan menambah orang, tapi menuliskan cara kerja yang tadinya cuma ada di kepala.',
    handle: '@tim',
    age: '8 tahun lalu',
  },
  {
    year: '20',
    title: 'Bertahan lewat pandemi',
    body: 'Anggaran klien dipotong, banyak proyek berhenti. Kami putar arah ke digital activation dan justru menemukan lini layanan yang bertahan sampai sekarang.',
    handle: '@bertahan',
    age: '6 tahun lalu',
  },
  {
    year: '22',
    title: 'Grup, bukan lagi satu agensi',
    body: 'Customfluencer, Customlab, dan Customclick berdiri sebagai lini sendiri. Satu klien bisa ditangani dari hulu ke hilir tanpa dioper ke pihak lain.',
    handle: '@grup',
    age: '4 tahun lalu',
  },
  {
    year: '24',
    title: 'Parcelin Creative Indonesia',
    body: 'Co-founder di lini baru. Pelajarannya: membangun merek orang lain dan membangun merek sendiri ternyata butuh disiplin yang sama.',
    handle: '@parcelin',
    age: '2 tahun lalu',
  },
  {
    year: '26',
    title: 'Masih di jalur yang sama',
    body: 'Dua belas tahun, 168 ribu pengikut, dan ratusan merek. Sekarang mencari tahu di mana AI benar-benar membantu — dan di mana ia cuma bikin ramai.',
    handle: '@sekarang',
    age: 'hari ini',
  },
];

export const work = {
  label: 'Karya pilihan',
  headline: ['Dibangun untuk', 'Bertumbuh'],
  intro:
    'Dua belas tahun menangani merek dari berbagai skala — F&B, ritel, properti, sampai institusi. Ini sebagian di antaranya.',
  // TODO: ganti dengan nama klien asli setelah dapat izin publikasi.
  items: [
    {
      title: 'Kuliner Nusantara',
      kind: 'F&B',
      blurb: 'Rebranding jaringan restoran dari 3 jadi 11 gerai dalam dua tahun.',
      tags: ['Branding', 'Social Media', 'Activation'],
      accent: '#3f2a1d',
      href: '#',
    },
    {
      title: 'Griya Properti',
      kind: 'Properti',
      blurb: 'Kampanye peluncuran hunian yang sold out sebelum topping off.',
      tags: ['Performance', 'KOL', 'OOH'],
      accent: '#1f3340',
      href: '#',
    },
    {
      title: 'Batik Semarangan',
      kind: 'Ritel',
      blurb: 'Membawa merek warisan keluarga ke etalase digital tanpa kehilangan akarnya.',
      tags: ['Branding', 'Content', 'E-commerce'],
      accent: '#4a2438',
      href: '#',
    },
    {
      title: 'Klinik Sehat',
      kind: 'Kesehatan',
      blurb: 'Membangun kepercayaan di kategori yang paling sensitif terhadap klaim.',
      tags: ['Strategy', 'Content', 'Audit'],
      accent: '#14392c',
      href: '#',
    },
    {
      title: 'Kopi Kedua',
      kind: 'F&B',
      blurb: 'Dari kedai tunggal jadi merek yang dicari orang dari luar kota.',
      tags: ['Branding', 'KOL', 'Merch'],
      accent: '#2a2118',
      href: '#',
    },
    {
      title: 'Festival Kota',
      kind: 'Event',
      blurb: 'Aktivasi tiga hari, 40 ribu pengunjung, satu identitas visual yang konsisten.',
      tags: ['Event', 'OOH', 'Activation'],
      accent: '#3d2c56',
      href: '#',
    },
    {
      title: 'Retail Modern',
      kind: 'Ritel',
      blurb: 'Audit kanal yang memangkas biaya iklan 40% tanpa menurunkan penjualan.',
      tags: ['Audit', 'Performance'],
      accent: '#101014',
      href: '#',
    },
    {
      title: 'Institusi Publik',
      kind: 'Institusi',
      blurb: 'Menerjemahkan program pemerintah jadi bahasa yang dipakai warganya sehari-hari.',
      tags: ['Strategy', 'Content', 'Social Media'],
      accent: '#1b2a4a',
      href: '#',
    },
    {
      title: 'Fashion Lokal',
      kind: 'Fashion',
      blurb: 'Satu kampanye KOL yang menghabiskan stok satu musim dalam sebelas hari.',
      tags: ['KOL', 'Performance', 'Content'],
      accent: '#241a2e',
      href: '#',
    },
    // `as`, bukan `satisfies`: satisfies mempertahankan tipe literal array ini,
    // jadi field media opsional (image/video/videoWebm) terbaca "tidak ada" di
    // Work.astro sampai ada satu item yang benar-benar mengisinya.
  ] as WorkItem[],
};

export const capabilities = {
  headline: ['Yang Anda', 'Dapatkan'],
  label: 'Lima pilar layanan',
  /** Kata bertanda `[chip]` diganti chip ikon oleh WhatYouGet.astro. */
  paragraph:
    'Strategi, [chip] eksekusi, dan pengukuran [chip] dijalankan satu atap — supaya merek Anda [chip] tumbuh dengan arah [chip] yang jelas, bukan [chip] sekadar ramai sesaat.',
  items: [
    {
      title: 'Branding',
      body: 'Positioning, identitas visual, dan panduan merek yang bisa dipakai tim internal tanpa kami.',
      icon: 'spark',
    },
    {
      title: 'Management',
      body: 'Pengelolaan kanal harian: perencanaan konten, produksi, publikasi, sampai balas komentar.',
      icon: 'layers',
    },
    {
      title: 'Digital Activation',
      body: 'KOL, kampanye peluncuran, event, dan aktivasi luring yang tersambung ke kanal digital.',
      icon: 'plug',
    },
    {
      title: 'Audit',
      body: 'Membaca ulang kanal dan belanja iklan yang sudah jalan, lalu menunjuk mana yang membuang uang.',
      icon: 'search',
    },
    {
      title: 'Performance',
      body: 'Iklan berbayar yang diukur sampai angka penjualan, bukan berhenti di jumlah tayangan.',
      icon: 'gauge',
    },
  ] satisfies Capability[],
};

export const services = {
  label: 'Paket kerja sama',
  headline: ['Skala Berbeda,', 'Standar Sama'],
  intro: 'Kualitas dan perhatiannya sama. Yang membedakan hanya cakupan dan kecepatan.',
  // TODO: angka di bawah masih perkiraan — sesuaikan dengan rate card resmi.
  tiers: [
    {
      name: 'Brand Audit',
      icon: 'search',
      price: 'Rp 5jt',
      unit: '/ sekali jalan',
      intro: 'Pemeriksaan menyeluruh kanal dan belanja iklan yang sedang berjalan.',
      features: [
        'Audit kanal sosial dan konten 6 bulan terakhir',
        'Pemeriksaan belanja iklan dan efisiensinya',
        'Analisis tiga kompetitor terdekat',
        'Rekomendasi prioritas perbaikan',
        'Sesi presentasi bersama tim Anda',
      ],
      footnote: 'Untuk merek yang sudah jalan tapi merasa hasilnya jalan di tempat.',
    },
    {
      name: 'Retainer Bulanan',
      icon: 'gauge',
      price: 'Rp 15jt',
      unit: '/ bulan',
      intro: 'Tim kami jadi bagian dari tim Anda. Minimal kerja sama tiga bulan.',
      features: [
        'Perencanaan dan produksi konten bulanan',
        'Pengelolaan harian seluruh kanal',
        'Pengelolaan belanja iklan',
        'Laporan bulanan dengan angka yang bisa ditindaklanjuti',
        'Satu sesi strategi tiap bulan',
        'Prioritas pengerjaan untuk kebutuhan mendadak',
      ],
      footnote: 'Untuk merek yang butuh pertumbuhan berkelanjutan, bukan kampanye sesaat.',
      featured: true,
    },
    {
      name: 'Proyek Khusus',
      icon: 'spark',
      price: 'Ngobrol Dulu',
      intro: 'Rebranding, peluncuran, atau aktivasi berskala besar. Tiap cakupan berbeda.',
      features: [
        'Rebranding menyeluruh dan panduan merek',
        'Kampanye peluncuran lintas kanal',
        'Aktivasi luring, event, dan OOH',
        'Manajemen KOL berskala besar',
        'Produksi merchandise',
        'Pendampingan 30 hari setelah peluncuran',
      ],
      footnote: 'Untuk pekerjaan besar yang cakupannya perlu dibicarakan lebih dulu.',
    },
  ] satisfies PricingTier[],
};

export const cta = {
  /** Dua baris pertama gelap, dua baris `soft` dipudarkan hampir jadi latar.
   *  Empat baris total — itu yang memberi judulnya arah turun ke tombol. */
  headline: ['Kanal Anda', 'Sudah Ramai —'],
  headlineSoft: ['Tapi Apakah', 'Menjual?'],
  body:
    'Ramai belum tentu tumbuh. Kami baca kanal Anda dan tunjukkan mana yang sebenarnya bekerja — gratis, tanpa kewajiban lanjut.',
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
      headline: 'Laporannya jujur, termasuk yang gagal.',
      quote:
        'Pernah satu kampanye tidak jalan dan mereka bilang duluan sebelum kami tanya, lengkap dengan rencana perbaikannya. Itu yang bikin kami bertahan.',
      name: 'Nama Klien',
      role: 'Marketing Manager',
      company: 'Ritel',
    },
    {
      headline: 'Tim internal kami jadi ikut naik kelas.',
      quote:
        'Panduan mereknya dipakai sampai sekarang. Tim kami bisa jalan sendiri untuk hal-hal harian, dan itu memang tujuannya sejak awal.',
      name: 'Nama Klien',
      role: 'Founder',
      company: 'Fashion',
    },
    {
      headline: 'Cepat, tapi tidak asal cepat.',
      quote:
        'Peluncuran kami maju tiga minggu dan mereka tetap kejar tanpa menurunkan kualitas. Revisi ditangani tanpa drama.',
      name: 'Nama Klien',
      role: 'Project Lead',
      company: 'Properti',
    },
    {
      headline: 'Berani bilang tidak.',
      quote:
        'Kami minta ikut tren yang lagi ramai, mereka menolak dan menjelaskan kenapa itu tidak cocok buat kategori kami. Ternyata benar.',
      name: 'Nama Klien',
      role: 'Direktur',
      company: 'Kesehatan',
    },
    {
      headline: 'Satu pintu untuk semua.',
      quote:
        'Dari konten harian, KOL, sampai banner di jalan — semuanya satu tim. Kami tidak perlu jadi penerjemah antar vendor lagi.',
      name: 'Nama Klien',
      role: 'General Manager',
      company: 'Institusi',
    },
    {
      headline: 'Iklan jadi jauh lebih efisien.',
      quote:
        'Setelah audit, belanja iklan kami turun tapi penjualan tetap. Ternyata selama ini banyak yang terbuang di tempat yang salah.',
      name: 'Nama Klien',
      role: 'Owner',
      company: 'E-commerce',
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
      question: 'Apa bedanya dengan agensi lain?',
      answer:
        'Kami mulai dari masalah bisnis, bukan dari ide konten. Setiap pekerjaan diikat ke satu angka yang mau digerakkan — penjualan, biaya akuisisi, atau pangsa perhatian di kategori Anda.',
    },
    {
      question: 'Melayani klien di luar Semarang?',
      answer:
        'Ya. Basis kami di Semarang, tapi sebagian klien ada di Jakarta, Surabaya, dan Bali. Pertemuan rutin daring, kunjungan langsung saat produksi atau aktivasi.',
    },
    {
      question: 'Berapa lama sampai kelihatan hasilnya?',
      answer:
        'Perbaikan kanal biasanya terasa di bulan pertama. Pertumbuhan yang stabil butuh tiga sampai enam bulan — itu sebabnya retainer minimal tiga bulan.',
    },
    {
      question: 'Sudah punya tim internal, masih perlu agensi?',
      answer:
        'Justru paling efektif begitu. Kami masuk sebagai strategi dan produksi, tim Anda pegang eksekusi harian. Banyak klien akhirnya jalan sendiri, dan itu bukan kegagalan.',
    },
    {
      question: 'Bagaimana proses dari awal sampai jalan?',
      answer:
        'Ngobrol awal, audit singkat, penyusunan strategi, lalu produksi bertahap yang bisa Anda tinjau di tiap titik. Sebelum peluncuran ada daftar periksa bersama.',
    },
    {
      question: 'Bisa tanda tangan NDA?',
      answer: 'Bisa. Kirim dokumen Anda sebelum pertemuan pertama, atau kami sediakan NDA dua arah.',
    },
    {
      question: 'Bagaimana revisi ditangani?',
      answer:
        'Semua masukan masuk ke satu daftar bersama dan diprioritaskan berdua. Dua putaran revisi termasuk dalam setiap paket bercakupan tetap.',
    },
    {
      question: 'Apakah menangani produksi foto dan video?',
      answer:
        'Ya, lewat Customlab. Produksi, KOL, iklan, dan merchandise semuanya di dalam grup — tidak dioper ke pihak ketiga.',
    },
    {
      question: 'Belum yakin paket mana yang cocok?',
      answer:
        'Mulai dari ngobrol. Kalau ternyata tidak ada yang cocok, kami akan bilang apa adanya dan menunjukkan arah lain yang lebih pas.',
    },
  ] satisfies FaqItem[],
};

