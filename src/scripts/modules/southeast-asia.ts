import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $ } from '../core/utils';

let context: gsap.Context | null = null;

export const southeastAsiaModule: AnimationModule = {
  name: 'southeast-asia',
  skipOnReducedMotion: false,
  rebuildOnResize: true,

  init() {
    const section = $<HTMLElement>('[data-sea-section]');
    const stage = $<HTMLElement>('[data-sea-stage]');
    const video = $<HTMLVideoElement>('[data-sea-video]');
    const head = $<HTMLElement>('.sea-head', section || undefined);
    if (!section || !stage) return;

    video?.addEventListener('loadeddata', () => ScrollTrigger.refresh(), { once: true });

    context = gsap.context(() => {
      // 1. Header entrance saat mendekat
      if (head) {
        gsap.fromTo(
          head,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
          },
        );
      }

      // 2. Video Stage:
      //    Pacing seimbang tanpa membuat jarak kosong berlebih di bawahnya
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          end: 'bottom 10%',
          scrub: 1.0,
        },
      });

      // Animasi IN: Frame membesar dari bawah ke ukuran penuh
      tl.fromTo(
        stage,
        {
          y: '35vh',
          scale: 0.5,
          opacity: 0,
          transformOrigin: 'center center',
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'power1.out',
          duration: 1.8,
        },
      );

      // Posisi Tengah (Hold saat ditonton)
      tl.to(stage, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.9,
      });

      // Animasi OUT: Frame mengecil ke atas saat scroll keluar
      tl.to(stage, {
        y: '-25vh',
        scale: 0.72,
        opacity: 0.1,
        ease: 'power1.in',
        duration: 1.3,
      });

      // Header exit: Meluncur ke atas
      if (head) {
        tl.to(
          head,
          {
            y: -50,
            opacity: 0,
            duration: 1.3,
            ease: 'power1.in',
          },
          '>-1.3',
        );
      }

      // 3. Playback video otomatis
      if (video) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            void video.play().catch(() => undefined);
          },
          onEnterBack: () => {
            void video.play().catch(() => undefined);
          },
          onLeave: () => {
            video.pause();
          },
          onLeaveBack: () => {
            video.pause();
          },
        });
      }
    }, section);
  },

  destroy() {
    context?.revert();
    context = null;
    const stage = $<HTMLElement>('[data-sea-stage]');
    const head = $<HTMLElement>('.sea-head');
    if (stage) gsap.set(stage, { clearProps: 'all' });
    if (head) gsap.set(head, { clearProps: 'all' });
  },
};
