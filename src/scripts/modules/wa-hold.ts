import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

/**
 * Tombol WhatsApp di footer tidak berangkat sekali klik. Ia harus DITAHAN:
 *
 *   tekan   → tombol merayap pelan ke kanan sepanjang relnya
 *   lepas   → meluncur balik ke titik awal (lebih cepat daripada majunya, supaya
 *             batalnya terasa ringan sementara menahannya tetap terasa sebagai
 *             komitmen)
 *   sampai  → meletus: cincin melebar, seluruh tombol memutih, baru WhatsApp
 *   ujung     dibuka
 *
 * Kenapa repot: satu klik nyasar di CTA penutup mengirim orang keluar dari situs
 * ke aplikasi lain. Menahan membuat keberangkatan itu jadi keputusan, bukan
 * kecelakaan — dan geraknya sendiri yang jadi bilah kemajuan, tanpa perlu
 * menggambar bilah kemajuan.
 *
 * Yang TIDAK dicegat: klik dari keyboard. Menahan tombol lewat papan ketik tidak
 * punya padanan yang jelas, jadi Enter/Spasi tetap berangkat langsung — lihat
 * `onClick`. Begitu juga saat reduced-motion: modul ini tidak dipasang sama
 * sekali dan anchor-nya kembali jadi tautan biasa.
 */

/** Lama menahan sampai meletus. Cukup panjang untuk terasa disengaja, cukup
 *  pendek untuk tidak terasa seperti aplikasi yang hang. */
const HOLD_DURATION = 1.35;

/** Baliknya sekian kali lebih cepat daripada majunya. */
const RELEASE_SPEED = 2.8;

/** Jeda sejak letusan sampai WhatsApp dibuka — cukup untuk letusannya terbaca. */
const BLAST_DELAY = 0.42;

let teardown: (() => void) | null = null;

