import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop, prefersReducedMotion } from '../core/utils';

let context: gsap.Context | null = null;

/**
 * Letupan logo perusahaan. `back.out` yang membuatnya terbaca sebagai "pop":
 * skalanya melewati 1 sedikit sebelum mendarat, bukan meluncur masuk. Jarak
 * `y`-nya sengaja kecil — kalau logonya ikut bergeser jauh, yang terbaca adalah
 * geseran, bukan letupan.
 */
const LOGO_HIDDEN: gsap.TweenVars = { autoAlpha: 0, scale: 0.55, y: 22, transformOrigin: '50% 60%' };
const LOGO_SHOWN: gsap.TweenVars = { autoAlpha: 1, scale: 1, y: 0, duration: 0.62, ease: 'back.out(1.7)' };

/**
 * Kartu network mendarat, bukan meletup: ia kotak berisi logo, dan kotak yang
 * ikut memantul terbaca seperti tombol yang ditekan. Miring sedikit lalu
 * diluruskan sambil naik — seperti kartu yang dijatuhkan ke meja.
 */
const CARD_HIDDEN: gsap.TweenVars = {
  autoAlpha: 0,
  y: 34,
  scale: 0.9,
  rotation: (index: number) => (index % 2 ? 2.5 : -2.5),
  transformOrigin: '50% 100%',
};
const CARD_SHOWN: gsap.TweenVars = {
  autoAlpha: 1,
  y: 0,
  scale: 1,
  rotation: 0,
  duration: 0.66,
  ease: 'power3.out',
};

/** Jeda antar-elemen. Cukup panjang untuk terbaca bergantian, bukan berbarengan. */
const POP_STAGGER = 0.22;
const CARD_STAGGER = 0.09;

/**
 * SEMBUNYIKAN DULU, BARU ANIMASIKAN — sengaja bukan `gsap.from()`.
 *
 * `.from()` semestinya menuliskan keadaan awalnya sendiri begitu tween dibuat,
 * tapi di halaman ini tidak: diukur pada scroll 0, `.company-showcase` sama
 * sekali tidak punya style inline dan opacity-nya 1 — bahkan dengan
 * `immediateRender: true`, bahkan setelah `progress(0)` dipanggil paksa (tween-
 * nya baru mau menulis setelah sempat dirender penuh sekali). Akibatnya logonya
 * sudah terlihat sejak halaman dimuat lalu berkedip hilang-muncul saat pemicunya
 * lewat — persis kebalikan dari yang diminta.
 *
 * `set()` + `to()` tidak punya ambiguitas itu: keadaan awal ditulis saat itu
 * juga, keadaan akhir ditulis eksplisit. Dan karena yang menyembunyikan adalah
 * JS — bukan CSS — tanpa JS atau pada `prefers-reduced-motion` (modul ini
 * `skipOnReducedMotion`) semuanya tetap terlihat apa adanya.
 */
const hideThenReveal = (
  elements: HTMLElement[],
  hidden: gsap.TweenVars,
  shown: gsap.TweenVars,
  scrollTrigger: ScrollTrigger.Vars,
  extra: gsap.TweenVars = {},
): void => {
  if (!elements.length) return;
  gsap.set(elements, hidden);
  gsap.to(elements, { ...shown, ...extra, scrollTrigger });
};

/**
 * Menyingkap tiap elemen saat ELEMEN ITU SENDIRI masuk layar — dipakai untuk
 * susunan satu kolom, di mana stagger tidak ada gunanya karena tiap kartu tiba
 * di layar pada waktunya masing-masing.
 *
 * `once: true`, bukan `toggleActions: 'play none none reverse'`: yang sudah
 * tampil tidak boleh menghilang lagi hanya karena user menggulung balik.
 */
const revealEachOnEnter = (
  elements: HTMLElement[],
  hidden: gsap.TweenVars,
  shown: gsap.TweenVars,
  start = 'top 90%',
): void => {
  elements.forEach((element, index) => {
    // Nilai fungsional (mis. rotasi selang-seling) dihitung per elemen di sini,
    // karena tiap elemen jadi tween-nya sendiri dan indeks lokalnya selalu 0.
    const resolve = (vars: gsap.TweenVars): gsap.TweenVars =>
      Object.fromEntries(
        Object.entries(vars).map(([key, value]) => [key, typeof value === 'function' ? value(index) : value]),
      );
    hideThenReveal([element], resolve(hidden), shown, { trigger: element, start, once: true });
  });
};

