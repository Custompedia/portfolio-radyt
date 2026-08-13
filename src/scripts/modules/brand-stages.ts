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

        const growth = $<HTMLElement>('[data-about-growth]', profile);
        const rings = growth ? $$<SVGCircleElement>('[data-growth-ring]', growth) : [];
        const marks = growth ? $$<SVGCircleElement>('[data-growth-mark]', growth) : [];
        const core = growth ? $<SVGCircleElement>('[data-growth-core]', growth) : null;
        if (growth && core && rings.length) {
          rings.forEach((ring) => {
            const length = ring.getTotalLength();
            gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length });
          });

          gsap.timeline({ scrollTrigger: { trigger: profile, start: 'top 76%', end: 'bottom 34%', scrub: 0.7 } })
            .fromTo(core, { scale: 0.35, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.18, ease: 'power2.out' })
            .to(rings, { strokeDashoffset: 0, stagger: 0.14, duration: 0.62, ease: 'power2.inOut' }, '-=0.08')
            .from(marks, { scale: 0, autoAlpha: 0, stagger: 0.09, duration: 0.18, ease: 'back.out(1.4)' }, '-=0.18');
        }
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
      const companyShowcases = companyGrid ? $$<HTMLElement>('[data-company-showcase]', companyGrid) : [];
      if (companyGrid && companyShowcases.length) {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: companyGrid, start: 'top 76%', toggleActions: 'play none none reverse' },
        });
        timeline
          .from(companyShowcases, {
            autoAlpha: 0,
            y: 42,
            stagger: { each: 0.13, from: 'center' },
            duration: 0.72,
            ease: 'power3.out',
          })
          .from($$<HTMLElement>('[data-company-logo]', companyGrid), {
            clipPath: 'inset(0 50% 0 50%)',
            scale: 0.82,
            rotation: (index) => (index % 2 ? 5 : -5),
            stagger: { each: 0.13, from: 'center' },
            duration: 0.78,
            ease: 'power4.out',
          }, '-=0.46');
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
