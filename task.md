# Checklist Implementasi Revisi Website Radhyta

Dokumen ini adalah sumber kerja implementasi revisi website Radhyta. Setiap item hanya boleh diubah dari `[ ]` menjadi `[x]` setelah implementasi dan verifikasi terkait benar-benar selesai. Item induk hanya boleh `[x]` ketika seluruh item anaknya sudah `[x]`.

## Status Implementasi

- [x] Materi 23 halaman PDF, 23 PNG referensi, dan 4 gambar `revisi2*` sudah diaudit dan dipetakan.
- [x] Lima folder Google Drive sudah diunduh, dipetakan, diberi nama deskriptif, dan aset terpakai sudah dioptimalkan ke repo.
- [x] Global, Homepage, About, Journey, Three Companies, Relationships, Southeast Asia, Work, Built to Grow, dan Contact sudah diimplementasikan.
- [x] Seluruh URL internal pada preview merespons `200`; seluruh URL eksternal merespons `200` kecuali LinkedIn yang mengembalikan proteksi bot `999`.
- [x] `npm run check`, `npm run build`, preview lokal, audit ID/link/alt, dan `git diff --check` sudah lulus.
- [x] QA visual dan screenshot pembanding sudah selesai pada desktop lebar, laptop, tablet portrait/landscape, mobile, dan mobile sempit.

## Keputusan Gate yang Diterapkan

- [x] Catatan `1 Page jadi full English` diterapkan pada Homepage/Hero; section lain mengikuti copy Indonesia/Inggris dari revisi.
- [x] `Gojek` dipertahankan sebagai identitas final; logo/copy GoTo dihapus dari Hero, About, sidebar, dan Trusted By, sedangkan penyebutan historis Gojek/GoFood di Journey tetap ada.
- [x] Nama unit final adalah `Voca`, konsisten dengan tujuan akun `@vocacreators`.
- [x] Fragmen tidak selesai `Tim Custompedia` tidak diterbitkan; copy 2026 berhenti pada kalimat lengkap tentang But Gawe dan Voca.
- [x] Judul memakai teks sumber `Three Specialization, One Standard` tanpa koreksi grammar yang tidak diminta.
- [x] Label unit Digital Advertising ditetapkan `Custompedia`.
- [x] Scroll naratif penuh dipertahankan pada Journey; About dan Work memakai motion berbabak yang ringkas tanpa blank hold atau lock awal.

## 0. Aturan Pengerjaan

- [x] Kerjakan revisi hanya berdasarkan sumber yang dicatat dalam dokumen ini.
- [x] Gunakan urutan prioritas sumber berikut ketika ditemukan perbedaan:
  1. Empat gambar `revisi2*` sebagai penyesuaian terbaru.
  2. `revisi/Draft Website Mas Radhyt.pdf` sebagai spesifikasi utama.
  3. Dua puluh tiga PNG `image*.png` sebagai referensi visual yang berasal dari PDF.
  4. Google Drive sebagai sumber file foto dan logo.
- [x] Jika isi PNG biasa sama dengan PDF, jangan membuat revisi ganda.
- [x] Jika isi `revisi2*` berbeda dengan PDF atau PNG biasa, gunakan isi `revisi2*`.
- [x] Jangan menulis ulang copy dengan gaya baru tanpa persetujuan; pertahankan makna, nama, angka, kapitalisasi, dan tanda baca yang sudah disetujui.
- [x] Jangan menebak bagian yang tercatat di bagian `Gate Mismatch`; selesaikan gate tersebut sebelum bagian terkait dinyatakan selesai.
- [x] Jangan mengubah section di luar lingkup revisi.
- [x] Pertahankan identitas visual website yang sudah ada, termasuk warna biru brand dan pola interaksi yang tidak diminta untuk dihapus.
- [x] Pastikan semua revisi bekerja pada desktop dan mobile.
- [x] Pastikan mode reduced motion tetap menampilkan seluruh informasi tanpa bergantung pada animasi.
- [x] Jangan menandai item visual selesai hanya berdasarkan build; lakukan pemeriksaan browser dan screenshot.

## 1. Inventaris dan Pemetaan Sumber

### 1.1 Sumber lokal

- [x] Verifikasi PDF utama memiliki 23 halaman: `revisi/Draft Website Mas Radhyt.pdf`.
- [x] Verifikasi 23 PNG biasa merupakan sumber/potongan visual PDF dan tidak mengandung instruksi tambahan yang terlewat.
- [x] Verifikasi empat file penyesuaian terbaru tersedia:
  - [x] `revisi/revisi2.png` - koreksi pencapaian tahun 2020 menjadi ribuan hampers.
  - [x] `revisi/revisi2.1.png` - koreksi pencapaian tahun 2016 menjadi ratusan brand.
  - [x] `revisi/revisi2.3.png` - penyesuaian Homepage, istilah Serial Entrepreneur, dan duplikasi Gojek/GoTo.
  - [x] `revisi/revisi2.4.png` - melengkapi asal pertumbuhan Creasa.
- [x] Buat pemetaan internal antara setiap halaman PDF, PNG biasa, dan section website sebelum mulai mengubah kode.
- [x] Pastikan tidak ada foto dalam `revisi2*` yang dipindahkan ke tahun atau section yang berbeda.

### 1.2 Sumber Google Drive

- [x] Pastikan folder About dapat diakses: `https://drive.google.com/drive/folders/1KiEsnDPqUa_xDuaUPI3aypJK5kx9CYp0?usp=drive_link`.
- [x] Pastikan folder Journey dapat diakses: `https://drive.google.com/drive/folders/1o5oU10znnzNdhEcs5s9w3JOJOyyf-ePI?usp=drive_link`.
- [x] Pastikan folder logo Business Relationships dapat diakses: `https://drive.google.com/drive/folders/1qc6AaVsvmHP0m42acLsIwpJvCu7e251W?usp=drive_link`.
- [x] Pastikan folder foto service Custompedia dapat diakses: `https://drive.google.com/drive/folders/1iEel2VapF4XTHNb5Jvh3mYqHCxNz3J0G?usp=drive_link`.
- [x] Pastikan folder foto service Parcelin dapat diakses: `https://drive.google.com/drive/folders/1Ts65f3Jj9EYYNRp8S6mq5Ziv0_qdkEhj?usp=drive_link`.
- [x] Catat seluruh nama file, dimensi, format, dan section tujuan sebelum file disalin ke proyek.
- [x] Gunakan nama file yang deskriptif dan konsisten; jangan mempertahankan nama generik seperti `image copy`.
- [x] Pastikan tidak ada foto atau logo duplikat dengan nama berbeda.
- [x] Optimalkan gambar ke format dan ukuran yang sesuai tanpa menurunkan ketajaman visual secara nyata.
- [x] Pertahankan rasio foto; jangan meregangkan, memipihkan, atau memotong subjek utama.
- [x] Tambahkan `alt` yang menjelaskan konteks foto atau nama logo.
- [x] Verifikasi setiap file aset berhasil dimuat dari build final tanpa respons 404.

