export interface NavItem { id: string; label: string; href: string; icon: string; sections: string[] }
export interface Stat { value: string; label: string; inHero?: boolean }
export interface ClientLogo {
  name: string; src: string; shape: 'landscape' | 'square' | 'portrait';
  desktopWidth: number; mobileWidth: number; scale?: number;
}
export interface AboutPhoto {
  src: string; alt: string;
}
export interface JourneyEntry { year: string; title: string; body: string; image: string; alt: string }
export interface Company { name: string; label?: string; description: string; logo: string }
export type WorkGroup = 'Custompedia' | 'Parcelin' | 'Creasa';
export interface WorkItem {
  group: WorkGroup; title: string; kind: string; blurb: string; tags: string[];
  accent: string; href: string; image: string; alt: string;
}
export interface ContactChannel { label: string; href: string; icon: string }

export const brand = {
  name: 'RADHYTA', symbol: '®', person: 'Radhyta Mahenda Mukhsin', role: 'Serial Entrepreneur',
  email: 'radhytam@gmail.com', whatsappUrl: 'https://wa.me/6282226171071',
  instagramUrl: 'https://www.instagram.com/radhytam/', tiktokUrl: 'https://www.tiktok.com/@radhytam',
  linkedinUrl: 'https://www.linkedin.com/in/radhyta-mukhsin-4602138a/', threadsUrl: 'https://www.threads.com/@radhytam',
} as const;

export const social: ContactChannel[] = [
  { label: 'Instagram', href: brand.instagramUrl, icon: 'instagram' },
  { label: 'TikTok', href: brand.tiktokUrl, icon: 'tiktok' },
  { label: 'LinkedIn', href: brand.linkedinUrl, icon: 'linkedin' },
  { label: 'Threads', href: brand.threadsUrl, icon: 'threads' },
];

export const nav: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: 'home', sections: ['home'] },
  { id: 'journey', label: 'Journey', href: '#journey', icon: 'user', sections: ['about', 'journey', 'companies'] },
  { id: 'work', label: 'Work', href: '#work', icon: 'briefcase', sections: ['network', 'southeast-asia', 'work', 'built-to-grow'] },
  { id: 'contact', label: 'Contact', href: '#contact', icon: 'people', sections: ['contact'] },
];

export const hero = {
  headline: ['BUILDING COMPANIES.', 'FROM THE GROUND UP.', 'SINCE 2014.'],
  subheadline: 'Creative agency, packaging, and printing businesses built from Semarang.',
  holdings: [
    { name: 'Custompedia', units: ['Voca', 'But Gawe'] },
    { name: 'Parcelin', units: [] },
    { name: 'Creasa', units: [] },
  ],
  ctaPrimary: { label: "Let's Talk", href: brand.whatsappUrl }, ctaSecondary: { label: 'See Work', href: '#work' },
};

export const stats: Stat[] = [
  { value: '3', label: 'Holding Companies' },
  { value: '12+', label: 'Years experience' },
];

