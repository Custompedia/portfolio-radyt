import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';
import { getSidebarScale } from './sidebar';

/**
 * GHOST ENGINE
 *
 * Elemen sidebar adalah satu-satunya elemen nyata. Di hero ada kotak `.ghost`
 * tak terlihat yang menandai "di mana elemen ini seharusnya berada saat scroll
 * masih nol". Engine mengukur selisih kedua posisi lalu membuat tween
 * ter-scrub: dari posisi hero → posisi sidebar.
 *
 * Dikerjakan dalam dua fase yang tegas:
 *   fase 1 — baca SEMUA rect saat DOM masih bersih (belum ada transform),
 *   fase 2 — baru terapkan tween.
 * Kalau dicampur, pengukuran elemen ke-N sudah tercemar transform elemen ke-1
 * dan seluruh komposisi meleset.
 */

type GhostType = 'box' | 'background' | 'size';

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Measurement {
  real: HTMLElement;
  type: GhostType;
  from: Rect;
  to: Rect;
}

/** Radius yang terlihat pada kartu saat masih berukuran hero. */
const HERO_RADIUS = 26;

/**
 * Panjang morph, dihitung dari puncak hero. Hero setinggi 300vh dan lapisan
 * sticky-nya menempel selama 200vh, jadi 120vh menyelesaikan morph di sepertiga
 * awal — sama seperti `data-flip-end="40% top"` pada referensi.
 */
const MORPH_VH = 1.2;

const toRect = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

/**
 * Baris navigasi hero tidak dihitung di runtime: ia adalah baris flex nyata di
 * `.hero-front` berisi label transparan, satu per link. Jadi tiap link punya
 * `data-ghost-target` sendiri dan ikut jalur pengukuran yang sama seperti kartu
 * — tidak perlu matematika distribusi, dan skalanya otomatis benar karena
 * stringnya identik (rasio lebar = rasio font-size).
 */
function measurePairs(): Measurement[] {
  const measurements: Measurement[] = [];

  for (const real of $$<HTMLElement>('[data-ghost]')) {
    const id = real.dataset.ghost;
    if (!id) continue;
    const ghost = $(`[data-ghost-target="${id}"]`);
    if (!ghost) continue;

    measurements.push({
      real,
      type: (real.dataset.ghostType as GhostType) ?? 'box',
      from: toRect(ghost),
      to: toRect(real),
    });
  }

  return measurements;
}

function buildTween(m: Measurement, trigger: Element): void {
  const { real, type, from, to } = m;
  if (to.width === 0 || to.height === 0) return;

  const scale = getSidebarScale();
  const x = (from.left - to.left) / scale;
  const y = (from.top - to.top) / scale;

  const fromVars: gsap.TweenVars = {
    x,
    y,
    transformOrigin: 'top left',
    force3D: false,
  };

  const toVars: gsap.TweenVars = {
    x: 0,
    y: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    ease: 'power1.inOut',
    force3D: false,
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: () => `+=${window.innerHeight * MORPH_VH}`,
      scrub: 1,
      invalidateOnRefresh: false,
    },
  };

  if (type === 'background') {
    // Kartu boleh melar tidak seragam, tapi sudutnya harus tetap terlihat
    // bulat. Karena itu tiap sudut diberi radius eliptis `X px  Y px`: setelah
    // di-scale sX/sY, yang terlihat kembali jadi lingkaran ber-radius sama.
    const sx = from.width / to.width;
    const sy = from.height / to.height;
    const corner = `${HERO_RADIUS / sx}px ${HERO_RADIUS / sy}px`;

    Object.assign(fromVars, {
      scaleX: sx,
      scaleY: sy,
      borderTopLeftRadius: corner,
      borderTopRightRadius: corner,
      borderBottomLeftRadius: corner,
      borderBottomRightRadius: corner,
    });

    // Radius akhir dibaca per sudut, bukan satu nilai untuk keempatnya. Dua
    // kartu statistik saling menempel di sidebar dan sisi yang bertemu
    // sengaja disiku lewat CSS — kalau keempat sudut ditulis sama, style
    // inline dari GSAP menimpanya dan celah bulat itu muncul lagi.
    const end = getComputedStyle(real);
    const landed = (value: string) => {
      const px = parseFloat(value) || 0;
      return `${px}px ${px}px`;
    };
    Object.assign(toVars, {
      borderTopLeftRadius: landed(end.borderTopLeftRadius),
      borderTopRightRadius: landed(end.borderTopRightRadius),
      borderBottomLeftRadius: landed(end.borderBottomLeftRadius),
      borderBottomRightRadius: landed(end.borderBottomRightRadius),
    });
  } else if (type === 'size') {
    // Lebar & tinggi dianimasikan langsung, bukan di-scale. Tombol jadi bisa
    // lebih pendek di hero tanpa ikut mengecilkan labelnya — dan ukurannya
    // bisa disamakan persis dengan tombol statis di sebelahnya.
    // Dibagi skala sidebar karena nilai ini ditulis ke koordinat lokal elemen.
    fromVars.width = from.width / scale;
    fromVars.height = from.height / scale;
    toVars.width = to.width / scale;
    toVars.height = to.height / scale;
  } else {
    fromVars.scale = from.width / to.width;
  }

  gsap.fromTo(real, fromVars, toVars);
}