## 2. Revisi Global dan Scroll Experience

- [x] Selesaikan gate batas scroll experience sebelum mengubah perilaku global.
- [x] Kurangi kondisi yang membuat pengguna harus menunggu terlalu lama sebelum konten utama terlihat.
- [x] Pastikan poin pertama pada setiap section non-Journey dapat terlihat tanpa rangkaian scroll kosong yang panjang.
- [x] Pertahankan experience naratif/kartu khusus hanya pada section yang sudah disetujui.
- [x] Pastikan pengguna tetap dapat melakukan scroll vertikal secara normal saat berinteraksi dengan komponen horizontal.
- [x] Pastikan scroll tidak terkunci setelah animasi selesai, dibatalkan, atau viewport berubah.
- [x] Pastikan semua konten tetap tersedia ketika JavaScript lambat atau reduced motion aktif.
- [x] Periksa tidak ada heading, body copy, angka, tombol, atau kartu yang terpotong selama animasi.
- [x] Pastikan kapitalisasi judul konsisten pada seluruh section.
- [x] Selesaikan gate bahasa sebelum memastikan halaman yang diminta sudah full English.

## 3. Homepage / Hero

### 3.1 Navigasi

- [x] Jadikan `Home` dapat diklik dan mengarah ke section Home.
- [x] Jadikan `Journey` dapat diklik dan mengarah ke section Journey.
- [x] Jadikan `Work` dapat diklik dan mengarah ke section Work.
- [x] Jadikan `Contact` dapat diklik dan mengarah ke section Contact.
- [x] Pastikan anchor menuju posisi section yang tepat dan tidak tertutup elemen fixed/sticky.
- [x] Pastikan navigasi dapat digunakan dengan mouse, keyboard, dan sentuhan.
- [x] Pastikan status aktif navigasi berubah sesuai section yang sedang terlihat.
- [x] Perlambat perpindahan anchor Home, Journey, Work, dan Contact agar transisi jauh tetap halus dan tidak terlihat patah-patah.
- [x] Kurangi radius hover navigasi Hero dari bentuk kapsul menjadi sudut sekitar `6px`.
- [x] Pertahankan cursor native browser pada seluruh viewport dan perangkat.

### 3.2 Headline dan statistik

- [x] Pertahankan headline persis:
  - [x] `BUILDING COMPANIES.`
  - [x] `FROM THE GROUND UP.`
  - [x] `SINCE 2014.`
- [x] Tebalkan atau tingkatkan keterbacaan outline headline putih tanpa mengubah warna brand.
- [x] Verifikasi headline terbaca di atas foto pada desktop dan mobile.
- [x] Ganti semua label `3 Companies` yang relevan menjadi `3 Holding Companies`.
- [x] Jangan menggunakan usulan lama `Holding 3 Big Companies`.
- [x] Hapus card `3 Holding Companies` dari Hero sesuai arahan terbaru; labelnya hanya muncul setelah sidebar menjadi rail.
- [x] Besarkan tombol `Let's Talk` dan `See Work` sedikit secara bersamaan serta naikkan posisinya untuk mengisi ruang Hero yang kosong.
- [x] Pertahankan statistik pengalaman `12+ Years experience` kecuali ada revisi sumber yang lebih baru.
- [x] Tempatkan kartu `Custompedia / Parcelin / Creasa` di sisi kanan angka `2014`, tepat di siku kanan tulisan, tanpa menutupi headline atau kartu statistik.

### 3.3 Struktur bisnis pada Hero

- [x] Tampilkan tiga holding/perusahaan utama: Custompedia, Parcelin, dan Creasa.
- [x] Tampilkan Voca sebagai unit usaha di bawah Custompedia, bukan holding keempat.
- [x] Tampilkan But Gawe sebagai unit usaha di bawah Custompedia, bukan holding kelima.
- [x] Pastikan tampilan lima nama bisnis tidak bertentangan dengan label `3 Holding Companies`.
- [x] Hapus teks `Serial Entrepreneur, Semarang` dari kiri bawah Hero sesuai arahan terbaru.
- [x] Jangan menggantinya dengan usulan lama `Entrepreneur Series, Semarang`.
- [x] Selesaikan keputusan final Gojek/GoTo lalu hilangkan penyebutan atau logo yang berulang di Hero/sidebar.

### 3.4 Acceptance criteria Homepage

- [x] Seluruh empat navigasi benar-benar berpindah ke section tujuan.
- [x] Outline headline terbaca pada seluruh frame animasi.
- [x] Hanya label final `3 Holding Companies` yang terlihat.
- [x] `Serial Entrepreneur, Semarang` tidak lagi tampil di kiri bawah Hero.
- [x] Struktur tiga holding dan dua unit Custompedia dapat dipahami tanpa kontradiksi.
- [x] Tidak ada duplikasi Gojek dan GoTo setelah keputusan gate diterapkan.

## 4. About Radhyta

### 4.1 Intro About

- [x] Gunakan copy final persis:

  > Berawal dari satu meja di Semarang pada 2014, Radhyta membangun tiga bisnis yang kini jadi satu ekosistem kreatif: Custompedia, Parcelin, dan Creasa. Dipercaya BNI Lighthouse, Gojek, GoTo, hingga Pemerintah Provinsi Jawa Tengah untuk menyediakan semua kebutuhan kreatifnya - dari Semarang, untuk seluruh Indonesia.

- [x] Sesuaikan penyebutan Gojek/GoTo pada copy setelah gate duplikasi diputuskan.
- [x] Pertahankan penekanan pada `Semarang`, `2014`, `Custompedia`, `Parcelin`, dan `Creasa` jika desain memakai emphasis.
- [x] Ambil foto About dari folder Drive About, bukan dari folder Journey atau service.
- [x] Tambahkan beberapa foto blur di belakang copy agar area tidak kosong.
- [x] Gunakan komposisi foto organik seperti contoh lingkaran pada PDF.
- [x] Buat batas foto dengan background lebih menyatu; hindari tepi tajam yang terlihat seperti potongan tempelan.
- [x] Pastikan blur tidak membuat halaman berat atau menurunkan keterbacaan copy.
- [x] Pastikan foto tidak menutupi navigasi, headline, copy, atau kontrol slide.

