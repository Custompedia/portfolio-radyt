import { gsap, ScrollTrigger, EASE_OUT } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';
import { getWorkTween } from './horizontal';

/**
 * KARTU PROYEK — bidang fokus, bukan ban berjalan.
 *
 * Sebelumnya section ini digerakkan satu tween `x: -overflow, ease: 'none'` dan
 * tidak ada apa-apa lagi selama 5.5 layar: kesembilan kartu meluncur sebagai
 * satu balok kaku, masuk sekali dengan `expo.out`, lalu diam. Rata, tanpa
 * kedalaman — padahal ini permukaan terbesar di halaman.
 *
 * Sekarang tiap kartu punya TIGA lapis gerak, dan ketiganya menumpang scroll
 * yang sudah ada (tidak ada pemicu scroll baru yang mahal):
 *
 *   1. BIDANG FOKUS  — jarak kartu ke tengah layar menggerakkan `scale` 0.9→1
 *      dan `brightness` 0.45→1. Yang di tengah tajam, tetangganya mundur ke
 *      dalam gelap. Ini yang mengubahnya jadi sinema.
 *   2. PARALLAX POSTER — gambar bergeser ±8% di dalam bingkainya (lihat
 *      `.work-poster` di sections.css). Kartu dan isinya tidak lagi bergerak
 *      dengan kecepatan yang sama, dan justru selisih kecepatan itulah yang
 *      dibaca mata sebagai kedalaman.
 *   3. ISI KARTU — judul dan tag naik saat kartunya mendekat tengah, bukan ikut
 *      terbang di pintu masuk.
 *
 * PEMBAGIAN PROPERTI ITU WAJIB DIJAGA: masuk memegang `opacity`/`y`, fokus
 * memegang `scale`/`filter`, parallax memegang `xPercent` poster. Dulu tween
 * masuk ikut menulis `scale` (0.6→1) — kalau itu dipertahankan, ia dan bidang
 * fokus akan berebut properti yang sama pada kartu yang sama.
 *
 * DUA PENGGERAK, SATU RESEP:
 *   desktop — track digeser GSAP, jadi ScrollTrigger butuh `containerAnimation`
 *             untuk bisa membaca posisi elemen yang bergerak menyamping;
 *   mobile  — track adalah scroller native (`overflow-x: auto`), jadi cukup
 *             `scroller` + `horizontal: true`. Sebelum ini modulnya
 *             `desktopOnly` dan di ponsel kesembilan kartu benar-benar diam.
 */

/** Masuk: HANYA opacity dan y. Lihat catatan pembagian properti di atas. */
const FROM = { y: '8%', opacity: 0 };
const TO = { y: '0%', opacity: 1, duration: 0.9, ease: EASE_OUT } as const;

const FOCUS_DIM = { scale: 0.9, filter: 'brightness(0.45)' };
const FOCUS_SHARP = { scale: 1, filter: 'brightness(1)' };

const cleanups: Array<() => void> = [];
const triggers: ScrollTrigger[] = [];
const tweens: Array<gsap.core.Animation> = [];

/**
 * Sumber video baru dipasang saat kartunya mendekat. Sembilan video dengan
 * `src` di markup akan diminta browser sekaligus begitu halaman dibuka.
 */
function primeVideo(card: HTMLElement): void {
  const video = card.querySelector<HTMLVideoElement>('.work-bg');
  if (!video || video.dataset.primed) return;
  video.dataset.primed = '1';

  const webm = video.dataset.webm;
  const mp4 = video.dataset.src;

  if (webm && video.canPlayType('video/webm')) video.src = webm;
  else if (mp4) video.src = mp4;
  else return;

  video.load();
  void video.play().catch(() => {
    /* autoplay ditolak — poster tetap tampil, tidak ada yang rusak */
  });
}

/**
 * Konfigurasi ScrollTrigger yang membaca posisi HORIZONTAL kartu, apa pun yang
 * menggerakkan track-nya. Satu-satunya beda antara desktop dan mobile ada di
 * sini; seluruh koreografi di bawah tidak perlu tahu mana yang sedang dipakai.
 */
type Horizontal = { containerAnimation?: gsap.core.Tween; scroller?: HTMLElement; horizontal?: boolean };

function horizontalVars(card: HTMLElement, driver: Horizontal): ScrollTrigger.Vars {
  return {
    trigger: card,
    start: 'left right',
    end: 'right left',
    scrub: 0.6,
    ...driver,
  };
}

