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
const MAX_ROTATION = 30;
const MAX_DRIFT = 54;

const cleanups: Array<() => void> = [];

export const imageTrailModule: AnimationModule = {
  name: 'image-trail',
  desktopOnly: true,
  skipOnReducedMotion: true,

  init() {
    const area = $<HTMLElement>('[data-trail-area]');
    const layer = $<HTMLElement>('[data-trail-layer]');
    const ripple = $<HTMLElement>('[data-trail-ripple]');
    const tiles = $$<HTMLElement>('[data-trail-tile]');
    if (!area || !layer || !ripple || tiles.length === 0) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    gsap.set(tiles, { autoAlpha: 0, scale: 0.6 });
    gsap.set(ripple, { autoAlpha: 0, scale: 0.2 });

    let index = 0;
    let lastX = 0;
    let lastY = 0;
    let primed = false;

    const drop = (x: number, y: number, deltaX: number, deltaY: number, rect: DOMRect) => {
      const tile = tiles[index % tiles.length]!;
      index += 1;

      const length = Math.hypot(deltaX, deltaY);
      const drift = Math.min(length, MAX_DRIFT);
      const directionX = deltaX / length;
      const directionY = deltaY / length;
      const rotation = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, deltaX * 0.22));
      const offset = (index % 3 - 1) * 24;
      const finalX = x + directionX * drift + offset;
      const finalY = y + directionY * drift - 18;
      const travel = Math.max(rect.width, rect.height) * 0.7;
      const label = tile.querySelector<HTMLElement>('.trail-tile-label');

      gsap.killTweensOf([tile, label, ripple]);
      gsap.set(tile, {
        autoAlpha: 0,
        x: finalX - directionX * travel,
        y: finalY - directionY * travel,
        xPercent: -50,
        yPercent: -50,
        rotationX: -directionY * 28,
        rotationY: directionX * 28,
        rotationZ: rotation - directionX * 18,
        scale: 0.58,
      });
      gsap.set(label, { autoAlpha: 0, x: -16, y: 14 });

      gsap
        .timeline()
        .to(tile, {
          autoAlpha: 1,
          x: finalX,
          y: finalY,
          rotationX: directionY * 8,
          rotationY: -directionX * 10,
          rotationZ: rotation,
          scale: 1,
          duration: 0.58,
          ease: 'expo.out',
        })
        .to(label, { autoAlpha: 1, x: 0, y: 0, duration: 0.32, ease: 'power3.out' }, '-=0.28')
        .to(
          tile,
          {
            autoAlpha: 0,
            x: finalX + directionX * travel,
            y: finalY + directionY * travel,
            rotationX: directionY * 38,
            rotationY: -directionX * 42,
            rotationZ: rotation + directionX * 24,
            scale: 0.72,
            duration: 0.7,
            ease: 'power4.in',
          },
          '+=0.62',
        );

      gsap.fromTo(
        ripple,
        { autoAlpha: 0.8, scale: 0.16, x: finalX, y: finalY, xPercent: -50, yPercent: -50 },
        { autoAlpha: 0, scale: 1.8, duration: 0.62, ease: 'power2.out' },
      );
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

      const deltaX = x - lastX;
      const deltaY = y - lastY;
      if (Math.hypot(deltaX, deltaY) < MIN_DISTANCE) return;
      lastX = x;
      lastY = y;
      drop(x, y, deltaX, deltaY, rect);
    };

    const onLeave = () => {
      primed = false;
      gsap.to([tiles, ripple], { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power2.in' });
    };

    area.addEventListener('pointermove', onMove);
    area.addEventListener('pointerleave', onLeave);

    cleanups.push(() => {
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf([...tiles, ripple]);
      gsap.set([...tiles, ripple], { clearProps: 'all' });
    });
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
  },
};