### 4.2 Slide 01 - Built from zero

- [x] Gunakan judul `Built from zero` dengan kapitalisasi yang konsisten.
- [x] Gunakan copy final persis:

  > Semuanya dimulai dari nol pada 2014. Dimulai dari berjualan baju online, merchandise custom, hingga berkembang menjadi Custompedia. Tidak ada yang diwarisi. Semuanya dirintis dari awal.

- [x] Pastikan angka penanda `01` tetap menjadi elemen latar dan tidak mengganggu copy.
- [x] Pastikan penanda `01` aktif dan terlihat bersama konten pertama saat bab terkait masuk viewport.

### 4.3 Slide 02 - The turning point

- [x] Gunakan judul `The turning point` dengan kapitalisasi yang konsisten.
- [x] Gunakan copy final yang sudah dilengkapi `revisi2.4.png`:

  > Titik terberat datang pada 2020. Pandemi menghentikan lini Merchandise yang selama ini menopang bisnis. Dari situ, Custompedia pivot jadi Creative Agency, Parcelin lahir dari penjualan hampers, dan Creasa tumbuh dari permintaan kebutuhan online retail.

- [x] Jangan menyisakan placeholder `[...]`.
- [x] Pastikan angka penanda `02` tidak memotong atau menutupi copy.
- [x] Pastikan penanda `02` aktif dan terlihat bersama konten kedua saat bab terkait masuk viewport.

### 4.4 Slide 03 - Beyond the work

- [x] Gunakan judul `Beyond the work` dengan kapitalisasi yang konsisten.
- [x] Gunakan copy final persis:

  > Di luar pekerjaan, Radhyta adalah seorang Suami dan Ayah. Selalu ada waktu untuk dihabiskan dengan anak dan istri, menekuni hobi, dan menjelajah ke tempat-tempat baru. Semarang, tetap menjadi tempat semuanya dimulai dan dijalankan.

- [x] Pastikan angka penanda `03` tidak memotong atau menutupi copy.
- [x] Pastikan penanda `03` aktif dan terlihat bersama konten ketiga saat bab terkait masuk viewport.

### 4.5 Acceptance criteria About

- [x] Intro dan tiga slide tampil lengkap tanpa copy lama atau placeholder.
- [x] Semua foto berasal dari folder About dan cocok dengan konteks personal/bisnis.
- [x] Tepi foto menyatu dengan background sesuai referensi.
- [x] Ketiga bab About berganti berurutan saat scroll desktop dan memakai reveal berurutan pada mobile tanpa frame kosong.
- [x] Reduced motion tetap menampilkan ketiga isi tanpa kehilangan informasi.

## 5. Journey

### 5.1 Struktur dan experience Journey

- [x] Redesain seluruh kartu Journey sebagai split card editorial biru–ivory yang bersih tanpa pill, frame bertumpuk, atau ornamen berlebihan.
- [x] Gunakan bingkai foto portrait `3:4` pada mobile dan frame tinggi adaptif pada desktop.
- [x] Tampilkan setiap foto secara utuh dengan `object-fit: contain`; foto tidak boleh terpotong saat diam, hover, atau animasi masuk.
- [x] Gunakan susunan vertikal ber-rel pada tablet agar card besar tidak saling bertumpuk; jalur serpentine hanya dipakai di atas `1100px`.
- [x] Gunakan foto dari folder Drive Journey.
- [x] Pastikan urutan chapter: 2014, 2016, 2018, 2020, 2021, 2023, 2024, 2025, 2026.
- [x] Perbaiki kapitalisasi seluruh judul chapter sesuai daftar final.
- [x] Pastikan deskripsi setiap tahun tampil pada desktop dan mobile.
- [x] Pastikan seluruh angka empat digit terlihat utuh pada keadaan awal, saat animasi, dan setelah animasi.
- [x] Periksa khusus bagian bawah glyph angka agar tidak terpotong oleh mask/overflow.
- [x] Pastikan jalur timeline, titik, kartu, dan foto tetap sinkron dengan tahun.
- [x] Pastikan satu foto tidak digunakan untuk tahun yang salah.
- [x] Pastikan pengalaman Journey tidak menyebabkan section lain menunggu terlalu lama.

### 5.2 Journey 2014

- [x] Gunakan judul `2014 - The First Online Shop`.
- [x] Gunakan copy final persis:

  > Radhyta dan istri memulai perjalanannya dengan bisnis online, yaitu konveksi dan dropship. Semuanya dijalankan sepenuhnya secara digital yang membangun pondasi hingga saat ini.

- [x] Gunakan foto Radhyta dan istri/foto awal perjalanan bisnis yang ditunjukkan untuk 2014.
- [x] Jangan memakai foto 2014 untuk tahun lain.
- [x] Verifikasi angka `2014` tidak terpotong.

### 5.3 Journey 2016

- [x] Gunakan judul `2016 - Custompedia Begins`.
- [x] Terapkan override `revisi2.1.png`: gunakan `ratusan brand`, bukan `belasan hingga puluhan brand`.
- [x] Gunakan copy final:

  > Awalnya, Custompedia dimulai dengan penjualan merchandise custom secara digital. Kala itu, Custompedia dikenal sebagai Brand Custom Gift dan dipercaya sebagai vendor custom gift untuk ratusan brand, korporat, maupun pemerintah.

- [x] Gunakan foto merchandise/custom gift yang ditunjukkan untuk 2016.
- [x] Jangan memakai foto 2016 untuk tahun lain.
- [x] Verifikasi angka `2016` tidak terpotong.

### 5.4 Journey 2018

- [x] Gunakan judul `2018 - Our First Agency Client: Gojek Indonesia`.
- [x] Gunakan copy final persis:

  > Untuk pertama kalinya, Custompedia diminta Gojek Indonesia untuk menangani keperluan Branding dan Media Sosial. Permintaan ini lahir dari pandangan mereka terhadap Custompedia yang membangun digital presence produknya sendiri.

- [x] Gunakan foto tim/aktivitas di kantor Gojek yang ditunjukkan untuk 2018.
- [x] Jangan memakai foto 2018 untuk tahun lain.
- [x] Verifikasi angka `2018` tidak terpotong.

### 5.5 Journey 2020

