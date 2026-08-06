import Swiper from 'swiper';
import 'swiper/css';
import { Mousewheel } from 'swiper/modules';
import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

/**
 * Slider testimoni. Pagination-nya bukan titik-titik bawaan Swiper melainkan
 * deretan ruas: ruas slide aktif memanjang dan menguning, sisanya tetap pendek
 * dan pudar.
 */

let swiper: Swiper | null = null;
const cleanups: Array<() => void> = [];

function paint(index: number): void {
  $$('[data-testimonial-progress] .testimonial-progress-bar').forEach((bar, i) => {
    bar.classList.toggle('is-active', i === index);
  });
}

export const testimonialSliderModule: AnimationModule = {
  name: 'testimonial-slider',
  rebuildOnResize: false,

  init() {
    const el = $<HTMLElement>('[data-testimonial-swiper]');
    if (!el) return;

    swiper = new Swiper(el, {
      modules: [Mousewheel],
      slidesPerView: 'auto',
      spaceBetween: 18,
      // `grabCursor` dimatikan: kursor bawaannya ikut tampil di samping cakram
      // kuning dan jadi dua kursor sekaligus. CSS sudah memasang `cursor:none`.
      grabCursor: false,
      speed: 620,
      mousewheel: { forceToAxis: true },
      breakpoints: {
        768: { spaceBetween: 24 },
      },
      on: {
        slideChange: (instance) => paint(instance.realIndex),
      },
    });

    paint(0);

    // Cakram penunjuk menggantikan kursor di dalam carousel dan hanya muncul
    // saat berada di atasnya — kalau selalu tampil ia cuma jadi hiasan yang
    // diabaikan. Di perangkat sentuh tidak ada kursor untuk digantikan.
    const hint = $<HTMLElement>('[data-testimonial-drag]');
    if (!hint) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const quickX = gsap.quickTo(hint, 'x', { duration: 0.35, ease: 'power3' });
    const quickY = gsap.quickTo(hint, 'y', { duration: 0.35, ease: 'power3' });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      quickX(event.clientX - rect.left);
      quickY(event.clientY - rect.top);
    };
    const onEnter = () => gsap.to(hint, { opacity: 1, scale: 1, duration: 0.25 });
    const onLeave = () => {
      hint.classList.remove('is-pressed');
      gsap.to(hint, { opacity: 0, scale: 0.6, duration: 0.25 });
    };
    const onDown = () => hint.classList.add('is-pressed');
    const onUp = () => hint.classList.remove('is-pressed');

    gsap.set(hint, { opacity: 0, scale: 0.6, xPercent: -50, yPercent: -50 });

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onDown);
    // Di window, bukan di elemen: melepas tombol di luar carousel tetap harus
    // mengembalikan labelnya.
    window.addEventListener('pointerup', onUp);
    cleanups.push(() => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    });
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
    swiper?.destroy(true, true);
    swiper = null;
  },
};
