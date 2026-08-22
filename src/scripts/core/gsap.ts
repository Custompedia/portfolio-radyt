/**
 * Satu titik registrasi GSAP. Semua modul mengimpor dari sini supaya plugin
 * tidak didaftarkan berkali-kali dan tree-shaking tetap bekerja.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

/**
 * DrawSVGPlugin dan Observer SENGAJA tidak didaftarkan, walau keduanya ada di
 * node_modules. DrawSVG tidak punya sasaran: satu-satunya animasi gambar-garis
 * di repo ini menargetkan `[data-growth-ring]`, dan selector itu nol elemen
 * sejak markup About ditulis ulang (kodenya sudah dibuang dari brand-stages.ts).
 * Observer tidak jadi dipakai karena scroller Work di mobile ternyata cukup
 * dilayani `scroller` + `horizontal: true` milik ScrollTrigger sendiri.
 * Mendaftarkan plugin yang tidak dipanggil hanya menambah berat bundel.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Bar URL mobile mengubah tinggi viewport tiap kali user scroll; tanpa ini ScrollTrigger menghitung ulang seluruh pin & trigger di tengah gerakan jari.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * KURVA RUMAH - dan alasan kenapa angkanya persis ini.
 *
 * `--ease-out` di tokens.css sudah lama `cubic-bezier(0.16, 1, 0.3, 1)`, dipakai
 * setiap transisi CSS di situs ini. Sementara itu tween GSAP-nya memakai
 * kosakata lain sama sekali - power2/power3/power4, expo, back dengan tiga nilai
 * overshoot berbeda. Jadi hover tombol dan singkap section yang berdampingan di
 * layar yang sama bergerak dengan dua watak yang berbeda.
 *
 * `EASE_OUT` di bawah adalah kurva CSS itu, ditulis ulang sebagai path
 * CustomEase - titik kendalinya sama persis. Sekali ini dipakai, gerakan CSS dan
 * gerakan GSAP akhirnya bicara dengan aksen yang sama.
 *
 * TIGA kurva, bukan tujuh, dan pembagiannya tegas:
 *   EASE_OUT     - sesuatu TIBA (singkap, fade-in, kartu mendarat)
 *   EASE_TRAVEL  - sesuatu BERPINDAH jauh lalu berhenti (wordmark terbang)
 *   EASE_POP     - sesuatu MELETUP (logo, badge; melewati 1 sedikit)
 *
 * Kurva lama di hero intro, Pedi, dan timeline SENGAJA tidak diganti: ketiganya
 * hasil penyetelan panjang terhadap koreografi masing-masing, dan menyeragamkan
 * demi keseragaman semata cuma akan membongkar yang sudah benar.
 */
export const EASE_OUT = CustomEase.create('house-out', 'M0,0 C0.16,1 0.3,1 1,1');
export const EASE_TRAVEL = CustomEase.create('house-travel', 'M0,0 C0.65,0 0.35,1 1,1');
export const EASE_POP = CustomEase.create('house-pop', 'M0,0 C0.2,0 0.15,1.28 0.52,1.08 0.73,0.98 0.86,1 1,1');

// Hanya saat dev: memudahkan memeriksa & men-seek timeline dari konsol
// devtools. Tidak ikut ter-bundle ke produksi.
if (import.meta.env.DEV) {
  (window as unknown as { gsap: typeof gsap }).gsap = gsap;
}

export { gsap, ScrollTrigger, SplitText, CustomEase };