- [x] Gunakan judul `2020 - Pivot to A Creative Agency` sesuai teks sumber.
- [x] Terapkan override `revisi2.png`: gunakan `ribuan hampers`, bukan `puluhan Hampers`.
- [x] Gunakan copy final:

  > Pandemi menghentikan lini merchandise yang menjadi tulang punggung Custompedia. Kami beralih penuh menjadi sebuah Creative Agency, khususnya untuk akun Gojek di setiap kotanya. Di masa ini, Parcelin lahir dari penjualan ribuan hampers.

- [x] Gunakan foto aktivitas kerja/Gojek yang ditunjukkan untuk 2020.
- [x] Jangan memakai foto 2020 untuk tahun lain.
- [x] Verifikasi angka `2020` tidak terpotong.

### 5.6 Journey 2021

- [x] Gunakan judul `2021 - Parcelin Expands`.
- [x] Gunakan copy final persis:

  > Parcelin tumbuh dan berkembang dari penjualan hampers ke kemasan dan percetakan.

- [x] Gunakan foto pengiriman/produk Parcelin yang ditunjukkan untuk 2021.
- [x] Jangan memakai foto 2021 untuk tahun lain.
- [x] Verifikasi angka `2021` tidak terpotong.

### 5.7 Journey 2023

- [x] Gunakan judul `2023 - National GoFood Vendor`.
- [x] Gunakan copy final persis:

  > Custompedia menjadi vendor branding GoFood untuk seluruh Indonesia, sekaligus menangani brand activation Gojek di berbagai kota. Bergerak dari agensi sosial media, Custompedia pun masuk ke ranah aktivasi di lapangan.

- [x] Gunakan foto branding/aktivasi GoFood yang ditunjukkan untuk 2023.
- [x] Jangan memakai foto 2023 untuk tahun lain.
- [x] Verifikasi angka `2023` tidak terpotong.

### 5.8 Journey 2024

- [x] Gunakan judul `2024 - Nine Cities, Big Challenge, One Team`.
- [x] Gunakan copy final persis:

  > Setelah 6 tahun, seluruh akun media sosial Gojek Regional - Semarang, Solo, Bandung, Yogyakarta, Makassar, Palembang, Batam, Padang, dan Kalimantan - dikelola oleh Custompedia. Tidak hanya itu, satu tantangan besar kami terima di tahun ini, dan kami berhasil.

- [x] Gunakan foto pengelolaan akun regional dan foto tantangan/event yang ditunjukkan untuk 2024.
- [x] Pastikan kesembilan wilayah tertulis lengkap dan tidak ada yang hilang.
- [x] Jangan memakai foto 2024 untuk tahun lain.
- [x] Verifikasi angka `2024` tidak terpotong.

### 5.9 Journey 2025

- [x] Gunakan judul `2025 - New Company + One Group`.
- [x] Gunakan copy final persis:

  > Parcelin berkembang menjadi enam unit bisnis, dan Creasa lahir sebagai perusahaan percetakan online. Berkembangnya Parcelin mengundang kami untuk ikut ke dalam expo di Marina Bay Singapore.

- [x] Gunakan foto expo Marina Bay Singapore yang ditunjukkan untuk 2025.
- [x] Jangan memakai foto 2025 untuk tahun lain.
- [x] Verifikasi angka `2025` tidak terpotong.

### 5.10 Journey 2026

- [x] Gunakan judul `2026 - Two New Ventures`.
- [x] Pertahankan bagian copy yang sudah lengkap:

  > Custompedia semakin berkembang, dan melahirkan dua unit usaha baru, yaitu But Gawe untuk brand activation dan Voca untuk KOL Management.

- [x] Selesaikan gate `Voca` versus `Vocal` sebelum copy diterapkan.
- [x] Selesaikan gate lanjutan kalimat setelah fragmen mentah `Tim Custompedia`.
- [x] Jangan menampilkan fragmen `Tim Custompedia` sebagai kalimat terputus di website.
- [x] Gunakan foto tim Custompedia/dua venture baru yang ditunjukkan untuk 2026.
- [x] Jangan memakai foto 2026 untuk tahun lain.
- [x] Verifikasi angka `2026` tidak terpotong.

### 5.11 Acceptance criteria Journey

- [x] Kesembilan chapter tampil dalam urutan yang benar.
- [x] Semua judul, copy, angka, dan foto cocok dengan tahunnya.
- [x] Override `ratusan brand` dan `ribuan hampers` terlihat pada website final.
- [x] Tidak ada angka tahun terpotong pada desktop, tablet, mobile, atau selama animasi.
- [x] Tidak ada copy Journey yang disembunyikan pada mobile.
- [x] Tidak ada fragmen copy 2026 yang belum selesai.

## 6. Three Companies / Three Specializations

- [x] Selesaikan gate judul sebelum mengganti heading.
- [x] Hapus judul lama `Three Companies, One Shared Standard.` setelah judul final disetujui.
- [x] Kandidat mentah dari PDF: `Three Specialization, One Standard`.
- [x] Kandidat grammar Inggris: `Three Specializations, One Standard`.
- [x] Gunakan intro persis:

  > Tiga spesialisasi utama yang bergerak bersamaan dan lahir dari satu cara berpikir: Relevan dan Tuntas.

### 6.1 Custompedia

- [x] Gunakan logo Custompedia yang benar.
- [x] Gunakan nama badan usaha `PT Custompedia Creative Group`.
- [x] Gunakan copy final persis:

  > Rumah kreatif untuk membangun brand dari strategi sampai eksekusi. Tiga unit usaha jalan beriringan: Custompedia (Media Sosial & Branding), Voca (KOL Management), dan But Gawe (Brand Activation).

- [x] Pastikan Custompedia, Voca, dan But Gawe diposisikan sebagai tiga unit usaha dalam grup ini.

### 6.2 Parcelin

- [x] Gunakan logo Parcelin yang benar.
- [x] Gunakan nama badan usaha `PT Parcelin Creative Indonesia`.
- [x] Gunakan copy final persis:

  > Creative production house yang mengubah ide jadi produk nyata - packaging, printing, merchandise, sampai promosi brand, semua end-to-end dalam satu atap. Enam unit usaha, satu standar kerja. #BikinDiParcelin

- [x] Pastikan hashtag `#BikinDiParcelin` ditulis persis.

### 6.3 Creasa

- [x] Ganti logo lama `Creasa Creative Supply Asia` dengan logo `Creasa Print` yang diberikan.
- [x] Gunakan nama `Creasa Print`.
- [x] Gunakan copy final persis:

  > Partner printing untuk semua kebutuhan cetak: poster, sticker, DTF, kaos, hingga gantungan kunci. Cepat pengerjaannya, rapi hasilnya. #CetakApaAjaDiCreasa

