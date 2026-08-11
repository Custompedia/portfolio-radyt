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
    const arrival = $<HTMLElement>('[data-packaging-arrival]');
    const outro = $<HTMLElement>('[data-packaging-outro]');
    if (!section || !box || !boxSpin || !shadow || !arrival || !outro) return;

    const intro = $$<HTMLElement>('[data-packaging-intro]', section);
    const details = $$<HTMLElement>('[data-packaging-detail]', section);
    const moments = $$<HTMLElement>('.packaging-test-moment', section);

    gsap.set(intro, { autoAlpha: 0, y: 36 });
    gsap.set(moments, { autoAlpha: 0, y: 28 });
    gsap.set(details, { autoAlpha: 0, scale: 0.82 });
    gsap.set(outro, { autoAlpha: 0, y: 28 });
    gsap.set(arrival, { autoAlpha: 0, scaleX: 0.15, transformOrigin: 'right center' });
    gsap.set(box, { scale: 0.42, xPercent: 150, y: 82 });
    gsap.set(boxSpin, { rotationX: -16, rotationY: -64, rotationZ: -8 });
    gsap.set(shadow, { scaleX: 0.25, opacity: 0.08 });

    timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=410%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(intro, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 })
      .to(arrival, { autoAlpha: 0.9, scaleX: 1, duration: 0.42 }, 0.2)
      .to(box, { scale: 1, xPercent: 0, y: 0, duration: 0.9, ease: 'power4.out' }, 0.28)
      .to(boxSpin, { rotationX: -6, rotationY: 18, rotationZ: 0, duration: 0.9 }, 0.28)
      .to(shadow, { scaleX: 1, opacity: 0.62, duration: 0.62 }, 0.5)
      .to(arrival, { autoAlpha: 0, duration: 0.25 }, 0.8)
      .to(boxSpin, { rotationX: -6, rotationY: 378, duration: 1.25, ease: 'none' }, 1.04)
      .to(moments[0], { autoAlpha: 1, y: 0, duration: 0.42 }, 1.54)
      .to(details, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.06 }, 1.62)
      .to(moments[1], { autoAlpha: 1, y: 0, duration: 0.42 }, 1.92)
      .to(moments[2], { autoAlpha: 1, y: 0, duration: 0.42 }, 2.28)
      .to([intro, moments, details], { autoAlpha: 0, y: -26, duration: 0.48, stagger: 0.03 }, 2.82)
      .to(box, { scale: 0.54, yPercent: -142, duration: 0.9 }, 2.96)
      .to(boxSpin, { rotationX: 0, rotationY: 396, duration: 0.9 }, 2.96)
      .to(shadow, { scaleX: 0.3, opacity: 0.08, duration: 0.64 }, 2.96)
      .to(outro, { autoAlpha: 1, y: 0, duration: 0.6 }, 3.5);
  },

  destroy() {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
    $$<HTMLElement>('[data-packaging-test] [data-packaging-intro], [data-packaging-test] [data-packaging-detail], [data-packaging-test] .packaging-test-moment, [data-packaging-test] [data-packaging-outro], [data-packaging-test] [data-packaging-arrival], [data-packaging-test] [data-packaging-box], [data-packaging-test] [data-packaging-spin], [data-packaging-test] [data-packaging-shadow]').forEach((element) => {
      gsap.set(element, { clearProps: 'all' });
    });
  },
};
