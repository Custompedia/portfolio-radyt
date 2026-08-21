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

    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      // Tidak diputar di sini - ScrollTrigger di bawah yang memicunya saat section masuk layar.
      video.addEventListener('loadeddata', () => ScrollTrigger.refresh(), { once: true });
    }

    const isMobile = window.innerWidth <= 767;

    context = gsap.context(() => {
      // 1. Header entrance saat mendekat
      if (head) {
        gsap.fromTo(
          head,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      // 2. Video Stage:
      if (isMobile) {
        // Pada mobile: pastikan stage selalu tampil 100% jelas, terang, dan tidak mengecil/hitam
        gsap.set(stage, { y: 0, scale: 1, opacity: 1 });
        gsap.fromTo(
          stage,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      } else {
        // Desktop: Pacing seimbang cinematic scroll-scrub
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'bottom 10%',
            scrub: 1.0,
          },
        });

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

        tl.to(stage, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.9,
        });

        tl.to(stage, {
          y: '-25vh',
          scale: 0.72,
          opacity: 0.1,
          ease: 'power1.in',
          duration: 1.3,
        });

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
      }

      // 3. Playback video otomatis
      if (video) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          // Satu `onToggle` (ikut jalan saat refresh pertama), dan jeda berlaku di SEMUA lebar - mobile dulu dikecualikan sehingga video di-decode terus di luar layar.
          onToggle: (self) => {
            if (self.isActive) void video.play().catch(() => undefined);
            else video.pause();
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