- [x] Pastikan hashtag `#CetakApaAjaDiCreasa` ditulis persis.

### 6.4 Acceptance criteria Three Companies

- [x] Hanya judul final yang terlihat.
- [x] Ketiga perusahaan memiliki logo, nama, dan copy yang sesuai.
- [x] Voca dan But Gawe tidak tampil sebagai perusahaan induk terpisah.
- [x] Logo Creasa lama tidak tersisa di source maupun hasil build.

## 7. Business Runs On Relationships

### 7.1 Intro dan Active In

- [x] Gunakan heading `Business Runs On Relationships` dengan kapitalisasi yang konsisten.
- [x] Gunakan copy final persis:

  > Radhyta percaya bisnis yang besar lahir dari relasi yang kuat. Oleh karena itu, ia tetap aktif di berbagai komunitas bisnis untuk merawat dan memperluas jaringannya.

- [x] Ambil logo komunitas dari folder Drive Business Relationships.
- [x] Perbaiki logo BNI Lighthouse.
- [x] Perbaiki logo HIPMI Jateng.
- [x] Perbaiki logo Muslim Entrepreneur Semarang (MESEM).
- [x] Perbaiki logo Karang Taruna Jawa Tengah.
- [x] Pertahankan Yuk Bisnis jika aset dan penulisannya sudah benar.
- [x] Pastikan nama di bawah setiap logo sesuai organisasi dan tidak menggunakan singkatan yang salah.

### 7.2 Trusted By

- [x] Buat logo Trusted By bergerak otomatis agar lebih banyak logo dapat ditampilkan.
- [x] Pastikan pergerakan halus, berulang tanpa lompatan, dan dapat berhenti/diakses pada reduced motion.
- [x] Pertahankan urutan sumber sebelum keputusan duplikasi Gojek/GoTo diterapkan.
- [x] Baris pertama:
  - [x] 1. Pemerintah Provinsi Jawa Tengah
  - [x] 2. Pemerintah Kota Semarang
  - [x] 3. Bank Jateng
  - [x] 4. Kata Media Jateng
  - [x] 5. Gojek
  - [x] 6. PT GoTo Gojek Tokopedia Tbk
  - [x] 7. Tokopedia
  - [x] 8. Erha
  - [x] 9. Kyra Co-Living
  - [x] 10. Doyle
  - [x] 11. Unika Soegijapranata
  - [x] 12. PT HM Sampoerna Tbk
- [x] Baris kedua:
  - [x] 13. Ken Ken Indonesia
  - [x] 14. SEGEL
  - [x] 15. Cassanatama Naturindo
  - [x] 16. Kun Kun Visual
  - [x] 17. Mistar Comm
  - [x] 18. Shatara Indah Kreasi
  - [x] 19. Ecolux
  - [x] 20. Gulabed
  - [x] 21. Handayani
- [x] Setelah gate Gojek/GoTo diputuskan, hapus satu entri yang dianggap duplikat dan rapikan urutan final.
- [x] Hapus logo screenshot lama yang tidak masuk daftar final, termasuk Roda Roda, Iris, dan Airbnb, kecuali kemudian disetujui secara eksplisit.
- [x] Gunakan logo resmi yang sesuai untuk setiap nama.
- [x] Pastikan tidak ada logo buram, gepeng, terpotong, atau memiliki padding yang sangat berbeda.
- [x] Pastikan marquee logo bekerja pada desktop dan mobile.

### 7.3 Acceptance criteria Relationships

- [x] Copy intro tampil lengkap.
- [x] Empat logo komunitas yang dinyatakan salah sudah diganti.
- [x] Daftar Trusted By mengikuti urutan final.
- [x] Tidak ada penyebutan Gojek/GoTo ganda setelah gate diselesaikan.
- [x] Semua logo dapat dikenali dan memiliki label yang tepat.

## 8. Setting Sights on Southeast Asia

- [x] Buat section/page baru `Setting Sights on Southeast Asia` sesuai alur halaman.
- [x] Gunakan copy final persis:

  > Berbasis di Semarang, melayani klien di seluruh Indonesia. Menyiapkan langkah berikutnya ke ranah Asia Tenggara.

- [x] Buat visual utama berupa peta yang menunjukkan posisi Semarang dan kawasan Asia Tenggara.
- [x] Animasi zoom peta tidak digunakan; visual statis dipilih agar ringan dan copy selalu terlihat.
- [x] Jika animasi tidak layak secara performa, gunakan alternatif peta Asia Tenggara statis dengan Semarang ditandai.
- [x] Pastikan peta tidak memberikan kesan bahwa Semarang berada di luar lokasi geografis yang benar.
- [x] Pastikan visual tetap jelas pada mobile dan reduced motion.

## 9. Work

### 9.1 Perilaku awal

- [x] Saat pengguna masuk ke Work, poin `01` langsung terlihat.
- [x] Hilangkan jeda scroll kosong sebelum poin pertama tanpa merusak animasi section.
- [x] Pastikan konten utama Work dapat dibaca sebelum pengguna melakukan scroll panjang.

### 9.2 Headline dan intro

- [x] Gunakan headline `Custompedia Makes Brand Feel Alive`.
- [x] Gunakan copy final persis:

  > Custompedia adalah creative marketing agency yang berfokus pada media sosial dan branding. Kami memadukan insight strategis, ide inovatif, dan teknologi terkini untuk membantu brand menemukan bentuk, suara, dan momentum yang tepat, mulai dari ide hingga eksekusi, agar audiens tak sekadar melihat, tapi ikut merasakan dan terhubung dengan brand.

### 9.3 Create, Convert, Connect

- [x] Gunakan label `01 Create`.
- [x] Gunakan copy Create persis:

  > Mengubah ide menjadi visual yang segar, relevan, dan tepat sasaran, dari konsep hingga eksekusi, dirancang agar brand tak sekadar dilihat, tapi diingat.

- [x] Gunakan label `02 Convert`.
- [x] Gunakan copy Convert persis:

  > Kami tidak hanya membuat sesuatu terlihat menarik, tapi memastikannya benar-benar bekerja. Setiap langkah kreatif dirancang untuk mendorong dampak, pertumbuhan, dan hasil nyata.

- [x] Gunakan label `03 Connect`.
- [x] Gunakan copy Connect persis:

  > Membangun koneksi yang bermakna dan penuh tujuan, mengubah ide menjadi sesuatu yang berarti dan siap memberi dampak.

### 9.4 Acceptance criteria Work