export const clients: ClientLogo[] = [
  { name: 'Pemerintah Provinsi Jawa Tengah', src: '/images/Coat_of_arms_of_Central_Java.svg.webp', shape: 'square', desktopWidth: 1.75, mobileWidth: 32 },
  { name: 'Pemerintah Kota Semarang', src: '/images/Lambang_Kota_Semarang%20(1).webp', shape: 'portrait', desktopWidth: 1.35, mobileWidth: 26 },
  { name: 'Bank Jateng', src: '/images/logos/clients/bank-jateng.webp', shape: 'landscape', desktopWidth: 3.7, mobileWidth: 62 },
  { name: 'Kata Media Jateng', src: '/images/logos/clients/katamedia-jateng.webp', shape: 'square', desktopWidth: 1.65, mobileWidth: 30 },
  { name: 'Gojek', src: '/images/logo-gojek.webp', shape: 'landscape', desktopWidth: 3.75, mobileWidth: 60 },
  { name: 'Tokopedia', src: '/images/Logo-Tokopedia.webp', shape: 'landscape', desktopWidth: 4.6, mobileWidth: 74 },
  { name: 'Erha', src: '/images/logos/clients/erha.webp', shape: 'square', desktopWidth: 1.6, mobileWidth: 30 },
  { name: 'Kyra Co-Living', src: '/images/logos/clients/kyra.webp', shape: 'square', desktopWidth: 1.65, mobileWidth: 30 },
  { name: 'Doyle', src: '/images/logos/clients/doyle.webp', shape: 'square', desktopWidth: 1.65, mobileWidth: 30 },
  { name: 'Unika Soegijapranata', src: '/images/Unika_Soegijapranata_Talenta_Propatria_et_Humaniora.webp', shape: 'landscape', desktopWidth: 3.1, mobileWidth: 48 },
  { name: 'PT HM Sampoerna Tbk', src: '/images/logo-hm-sampoerna-115507099816te6s4zjge.webp', shape: 'square', desktopWidth: 1.6, mobileWidth: 30 },
  { name: 'Ken Ken Indonesia', src: '/images/logos/clients/ken-ken-indonesia.webp', shape: 'landscape', desktopWidth: 3.5, mobileWidth: 56 },
  { name: 'SEGEL', src: '/images/logos/clients/segel.webp', shape: 'square', desktopWidth: 1.65, mobileWidth: 30 },
  { name: 'Cassanatama Naturindo', src: '/images/logos/clients/cassanatama-naturindo.webp', shape: 'landscape', desktopWidth: 4.1, mobileWidth: 66 },
  { name: 'Kun Kun Visual', src: '/images/logos/clients/kunkun-visual.webp', shape: 'square', desktopWidth: 1.65, mobileWidth: 30 },
  { name: 'Mistar Comm', src: '/images/logos/clients/mistar.webp', shape: 'square', desktopWidth: 1.65, mobileWidth: 30 },
  { name: 'Shatara Indah Kreasi', src: '/images/logos/clients/shatara-indah-kreasi.webp', shape: 'landscape', desktopWidth: 4.1, mobileWidth: 66 },
  { name: 'Ecolux', src: '/images/logos/clients/ecolux.webp', shape: 'landscape', desktopWidth: 3.4, mobileWidth: 54 },
  { name: 'Gulabed', src: '/images/logos/clients/gulabed.webp', shape: 'landscape', desktopWidth: 4.1, mobileWidth: 66 },
  { name: 'Handayani', src: '/images/logos/clients/handayani.webp', shape: 'square', desktopWidth: 1.65, mobileWidth: 30 },
];

const aboutImages: AboutPhoto[] = [
  { src: '/images/about/radhyta-business-expo.webp', alt: 'Radhyta dalam pertemuan bisnis di sebuah expo' },
  { src: '/images/about/radhyta-gofood-team.webp', alt: 'Radhyta bersama tim pada acara GoFood' },
  { src: '/images/about/radhyta-gojek-office.webp', alt: 'Radhyta dan tim di kantor Gojek' },
  { src: '/images/timeline/2025-printing.webp', alt: 'Radhyta dan tim menghadiri expo percetakan' },
  { src: '/images/timeline/2023-activation.webp', alt: 'Aktivasi branding bersama tim' },
  { src: '/images/timeline/2024-regional-team.webp', alt: 'Tim Custompedia dalam kegiatan regional' },
];

export const about = {
  eyebrow: 'Three Companies, One Desk', headline: 'About Radhyta',
  lead: 'Berawal dari satu meja di Semarang pada 2014, Radhyta membangun tiga bisnis yang kini jadi satu ekosistem kreatif: Custompedia, Parcelin, dan Creasa. Dipercaya BNI Lighthouse, Gojek, hingga Pemerintah Provinsi Jawa Tengah untuk menyediakan semua kebutuhan kreatifnya - dari Semarang, untuk seluruh Indonesia.',
  stories: [
    {
      title: 'Built from zero',
      body: 'Semuanya dimulai dari nol pada 2014. Dimulai dari berjualan baju online, merchandise custom, hingga berkembang menjadi Custompedia. Tidak ada yang diwarisi. Semuanya dirintis dari awal.',
    },
    {
      title: 'The turning point',
      body: 'Titik terberat datang pada 2020. Pandemi menghentikan lini Merchandise yang selama ini menopang bisnis. Dari situ, Custompedia pivot jadi Creative Agency, Parcelin lahir dari penjualan hampers, dan Creasa tumbuh dari permintaan kebutuhan online retail.',
    },
    {
      title: 'Beyond the work',
      body: 'Di luar pekerjaan, Radhyta adalah seorang Suami dan Ayah. Selalu ada waktu untuk dihabiskan dengan anak dan istri, menekuni hobi, dan menjelajah ke tempat-tempat baru. Semarang, tetap menjadi tempat semuanya dimulai dan dijalankan.',
    },
  ],
  images: aboutImages,
};

