import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

let timeline: gsap.core.Timeline | null = null;

export const packagingTestModule: AnimationModule = {
  name: 'packaging-test',
  desktopOnly: true,
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const section = $<HTMLElement>('[data-packaging-test]');
    const box = $<HTMLElement>('[data-packaging-box]');
    const boxSpin = $<HTMLElement>('[data-packaging-spin]');
    const shadow = $<HTMLElement>('[data-packaging-shadow]');
    const outro = $<HTMLElement>('[data-packaging-outro]');
    if (!section || !box || !boxSpin || !shadow || !outro) return;

    const intro = $$<HTMLElement>('[data-packaging-intro]', section);
    const moments = $$<HTMLElement>('.packaging-test-moment', section);

    gsap.set(intro, { autoAlpha: 0, y: 36 });
    gsap.set(moments, { autoAlpha: 0, y: 28 });
    gsap.set(outro, { autoAlpha: 0, y: 28 });
    gsap.set(box, { scale: 0.46, y: 96 });
    gsap.set(boxSpin, { rotationX: -12, rotationY: -42, rotationZ: 0 });
    gsap.set(shadow, { scaleX: 0.5, opacity: 0.16 });

    timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=340%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(intro, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 })
      .to(box, { scale: 1, y: 0, duration: 0.95 }, 0.12)
      .to(boxSpin, { rotationX: -6, rotationY: 18, duration: 0.95 }, 0.12)
      .to(shadow, { scaleX: 1, opacity: 0.62, duration: 0.75 }, 0.24)
      .to(moments[0], { autoAlpha: 1, y: 0, duration: 0.45 }, 0.9)
      .to(box, { yPercent: -8, scale: 1.04, duration: 0.85 }, 1.32)
      .to(boxSpin, { rotationX: 8, rotationY: 126, duration: 0.85 }, 1.32)
      .to(moments[1], { autoAlpha: 1, y: 0, duration: 0.45 }, 1.48)
      .to(box, { yPercent: 0, scale: 1, duration: 0.95 }, 2.02)
      .to(boxSpin, { rotationX: -10, rotationY: 244, duration: 0.95 }, 2.02)
      .to(moments[2], { autoAlpha: 1, y: 0, duration: 0.45 }, 2.22)
      .to([intro, moments], { autoAlpha: 0, y: -26, duration: 0.5, stagger: 0.03 }, 2.78)
      .to(box, { scale: 0.42, yPercent: -88, duration: 0.85 }, 2.9)
      .to(boxSpin, { rotationX: 0, rotationY: 360, duration: 0.85 }, 2.9)
      .to(shadow, { scaleX: 0.4, opacity: 0.16, duration: 0.65 }, 2.9)
      .to(outro, { autoAlpha: 1, y: 0, duration: 0.6 }, 3.32);
  },

  destroy() {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
    $$<HTMLElement>('[data-packaging-test] [data-packaging-intro], [data-packaging-test] .packaging-test-moment, [data-packaging-test] [data-packaging-outro], [data-packaging-test] [data-packaging-box], [data-packaging-test] [data-packaging-spin], [data-packaging-test] [data-packaging-shadow]').forEach((element) => {
      gsap.set(element, { clearProps: 'all' });
    });
  },
};
