import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop, prefersReducedMotion } from '../core/utils';

let context: gsap.Context | null = null;

/**
 * Menyingkap satu kartu saat KARTU ITU SENDIRI masuk layar.
 *
 * Dipakai hanya di bawah 768px, dan alasannya geometri: di desktop grid-nya
 * tiga kolom bersebelahan, jadi satu pemicu di grid memang menyingkap semuanya
 * pada saat yang sama-sama benar. Di mobile grid yang sama jadi SATU KOLOM
 * setinggi 452px — dengan satu pemicu di puncak grid, kartu ketiga (332px lebih
 * bawah) ikut dianimasikan saat ia masih jauh di bawah lipatan, dan sudah
 * selesai sebelum sempat terlihat. Yang tersisa untuk user: kotak kosong dulu,
 * lalu tahu-tahu sudah lengkap.
 *
 * `once: true`, bukan `toggleActions: 'play none none reverse'`: kartu yang
 * sudah tampil tidak boleh menghilang lagi hanya karena user menggulung balik.
 */
const revealOnEnter = (
  elements: HTMLElement[],
  vars: gsap.TweenVars,
  start = 'top 90%',
): void => {
  elements.forEach((element) => {
    gsap.from(element, {
      ...vars,
      scrollTrigger: { trigger: element, start, once: true },
    });
  });
};

/**
 * Keadaan AWAL logo perusahaan — satu definisi, dipakai desktop dan mobile.
 *
 * `back.out` yang membuatnya terbaca sebagai "pop": skalanya melewati 1 sedikit
 * sebelum mendarat, bukan meluncur masuk. Jarak `y`-nya sengaja kecil; kalau
 * logonya ikut bergeser jauh, yang terbaca adalah geseran, bukan letupan.
 */
const LOGO_POP: gsap.TweenVars = {
  autoAlpha: 0,
  scale: 0.55,
  y: 22,
  transformOrigin: '50% 60%',
  duration: 0.62,
  ease: 'back.out(1.7)',
  /**
   * WAJIB eksplisit. Tanpa ini logonya sudah terlihat sejak halaman dimuat dan
   * baru "muncul" saat pemicunya lewat — jadi yang terjadi bukan kemunculan,
   * melainkan kedipan: terlihat, hilang sesaat, lalu meletup. Diukur: sebelum
   * baris ini, `.company-showcase` tidak punya style inline sama sekali pada
   * scroll 0 dan opacity-nya 1.
   *
   * Hanya keadaan AWAL yang ditulis lebih dini; kalau JS tidak jalan atau user
   * meminta gerak minimal, modul ini tidak pernah init dan logonya tetap
   * terlihat apa adanya — karena itu penyembunyiannya di sini, bukan di CSS.
   */
  immediateRender: true,
};

/** Jeda antar-logo. Cukup panjang untuk terbaca bergantian, bukan berbarengan. */
const LOGO_POP_STAGGER = 0.22;

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
        // meletup satu per satu. Yang menyembunyikannya adalah `.from()` itu
        // sendiri: gsap menuliskan keadaan awalnya begitu tween dibuat, jadi
        // TIDAK boleh ada `gsap.set(..., {autoAlpha: 0})` tambahan di sini —
        // `.from()` beranimasi menuju nilai yang sedang berlaku, dan nilai itu
        // akan ikut jadi nol sehingga logonya tidak pernah muncul.
        // Berkasnya sendiri sudah di-preload di <head> (lihat Base.astro), jadi
        // yang ditunda cuma penampakannya — bukan pengunduhannya.
        if (desktop) {
          // Ketiganya tersebar dalam satu bidang yang seluruhnya masuk layar
          // bersamaan, jadi satu pemicu di grid sudah tepat; urutannya yang
          // dijaga lewat stagger. `from: 'start'`, bukan `'center'`: letupan
          // harus mengalir dari logo pertama, bukan meledak dari tengah.
          gsap.from(companyShowcases, {
            ...LOGO_POP,
            stagger: { each: LOGO_POP_STAGGER, from: 'start' },
            scrollTrigger: { trigger: companyGrid, start: 'top 76%', once: true },
          });
        } else {
          // Satu kolom: stagger tidak berlaku karena tiap logo tiba di layar
          // pada waktunya sendiri-sendiri — pemicunya yang jadi penggantinya.
          revealOnEnter(companyShowcases, LOGO_POP);
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
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: network, start: 'top 74%', toggleActions: 'play none none reverse' },
          });

          timeline
            .from(active, {
              autoAlpha: 0,
              x: (index) => (index % 2 ? 42 : -42),
              y: (index) => (index % 2 ? 20 : -20),
              rotation: (index) => (index % 2 ? 4 : -4),
              scale: 0.86,
              stagger: { each: 0.1, from: 'center' },
              duration: 0.78,
              ease: 'power3.out',
            })
            .from(trusted, {
              autoAlpha: 0,
              y: 28,
              scale: 0.82,
              stagger: { each: 0.08, from: 'center' },
              duration: 0.68,
              ease: 'back.out(1.35)',
            }, '-=0.34');
        } else {
          revealOnEnter([...active, ...trusted], {
            autoAlpha: 0,
            y: 26,
            scale: 0.94,
            duration: 0.5,
            ease: 'power3.out',
          });
        }
      }
    });
  },

  destroy() {
    context?.revert();
    context = null;
  },
};
