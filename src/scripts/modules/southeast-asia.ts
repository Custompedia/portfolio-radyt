import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

let context: gsap.Context | null = null;

export const southeastAsiaModule: AnimationModule = {
  name: 'southeast-asia',
  skipOnReducedMotion: true,

  init() {
    const stage = $<HTMLElement>('[data-sea-stage]');
    if (!stage) return;

    context = gsap.context(() => {
      const local = $<HTMLElement>('[data-sea-local]', stage);
      const localMarker = $<HTMLElement>('[data-sea-local-marker]', stage);
      const java = $<HTMLElement>('[data-sea-java]', stage);
      const javaMarker = $<HTMLElement>('[data-sea-java-marker]', stage);
      const indonesia = $<HTMLElement>('[data-sea-indonesia]', stage);
      const indonesiaMarker = $<HTMLElement>('[data-sea-indonesia-marker]', stage);
      const region = $<HTMLElement>('[data-sea-region]', stage);
      const regionMarker = $<HTMLElement>('[data-sea-region-marker]', stage);
      const focus = $<HTMLElement>('[data-sea-focus]', stage);
      const ripples = $$<HTMLElement>('[data-sea-ripple]', stage);
      const title = $<HTMLElement>('[data-sea-title]', stage);
      if (!local || !localMarker || !java || !javaMarker || !indonesia || !indonesiaMarker || !region || !regionMarker || !focus || !title) return;

      gsap.set(local, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', transformOrigin: '50% 46%' });
      gsap.set(localMarker, { autoAlpha: 1, scale: 1, transformOrigin: '50% 100%' });
      gsap.set(java, { autoAlpha: 0, scale: 1.22, filter: 'blur(5px)', transformOrigin: '50% 42%' });
      gsap.set(javaMarker, { autoAlpha: 0, scale: 0.65, transformOrigin: '50% 50%' });
      gsap.set(indonesia, { autoAlpha: 0, scale: 1.28, filter: 'blur(6px)', transformOrigin: '37.5% 74%' });
      gsap.set(indonesiaMarker, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
      gsap.set(region, { autoAlpha: 0, scale: 1.38, filter: 'blur(7px)', transformOrigin: '36% 79%' });
      gsap.set(regionMarker, { autoAlpha: 0, scale: 0.5, transformOrigin: '50% 50%' });
      gsap.set(focus, { opacity: 0, scale: 0.15, transformOrigin: '50% 50%' });
      gsap.set(ripples, { opacity: 0, scale: 0.35, transformOrigin: '50% 50%' });
      gsap.set(title, { autoAlpha: 0, y: 14 });

      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } }).timeScale(1.36);

      timeline
        .to(local, { autoAlpha: 0, scale: 0.76, filter: 'blur(6px)', duration: 0.72 }, 0.35)
        .to(localMarker, { autoAlpha: 0, scale: 0.74, duration: 0.58 }, 0.39)
        .to(java, { autoAlpha: 1, duration: 0.55, ease: 'power1.inOut' }, 0.45)
        .to(java, { scale: 1, filter: 'blur(0px)', duration: 0.72 }, 0.45)
        .to(javaMarker, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'power2.out' }, 0.76)
        .to(java, { autoAlpha: 0, scale: 0.8, filter: 'blur(6px)', duration: 0.68 }, 1.12)
        .to(javaMarker, { autoAlpha: 0, scale: 0.72, duration: 0.46 }, 1.16)
        .to(indonesia, { autoAlpha: 1, duration: 0.58, ease: 'power1.inOut' }, 1.2)
        .to(indonesia, { scale: 1, filter: 'blur(0px)', duration: 0.78 }, 1.2)
        .to(indonesiaMarker, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'power2.out' }, 1.56)
        .to(indonesia, { autoAlpha: 0, scale: 0.82, filter: 'blur(6px)', duration: 0.72 }, 1.88)
        .to(indonesiaMarker, { autoAlpha: 0, scale: 0.72, duration: 0.48 }, 1.92)
        .to(region, { autoAlpha: 1, duration: 0.64, ease: 'power1.inOut' }, 1.98)
        .to(region, { scale: 1, filter: 'blur(0px)', duration: 0.9 }, 1.98)
        .to(regionMarker, { autoAlpha: 1, scale: 1, duration: 0.36, ease: 'back.out(1.4)' }, 2.58)
        .to(focus, { opacity: 0.24, scale: 5, duration: 1.02, ease: 'power2.out' }, 2.68)
        .to(focus, { opacity: 0.08, duration: 0.2, ease: 'power1.out' }, 3.7)
        .to(
          ripples,
          { opacity: 0.26, scale: 0.55, duration: 0.12, stagger: 0.13, ease: 'power1.out' },
          2.7,
        )
        .to(
          ripples,
          {
            opacity: 0,
            scale: 4.6,
            duration: 1.08,
            stagger: 0.13,
            ease: 'power2.out',
          },
          2.78,
        )
        .to(title, { autoAlpha: 1, y: 0, duration: 0.66, ease: 'power2.out' }, 3.08);

      ScrollTrigger.create({
        trigger: stage,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const images = $$<HTMLImageElement>('img', stage);
          void Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => timeline.play());
        },
      });
    }, stage);
  },

  destroy() {
    context?.revert();
    context = null;
  },
};
