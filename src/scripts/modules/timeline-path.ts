import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { getLenis } from '../core/smooth-scroll';
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
 * REL MOBILE — garis lurus di kiri kartu (digambar CSS, lihat sections.css).
 *
 * Yang diisi elemen yang SAMA dengan versi desktop, `[data-timeline-fill]`:
 * di desktop ia pembungkus ber-`overflow:hidden` yang menyingkap path berkelok,
 * di mobile ia batang lurus 3px di atas relnya. Karena yang di-scrub sama-sama
 * TINGGI elemen itu, `FILL_STEPS` dipakai bersama — ritme "singgah di tiap
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
      keyframes: FILL_STEPS,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'bottom 70%',
        scrub: 1,
      },
    },
  );
  if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
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
 * KARTU DISOROT — hanya `scale`, dan hanya lewat GSAP.
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
    // pernah ter-render di sini — nilainya tetap 1 (diuji di browser).
    const lift = (scale: number) => gsap.to(card, { scale, duration: 0.4, ease: 'expo.out' });
    card.addEventListener('mouseenter', () => lift(1.02));
    card.addEventListener('mouseleave', () => lift(1));
  });
}

/* --------------------------------------------------------------------------
 * POPUP CERITA
 * ----------------------------------------------------------------------- */

interface StoryMetric {
  value: string;
  label: string;
}

interface StoryEntry {
  step: string;
  year: string;
  flag: string;
  flagLabel: string;
  title: string;
  age: string;
  body: string;
  metrics: StoryMetric[];
  moves: string[];
  outcome: string;
  tags: string[];
}

/**
 * Isi popup datang dari satu blok JSON yang ditanam About.astro, bukan dari
 * belasan atribut `data-*` per kartu dan bukan dari `import` site.ts — impor
 * itu akan menyeret seluruh isi situs masuk ke bundle JS.
 */
function readEntries(): StoryEntry[] {
  const script = $<HTMLScriptElement>('[data-timeline-data]');
  if (!script?.textContent) return [];
  try {
    return JSON.parse(script.textContent) as StoryEntry[];
  } catch {
    console.warn('[timeline] data cerita gagal di-parse');
    return [];
  }
}

/** Semua teks masuk lewat `textContent`, tidak pernah `innerHTML`. */
function fillList<T>(host: HTMLElement, items: T[], render: (item: T) => HTMLElement): void {
  host.replaceChildren(...items.map(render));
}

/**
 * Angka dihitung naik hanya kalau ia memang angka. `value` boleh bersufiks
 * ('950+', '50 pcs', '2017'), jadi bagian numerik dipisah dari sisanya dan
 * hanya bagian itu yang dianimasikan — sufiksnya tetap terbaca sejak frame
 * pertama.
 */
