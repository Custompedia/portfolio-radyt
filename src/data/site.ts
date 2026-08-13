/**
 * SATU-SATUNYA sumber konten situs. Ganti isi file ini dan seluruh halaman ikut
 * berubah — tidak perlu menyentuh markup atau kode animasi.
 *
 * Isinya mengikuti `radhytam-copy-handoff.md` (12 Agustus 2026, status final).
 * Dua aturan bahasa dari handoff dipegang di seluruh file ini:
 *
 *   1. Judul, eyebrow, dan label section ditulis BAHASA INGGRIS.
 *   2. Body dan paragraf ditulis BAHASA INDONESIA resmi — lugas, kalimat pendek.
 *      Jangan mencampur keduanya di dalam satu paragraf.
 *
 * Nama orang ditulis lengkap "Radhyta Mahenda Mukhsin" di mana pun ia muncul,
 * dan perusahaan cetaknya dieja "Creasa" (bukan "CREASA").
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  /**
   * Section yang diwakili item ini. Satu menu boleh menaungi lebih dari satu
   * section — "Work" menaungi Network & Reach dan The Work. Dibaca
   * modules/nav-active.ts untuk menyalakan menu sesuai posisi scroll.
   */
  sections: string[];
}

export interface Stat {
  value: string;
  label: string;
  /**
   * Kartu ini punya posisi awal di hero dan diterbangkan ke rail oleh
   * modules/ghost.ts. Tepat SATU stat boleh menyalakannya — handoff membatasi
   * bukti di hero jadi satu angka. Sisanya muncul saat rail merakit diri.
   */
  inHero?: boolean;
}

export interface ClientLogo {
  name: string;
  src: string;
  shape: 'landscape' | 'square';
  desktopWidth: number;
  mobileWidth: number;
  scale?: number;
}

/** Satu bab perjalanan. Sengaja hanya tiga field: handoff meminta seluruh
 *  mini-stat lama dibuang karena tidak ada sumbernya. */
export interface JourneyEntry {
  year: string;
  title: string;
  body: string;
  image: string;
}

/** Kartu Section 04. Formatnya seragam: nama · label · deskripsi. */
export interface Company {
  name: string;
  label: string;
  description: string;
  logo: string;
}

export interface WorkItem {
  title: string;
  kind: string;
  blurb: string;
  tags: string[];
  accent: string;
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

export interface ContactChannel {
  label: string;
  href: string;
  icon: string;
}

export const brand = {
  name: 'RADHYTA',
  symbol: '®',
  person: 'Radhyta Mahenda Mukhsin',
  /** Ikut jadi <title> halaman, jadi ditahan tetap pendek. */
  role: 'Serial Entrepreneur',
  email: 'radhytam@gmail.com',
  whatsappUrl: 'https://wa.me/6282226171071',
  instagramUrl: 'https://www.instagram.com/radhytam/',
  tiktokUrl: 'https://www.tiktok.com/@radhytam',
  linkedinUrl: 'https://www.linkedin.com/in/radhyta-mukhsin-4602138a/',
} as const;

/**
 * Ikon sosial di sidebar. WhatsApp sengaja TIDAK ikut di sini: ia sudah jadi
 * tombol utama di kaki rail, dan menaruhnya dua kali membuat dua tombol
 * WhatsApp berdampingan. Email juga punya kartunya sendiri di bawah marquee.
 */
export const social: ContactChannel[] = [
  { label: 'Instagram', href: brand.instagramUrl, icon: 'instagram' },
  { label: 'TikTok', href: brand.tiktokUrl, icon: 'tiktok' },
  { label: 'LinkedIn', href: brand.linkedinUrl, icon: 'linkedin' },
];

/**
 * Lima menu. `sections` yang menentukan kapan menu menyala — bukan `href` —
 * karena About dan Work masing-masing menaungi dua section.
 */
export const nav: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: 'home', sections: ['home'] },
  { id: 'journey', label: 'Journey', href: '#journey', icon: 'user', sections: ['about', 'journey', 'companies'] },
  { id: 'work', label: 'Work', href: '#work', icon: 'briefcase', sections: ['network', 'work'] },
  { id: 'contact', label: 'Contact', href: '#contact', icon: 'people', sections: ['moment', 'contact'] },
];

