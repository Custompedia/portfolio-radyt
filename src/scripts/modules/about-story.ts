import { gsap, SplitText, EASE_OUT } from '../core/gsap';
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

const INTRO_AT = 0.42;
const CHAPTER_STEP = 0.7;
const STAGE_VIEWPORTS = 3.15;

/**
 * ABOUT DI MOBILE — bab yang dibacakan, bukan blok yang muncul.
 *
 * Sebelumnya tiap bab cuma `gsap.from({ autoAlpha: 0, y: 32 })` sekali jalan:
 * satu blok utuh menyembul, selesai. Panggung berbabak yang dibangun untuk
 * desktop tidak punya padanannya sama sekali di layar sempit.
 *
 * Versi ini memakai bahan yang sama dengan desktop — SplitText — tapi dengan
 * kosakata vertikal:
 *
 *   - ANGKA BAB (01/02/03) tidak muncul, ia DIGESER ikut scroll. Angkanya
 *     raksasa dan nyaris transparan, jadi geseran pelan itulah yang membuat
 *     halaman terasa punya lapisan latar dan lapisan depan.
 *   - JUDUL naik dari balik mask barisnya sendiri.
 *   - ISI naik per baris dengan jeda 0.06 — cukup untuk terbaca sebagai teks
 *     yang "dibacakan", tidak sampai terasa lambat.
 *
 * `once: true` di semuanya: bab yang sudah dibaca tidak boleh menghilang lagi
 * saat user menggulung balik untuk membacanya ulang.
 */
function buildMobileChapters(chapters: HTMLElement[]): void {
  chapters.forEach((chapter) => {
    const figure = chapter.querySelector<HTMLElement>('.about-chapter-figure');
    const title = chapter.querySelector<HTMLElement>('[data-about-title]');
    const text = chapter.querySelector<HTMLElement>('[data-about-text]');

    // Angka latar: parallax sepanjang bab melintasi layar. `ease: 'none'` supaya
    // ia menempel pada jari, bukan mengejarnya.
    if (figure) {
      mobileTweens.push(
        gsap.fromTo(
          figure,
          { yPercent: 18, autoAlpha: 0.5 },
          {
            yPercent: -18,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          },
        ),
      );
    }

    const lines = (el: HTMLElement | null): HTMLElement[] => {
      if (!el) return [];
      const split = new SplitText(el, { type: 'lines', linesClass: 'line', aria: 'none' });
      splits.push(split);
      return split.lines as HTMLElement[];
    };

    const titleLines = lines(title);
    const textLines = lines(text);

    // `set()` + `to()`, BUKAN `from()`. Sudah terbukti di halaman ini bahwa
    // `.from()` yang punya ScrollTrigger tidak menuliskan keadaan awalnya —
    // DIUKUR: bab ketiga masih 1400px di bawah lipatan tapi judulnya sudah di
    // `y: 0` dan teksnya sudah `opacity: 1`, jadi tidak ada yang tersisa untuk
    // disingkap. Lihat catatan panjangnya di brand-stages.ts.
    if (titleLines.length) {
      gsap.set(titleLines, { yPercent: 112 });
      mobileTweens.push(
        gsap.to(titleLines, {
          yPercent: 0,
          duration: 0.72,
          stagger: 0.07,
          ease: EASE_OUT,
          scrollTrigger: { trigger: chapter, start: 'top 82%', once: true },
        }),
      );
    }

    if (textLines.length) {
      gsap.set(textLines, { yPercent: 60, autoAlpha: 0 });
      mobileTweens.push(
        gsap.to(textLines, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.62,
          stagger: 0.06,
          ease: EASE_OUT,
          scrollTrigger: { trigger: chapter, start: 'top 76%', once: true },
        }),
      );
    }

    // Kalau SplitText gagal (mis. teksnya kosong), bab tetap harus terlihat —
    // jangan biarkan satu bab hilang gara-gara animasinya tidak terbentuk.
    if (!titleLines.length && !textLines.length) {
      gsap.set(chapter, { autoAlpha: 0, y: 32 });
      mobileTweens.push(
        gsap.to(chapter, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: EASE_OUT,
          scrollTrigger: { trigger: chapter, start: 'top 84%', once: true },
        }),
      );
    }
  });
}

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
      buildMobileChapters(chapters);
      return;
    }

    const glow = $('[data-about-glow]');
    const rails = $$('[data-about-rail-fill]');

    section.classList.add('about--staged');
    section.style.height = `${window.innerHeight * STAGE_VIEWPORTS}px`;

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
    tl.to(intro, { autoAlpha: 0, y: -52, duration: 0.28, ease: 'power2.in' }, 0.34);
    tl.to(leadLines, { yPercent: -105, duration: 0.28, stagger: 0.025, ease: 'power2.in' }, 0.34);

    const last = chapters.length - 1;

    chapters.forEach((chapter, i) => {
      const figure = $('.about-chapter-figure', chapter);
      const titleChars = charsOf($('[data-about-title]', chapter));
      const bodyLines = linesOf($('[data-about-text]', chapter));

      // Tiap chapter memakai satu viewport penuh; angka 1.0 di bawah adalah
      // panjang satu babak dalam satuan timeline, bukan detik (semuanya
      // di-scrub, jadi durasi nyata ditentukan scroll).
      const at = INTRO_AT + i * CHAPTER_STEP;

      gsap.set(chapter, { autoAlpha: 0 });

      tl
        .to(chapter, { autoAlpha: 1, duration: 0.01 }, at)
        .fromTo(
          figure,
          { yPercent: 22, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.34, ease: 'power3.out' },
          at,
        )
        .fromTo(
          titleChars,
          { yPercent: 115, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.34, stagger: 0.012, ease: 'power3.out' },
          at + 0.02,
        )
        .fromTo(
          bodyLines,
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.34, stagger: 0.032, ease: 'power2.out' },
          at + 0.1,
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
            duration: 0.42,
            ease: 'power2.out',
          },
          at,
        );
      }

      // Chapter terakhir dibiarkan berdiri sampai panggung lepas.
      if (i < last) {
        tl
          .to(chapter, { autoAlpha: 0, y: -48, duration: 0.24, ease: 'power2.in' }, at + 0.5)
          .to(figure, { yPercent: -16, duration: 0.24, ease: 'power2.in' }, at + 0.5);
      }
    });
  },

  destroy() {
    // ScrollTrigger-nya dibunuh EKSPLISIT: `tween.kill()` tidak ikut
    // membubarkan trigger yang menempel padanya, dan trigger yatim itu akan
    // tetap ikut dihitung tiap `refresh()` setelah modulnya dibongkar.
    while (mobileTweens.length) {
      const tween = mobileTweens.pop();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    }
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

    // Baris hasil SplitText versi mobile diberi keadaan awal lewat `gsap.set()`,
    // dan `revert()` di atas sudah membuang pembungkusnya. Baris ini menjaga
    // kasus di mana revert gagal menemukan pembungkusnya (mis. markup disentuh
    // modul lain) supaya tidak ada teks yang tertinggal tersembunyi.
    $$('[data-about-title] .line, [data-about-text] .line').forEach((el) =>
      gsap.set(el, { clearProps: 'all' }),
    );
  },
};
