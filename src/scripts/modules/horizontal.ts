import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $ } from '../core/utils';

/**
 * Galeri proyek yang bergerak menyamping. Tinggi section-nya di-set dari JS =
 * satu viewport + sisa track yang harus digeser, jadi 1px scroll vertikal
 * selalu berarti 1px geseran horizontal — tidak pernah terasa terlalu cepat
 * atau terlalu lambat berapa pun jumlah kartunya.
 */

let tween: gsap.core.Tween | null = null;

/**
 * Dipakai work-cards untuk `containerAnimation` — satu-satunya cara benar
 * memicu ScrollTrigger pada elemen yang bergerak menyamping. Tanpa ini,
 * ScrollTrigger memakai posisi vertikal kartu (yang tidak pernah berubah) dan
 * kesembilan kartu terpicu bersamaan di awal.
 */
export const getWorkTween = (): gsap.core.Tween | null => tween;

export const horizontalModule: AnimationModule = {
  name: 'horizontal',
  desktopOnly: true,
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const section = $('[data-work]');
    const track = $('[data-work-track]');
    const wrap = track?.parentElement;
    if (!section || !track || !wrap) return;

    gsap.set(track, { clearProps: 'transform' });

    const overflow = Math.max(0, track.scrollWidth - wrap.clientWidth);

    /**
     * Satu viewport ekstra di ujung: track sudah berhenti bergeser, tapi
     * `.work-sticky` tetap menempel di atas layar supaya footer sempat naik
     * menimpanya. Ini penahan yang dimaksud modules/stack.ts.
     *
     * Ditulis sebagai `calc()` dengan variabelnya, bukan piksel hasil hitungan:
     * `--stack-hold` disegarkan tiap kali tinggi viewport berubah, dan begitu
     * ia berubah penahan di sini ikut menyesuaikan tanpa modul ini perlu
     * dibangun ulang — persis sama panjang dengan margin negatif footer.
     */
    section.style.height = `calc(${window.innerHeight + overflow}px + var(--stack-hold, 100vh))`;

    if (overflow === 0) return;

    tween = gsap.to(track, {
      x: -overflow,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${overflow}`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  },

  destroy() {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;

    const section = $('[data-work]');
    const track = $('[data-work-track]');
    if (section) section.style.removeProperty('height');
    if (track) gsap.set(track, { clearProps: 'transform' });
  },
};