export const hero = {
  eyebrow: 'Serial entrepreneur,',
  eyebrowSecond: 'Semarang',
  headline: ['BUILDING COMPANIES.', 'FROM THE GROUND UP.', 'SINCE 2014.'],
  subheadline: 'Creative agency and creative packaging from Semarang.',
  traits: ['Custompedia', 'Parcelin', 'Creasa', 'Voca', 'But Gawe'],
  ctaPrimary: { label: "Let's Talk", href: brand.whatsappUrl },
  ctaSecondary: { label: 'See Work', href: '#work' },
};

/**
 * Angka besar di rail. `label` dirender satu baris utuh di bawah angkanya, jadi
 * tahan tetap SATU kata — dua kata mulai memaksa kartunya melebar.
 *
 * Keduanya muncul di hero lalu bermorfosis kembali menjadi kartu di rail.
 */
export const stats: Stat[] = [
  { value: '3', label: 'Companies' },
  { value: '12+', label: 'Years experience' },
];

/**
 * Logo klien — dipakai bersama oleh marquee sidebar dan baris "Trusted by" di
 * Section 05. Isinya hanya hubungan langsung yang bisa dipertanggungjawabkan;
 * handoff melarang logo lama yang hubungannya tidak jelas (Airbnb, ByteDance,
 * Pertamina, Astra, HM Sampoerna, Shopee, Cosmax, Kahf, Pegipegi, BTN).
 *
 * TODO aset: Bank Jateng, PLN, Time International, Mondelez, Paragon Corp, dan
 * Unilever ada di shortlist handoff tapi filenya belum masuk ke public/images.
 */
export const clients: ClientLogo[] = [
  { name: 'Gojek', src: '/images/logo-gojek.webp', shape: 'landscape', desktopWidth: 3.75, mobileWidth: 60, scale: 0.9 },
  { name: 'GoTo', src: '/images/GoTo_logo.webp', shape: 'landscape', desktopWidth: 3.25, mobileWidth: 52, scale: 0.86 },
  { name: 'Tokopedia', src: '/images/Logo-Tokopedia.webp', shape: 'landscape', desktopWidth: 4.6, mobileWidth: 74 },
  { name: 'Pemprov Jawa Tengah', src: '/images/Coat_of_arms_of_Central_Java.svg.webp', shape: 'square', desktopWidth: 1.75, mobileWidth: 28, scale: 0.65 },
  { name: 'Roda Roda', src: '/images/Roda%20Roda%20Background%20Removed.webp', shape: 'landscape', desktopWidth: 4.35, mobileWidth: 70 },
];

/**
 * Section 02. Sisi personal dan cerita perintis dilebur ke sini — tidak ada
 * section terpisah untuk keduanya.
 */
export const about = {
  eyebrow: 'Three Companies, One Desk',
  headline: 'About Radhyta',
  lead: 'Berawal dari satu meja pada 2014, Radhyta membangun Custompedia, Parcelin, dan Creasa dari Semarang. Kini, ketiganya melayani bisnis di seluruh Indonesia.',
  stories: [
    {
      title: 'Built from zero',
      body: 'Semuanya dimulai dari nol. Dari berjualan baju online, lalu merchandise custom, hingga berkembang menjadi tiga perusahaan. Tidak ada yang diwarisi. Semuanya dirintis dari awal.',
    },
    {
      title: 'The turning point',
      body: 'Titik terberat datang pada 2020, saat pandemi menghentikan lini merchandise yang selama ini menopang bisnis. Dari situ, Custompedia bertransformasi menjadi creative agency dan Parcelin lahir dari penjualan hampers. Masa sulit tersebut menjadi awal dari pertumbuhan baru.',
    },
    {
      title: 'Beyond the work',
      body: 'Di luar pekerjaan, Radhyta adalah seorang suami dan ayah. Ia meluangkan waktu untuk gym, menjelajah tempat baru, dan merawat kecintaannya pada hewan. Semarang tetap menjadi tempat semuanya dimulai.',
    },
  ],
  location: 'Semarang, Indonesia',
};

