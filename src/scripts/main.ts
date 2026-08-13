import { ScrollTrigger } from './core/gsap';
import type { AnimationModule } from './core/module';
import { getLenis, initAnchorLinks, initSmoothScroll } from './core/smooth-scroll';
import { debounce, isDesktop, isPerformanceConstrained, prefersReducedMotion, whenFontsReady } from './core/utils';

import { sidebarModule } from './modules/sidebar';
import { ghostModule } from './modules/ghost';
import { styleEngineModule } from './modules/style-engine';
import { textRevealModule } from './modules/text-reveal';
import { horizontalModule } from './modules/horizontal';
import { aboutStoryModule } from './modules/about-story';
import { themeModule } from './modules/theme';
import { timelinePathModule } from './modules/timeline-path';
import { packagingTestModule } from './modules/packaging-test';
import { navActiveModule } from './modules/nav-active';
import { workCardsModule } from './modules/work-cards';
import { mobileMenuModule } from './modules/mobile-menu';
import { footerCtaModule } from './modules/footer-cta';
import { microModule } from './modules/micro';
import { finishIntro, preloaderModule, sealIntro } from './modules/preloader';
import { brandStagesModule } from './modules/brand-stages';

/**
 * Urutan penting: sidebar mengunci skalanya dulu, baru ghost boleh mengukur.
 * horizontal juga harus jalan sebelum modul yang bergantung pada tinggi
 * halaman, karena ia yang menetapkan tinggi section work.
 *
 * about-story sekelompok dengan horizontal karena alasan yang sama — ia
 * menetapkan tinggi section About — dan harus mendahului text-reveal, sebab
 * kelas panggung yang dipasangnya mengubah lebar kolom judul, sementara
 * SplitText memotong baris menurut lebar saat itu juga.
 */
const modules: AnimationModule[] = [
  sidebarModule,
  ghostModule,
  horizontalModule,
  aboutStoryModule,
  styleEngineModule,
  textRevealModule,
  timelinePathModule,
  themeModule,
  packagingTestModule,
  workCardsModule,
  navActiveModule,
  mobileMenuModule,
  footerCtaModule,
  brandStagesModule,
  microModule,
  preloaderModule,
];

let active: AnimationModule[] = [];

const canRun = (m: AnimationModule): boolean => {
  if (m.desktopOnly && !isDesktop()) return false;
  if (m.skipOnReducedMotion && prefersReducedMotion()) return false;
  return true;
};

/**
 * Selalu di-iterasi dalam urutan `modules`, bukan urutan `active` atau urutan
 * argumen: lihat catatan urutan di atas daftar modul. Berlaku juga saat hanya
 * sebagian modul yang dibangun ulang.
 */
function initModules(subset: AnimationModule[] = modules): void {
  const next = modules.filter((m) => subset.includes(m) && canRun(m));
  for (const m of next) {
    try {
      m.init();
    } catch (error) {
      console.error(`[motion] modul "${m.name}" gagal init`, error);
    }
  }
  // Modul di luar subset tetap hidup, jadi harus tetap tercatat di `active` —
  // kalau tidak, teardown penuh berikutnya akan melewatkannya.
  active = modules.filter((m) => next.includes(m) || (!subset.includes(m) && active.includes(m)));
}

function destroyModules(subset: AnimationModule[] = modules): void {
  const gone = active.filter((m) => subset.includes(m));
  for (const m of gone) m.destroy?.();
  active = active.filter((m) => !subset.includes(m));
}

/** Modul yang menyatakan dirinya perlu diukur ulang saat lebar berubah. */
const resizable = modules.filter((m) => m.rebuildOnResize);

let lastWidth = window.innerWidth;
let lastIsDesktop = isDesktop();

/**
 * Hanya perubahan LEBAR yang berarti. Di mobile, bar browser yang menyusut
 * saat scroll mengubah tinggi viewport terus-menerus — kalau itu ikut memicu
 * rebuild, seluruh modul dibongkar-pasang di tengah gerakan jari.
 *
 * Dan bahkan saat lebar berubah, yang dibangun ulang hanyalah modul yang
 * MENYATAKAN dirinya butuh (`rebuildOnResize`). Membongkar semuanya berarti
 * ikut menjalankan ulang `intro`: potret hero disembunyikan lagi dan wordmark
 * terbang lagi dari luar layar, di tengah halaman yang sedang dibaca user.
 */
const handleResize = debounce(() => {
  const widthChanged = window.innerWidth !== lastWidth;
  const desktop = isDesktop();
  const crossedBreakpoint = desktop !== lastIsDesktop;

  lastWidth = window.innerWidth;
  lastIsDesktop = desktop;

  if (!widthChanged) {
    ScrollTrigger.refresh();
    return;
  }

  // Ghost mengukur wordmark di posisi istirahatnya dan intro menerbangkannya
  // keluar layar — mengukur di tengah penerbangan itu menghasilkan morph yang
  // salah total. Resize berarti user sudah tidak menonton intro; tuntaskan.
  finishIntro();

  // Hanya saat melewati 768px himpunan modul yang boleh jalan ikut berubah
  // (modul `desktopOnly` mati/hidup), dan cuma di situ teardown penuh perlu.
  const scope = crossedBreakpoint ? modules : resizable;

  destroyModules(scope);
  requestAnimationFrame(() => {
    initModules(scope);
    ScrollTrigger.refresh();
  });
}, 150);

async function boot(): Promise<void> {
  document.documentElement.classList.toggle('performance-lite', isPerformanceConstrained());

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

  // Boot selesai — intro tidak boleh lagi mendapat giliran. Penting untuk
  // halaman yang dibuka di lebar mobile: di sana intro tidak pernah jalan, dan
  // tanpa segel ini melebarkan jendela melewati 768px akan memutarnya penuh.
  sealIntro();

  window.addEventListener('resize', handleResize, { passive: true });
}

void boot();
