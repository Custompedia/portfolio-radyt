import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $$ } from '../core/utils';

/**
 * Elemen ber-`data-magnetic` sedikit tertarik ke arah kursor saat didekati,
 * lalu memantul balik saat ditinggalkan. Gerakannya kecil — kalau berlebihan
 * tombol jadi susah diklik dan terasa main-main.
 *
 * Memakai `gsap.quickTo` (bukan tween baru tiap gerakan mouse) supaya tidak
 * membuat ribuan objek tween saat kursor bergerak cepat.
 */

const STRENGTH = 0.28;

// Tiap modul memegang daftar cleanup-nya sendiri — kalau dijadikan satu,
// men-destroy salah satu ikut melepas listener milik yang lain.
const magneticCleanups: Array<() => void> = [];
const workCleanups: Array<() => void> = [];

export const magneticModule: AnimationModule = {
  name: 'magnetic',
  desktopOnly: true,
  skipOnReducedMotion: true,

  init() {
    // Perangkat sentuh tidak punya hover; efeknya cuma jadi lompatan aneh.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    for (const el of $$('[data-magnetic]')) {
      const label = el.querySelector<HTMLElement>('.btn-label');

      const moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      const labelX = label ? gsap.quickTo(label, 'x', { duration: 0.7, ease: 'power3.out' }) : null;
      const labelY = label ? gsap.quickTo(label, 'y', { duration: 0.7, ease: 'power3.out' }) : null;

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        moveX(dx * STRENGTH);
        moveY(dy * STRENGTH);
        // Label bergerak lebih jauh sedikit — memberi kesan berlapis.
        labelX?.(dx * STRENGTH * 0.4);
        labelY?.(dy * STRENGTH * 0.4);
      };

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        if (label) gsap.to(label, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      magneticCleanups.push(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        gsap.set(el, { clearProps: 'transform' });
        if (label) gsap.set(label, { clearProps: 'transform' });
      });
    }
  },

  destroy() {
    while (magneticCleanups.length) magneticCleanups.pop()?.();
  },
};

/**
 * Kartu proyek: masuk berurutan saat track mulai bergerak, dan gambarnya
 * bergeser sedikit lebih lambat dari kartunya sendiri sehingga terasa punya
 * kedalaman saat digulir menyamping.
 */
export const workCardsModule: AnimationModule = {
  name: 'work-cards',
  desktopOnly: true,
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const cards = $$('[data-work-card]');
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '[data-work]', start: 'top 60%', once: true },
      },
    );

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    for (const card of cards) {
      const glow = card.querySelector<HTMLElement>('.work-card-glow');
      if (!glow) continue;

      const glowX = gsap.quickTo(glow, 'xPercent', { duration: 0.8, ease: 'power3.out' });
      const glowY = gsap.quickTo(glow, 'yPercent', { duration: 0.8, ease: 'power3.out' });

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
      workCleanups.push(() => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
      });
    }
  },

  destroy() {
    while (workCleanups.length) workCleanups.pop()?.();
  },
};