/**
 * Section 03. Menggantikan timeline lama SELURUHNYA — tahun di versi lama
 * memang salah (2014 Custompedia, 2017 Parcelin).
 *
 * Enam unit bisnis Parcelin sengaja tidak dirinci di sini; rincian bidang ada
 * di `companies`.
 */
export const journey = {
  eyebrow: 'Since 2014',
  headline: ['FROM ONE ONLINE SHOP', 'TO BUILDING THREE COMPANIES.'],
  entries: [
    {
      year: '2014',
      title: 'The first online shop',
      body: 'Radhyta dan pasangannya memulai bisnis online: konveksi dan dropship baju, dijalankan sepenuhnya secara digital.',
      image: '/images/timeline/2014-online-shop.webp',
    },
    {
      year: '2016',
      title: 'Custompedia begins',
      body: 'Custompedia dimulai dengan menjual merchandise custom secara digital, dan sempat dikenal luas sebagai brand custom gift saat itu.',
      image: '/images/timeline/2016-custompedia.webp',
    },
    {
      year: '2018',
      title: 'First agency client: Gojek',
      body: 'Gojek meminta Custompedia menangani branding dan media sosial, setelah melihat cara Custompedia memasarkan produknya sendiri.',
      image: '/images/timeline/2018-first-agency-client.webp',
    },
    {
      year: '2020',
      title: 'Pivot to a creative agency',
      body: 'Pandemi menghentikan lini merchandise. Custompedia beralih penuh menjadi creative agency, dan Parcelin lahir dari penjualan hampers.',
      image: '/images/timeline/2020-pivot.webp',
    },
    {
      year: '2021',
      title: 'Parcelin expands',
      body: 'Parcelin melebar dari hampers ke kemasan dan percetakan.',
      image: '/images/timeline/2021-packaging.webp',
    },
    {
      year: '2023',
      title: 'National GoFood vendor',
      body: 'Custompedia menjadi vendor branding GoFood untuk seluruh Indonesia, sekaligus menangani berbagai brand activation Gojek di banyak kota.',
      image: '/images/timeline/2023-activation.webp',
    },
    {
      year: '2024',
      title: 'Nine cities, one team',
      body: 'Seluruh akun media sosial Gojek regional — Semarang, Solo, Bandung, Yogyakarta, Makassar, Palembang, Batam, Padang, dan Kalimantan — dikelola Custompedia.',
      image: '/images/timeline/2024-regional-team.webp',
    },
    {
      year: '2025',
      title: 'A group and a new company',
      body: 'Parcelin berkembang menjadi enam unit bisnis, dan Creasa berdiri sebagai perusahaan percetakan online.',
      image: '/images/timeline/2025-printing.webp',
    },
    {
      year: '2026',
      title: 'Two new ventures',
      body: 'Custompedia menambah dua unit: But Gawe untuk brand activation dan Voca untuk KOL management.',
      image: '/images/timeline/2026-ventures.webp',
    },
  ] satisfies JourneyEntry[],
};

/**
 * Section 04. Dua aturan keras dari handoff: jangan sebut nama unit
 * (parcelinpack, Voca, But Gawe), dan jangan sebut kepemilikan atau peran
 * (founder, co-founder, owner). Cukup level perusahaan.
 */
export const companies = {
  eyebrow: 'The Companies',
  headline: 'Three companies. One shared standard.',
  intro: 'Tiga spesialisasi yang bergerak bersama dari satu cara berpikir: buat yang relevan, lalu buat sampai tuntas.',
  items: [
    {
      name: 'Custompedia Creative Group',
      label: 'Creative agency',
      description: 'Branding, media sosial, produksi visual, iklan digital, KOL, dan brand activation.',
      logo: '/images/favicon.svg',
    },
    {
      name: 'Parcelin Creative Indonesia',
      label: 'Creative packaging',
      description: 'Kemasan, cetak, dan produksi untuk bisnis, dari UMKM sampai perusahaan besar.',
      logo: '/images/Parcelinpack-transparent.webp',
    },
    {
      name: 'Creasa — Creative Supply Asia',
      label: 'Online retail printing',
      description: 'Layanan cetak ritel online.',
      logo: '/images/CREASA%20LOGO%20NO%20BACKGROUND-01.webp',
    },
  ] satisfies Company[],
};

