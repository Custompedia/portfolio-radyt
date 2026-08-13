import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

let timeline: gsap.core.Timeline | null = null;

export const footerCtaModule: AnimationModule = {
  name: 'footer-cta',
  skipOnReducedMotion: true,

  init() {
    const footer = $<HTMLElement>('.site-footer');
    if (!footer) return;

    // Urutan naiknya mengikuti urutan markup, jadi penandanya cukup satu atribut
    // — menambah blok baru di footer tidak perlu menyentuh modul ini.
    const targets = $$<HTMLElement>('[data-footer-reveal]', footer);
    if (targets.length === 0) return;

    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 82%',
        end: 'bottom 72%',
        toggleActions: 'play none none reverse',
      },
    });
    timeline.fromTo(targets, { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.1, ease: 'power3.out' });
  },

  destroy() {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
    // Tanpa ini, membongkar modul saat animasinya belum sempat main meninggalkan
    // `visibility: hidden` inline — dan seluruh isi footer lenyap.
    for (const el of $$<HTMLElement>('[data-footer-reveal]')) gsap.set(el, { clearProps: 'opacity,visibility,transform' });
  },
};
