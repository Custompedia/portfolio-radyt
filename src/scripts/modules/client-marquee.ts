import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

let frame = 0;

/**
 * Menjaga logo marquee tidak pernah terlihat dalam keadaan terpotong.
 * Opacity turun ketika logo masih SEPENUHNYA berada di dalam viewport;
 * begitu salah satu tepinya melewati batas, opacity sudah nol.
 */
export const clientMarqueeModule: AnimationModule = {
  name: 'client-marquee',

  init() {
    const viewport = $<HTMLElement>('.marquee');
    const items = $$<HTMLElement>('.marquee-item', viewport ?? document);
    if (!viewport || items.length === 0) return;

    const update = () => {
      const bounds = viewport.getBoundingClientRect();
      const fadeDistance = Math.min(34, bounds.width * 0.1);

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const fullyInside = rect.left >= bounds.left && rect.right <= bounds.right;

        if (!fullyInside) {
          item.style.opacity = '0';
          continue;
        }

        const edgeDistance = Math.min(rect.left - bounds.left, bounds.right - rect.right);
        const visibility = Math.max(0, Math.min(1, edgeDistance / fadeDistance));
        item.style.opacity = String(visibility * 0.82);
      }

      frame = requestAnimationFrame(update);
    };

    update();
  },

  destroy() {
    cancelAnimationFrame(frame);
    frame = 0;
    $$<HTMLElement>('.marquee-item').forEach((item) => item.style.removeProperty('opacity'));
  },
};
