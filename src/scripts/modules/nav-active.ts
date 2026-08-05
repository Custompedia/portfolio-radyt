import { ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

/** Menyorot link sidebar sesuai section yang sedang dibaca. */

const triggers: ScrollTrigger[] = [];

function activate(id: string): void {
  for (const link of $$('[data-nav-link]')) {
    link.classList.toggle('is-active', link.dataset.navLink === id);
  }
}

export const navActiveModule: AnimationModule = {
  name: 'nav-active',
  rebuildOnResize: true,

  init() {
    for (const link of $$('[data-nav-link]')) {
      const id = link.dataset.navLink;
      const section = id ? $(`#${id}`) : null;
      if (!id || !section) continue;

      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) activate(id);
          },
        }),
      );
    }
  },

  destroy() {
    while (triggers.length) triggers.pop()?.kill();
  },
};
