import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';

const PADDING = 40;

let scale = 1;

/** Dipakai ghost.ts: semua delta posisi harus dibagi skala ini. */
export const getSidebarScale = (): number => scale;

/**
 * Sidebar dirancang pada tinggi layar "nyaman". Di layar pendek ia diperkecil
 * utuh sebagai satu blok, lalu beberapa anak di-*inverse scale* supaya teks
 * tombol dan logo tidak ikut mengecil sampai tak terbaca.
 */
function applyScale(): void {
  const sidebar = $('.sidebar');
  if (!sidebar) return;

  if (!isDesktop()) {
    scale = 1;
    document.documentElement.style.setProperty('--sidebar-scale', '1');
    gsap.set(sidebar, { clearProps: 'transform' });
    return;
  }

  const available = window.innerHeight - PADDING;
  scale = Math.min(1, available / sidebar.scrollHeight);

  gsap.set(sidebar, { scale, transformOrigin: 'top left', force3D: false });

  // Dipublikasikan ke CSS supaya elemen hero bisa dipatok ke ukuran sidebar
  // yang SUDAH di-scale - itu yang membuat tombol "Book a Call" (di-scale oleh
  // GhostEngine) dan "About Me" (statis) mendarat pada tinggi yang sama persis.
  document.documentElement.style.setProperty('--sidebar-scale', String(scale));

  const inverse = 1 / scale;
  $$('[data-sidebar-inverse]', sidebar).forEach((el) => {
    gsap.set(el, { scale: inverse, transformOrigin: 'center center', force3D: false });
  });
}

export const sidebarModule: AnimationModule = {
  name: 'sidebar',
  rebuildOnResize: true,

  init() {
    applyScale();
  },

  destroy() {
    const sidebar = $('.sidebar');
    if (sidebar) gsap.set(sidebar, { clearProps: 'transform' });
    scale = 1;
  },
};
