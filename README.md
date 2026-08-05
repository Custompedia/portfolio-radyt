# portfolio-radyt

Portfolio satu halaman untuk **Radhyta Mukhsin** — pemilik Custompedia Creative
Group, agensi kreatif di Semarang yang berjalan sejak 2014.

Dibangun dengan Astro + GSAP. Motion-nya scroll-driven: wordmark raksasa masuk
huruf demi huruf, hero yang berserakan merakit dirinya jadi sidebar, galeri
proyek bergerak menyamping, dan tema sidebar berganti sendiri saat melewati
section gelap.

> **Konten masih perlu dikonfirmasi.** Angka paket harga, nama klien, dan
> testimoni di `src/data/site.ts` masih perkiraan dan ditandai `TODO`.
> Foto hero adalah placeholder berlisensi bebas, bukan foto Radyt —
> lihat `public/images/README.md`.

## Stack

| | |
|---|---|
| Framework | [Astro](https://astro.build) 7 — zero JS by default, TypeScript strict |
| Animasi | [GSAP](https://gsap.com) 3.15 — ScrollTrigger, SplitText, DrawSVG |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering) 1.3 |
| Slider | [Swiper](https://swiperjs.com) 14 |
| Font | Satoshi + General Sans ([Fontshare](https://fontshare.com), self-host) |

Tanpa framework UI — semua interaksi vanilla TypeScript.

## Jalankan

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run check    # astro check (types + a11y)
```

Butuh Node 20+.

## Mengganti isi situs

Semua teks, daftar proyek, harga, testimoni, dan FAQ ada di satu file:

```
src/data/site.ts
```

Ganti isinya dan seluruh halaman ikut berubah — markup dan kode animasi tidak
perlu disentuh. Ganti juga `public/images/portrait.webp` dengan foto asli
(petunjuknya ada di `public/images/README.md`).

Warna dan tipografi ada di `src/styles/tokens.css` sebagai CSS custom property.

## Struktur

```
src/
  data/site.ts            SATU sumber konten
  layouts/Base.astro      <head>, preload font, mount script
  components/
    Sidebar.astro         elemen ASLI — target morph
    sections/*.astro      Hero, About, Work, WhatYouGet, Services, Cta,
                          Testimonials, Faq, Footer
  scripts/
    main.ts               registry modul: init / destroy / rebuild-on-resize
    core/                 gsap, lenis, utils, kontrak modul
    modules/              17 modul animasi (lihat bawah)
  styles/                 tokens, base, components, sections
```

## Cara kerja animasinya

**Ghost engine** (`modules/ghost.ts`) — inilah efek utamanya. Elemen sidebar
adalah satu-satunya elemen nyata; di hero hanya ada kotak `.ghost` tak terlihat
yang menandai posisi awalnya. Engine mengukur selisih keduanya lalu membuat
tween ter-scrub dari posisi hero ke posisi sidebar.

Dikerjakan dalam dua fase yang tegas: **fase 1 membaca semua rect saat DOM masih
bersih, fase 2 baru menulis tween.** Kalau dicampur, pengukuran elemen ke-N sudah
tercemar transform elemen ke-1 dan seluruh komposisi meleset.

Lima tipe transform: `box` (skala seragam), `background` (skala tidak seragam,
dengan kompensasi radius eliptis per sudut supaya sudut tetap bulat), `link`,
`text`, dan `size` (melar lebar/tinggi tanpa mengecilkan label).

**Style engine** (`modules/style-engine.ts`) — animasi deklaratif lewat atribut,
jadi tiap elemen membawa resepnya sendiri di markup:

```html
<p data-tl-type="scroll"
   data-tl-trigger="[data-hero]"
   data-tl-start="0% top" data-tl-end="34% top"
   data-tl-from="{'opacity':1}"
   data-tl-to="{'yPercent':-45,'opacity':0}">
```

Atribut lain: `data-tl-target`, `data-tl-stagger`, `data-tl-once`,
`data-tl-desktop`, dan `data-number-count` untuk penghitung angka odometer.

**Timeline berkelok** (`modules/timeline-path.ts`) — garis penghubung antar
kartu perjalanan dihitung dari posisi kartu yang sebenarnya, menempel di tepi
kartu, dengan titik kendali yang saling menyilang supaya benar-benar membentuk
huruf S. Ditarik dengan DrawSVG mengikuti scroll.

**Modul lain:** intro, sidebar auto-scale, horizontal scroll, theme switcher,
text reveal, lead paragraph, magnetic hover, kartu proyek, accordion,
testimonial slider, nav active, clipboard, mobile menu.

Tiap modul punya `init()` / `destroy()` dan menyatakan apakah ia butuh dibangun
ulang saat resize. `main.ts` yang mengorkestrasi urutannya — sidebar mengunci
skalanya dulu, baru ghost boleh mengukur.

## Aksesibilitas & fallback

- Di bawah 768px dan pada `prefers-reduced-motion: reduce`, semua morph dimatikan
  dan layout jatuh ke versi statis — galeri proyek tetap bisa dijangkau sebagai
  scroller horizontal biasa, bukan scroll-jacking.
- Lighthouse: Aksesibilitas 95, Best Practices 100.

## Lisensi

Kode: bebas dipakai. Font Satoshi & General Sans tunduk pada
[lisensi Fontshare](https://www.fontshare.com/licenses/itf-ffl).
