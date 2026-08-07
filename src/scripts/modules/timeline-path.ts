import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop, prefersReducedMotion } from '../core/utils';

/**
 * TIMELINE
 *
 * Path-nya tetap — digambar di About.astro dari daftar simpul. Modul ini
 * mengerjakan tiga hal:
 *
 *  1. MENEMPELKAN kartu ke simpul. Kartu di-`position:absolute`; sudut yang
 *     bernama (bawah-kiri atau bawah-kanan, tergantung sisi simpul) diletakkan
 *     tepat di simpulnya. Karena posisinya dibaca dari rect simpul yang
 *     sebenarnya, komposisinya bertahan di lebar layar mana pun tanpa satu pun
 *     media query.
 *
 *  2. MENGISI garis lewat tinggi pembungkus, bukan DrawSVG. Alasannya bukan
 *     selera: pengisiannya bertahap dalam TUJUH langkah dengan durasi tidak
 *     rata, jadi garisnya berhenti sejenak di tiap simpul. Scrub linear
 *     kehilangan ritme itu sepenuhnya.
 *
 *  3. Popup cerita panjang.
 */

/**
 * Tujuh langkah, durasi sengaja tidak rata. Angka-angka ini yang membuat
 * garisnya terasa "singgah" di tiap simpul alih-alih meluncur rata.
 */
const FILL_STEPS = [
  { height: '14%', duration: 2 },
  { height: '28%', duration: 1 },
  { height: '42%', duration: 1.5 },
  { height: '56%', duration: 2 },
  { height: '70%', duration: 1 },
  { height: '84%', duration: 1.5 },
  { height: '100%', duration: 2 },
];

/** Jarak kartu dari simpulnya, dalam piksel. */
const NODE_GAP = 18;

const triggers: ScrollTrigger[] = [];
let closeStory: (() => void) | null = null;

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
 * KEDALAMAN — kartu bergerak beda kecepatan.
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
 * Titik yang berjalan di ujung garis yang sedang digambar.
 *
 * Posisinya diambil dari geometri path lewat getPointAtLength lalu ditulis
 * sebagai PERSEN, bukan digambar di dalam SVG-nya. Alasannya sama dengan
 * simpul statis: SVG-nya di-stretch `preserveAspectRatio="none"`, jadi apa pun
 * yang digambar di dalamnya berubah jadi elips.
 */
function buildRunner(container: HTMLElement): void {
  const runner = $<HTMLElement>('[data-timeline-runner]', container);
  const path = $<SVGPathElement>('.timeline-lit', container);
  const svg = $<SVGSVGElement>('.timeline-svg', container);
  if (!runner || !path || !svg) return;

  const viewBox = svg.viewBox.baseVal;
  if (!viewBox.width || !viewBox.height) return;
  const length = path.getTotalLength();

  const place = (progress: number) => {
    const point = path.getPointAtLength(length * gsap.utils.clamp(0, 1, progress));
    runner.style.left = `${(point.x / viewBox.width) * 100}%`;
    runner.style.top = `${(point.y / viewBox.height) * 100}%`;
  };

  place(0);

  const instance = ScrollTrigger.create({
    trigger: container,
    start: 'top 90%',
    end: 'bottom 80%',
    // Jendela pengisian garis yang sama dengan buildFill — titik ini harus
    // duduk tepat di ujung garis, bukan berjalan dengan iramanya sendiri.
    onUpdate: (self) => place(self.progress),
    onToggle: (self) => gsap.to(runner, { opacity: self.isActive ? 1 : 0, duration: 0.3 }),
  });
  triggers.push(instance);
}

/**
 * Dipasang sekali seumur halaman, bukan tiap init(): modul ini dibangun ulang
 * saat resize, dan listener yang dipasang ulang akan menumpuk.
 */
let storyBound = false;

function buildStory(): void {
  if (storyBound) return;

  const dialog = $<HTMLElement>('[data-story-dialog]');
  const panel = $<HTMLElement>('.story-panel');
  const yearEl = $('[data-story-year]');
  const titleEl = $('[data-story-title]');
  const bodyEl = $('[data-story-body]');
  if (!dialog || !panel || !yearEl || !titleEl || !bodyEl) return;

  storyBound = true;
  let lastTrigger: HTMLElement | null = null;

  const open = (source: HTMLElement) => {
    lastTrigger = source;
    yearEl.textContent = `'${source.dataset.storyYear ?? ''}`;
    titleEl.textContent = source.dataset.storyTitle ?? '';
    bodyEl.textContent = source.dataset.storyText ?? '';

    dialog.hidden = false;
    gsap.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(panel, { y: 24, scale: 0.96 }, { y: 0, scale: 1, duration: 0.45, ease: 'expo.out' });
    $<HTMLElement>('.story-close', dialog)?.focus();
  };

  const close = () => {
    if (dialog.hidden) return;
    gsap.to(dialog, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        dialog.hidden = true;
        lastTrigger?.focus();
        lastTrigger = null;
      },
    });
  };

  closeStory = close;

  $$<HTMLElement>('[data-story]').forEach((button) => {
    button.addEventListener('click', () => open(button));
  });

  $$<HTMLElement>('[data-story-close]', dialog).forEach((button) => {
    button.addEventListener('click', close);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

export const timelinePathModule: AnimationModule = {
  name: 'timeline',
  rebuildOnResize: true,

  init() {
    const container = $<HTMLElement>('[data-timeline]');
    if (!container) return;

    // Popup selalu dipasang — ia fitur, bukan gerakan. Modul ini karena itu
    // tidak boleh ditandai `skipOnReducedMotion`: menonaktifkan seluruhnya
    // ikut mematikan tombol "Baca selengkapnya".
    buildStory();

    // Di bawah 768px dan pada reduced motion, kartunya kembali mengalir normal
    // dan garisnya disembunyikan — tidak ada yang perlu ditempelkan.
    if (!isDesktop() || prefersReducedMotion()) return;

    anchorCards(container);
    buildFill(container);
    buildParallax(container);
    buildActiveNodes(container);
    buildRunner(container);
  },

  destroy() {
    while (triggers.length) triggers.pop()?.kill();
    closeStory?.();
    closeStory = null;
    $$<HTMLElement>('[data-timeline-card]').forEach((card) => {
      card.style.left = '';
      card.style.top = '';
      gsap.set(card, { clearProps: 'yPercent' });
    });
    $$<HTMLElement>('[data-timeline-node]').forEach((node) => node.classList.remove('is-active'));
  },
};
