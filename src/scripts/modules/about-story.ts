import { gsap, SplitText, EASE_OUT } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, isDesktop } from '../core/utils';

let timeline: gsap.core.Timeline | null = null;
const mobileTweens: gsap.core.Tween[] = [];
const splits: SplitText[] = [];

const INTRO_AT = 0.42;
const CHAPTER_STEP = 0.7;
const STAGE_VIEWPORTS = 3.15;

const splitLines = (element: HTMLElement | null): HTMLElement[] => {
  if (!element) return [];
  const split = new SplitText(element, { type: 'lines', linesClass: 'line', aria: 'none' });
  splits.push(split);
  return split.lines as HTMLElement[];
};

const splitChars = (element: HTMLElement | null): HTMLElement[] => {
  if (!element) return [];
  const split = new SplitText(element, { type: 'chars', charsClass: 'char', aria: 'none' });
  splits.push(split);
  return split.chars as HTMLElement[];
};

function buildMobileChapters(chapters: HTMLElement[]): void {
  chapters.forEach((chapter) => {
    const figure = $('.about-chapter-figure', chapter);
    const titleLines = splitLines($('[data-about-title]', chapter));
    const textLines = splitLines($('[data-about-text]', chapter));

    if (figure) {
      mobileTweens.push(
        gsap.fromTo(
          figure,
          { yPercent: 18, autoAlpha: 0.5 },
          {
            yPercent: -18,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          },
        ),
      );
    }

    if (titleLines.length) {
      gsap.set(titleLines, { yPercent: 112 });
      mobileTweens.push(
        gsap.to(titleLines, {
          yPercent: 0,
          duration: 0.72,
          stagger: 0.07,
          ease: EASE_OUT,
          scrollTrigger: { trigger: chapter, start: 'top 82%', once: true },
        }),
      );
    }

    if (textLines.length) {
      gsap.set(textLines, { yPercent: 60, autoAlpha: 0 });
      mobileTweens.push(
        gsap.to(textLines, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.62,
          stagger: 0.06,
          ease: EASE_OUT,
          scrollTrigger: { trigger: chapter, start: 'top 76%', once: true },
        }),
      );
    }
  });
}

export const aboutStoryModule: AnimationModule = {
  name: 'about-story',
  skipOnReducedMotion: true,
  rebuildOnResize: true,

  init() {
    const section = $('[data-about]');
    const stage = $('[data-about-stage]');
    const intro = $('[data-about-intro]');
    const chapters = $$('[data-about-chapter]');
    if (!section || !stage || !intro || chapters.length !== 3) return;

    if (!isDesktop()) {
      buildMobileChapters(chapters);
      return;
    }

    const glow = $('[data-about-glow]');
    const progressCurrent = $('[data-about-progress-current]');
    const progressFill = $('[data-about-progress-fill]');
    const photos = $$('[data-about-photo]');
    const photoImages = photos.map((photo) => $('img', photo)).filter((image): image is HTMLElement => image !== null);

    section.classList.add('about--staged');
    section.style.height = `${window.innerHeight * STAGE_VIEWPORTS}px`;

    const leadLines = splitLines($('.about-lead', intro));
    if (glow) gsap.set(glow, { autoAlpha: 1, xPercent: -22, yPercent: -18 });
    if (progressFill) gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(photos, { autoAlpha: 0 });
    gsap.set(photoImages, { scale: 0.72, transformOrigin: 'center center' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      },
    });
    timeline = tl;

    [0.08, 0.34, 0.5].forEach((at, index) => {
      const photo = photos[index];
      const image = photoImages[index];
      if (!photo || !image) return;
      tl.to(photo, { autoAlpha: 0.48, duration: 0.18, ease: 'power2.out' }, at)
        .to(image, { scale: 1, duration: 0.42, ease: 'back.out(1.8)' }, at);
    });

    tl.to(intro, { autoAlpha: 0, y: -52, duration: 0.28, ease: 'power2.in' }, 0.34);
    tl.to(leadLines, { yPercent: -105, duration: 0.28, stagger: 0.025, ease: 'power2.in' }, 0.34);

    chapters.forEach((chapter, index) => {
      const figure = $('.about-chapter-figure', chapter);
      const titleChars = splitChars($('[data-about-title]', chapter));
      const bodyLines = splitLines($('[data-about-text]', chapter));
      const at = INTRO_AT + index * CHAPTER_STEP;

      gsap.set(chapter, { autoAlpha: 0 });
      tl.to(chapter, { autoAlpha: 1, duration: 0.01 }, at)
        .fromTo(
          figure,
          { yPercent: 22, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.34, ease: 'power3.out' },
          at,
        )
        .fromTo(
          titleChars,
          { yPercent: 115, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.34, stagger: 0.012, ease: 'power3.out' },
          at + 0.02,
        )
        .fromTo(
          bodyLines,
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.34, stagger: 0.032, ease: 'power2.out' },
          at + 0.1,
        );

      if (progressCurrent) {
        tl.set(progressCurrent, { textContent: String(index + 1).padStart(2, '0') }, at);
      }
      if (progressFill) {
        tl.to(progressFill, { scaleX: (index + 1) / chapters.length, duration: 0.35, ease: 'none' }, at);
      }
      if (glow) {
        tl.to(
          glow,
          {
            autoAlpha: 1,
            xPercent: -14 + index * 14,
            yPercent: -10 + index * 12,
            duration: 0.42,
            ease: 'power2.out',
          },
          at,
        );
      }

      if (index < chapters.length - 1) {
        tl.to(chapter, { autoAlpha: 0, y: -48, duration: 0.24, ease: 'power2.in' }, at + 0.5)
          .to(figure, { yPercent: -16, duration: 0.24, ease: 'power2.in' }, at + 0.5);
      }
    });
  },

  destroy() {
    while (mobileTweens.length) {
      const tween = mobileTweens.pop();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    }
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;

    while (splits.length) splits.pop()?.revert();

    const section = $('[data-about]');
    if (section) {
      section.classList.remove('about--staged');
      section.style.removeProperty('height');
    }

    $$('[data-about-intro], [data-about-chapter], .about-chapter-figure, [data-about-glow], [data-about-progress-fill], [data-about-photo], [data-about-photo] img]').forEach(
      (element) => gsap.set(element, { clearProps: 'all' }),
    );

    const progressCurrent = $('[data-about-progress-current]');
    if (progressCurrent) progressCurrent.textContent = '01';
  },
};
