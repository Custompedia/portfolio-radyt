import { ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $$ } from '../core/utils';

/**
 * Tiga section penutup — Pedi, The Work, footer — tidak lagi berbaris: yang
 * berikutnya NAIK MENIMPA yang sebelumnya, seperti kartu yang ditumpuk.
 *
 * Resepnya dua bagian, dan sengaja TANPA tween posisi supaya gerakannya terikat
 * 1:1 pada scroll — itulah yang membuatnya mundur persis saat digulung ke atas,
 * tanpa perlu satu pun `toggleActions`:
 *
 *   1. Layer BAWAH ditahan diam satu viewport di akhir hidupnya. Di desktop
 *      penahan itu sudah ada dan tinggal diperpanjang: pin Pedi ditambah satu
 *      viewport (packaging-test.ts) dan tinggi The Work ditambah satu viewport
 *      (horizontal.ts). Di bawah 1100px keduanya tidak berlaku — CSS memaksa
 *      The Work jadi statis dan timeline Pedi tidak pernah nge-pin — jadi modul
 *      INI yang memasang penahannya lewat pin sendiri.
 *   2. Layer ATAS ditarik naik satu viewport lewat `margin-top` negatif
 *      (sections.css). Penahan dan tarikan saling meniadakan, jadi tinggi
 *      dokumen persis sama seperti sebelum ada tumpukan — tidak ada satu pun
 *      section lain yang posisinya bergeser.
 *
 * `--stack-hold` ditulis dari sini dalam PIXEL, bukan dibiarkan `100vh` di CSS:
 * di mobile `100vh` mengacu ke viewport saat bar browser tersembunyi, sementara
 * penahan di JS memakai `innerHeight` saat itu juga. Selisih keduanya terbaca
 * sebagai celah — atau lompatan — tepat di sambungan dua layer.
 */

/** Di atas lebar ini penahannya datang dari pin Pedi & tinggi The Work. */
const JS_HOLD_MAX_WIDTH = 1100;

const triggers: ScrollTrigger[] = [];

/**
 * Ditulis ulang SETIAP kali ScrollTrigger menyegarkan, bukan sekali saat init.
 * Tinggi viewport berubah tanpa lebar ikut berubah lebih sering daripada
 * kelihatannya — bar browser mobile yang menyusut, panel devtools yang dibuka —
 * dan main.ts sengaja hanya memanggil `ScrollTrigger.refresh()` untuk itu, tanpa
 * membangun ulang modul. Pin Pedi memakai satuan persen viewport jadi ia ikut
 * menyesuaikan sendiri; kalau nilai ini tertinggal, tarikan dan penahannya tidak
 * lagi sama panjang dan sepotong tipis layer bawah menyembul di tepi atas tepat
 * di akhir perpindahan.
 *
 * `refreshInit`, bukan `refresh`: nilainya mengubah layout, jadi harus sudah
 * tertulis SEBELUM ScrollTrigger mengukur posisi.
 */
const publishHold = (): void => {
  document.documentElement.style.setProperty('--stack-hold', `${window.innerHeight}px`);
};

export const stackModule: AnimationModule = {
  name: 'stack',
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    publishHold();
    ScrollTrigger.addEventListener('refreshInit', publishHold);
    if (window.innerWidth > JS_HOLD_MAX_WIDTH) return;

    for (const layer of $$<HTMLElement>('[data-stack-hold]')) {
      triggers.push(
        ScrollTrigger.create({
          trigger: layer,
          // Tepi bawah layer menyentuh dasar layar = layar terakhirnya sudah
          // terbaca utuh. Dari titik itu ia dibekukan satu viewport. Dipatok ke
          // tepi BAWAH, bukan atas, karena di mobile section ini lebih tinggi
          // dari layar — mematoknya ke atas akan membekukannya sebelum isinya
          // sempat terbaca.
          start: 'bottom bottom',
          end: () => `+=${window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Spacer pin ini mendorong turun section di bawahnya, jadi ia harus
          // disegarkan lebih dulu daripada trigger yang membaca posisi dokumen
          // section tersebut — alasan yang sama persis dengan catatan panjang
          // di packaging-test.ts.
          refreshPriority: 1,
        }),
      );
    }
  },

  destroy() {
    ScrollTrigger.removeEventListener('refreshInit', publishHold);
    while (triggers.length) triggers.pop()?.kill(true);
    document.documentElement.style.removeProperty('--stack-hold');
  },
};
