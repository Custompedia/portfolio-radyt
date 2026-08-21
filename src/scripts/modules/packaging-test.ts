import { gsap, EASE_OUT } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop, prefersReducedMotion } from '../core/utils';
import type { PediPose, PediSceneController } from './pedi-scene';

/** Panjang scroll yang dipakai timeline Pedi, dalam satuan viewport. */
const TIMELINE_VIEWPORTS = 3.2;

/**
 * Satu viewport tambahan di ujung pin: Pedi berhenti di zoom penuh sementara
 * The Work naik menimpanya. Lihat modules/stack.ts - angka ini harus sama
 * dengan `--stack-hold` yang menarik naik layer di atasnya.
 */
const STACK_HOLD_VIEWPORTS = 0;

let timeline: gsap.core.Timeline | null = null;
let compact: gsap.core.Timeline | null = null;
let compactReveal: gsap.core.Tween | null = null;
let pedi: PediSceneController | null = null;
let generation = 0;

const pose: PediPose = { turn: 0, focus: 0 };

/**
 * PEDI DI LAYAR ≤1100px - versi ringkas, bukan versi kecil.
 *
 * Sebelum ini seluruh koreografi berhenti di penjaga lebar, tapi `.glb`-nya
 * 813 KB tetap diunduh dengan `fetchpriority="high"` di setiap viewport. Jadi
 * ponsel membayar ongkos penuh sebuah scene 3D untuk mendapat SATU frame diam -
 * posisi terburuk dari dua pilihan yang ada.
 *
 * Versi ringkas ini membalik perhitungan itu tanpa menambah unduhan sedikit pun:
 * modelnya berputar tiga perempat lingkaran mengikuti scroll, dan kamera
 * menutup sedikit di ujungnya.
 *
 * TANPA PIN dan TANPA `--stack-hold`. Di lebar ini stack.ts sudah memegang pin
 * sendiri untuk section ini; menambah pin kedua akan menyisipkan spacer kedua
 * dan menggeser posisi dokumen semua section di bawahnya. Yang dipakai di sini
 * cuma scrub biasa sepanjang tinggi section yang memang sudah ada.
 *
 * `focus` berhenti di 0.55, bukan 1: pada lebar sempit `updateCamera` menarik
 * kamera sampai kotaknya melewati tepi kanvas, dan yang terlihat cuma potongan.
 */
function buildCompactScene(el: {
  section: HTMLElement;
  stage: HTMLElement;
  moments: HTMLElement[];
  orbits: HTMLElement | null;
  outro: HTMLElement;
  renderPedi: () => void;
}): void {
  gsap.set(el.stage, { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0, rotation: 0 });
  pose.turn = -Math.PI * 0.75;

  compact = gsap.timeline({
    onUpdate: el.renderPedi,
    scrollTrigger: {
      trigger: el.section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
    },
  });

  compact
    .to(pose, { turn: 0, duration: 0.7, ease: 'none' }, 0)
    .to(pose, { focus: 0.55, duration: 0.3, ease: 'none' }, 0.7);

  // Teks dan orbit tetap disingkap seperti elemen lain di halaman: sekali jalan
  // saat masuk layar, bukan di-scrub. Yang di-scrub cukup benda 3D-nya.
  //
  // Tween ini BERDIRI SENDIRI, tidak disisipkan ke `compact`: tween yang punya
  // ScrollTrigger sendiri tidak boleh jadi anak timeline yang juga di-scrub -
  // keduanya akan sama-sama mengatur waktunya dan hasilnya tidak menentu.
  const reveal = [...el.moments, el.outro, el.orbits].filter(Boolean) as HTMLElement[];
  if (reveal.length) {
    gsap.set(reveal, { autoAlpha: 0, y: 24 });
    compactReveal = gsap.to(reveal, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: EASE_OUT,
      scrollTrigger: { trigger: el.section, start: 'top 70%', once: true },
    });
  }
}

