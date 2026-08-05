import { gsap, SplitText } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

/**
 * Paragraf besar di section "What You Get": kata demi kata menggelap mengikuti
 * scroll, dan chip ikon di sela-selanya membuka lebarnya saat gilirannya tiba.
 * Efeknya membaca seperti kalimat yang sedang diketik ulang oleh scroll.
 */

const splits: SplitText[] = [];
let timeline: gsap.core.Timeline | null = null;

export const leadParagraphModule: AnimationModule = {
  name: 'lead-paragraph',
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const lead = $('[data-capabilities-lead]');
    if (!lead) return;

    const words: Element[] = [];
    for (const text of $$('.lead-text', lead)) {
      const split = new SplitText(text, { type: 'words', wordsClass: 'word', aria: 'none' });
      splits.push(split);
      words.push(...split.words);
    }

    const chips = $$('[data-chip]', lead);
    if (words.length === 0) return;

    // Kata dan chip diurutkan ulang sesuai posisi aslinya di dalam paragraf,
    // supaya animasinya mengalir kiri-ke-kanan, bukan semua kata dulu lalu
    // semua chip.
    const ordered = [...words, ...chips].sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );

    gsap.set(words, { opacity: 0.16 });
    gsap.set(chips, { width: 0, opacity: 0, scale: 0.6 });

    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: lead,
        start: 'top 78%',
        end: 'bottom 55%',
        scrub: 1,
      },
    });

    ordered.forEach((el, i) => {
      const isChip = el.hasAttribute('data-chip');
      timeline!.to(
        el,
        isChip
          ? { width: 'auto', opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }
          : { opacity: 1, duration: 0.35 },
        i * 0.08,
      );
    });
  },

  destroy() {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
    while (splits.length) splits.pop()?.revert();
    const lead = $('[data-capabilities-lead]');
    if (lead) gsap.set($$('[data-chip]', lead), { clearProps: 'all' });
  },
};

/** Kata terakhir judul CTA yang berganti-ganti seperti papan jadwal. */
export const ctaRotatorModule: AnimationModule = {
  name: 'cta-rotator',
  skipOnReducedMotion: true,

  init() {
    const track = $('[data-cta-rotator-track]');
    const words = track ? $$('.cta-rotator-word', track) : [];
    if (!track || words.length < 2) return;

    const step = words[0]!.offsetHeight;
    let index = 0;

    rotator = window.setInterval(() => {
      index = (index + 1) % words.length;
      gsap.to(track, {
        y: -index * step,
        duration: 0.72,
        ease: 'power3.inOut',
      });
    }, 2400);
  },

  destroy() {
    if (rotator !== null) window.clearInterval(rotator);
    rotator = null;
  },
};

let rotator: number | null = null;
