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
  /** Hanya terisi untuk elemen ber-`data-ghost-alt` — lihat measureAlt(). */
  alt?: AltLayout;
}

/**
 * Susunan KEDUA sebuah elemen, diukur sekali di fase 1.
 *
 * `box`  kotak elemen dalam susunan alternatif, relatif terhadap kotak aslinya
 * `kids` selisih posisi tiap anak: susunan asli → susunan alternatif
 */
interface AltLayout {
  box: { dx: number; dy: number; width: number };
  kids: { el: HTMLElement; dx: number; dy: number }[];
}

/**
 * Sebagian elemen tampil beda susunan di hero dan di rail — kartu "950+"
 * berdampingan saat besar, bertumpuk saat mendarat. `flex-direction` tidak bisa
 * ditween, jadi susunan hero-nya tidak pernah benar-benar dipasang: kelas yang
 * disebut `data-ghost-alt` ditempel SATU FRAME hanya untuk MENGUKUR, lalu
 * dilepas lagi. Selisih yang didapat dipakai menggeser tiap anak dengan
 * transform — dan transform bisa ditween, jadi angkanya betul-betul meluncur ke
 * tempatnya alih-alih bertukar tampil.
 */
function measureAlt(real: HTMLElement, className: string): AltLayout | null {
  const kids = [...real.children].filter((n): n is HTMLElement => n instanceof HTMLElement);
  if (kids.length === 0) return null;

  const baseBox = toRect(real);
  const baseKids = kids.map(toRect);

  real.classList.add(className);
  const altBox = toRect(real);
  const altKids = kids.map(toRect);
  real.classList.remove(className);

  return {
    box: {
      dx: altBox.left - baseBox.left,
      dy: altBox.top - baseBox.top,
      width: altBox.width,
    },
    kids: kids.map((el, i) => ({
      el,
      dx: altKids[i]!.left - baseKids[i]!.left,
      dy: altKids[i]!.top - baseKids[i]!.top,
    })),
  };
}

/** Morph selesai sebelum About memasuki viewport. */
const MORPH_VH = 0.72;

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

    const type = (real.dataset.ghostType as GhostType) ?? 'box';

    const altClass = real.dataset.ghostAlt;

    measurements.push({
      real,
      type,
      from: toRect(ghost),
      to: toRect(real),
      alt: altClass ? (measureAlt(real, altClass) ?? undefined) : undefined,
    });
  }

  return measurements;
}

function buildTween(m: Measurement, trigger: Element): void {
  const { real, type, from, to, alt } = m;
  if (to.width === 0 || to.height === 0) return;

  const scale = getSidebarScale();
  let x = (from.left - to.left) / scale;
  let y = (from.top - to.top) / scale;

  /**
   * Elemen bersusunan ganda menyimpang di DUA hal, keduanya dari satu sebab:
   * yang harus mendarat pas di kotak ghost bukan elemennya apa adanya, tapi
   * SUSUNAN ALTERNATIF-nya.
   *
   *   1. skalanya dihitung dari lebar susunan alternatif, bukan lebar elemen;
   *   2. x/y dikoreksi sebesar pergeseran susunan itu di dalam elemen.
   */
  const altScale = alt ? from.width / alt.box.width : 1;
  if (alt) {
    x -= (altScale * alt.box.dx) / scale;
    y -= (altScale * alt.box.dy) / scale;
  }

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
    // Radius saat berukuran hero = radius akhirnya sendiri, jadi sudutnya tidak
    // pernah berubah bentuk sepanjang morph — cuma dikoreksi supaya tetap
    // BULAT setelah di-scale tidak seragam. Sebelumnya dipatok 26px: pada
    // ukuran hero itu tiga kali lipat radius kartu traits di sebelahnya, dan
    // kedua kartu statistik terbaca jauh lebih tumpul daripada tetangganya.
    //
    // Diambil yang TERBESAR dari keempat sudut, bukan sudut kiri-atas. Dua
    // kartu statistik saling menempel di rail dan sisi yang bertemu sengaja
    // disiku jadi 0 (lihat components.css) — membaca satu sudut saja berarti
    // kartu kedua mendapat 0 dan tampil bersudut siku sepanjang hero, padahal
    // di hero keduanya berdiri terpisah dan harus bulat penuh.
    const end = getComputedStyle(real);
    const radiusOf = (value: string) => parseFloat(value) || 0;
    const heroRadius = Math.max(
      radiusOf(end.borderTopLeftRadius),
      radiusOf(end.borderTopRightRadius),
      radiusOf(end.borderBottomRightRadius),
      radiusOf(end.borderBottomLeftRadius),
    );
    const corner = `${heroRadius / sx}px ${heroRadius / sy}px`;

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
    fromVars.scale = alt ? altScale : from.width / to.width;
  }

  gsap.fromTo(real, fromVars, toVars);

  // Anak-anaknya digeser ke susunan alternatif lalu ditarik balik ke nol
  // sepanjang morph yang sama. Karena induknya ikut mengerut di jendela yang
  // sama, keduanya terbaca sebagai satu gerakan: angkanya meluncur naik
  // sementara labelnya turun ke bawahnya. Nilainya dibagi skala sidebar — ia
  // ditulis ke koordinat lokal, sedangkan yang diukur koordinat layar.
  if (!alt) return;

  for (const kid of alt.kids) {
    gsap.fromTo(
      kid.el,
      { x: kid.dx / scale, y: kid.dy / scale, force3D: false },
      {
        x: 0,
        y: 0,
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
  }
}

/**
 * WORDMARK RAKSASA → PILL BRAND
 *
 * Momen pembuka situs ini: "RADHYTA" setinggi hampir setengah layar mengerut
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
const HANDOVER_VH = 0.08;

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
    { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: 'top left', force3D: false },
    {
      x: m.to.left - m.from.left,
      y: m.to.top - m.from.top,
      scaleX: m.to.width / m.from.width,
      scaleY: m.to.height / m.from.height,
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
        start: () => `${window.innerHeight * 0.48} top`,
        end: () => `+=${window.innerHeight * 0.42}`,
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
    end: () => `+=${window.innerHeight * 0.52}`,
    onLeave: () => sidebar.classList.remove('is-hero-tone'),
    onEnterBack: () => sidebar.classList.add('is-hero-tone'),
  });
}

const GHOSTED =
  '[data-ghost], [data-ghost-fade], [data-wordmark-inner], .nav-link, .nav-link-bg, .nav-link-icon, [data-ghost-alt] > *';

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
