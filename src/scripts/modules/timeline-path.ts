import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';

/**
 * Garis yang menghubungkan kartu-kartu timeline. Path-nya tidak ditulis
 * tangan: ia dihitung dari posisi kartu yang sebenarnya, jadi tetap benar
 * berapa pun jumlah entri dan berapa pun tinggi tiap kartu. Setelah itu
 * "ditarik" dengan DrawSVG mengikuti scroll.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const OVERHANG = 26;

let tween: gsap.core.Tween | null = null;

interface Point {
  x: number;
  y: number;
}

function buildPathData(points: Point[]): string {
  if (points.length < 2) return '';

  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]!;
    const next = points[i]!;
    const bend = (next.y - prev.y) / 2;
    d += ` C ${prev.x} ${prev.y + bend}, ${next.x} ${next.y - bend}, ${next.x} ${next.y}`;
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
      // Titik jangkar ada di sisi kartu yang menghadap tengah, sedikit di luar
      // tepinya, supaya garis menyusuri sela antar kartu.
      const x =
        card.dataset.side === 'right'
          ? rect.left - box.left - OVERHANG
          : rect.right - box.left + OVERHANG;
      return { x, y: rect.top - box.top + rect.height / 2 };
    });

    path.setAttribute('d', buildPathData(points));

    // Titik penanda di tiap persimpangan.
    svg.querySelectorAll('circle').forEach((c) => c.remove());
    for (const point of points) {
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', String(point.x));
      dot.setAttribute('cy', String(point.y));
      dot.setAttribute('r', '5');
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
          start: 'top 65%',
          end: 'bottom 85%',
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
