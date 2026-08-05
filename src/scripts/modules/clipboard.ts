import type { AnimationModule } from '../core/module';
import { $$ } from '../core/utils';

/** Tombol apa pun ber-`data-copy` menyalin isinya dan memberi konfirmasi. */

const cleanups: Array<() => void> = [];

export const clipboardModule: AnimationModule = {
  name: 'clipboard',

  init() {
    for (const button of $$('[data-copy]')) {
      const value = button.dataset.copy;
      if (!value) continue;

      let reset: number | undefined;

      const onClick = async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          // Clipboard API butuh konteks aman dan bisa ditolak user; kalau gagal
          // jangan bohong dengan menampilkan "Copied".
          return;
        }

        button.classList.add('is-copied');
        const done = button.querySelector('.nav-email-done');
        if (done) done.textContent = 'Copied';

        window.clearTimeout(reset);
        reset = window.setTimeout(() => {
          button.classList.remove('is-copied');
          if (done) done.textContent = '';
        }, 1600);
      };

      button.addEventListener('click', onClick);
      cleanups.push(() => {
        window.clearTimeout(reset);
        button.removeEventListener('click', onClick);
      });
    }
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
  },
};
