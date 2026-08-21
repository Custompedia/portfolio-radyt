import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from './utils';

let lenis: Lenis | null = null;

const ANCHOR_MIN_DURATION = 1.1;
const ANCHOR_MAX_DURATION = 5.8;
const ANCHOR_PX_PER_SECOND = 2200;
const anchorEase = (t: number): number => t * t * (3 - 2 * t);

/**
 * Lenis dijalankan dari ticker GSAP (bukan rAF sendiri) supaya scroll position,
 * tween, dan ScrollTrigger dievaluasi di frame yang sama. `lagSmoothing(0)`
 * wajib: tanpa itu GSAP "melompati" waktu setelah frame berat dan scrub terlihat
 * patah.
 */
export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) return null;

  // `syncTouch: false` eksplisit - touch dilepas ke momentum native; `touchMultiplier` dibuang karena hanya terbaca di jalur syncTouch.
  lenis = new Lenis({
    duration: 0.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // Lenis memegang posisi scroll-nya sendiri; `window.scrollTo` dari luar akan
  // dilawan balik di frame berikutnya. Handle-nya dibuka saat dev supaya
  // pemeriksaan lewat DevTools bisa memindahkan halaman lewat jalur yang benar.
  if (import.meta.env.DEV) {
    (window as unknown as { lenis: Lenis }).lenis = lenis;
  }

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Anchor link internal harus lewat Lenis, bukan scroll native. */
export function initAnchorLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      if (lenis) {
        const duration = Math.min(
          ANCHOR_MAX_DURATION,
          Math.max(ANCHOR_MIN_DURATION, Math.abs(target.getBoundingClientRect().top) / ANCHOR_PX_PER_SECOND),
        );
        lenis.scrollTo(target as HTMLElement, { offset: 0, duration, easing: anchorEase });
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    });
  });
}
