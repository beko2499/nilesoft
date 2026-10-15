# Abubkr portfolio

Independent English portfolio at `/abubkr.html`, using NILESOFT copper, ivory, charcoal and locally hosted Inter Tight / Chakra Petch fonts. The existing marketing-page layout is unchanged; its footers link to the portfolio.

## Build and preview

From this directory, run `npm ci` then `npm run build` (Node 20.19+ or 22.12+). The build type-checks TypeScript and writes `../assets/portfolio/app/portfolio.js`, `portfolio.css` and hashed JavaScript chunks. Include the entire output directory alongside source changes when publishing: the existing Render static build does not install this separate app's dependencies.

Serve the parent `nilesoft-landing` directory over HTTP, for example `python -m http.server 8127 --bind 127.0.0.1`, then visit `http://127.0.0.1:8127/abubkr.html`. Root-relative assets require HTTP, not opening the HTML as a local file. For production, run the existing parent build `node tools/build-static.mjs`; the page and public assets are included in `dist`, while source and node_modules stay private. No deployment is performed by these commands.

## Implementation

- `src/projects.ts`: nine stable project IDs, images, accurate status labels, descriptions, scope and optional real/demo URLs. Replace illustrative previews with verified work as it becomes available. Concepts are explicitly labelled and do not pretend to be client commissions.
- `src/motion.ts`: orbit geometry and staggered docking timing.
- `src/PaperRenderer.ts`: primary WebGL paper rendering. Each face uses a connected 36×20 grid (777 vertices), analytic normals, separate printed front/back textures and a thin edge mesh. An arc-length-integrated curve extruded along a perpendicular axis produces a near-inextensible developable sheet rather than a stretching sine-wave cloth. A damped spring follows curvature targets; a small secondary curvature wave and a changing diagonal bend axis add motion. Rough, nonmetallic PBR materials, subtle fiber bump, hemisphere/key/fill lighting and shadow maps create the paper appearance. During final docking, lighting blends out of the print to restore exact readable image colors.
- `src/PaperCard.tsx` and `src/paper.css`: accessible DOM buttons and twelve-strip CSS fallback when WebGL fails or its context is lost. GPU canvases are decorative. The front shows the project; the reverse carries AB / NILESOFT and the project name. Curvature and rotation ease to zero at docking.
- `src/HeroScene.tsx`: React portals preserve the same nine card buttons and Three.js CSS3DObjects throughout forward/reverse scrolling. Two CSS3DRenderer scenes layer cards behind/in front of the stationary alpha portrait. Per-layer transforms are restored on reparenting because each renderer maintains its own style cache.
- `src/portfolio.css`: responsive glass sheet, typography and layout. Three columns on desktop, two on phones for legibility. All nine cards orbit on both sizes, with a smaller spherical radius and card scale on phones.
- `src/main.tsx`: project index, accessible native details dialogs, about/contact and motion controls. Reduced-motion preferences default to a simple layout; an explicit Simple view is always available. The HTML also has meaningful no-JavaScript fallback content.

Cards are distributed over a constant-radius spherical band centered on the portrait's head, using golden-angle spacing. Elevation stays between -0.05 and 0.68 of the radius, keeping the orbit around the head and above the neck. Each entire sheet renders in exactly one of the rear/front WebGL layers, matching the accessible CSS layer. A 24-unit depth dead band stabilizes layer transitions. There are no clipping planes slicing through a curved sheet, so a passing sheet retains its complete perimeter. The portrait's silhouette naturally occludes sheets behind it. Both layers share CPU geometry and image sources, with separate GPU resources. Ambient spin has slight speed variation; its winding is retained during docking to avoid abrupt Euler wrapping.

Motion continues for undocked cards throughout the reveal and slows into their grid slots. Pausing ambient motion makes scroll transforms reversible; with motion enabled, reversing returns cards to the continuing orbit rather than rewinding time. Rendering pauses when the scene or tab is hidden, when motion is paused, or when a project dialog is open. Reduced-motion preferences retain the static layout. Mobile rendering caps pixel density at 1.35, uses 512px shadow maps and lower-resolution print textures. GPU resources are disposed on unmount/context loss. The CSS controls and project index work without WebGL.

## Research and boundaries

- [Bo & Wang, Geodesic-Controlled Developable Surfaces for Modeling Paper Bending (2007)](https://hub.hku.hk/handle/10722/152374): supports the key distinction between bending paper and stretching cloth. The implementation uses a simpler extruded developable curve, not that paper's full solver.
- [Baraff & Witkin, Large Steps in Cloth Simulation (1998)](https://www.cs.cmu.edu/~baraff/papers/sig98.pdf): context for stiffness, damping and stable integration. Here only curvature is spring-driven with bounded substeps; this is not a full mass-spring cloth or aerodynamic simulation.
- [Three.js BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html) and [MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html): connected geometry, surface normals and physically based roughness/lighting. No clearcoat or glass-like transmission is applied to the paper.

This is a lightweight, art-directed thin-sheet approximation. There is no paper-paper collision solver, full elastic shell solver or head-volume collision simulation. The portrait is still a transparent raster cutout rather than a rigged 3D head, and the glass sheet still uses CSS backdrop blur rather than physical refraction. Shadow maps apply within each GPU layer, not onto the HTML portrait.

## Asset provenance

The approved supplied portrait is preserved at `assets/portfolio/portrait-approved.png`. `character.png` is the transparent-background generative edit of that supplied portrait, with its framing and character appearance preserved as closely as possible. The source was `Sorriso Sereno em Verde Suave.png` supplied by the user; no earlier generated face is used.

Portrait edit prompt: “BACKGROUND REMOVAL ONLY. Use this exact supplied approved stylized portrait, do not regenerate or redraw the man. Remove ONLY the sage green backdrop into genuine transparent alpha. Preserve EXACT original facial features, closed eyes, relaxed smile, hair silhouette and individual curls, skin shade, shirt ribbing, collar, torso shape, lighting, every character detail. Output same landscape 1672x941 composition and pixel alignment, same scale and framing, character stays at center with original transparent left/right space, torso ends at bottom edge. No shadows or glow outside silhouette. No new background, no checkerboard painted in, no color change. This is a precise production cutout of the existing approved image, not a new portrait. Transparent PNG.”

The four PNGs in `assets/portfolio/projects` are screenshots of the existing NILESOFT website and its Dukkan, Lamsa and Diafa demos. Other project images reuse existing assets and are marked as concepts/in-development where applicable. The NILESOFT brand mark is the existing SVG, not a generated replacement.

## Verification

Checked in Chromium at 1440×900, 1024×768, 768×1024, 390×844 and 320×568: docking counts 3/6/9, stationary portrait, reversible transforms by project ID, same DOM buttons, in-viewport docked cards, no horizontal overflow, detail links, Escape, focus restoration, simple view, and no console/HTTP errors. Reduced-motion and no-JavaScript paths were also checked. This is not a substitute for testing Safari/iOS on actual hardware.

WebGL checks additionally cover shader/console errors, blocked WebGL, live context loss and CSS recovery. A sampled curved-sheet case (bend 1.6, diagonal axis 0.42, secondary wave 0.12) measured maximum edge-length deviation of approximately 0.014%, thickness error below 0.00001 world units and unit-normal error below 0.00000004. These validate the implemented geometry in that test, not general physical accuracy or a device frame-rate guarantee.

The clipping regression checks complete-sheet visibility at depths -100, -12, 0, 12 and 100: exactly one layer is visible and no material has clipping planes. A 12,987-pose sweep across desktop and phone sizes verifies that orbit centers remain inside the head-height band at a constant radius over two minutes of animation.
