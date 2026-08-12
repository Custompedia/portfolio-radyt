import { gsap } from '../core/gsap';
import type { AnimationModule } from '../core/module';
import { $, $$, prefersReducedMotion } from '../core/utils';
import { getLenis } from '../core/smooth-scroll';

const cleanups: Array<() => void> = [];
const entrances: gsap.core.Timeline[] = [];
const edgeSlots = [0.14, 0.32, 0.5, 0.68, 0.86];

export const contactPromptsModule: AnimationModule = {
  name: 'contact-prompts',
  rebuildOnResize: true,

  init() {
    if (window.innerWidth > 900 && !prefersReducedMotion()) {
      for (const group of $$<HTMLElement>('[data-contact-group]')) {
        const items = $$<HTMLElement>('[data-contact-entrance]', group);
        const side = group.dataset.contactSide === 'right' ? 'right' : 'left';
        const direction = side === 'left' ? -1 : 1;
        const groupTop = group.getBoundingClientRect().top;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: 'top 100%',
            end: 'clamp(top 46%)',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const startY = window.innerHeight * (edgeSlots[index] ?? 0.5) - (window.innerHeight + rect.top - groupTop);
          gsap.set(item, {
            x: side === 'left' ? -rect.right - 32 : window.innerWidth - rect.left + 32,
            y: startY,
            rotation: direction * (2 - index) * 1.2,
            force3D: true,
          });

          const start = index * 0.5;
          timeline
            .to(item, {
              x: direction * 48,
              y: (2 - index) * 12,
              rotation: direction * 0.45,
              duration: 0.72,
              ease: 'power2.inOut',
            }, start)
            .to(item, {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.28,
              ease: 'power3.out',
            }, start + 0.72);
        });
        entrances.push(timeline);
      }
    }

    const dialog = $<HTMLDialogElement>('[data-contact-dialog]');
    const title = $<HTMLElement>('[data-contact-title]', dialog ?? document);
    const message = $<HTMLTextAreaElement>('[data-contact-message]', dialog ?? document);
    const send = $<HTMLAnchorElement>('[data-contact-send]', dialog ?? document);
    const panel = $<HTMLElement>('.contact-dialog-panel', dialog ?? document);
    const form = $<HTMLFormElement>('form', dialog ?? document);
    const bookingUrl = dialog?.dataset.contactWhatsapp;
    if (!dialog || !title || !message || !send || !panel || !form || !bookingUrl) return;

    let whatsapp: URL;
    try {
      whatsapp = new URL(bookingUrl);
    } catch {
      return;
    }
    if (whatsapp.protocol !== 'https:' || whatsapp.hostname !== 'wa.me') return;

    let lastTrigger: HTMLElement | null = null;
    let isClosing = false;
    let origin: HTMLElement | null = null;
    const updateSendLink = () => {
      const url = new URL(whatsapp);
      url.searchParams.set('text', message.value.trim());
      send.href = url.toString();
    };

    const removeOrigin = () => {
      if (origin) gsap.killTweensOf([origin, ...origin.children]);
      origin?.remove();
      origin = null;
    };

    const mountOrigin = () => {
      origin = document.createElement('span');
      origin.className = 'contact-dialog-origin';
      origin.setAttribute('aria-hidden', 'true');
      dialog.append(origin);
      return origin;
    };

    const restore = () => {
      gsap.killTweensOf([panel, origin].filter(Boolean));
      removeOrigin();
      gsap.set(panel, { clearProps: 'opacity,transform,transformOrigin,visibility' });
      getLenis()?.start();
      if (lastTrigger?.isConnected) lastTrigger.focus();
      lastTrigger = null;
      isClosing = false;
    };

    const close = () => {
      if (!dialog.open || isClosing) return;
      if (prefersReducedMotion() || !lastTrigger) {
        dialog.close();
        return;
      }

      isClosing = true;
      gsap.killTweensOf([panel, origin].filter(Boolean));
      removeOrigin();
      const triggerRect = lastTrigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const returnShape = mountOrigin();
      const returnInk = document.createElement('span');
      returnInk.className = 'contact-dialog-origin-ink';
      returnShape.append(returnInk);

      gsap.set(returnShape, {
        x: panelRect.left,
        y: panelRect.top,
        width: panelRect.width,
        height: panelRect.height,
        backgroundColor: '#f1eee3',
        transformOrigin: 'top left',
      });

      gsap
        .timeline({ onComplete: () => dialog.close() })
        .to(panel, { autoAlpha: 0, duration: 0.12, ease: 'power1.in' })
        .to(
          returnShape,
          {
            x: triggerRect.left,
            y: triggerRect.top,
            scaleX: triggerRect.width / panelRect.width,
            scaleY: triggerRect.height / panelRect.height,
            duration: 0.5,
            ease: 'expo.inOut',
          },
          0,
        )
        .to(returnInk, { opacity: 1, duration: 0.28, ease: 'power2.inOut' }, 0.16)
        .to(returnShape, { autoAlpha: 0, duration: 0.1 }, 0.42);
    };

    for (const prompt of $$<HTMLButtonElement>('[data-contact-prompt]')) {
      const open = () => {
        lastTrigger = prompt;
        title.textContent = prompt.dataset.contactTitle ?? '';
        message.value = prompt.dataset.contactMessage ?? '';
        updateSendLink();
        getLenis()?.stop();
        dialog.showModal();

        if (!prefersReducedMotion()) {
          const triggerRect = prompt.getBoundingClientRect();
          const panelRect = panel.getBoundingClientRect();
          const openingShape = mountOrigin();

          gsap.set(panel, { autoAlpha: 0, scale: 0.98, transformOrigin: 'center center' });
          gsap.set(openingShape, {
            x: triggerRect.left,
            y: triggerRect.top,
            width: triggerRect.width,
            height: triggerRect.height,
            backgroundColor: '#20201d',
            transformOrigin: 'top left',
          });

          gsap
            .timeline()
            .to(openingShape, {
              x: panelRect.left,
              y: panelRect.top,
              scaleX: panelRect.width / triggerRect.width,
              scaleY: panelRect.height / triggerRect.height,
              duration: 0.5,
              ease: 'expo.inOut',
            })
            .to(panel, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.3)
            .to(openingShape, { autoAlpha: 0, duration: 0.12, onComplete: removeOrigin }, 0.4);
        }

        message.focus();
      };
      prompt.addEventListener('click', open);
      cleanups.push(() => prompt.removeEventListener('click', open));
    }

    const closeOnBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) close();
    };
    const closeOnSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      close();
    };
    const closeOnCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    const closeOnSend = () => close();
    message.addEventListener('input', updateSendLink);
    dialog.addEventListener('close', restore);
    dialog.addEventListener('click', closeOnBackdrop);
    dialog.addEventListener('cancel', closeOnCancel);
    form.addEventListener('submit', closeOnSubmit);
    send.addEventListener('click', closeOnSend);
    cleanups.push(
      () => message.removeEventListener('input', updateSendLink),
      () => dialog.removeEventListener('close', restore),
      () => dialog.removeEventListener('click', closeOnBackdrop),
      () => dialog.removeEventListener('cancel', closeOnCancel),
      () => form.removeEventListener('submit', closeOnSubmit),
      () => send.removeEventListener('click', closeOnSend),
      () => {
        gsap.killTweensOf([panel, origin].filter(Boolean));
        removeOrigin();
        if (dialog.open) dialog.close();
      },
    );
  },

  destroy() {
    while (entrances.length) {
      const timeline = entrances.pop();
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
    }
    gsap.set($$('[data-contact-entrance]'), { clearProps: 'transform,opacity,visibility' });
    while (cleanups.length) cleanups.pop()?.();
  },
};
