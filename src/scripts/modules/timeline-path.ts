import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, prefersReducedMotion } from '../core/utils';

/**
 * TIMELINE
 *
 * Path-nya tetap - digambar di Journey.astro dari daftar simpul. Modul ini
 * mengerjakan dua hal:
 *
 *  1. MENEMPELKAN kartu ke simpul. Kartu di-`position:absolute`; sudut yang
 *     bernama (bawah-kiri atau bawah-kanan, tergantung sisi simpul) diletakkan
 *     tepat di simpulnya. Karena posisinya dibaca dari rect simpul yang
 *     sebenarnya, komposisinya bertahan di lebar layar mana pun tanpa satu pun
 *     media query.
 *
 *  2. MENGISI garis lewat tinggi pembungkus, bukan DrawSVG. Alasannya bukan
 *     selera: pengisiannya bertahap satu langkah per simpul dengan durasi
 *     tidak rata, jadi garisnya berhenti sejenak di tiap simpul. Scrub linear
 *     kehilangan ritme itu sepenuhnya.
 */

/**
 * Satu langkah per simpul, durasi sengaja tidak rata. Angka-angka ini yang
 * membuat garisnya terasa "singgah" di tiap simpul alih-alih meluncur rata.
 *
 * Tingginya BUKAN pembagian rata: tiap persen adalah posisi simpul ke-N di
 * dalam viewBox Journey.astro (y simpul ÷ tinggi viewBox). Kalau jumlah bab di
 * site.ts berubah, daftar ini ikut berubah - kalau tidak, garisnya berhenti di
 * tempat yang bukan simpul.
 */
const FILL_STEPS = [
  { height: '14%', duration: 2 },
  { height: '24%', duration: 1 },
  { height: '35%', duration: 1.5 },
  { height: '45%', duration: 2 },
  { height: '55%', duration: 1 },
  { height: '66%', duration: 1.5 },
  { height: '76%', duration: 2 },
  { height: '87%', duration: 1 },
  { height: '100%', duration: 1.5 },
];

/** Jarak kartu dari simpulnya, dalam piksel. */
const NODE_GAP = 18;

const triggers: ScrollTrigger[] = [];

/**
 * Fase baca lalu fase tulis, sama seperti ghost engine: semua rect diambil
 * saat DOM masih bersih, baru posisinya ditulis. Kalau dicampur, kartu ke-N
 * diukur setelah kartu ke-1 sudah pindah.
 */
function anchorCards(container: HTMLElement): void {
  const cards = $$<HTMLElement>('[data-timeline-card]', container);
  const wrapRect = container.getBoundingClientRect();

  const placements = cards.map((card) => {
    const index = Number(card.dataset.timelineCard);
    const node = $(`[data-timeline-node="${index}"]`, container);
    if (!node) return null;

    const nodeRect = node.getBoundingClientRect();
    const nodeX = nodeRect.left + nodeRect.width / 2 - wrapRect.left;
    const nodeY = nodeRect.top + nodeRect.height / 2 - wrapRect.top;

    // Simpul di kanan → kartu duduk di sebelah KIRI-nya, sudut kanan-bawahnya
    // yang menempel. Simpul di kiri → kebalikannya.
    const onRight = card.dataset.side === 'right';
    const left = onRight ? nodeX - card.offsetWidth - NODE_GAP : nodeX + NODE_GAP;

    return {
      card,
      left: Math.max(0, Math.min(left, wrapRect.width - card.offsetWidth)),
      top: Math.max(0, nodeY - card.offsetHeight),
    };
  });

  for (const p of placements) {
    if (!p) continue;
    p.card.style.left = `${p.left}px`;
    p.card.style.top = `${p.top}px`;
  }
}

function buildFill(container: HTMLElement): void {
  const fill = $('[data-timeline-fill]', container);
  if (!fill) return;

  const tween = gsap.fromTo(
    fill,
    { height: '0%' },
    {
      keyframes: FILL_STEPS,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 90%',
        end: 'bottom 80%',
        scrub: 1,
      },
    },
  );
  if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);

  const dots = $$('[data-timeline-node]', container);
  if (dots.length === 0) return;

  const dotTween = gsap.fromTo(
    dots,
    { scale: 0, transformOrigin: 'center' },
    {
      scale: 1,
      ease: 'back.out(2)',
      duration: 0.6,
      stagger: { each: 0.5 },
      scrollTrigger: {
        trigger: container,
        start: 'top 90%',
        end: 'bottom 80%',
        scrub: 1,
      },
    },
  );
  if (dotTween.scrollTrigger) triggers.push(dotTween.scrollTrigger);
}

/**
 * REL MOBILE - garis lurus di kiri kartu (digambar CSS, lihat sections.css).
 *
 * Yang diisi elemen yang SAMA dengan versi desktop, `[data-timeline-fill]`:
 * di desktop ia pembungkus ber-`overflow:hidden` yang menyingkap path berkelok,
 * di mobile ia batang lurus 3px di atas relnya. Karena yang di-scrub sama-sama
 * TINGGI elemen itu, `FILL_STEPS` dipakai bersama - ritme "singgah di tiap
 * simpul" jadi identik di kedua layout tanpa tabel kedua.
 *
 * Simpulnya tidak ikut ditween di sini: di mobile titik-titiknya digambar
 * sebagai pseudo-element tiap kartu (`.timeline-card::before`), dan
 * pseudo-element tidak bisa jadi target GSAP.
 */
function buildRailFill(container: HTMLElement): void {
  const fill = $('[data-timeline-fill]', container);
  if (!fill) return;

  const tween = gsap.fromTo(
    fill,
    { height: '0%' },
    {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
        end: 'bottom 65%',
        scrub: 0.5,
      },
    },
  );
  if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
}

