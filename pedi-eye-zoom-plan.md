# Pedi Eye Zoom

## Goal
Replace the mascot wave and upward exit with a close eye-focused camera shot while preserving the complete pinned-scroll story, CTA, responsive fallbacks, and natural transition into the FAQ.

## Final Design
- Preserve the left entrance, turn to camera, headline reveal, three moments, and closing CTA.
- Remove every skeletal arm and hand animation.
- Fade all text, rings, guide lines, CTA, and ground shadow before the close-up begins.
- Drive the close-up through the Three.js camera position, look target, and field of view rather than scaling the canvas.
- Hold the final crop as a clean head portrait with both ears and both sides intact, then let ScrollTrigger unpin naturally so the FAQ rises from below.
- Keep tablet, mobile, and reduced-motion layouts in normal flow with a static medium shot.
- Preserve lazy loading, reverse-scroll behavior, resize rebuilds, WebGL disposal, and the missing-model error state.

## Decision Log
- Selected close-up over pupil portal to preserve the portfolio's restrained dark-yellow visual language.
- Selected a real camera dolly over CSS scaling for depth, sharpness, and reversible scroll behavior.
- Kept the closing CTA before the zoom so the previous conversion task is not lost.
- Rejected skeletal motion because it deforms the supplied rig and distracts from the final gaze.

## Tasks
- [x] Replace skeletal pose controls with one reversible camera-focus value in `pedi-scene.ts`.
- [x] Rebuild the GSAP timeline in `packaging-test.ts` without dropping arrival, moments, or closing CTA.
- [x] Match the ScrollTrigger length and sidebar theme duration to the longer choreography.
- [x] Tune the final head portrait and natural FAQ handoff at desktop widths.
- [x] Verify reverse scroll, resize, mobile, reduced motion, lazy loading, and failed-model fallback.
- [x] Run `npm run check`, `npm run build`, and `git diff --check`.

## Done When
- [x] The final frame contains no visible copy or decoration and holds a clean portrait of Pedi's head.
- [x] The mascot never waves or moves a bone.
- [x] Scrolling forward and backward produces no jump, stale pose, overlap, or WebGL error.
- [x] Existing CTA content and responsive fallbacks remain available.