- [x] Poin 01 langsung terlihat ketika section Work aktif.
- [x] Headline dan seluruh copy tampil lengkap.
- [x] Urutan 01 Create, 02 Convert, dan 03 Connect benar.
- [x] Tidak ada descender huruf atau baris heading yang terpotong oleh reveal mask.

## 10. Built to Grow

### 10.1 Struktur umum

- [x] Gunakan heading `Built to Grow` dengan `to` huruf kecil.
- [x] Jangan memakai kapitalisasi lama `Built To Grow`.
- [x] Buat tab/menu `CUSTOMPEDIA` yang dapat diklik.
- [x] Buat tab/menu `PARCELIN` yang dapat diklik.
- [x] Buat tab/menu `CREASA` yang dapat diklik.
- [x] Pisahkan daftar kartu service untuk masing-masing perusahaan.
- [x] Pastikan tab aktif terlihat jelas tanpa membuat warna baru di luar sistem brand.
- [x] Pastikan kartu dapat digeser horizontal menggunakan mouse, trackpad, keyboard, dan sentuhan.
- [x] Pastikan pengguna tetap dapat melanjutkan scroll vertikal tanpa harus mengembalikan posisi kartu secara manual.
- [x] Pastikan fokus keyboard tidak terperangkap di carousel.
- [x] Pastikan setiap kartu memiliki foto, nomor, keyword, label unit usaha, judul, deskripsi, dan link.
- [x] Pastikan seluruh kartu memiliki tinggi dan keterbacaan yang konsisten.

### 10.2 Custompedia

- [x] Gunakan tujuan utama `https://discovery.custompedia.id/`.
- [x] Ambil seluruh foto Custompedia dari folder Drive service Custompedia.
- [x] Pastikan setiap kartu Custompedia menampilkan label unit `Custompedia`, `Voca`, atau `But Gawe`.

#### Branding & Identity

- [x] Gunakan judul `Branding & Identity`.
- [x] Gunakan keyword `Branding`, `Design`, `Guideline`.
- [x] Gunakan label unit `Custompedia`.
- [x] Gunakan deskripsi persis:

  > Positioning, identitas visual, dan panduan merek yang bisa dipakai tim internal brand secara mandiri.

- [x] Gunakan foto laptop/pekerjaan branding yang ditunjukkan untuk service ini.
- [x] Arahkan kartu ke tujuan Custompedia.

#### Social Media Handling

- [x] Gunakan judul `Social Media Handling`.
- [x] Gunakan keyword `Social Media`, `Content`, `Community`.
- [x] Gunakan label unit `Custompedia`.
- [x] Gunakan deskripsi persis:

  > Perencanaan, produksi, publikasi, sampai membalas komentar. Pengelolaan platform media sosial harian.

- [x] Gunakan foto/contoh Social Media Handling Bank Jateng yang ditunjukkan.
- [x] Arahkan kartu ke tujuan Custompedia.

#### Digital Advertising

- [x] Gunakan judul `Digital Advertising`.
- [x] Gunakan keyword `Ads`, `Audit`, `Performance`.
- [x] Selesaikan gate label unit Digital Advertising sebelum diterbitkan.
- [x] Gunakan deskripsi persis:

  > Iklan berbayar yang diikat ke satu target bisnis, lengkap dengan audit belanja iklan yang sudah berjalan.

- [x] Gunakan foto analitik/iklan digital yang ditunjukkan.
- [x] Arahkan kartu ke tujuan Custompedia.

#### KOL Management

- [x] Gunakan judul `KOL Management`.
- [x] Gunakan keyword `KOL`, `Campaign`, `Report`.
- [x] Gunakan label unit `Voca` setelah gate nama Voca/Vocal selesai.
- [x] Gunakan deskripsi persis:

  > Pemilihan, negosiasi, dan pengukuran kreator influencer maupun affiliate. Hasilnya dinilai dari penjualan, bukan jumlah tayangan.

- [x] Gunakan foto kreator dengan ring light yang ditunjukkan.
- [x] Arahkan kartu ke tujuan Custompedia.

#### Brand Activation

- [x] Gunakan judul `Brand Activation`.
- [x] Gunakan keyword `Activation`, `OOH`, `Event`.
- [x] Gunakan label unit `But Gawe`.
- [x] Gunakan deskripsi persis:

  > Peluncuran, papan luar ruang, dan event yang tersambung kembali ke kanal digital.

- [x] Gunakan visual Event Management/GoFood yang ditunjukkan.
- [x] Arahkan kartu ke tujuan Custompedia.

### 10.3 Parcelin

- [x] Gunakan tujuan utama `https://parcelincompany.carrd.co` berdasarkan link sumber `parcelincompany.carrd.co`.
- [x] Ambil seluruh foto Parcelin dari folder Drive service Parcelin.

#### Custom Packaging

- [x] Gunakan judul `Custom Packaging`.
- [x] Gunakan keyword `Packaging`, `Custom`, `Cetak`.
- [x] Gunakan label unit `Parcelinpack, Parcelinbag`.
- [x] Gunakan deskripsi persis:

  > Kemasan yang dirancang dari ukuran barangnya, bukan dari cetakan yang kebetulan tersedia.

- [x] Gunakan foto tiga kemasan/box produk yang ditunjukkan.
- [x] Arahkan kartu ke tujuan Parcelin.

#### Hampers & PR Package

- [x] Gunakan judul `Hampers & PR Package`.
- [x] Gunakan keyword `Hampers`, `PR Kit`, `Seasonal`.
- [x] Gunakan label unit `Parcelinpack`.
- [x] Gunakan deskripsi persis:

  > Paket kiriman untuk media dan mitra, dibuat agar layak difoto dan dinikmati begitu kotaknya dibuka.

- [x] Gunakan foto hampers terbuka bermotif bunga yang ditunjukkan.
- [x] Arahkan kartu ke tujuan Parcelin.

#### UMKM Packaging

- [x] Gunakan judul `UMKM Packaging`.
- [x] Gunakan keyword `UMKM`, `MOQ Rendah`, `Konsultasi Gratis`.
- [x] Gunakan label unit `Parcelinpack`.
- [x] Gunakan deskripsi persis:

  > Pesanan kecil dengan mutu cetak yang sama, agar usaha rumahan bisa masuk rak yang sama.

- [x] Gunakan foto kemasan merah yang ditunjukkan.
- [x] Arahkan kartu ke tujuan Parcelin.

#### Custom Merchandise & Apparel

