import type { AnimationModule } from '../core/module';
import { $$ } from '../core/utils';

/**
 * Interaksi kecil yang dipakai di seluruh halaman.
 *
 * Tombol menukar label sebagai satu baris utuh saat hover, bukan per kata,
 * supaya gerak scroll-nya tetap terbaca dan tidak patah-patah. Animasinya
 * sendiri hidup di CSS (`.word-swap`); yang dikerjakan di sini cuma menyiapkan
 * markup-nya.
 *
 * DIBUANG dari file ini: `buildLabels()`, yang membuka lebar `[data-label-pill]`
 * dari nol dengan `expo.inOut`. Selectornya mengembalikan NOL elemen - DIUKUR di
 * DOM langsung - karena label eyebrow yang dulu memakainya sudah dihapus dari
 * markup semua section. Bersama itu ikut hilang satu-satunya alasan file ini
 * mengimpor gsap dan ScrollTrigger.
 */

export const microModule: AnimationModule = {
  name: 'micro',
  skipOnReducedMotion: true,

  init() {
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
  },

  /**
   * Tidak ada `destroy`: pembungkus `.word-swap` sengaja dibiarkan menempel -
   * ia idempoten lewat `data-swap-ready`, dan membongkarnya tiap rebuild resize
   * hanya menambah pekerjaan DOM tanpa mengubah apa pun di layar.
   */
};
