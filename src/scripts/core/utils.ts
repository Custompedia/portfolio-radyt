/** Breakpoint tunggal: di bawah ini semua modul berat (ghost morph, horizontal
 *  scroll, sidebar auto-scale) dimatikan dan layout jatuh ke versi statis. */
export const DESKTOP_BREAKPOINT = 768;

export const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T | null =>
  scope.querySelector<T>(selector);

export const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T[] =>
  Array.from(scope.querySelectorAll<T>(selector));

export const isDesktop = (): boolean => window.innerWidth >= DESKTOP_BREAKPOINT;

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Efek visual mahal tetap ada, tetapi diringankan saat perangkat memberi sinyal resource terbatas. */
export const isPerformanceConstrained = (): boolean => {
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
  return (
    window.matchMedia('(update: slow)').matches ||
    navigator.hardwareConcurrency <= 4 ||
    (navigatorWithMemory.deviceMemory ?? Infinity) <= 4
  );
};

export function debounce<A extends unknown[]>(fn: (...args: A) => void, delay = 150) {
  let timer: number | undefined;
  return (...args: A) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

/**
 * Atribut `data-tl-from` / `data-tl-to` ditulis dengan kutip tunggal supaya enak
 * dibaca di dalam HTML — ubah dulu ke kutip ganda sebelum JSON.parse.
 */
export function parseVars(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw.replace(/'/g, '"')) as Record<string, unknown>;
  } catch {
    console.warn('[motion] gagal parse vars:', raw);
    return {};
  }
}

/** Tunggu font selesai dimuat — pengukuran layout sebelum ini tidak akurat. */
export function whenFontsReady(): Promise<void> {
  if (!('fonts' in document)) return Promise.resolve();
  return document.fonts.ready.then(() => undefined);
}
