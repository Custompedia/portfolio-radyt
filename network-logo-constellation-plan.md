# Network logo constellation

## Goal

Replace the current post-timeline network content with a logo-led section for active communities and trusted companies.

## Decisions

- Use the selected logo-constellation layout: Active in first, Trusted by second.
- Animate the two groups with one reversible GSAP sequence using opacity, translation, scale, and clip-path only.
- Download and validate only official logo assets; retain a text mark where no official asset is found.
- Keep the desktop arrangement expressive and the mobile layout a simple one-column grid.

## Tasks

- [x] Add verified membership logo data and local assets.
- [x] Render labelled Active in and Trusted by logo groups.
- [x] Replace the existing logo tween with the reversible constellation sequence.
- [x] Verify responsive layout, reduced-motion fallback, checks, and build.
