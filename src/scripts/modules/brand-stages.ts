import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, prefersReducedMotion } from '../core/utils';

let context: gsap.Context | null = null;

export const brandStagesModule: AnimationModule = {
  name: 'brand-stages',
  skipOnReducedMotion: true,

  init() {
    if (prefersReducedMotion()) return;

    context = gsap.context(() => {
      const profile = $<HTMLElement>('[data-about-profile]');
      if (profile) {
        gsap.from(profile, {
          autoAlpha: 0,
          y: 48,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: profile, start: 'top 78%', once: true },
        });
      }

      const about = $<HTMLElement>('[data-about-stories]');
      const stories = about ? $$<HTMLElement>('[data-about-story]', about) : [];
      if (about && stories.length) {
        gsap.from(stories, {
          opacity: 0,
          y: 42,
          rotateX: -9,
          transformOrigin: '50% 100%',
          stagger: 0.13,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: about, start: 'top 76%', once: true },
        });
      }

      const companyGrid = $<HTMLElement>('.company-grid');
      const companyCards = companyGrid ? $$<HTMLElement>('.company-card', companyGrid) : [];
      if (companyGrid && companyCards.length) {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: companyGrid, start: 'top 72%', once: true } });
        timeline
          .from(companyCards, { opacity: 0, y: 56, stagger: 0.14, duration: 0.8, ease: 'power4.out' })
          .from($$<HTMLElement>('[data-company-logo]', companyGrid), { clipPath: 'inset(100% 0 0 0)', yPercent: 18, stagger: 0.14, duration: 0.7, ease: 'power4.out' }, 0.16);
      }

      const network = $<HTMLElement>('.network-body');
      const logos = network ? $$<HTMLElement>('[data-network-logo]', network) : [];
      if (network && logos.length) {
        gsap.from(logos, {
          opacity: 0,
          scale: 0.78,
          y: 24,
          stagger: { each: 0.06, from: 'start' },
          duration: 0.72,
          ease: 'back.out(1.45)',
          scrollTrigger: { trigger: network, start: 'top 76%', once: true },
        });
      }
    });
  },

  destroy() {
    context?.revert();
    context = null;
  },
};