export const journey = {
  headline: ['FROM ONE ONLINE SHOP', 'TO BUILDING THREE COMPANIES.'],
  entries: [
    { year: '2014', title: 'The First Online Shop', body: 'Radhyta dan istri memulai perjalanannya dengan bisnis online, yaitu konveksi dan dropship. Semuanya dijalankan sepenuhnya secara digital yang membangun pondasi hingga saat ini.', image: '/images/timeline/2014-online-shop.webp', alt: 'Radhyta dan istri pada awal perjalanan bisnis tahun 2014' },
    { year: '2016', title: 'Custompedia Begins', body: 'Awalnya, Custompedia dimulai dengan penjualan merchandise custom secara digital. Kala itu, Custompedia dikenal sebagai Brand Custom Gift dan dipercaya sebagai vendor custom gift untuk ratusan brand, korporat, maupun pemerintah.', image: '/images/timeline/2016-custompedia.webp', alt: 'Produk merchandise custom Custompedia tahun 2016' },
    { year: '2018', title: 'Our First Agency Client: Gojek Indonesia', body: 'Untuk pertama kalinya, Custompedia diminta Gojek Indonesia untuk menangani keperluan Branding dan Media Sosial. Permintaan ini lahir dari pandangan mereka terhadap Custompedia yang membangun digital presence produknya sendiri.', image: '/images/timeline/2018-first-agency-client.webp', alt: 'Radhyta dan tim di kantor Gojek pada tahun 2018' },
    { year: '2020', title: 'Pivot to A Creative Agency', body: 'Pandemi menghentikan lini merchandise yang menjadi tulang punggung Custompedia. Kami beralih penuh menjadi sebuah Creative Agency, khususnya untuk akun Gojek di setiap kotanya. Di masa ini, Parcelin lahir dari penjualan ribuan hampers.', image: '/images/timeline/2020-pivot.webp', alt: 'Aktivitas kreatif Gojek saat pivot Custompedia tahun 2020' },
    { year: '2021', title: 'Parcelin Expands', body: 'Parcelin tumbuh dan berkembang dari penjualan hampers ke kemasan dan percetakan.', image: '/images/timeline/2021-packaging.webp', alt: 'Pengiriman produk Parcelin pada tahun 2021' },
    { year: '2023', title: 'National GoFood Vendor', body: 'Custompedia menjadi vendor branding GoFood untuk seluruh Indonesia, sekaligus menangani brand activation Gojek di berbagai kota. Bergerak dari agensi sosial media, Custompedia pun masuk ke ranah aktivasi di lapangan.', image: '/images/timeline/2023-activation.webp', alt: 'Aktivasi branding GoFood oleh Custompedia pada tahun 2023' },
    { year: '2024', title: 'Nine Cities, Big Challenge, One Team', body: 'Setelah 6 tahun, seluruh akun media sosial Gojek Regional - Semarang, Solo, Bandung, Yogyakarta, Makassar, Palembang, Batam, Padang, dan Kalimantan - dikelola oleh Custompedia. Tidak hanya itu, satu tantangan besar kami terima di tahun ini, dan kami berhasil.', image: '/images/timeline/2024-regional-team.webp', alt: 'Tim Custompedia pada tantangan dan event besar tahun 2024' },
    { year: '2025', title: 'New Company + One Group', body: 'Parcelin berkembang menjadi enam unit bisnis, dan Creasa lahir sebagai perusahaan percetakan online. Berkembangnya Parcelin mengundang kami untuk ikut ke dalam expo di Marina Bay Singapore.', image: '/images/timeline/2025-printing.webp', alt: 'Radhyta menghadiri expo di Marina Bay Singapore tahun 2025' },
    { year: '2026', title: 'Two New Ventures', body: 'Custompedia semakin berkembang, dan melahirkan dua unit usaha baru, yaitu But Gawe untuk brand activation dan Voca untuk KOL Management.', image: '/images/timeline/2026-ventures.webp', alt: 'Seluruh anggota Custompedia dan dua unit usaha baru pada tahun 2026' },
  ] satisfies JourneyEntry[],
};

export const companies = {
  headline: 'Three Specialization, One Standard',
  intro: 'Tiga spesialisasi utama yang bergerak bersamaan dan lahir dari satu cara berpikir: Relevan dan Tuntas.',
  items: [
    { name: 'PT Custompedia Creative Group', description: 'Rumah kreatif untuk membangun brand dari strategi sampai eksekusi. Tiga unit usaha jalan beriringan: Custompedia (Media Sosial & Branding), Voca (KOL Management), dan But Gawe (Brand Activation).', logo: '/images/favicon.svg' },
    { name: 'PT Parcelin Creative Indonesia', description: 'Creative production house yang mengubah ide jadi produk nyata - packaging, printing, merchandise, sampai promosi brand, semua end-to-end dalam satu atap. Enam unit usaha, satu standar kerja.', logo: '/images/LOGO%20PT%20PARCELIN%201.webp' },
    { name: 'Creasa Print', description: 'Partner printing untuk semua kebutuhan cetak: poster, sticker, DTF, kaos, hingga gantungan kunci. Cepat pengerjaannya, rapi hasilnya.', logo: '/images/creasa-print-logo.webp' },
  ] satisfies Company[],
};

