import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

/**
 * JEJAK KURSOR di wordmark penutup.
 *
 * Kartu dijatuhkan bergiliran mengikuti kursor, tiap kali kursor sudah bergerak
 * cukup jauh dari kartu terakhir. Ambang jarak itu yang penting: tanpa ia,
 * gerakan mouse yang cepat menjatuhkan puluhan kartu per detik dan efeknya jadi
 * kabur, bukan jejak.
 *
 * Kartunya dipakai ulang secara bergilir — tidak ada elemen yang dibuat atau
 * dibuang saat kursor bergerak.
 */

const MIN_DISTANCE = 90;
const FADE_DELAY = 550;
const MAX_ROTATION = 30;

const cleanups: Array<() => void> = [];

export const imageTrailModule: AnimationModule = {
  name: 'image-trail',
  desktopOnly: true,
  skipOnReducedMotion: true,

  init() {
    const area = $<HTMLElement>('[data-trail-area]');
    const layer = $<HTMLElement>('[data-trail-layer]');
    const tiles = $$<HTMLElement>('[data-trail-tile]');
    if (!area || !layer || tiles.length === 0) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    gsap.set(tiles, { autoAlpha: 0, scale: 0.6 });

    let index = 0;
    let lastX = 0;
    let lastY = 0;
    let primed = false;
    const timers: number[] = [];

    const drop = (x: number, y: number) => {
      const tile = tiles[index % tiles.length]!;
      index += 1;

      // Rotasi diambil dari indeks, bukan acak: Math.random() membuat hasilnya
      // berbeda tiap render dan mustahil dibandingkan saat menyetel.
      const rotation = ((index * 37) % (MAX_ROTATION * 2)) - MAX_ROTATION;

      gsap.killTweensOf(tile);
      gsap.set(tile, { x, y, rotate: rotation, xPercent: -50, yPercent: -50 });
      gsap.fromTo(
        tile,
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'expo.out' },
      );

      const timer = window.setTimeout(() => {
        gsap.to(tile, { autoAlpha: 0, scale: 0.85, duration: 0.5, ease: 'power2.in' });
      }, FADE_DELAY);
      timers.push(timer);
    };

    const onMove = (event: PointerEvent) => {
      const rect = area.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (!primed) {
        primed = true;
        lastX = x;
        lastY = y;
        return;
      }

      if (Math.hypot(x - lastX, y - lastY) < MIN_DISTANCE) return;
      lastX = x;
      lastY = y;
      drop(x, y);
    };

    const onLeave = () => {
      primed = false;
      gsap.to(tiles, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power2.in' });
    };

    area.addEventListener('pointermove', onMove);
    area.addEventListener('pointerleave', onLeave);

    cleanups.push(() => {
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerleave', onLeave);
      timers.forEach((timer) => window.clearTimeout(timer));
      gsap.set(tiles, { clearProps: 'all' });
    });
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
  },
};