/**
 * Section 05. `outlook` adalah ASPIRASI, bukan pencapaian — karena itu ia
 * menyebut "Asia Tenggara" dan bukan negara tertentu, dan tidak boleh
 * ditumpangkan ke peta. Belum ada klien di sana.
 *
 * Tidak ada ajakan referral dan tidak ada daftar industri: sengaja dihilangkan
 * agar section ini tetap relevan untuk komunitas mana pun.
 */
export const network = {
  eyebrow: 'Network & reach',
  headline: 'Business runs on relationships',
  intro: 'Selain membangun bisnis, Radhyta aktif di komunitas bisnis dan menjaga jaringan yang terus berkembang.',
  activeLabel: 'Active in',
  trustedLabel: 'Trusted by',
  outlookLabel: 'Setting sights on Southeast Asia',
  outlook: 'Berbasis di Semarang, melayani klien di seluruh Indonesia, dan menyiapkan langkah berikutnya ke Asia Tenggara.',
};

export const networkActive = [
  { name: 'BNI Lighthouse', src: '/images/BNI_logo.svg.webp', shape: 'landscape' },
  { name: 'HIPMI Jateng', src: '/images/HIPMI%20Jateng.png', shape: 'portrait' },
  { name: 'Yuk Bisnis', src: '/images/Yuk%20Bisnis.png', shape: 'landscape' },
  { name: 'Moslem Entrepreneurs Semarang', mark: 'MES' },
  { name: 'Karang Taruna Jateng', mark: 'KT' },
];

/**
 * Section 06. Kartu TIDAK punya halaman detail, jadi tidak ada tombol panah dan
 * tidak ada anchor — hanya foto, judul, dan deskripsi.
 *
 * TODO aset: kartu Creasa belum punya foto. Selama `image` kosong, Work.astro
 * jatuh ke mockup CSS di atas `accent`, bukan gambar rusak.
 */
