import { ScrollTrigger } from './core/gsap';
import type { AnimationModule } from './core/module';
import { getLenis, initAnchorLinks, initSmoothScroll } from './core/smooth-scroll';
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
import { ctaChatModule } from './modules/cta-chat';
import { navActiveModule } from './modules/nav-active';
import { workCardsModule } from './modules/work-cards';
import { clipboardModule } from './modules/clipboard';
import { mobileMenuModule } from './modules/mobile-menu';
import { imageTrailModule } from './modules/image-trail';
import { microModule } from './modules/micro';
import { preloaderModule } from './modules/preloader';
import { clientMarqueeModule } from './modules/client-marquee';

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
  timelinePathModule,
  themeModule,
  accordionModule,
  testimonialSliderModule,
  ctaChatModule,
  workCardsModule,
  navActiveModule,
  clipboardModule,
  mobileMenuModule,
  clientMarqueeModule,
  imageTrailModule,
  microModule,
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

/**
 * Hanya perubahan LEBAR yang berarti. Di mobile, bar browser yang menyusut
 * saat scroll mengubah tinggi viewport terus-menerus — kalau itu ikut memicu
 * rebuild, seluruh modul dibongkar-pasang di tengah gerakan jari.
 */
const handleResize = debounce(() => {
  const widthChanged = window.innerWidth !== lastWidth;
  lastWidth = window.innerWidth;

  if (!widthChanged) {
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

  // Intro berjalan ~3,3 detik dan tidak akan pernah terlihat utuh kalau
  // halaman sudah bisa di-scroll sejak frame pertama. Scroll dikunci selama
  // durasi itu — hanya di desktop, karena intro-nya sendiri desktop-only.
  const lenis = getLenis();
  if (lenis && isDesktop() && !prefersReducedMotion()) {
    lenis.stop();
    window.setTimeout(() => lenis.start(), 3000);
  }

  window.addEventListener('resize', handleResize, { passive: true });
}

void boot();