export const waHoldModule: AnimationModule = {
  name: 'wa-hold',
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const button = $<HTMLAnchorElement>('[data-wa-button]');
    const icon = $<HTMLElement>('[data-wa-icon]');
    const burst = $<HTMLElement>('[data-wa-burst]');
    const label = $<HTMLElement>('.footer-wa-label');
    /* Diambil lewat kelas, BUKAN lewat atribut penanda: panahnya dirender oleh
       komponen Icon, yang hanya meneruskan `name`, `size`, dan `class` — atribut
       lain yang ditulis di markup diam-diam hilang dan targetnya jadi kosong.
       DIUKUR: panah tidak pernah ikut memudar sama sekali. */
    const fading = [label, $<HTMLElement>('.footer-wa-arrow')].filter((el): el is HTMLElement => el !== null);
    if (!button || !icon || !burst || !label) return;

    let launched = false;

    /**
     * Jarak tempuh lingkaran: dari tepi kirinya sampai menyisakan napas yang SAMA
     * di kanan. Napas kiri diambil dari padding tombol yang sudah ada, bukan
     * angka baru — begitu padding-nya diubah di CSS, jaraknya ikut sendiri.
     *
     * Fungsi, bukan angka mati: lebar tombol berubah bersama viewport, dan
     * timeline-nya di-`invalidate()` tiap kali ditekan supaya selalu diukur ulang
     * pada saat itu juga.
     */
    const distance = (): number => {
      const inset = parseFloat(getComputedStyle(button).paddingLeft) || 0;
      return Math.max(0, button.clientWidth - icon.offsetWidth - inset * 2);
    };

    const timeline = gsap.timeline({ paused: true, onComplete: () => detonate() });
    timeline
      .to(icon, { x: distance, duration: HOLD_DURATION, ease: 'none' }, 0)
      /* Label dan panah dipudarkan sepanjang jalan: lingkaran ini melintas TEPAT
         di atas keduanya, dan putih-di-atas-putih di tengah lintasan terbaca
         seperti render yang rusak, bukan seperti gerak. */
      .to(fading, { autoAlpha: 0.14, duration: HOLD_DURATION * 0.55, ease: 'none' }, 0);

    /* Arrow yang disimpan di `const`, bukan deklarasi `function`: deklarasi
       fungsi ikut terangkat ke atas penjagaan null di awal init, jadi di dalam
       badannya `button` kembali dianggap mungkin null. */
    const reset = (): void => {
      launched = false;
      button.classList.remove('is-blown');
      timeline.pause(0);
      /* `clearProps`, bukan `x: 0`: menyisakan transform inline (walau nilainya
         nol) membuat aturan hover mana pun di sumbu yang sama kalah selamanya. */
      gsap.set([button, icon], { clearProps: 'transform' });
      gsap.set(fading, { clearProps: 'opacity,visibility' });
      gsap.set(burst, { clearProps: 'all' });
    };

    const detonate = (): void => {
      if (launched) return;
      launched = true;

      const href = button.href;
      button.classList.add('is-blown');

      gsap.fromTo(burst, { scale: 0.92, autoAlpha: 0.7 }, { scale: 2.4, autoAlpha: 0, duration: 0.62, ease: 'power2.out' });
      gsap.to(button, { scale: 1.06, duration: 0.11, yoyo: true, repeat: 1, ease: 'power2.out' });
      /* Yang dikembalikan hanya TULISANNYA: di kapsul putih polos, teks biru yang
         tinggal 14% terbaca seperti animasi yang belum selesai. Panahnya sengaja
         dibiarkan pudar — di ujung lintasan, lingkaran logo berhenti tepat di
         atasnya, dan dua glif yang saling menimpa terbaca sebagai kesalahan
         render. */
      gsap.to(label, { autoAlpha: 1, duration: 0.22, ease: 'power2.out' });

      gsap.delayedCall(BLAST_DELAY, () => {
        /**
         * `noopener` SENGAJA tidak ditulis di daftar fitur: dengan fitur itu
         * `window.open` mengembalikan null MESKIPUN tabnya berhasil dibuka —
         * begitu nilai itu dipakai sebagai penanda gagal, cadangannya ikut jalan
         * dan tab ini ikut pindah ke WhatsApp. DIUKUR: dua tab WhatsApp terbuka
         * sekaligus dan halaman ini ditinggalkan.
         *
         * Proteksinya tidak hilang, cuma dipasang setelahnya lewat `opener`.
         * Dan dengan begitu nilai baliknya kembali bermakna: null sekarang benar
         * -benar berarti diblokir, jadi cadangan di bawah hanya jalan saat
         * memang perlu.
         */
        const opened = window.open(href, '_blank');
        if (!opened) {
          window.location.href = href;
          return;
        }
        try {
          opened.opener = null;
        } catch {
          /* Sebagian browser menolak penulisan ini lintas-asal. Tabnya sudah
             terbuka dan itu yang utama. */
        }
      });

      /* Halaman ini tidak ke mana-mana kalau WhatsApp terbuka di tab baru, jadi
         tombolnya harus kembali seperti semula — kalau tidak, ia tertinggal
         putih dan mentok di kanan selamanya. */
      gsap.delayedCall(BLAST_DELAY + 0.9, reset);
    };

    const onPointerDown = (event: PointerEvent): void => {
      if (launched || (event.pointerType === 'mouse' && event.button !== 0)) return;
      /* Tanpa ini, menyeret anchor di desktop memulai drag-and-drop tautan dan
         pointerup-nya tidak pernah sampai ke sini. */
      event.preventDefault();
      /* Capture supaya jari/kursor yang bergeser keluar tombol tetap terhitung
         menahan — dan pointerup-nya tetap sampai ke sini. Dibungkus try: kalau
         pointernya sudah tidak aktif lagi, `setPointerCapture` MELEMPAR, dan
         tanpa penjagaan ini lemparan itu membatalkan seluruh tahanan sebelum
         sempat mulai. Gagal meng-capture cuma berarti kehilangan pointer di luar
         tombol; menahannya sendiri tetap jalan. */
      try {
        button.setPointerCapture(event.pointerId);
      } catch {
        /* biarkan — lihat di atas */
      }
      timeline.invalidate().timeScale(1).play();
    };

    const onPointerUp = (): void => {
      if (launched || timeline.progress() === 0) return;
      timeline.timeScale(RELEASE_SPEED).reverse();
    };

    /* Klik dari papan ketik punya `detail === 0`; klik dari tetikus/sentuhan
       selalu ≥ 1. Itu satu-satunya pembeda yang tersedia di sini, dan justru
       yang paling tepat: yang dicegat hanya jalur yang PUNYA cara menahan. */
    const onClick = (event: MouseEvent): void => {
      if (event.detail !== 0) event.preventDefault();
    };

    /* Tahan lama di layar sentuh memunculkan menu konteks tautan, dan menu itu
       merebut sentuhan yang sedang kita pakai untuk menahan. */
    const onContextMenu = (event: Event): void => event.preventDefault();

    button.addEventListener('pointerdown', onPointerDown);
    button.addEventListener('pointerup', onPointerUp);
    button.addEventListener('pointercancel', onPointerUp);
    button.addEventListener('click', onClick);
    button.addEventListener('contextmenu', onContextMenu);
    button.addEventListener('dragstart', onContextMenu);

    teardown = () => {
      button.removeEventListener('pointerdown', onPointerDown);
      button.removeEventListener('pointerup', onPointerUp);
      button.removeEventListener('pointercancel', onPointerUp);
      button.removeEventListener('click', onClick);
      button.removeEventListener('contextmenu', onContextMenu);
      button.removeEventListener('dragstart', onContextMenu);
      gsap.killTweensOf([button, icon, burst, ...fading]);
      timeline.kill();
      button.classList.remove('is-blown');
      gsap.set([button, icon, burst, ...fading], { clearProps: 'all' });
    };
  },

  destroy() {
    teardown?.();
    teardown = null;
  },
};