export const workCardsModule: AnimationModule = {
  name: 'work-cards',
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const cards = $$<HTMLElement>('[data-work-card]');
    if (cards.length === 0) return;

    const desktop = isDesktop();
    const wrap = $<HTMLElement>('.work-track-wrap');
    // Di mobile track-nya digulung sendiri oleh jari; tanpa scroller ini
    // ScrollTrigger akan mengukur terhadap window dan mengira semua kartu
    // berada di tempat yang sama.
    const driver: Horizontal = desktop
      ? { containerAnimation: getWorkTween() ?? undefined }
      : wrap
        ? { scroller: wrap, horizontal: true }
        : {};
    if (!desktop && !wrap) return;

    // --- 1. Masuk: hanya kartu yang sudah terlihat saat section tiba ---------
    // Yang di luar layar tidak butuh tween masuk sama sekali: bidang fokus di
    // bawah sudah membawanya dari redup-mengecil ke tajam-penuh saat ia
    // menyeberang. Itu SEKALIGUS pintu masuknya.
    const viewportWidth = window.innerWidth;
    const visible = cards.filter((card) => card.getBoundingClientRect().left < viewportWidth);

    if (visible.length > 0) {
      const tween = gsap.fromTo(visible, FROM, {
        ...TO,
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-work]', start: 'top 80%', once: true },
      });
      tweens.push(tween);
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    for (const card of cards) {
      // --- 2. Bidang fokus --------------------------------------------------
      // Dua fase berdurasi sama: puncaknya jatuh tepat di tengah lintasan, yaitu
      // saat kartu berada di tengah layar. `ease: 'none'` di kedua fase supaya
      // ketajamannya mengikuti jari, bukan mendahuluinya.
      const focus = gsap.timeline({ scrollTrigger: horizontalVars(card, driver) });
      focus
        .fromTo(card, { ...FOCUS_DIM }, { ...FOCUS_SHARP, ease: 'none', duration: 0.5 })
        .to(card, { ...FOCUS_DIM, ease: 'none', duration: 0.5 });
      tweens.push(focus);
      if (focus.scrollTrigger) triggers.push(focus.scrollTrigger);

      // --- 3. Parallax poster ----------------------------------------------
      const poster = card.querySelector<HTMLElement>('.work-poster, .work-bg');
      if (poster) {
        const drift = gsap.fromTo(
          poster,
          { xPercent: 8 },
          { xPercent: -8, ease: 'none', scrollTrigger: horizontalVars(card, driver) },
        );
        tweens.push(drift);
        if (drift.scrollTrigger) triggers.push(drift.scrollTrigger);
      }

      // --- 4. Isi kartu menyusul -------------------------------------------
      // Berhenti di tengah lintasan (`duration: 0.5` dari total 1) supaya teks
      // sudah tegak saat kartunya paling tajam, lalu tidak bergerak lagi —
      // teks yang terus melayang selama kartunya lewat justru sulit dibaca.
      const content = card.querySelector<HTMLElement>('.work-card-content');
      if (content) {
        const rise = gsap.fromTo(
          content,
          { y: 26, autoAlpha: 0.55 },
          { y: 0, autoAlpha: 1, ease: 'none', duration: 0.5, scrollTrigger: horizontalVars(card, driver) },
        );
        tweens.push(rise);
        if (rise.scrollTrigger) triggers.push(rise.scrollTrigger);
      }

      // Pemicu video ditulis lepas, bukan menyalin `horizontalVars`: ia butuh
      // `once` dan TIDAK boleh punya `scrub`/`end` — menyalin lalu menimpanya
      // dengan `undefined` tidak sama dengan tidak pernah menyetelnya.
      const primer = ScrollTrigger.create({
        trigger: card,
        start: 'left right',
        once: true,
        ...driver,
        onEnter: () => primeVideo(card),
      });
      triggers.push(primer);
    }

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    for (const card of cards) {
      const glow = card.querySelector<HTMLElement>('.work-card-glow');
      if (!glow) continue;

      const glowX = gsap.quickTo(glow, 'xPercent', { duration: 0.8, ease: EASE_OUT });
      const glowY = gsap.quickTo(glow, 'yPercent', { duration: 0.8, ease: EASE_OUT });

      const onMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        glowX(((event.clientX - rect.left) / rect.width - 0.5) * 26);
        glowY(((event.clientY - rect.top) / rect.height - 0.5) * 18);
      };
      const onLeave = () => {
        glowX(0);
        glowY(0);
      };

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
      });
    }
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
    while (triggers.length) triggers.pop()?.kill();
    while (tweens.length) tweens.pop()?.kill();
    $$('[data-work-card]').forEach((card) => gsap.set(card, { clearProps: 'transform,opacity,filter' }));
    $$('.work-poster, .work-bg').forEach((el) => gsap.set(el, { clearProps: 'transform' }));
    $$('.work-card-content').forEach((el) => gsap.set(el, { clearProps: 'transform,opacity,visibility' }));
  },
};
