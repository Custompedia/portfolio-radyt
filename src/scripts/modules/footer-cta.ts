import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $ } from '../core/utils';

let timeline: gsap.core.Timeline | null = null;

export const footerCtaModule: AnimationModule = {
  name: 'footer-cta',
  skipOnReducedMotion: true,

  init() {
    const footer = $<HTMLElement>('[data-footer-cta]');
    if (!footer) return;

    const targets = [
      footer.querySelector<HTMLElement>('.contact-kicker'),
      footer.querySelector<HTMLElement>('.contact-headline'),
      footer.querySelector<HTMLElement>('.contact-bottom'),
    ].filter((target): target is HTMLElement => target instanceof HTMLElement);

    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 82%',
        end: 'bottom 72%',
        toggleActions: 'play none none reverse',
      },
    });
    timeline.fromTo(targets, { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.1, ease: 'power3.out' });
  },

  destroy() {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
  },
};
