import { gsap, SplitText } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';

/**
 * ABOUT — panggung babak.
 *
 * Section-nya dibuat setinggi (jumlah chapter + 1) viewport, isinya menempel
 * dengan `position: sticky`, dan seluruh gerakannya di-scrub ke scroll. Jadi
 * yang bergerak bukan halamannya, melainkan isi satu tempat yang sama: intro
 * menyerahkan panggung ke 01, 01 ke 02, 02 ke 03.
 *
 * STICKY, BUKAN `pin: true`. Keduanya menghasilkan efek yang sama di layar,
 * tetapi pin menyisipkan spacer saat ScrollTrigger menyegarkan diri, dan
 * spacer itu menggeser posisi dokumen semua section di bawahnya — persis yang
 * pernah membuat geseran horizontal The Work jatuh ~5040px terlalu tinggi.
 * Sticky hanyalah layout biasa: tinggi section sudah benar sejak render
 * pertama, jadi tidak ada satu pun trigger lain yang perlu diprioritaskan.
 */

let timeline: gsap.core.Timeline | null = null;
const mobileTweens: gsap.core.Tween[] = [];
const splits: SplitText[] = [];

/** Satu viewport untuk intro, lalu satu untuk tiap chapter. */
const HOLD_PER_ACT = 1;

export const aboutStoryModule: AnimationModule = {
  name: 'about-story',
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const section = $('[data-about]');
    const stage = $('[data-about-stage]');
    const intro = $('[data-about-intro]');
    const chapters = $$('[data-about-chapter]');
    if (!section || !stage || !intro || chapters.length === 0) return;

    if (!isDesktop()) {
      chapters.forEach((chapter) => {
        mobileTweens.push(
          gsap.from(chapter, {
            autoAlpha: 0,
            y: 32,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: chapter, start: 'top 84%', once: true },
          }),
        );
      });
      return;
    }

    const glow = $('[data-about-glow]');
    const rails = $$('[data-about-rail-fill]');

    section.classList.add('about--staged');
    section.style.height = `${window.innerHeight * (chapters.length + HOLD_PER_ACT)}px`;

    // Dipecah setelah kelas panggung terpasang: lebar kolomnya berubah di
    // bentuk staged, dan SplitText memotong baris berdasarkan lebar saat itu.
    const linesOf = (el: HTMLElement | null): HTMLElement[] => {
      if (!el) return [];
      const split = new SplitText(el, { type: 'lines', linesClass: 'line', aria: 'none' });
      splits.push(split);
      return split.lines as HTMLElement[];
    };
    const charsOf = (el: HTMLElement | null): HTMLElement[] => {
      if (!el) return [];
      const split = new SplitText(el, { type: 'chars', charsClass: 'char', aria: 'none' });
      splits.push(split);
      return split.chars as HTMLElement[];
    };

    const leadLines = linesOf($('.about-lead', intro));

    // Sudah menyala sejak babak intro. Kalau baru muncul di chapter 01,
    // separuh kanan panggung mati total selama pembukaan.
    if (glow) gsap.set(glow, { autoAlpha: 1, xPercent: -22, yPercent: -18 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        // Panggung menempel tepat sampai kaki section menyentuh kaki viewport;
        // memakai patokan yang sama membuat gerakan berhenti persis saat
        // panggungnya lepas, bukan sebelum atau sesudahnya.
        end: 'bottom bottom',
        scrub: 0.6,
      },
    });
    timeline = tl;

    // Babak 0 — intro menyerahkan panggung.
    tl.to(intro, { autoAlpha: 0, y: -70, duration: 0.45, ease: 'power2.in' }, 0.55);
    tl.to(leadLines, { yPercent: -110, duration: 0.45, stagger: 0.04, ease: 'power2.in' }, 0.55);

    const last = chapters.length - 1;

    chapters.forEach((chapter, i) => {
      const figure = $('.about-chapter-figure', chapter);
      const titleChars = charsOf($('[data-about-title]', chapter));
      const bodyLines = linesOf($('[data-about-text]', chapter));

      // Tiap chapter memakai satu viewport penuh; angka 1.0 di bawah adalah
      // panjang satu babak dalam satuan timeline, bukan detik (semuanya
      // di-scrub, jadi durasi nyata ditentukan scroll).
      const at = HOLD_PER_ACT + i;

      gsap.set(chapter, { autoAlpha: 0 });

      tl
        .to(chapter, { autoAlpha: 1, duration: 0.01 }, at)
        .fromTo(
          figure,
          { yPercent: 22, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
          at,
        )
        .fromTo(
          titleChars,
          { yPercent: 115, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.45, stagger: 0.018, ease: 'power3.out' },
          at + 0.04,
        )
        .fromTo(
          bodyLines,
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.42, stagger: 0.05, ease: 'power2.out' },
          at + 0.16,
        );

      if (rails[i]) tl.to(rails[i], { scaleX: 1, duration: 0.35, ease: 'none' }, at);

      if (glow) {
        tl.to(
          glow,
          {
            autoAlpha: 1,
            // Digeser tiap babak supaya cahayanya terasa berpindah mengikuti
            // teks, bukan menyala diam di satu titik.
            xPercent: -14 + i * 14,
            yPercent: -10 + i * 12,
            duration: 0.6,
            ease: 'power2.out',
          },
          at,
        );
      }

      // Chapter terakhir dibiarkan berdiri sampai panggung lepas.
      if (i < last) {
        tl
          .to(chapter, { autoAlpha: 0, y: -60, duration: 0.4, ease: 'power2.in' }, at + 0.62)
          .to(figure, { yPercent: -18, duration: 0.4, ease: 'power2.in' }, at + 0.62);
      }
    });
  },

  destroy() {
    while (mobileTweens.length) mobileTweens.pop()?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;

    // Urutannya penting: kembalikan SplitText dulu (ia menghapus pembungkus
    // baris/huruf yang dibuatnya), baru bersihkan inline style sisa GSAP.
    while (splits.length) splits.pop()?.revert();

    const section = $('[data-about]');
    if (section) {
      section.classList.remove('about--staged');
      section.style.removeProperty('height');
    }

    $$('[data-about-intro], [data-about-chapter], .about-chapter-figure, [data-about-glow], [data-about-rail-fill]').forEach(
      (el) => gsap.set(el, { clearProps: 'all' }),
    );
  },
};
