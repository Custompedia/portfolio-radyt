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
 *   1.4s  hero merakit diri sebagai kaskade: potret → eyebrow & nama →
 *         headline → link nav → kartu → tombol → paragraf.
 *
 * Yang membuatnya tidak terasa datar adalah tumpang tindihnya: tiap kelompok
 * mulai saat kelompok sebelumnya baru setengah jalan, jadi gerakannya
 * bertindih, bukan antre.
 */

let timeline: gsap.core.Timeline | null = null;

/**
 * Intro adalah pembuka halaman, bukan reaksi terhadap viewport: kesempatannya
 * cuma satu, saat boot. Tanpa penjaga ini, setiap init() ulang akan
 * menyembunyikan lagi potret dan menerbangkan lagi wordmark dari luar layar,
 * menabrak apa pun yang sedang dilihat user.
 *
 * Disegel oleh main.ts di akhir boot(), BUKAN sekadar oleh init(): kalau
 * halaman dibuka di lebar mobile, intro tidak pernah jalan (`desktopOnly`),
 * dan tanpa segel itu memperlebar jendela melewati 768px akan memutar intro
 * penuh di tengah halaman yang sudah dibaca.
 */
let spent = false;

/**
 * Majukan intro ke akhirnya. Dipakai main.ts sebelum membangun ulang modul:
 * ghost mengukur wordmark di posisi istirahatnya, dan posisi itu baru sahih
 * setelah intro tuntas.
 */
export function finishIntro(): void {
  timeline?.progress(1);
}

/** Tutup kesempatan intro. Dipanggil sekali di akhir boot(). */
export function sealIntro(): void {
  spent = true;
}

/** Semua yang harus tersembunyi dulu, lalu dimunculkan berurutan.
 *
 * `statCards` sengaja hanya mengambil kartu ber-`data-ghost` — yaitu kartu yang
 * benar-benar punya posisi di hero. Kartu rail yang tidak muncul di hero
 * (`data-ghost-fade`) opacity-nya milik fade morph di ghost.ts; kalau intro
 * ikut menaikkannya ke 1, kartu itu tampil di pojok kiri atas sejak frame
 * pertama, jauh sebelum rail-nya ada. */
const stage = () => ({
  wordmark: $('[data-hero-wordmark]'),
  letters: $$('[data-wordmark-letter]'),
  portrait: $('.hero-portrait'),
  headlineLines: $$('.hero-headline-line'),
  navLinks: $$('.nav-link'),
  navSeps: $$('.hero-nav-sep'),
  statCards: $$('.nav-stat-card [data-ghost]'),
  lead: [$('.hero-eyebrow'), $('.hero-name')].filter(Boolean) as HTMLElement[],
  buttons: [$('.btn-primary'), $('.hero-secondary')].filter(Boolean) as HTMLElement[],
  supporting: [$('.hero-traits')].filter(Boolean) as HTMLElement[],
  paragraphs: [$('.hero-subheadline'), $('.hero-brands')].filter(Boolean) as HTMLElement[],
});

export const preloaderModule: AnimationModule = {
  name: 'intro',
  desktopOnly: true,
  skipOnReducedMotion: true,

  init() {
    const el = stage();
    const { wordmark, letters } = el;
    if (!wordmark || letters.length === 0 || !isDesktop() || spent) return;
    spent = true;

    const rect = wordmark.getBoundingClientRect();
    const xToCenter = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const yToCenter = window.innerHeight / 2 - (rect.top + rect.height / 2);

    gsap.set(wordmark, { x: window.innerWidth, y: yToCenter, autoAlpha: 1 });
    gsap.set(letters, { yPercent: 110 });

    gsap.set(el.portrait, { autoAlpha: 0, scale: 0.88, transformOrigin: 'center bottom' });
    // Separator tumbuh dari tinggi nol, bukan memudar — garisnya seolah
    // ditarik keluar di antara label.
    gsap.set(el.navSeps, { height: 0 });
    gsap.set(el.headlineLines, { autoAlpha: 0, scale: 0.9 });
    // Link nav & tombol utama sudah dipegang transform-nya oleh GhostEngine,
    // jadi di sini hanya opacity + blur yang disentuh — scale akan bentrok.
    gsap.set(el.navLinks, { autoAlpha: 0 });
    gsap.set(el.statCards, { autoAlpha: 0, filter: 'blur(8px)' });
    gsap.set(el.buttons, { autoAlpha: 0 });
    gsap.set(el.lead, { autoAlpha: 0 });
    gsap.set(el.supporting, { autoAlpha: 0 });
    gsap.set(el.paragraphs, { autoAlpha: 0 });

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
      .to(el.portrait, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, 'hero')
      // Eyebrow dan nama mendahului headline: ketiganya satu blok di kolom
      // kiri, dan blok itu harus terbaca dari atas ke bawah.
      .to(el.lead, { autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, 'hero+=0.15')
      .to(
        el.headlineLines,
        { autoAlpha: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'power2.out' },
        'hero+=0.3',
      )
      .to(el.navLinks, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 'hero+=0.6')
      .to(el.navSeps, { height: '0.8vw', duration: 0.2, ease: 'power2.out' }, 'hero+=0.6')
      .to(
        el.statCards,
        { autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.1, ease: 'power2.out' },
        'hero+=0.6',
      )
      .to(
        el.buttons,
        { autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
        'hero+=1.25',
      )
      .to(el.supporting, { autoAlpha: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' }, 'hero+=1.55')
      .to(
        el.paragraphs,
        { autoAlpha: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        'hero+=1.65',
      );
  },

  destroy() {
    timeline?.kill();
    timeline = null;

    // Membunuh timeline tidak mengembalikan apa pun — inline style hasil
    // gsap.set() di init() tetap menempel. Kalau teardown terjadi di tengah
    // intro (mis. lebar jatuh di bawah breakpoint), elemen hero tersangkut di
    // autoAlpha: 0 dan hero versi mobile tampil kosong.
    //
    // Dibersihkan per-properti, BUKAN clearProps: 'all': `.hero-portrait`,
    // nav link, dan tombol transform-nya dipegang GhostEngine dan style-engine,
    // dan menghapusnya di sini akan membatalkan pekerjaan modul lain.
    const el = stage();
    gsap.set([el.wordmark, ...el.letters].filter(Boolean) as HTMLElement[], {
      clearProps: 'opacity,visibility,x,y,yPercent',
    });
    gsap.set(el.portrait, { clearProps: 'opacity,visibility,scale,transformOrigin' });
    gsap.set(el.navSeps, { clearProps: 'height' });
    gsap.set(el.headlineLines, { clearProps: 'opacity,visibility,scale' });
    gsap.set(el.statCards, { clearProps: 'opacity,visibility,filter' });
    gsap.set([...el.navLinks, ...el.lead, ...el.buttons, ...el.supporting, ...el.paragraphs], {
      clearProps: 'opacity,visibility',
    });
  },
};
