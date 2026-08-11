import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop, prefersReducedMotion } from '../core/utils';
import type { PediPose, PediSceneController } from './pedi-scene';

let timeline: gsap.core.Timeline | null = null;
let observer: IntersectionObserver | null = null;
let pedi: PediSceneController | null = null;
let generation = 0;

const pose: PediPose = { turn: 0, focus: 0 };

export const packagingTestModule: AnimationModule = {
  name: 'packaging-test',
  rebuildOnResize: true,

  init() {
    const section = $<HTMLElement>('[data-packaging-test]');
    const stage = $<HTMLElement>('[data-pedi-stage]');
    const canvas = $<HTMLCanvasElement>('[data-pedi-canvas]');
    const shadow = $<HTMLElement>('[data-pedi-shadow]');
    const arrival = $<HTMLElement>('[data-packaging-arrival]');
    const outro = $<HTMLElement>('[data-packaging-outro]');
    if (!section || !stage || !canvas || !shadow || !arrival || !outro) return;

    const run = ++generation;
    const intro = $$<HTMLElement>('[data-packaging-intro]', section);
    const details = $$<HTMLElement>('[data-packaging-detail]', section);
    const moments = $$<HTMLElement>('.packaging-test-moment', section);
    const renderPedi = () => pedi?.render(pose);
    let loading = false;

    const loadPedi = async (): Promise<void> => {
      if (loading || pedi) return;
      loading = true;
      observer?.disconnect();
      try {
        const { createPediScene } = await import('./pedi-scene');
        const controller = await createPediScene(canvas, document.documentElement.classList.contains('performance-lite'));
        if (run !== generation) {
          controller.dispose();
          return;
        }
        pedi = controller;
        stage.dataset.state = 'ready';
        pedi.render(pose);
      } catch (error) {
        if (run !== generation) return;
        stage.dataset.state = 'error';
        console.error('[motion] Pedi gagal dimuat', error);
      }
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadPedi();
      }, { rootMargin: '900px 0px' });
      observer.observe(section);
    } else {
      void loadPedi();
    }

    pose.turn = 0;
    pose.focus = 0;

    if (!isDesktop() || window.innerWidth <= 1100 || prefersReducedMotion()) return;

    pose.turn = -Math.PI * 1.5;
    gsap.set(intro, { autoAlpha: 0, y: 36 });
    gsap.set(moments, { autoAlpha: 0, y: 28 });
    gsap.set(details, { autoAlpha: 0, scale: 0.82 });
    gsap.set(outro, { autoAlpha: 0, y: 28 });
    gsap.set(arrival, { autoAlpha: 0, scaleX: 0.15, transformOrigin: 'right center' });
    gsap.set(stage, { autoAlpha: 0, scale: 0.72, xPercent: -145, yPercent: 12, rotation: -7, transformOrigin: '50% 72%' });
    gsap.set(shadow, { scaleX: 0.22, opacity: 0.06, xPercent: -118 });

    timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onUpdate: renderPedi,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=560%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(intro, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 })
      .to(arrival, { autoAlpha: 0.9, scaleX: 1, duration: 0.42 }, 0.18)
      .to(stage, { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0, rotation: 0, duration: 0.92, ease: 'power4.out' }, 0.24)
      .to(shadow, { scaleX: 1, opacity: 0.62, xPercent: 0, duration: 0.72 }, 0.42)
      .to(arrival, { autoAlpha: 0, duration: 0.24 }, 0.86)
      .to(pose, { turn: 0, duration: 1.06, ease: 'power2.inOut' }, 0.62)
      .to(moments[0], { autoAlpha: 1, y: 0, duration: 0.42 }, 1.28)
      .to(details, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.06 }, 1.38)
      .to(moments[1], { autoAlpha: 1, y: 0, duration: 0.42 }, 1.82)
      .to(moments[2], { autoAlpha: 1, y: 0, duration: 0.42 }, 2.28)
      .to([intro, moments, details], { autoAlpha: 0, y: -26, duration: 0.48, stagger: 0.03 }, 2.78)
      .to(outro, { autoAlpha: 1, y: 0, duration: 0.58 }, 3.08)
      .to(outro, { autoAlpha: 0, y: -22, duration: 0.36 }, 3.78)
      .to(shadow, { scaleX: 0.72, opacity: 0, duration: 0.4 }, 3.82)
      .to(pose, { focus: 1, duration: 1.25, ease: 'power2.inOut' }, 4.18)
      .to(pose, { focus: 1, duration: 0.62, ease: 'none' }, 5.43);
  },

  destroy() {
    generation += 1;
    observer?.disconnect();
    observer = null;
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
    pedi?.dispose();
    pedi = null;
    const stage = $<HTMLElement>('[data-pedi-stage]');
    if (stage) stage.dataset.state = 'loading';
    $$<HTMLElement>('[data-packaging-test] [data-packaging-intro], [data-packaging-test] [data-packaging-detail], [data-packaging-test] .packaging-test-moment, [data-packaging-test] [data-packaging-outro], [data-packaging-test] [data-packaging-arrival], [data-packaging-test] [data-pedi-stage], [data-packaging-test] [data-pedi-shadow]').forEach((element) => {
      gsap.set(element, { clearProps: 'all' });
    });
  },
};
