import { ScrollTrigger } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';

/**
 * Menyorot link sidebar sesuai section yang sedang dibaca, dan menyembunyikan
 * tombol WhatsApp rail saat section terakhir terlihat.
 *
 * Versi sebelumnya membuat satu ScrollTrigger per link dan hanya pernah
 * MENYALAKAN - tidak ada yang mematikan. Dua akibatnya terlihat langsung:
 * section yang tidak diwakili menu mana pun (scene 3D) meninggalkan link
 * sebelumnya menyala di tempat yang bukan miliknya, dan dua section yang
 * tumpang tindih (About ditarik naik menimpa hero lewat margin negatif)
 * menyalakan keduanya sekaligus - WORK dan CONTACT ikut menyala di halaman
 * Home.
 *
 * Yang ini memutuskannya dari SATU tempat: cari section terakhir yang tepi
 * atasnya sudah melewati garis baca, lalu nyalakan tepat satu link. Satu menu
 * boleh menaungi lebih dari satu section (About → about + companies), dan
 * pemetaan itu ikut markup lewat `data-nav-sections`, bukan ditulis dua kali.
 */

/** Garis baca: section dianggap "sedang dibaca" begitu tepi atasnya naik
 *  melewati 45% tinggi layar - sama seperti ambang versi sebelumnya. */
const READ_LINE = 0.45;

/** Section terakhir. Selama ia terlihat, tombol WhatsApp rail disembunyikan
 *  supaya tidak ada dua tombol WhatsApp bersamaan di layar. */
const CTA_SECTION = 'contact';

interface Watched {
  id: string;
  el: HTMLElement;
  link: HTMLElement;
}

let watched: Watched[] = [];
let trigger: ScrollTrigger | null = null;
let current = '';

function sync(): void {
  const line = window.innerHeight * READ_LINE;

  // Section terakhir yang tepi atasnya sudah melewati garis baca. Urutan
  // `watched` mengikuti urutan dokumen, jadi "terakhir yang lolos" selalu yang
  // paling bawah - dan section yang saling menumpuk tidak bisa lagi menyalakan
  // dua link sekaligus.
  let activeId = watched[0]?.id ?? '';
  for (const section of watched) {
    if (section.el.getBoundingClientRect().top <= line) activeId = section.id;
  }

  if (activeId !== current) {
    current = activeId;
    const link = watched.find((section) => section.id === activeId)?.link;
    for (const el of $$('[data-nav-link]')) el.classList.toggle('is-active', el === link);
  }

  const cta = watched.find((section) => section.id === CTA_SECTION);
  const atCta = cta ? cta.el.getBoundingClientRect().top <= window.innerHeight * 0.9 : false;
  document.documentElement.classList.toggle('at-contact', atCta);
}

export const navActiveModule: AnimationModule = {
  name: 'nav-active',
  rebuildOnResize: true,

  init() {
    for (const link of $$<HTMLElement>('[data-nav-link]')) {
      for (const id of (link.dataset.navSections ?? link.dataset.navLink ?? '').split(' ').filter(Boolean)) {
        const el = $<HTMLElement>(`#${id}`);
        if (el) watched.push({ id, el, link });
      }
    }
    if (watched.length === 0) return;

    // Diurutkan mengikuti urutan dokumen, bukan urutan menu: menu "Work"
    // menaungi dua section yang tidak berdampingan di markup.
    watched.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

    current = '';
    // Satu listener untuk semua section. ScrollTrigger dipakai sekadar sebagai
    // sumber event yang sudah ter-throttle bersama Lenis - bukan sebagai
    // penentu section, supaya keputusannya tetap di satu tempat.
    trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: sync,
      onRefresh: sync,
    });
    sync();
  },

  destroy() {
    trigger?.kill();
    trigger = null;
    watched = [];
    current = '';
    for (const link of $$('[data-nav-link]')) link.classList.remove('is-active');
    document.documentElement.classList.remove('at-contact');
  },
};