/**
 * KEDALAMAN - kartu bergerak beda kecepatan.
 *
 * Dipakai `yPercent`, BUKAN `y`. Kartu sudah punya animasi masuk sendiri lewat
 * `data-tl-*` di About.astro yang memakai `y`; kalau parallax memakai properti
 * yang sama, keduanya saling menimpa. GSAP menyimpan `y` dan `yPercent` sebagai
 * dua komponen transform terpisah dan menjumlahkannya, jadi keduanya bisa
 * hidup berdampingan.
 *
 * Angkanya sengaja kecil dan berselang-seling: yang terasa harus kedalaman,
 * bukan kartu yang melayang-layang.
 */
const PARALLAX = 5;

function buildParallax(container: HTMLElement): void {
  $$<HTMLElement>('[data-timeline-card]', container).forEach((card, i) => {
    const dir = i % 2 === 0 ? 1 : -0.6;
    const tween = gsap.fromTo(
      card,
      { yPercent: PARALLAX * dir },
      {
        yPercent: -PARALLAX * dir,
        ease: 'none',
        scrollTrigger: { trigger: container, start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    );
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });
}

function buildMedia(container: HTMLElement): void {
  $$<HTMLElement>('[data-timeline-media]', container).forEach((media) => {
    const image = media.querySelector('img');
    if (!image) return;

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: media, start: 'top 86%', toggleActions: 'play none none reverse' },
    });
    timeline
      .fromTo(media, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.72, ease: 'power2.out' })
      .fromTo(image, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power3.out' }, 0.06);
    if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger);
  });
}

/**
 * Simpul menyala saat kartunya berada di pita tengah layar. Kelas, bukan tween:
 * simpulnya sudah dianimasikan `scale`-nya oleh buildFill, dan tween kedua pada
 * elemen yang sama akan berebut properti transform yang sama.
 */
function buildActiveNodes(container: HTMLElement): void {
  $$<HTMLElement>('[data-timeline-card]', container).forEach((card) => {
    const node = $<HTMLElement>(`[data-timeline-node="${card.dataset.timelineCard}"]`, container);
    if (!node) return;

    const instance = ScrollTrigger.create({
      trigger: card,
      start: 'top 65%',
      end: 'bottom 35%',
      onToggle: (self) => node.classList.toggle('is-active', self.isActive),
    });
    triggers.push(instance);
  });
}

/**
 * KARTU DISOROT - hanya `scale`, dan hanya lewat GSAP.
 *
 * Kartu sudah memegang `y` (animasi masuk) dan `yPercent` (parallax) sebagai
 * style inline milik GSAP; `transform` apa pun dari CSS akan ditimpa style itu.
 * `scale` adalah komponen transform terpisah, jadi ia bisa hidup berdampingan
 * dengan keduanya. Sisa efek hover (bayangan, warna tombol) tetap di CSS.
 */
let hoverBound = false;

function buildHover(container: HTMLElement): void {
  // Sekali seumur halaman: kartunya elemen yang sama setelah rebuild resize,
  // jadi listener yang dipasang ulang akan menumpuk di elemen yang itu-itu juga.
  if (hoverBound) return;
  hoverBound = true;

  $$<HTMLElement>('[data-timeline-card]', container).forEach((card) => {
    // `gsap.to`, bukan `quickTo`: quickTo pada sub-properti transform tidak
    // pernah ter-render di sini - nilainya tetap 1 (diuji di browser).
    const lift = (scale: number) => gsap.to(card, { scale, duration: 0.4, ease: 'expo.out' });
    card.addEventListener('mouseenter', () => lift(1.02));
    card.addEventListener('mouseleave', () => lift(1));
  });
}

export const timelinePathModule: AnimationModule = {
  name: 'timeline',
  rebuildOnResize: true,

  init() {
    const container = $<HTMLElement>('[data-timeline]');
    if (!container) return;

    // Reduced motion: tidak ada yang bergerak sama sekali. Relnya tetap
    // tergambar lewat CSS, cuma tidak pernah terisi.
    if (prefersReducedMotion()) return;

    // Di bawah 768px kartunya kembali mengalir normal - tidak ada yang perlu
    // ditempelkan ke simpul - tapi rel lurus di kirinya tetap ikut terisi.
    if (!window.matchMedia('(min-width: 1101px)').matches) {
      buildRailFill(container);
      return;
    }

    anchorCards(container);
    buildFill(container);
    buildParallax(container);
    buildMedia(container);
    buildActiveNodes(container);
    buildHover(container);
  },

  destroy() {
    while (triggers.length) triggers.pop()?.kill();
    // Tinggi terakhir ditulis GSAP sebagai style inline. Tanpa dibersihkan, rel
    // mobile membeku di tinggi terakhirnya saat layar dilebarkan ke desktop
    // (dan sebaliknya) - modul ini dibangun ulang tiap resize.
    const fill = $<HTMLElement>('[data-timeline-fill]');
    if (fill) gsap.set(fill, { clearProps: 'height' });
    $$<HTMLElement>('[data-timeline-card]').forEach((card) => {
      card.style.left = '';
      card.style.top = '';
      gsap.set(card, { clearProps: 'yPercent,scale' });
    });
    $$<HTMLElement>('[data-timeline-media]').forEach((media) => {
      gsap.set(media, { clearProps: 'opacity,visibility' });
      const image = media.querySelector('img');
      if (image) gsap.set(image, { clearProps: 'opacity,visibility' });
    });
    $$<HTMLElement>('[data-timeline-node]').forEach((node) => node.classList.remove('is-active'));
  },
};
