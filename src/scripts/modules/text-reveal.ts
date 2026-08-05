import { gsap, ScrollTrigger, SplitText } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $$ } from '../core/utils';

/**
 * Reveal teks baris-per-baris. Tiap baris dibungkus mask ber-`overflow:hidden`
 * lalu digeser naik dari bawah mask-nya, jadi hurufnya seolah muncul dari balik
 * garis — bukan sekadar fade.
 *
 * Dipisah dari StyleEngine karena ini pola yang dipakai puluhan kali; menulis
 * `data-tl-from`/`data-tl-to` lengkap di tiap heading hanya jadi kebisingan.
 */

const splits: SplitText[] = [];

function reveal(el: HTMLElement): void {
  if (el.dataset.splitDone === 'true') return;

  const type = (el.dataset.reveal || 'lines') as 'lines' | 'words' | 'chars';

  const split = new SplitText(el, {
    type,
    linesClass: 'line',
    wordsClass: 'word',
    charsClass: 'char',
    // Default SplitText memasang aria-label di elemen induk. Pada <p> dan <h2>
    // atribut itu terlarang menurut ARIA dan merusak accessibility tree —
    // teksnya sendiri tetap utuh di DOM, jadi pembaca layar tidak kehilangan
    // apa pun kalau kita mematikannya.
    aria: 'none',
  });
  splits.push(split);
  el.dataset.splitDone = 'true';

  const targets = type === 'lines' ? split.lines : type === 'words' ? split.words : split.chars;

  if (type === 'lines') {
    split.lines.forEach((line) => {
      if (line.parentElement?.classList.contains('line-mask')) return;
      const mask = document.createElement('div');
      mask.className = 'line-mask';
      line.parentNode?.insertBefore(mask, line);
      mask.appendChild(line);
    });
  }

  gsap.fromTo(
    targets,
    { yPercent: 115, opacity: type === 'lines' ? 1 : 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: Number(el.dataset.revealStagger ?? 0.08),
      scrollTrigger: {
        trigger: el.dataset.revealTrigger ? document.querySelector(el.dataset.revealTrigger)! : el,
        start: el.dataset.revealStart ?? 'top 88%',
        once: true,
      },
    },
  );
}

export const textRevealModule: AnimationModule = {
  name: 'text-reveal',
  skipOnReducedMotion: true,

  init() {
    $$('[data-reveal]').forEach(reveal);
  },

  destroy() {
    while (splits.length) splits.pop()?.revert();
    $$('[data-reveal]').forEach((el) => delete el.dataset.splitDone);
    ScrollTrigger.getAll().forEach((instance) => {
      const trigger = instance.vars.trigger;
      if (trigger instanceof HTMLElement && trigger.hasAttribute('data-reveal')) instance.kill();
    });
  },
};
