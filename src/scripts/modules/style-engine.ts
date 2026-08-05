import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $$, isDesktop, parseVars } from '../core/utils';

/**
 * STYLE ENGINE — animasi deklaratif lewat atribut.
 *
 * Ini pola yang membuat situs referensi punya 163 ScrollTrigger tanpa 163 blok
 * kode: hampir tiap elemen membawa resepnya sendiri di markup.
 *
 *   data-tl-type="scroll"                 → ter-scrub ke scroll (default: play/reverse)
 *   data-tl-trigger=".selector"           → default: elemen itu sendiri
 *   data-tl-start / data-tl-end           → sintaks ScrollTrigger biasa
 *   data-tl-from / data-tl-to             → vars GSAP, JSON kutip tunggal
 *   data-tl-target=".child"               → animasikan anak, bukan elemennya
 *   data-tl-stagger="0.06"
 *   data-tl-once                          → jalan sekali, tidak dibalik
 *   data-tl-desktop                       → lewati di bawah 768px
 */

const created: ScrollTrigger[] = [];

function build(el: HTMLElement): void {
  if (el.hasAttribute('data-tl-desktop') && !isDesktop()) return;

  const scrubbed = el.dataset.tlType === 'scroll';
  const once = el.hasAttribute('data-tl-once');

  const triggerSelector = el.dataset.tlTrigger;
  const trigger = triggerSelector ? document.querySelector(triggerSelector) : el;
  if (!trigger) return;

  const targets = el.dataset.tlTarget ? $$(el.dataset.tlTarget, el) : el;
  if (Array.isArray(targets) && targets.length === 0) return;

  const fromVars = parseVars(el.dataset.tlFrom ?? null);
  const toVars = parseVars(el.dataset.tlTo ?? null);

  const scrollTrigger: ScrollTrigger.Vars = {
    trigger,
    start: el.dataset.tlStart ?? (scrubbed ? 'top top' : 'top 85%'),
    end: el.dataset.tlEnd ?? (scrubbed ? 'bottom top' : undefined),
    scrub: scrubbed ? 1 : false,
    toggleActions: scrubbed ? undefined : once ? 'play none none none' : 'play none none reverse',
    once: once || undefined,
  };

  const tween = gsap.fromTo(targets, fromVars, {
    duration: 0.7,
    ease: 'power2.out',
    stagger: Number(el.dataset.tlStagger ?? 0),
    ...toVars,
    scrollTrigger,
  });

  const instance = tween.scrollTrigger;
  if (instance) created.push(instance);
}

/**
 * Penghitung angka bergaya odometer: tiap digit adalah kolom 0–9 di dalam mask
 * yang digeser sampai angka yang benar berhenti di jendela. Jauh lebih enak
 * dilihat daripada menge-tween nilai teksnya.
 */
function buildCounter(el: HTMLElement): void {
  const raw = el.dataset.numberCount ?? el.textContent?.trim() ?? '';
  if (!raw) return;

  const chars = [...raw];
  el.textContent = '';
  el.classList.add('digit-row');

  const tracks: HTMLElement[] = [];

  for (const char of chars) {
    if (!/\d/.test(char)) {
      const literal = document.createElement('span');
      literal.className = 'digit-literal';
      literal.textContent = char;
      el.appendChild(literal);
      continue;
    }

    const mask = document.createElement('span');
    mask.className = 'digit-mask';
    const track = document.createElement('span');
    track.className = 'digit-track';
    for (let n = 0; n <= 9; n += 1) {
      const digit = document.createElement('span');
      digit.className = 'digit';
      digit.textContent = String(n);
      track.appendChild(digit);
    }
    track.dataset.target = char;
    mask.appendChild(track);
    el.appendChild(mask);
    tracks.push(track);
  }

  if (tracks.length === 0) return;

  const timeline = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  });

  tracks.forEach((track, i) => {
    const height = track.parentElement?.offsetHeight ?? 0;
    const target = Number(track.dataset.target);
    gsap.set(track, { y: height * 9 });
    timeline.to(track, { y: -target * height, duration: 1.2, ease: 'power3.out' }, i * 0.06);
  });

  if (timeline.scrollTrigger) created.push(timeline.scrollTrigger);
}

export const styleEngineModule: AnimationModule = {
  name: 'style-engine',
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    $$('[data-number-count]').forEach(buildCounter);
    $$('[data-tl-from], [data-tl-to]').forEach(build);
  },

  destroy() {
    while (created.length) created.pop()?.kill();
    $$('[data-tl-from], [data-tl-to]').forEach((el) => gsap.set(el, { clearProps: 'all' }));
  },
};