- [x] Gunakan judul `Custom Merchandise & Apparel`.
- [x] Gunakan keyword `Merchandise`, `Konveksi`, `Sablon`.
- [x] Gunakan label unit `Parcelinmerch, Parcelinapparel`.
- [x] Gunakan deskripsi persis:

  > Kaos, apron, jersey, seragam, sampai merchandise promosi, satu standar produksi buat semuanya, kualitas yang tidak akan berubah apapun jenis dan berapapun pesanannya.

- [x] Gunakan foto merchandise gantungan kunci karakter burung hantu yang ditunjukkan.
- [x] Arahkan kartu ke tujuan Parcelin.

### 10.4 Creasa

- [x] Gunakan tujuan utama `https://linktr.ee/creasa_print` berdasarkan link sumber `linktr.ee/creasa_print`.
- [x] Gunakan satu kartu service `Online Print & DTF`.
- [x] Gunakan keyword `Percetakan`, `Stiker`, `Konveksi`.
- [x] Gunakan label unit `Creasa Print`.
- [x] Gunakan deskripsi persis:

  > Layanan cetak ritel online untuk kebutuhan cepat dan bervolume, baik untuk poster, stiker, cetak dan sablon pakaian, serta gantungan kunci.

- [x] Gunakan visual label toples yang ditunjukkan untuk service Creasa.
- [x] Arahkan kartu ke tujuan Creasa.

### 10.5 Acceptance criteria Built to Grow

- [x] Ketiga tab dapat dipilih dan hanya menampilkan kartu perusahaan terkait.
- [x] Custompedia memiliki lima kartu dengan foto dan label unit yang benar.
- [x] Parcelin memiliki empat kartu dengan foto dan label unit yang benar.
- [x] Creasa memiliki satu kartu dengan foto dan label unit yang benar.
- [x] Seluruh keyword, judul, deskripsi, dan link sesuai checklist.
- [x] Horizontal scroll bekerja tanpa merusak vertical scroll.
- [x] Seluruh kartu dapat diakses menggunakan keyboard.
- [x] Tidak ada kartu atau foto yang tertukar antarperusahaan.

## 11. Contact

### 11.1 Copy dan tata letak

- [x] Gunakan heading `Let’s Talk!`.
- [x] Gunakan deskripsi final persis:

  > Tertarik untuk berdiskusi lebih lanjut atau membangun koneksi? Hubungi saya.

- [x] Letakkan tombol WhatsApp di sisi kanan dan sejajar dengan heading/deskripsi.
- [x] Letakkan ikon media sosial di sebelah kanan tombol WhatsApp.
- [x] Pastikan susunan responsif tetap rapi pada mobile tanpa mengubah urutan informasi.
- [x] Gunakan ikon WhatsApp pada tombol.
- [x] Gunakan label tombol `[Logo WhatsApp] Let’s Talk!`.
- [x] Pastikan tombol membuka WhatsApp dengan benar.

### 11.2 Media sosial

- [x] Tampilkan Instagram.
- [x] Tampilkan TikTok.
- [x] Tampilkan LinkedIn.
- [x] Tambahkan Threads.
- [x] Arahkan Threads ke `https://www.threads.com/@radhytam`.
- [x] Perbarui semua ikon media sosial agar sesuai platform dan memiliki ukuran visual konsisten.
- [x] Tambahkan label aksesibel pada setiap ikon.

### 11.3 Ventures

- [x] Arahkan Custompedia ke `https://www.instagram.com/custompedia/`.
- [x] Arahkan Parcelin ke `https://www.instagram.com/parcelincompany/`.
- [x] Arahkan Creasa ke `https://www.instagram.com/creasaprint/`.
- [x] Arahkan Voca ke `https://www.instagram.com/vocacreators/` setelah gate nama selesai.
- [x] Arahkan But Gawe ke `https://www.instagram.com/butgawe/`.
- [x] Pastikan seluruh link eksternal aman dan dibuka sesuai pola website.

### 11.4 Email dan lokasi

- [x] Jadikan `radhytam@gmail.com` sebagai link email langsung `mailto:radhytam@gmail.com`.
- [x] Jadikan `Semarang, Indonesia` sebagai link alamat kantor.
- [x] Gunakan tujuan alamat `https://share.google/eazvnwhFNcn32dNHd`.
- [x] Pastikan link email dan lokasi dapat digunakan dengan keyboard dan perangkat sentuh.

### 11.5 Logo dan sidebar Contact

- [x] Perbarui logo pada strip/sidebar sesuai daftar logo final.
- [x] Gunakan label statistik `3 Holding Companies` pada versi Contact/sidebar.
- [x] Pertahankan `12+ Years experience` jika tidak ada revisi baru.
- [x] Hindari CTA WhatsApp ganda ketika footer Contact aktif.
- [x] Pastikan seluruh logo dan link tetap terbaca pada background Contact.

### 11.6 Acceptance criteria Contact

- [x] Copy Contact tampil lengkap.
- [x] Posisi WhatsApp dan media sosial sesuai referensi terbaru.
- [x] Empat platform sosial tampil, termasuk Threads.
- [x] Lima link Ventures menuju akun yang benar.
- [x] Email membuka aplikasi email.
- [x] Lokasi membuka alamat kantor.
- [x] Tombol WhatsApp bekerja dan tidak terduplikasi.

## 12. Gate Mismatch yang Wajib Diselesaikan

### 12.1 Bahasa halaman

- [x] Konfirmasi halaman yang dimaksud oleh catatan `[1 Page jadi full English]`.
- [x] Setelah dikonfirmasi, audit seluruh copy pada halaman tersebut agar tidak ada campuran Indonesia/Inggris yang tidak disengaja.
- [x] Jangan menerjemahkan halaman lain tanpa persetujuan.

### 12.2 Gojek dan GoTo

- [x] Konfirmasi identitas yang dipertahankan: `Gojek` atau `PT GoTo Gojek Tokopedia Tbk`.
- [x] Konfirmasi apakah penyatuan berlaku pada Hero/sidebar.
- [x] Konfirmasi apakah penyatuan berlaku pada intro About.
- [x] Konfirmasi apakah penyatuan berlaku pada Trusted By.
- [x] Setelah diputuskan, hapus seluruh duplikasi tanpa menghapus penyebutan historis Gojek/GoFood pada Journey.

### 12.3 Voca dan Vocal

- [x] Konfirmasi nama final `Voca` atau `Vocal`.
- [x] Selaraskan nama pada Journey 2026.
- [x] Selaraskan nama pada Three Companies.
- [x] Selaraskan nama pada kartu KOL Management.
- [x] Selaraskan nama pada Ventures Contact.
- [x] Pertahankan tujuan Instagram `https://www.instagram.com/vocacreators/` kecuali ada pengganti resmi.

