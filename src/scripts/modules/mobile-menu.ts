import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';
import { getLenis } from '../core/smooth-scroll';

/**
 * Di bawah 768px sidebar jadi panel penuh yang dibuka dari tombol hamburger.
 * Animasinya `clip-path` di CSS; JS hanya mengurus status dan mengunci scroll.
 */

const cleanups: Array<() => void> = [];

export const mobileMenuModule: AnimationModule = {
  name: 'mobile-menu',
  rebuildOnResize: true,

  init() {
    if (isDesktop()) return;

    const trigger = $('[data-menu-trigger]');
    const sidebar = $('.sidebar');
    if (!trigger || !sidebar) return;

    const setOpen = (open: boolean) => {
      sidebar.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) getLenis()?.stop();
      else getLenis()?.start();
    };

    const onToggle = () => setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    trigger.addEventListener('click', onToggle);
    cleanups.push(() => trigger.removeEventListener('click', onToggle));

    // Menutup sendiri setelah memilih tujuan — kalau tidak, panel menutupi
    // section yang barusan dituju.
    for (const link of $$('.nav-link, .btn', sidebar)) {
      const onNavigate = () => setOpen(false);
      link.addEventListener('click', onNavigate);
      cleanups.push(() => link.removeEventListener('click', onNavigate));
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    cleanups.push(() => document.removeEventListener('keydown', onKey));
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
    $('.sidebar')?.classList.remove('is-open');
    $('[data-menu-trigger]')?.setAttribute('aria-expanded', 'false');
    getLenis()?.start();
  },
};
