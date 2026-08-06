import { gsap, ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $ } from '../core/utils';

/**
 * CTA berbentuk percakapan. Titik-titik "sedang mengetik" berkedip sebentar,
 * lalu digantikan gelembung pertanyaan, baru tombolnya masuk.
 *
 * Jedanya yang bekerja, bukan animasinya: tombol yang muncul SETELAH sebuah
 * pertanyaan terbaca sebagai jawaban atas pertanyaan itu. Kalau ketiganya
 * muncul bersamaan, ia kembali jadi tombol biasa.
 */

/** Kecepatan seluruh urutan; sama seperti `ctaSpeed` di referensi. */
const SPEED = 0.728;

let timeline: gsap.core.Timeline | null = null;
let trigger: ScrollTrigger | null = null;

export const ctaChatModule: AnimationModule = {
  name: 'cta-chat',
  skipOnReducedMotion: true,

  init() {
    const chat = $<HTMLElement>('[data-cta-chat]');
    const typing = $<HTMLElement>('[data-cta-typing]');
    const bubble = $<HTMLElement>('[data-cta-bubble]');
    const button = $<HTMLElement>('[data-cta-button]');
    const avatar = $<HTMLElement>('.cta-chat-avatar');
    if (!chat || !typing || !bubble || !button || !avatar) return;

    const dots = [...typing.children];

    gsap.set([avatar, typing], { autoAlpha: 0, scale: 0.7 });
    gsap.set(bubble, { autoAlpha: 0, y: 10, scale: 0.9 });
    gsap.set(button, { autoAlpha: 0, y: 10, scale: 0.94 });

    timeline = gsap.timeline({
      paused: true,
      defaults: { ease: 'expo.out' },
      timeScale: 1 / SPEED,
    });

    timeline
      .to(avatar, { autoAlpha: 1, scale: 1, duration: 0.5 })
      .to(typing, { autoAlpha: 1, scale: 1, duration: 0.4 }, '-=0.25')
      // Kedipan tiga titik: dua putaran, cukup untuk terbaca "mengetik" tanpa
      // membuat orang menunggu.
      .to(
        dots,
        { y: -5, duration: 0.28, ease: 'sine.inOut', stagger: 0.12, repeat: 3, yoyo: true },
        '<',
      )
      .to(typing, { autoAlpha: 0, scale: 0.7, duration: 0.3 })
      .to(bubble, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 }, '-=0.15')
      .to(button, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 }, '-=0.2');

    trigger = ScrollTrigger.create({
      trigger: chat,
      start: 'top 80%',
      once: true,
      onEnter: () => timeline?.play(),
    });
  },

  destroy() {
    trigger?.kill();
    trigger = null;
    timeline?.kill();
    timeline = null;
  },
};
