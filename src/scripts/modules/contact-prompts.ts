import type { AnimationModule } from '../core/module';
import { $, $$ } from '../core/utils';
import { getLenis } from '../core/smooth-scroll';

const cleanups: Array<() => void> = [];

export const contactPromptsModule: AnimationModule = {
  name: 'contact-prompts',

  init() {
    const dialog = $<HTMLDialogElement>('[data-contact-dialog]');
    const title = $<HTMLElement>('[data-contact-title]', dialog ?? document);
    const message = $<HTMLTextAreaElement>('[data-contact-message]', dialog ?? document);
    const send = $<HTMLAnchorElement>('[data-contact-send]', dialog ?? document);
    const bookingUrl = dialog?.dataset.contactWhatsapp;
    if (!dialog || !title || !message || !send || !bookingUrl) return;

    let whatsapp: URL;
    try {
      whatsapp = new URL(bookingUrl);
    } catch {
      return;
    }
    if (whatsapp.protocol !== 'https:' || whatsapp.hostname !== 'wa.me') return;

    let lastTrigger: HTMLElement | null = null;
    const updateSendLink = () => {
      const url = new URL(whatsapp);
      url.searchParams.set('text', message.value.trim());
      send.href = url.toString();
    };

    const restore = () => {
      getLenis()?.start();
      lastTrigger?.focus();
      lastTrigger = null;
    };

    for (const prompt of $$<HTMLButtonElement>('[data-contact-prompt]')) {
      const open = () => {
        lastTrigger = prompt;
        title.textContent = prompt.dataset.contactTitle ?? '';
        message.value = prompt.dataset.contactMessage ?? '';
        updateSendLink();
        getLenis()?.stop();
        dialog.showModal();
        message.focus();
      };
      prompt.addEventListener('click', open);
      cleanups.push(() => prompt.removeEventListener('click', open));
    }

    const closeOnBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    const closeOnSend = () => dialog.close();
    message.addEventListener('input', updateSendLink);
    dialog.addEventListener('close', restore);
    dialog.addEventListener('click', closeOnBackdrop);
    send.addEventListener('click', closeOnSend);
    cleanups.push(
      () => message.removeEventListener('input', updateSendLink),
      () => dialog.removeEventListener('close', restore),
      () => dialog.removeEventListener('click', closeOnBackdrop),
      () => send.removeEventListener('click', closeOnSend),
    );
  },

  destroy() {
    while (cleanups.length) cleanups.pop()?.();
  },
};
