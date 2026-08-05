/**
 * Kontrak modul animasi. Tiap modul berdiri sendiri, tahu cara membongkar
 * dirinya, dan menyatakan apakah ia butuh dibangun ulang saat viewport berubah.
 */
export interface AnimationModule {
  /** Dipakai untuk log dan debugging. */
  readonly name: string;

  /** Hanya diinisialisasi pada viewport >= DESKTOP_BREAKPOINT. */
  readonly desktopOnly?: boolean;

  /** Dilewati sepenuhnya bila user meminta reduced motion. */
  readonly skipOnReducedMotion?: boolean;

  init(): void;

  /** Melepas listener, tween, dan inline style yang dibuat oleh init(). */
  destroy?(): void;

  /**
   * Dipanggil saat resize. Default-nya destroy() lalu init() — override hanya
   * bila modul butuh urutan khusus (mis. mengukur ulang sebelum membangun).
   */
  rebuild?(): void;

  /** Perlu dibangun ulang saat lebar viewport berubah (bukan cuma tinggi). */
  readonly rebuildOnResize?: boolean;
}
