import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';

/**
 * INTRO
 *
 * Wordmark raksasa itu sendiri yang jadi bintang pembuka — bukan layar penutup
 * terpisah. Koreografinya tiga babak, mengikuti situs referensi:
 *
 *   0.0s  wordmark melayang masuk dari luar layar kanan menuju tengah layar,
 *         sementara huruf-hurufnya naik dari balik mask satu per satu
 *         (stagger 0.2 — inilah "R  A  D  Y  T" yang muncul berurutan);
 *   1.0s  wordmark memanjat dari tengah layar ke posisinya di puncak hero;
 *   1.4s  hero merakit diri sebagai kaskade: potret → headline → link nav →
 *         kartu → tombol → paragraf, masing-masing keluar dari blur.
 *
 * Yang membuatnya tidak terasa datar adalah tumpang tindihnya: tiap kelompok
 * mulai saat kelompok sebelumnya baru setengah jalan, jadi gerakannya
 * bertindih, bukan antre.
 */

let timeline: gsap.core.Timeline | null = null;

/** Semua yang harus tersembunyi dulu, lalu dimunculkan berurutan. */
const stage = () => ({
  portrait: $('.hero-portrait'),
  headlineLines: $$('.hero-headline-line'),
  navLinks: $$('.nav-link'),
  navSeps: $$('.hero-nav-sep'),
  statCards: [...$$('.nav-stat-card .nav-card-bg'), ...$$('.nav-stat')],
  traits: $('.hero-traits'),
  buttons: [$('.btn-primary'), $('.hero-secondary')].filter(Boolean) as HTMLElement[],
  paragraphs: [$('.hero-eyebrow'), $('.nav-tagline')].filter(Boolean) as HTMLElement[],
});

export const preloaderModule: AnimationModule = {
  name: 'intro',
  desktopOnly: true,
  skipOnReducedMotion: true,

  init() {
    const wordmark = $('[data-hero-wordmark]');
    const letters = $$('[data-wordmark-letter]');
    if (!wordmark || letters.length === 0 || !isDesktop()) return;

    const rect = wordmark.getBoundingClientRect();
    const xToCenter = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const yToCenter = window.innerHeight / 2 - (rect.top + rect.height / 2);

    gsap.set(wordmark, { x: window.innerWidth, y: yToCenter, autoAlpha: 1 });
    gsap.set(letters, { yPercent: 110 });

    const el = stage();
    gsap.set([el.portrait, el.traits].filter(Boolean), { autoAlpha: 0 });
    gsap.set(el.portrait, { scale: 0.88, filter: 'blur(20px)', transformOrigin: 'center bottom' });
    // Separator tumbuh dari tinggi nol, bukan memudar — garisnya seolah
    // ditarik keluar di antara label.
    gsap.set(el.navSeps, { height: 0 });
    gsap.set(el.headlineLines, { autoAlpha: 0, scale: 0.9, filter: 'blur(10px)' });
    gsap.set(el.traits, { filter: 'blur(8px)' });
    // Link nav & tombol utama sudah dipegang transform-nya oleh GhostEngine,
    // jadi di sini hanya opacity + blur yang disentuh — scale akan bentrok.
    gsap.set(el.navLinks, { autoAlpha: 0, filter: 'blur(6px)' });
    gsap.set(el.statCards, { autoAlpha: 0, filter: 'blur(8px)' });
    gsap.set(el.buttons, { autoAlpha: 0, filter: 'blur(10px)' });
    gsap.set(el.paragraphs, { autoAlpha: 0, filter: 'blur(6px)' });

    timeline = gsap.timeline({ delay: 0.15 });

    // Babak 1 — masuk dari kanan, huruf naik berurutan.
    timeline
      .to(wordmark, { x: xToCenter, duration: 1, ease: 'power3.inOut' })
      .to(letters, { yPercent: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, '<');

    // Babak 2 — memanjat ke posisi akhirnya di puncak hero.
    timeline.to(wordmark, { x: 0, y: 0, duration: 1, ease: 'power2.inOut' }, 1);

    // Babak 3 — hero merakit diri, tumpang tindih dengan babak 2.
    timeline.addLabel('hero', 1.4);

    timeline
      .to(el.portrait, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }, 'hero')
      .to(
        el.headlineLines,
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power2.out' },
        'hero+=0.3',
      )
      .to(el.navLinks, { autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, 'hero+=0.6')
      .to(el.navSeps, { height: '0.8vw', duration: 0.2, ease: 'power2.out' }, 'hero+=0.6')
      .to(
        el.statCards,
        { autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.1, ease: 'power2.out' },
        'hero+=0.6',
      )
      .to(el.traits, { autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' }, 'hero+=0.9')
      .to(
        el.buttons,
        { autoAlpha: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'power2.out' },
        'hero+=1.25',
      )
      .to(
        el.paragraphs,
        { autoAlpha: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        'hero+=1.65',
      );
  },

  destroy() {
    timeline?.kill();
    timeline = null;
  },
};
