# EdgeCenter — Infrastructure for big ideas · V2

A 24-page, responsive EdgeCenter design concept with a real, editable Spline scene. The original V1 remains in `AlexanderKozhevin/some_test`.

**Website:** https://alexanderkozhevin.github.io/test_v2/

**Spline source:** https://app.spline.design/file/145279db-c669-4841-9b93-72b78eb5a903 (opens in the owner's Spline workspace)

## Experience

- A silver Cloud frame, navy CDN frame, and frosted glass Security frame assemble around the idea core.
- Glow edition: a dark hero, emissive contours, iridescent materials, restrained native Spline bloom, and a pointer-reactive light. Cyan, lavender, and mint identify the products. Product cards echo these colors with cursor-following illumination.
- Five modes: system, cloud, CDN, security, and disassembled. Cloud reveals server trays, CDN an orbital network, Security a shield.
- Native Spline materials, geometry, lighting, orbit controls, and HTML interaction logic. No video masquerading as interactive 3D.
- Product pages open the same system in the relevant product mode. The remaining pages retain the approved visual system with refined typography and surfaces.
- A connected product narrative, searchable catalogue, product demos, industry pages, editorial pages, pricing, and a contact draft form.

## Run and build

```sh
npm ci
npm run build
npm run check
npm run serve
```

The project is static HTML/CSS/JS and can be served from a GitHub Pages project subdirectory. `src/build_site.py` generates 24 pages. `src/content.py` holds product content. `src/v2-home.html` and `v2.css` define the V2 direction.

`src/spline-controller.js` loads the pinned Spline runtime dynamically. `src/spline/interaction.html` is the editable motion/interaction document attached to the Spline file. After changing it in Spline, choose **Export → Code Export → Update Code Export**, then download the fresh `.splinecode` into `assets/spline/infrastructure.splinecode`.

## Performance and accessibility

The scene file is approximately 224 KiB; its static WebP cover is 23 KB. The runtime loads only near the visible scene. Phones, reduced-motion users, and data-saving connections start with a static cover and an explicit 3D button. Rendering pauses offscreen and in background tabs. Transitions settle without an idle animation loop. WebGPU and WebGL are supported.

The scene's sandboxed HTML overlay contains keyboard-accessible buttons and live status text. Site content and product navigation remain available without 3D. JavaScript-free visitors see the cover and the complete static page. A failed scene load exposes a retry button.

The existing 36-second intro is served as the compact H.264/AAC MP4 (9.1 MB), with `preload="none"`. It is not downloaded until requested. The original PDF brandbook remains available from the footer.

## Scope

This is a design demonstration, not the official EdgeCenter website. Contact forms prepare a draft in the browser; they do not submit information to a backend. Login and technical documentation links point to the actual services. Price/source notes remain visible on the relevant pages.

See [DESIGN.md](DESIGN.md) for the visual rationale and template research.
