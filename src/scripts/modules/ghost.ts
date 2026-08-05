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

type GhostType = 'box' | 'background' | 'text' | 'link' | 'size';

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
 * Pill navigasi hero dibesarkan maksimal segini. Tanpa batas, baris yang
 * di-justify penuh membuat teksnya jauh lebih besar dari referensi; sisa ruang
 * dibagi rata jadi jarak antar pill.
 */
const ROW_MAX_SCALE = 1.75;

const toRect = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

/**
 * Baris navigasi tidak ditulis manual per-link: satu ghost menandai strip-nya,
 * lalu link dibagi rata sepanjang strip itu. Skala dihitung supaya baris pas
 * memenuhi lebar — persis seperti teks yang di-justify.
 */
function measureNavRow(): Measurement[] {
  const row = $('[data-ghost-row="menu"]');
  const links = $$('.nav-link');
  if (!row || links.length === 0) return [];

  const rowRect = toRect(row);
  const realRects = links.map(toRect);
  const sumWidth = realRects.reduce((total, r) => total + r.width, 0);
  if (sumWidth === 0) return [];

  const scale = Math.min(ROW_MAX_SCALE, rowRect.width / sumWidth);
  const gap = (rowRect.width - sumWidth * scale) / Math.max(1, links.length - 1);

  let cursor = rowRect.left;
  return links.map((link, i) => {
    const real = realRects[i]!;
    const width = real.width * scale;
    const height = real.height * scale;
    const measurement: Measurement = {
      real: link,
      type: 'link',
      from: {
        left: cursor,
        top: rowRect.top + (rowRect.height - height) / 2,
        width,
        height,
      },
      to: real,
    };
    cursor += width + gap;
    return measurement;
  });
}

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

  return [...measurements, ...measureNavRow()];
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
      end: () => `+=${window.innerHeight}`,
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

    const endCorner = `${parseFloat(getComputedStyle(real).borderTopLeftRadius) || 22}px`;
    Object.assign(toVars, {
      borderTopLeftRadius: `${endCorner} ${endCorner}`,
      borderTopRightRadius: `${endCorner} ${endCorner}`,
      borderBottomLeftRadius: `${endCorner} ${endCorner}`,
      borderBottomRightRadius: `${endCorner} ${endCorner}`,
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
  } else if (type === 'link') {
    fromVars.scale = from.width / to.width;
  } else if (type === 'text') {
    // Teks di-scale dari tinggi baris supaya proporsi hurufnya terjaga.
    fromVars.scale = from.height / to.height;
  } else {
    fromVars.scale = from.width / to.width;
  }

  gsap.fromTo(real, fromVars, toVars);
}

/**
 * Elemen sidebar yang memang tidak muncul di hero: alih-alih terbang, mereka
 * muncul perlahan di paruh kedua morph sehingga sidebar terasa "merakit diri".
 */
function buildFades(trigger: Element): void {
  // Latar pill navigasi ikut kelompok ini: di hero link tampil sebagai teks
  // telanjang, pill-nya baru muncul saat mendarat. Latarnya lapisan tersendiri
  // (bukan background-color elemen link) supaya theme switcher tetap bisa
  // mengubah warnanya — inline style dari GSAP akan mengunci warna itu.
  const targets = [...$$('[data-ghost-fade]'), ...$$('.nav-link-bg')];
  if (targets.length === 0) return;

  gsap.fromTo(
    targets,
    { opacity: 0, y: 14 },
    {
      opacity: 1,
      y: 0,
      ease: 'power1.out',
      stagger: 0.04,
      scrollTrigger: {
        trigger,
        start: () => `${window.innerHeight * 0.35} top`,
        end: () => `+=${window.innerHeight * 0.65}`,
        scrub: 1,
      },
    },
  );
}

const GHOSTED = '[data-ghost], [data-ghost-fade], .nav-link';

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
    const measurements = measurePairs();
    // Fase 2 — baru menulis.
    measurements.forEach((m) => buildTween(m, trigger));
    buildFades(trigger);
  },

  destroy() {
    ScrollTrigger.getAll().forEach((instance) => {
      const trigger = instance.vars.trigger;
      if (trigger instanceof Element && trigger.matches('[data-hero]')) instance.kill();
    });
    $$(GHOSTED).forEach((el) => gsap.set(el, { clearProps: 'all' }));
  },
};
