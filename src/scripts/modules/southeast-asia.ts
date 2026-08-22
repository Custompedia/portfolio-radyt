import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $ } from '../core/utils';

let context: gsap.Context | null = null;
let cleanupPlayback: (() => void) | null = null;

// Unduh video hanya saat section mendekat, dan putar hanya saat benar-benar terlihat di tab yang aktif.
function setupViewportPlayback(video: HTMLVideoElement): () => void {
  let isVisible = false;

  const sync = () => {
    if (isVisible && !document.hidden) void video.play().catch(() => undefined);
    else video.pause();
  };

  const preloadObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      preloadObserver.disconnect();
      if (video.preload !== 'auto') {
        video.preload = 'auto';
        video.load();
      }
    },
    { rootMargin: '400px 0px' },
  );
  preloadObserver.observe(video);

  const playbackObserver = new IntersectionObserver(
    (entries) => {
      isVisible = entries.some((entry) => entry.isIntersecting);
      sync();
    },
    { threshold: 0.25 },
  );
  playbackObserver.observe(video);

  const suspend = () => video.pause();

  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', suspend);
  window.addEventListener('pageshow', sync);

  return () => {
    preloadObserver.disconnect();
    playbackObserver.disconnect();
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pagehide', suspend);
    window.removeEventListener('pageshow', sync);
    video.pause();
  };
}

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
      video.addEventListener('loadeddata', () => ScrollTrigger.refresh(), { once: true });
      cleanupPlayback = setupViewportPlayback(video);
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
    }, section);
  },

  destroy() {
    cleanupPlayback?.();
    cleanupPlayback = null;
    context?.revert();
    context = null;
    const stage = $<HTMLElement>('[data-sea-stage]');
    const head = $<HTMLElement>('.sea-head');
    if (stage) gsap.set(stage, { clearProps: 'all' });
    if (head) gsap.set(head, { clearProps: 'all' });
  },
};