export const packagingTestModule: AnimationModule = {
  name: 'packaging-test',
  rebuildOnResize: true,

  init() {
    const section = $<HTMLElement>('[data-packaging-test]');
    const stage = $<HTMLElement>('[data-pedi-stage]');
    const canvas = $<HTMLCanvasElement>('[data-pedi-canvas]');
    const shadow = $<HTMLElement>('[data-pedi-shadow]');
    const outro = $<HTMLElement>('[data-packaging-outro]');
    if (!section || !stage || !canvas || !shadow || !outro) return;

    const run = ++generation;
    const intro = $$<HTMLElement>('[data-packaging-intro]', section);
    const moments = $$<HTMLElement>('.packaging-test-moment', section);
    const orbits = $<HTMLElement>('[data-pedi-orbits]', section);
    const renderPedi = () => pedi?.render(pose);
    let loading = false;

    const loadPedi = async (): Promise<void> => {
      if (loading || pedi) return;
      loading = true;
      try {
        const { createPediScene } = await import('./pedi-scene');
        const controller = await createPediScene(canvas, document.documentElement.classList.contains('performance-lite'));
        if (run !== generation) {
          controller.dispose();
          return;
        }
        pedi = controller;
        stage.dataset.state = 'ready';
        pedi.render(pose);
      } catch (error) {
        if (run !== generation) return;
        stage.dataset.state = 'error';
        console.error('[motion] Pedi gagal dimuat', error);
      }
    };

    void loadPedi();

    pose.turn = 0;
    pose.focus = 0;

    if (!isDesktop() || window.innerWidth <= 1100 || prefersReducedMotion()) {
      if (!prefersReducedMotion()) buildCompactScene({ section, stage, moments, orbits, outro, renderPedi });
      return;
    }

    pose.turn = -Math.PI * 1.5;
    gsap.set(intro, { autoAlpha: 1, y: 0 });
    gsap.set(moments, { autoAlpha: 0, y: 28 });
    if (moments[0]) gsap.set(moments[0], { autoAlpha: 1, y: 0 });
    gsap.set(orbits, { autoAlpha: 0, scale: 0.72, rotation: -8 });
    gsap.set(outro, { autoAlpha: 0, y: 28 });
    gsap.set(stage, { autoAlpha: 0, scale: 0.72, xPercent: -145, yPercent: 12, rotation: -7, transformOrigin: '50% 72%' });
    gsap.set(shadow, { scaleX: 0.22, opacity: 0.06, xPercent: -118 });

    timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onUpdate: renderPedi,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${(TIMELINE_VIEWPORTS + STACK_HOLD_VIEWPORTS) * 100}%`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        /**
         * Pin ini menyisipkan spacer ~5040px yang mendorong TURUN semua section
         * di bawahnya - terutama The Work, yang tingginya sendiri diatur dari
         * JS. Tanpa prioritas ini ScrollTrigger menyegarkan trigger Work lebih
         * dulu (modul horizontal init lebih awal), memakai posisi dokumen yang
         * belum memperhitungkan spacer, dan rentang geser horizontalnya jatuh
         * ~5040px terlalu tinggi: kartu selesai bergeser saat section-nya masih
         * di bawah layar, lalu diam mentok begitu user benar-benar sampai.
         * DIUKUR: start 11837 (salah) vs 16788 (posisi dokumen sebenarnya).
         */
        refreshPriority: 1,
      },
    });

    timeline
      .to(stage, { autoAlpha: 1, scale: 1, xPercent: 3, yPercent: 0, rotation: 0, duration: 0.82, ease: 'power4.out' }, 0.08)
      .to(shadow, { scaleX: 1, opacity: 0.62, xPercent: 0, duration: 0.64 }, 0.2)
      .to(orbits, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.72, ease: 'power3.out' }, 0.3)
      .to(pose, { turn: 0, duration: 0.92, ease: 'power2.inOut' }, 0.32)
      .to(moments[0], { autoAlpha: 1, y: 0, duration: 0.36 }, 0.58)
      .to(moments[1], { autoAlpha: 1, y: 0, duration: 0.36 }, 1.08)
      .to(moments[2], { autoAlpha: 1, y: 0, duration: 0.36 }, 1.54)
      .to([intro, moments], { autoAlpha: 0, y: -26, duration: 0.48, stagger: 0.03 }, 2.78)
      .to(outro, { autoAlpha: 1, y: 0, duration: 0.58 }, 3.08)
      .to(outro, { autoAlpha: 0, y: -22, duration: 0.36 }, 3.78)
      .to(orbits, { autoAlpha: 0, scale: 1.08, duration: 0.46 }, 3.78)
      .to(shadow, { scaleX: 0.72, opacity: 0, duration: 0.4 }, 3.82)
      .to(stage, { xPercent: 0, duration: 0.52, ease: 'power2.inOut' }, 3.82)
      .to(pose, { focus: 1, duration: 1.25, ease: 'power2.inOut' }, 4.18)
      .to(pose, { focus: 1, duration: 0.62, ease: 'none' }, 5.43);

    /**
     * Scrub memetakan SELURUH rentang pin ke SELURUH durasi timeline, jadi
     * memperpanjang `end` saja tidak menambah jeda - ia cuma memperlambat semua
     * geraknya. Supaya viewport tambahan itu benar-benar jadi diam di zoom
     * penuh, ekor timeline diberi tween tanpa perubahan yang panjangnya
     * sebanding: durasi_sekarang × (1 viewport ÷ 5.6 viewport).
     */
    if (STACK_HOLD_VIEWPORTS > 0) {
      timeline.to(pose, {
        focus: 1,
        duration: timeline.duration() * (STACK_HOLD_VIEWPORTS / TIMELINE_VIEWPORTS),
        ease: 'none',
      });
    }
  },

  destroy() {
    generation += 1;
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
    compact?.scrollTrigger?.kill();
    compact?.kill();
    compact = null;
    compactReveal?.scrollTrigger?.kill();
    compactReveal?.kill();
    compactReveal = null;
    pose.turn = 0;
    pose.focus = 0;
    pedi?.dispose();
    pedi = null;
    const stage = $<HTMLElement>('[data-pedi-stage]');
    if (stage) stage.dataset.state = 'loading';
    $$<HTMLElement>('[data-packaging-test] [data-packaging-intro], [data-packaging-test] .packaging-test-moment, [data-packaging-test] [data-packaging-outro], [data-packaging-test] [data-pedi-orbits], [data-packaging-test] [data-pedi-stage], [data-packaging-test] [data-pedi-shadow]').forEach((element) => {
      gsap.set(element, { clearProps: 'all' });
    });
  },
};