export const work = {
  eyebrow: 'The Work',
  headline: ['Built to', 'grow'],
  intro:
    'Custompedia menangani merek dan kanalnya. Parcelin menangani kemasan dan barangnya. Creasa mengurus percetakan.',
  items: [
    {
      title: 'Branding & Identity',
      kind: 'Custompedia',
      blurb: 'Positioning, identitas visual, dan panduan merek yang bisa dipakai tim internal secara mandiri.',
      tags: ['Branding', 'Design', 'Guideline'],
      accent: '#3f2a1d',
      image: '/images/work-branding-natural.webp',
    },
    {
      title: 'Social Media Handling',
      kind: 'Custompedia',
      blurb: 'Perencanaan, produksi, publikasi, sampai membalas komentar. Pengelolaan kanal harian.',
      tags: ['Social Media', 'Content', 'Community'],
      accent: '#1f3340',
      image: '/images/work-social-media.webp',
    },
    {
      title: 'KOL Management',
      kind: 'Custompedia',
      blurb: 'Pemilihan, negosiasi, dan pengukuran kreator. Hasilnya dinilai dari penjualan, bukan jumlah tayangan.',
      tags: ['KOL', 'Campaign', 'Report'],
      accent: '#4a2438',
      image: '/images/work-kol-natural.webp',
    },
    {
      title: 'Digital Advertising',
      kind: 'Custompedia',
      blurb: 'Iklan berbayar yang diikat ke satu target bisnis, lengkap dengan audit belanja iklan yang sudah berjalan.',
      tags: ['Ads', 'Audit', 'Performance'],
      accent: '#101014',
      image: '/images/work-digital-ads-natural.webp',
    },
    {
      title: 'Activation, OOH & Event',
      kind: 'Custompedia',
      blurb: 'Peluncuran, papan luar ruang, dan event yang tersambung kembali ke kanal digital.',
      tags: ['Activation', 'OOH', 'Event'],
      accent: '#3d2c56',
      image: '/images/work-activation-event-natural.webp',
    },
    {
      title: 'Custom Packaging',
      kind: 'Parcelin',
      blurb: 'Kemasan yang dirancang dari ukuran barangnya, bukan dari cetakan yang kebetulan tersedia.',
      tags: ['Packaging', 'Struktur', 'Cetak'],
      accent: '#14392c',
      image: '/images/work-custom-box.webp',
    },
    {
      title: 'Hampers & PR Package',
      kind: 'Parcelin',
      blurb: 'Paket kiriman untuk media dan mitra, dibuat agar layak difoto begitu kotaknya dibuka.',
      tags: ['Hampers', 'PR Kit', 'Seasonal'],
      accent: '#2a2118',
      image: '/images/work-pr-hampers.webp',
    },
    {
      title: 'UMKM Packaging',
      kind: 'Parcelin',
      blurb: 'Pesanan kecil dengan mutu cetak yang sama, agar usaha rumahan bisa masuk rak yang sama.',
      tags: ['UMKM', 'MOQ Rendah', 'Konsultasi'],
      accent: '#241a2e',
      image: '/images/work-umkm-packaging-natural.webp',
    },
    {
      title: 'Online Retail Printing',
      kind: 'Creasa',
      blurb: 'Layanan cetak ritel online untuk kebutuhan cepat dan bervolume.',
      tags: ['Cetak', 'Ritel', 'Online'],
      accent: '#1b2a4a',
    },
    // `as`, bukan `satisfies`: satisfies mempertahankan tipe literal array ini,
    // jadi field media opsional (image/video/videoWebm) terbaca "tidak ada" di
    // Work.astro sampai ada satu item yang benar-benar mengisinya.
  ] as WorkItem[],
};

/**
 * Jeda visual antara The Work dan CTA penutup — scene 3D "Pedi". Bukan salah
 * satu dari tujuh section handoff; ia tidak menawarkan apa pun dan sengaja
 * TIDAK punya tombol sendiri, supaya satu-satunya ajakan di kaki halaman tetap
 * tombol WhatsApp di section terakhir.
 */
export const moment = {
  eyebrow: 'The Moment It Lands',
  headline: ['Custompedia makes', 'brands feel alive.'],
  intro:
    'Kami membantu brand menemukan bentuknya, nadanya, dan momennya. Dari strategi hingga eksekusi, setiap detail dirancang agar orang tidak hanya melihat, tetapi ikut merasakan.',
  beats: [
    { number: '01', label: 'Find the signal', body: 'Menemukan sudut yang membuat brand layak diperhatikan.' },
    { number: '02', label: 'Build the moment', body: 'Mengubah strategi menjadi konten, kampanye, dan pengalaman nyata.' },
    { number: '03', label: 'Keep it moving', body: 'Membuat setiap touchpoint terus bekerja setelah momen pertama lewat.' },
  ],
  closing: ['The right story', 'moves people forward.'],
};

/**
 * Section 07 — penutup halaman. Menggantikan QnA picker lama sepenuhnya: satu
 * blok bersih berisi eyebrow, headline, body, SATU tombol, dan baris kontak
 * alternatif. Tidak ada picker di section mana pun lagi.
 */
export const contact = {
  eyebrow: "Let's Talk",
  headline: "Let's talk.",
  body: 'Dari branding sampai kemasan, atau sekadar ingin berkenalan lebih dulu.',
  button: { label: 'Chat on WhatsApp', href: brand.whatsappUrl },
  alt: [
    { label: 'Instagram', href: brand.instagramUrl, icon: 'instagram' },
    { label: 'TikTok', href: brand.tiktokUrl, icon: 'tiktok' },
    { label: 'Email', href: `mailto:${brand.email}`, icon: 'mail' },
  ] satisfies ContactChannel[],
};
