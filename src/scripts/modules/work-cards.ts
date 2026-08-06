import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $$ } from '../core/utils';
import { getWorkTween } from './horizontal';

/**
 * KARTU PROYEK
 *
 * Masuknya dipecah dua strategi, dan pemisahan itulah intinya:
 *
 *  - kartu yang SUDAH terlihat saat section masuk layar muncul bersama dengan
 *    stagger biasa;
 *  - kartu yang masih di luar layar mendapat ScrollTrigger sendiri dengan
 *    `containerAnimation`, yaitu tween horizontal-nya. Itu satu-satunya cara
 *    ScrollTrigger bisa membaca posisi elemen yang digerakkan menyamping.
 *
 * Tanpa pemisahan ini semua kartu terpicu sekaligus di awal — posisi vertikal
 * mereka tidak pernah berubah, jadi trigger biasa langsung terpenuhi untuk
 * kesembilannya.
 */

/** Resep masuk yang sama dipakai kartu perjalanan — konsistensinya disengaja. */
const FROM = { y: '10%', opacity: 0, scale: 0.6 };
const TO = { y: '0%', opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out' } as const;

const cleanups: Array<() => void> = [];
const triggers: ScrollTrigger[] = [];

/**
 * Sumber video baru dipasang saat kartunya mendekat. Sembilan video dengan
 * `src` di markup akan diminta browser sekaligus begitu halaman dibuka.
 */
function primeVideo(card: HTMLElement): void {
  const video = card.querySelector<HTMLVideoElement>('.work-bg');
  if (!video || video.dataset.primed) return;
  video.dataset.primed = '1';

  const webm = video.dataset.webm;
  const mp4 = video.dataset.src;

  if (webm && video.canPlayType('video/webm')) video.src = webm;
  else if (mp4) video.src = mp4;
  else return;

  video.load();
  void video.play().catch(() => {
    /* autoplay ditolak — poster tetap tampil, tidak ada yang rusak */
  });
}

export const workCardsModule: AnimationModule = {
  name: 'work-cards',
  desktopOnly: true,
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const cards = $$<HTMLElement>('[data-work-card]');
    if (cards.length === 0) return;

    const containerAnimation = getWorkTween() ?? undefined;
    const viewportWidth = window.innerWidth;

    const visible: HTMLElement[] = [];
    const offscreen: HTMLElement[] = [];
    for (const card of cards) {
      (card.getBoundingClientRect().left < viewportWidth ? visible : offscreen).push(card);
    }

    if (visible.length > 0) {
      const tween = gsap.fromTo(visible, FROM, {
        ...TO,
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-work]', start: 'top 80%', once: true },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    for (const card of offscreen) {
      const tween = gsap.fromTo(card, FROM, {
        ...TO,
        scrollTrigger: {
          trigger: card,
          start: 'left right',
          once: true,
          containerAnimation,
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    for (const card of cards) {
      const primer = ScrollTrigger.create({
        trigger: card,
        start: 'left right',
        once: true,
        containerAnimation,
        onEnter: () => primeVideo(card),
      });
      triggers.push(primer);
    }

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    for (const card of cards) {
      const glow = card.querySelector<HTMLElement>('.work-card-glow');
      if (!glow) continue;

      const glowX = gsap.quickTo(glow, 'xPercent', { duration: 0.8, ease: 'power3.out' });
      const glowY = gsap.quickTo(glow, 'yPercent', { duration: 0.8, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        glowX(((event.clientX - rect.left) / rect.width - 0.5) * 26);
        glowY(((event.clientY - rect.top) / rect.height - 0.5) * 18);
      };
      const onLeave = () => {
        glowX(0);
        glowY(0);
      };

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
      });
    }
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
    while (triggers.length) triggers.pop()?.kill();
    $$('[data-work-card]').forEach((card) => gsap.set(card, { clearProps: 'transform,opacity' }));
  },
};
