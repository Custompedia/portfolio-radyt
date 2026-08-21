import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

/**
 * Akordeon FAQ. Tingginya di-tween dari 0 ke `auto` (GSAP mengukurnya sendiri)
 * supaya tidak perlu menebak tinggi konten, dan `aria-expanded` tetap jadi
 * sumber kebenaran status - bukan kelas CSS.
 */

const cleanups: Array<() => void> = [];

function toggle(item: HTMLElement, open: boolean): void {
  const button = $('button', item);
  const panel = $('[data-accordion-panel]', item);
  if (!button || !panel) return;

  button.setAttribute('aria-expanded', String(open));
  item.classList.toggle('is-open', open);

  gsap.to(panel, {
    height: open ? 'auto' : 0,
    opacity: open ? 1 : 0,
    duration: 0.42,
    ease: 'power2.inOut',
  });
}

export const accordionModule: AnimationModule = {
  name: 'accordion',

  init() {
    const items = $$('[data-accordion]');

    for (const item of items) {
      const button = $('button', item);
      const panel = $('[data-accordion-panel]', item);
      if (!button || !panel) continue;

      gsap.set(panel, { height: 0, opacity: 0 });

      const onClick = () => {
        const willOpen = button.getAttribute('aria-expanded') !== 'true';
        // Satu panel terbuka pada satu waktu - daftar sepanjang ini jadi sulit
        // dibaca kalau semuanya boleh terbuka bersamaan.
        for (const other of items) if (other !== item) toggle(other, false);
        toggle(item, willOpen);
      };

      button.addEventListener('click', onClick);
      cleanups.push(() => button.removeEventListener('click', onClick));
    }
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
  },
};