/**
 * WORDMARK RAKSASA → PILL BRAND
 *
 * Momen pembuka situs ini: "RADYT" setinggi hampir setengah layar mengerut
 * sambil terbang ke pojok kiri atas, lalu mendarat jadi pill kecil di sidebar.
 *
 * Arahnya SEBALIKNYA dari ghost biasa. Di ghost, elemen sidebar-lah yang nyata
 * dan diterbangkan; di sini yang terbang justru wordmark hero, karena ia harus
 * tetap tinggal di `.hero-back` (z-index 10) supaya lewat DI BELAKANG potret.
 * Elemen sidebar ada di z-index 60 — kalau ia yang diterbangkan, wordmark
 * raksasanya akan menutupi wajah subjek sepanjang hero.
 *
 * Serah-terimanya silang-pudar: di ujung lintasan kotak keduanya berimpit
 * persis, jadi wordmark tinggal padam sementara pill menyala di bawahnya.
 * Yang diukur adalah `.brand-name`, bukan `.brand` — pill punya padding dan
 * simbol ®, dan yang harus berimpit adalah HURUF-nya.
 */
interface WordmarkMorph {
  inner: HTMLElement;
  from: Rect;
  to: Rect;
}

/** Bagian akhir morph yang dipakai untuk silang-pudar, dalam satuan viewport. */
const HANDOVER_VH = 0.1;

function measureWordmark(): WordmarkMorph | null {
  const inner = $<HTMLElement>('[data-wordmark-inner]');
  const target = $<HTMLElement>('[data-brand-name]');
  if (!inner || !target) return null;

  return { inner, from: toRect(inner), to: toRect(target) };
}

function buildWordmarkMorph(m: WordmarkMorph, trigger: Element): void {
  if (m.from.width === 0 || m.to.width === 0) return;

  gsap.fromTo(
    m.inner,
    { x: 0, y: 0, scale: 1, transformOrigin: 'top left', force3D: false },
    {
      x: m.to.left - m.from.left,
      y: m.to.top - m.from.top,
      // Rasio LEBAR, bukan tinggi: dua kotak ini teks dengan font dan
      // line-height yang sama, jadi menyamakan lebarnya otomatis menyamakan
      // tingginya — dan lebar adalah satu-satunya ukuran yang bebas dari
      // selisih letter-spacing di antara keduanya.
      scale: m.to.width / m.from.width,
      ease: 'power1.inOut',
      force3D: false,
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: () => `+=${window.innerHeight * MORPH_VH}`,
        scrub: 1,
        invalidateOnRefresh: false,
      },
    },
  );

  gsap.to(m.inner, {
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: () => `${window.innerHeight * (MORPH_VH - HANDOVER_VH)} top`,
      end: () => `+=${window.innerHeight * HANDOVER_VH}`,
      scrub: 1,
    },
  });
}