### 12.4 Copy Journey 2026

- [x] Minta atau temukan kelanjutan resmi setelah fragmen `Tim Custompedia`.
- [x] Jangan menerbitkan fragmen yang belum selesai.
- [x] Pastikan copy final tetap sesuai foto 2026 dan konteks dua venture baru.

### 12.5 Judul Three Specializations

- [x] Konfirmasi apakah harus memakai teks mentah `Three Specialization, One Standard`.
- [x] Konfirmasi apakah grammar boleh diperbaiki menjadi `Three Specializations, One Standard`.
- [x] Terapkan satu versi secara konsisten pada desktop dan mobile.

### 12.6 Label Digital Advertising

- [x] Konfirmasi label unit untuk Digital Advertising.
- [x] Jika tidak ada arahan baru, gunakan `Custompedia` hanya setelah mendapat persetujuan.

### 12.7 Batas scroll experience

- [x] Konfirmasi arti pesan `Scroll Experience emg gitu dibuatnya` pada `revisi2.3.png`.
- [x] Konfirmasi apakah experience lama dipertahankan di seluruh halaman atau dibatasi ke Journey.
- [x] Setelah diputuskan, pastikan arahan tersebut tidak bertentangan dengan permintaan agar konten tidak terlalu lama muncul.

## 13. QA Konten, Visual, Interaksi, dan Teknis

### 13.1 Audit konten final

- [x] Bandingkan seluruh teks website dengan copy dalam `task.md` karakter demi karakter.
- [x] Pastikan seluruh override `revisi2*` sudah menggantikan teks PDF yang lebih lama.
- [x] Cari dan hapus sisa copy lama:
  - [x] `3 Companies` pada lokasi yang seharusnya sudah berubah.
  - [x] `Holding 3 Big Companies`.
  - [x] `Entrepreneur Series, Semarang`.
  - [x] `belasan hingga puluhan brand`.
  - [x] `puluhan Hampers` atau `puluhan hampers`.
  - [x] Placeholder `[...]`.
  - [x] Fragmen `Tim Custompedia` yang belum selesai.
  - [x] Logo/nama Creasa lama `Creative Supply Asia`.
- [x] Pastikan semua heading memakai kapitalisasi final.
- [x] Pastikan tidak ada typo nama perusahaan, unit, klien, kota, atau organisasi.

### 13.2 Audit foto dan logo

- [x] Cocokkan setiap foto About dengan section About.
- [x] Cocokkan kesembilan kelompok foto Journey dengan tahun masing-masing.
- [x] Cocokkan lima foto service Custompedia dengan kartu masing-masing.
- [x] Cocokkan empat foto service Parcelin dengan kartu masing-masing.
- [x] Cocokkan foto service Creasa dengan kartunya.
- [x] Cocokkan seluruh logo Active In dan Trusted By dengan nama di bawahnya.
- [x] Pastikan seluruh foto `revisi2*` tetap berada pada konteks yang ditunjukkan.
- [x] Pastikan tidak ada aset hilang atau 404 pada hasil build.
- [x] Pastikan foto tidak pecah pada layar resolusi tinggi.
- [x] Pastikan crop mobile tidak menghilangkan subjek penting.

### 13.3 Audit link

- [x] Uji navigasi Home, Journey, Work, dan Contact.
- [x] Uji link Custompedia.
- [x] Uji link Parcelin.
- [x] Uji link Creasa.
- [x] Uji empat link media sosial.
- [x] Uji lima link Ventures.
- [x] Uji email.
- [x] Uji lokasi kantor.
- [x] Uji tombol WhatsApp.
- [x] Pastikan tidak ada link kosong, `#` sementara, atau URL salah ketik.

### 13.4 Audit responsif dan aksesibilitas

- [x] Periksa desktop lebar.
- [x] Periksa laptop.
- [x] Periksa tablet portrait dan landscape.
- [x] Periksa mobile sempit.
- [x] Periksa navigasi keyboard dari awal sampai akhir halaman.
- [x] Periksa focus ring pada link, tab, kartu, dan tombol.
- [x] Periksa semua gambar memiliki `alt` yang sesuai.
- [x] Periksa kontras headline, outline, body copy, keyword, dan link.
- [x] Periksa reduced motion.
- [x] Pastikan tidak ada horizontal overflow halaman yang tidak disengaja.

### 13.5 Audit animasi dan performa

- [x] Pastikan animasi tidak menunda konten non-Journey secara berlebihan.
- [x] Pastikan angka Journey tidak terpotong selama animasi.
- [x] Pastikan marquee Trusted By tidak tersendat atau melompat.
- [x] Pastikan horizontal card scroll tidak memblokir vertical scroll.
- [x] Pastikan animasi peta memiliki fallback reduced motion.
- [x] Pastikan efek blur About tidak menurunkan performa secara berlebihan.
- [x] Pastikan tidak ada event listener, timeline, atau ScrollTrigger duplikat setelah resize/navigation.

### 13.6 Pemeriksaan teknis final

- [x] Jalankan pemeriksaan source untuk copy lama dan placeholder.
- [x] Jalankan `npm run check` dan pastikan tidak ada error baru.
- [x] Jalankan `npm run build` dan pastikan build selesai.
- [x] Jalankan `git diff --check`.
- [x] Jalankan preview hasil build.
- [x] Periksa seluruh section di browser desktop.
- [x] Periksa seluruh section di browser mobile.
- [x] Ambil screenshot pembanding untuk Homepage, About, setiap Journey, Three Companies, Relationships, Southeast Asia, Work, Built to Grow, dan Contact.
- [x] Cocokkan screenshot akhir dengan PDF dan gambar revisi terbaru.
- [x] Pastikan tidak ada revisi dalam dokumen ini yang masih `[ ]` sebelum pekerjaan dinyatakan selesai.

## 14. Definition of Done

- [x] Seluruh gate mismatch sudah memiliki keputusan final.
- [x] Seluruh copy dari PDF dan `revisi2*` sudah diterapkan sesuai prioritas.
- [x] Seluruh foto dan logo berasal dari sumber yang tepat serta tidak tertukar.
- [x] Seluruh link berhasil diuji.
- [x] Seluruh interaksi bekerja pada desktop, mobile, keyboard, dan reduced motion.
- [x] Tidak ada angka, heading, foto, kartu, atau copy yang terpotong.
- [x] Pemeriksaan teknis dan visual final lulus.
- [x] Seluruh item anak sudah `[x]` sebelum item induk dan Definition of Done diubah menjadi `[x]`.