function countUp(el: HTMLElement, value: string): void {
  const match = /^(\d+)(.*)$/.exec(value.trim());
  if (!match || prefersReducedMotion()) {
    el.textContent = value;
    return;
  }

  const target = Number(match[1]);
  const suffix = match[2] ?? '';
  const state = { n: 0 };

  gsap.to(state, {
    n: target,
    duration: 0.9,
    delay: 0.15,
    ease: 'expo.out',
    onUpdate: () => {
      el.textContent = `${Math.round(state.n)}${suffix}`;
    },
  });
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
  if (!dialog || !panel) return;

  const el = {
    flag: $<HTMLElement>('[data-story-flag]', dialog),
    flagLabel: $<HTMLElement>('[data-story-flag-label]', dialog),
    step: $<HTMLElement>('[data-story-stepno]', dialog),
    year: $<HTMLElement>('[data-story-year]', dialog),
    title: $<HTMLElement>('[data-story-title]', dialog),
    age: $<HTMLElement>('[data-story-age]', dialog),
    body: $<HTMLElement>('[data-story-body]', dialog),
    metrics: $<HTMLElement>('[data-story-metrics]', dialog),
    moves: $<HTMLElement>('[data-story-moves]', dialog),
    outcome: $<HTMLElement>('[data-story-outcome]', dialog),
    tags: $<HTMLElement>('[data-story-tags]', dialog),
  };
  if (Object.values(el).some((node) => node === null)) return;

  const entries = readEntries();
  if (entries.length === 0) return;

  storyBound = true;

  const steps = $$<HTMLElement>('[data-story-step]', dialog);
  let lastTrigger: HTMLElement | null = null;

  const render = (entry: StoryEntry) => {
    el.flag!.dataset.flag = entry.flag;
    el.flagLabel!.textContent = entry.flagLabel;
    el.step!.textContent = entry.step;
    el.year!.textContent = `'${entry.year}`;
    el.title!.textContent = entry.title;
    el.age!.textContent = entry.age;
    el.body!.textContent = entry.body;
    el.outcome!.textContent = entry.outcome;

    fillList(el.metrics!, entry.metrics, (metric) => {
      const li = document.createElement('li');
      const value = document.createElement('strong');
      const label = document.createElement('span');
      value.textContent = metric.value;
      label.textContent = metric.label;
      li.append(value, label);
      return li;
    });

    fillList(el.moves!, entry.moves, (move) => {
      const li = document.createElement('li');
      li.textContent = move;
      return li;
    });

    fillList(el.tags!, entry.tags, (tag) => {
      const li = document.createElement('li');
      li.textContent = tag;
      return li;
    });
  };

  const open = (source: HTMLElement) => {
    const entry = entries[Number(source.dataset.storyIndex)];
    if (!entry) return;

    lastTrigger = source;
    render(entry);

    dialog.hidden = false;
    // Panel bisa dibuka lagi setelah digulir ke bawah pada kunjungan sebelumnya.
    panel.scrollTop = 0;
    // Halaman di belakang scrim tidak boleh ikut bergulir; Lenis memegang
    // scroll-nya sendiri, jadi `overflow:hidden` saja tidak menghentikannya.
    getLenis()?.stop();

    gsap
      .timeline()
      .fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0)
      .fromTo(
        panel,
        { y: 28, scale: 0.96 },
        { y: 0, scale: 1, duration: 0.55, ease: 'expo.out' },
        0,
      )
      .fromTo(
        steps,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'expo.out' },
        0.12,
      );

    $$<HTMLElement>('strong', el.metrics!).forEach((node, i) => countUp(node, entry.metrics[i]!.value));

    $<HTMLElement>('.story-close', dialog)?.focus();
  };

  const close = () => {
    if (dialog.hidden) return;
    getLenis()?.start();
    gsap.to(dialog, {
      opacity: 0,
      duration: 0.22,
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

    // Reduced motion: tidak ada yang bergerak sama sekali. Relnya tetap
    // tergambar lewat CSS, cuma tidak pernah terisi.
    if (prefersReducedMotion()) return;

    // Di bawah 768px kartunya kembali mengalir normal — tidak ada yang perlu
    // ditempelkan ke simpul — tapi rel lurus di kirinya tetap ikut terisi.
    if (!isDesktop()) {
      buildRailFill(container);
      return;
    }

    anchorCards(container);
    buildFill(container);
    buildParallax(container);
    buildActiveNodes(container);
    buildHover(container);
  },

  destroy() {
    while (triggers.length) triggers.pop()?.kill();
    // Tinggi terakhir ditulis GSAP sebagai style inline. Tanpa dibersihkan, rel
    // mobile membeku di tinggi terakhirnya saat layar dilebarkan ke desktop
    // (dan sebaliknya) — modul ini dibangun ulang tiap resize.
    const fill = $<HTMLElement>('[data-timeline-fill]');
    if (fill) gsap.set(fill, { clearProps: 'height' });
    // TIDAK di-null-kan: popup-nya dipasang sekali seumur halaman (`storyBound`),
    // jadi handle ini harus tetap hidup untuk destroy berikutnya.
    closeStory?.();
    $$<HTMLElement>('[data-timeline-card]').forEach((card) => {
      card.style.left = '';
      card.style.top = '';
      gsap.set(card, { clearProps: 'yPercent,scale' });
    });
    $$<HTMLElement>('[data-timeline-node]').forEach((node) => node.classList.remove('is-active'));
  },
};
