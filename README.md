# EdgeCenter V2 · Light studio

A 24-page responsive design concept based on the original light EdgeCenter direction, enhanced with an editable Spline scene.

**Website:** https://alexanderkozhevin.github.io/test_v2/

**Spline source:** https://app.spline.design/file/145279db-c669-4841-9b93-72b78eb5a903

The original light palette, headline and hero proof points are restored. Three matte metal/glass modules have five interactive states: system, cloud, CDN, security and disassembled. Strong glow, chromatic splitting, moving lights and temporal ambient shadows have been removed.

## Run

```sh
npm ci
npm run build
npm run check
npm run serve
```

`src/build_site.py` generates 24 static pages. The project works from a GitHub Pages subdirectory. `src/v2-home.html` and `v2.css` define the light design. `src/spline-controller.js` loads the pinned Spline runtime; `src/spline/interaction.html` is the scene's sandboxed control overlay.

After editing the Spline scene, use **Export → Code Export → Update Code Export**, then download the fresh export into `assets/spline/infrastructure.splinecode`.

## Rendering and accessibility

Spline runs in manual render mode with bounded render bursts during interaction and transitions. There is no idle animation loop. Rendering stops offscreen and in hidden tabs. Desktop exports use 2× pixel density. Phones, reduced-motion users and data-saving connections receive a cover and explicit 3D button first. Keyboard controls and the static page remain usable without a running 3D scene.

The background color is shared by the canvas and its container. The cover is a capture of the real scene. The compact 36-second H.264/AAC intro (9.1 MB) only loads on request. The original PDF brandbook remains linked in the footer.

This is a design demonstration. Contact forms prepare a local draft; no backend submission occurs. The original V1 remains in `AlexanderKozhevin/some_test`.

See [DESIGN.md](DESIGN.md) and [QA.md](QA.md).
