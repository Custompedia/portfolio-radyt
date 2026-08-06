import { Flip, gsap, SplitText } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

/**
 * Paragraf besar di section "What You Get".
 *
 * Reveal-nya per KARAKTER, bukan per kata, dan yang dianimasikan warnanya —
 * bukan cuma opacity. Bedanya terlihat: dengan opacity teksnya terbaca "belum
 * ada", dengan warna ia terbaca "belum dibaca". Itu yang membuat paragrafnya
 * terasa sedang disorot mengikuti scroll.
 *
 * Chip di sela-selanya adalah kartu kapabilitas yang mengerut. Diklik, GSAP
 * Flip menerbangkannya ke panel penuh layar dari posisinya di dalam kalimat —
 * jadi panelnya jelas berasal dari chip yang barusan ditekan, bukan muncul
 * entah dari mana.
 */

const DIM = '#e0dfc5';
const LIT = '#000000';

const splits: SplitText[] = [];
let tween: gsap.core.Tween | null = null;
let flipBound = false;

function buildReveal(lead: HTMLElement): void {
  const chars: Element[] = [];

  // Split hanya menyentuh `.lead-text`. Chip-nya elemen saudara, jadi ia tidak
  // pernah masuk ke dalam pemotongan — itulah gunanya paragraf ini dipecah jadi
  // beberapa span teks sejak di markup.
  //
  // `words,chars`, BUKAN `chars` saja. Membungkus tiap karakter jadi
  // inline-block membuat setiap huruf jadi titik putus baris yang sah, dan
  // paragrafnya memenggal kata di tengah ("penguk / uran"). Lapisan kata di
  // luarnya yang menahan kata tetap utuh.
  for (const text of $$<HTMLElement>('.lead-text', lead)) {
    const split = new SplitText(text, {
      type: 'words,chars',
      wordsClass: 'lead-word',
      charsClass: 'anim-char',
      aria: 'none',
    });
    splits.push(split);
    chars.push(...split.chars);
  }
  if (chars.length === 0) return;

  tween = gsap.fromTo(
    chars,
    { color: DIM, opacity: 0.1, y: 5 },
    {
      color: LIT,
      opacity: 1,
      y: 0,
      force3D: true,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: lead,
        start: 'top 92%',
        end: 'top 25%',
        scrub: 1,
      },
    },
  );
}

/**
 * Dipasang sekali seumur halaman: modul ini dibangun ulang saat resize, dan
 * listener yang dipasang ulang akan menumpuk.
 */
function buildFlip(): void {
  if (flipBound) return;

  const overlay = $<HTMLElement>('[data-capa-overlay]');
  const slot = $<HTMLElement>('[data-capa-slot]');
  const titleOut = $('[data-capa-title-out]');
  const bodyOut = $('[data-capa-body-out]');
  const panel = $<HTMLElement>('.capa-panel');
  if (!overlay || !slot || !titleOut || !bodyOut || !panel) return;

  flipBound = true;
  let open: HTMLElement | null = null;
  let home: { parent: Node; next: Node | null } | null = null;

  const expand = (chip: HTMLElement) => {
    if (open) return;

    open = chip;
    home = { parent: chip.parentNode!, next: chip.nextSibling };

    titleOut.textContent = chip.dataset.capaTitle ?? '';
    bodyOut.textContent = chip.dataset.capaBody ?? '';

    // State direkam SEBELUM chip dipindah — itu inti Flip: ia membandingkan
    // rect sebelum dan sesudah pemindahan, lalu menganimasikan selisihnya.
    const state = Flip.getState(chip);
    overlay.hidden = false;
    slot.appendChild(chip);
    chip.classList.add('is-expanded');

    Flip.from(state, { duration: 0.55, ease: 'expo.out', absolute: true });
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(
      [titleOut, bodyOut],
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.15, ease: 'expo.out' },
    );
    $<HTMLElement>('.capa-close', overlay)?.focus();
  };

  const collapse = () => {
    if (!open || !home) return;

    const chip = open;
    const spot = home;
    open = null;
    home = null;

    const state = Flip.getState(chip);
    spot.parent.insertBefore(chip, spot.next);
    chip.classList.remove('is-expanded');

    Flip.from(state, { duration: 0.45, ease: 'expo.inOut', absolute: true });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        overlay.hidden = true;
        chip.focus();
      },
    });
  };

  $$<HTMLElement>('[data-chip]').forEach((chip) => {
    chip.addEventListener('click', () => expand(chip));
  });

  $$<HTMLElement>('[data-capa-close]', overlay).forEach((button) => {
    button.addEventListener('click', collapse);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') collapse();
  });
}

export const leadParagraphModule: AnimationModule = {
  name: 'lead-paragraph',
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const lead = $<HTMLElement>('[data-capabilities-lead]');
    if (!lead) return;

    buildFlip();
    buildReveal(lead);
  },

  destroy() {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
    while (splits.length) splits.pop()?.revert();
  },
};
