import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';

/**
 * Garis yang menghubungkan kartu-kartu timeline.
 *
 * Bentuknya huruf S berkelok: berangkat dari tepi DALAM satu kartu, menyeberang
 * ke sisi lain, lalu masuk ke tepi dalam kartu berikutnya. Kartu di kanan
 * disambung di tepi kirinya, kartu di kiri disambung di tepi kanannya — jadi
 * garisnya benar-benar menempel ke kartu, bukan melayang di selokan tengah.
 *
 * Path-nya tidak ditulis tangan: dihitung dari posisi kartu yang sebenarnya,
 * jadi tetap benar berapa pun jumlah entri dan tinggi tiap kartu. Setelah itu
 * "ditarik" dengan DrawSVG mengikuti scroll.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Seberapa jauh titik kendali ditarik vertikal, rasio terhadap jarak antar titik. */
const BEND = 0.55;

/**
 * Dorongan mendatar titik kendali, rasio terhadap celah antar kolom kartu.
 * Inilah yang membuat kurvanya benar-benar berkelok: titik kendali kedua ujung
 * saling menyilang, jadi garisnya menggembung keluar dulu sebelum masuk ke
 * kartu berikutnya. Tanpa ini, dengan kartu selebar ini ayunannya cuma puluhan
 * piksel dan hasilnya terlihat seperti garis lurus.
 */
const SWING = 1.15;

let tween: gsap.core.Tween | null = null;

interface Point {
  x: number;
  y: number;
  /** +1 bila garis meninggalkan kartu ke kanan, -1 bila ke kiri. */
  dir: number;
}

/**
 * Kurva S: titik kendali ditarik VERTIKAL dari kedua ujung. Itu yang membuat
 * garisnya keluar-masuk kartu secara mendatar dan berkelok di antaranya.
 */
function buildPathData(points: Point[], gap: number): string {
  if (points.length < 2) return '';

  const swing = gap * SWING;
  let d = `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`;

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const bend = (b.y - a.y) * BEND;
    const c1x = a.x + a.dir * swing;
    const c2x = b.x + b.dir * swing;
    d +=
      ` C ${c1x.toFixed(1)} ${(a.y + bend).toFixed(1)},` +
      ` ${c2x.toFixed(1)} ${(b.y - bend).toFixed(1)},` +
      ` ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

export const timelinePathModule: AnimationModule = {
  name: 'timeline-path',
  desktopOnly: true,
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const container = $('[data-timeline]');
    const svg = $<SVGSVGElement>('[data-timeline-svg]');
    const path = $<SVGPathElement>('[data-timeline-path]');
    const cards = $$('[data-timeline-card]');
    if (!container || !svg || !path || cards.length < 2 || !isDesktop()) return;

    const box = container.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.setAttribute('width', String(box.width));
    svg.setAttribute('height', String(box.height));

    const points: Point[] = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      const onRight = card.dataset.side === 'right';
      // Titik sambung menempel di tepi kartu yang menghadap ke tengah halaman:
      // kartu kanan disambung di tepi KIRI-nya, kartu kiri di tepi KANAN-nya.
      const x = onRight ? rect.left - box.left : rect.right - box.left;
      return { x, y: rect.top - box.top + rect.height / 2, dir: onRight ? -1 : 1 };
    });

    // Celah antar kolom kartu — jadi acuan seberapa lebar kurva boleh mengayun.
    const xs = points.map((p) => p.x);
    const gap = Math.max(40, Math.max(...xs) - Math.min(...xs));

    path.setAttribute('d', buildPathData(points, gap));

    // Titik penanda tepat di tempat garis menyentuh kartu.
    svg.querySelectorAll('circle').forEach((c) => c.remove());
    for (const point of points) {
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', point.x.toFixed(1));
      dot.setAttribute('cy', point.y.toFixed(1));
      dot.setAttribute('r', '5.5');
      dot.setAttribute('class', 'timeline-dot');
      svg.appendChild(dot);
    }

    tween = gsap.fromTo(
      path,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 1,
        },
      },
    );

    // Dot ikut menyala satu per satu seiring garis melewatinya.
    gsap.fromTo(
      svg.querySelectorAll('.timeline-dot'),
      { scale: 0, transformOrigin: 'center' },
      {
        scale: 1,
        ease: 'back.out(2)',
        duration: 0.4,
        stagger: { each: 0.5 },
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 1,
        },
      },
    );
  },

  destroy() {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
  },
};
