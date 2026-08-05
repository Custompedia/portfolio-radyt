/**
 * Satu titik registrasi GSAP. Semua modul mengimpor dari sini supaya plugin
 * tidak didaftarkan berkali-kali dan tree-shaking tetap bekerja.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

// Hanya saat dev: memudahkan memeriksa & men-seek timeline dari konsol
// devtools. Tidak ikut ter-bundle ke produksi.
if (import.meta.env.DEV) {
  (window as unknown as { gsap: typeof gsap }).gsap = gsap;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