/**
 * Elemen sidebar yang memang tidak muncul di hero: alih-alih terbang, mereka
 * muncul perlahan di paruh kedua morph sehingga sidebar terasa "merakit diri".
 *
 * Jendelanya sengaja tumpang tindih dengan akhir morph (84vh–148vh dari puncak
 * hero, sementara morph selesai di 120vh): di referensi perakitan sidebar sudah
 * mulai sebelum kartu terakhir mendarat, dan justru itu yang bikin transisinya
 * tidak terasa seperti dua tahap terpisah.
 */
function buildFades(trigger: Element): void {
  // Latar dan ikon pill navigasi ikut kelompok ini: di hero link tampil sebagai
  // teks telanjang tanpa ikon, keduanya baru muncul saat mendarat. Latarnya
  // lapisan tersendiri (bukan background-color elemen link) supaya theme
  // switcher tetap bisa mengubah warnanya — inline style dari GSAP akan
  // mengunci warna itu.
  const targets = [...$$('[data-ghost-fade]'), ...$$('.nav-link-bg'), ...$$('.nav-link-icon')];
  if (targets.length === 0) return;

  gsap.fromTo(
    targets,
    { opacity: 0, scale: 0.5, transformOrigin: 'center' },
    {
      opacity: 1,
      scale: 1,
      ease: 'power1.out',
      stagger: 0.04,
      scrollTrigger: {
        trigger,
        start: () => `${window.innerHeight * 0.84} top`,
        end: () => `+=${window.innerHeight * 0.64}`,
        scrub: 1,
      },
    },
  );
}

/**
 * Selama masih berukuran hero, kartu statistik melayang di atas potret — jadi
 * warnanya kaca taupe dengan teks putih, bukan beige solid seperti di rail.
 *
 * Dikerjakan lewat toggle kelas, bukan tween warna. Tween akan menulis
 * `background-color` inline dan mengunci kartunya selamanya di warna terang —
 * theme switcher tidak akan pernah bisa membalikkannya lagi saat sidebar
 * melintasi section gelap.
 */
function buildHeroTone(trigger: Element, sidebar: Element): void {
  sidebar.classList.add('is-hero-tone');

  ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: () => `+=${window.innerHeight * 0.66}`,
    onLeave: () => sidebar.classList.remove('is-hero-tone'),
    onEnterBack: () => sidebar.classList.add('is-hero-tone'),
  });
}

const GHOSTED =
  '[data-ghost], [data-ghost-fade], [data-wordmark-inner], .nav-link, .nav-link-bg, .nav-link-icon';

export const ghostModule: AnimationModule = {
  name: 'ghost',
  desktopOnly: true,
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const trigger = $('[data-hero]');
    if (!trigger || !isDesktop()) return;

    // Ghost hanya bisa diukur selama lapisan sticky hero masih menempel di
    // atas viewport. Kalau halaman sudah di-scroll melewatinya (mis. resize di
    // tengah halaman), morph-nya toh sudah selesai — biarkan apa adanya.
    const layer = $('.hero-back');
    if (layer && layer.getBoundingClientRect().top < -1) return;

    // Fase 1 — semua pengukuran dulu, tanpa satu pun mutasi di antaranya.
    // Wordmark ikut diukur di sini, dan modul ini memang harus jalan sebelum
    // `intro`: intro menerbangkan wordmark masuk dari luar layar, dan rect
    // yang terukur setelah itu bukan lagi posisi istirahatnya.
    const measurements = measurePairs();
    const wordmark = measureWordmark();
    // Fase 2 — baru menulis.
    measurements.forEach((m) => buildTween(m, trigger));
    if (wordmark) buildWordmarkMorph(wordmark, trigger);
    buildFades(trigger);

    const sidebar = $('[data-sidebar]');
    if (sidebar) buildHeroTone(trigger, sidebar);
  },

  destroy() {
    ScrollTrigger.getAll().forEach((instance) => {
      const trigger = instance.vars.trigger;
      if (trigger instanceof Element && trigger.matches('[data-hero]')) instance.kill();
    });
    $$(GHOSTED).forEach((el) => gsap.set(el, { clearProps: 'all' }));
    $('[data-sidebar]')?.classList.remove('is-hero-tone');
  },
};