export const network = {
  headline: 'Business Runs On Relationships',
  intro: 'Radhyta percaya bisnis yang besar lahir dari relasi yang kuat. Oleh karena itu, ia tetap aktif di berbagai komunitas bisnis untuk merawat dan memperluas jaringannya.',
  activeLabel: 'Active In', trustedLabel: 'Trusted By',
};

export const networkActive = [
  { name: 'BNI Lighthouse', src: '/images/logos/communities/bni-lighthouse.webp', shape: 'landscape' },
  { name: 'HIPMI Jawa Tengah', src: '/images/logos/communities/hipmi-jateng.webp', shape: 'portrait' },
  { name: 'Yuk Bisnis', src: '/images/Yuk%20Bisnis.png', shape: 'landscape' },
  { name: 'Moslem Entrepreneur Semarang (MESEM)', src: '/images/logos/communities/mesem.webp', shape: 'square' },
  { name: 'Karang Taruna Jawa Tengah', src: '/images/logos/communities/karang-taruna-jateng.webp', shape: 'square' },
];

export const southeastAsia = {
  headline: 'Setting Sights on Southeast Asia',
  body: [
    'Berbasis di Semarang, melayani klien di seluruh Indonesia.',
    'Menyiapkan langkah berikutnya ke ranah Asia Tenggara.',
  ],
};

export const workStory = {
  headline: ['Custompedia Makes', 'Brand Feel Alive'],
  intro: 'Custompedia adalah creative marketing agency yang berfokus pada media sosial dan branding. Kami memadukan insight strategis, ide inovatif, dan teknologi terkini untuk membantu brand menemukan bentuk, suara, dan momentum yang tepat, mulai dari ide hingga eksekusi, agar audiens tak sekadar melihat, tapi ikut merasakan dan terhubung dengan brand.',
  beats: [
    { number: '01', label: 'Create', body: 'Mengubah ide menjadi visual yang segar, relevan, dan tepat sasaran, dari konsep hingga eksekusi, dirancang agar brand tak sekadar dilihat, tapi diingat.' },
    { number: '02', label: 'Convert', body: 'Kami tidak hanya membuat sesuatu terlihat menarik, tapi memastikannya benar-benar bekerja. Setiap langkah kreatif dirancang untuk mendorong dampak, pertumbuhan, dan hasil nyata.' },
    { number: '03', label: 'Connect', body: 'Membangun koneksi yang bermakna dan penuh tujuan, mengubah ide menjadi sesuatu yang berarti dan siap memberi dampak.' },
  ],
};

