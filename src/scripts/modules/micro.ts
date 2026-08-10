import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $$ } from '../core/utils';

/**
 * Interaksi kecil yang dipakai di seluruh halaman.
 *
 * Pill label membuka lebarnya dari nol, bukan memudar. Gerakannya horizontal,
 * searah dengan cara mata membaca label — itu sebabnya ia terasa "dibuka",
 * bukan "dinyalakan".
 * Tombol menukar label sebagai satu baris utuh saat hover, bukan per kata,
 * supaya gerak scroll-nya tetap terbaca dan tidak patah-patah.
 */
const triggers: ScrollTrigger[] = [];

function buildLabels(): void {
  for (const pill of $$<HTMLElement>('[data-label-pill]')) {
    const tween = gsap.fromTo(
      pill,
      { width: 0, opacity: 0 },
      {
        width: 'auto',
        opacity: 1,
        duration: 0.7,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: pill, start: 'top 90%', once: true },
      },
    );
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  }
}

function buildButtonHover(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  for (const button of $$<HTMLElement>('[data-button-hover]')) {
    const label = button.querySelector<HTMLElement>('.btn-label');
    if (!label || label.dataset.swapReady) continue;

    const wrap = document.createElement('span');
    wrap.className = 'word-swap';
    label.parentNode?.insertBefore(wrap, label);
    wrap.appendChild(label);

    const clone = label.cloneNode(true) as HTMLElement;
    clone.classList.add('word-swap-clone');
    clone.setAttribute('aria-hidden', 'true');
    wrap.appendChild(clone);

    label.dataset.swapReady = '1';
  }
}

export const microModule: AnimationModule = {
  name: 'micro',
  skipOnReducedMotion: true,

  init() {
    buildLabels();
    buildButtonHover();
  },

  destroy() {
    while (triggers.length) triggers.pop()?.kill();
    $$('[data-label-pill]').forEach((pill) => gsap.set(pill, { clearProps: 'width,opacity' }));
  },
};