export const brandStagesModule: AnimationModule = {
  name: 'brand-stages',
  skipOnReducedMotion: true,
  /**
   * Susunan kolomnya berubah total di 768px (tiga kolom → satu kolom), dan
   * pemilihan pemicu di bawah ikut berubah bersamanya, jadi modul ini harus
   * dibangun ulang saat lebar melewati breakpoint.
   */
  rebuildOnResize: true,

  init() {
    if (prefersReducedMotion()) return;
    const desktop = isDesktop();

    context = gsap.context(() => {
      const profile = $<HTMLElement>('[data-about-profile]');
      if (profile) {
        gsap.from(profile, {
          autoAlpha: 0,
          y: 48,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: profile, start: 'top 78%', once: true },
        });

        const growth = $<HTMLElement>('[data-about-growth]', profile);
        const rings = growth ? $$<SVGCircleElement>('[data-growth-ring]', growth) : [];
        const marks = growth ? $$<SVGCircleElement>('[data-growth-mark]', growth) : [];
        const core = growth ? $<SVGCircleElement>('[data-growth-core]', growth) : null;
        if (growth && core && rings.length) {
          rings.forEach((ring) => {
            const length = ring.getTotalLength();
            gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length });
          });

          gsap.timeline({ scrollTrigger: { trigger: profile, start: 'top 76%', end: 'bottom 34%', scrub: 0.7 } })
            .fromTo(core, { scale: 0.35, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.18, ease: 'power2.out' })
            .to(rings, { strokeDashoffset: 0, stagger: 0.14, duration: 0.62, ease: 'power2.inOut' }, '-=0.08')
            .from(marks, { scale: 0, autoAlpha: 0, stagger: 0.09, duration: 0.18, ease: 'back.out(1.4)' }, '-=0.18');
        }
      }

      const about = $<HTMLElement>('[data-about-stories]');
      const stories = about ? $$<HTMLElement>('[data-about-story]', about) : [];
      if (about && stories.length) {
        gsap.from(stories, {
          opacity: 0,
          y: 42,
          rotateX: -9,
          transformOrigin: '50% 100%',
          stagger: 0.13,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: about, start: 'top 76%', once: true },
        });
      }

      const companyGrid = $<HTMLElement>('.company-grid');
      const companyShowcases = companyGrid ? $$<HTMLElement>('[data-company-showcase]', companyGrid) : [];
      if (companyGrid && companyShowcases.length) {
        // Logonya tidak terlihat sampai section-nya benar-benar didatangi, lalu
        // meletup satu per satu. Berkasnya sendiri sudah di-preload di <head>
        // (lihat Base.astro), jadi yang ditunda cuma penampakannya — bukan
        // pengunduhannya.
        if (desktop) {
          // Ketiganya tersebar dalam satu bidang yang seluruhnya masuk layar
          // bersamaan, jadi satu pemicu di grid sudah tepat; urutannya yang
          // dijaga lewat stagger. `from: 'start'`, bukan `'center'`: letupan
          // harus mengalir dari logo pertama, bukan meledak dari tengah.
          hideThenReveal(
            companyShowcases,
            LOGO_HIDDEN,
            LOGO_SHOWN,
            { trigger: companyGrid, start: 'top 76%', once: true },
            { stagger: { each: POP_STAGGER, from: 'start' } },
          );
        } else {
          revealEachOnEnter(companyShowcases, LOGO_HIDDEN, LOGO_SHOWN);
        }
      }

      const network = $<HTMLElement>('.network-body');
      const active = network ? $$<HTMLElement>('[data-network-active]', network) : [];
      const trusted = network ? $$<HTMLElement>('[data-network-trusted]', network) : [];
      if (network && (active.length || trusted.length)) {
        // Cacat yang sama persis dengan grid perusahaan, dan lebih parah: di
        // mobile 5 kartu "Active in" + 10 kartu "Trusted by" berbaris satu
        // kolom sepanjang ribuan piksel, sementara pemicunya cuma satu di
        // puncak `.network-body`. Kartu paling bawah selesai dianimasikan jauh
        // sebelum user sampai ke sana.
        if (desktop) {
          // Dua baris, dua pemicu — bukan satu timeline untuk keduanya. "Trusted
          // by" berdiri jauh di bawah "Active in" dan punya dua baris sendiri;
          // dengan satu pemicu di puncak `.network-body`, baris bawah selesai
          // mendarat sebelum sempat masuk layar.
          if (active.length) {
            hideThenReveal(
              active,
              CARD_HIDDEN,
              CARD_SHOWN,
              { trigger: active[0], start: 'top 88%', once: true },
              { stagger: { each: CARD_STAGGER, from: 'start' } },
            );
          }
          if (trusted.length) {
            hideThenReveal(
              trusted,
              CARD_HIDDEN,
              CARD_SHOWN,
              { trigger: trusted[0], start: 'top 88%', once: true },
              { stagger: { each: CARD_STAGGER, from: 'start' } },
            );
          }
        } else {
          revealEachOnEnter([...active, ...trusted], CARD_HIDDEN, CARD_SHOWN);
        }
      }
    });
  },

  destroy() {
    context?.revert();
    context = null;
  },
};
