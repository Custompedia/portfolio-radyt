import { ScrollTrigger } from './core/gsap';
import type { AnimationModule } from './core/module';
import { initAnchorLinks, initSmoothScroll } from './core/smooth-scroll';
import { debounce, isDesktop, prefersReducedMotion, whenFontsReady } from './core/utils';

import { sidebarModule } from './modules/sidebar';
import { ghostModule } from './modules/ghost';
import { styleEngineModule } from './modules/style-engine';
import { textRevealModule } from './modules/text-reveal';
import { horizontalModule } from './modules/horizontal';
import { themeModule } from './modules/theme';
import { timelinePathModule } from './modules/timeline-path';
import { accordionModule } from './modules/accordion';
import { testimonialSliderModule } from './modules/testimonial-slider';
import { ctaRotatorModule, leadParagraphModule } from './modules/lead-paragraph';
import { navActiveModule } from './modules/nav-active';
import { magneticModule, workCardsModule } from './modules/magnetic';
import { clipboardModule } from './modules/clipboard';
import { mobileMenuModule } from './modules/mobile-menu';
import { preloaderModule } from './modules/preloader';

/**
 * Urutan penting: sidebar mengunci skalanya dulu, baru ghost boleh mengukur.
 * horizontal juga harus jalan sebelum modul yang bergantung pada tinggi
 * halaman, karena ia yang menetapkan tinggi section work.
 */
const modules: AnimationModule[] = [
  sidebarModule,
  ghostModule,
  horizontalModule,
  styleEngineModule,
  textRevealModule,
  leadParagraphModule,
  timelinePathModule,
  themeModule,
  accordionModule,
  testimonialSliderModule,
  ctaRotatorModule,
  workCardsModule,
  magneticModule,
  navActiveModule,
  clipboardModule,
  mobileMenuModule,
  preloaderModule,
];

let active: AnimationModule[] = [];

const canRun = (m: AnimationModule): boolean => {
  if (m.desktopOnly && !isDesktop()) return false;
  if (m.skipOnReducedMotion && prefersReducedMotion()) return false;
  return true;
};

function initModules(): void {
  active = modules.filter(canRun);
  for (const m of active) {
    try {
      m.init();
    } catch (error) {
      console.error(`[motion] modul "${m.name}" gagal init`, error);
    }
  }
}

function destroyModules(): void {
  for (const m of active) m.destroy?.();
  active = [];
}

let lastWidth = window.innerWidth;

const handleResize = debounce(() => {
  const widthChanged = window.innerWidth !== lastWidth;
  lastWidth = window.innerWidth;

  const needsRebuild = active.some((m) => m.rebuildOnResize);
  if (!needsRebuild && !widthChanged) {
    ScrollTrigger.refresh();
    return;
  }

  destroyModules();
  requestAnimationFrame(() => {
    initModules();
    ScrollTrigger.refresh();
  });
}, 150);

async function boot(): Promise<void> {
  // Pengukuran ghost hanya sahih pada scroll nol — jangan biarkan browser
  // memulihkan posisi scroll lama saat reload.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  initSmoothScroll();

  // Rect sebelum font selesai dimuat masih memakai metrik fallback dan akan
  // bergeser beberapa piksel begitu font asli masuk.
  await whenFontsReady();

  // Diulang di sini, bukan cuma di <head>: sebagian browser memulihkan posisi
  // scroll setelah dokumen punya tinggi, yaitu SETELAH skrip head jalan. Kalau
  // dibiarkan, GhostEngine mengukur pada scroll yang salah dan seluruh morph
  // hero batal.
  window.scrollTo(0, 0);

  initModules();
  initAnchorLinks();

  document.documentElement.classList.remove('js-loading');
  ScrollTrigger.refresh();

  window.addEventListener('resize', handleResize, { passive: true });
}

void boot();
