import { gsap, ScrollTrigger, SplitText } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $$ } from '../core/utils';

/**
 * Dua interaksi kecil yang dipakai di seluruh halaman.
 *
 *  1. PILL LABEL membuka lebarnya dari nol, bukan memudar. Gerakannya
 *     horizontal, searah dengan cara mata membaca label — itu sebabnya ia
 *     terasa "dibuka", bukan "dinyalakan".
 *
 *  2. HOVER TOMBOL menukar kata: teks asli naik keluar sementara klonnya masuk
 *     dari bawah, per kata dengan stagger. Salinan A dan B bergantian tiap
 *     hover, jadi tidak ada momen reset yang terlihat kalau kursor bolak-balik
 *     dengan cepat.
 */

const splits: SplitText[] = [];
const triggers: ScrollTrigger[] = [];
const cleanups: Array<() => void> = [];

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

    // Bungkus + klon dibuat sekali, di sini — bukan di markup — supaya setiap
    // tombol tetap satu elemen sederhana di Astro.
    const wrap = document.createElement('span');
    wrap.className = 'word-swap';
    label.parentNode?.insertBefore(wrap, label);
    wrap.appendChild(label);

    const clone = label.cloneNode(true) as HTMLElement;
    clone.classList.add('word-swap-clone');
    clone.setAttribute('aria-hidden', 'true');
    wrap.appendChild(clone);

    label.dataset.swapReady = '1';

    const splitA = new SplitText(label, { type: 'words', wordsClass: 'word', aria: 'none' });
    const splitB = new SplitText(clone, { type: 'words', wordsClass: 'word', aria: 'none' });
    splits.push(splitA, splitB);

    let showingA = true;

    // Geser sedikit lebih jauh dari 100% (misal 130%) karena beberapa font (seperti Satoshi)
    // punya huruf (g, y, j, dsb) yang ekornya memanjang ke luar dari bounding box line-height: 1.
    // Jika hanya digeser 100%, ekor huruf tersebut akan masih mengintip dari atas/bawah.
    gsap.set(splitB.words, { yPercent: 130 });

    const onEnter = () => {
      const out = showingA ? splitA.words : splitB.words;
      const inbound = showingA ? splitB.words : splitA.words;
      showingA = !showingA;

      // Gunakan overwrite: true agar tidak bertumpuk jika kursor masuk-keluar dengan cepat
      gsap.to(out, { yPercent: -130, duration: 0.5, stagger: 0.05, ease: 'power2.out', overwrite: true });
      gsap.fromTo(
        inbound,
        { yPercent: 130 },
        { yPercent: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', overwrite: true },
      );
    };

    button.addEventListener('pointerenter', onEnter);
    cleanups.push(() => button.removeEventListener('pointerenter', onEnter));
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
    while (cleanups.length) cleanups.pop()?.();
    $$('[data-label-pill]').forEach((pill) => gsap.set(pill, { clearProps: 'width,opacity' }));
  },
};
