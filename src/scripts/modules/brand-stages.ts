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
      const active = network ? $$<HTMLElement>('[data-network-active]', network) : [];
      const trusted = network ? $$<HTMLElement>('[data-network-trusted]', network) : [];
      if (network && (active.length || trusted.length)) {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: network, start: 'top 74%', toggleActions: 'play none none reverse' },
        });

        timeline
          .from(active, {
            autoAlpha: 0,
            x: (index) => (index % 2 ? 42 : -42),
            y: (index) => (index % 2 ? 20 : -20),
            rotation: (index) => (index % 2 ? 4 : -4),
            scale: 0.86,
            stagger: { each: 0.1, from: 'center' },
            duration: 0.78,
            ease: 'power3.out',
          })
          .from(trusted, {
            autoAlpha: 0,
            y: 28,
            scale: 0.82,
            stagger: { each: 0.08, from: 'center' },
            duration: 0.68,
            ease: 'back.out(1.35)',
          }, '-=0.34');
      }
    });
  },

  destroy() {
    context?.revert();
    context = null;
  },
};