export const work = {
  headline: ['BUILT TO', 'GROW'], intro: 'Pilih perusahaan untuk melihat layanan, unit usaha, dan contoh hasil kerjanya.',
  groups: ['Custompedia', 'Parcelin', 'Creasa'] as WorkGroup[],
  items: [
    { group: 'Custompedia', title: 'Branding & Identity', kind: 'Custompedia', blurb: 'Positioning, identitas visual, dan panduan merek yang bisa dipakai tim internal brand secara mandiri.', tags: ['Branding', 'Design', 'Guideline'], accent: '#3f2a1d', href: 'https://discovery.custompedia.id/', image: '/images/services/custompedia-branding.webp', alt: 'Laptop yang menampilkan proses pekerjaan branding' },
    { group: 'Custompedia', title: 'Social Media Handling', kind: 'Custompedia', blurb: 'Perencanaan, produksi, publikasi, sampai membalas komentar. Pengelolaan platform media sosial harian.', tags: ['Social Media', 'Content', 'Community'], accent: '#1f3340', href: 'https://discovery.custompedia.id/', image: '/images/services/custompedia-social-media.webp', alt: 'Contoh social media handling Bank Jateng' },
    { group: 'Custompedia', title: 'Digital Advertising', kind: 'Custompedia', blurb: 'Iklan berbayar yang diikat ke satu target bisnis, lengkap dengan audit belanja iklan yang sudah berjalan.', tags: ['Ads', 'Audit', 'Performance'], accent: '#101014', href: 'https://discovery.custompedia.id/', image: '/images/services/custompedia-digital-advertising.webp', alt: 'Visual analitik untuk layanan digital advertising' },
    { group: 'Custompedia', title: 'KOL Management', kind: 'Voca', blurb: 'Pemilihan, negosiasi, dan pengukuran kreator influencer maupun affiliate. Hasilnya dinilai dari penjualan, bukan jumlah tayangan.', tags: ['KOL', 'Campaign', 'Report'], accent: '#4a2438', href: 'https://discovery.custompedia.id/', image: '/images/services/custompedia-kol-management.webp', alt: 'Kreator membuat konten menggunakan ring light' },
    { group: 'Custompedia', title: 'Brand Activation', kind: 'But Gawe', blurb: 'Peluncuran, papan luar ruang, dan event yang tersambung kembali ke kanal digital.', tags: ['Activation', 'OOH', 'Event'], accent: '#3d2c56', href: 'https://discovery.custompedia.id/', image: '/images/services/custompedia-brand-activation.webp', alt: 'Event management GoFood untuk layanan brand activation' },
    { group: 'Parcelin', title: 'Custom Packaging', kind: 'Parcelinpack, Parcelinbag', blurb: 'Kemasan yang dirancang dari ukuran barangnya, bukan dari cetakan yang kebetulan tersedia.', tags: ['Packaging', 'Custom', 'Cetak'], accent: '#14392c', href: 'https://parcelincompany.carrd.co', image: '/images/services/parcelin-custom-packaging.webp', alt: 'Tiga kemasan produk custom buatan Parcelin' },
    { group: 'Parcelin', title: 'Hampers & PR Package', kind: 'Parcelinpack', blurb: 'Paket kiriman untuk media dan mitra, dibuat agar layak difoto dan dinikmati begitu kotaknya dibuka.', tags: ['Hampers', 'PR Kit', 'Seasonal'], accent: '#2a2118', href: 'https://parcelincompany.carrd.co', image: '/images/services/parcelin-pr-package.webp', alt: 'Hampers terbuka dengan motif bunga buatan Parcelin' },
    { group: 'Parcelin', title: 'UMKM Packaging', kind: 'Parcelinpack', blurb: 'Pesanan kecil dengan mutu cetak yang sama, agar usaha rumahan bisa masuk rak yang sama.', tags: ['UMKM', 'MOQ Rendah', 'Konsultasi Gratis'], accent: '#241a2e', href: 'https://parcelincompany.carrd.co', image: '/images/services/parcelin-umkm-packaging.webp', alt: 'Kemasan merah untuk produk UMKM buatan Parcelin' },
    { group: 'Parcelin', title: 'Custom Merchandise & Apparel', kind: 'Parcelinmerch, Parcelinapparel', blurb: 'Kaos, apron, jersey, seragam, sampai merchandise promosi, satu standar produksi buat semuanya, kualitas yang tidak akan berubah apapun jenis dan berapapun pesanannya.', tags: ['Merchandise', 'Konveksi', 'Sablon'], accent: '#1b2a4a', href: 'https://parcelincompany.carrd.co', image: '/images/services/parcelin-custom-merchandise.webp', alt: 'Merchandise gantungan kunci karakter burung hantu' },
    { group: 'Creasa', title: 'Online Print & DTF', kind: 'Creasa Print', blurb: 'Layanan cetak ritel online untuk kebutuhan cepat dan bervolume, baik untuk poster, stiker, cetak dan sablon pakaian, serta gantungan kunci.', tags: ['Percetakan', 'Stiker', 'Konveksi'], accent: '#6b1746', href: 'https://linktr.ee/creasa_print', image: '/images/services/creasa-online-print.webp', alt: 'Label toples custom hasil layanan Creasa Print' },
  ] satisfies WorkItem[],
};

export const ventures = [
  { label: 'Custompedia', href: 'https://www.instagram.com/custompedia/' },
  { label: 'Parcelin', href: 'https://www.instagram.com/parcelincompany/' },
  { label: 'Creasa', href: 'https://www.instagram.com/creasaprint/' },
  { label: 'Voca', href: 'https://www.instagram.com/vocacreators/' },
  { label: 'But Gawe', href: 'https://www.instagram.com/butgawe/' },
];

export const contact = {
  headline: 'Let’s Talk!', body: 'Tertarik untuk berdiskusi lebih lanjut atau membangun koneksi? Hubungi saya.',
  button: { label: 'Let’s Talk!', href: brand.whatsappUrl },
  location: { label: 'Semarang, Indonesia', href: 'https://share.google/eazvnwhFNcn32dNHd' },
};
