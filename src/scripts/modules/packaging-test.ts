import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop, prefersReducedMotion } from '../core/utils';
import type { PediPose, PediSceneController } from './pedi-scene';

let timeline: gsap.core.Timeline | null = null;
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
    const outro = $<HTMLElement>('[data-packaging-outro]');
    const handoff = $<HTMLElement>('[data-packaging-handoff]');
    if (!section || !stage || !canvas || !shadow || !outro || !handoff) return;

    const run = ++generation;
    const intro = $$<HTMLElement>('[data-packaging-intro]', section);
    const moments = $$<HTMLElement>('.packaging-test-moment', section);
    const orbits = $<HTMLElement>('[data-pedi-orbits]', section);
    const renderPedi = () => pedi?.render(pose);
    let loading = false;

    const loadPedi = async (): Promise<void> => {
      if (loading || pedi) return;
      loading = true;
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

    void loadPedi();

    pose.turn = 0;
    pose.focus = 0;

    if (!isDesktop() || window.innerWidth <= 1100 || prefersReducedMotion()) return;

    pose.turn = -Math.PI * 1.5;
    gsap.set(intro, { autoAlpha: 0, y: 36 });
    gsap.set(moments, { autoAlpha: 0, y: 28 });
    gsap.set(orbits, { autoAlpha: 0, scale: 0.72, rotation: -8 });
    gsap.set(outro, { autoAlpha: 0, y: 28 });
    gsap.set(stage, { autoAlpha: 0, scale: 0.72, xPercent: -145, yPercent: 12, rotation: -7, transformOrigin: '50% 72%' });
    gsap.set(shadow, { scaleX: 0.22, opacity: 0.06, xPercent: -118 });
    gsap.set(handoff, { autoAlpha: 0, yPercent: 45 });

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
      .to(stage, { autoAlpha: 1, scale: 1, xPercent: 3, yPercent: 0, rotation: 0, duration: 0.92, ease: 'power4.out' }, 0.24)
      .to(shadow, { scaleX: 1, opacity: 0.62, xPercent: 0, duration: 0.72 }, 0.42)
      .to(orbits, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.86, ease: 'power3.out' }, 0.58)
      .to(pose, { turn: 0, duration: 1.06, ease: 'power2.inOut' }, 0.62)
      .to(moments[0], { autoAlpha: 1, y: 0, duration: 0.42 }, 1.28)
      .to(moments[1], { autoAlpha: 1, y: 0, duration: 0.42 }, 1.82)
      .to(moments[2], { autoAlpha: 1, y: 0, duration: 0.42 }, 2.28)
      .to([intro, moments], { autoAlpha: 0, y: -26, duration: 0.48, stagger: 0.03 }, 2.78)
      .to(outro, { autoAlpha: 1, y: 0, duration: 0.58 }, 3.08)
      .to(outro, { autoAlpha: 0, y: -22, duration: 0.36 }, 3.78)
      .to(orbits, { autoAlpha: 0, scale: 1.08, duration: 0.46 }, 3.78)
      .to(shadow, { scaleX: 0.72, opacity: 0, duration: 0.4 }, 3.82)
      .to(stage, { xPercent: 0, duration: 0.52, ease: 'power2.inOut' }, 3.82)
      .to(pose, { focus: 1, duration: 1.25, ease: 'power2.inOut' }, 4.18)
      .to(pose, { focus: 1, duration: 0.62, ease: 'none' }, 5.43)
      .to(handoff, { autoAlpha: 1, yPercent: 0, duration: 0.62, ease: 'power2.out' }, 5.43);
  },

  destroy() {
    generation += 1;
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
    pedi?.dispose();
    pedi = null;
    const stage = $<HTMLElement>('[data-pedi-stage]');
    if (stage) stage.dataset.state = 'loading';
    $$<HTMLElement>('[data-packaging-test] [data-packaging-intro], [data-packaging-test] .packaging-test-moment, [data-packaging-test] [data-packaging-outro], [data-packaging-test] [data-pedi-orbits], [data-packaging-test] [data-pedi-stage], [data-packaging-test] [data-pedi-shadow], [data-packaging-test] [data-packaging-handoff]').forEach((element) => {
      gsap.set(element, { clearProps: 'all' });
    });
  },
};
