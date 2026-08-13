import { ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $$, isDesktop, prefersReducedMotion } from '../core/utils';

/**
 * Sidebar mengambang di atas semua section, jadi warnanya harus ikut berganti
 * begitu ia menimpa section gelap.
 *
 * simplified: pakai satu atribut [data-theme] + custom property, bukan tabel
 * gaya per-elemen seperti referensi; pindah ke tabel kalau nanti ada section
 * gelap yang butuh palet berbeda dari section gelap lainnya.
 */

const triggers: ScrollTrigger[] = [];
const SIDEBAR_THEME_OFFSET = 0;
let overlapping = 0;

function apply(): void {
  const dark = overlapping > 0;
  for (const el of $$('.sidebar, .mobile-menu-trigger')) {
    if (dark) el.setAttribute('data-theme', 'dark');
    else el.removeAttribute('data-theme');
  }
  // Lajur scrollbar ada di luar kotak konten: yang tembus di belakangnya bukan
  // section yang sedang lewat, melainkan latar kanvas yang terang. Satu-satunya
  // cara membuatnya ikut gelap adalah memberi tahu <html> di sini.
  document.documentElement.classList.toggle('is-dark-scroll', dark);
}

export const themeModule: AnimationModule = {
  name: 'theme',
  rebuildOnResize: true,

  init() {
    overlapping = 0;

    for (const section of $$('[data-theme-section]')) {
      const duration = isDesktop() && !prefersReducedMotion() ? Number(section.getAttribute('data-theme-duration')) : 0;
      // Section yang ditimpa layer berikutnya berhenti gelap lebih awal daripada
      // tepi bawahnya sendiri — lihat catatan di Work.astro.
      const customEnd = section.getAttribute('data-theme-end');
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          // Sidebar berubah bersamaan dengan masuknya section gelap agar tidak
          // sempat menimpa latar gelap dengan permukaan terang.
          start: `top top+=${SIDEBAR_THEME_OFFSET}`,
          end: Number.isFinite(duration) && duration > 0
            ? `+=${window.innerHeight * (duration + 1)}`
            : (customEnd ?? `bottom top+=${SIDEBAR_THEME_OFFSET}`),
          onToggle: (self) => {
            overlapping += self.isActive ? 1 : -1;
            overlapping = Math.max(0, overlapping);
            apply();
          },
        }),
      );
    }

    apply();
  },

  destroy() {
    while (triggers.length) triggers.pop()?.kill();
    overlapping = 0;
    apply();
  },
};
