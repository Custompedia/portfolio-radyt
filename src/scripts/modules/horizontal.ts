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
    section.style.height = `${window.innerHeight + overflow}px`;

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
