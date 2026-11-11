# Design direction: "scan sheet" (v1.6)

Carlos captures the physical world with scans and rebuilds it live, so the site reads like his capture notebook:
a technical drawing sheet with his work on it, measured and annotated, with lime used as a highlighter.

## Rules
- **Two grounds, one object.** Night (black) for Home and Lab, white paper for Projects, a project, Shows and About.
  What connects them is one fixed 3D layer: the Cayé mark as a particle fluid. A GPU simulation (position and velocity
  textures) springs every particle back to the mark while a flow field keeps it moving. Move or swipe to stir it, click or tap
  to blast it, hold to make a vortex; fast scrolling adds turbulence and page changes burst it under the lime wipe.
  Fast particles turn lime, so every gesture leaves a wake. On the paper pages the same fluid steps aside and is drawn as black
  ink with an olive scan line that follows the scroll. Needs WebGL2; without it the pages work with no 3D.
- **Type.** Heuvel Grotesk Black, uppercase, cropped big for page heads (15vw+). Heuvel Light for contrast inside a headline.
  Hogisogi only for small labels, numbers and the count superscripts.
- **Lime is flat.** #D1FB46 as a block behind black text (nav state, filters, hover rows, stickers, the page wipe). No gradients, no glow, no text sheen.
- **Lines, not cards.** 1px hairlines, square corners, title blocks (bordered cells with a small label on top) for facts.
- **Dimension lines.** Project thumbnails draw their own dimension lines on hover (aspect ratio across, index down the side);
  the home has one between the two voices (Carlos Serrano / Cayé).
- **Stickers.** One tilted lime sticker per screen at most ("feel" on home, "Cayé" on art projects).
- **Motion.** A lime sheet with the Cayé mark wipes between pages. Projects keeps its "Something cool in every project" intro, on lime.

## One page, one 3D room (v1.6)

The long scroll was dropped again: home is a single screen. What changed instead is the space the mark sits in.

- A floor grid runs into fog under the mark, and the particles reflect in it.
- Depth of field: particles away from the focal plane get larger and dimmer. The camera orbits slowly.
- Bloom and lit haze: the lime (fast or scanned) particles are blurred and added back, and the wide blur is multiplied by drifting noise so it reads as light in fog. Stirring, blasting or swirling the fluid raises an energy value that also lights a pool on the floor.
- Paper pages keep the same room in ink: grey grid, soft ink bleed in place of glow, reflection as a contact shadow.
- The featured project card holds each project for 9 seconds, pauses on hover or focus, and has previous/next arrows.

## Home as one long scroll (v1.5, dropped)

Studied the pacing of monogrid.com, then rebuilt it in this brand rather than copying it:

- Hero: the particle-fluid mark, with mono typewriter captions and block cursors scattered over it.
- `{ Selected works }`: nine projects in three columns that scroll at different speeds. Cards tilt with scroll speed, carry lime chips and light titles, and sit over a lime halftone glow. On phones they collapse to one column with no parallax.
- Manifesto: a full-bleed lime band with a halftone. Its uppercase statement fills in word by word as you scroll, and the header turns lime with black type while over it.
- Lab block: a big still with a `Enter [▶] Lab` square-icon button.
- The contact footer closes the home page too.
- The mark steps aside and dims once you scroll past the hero.

## Removed on purpose
Glassmorphism cards, pill chips, glow blobs, noise overlay, gradient text, HUD brackets, fake FPS/clock/coordinates,
floating wireframe cubes, rings and the tron floor grid, and the blurred 3D ambient behind content pages. They are the stock
"AI/dev tool" look (black, glow, particles, capsules) and made the site read as generated.

## Sources
- oil-ui (oil-oil/oil-ui): tone scales, "break one category default", one memorable moment, curtain page transitions.
- dimensional-drawing (enesozturk/dimensional-drawing): dimension lines, title blocks, monochrome hairline language.
- brand-identity-skill (fatihaydost/brand-identity-skill): the AI-defaults reflex test ("would I propose this for anyone else?").
- design.how (arla6ka/design.how): one token set instead of stacked override layers.
- Awwwards-mcp (INSANE0777/Awwwards-mcp): not installed; Carlos's own reference set (CTM, Vinicius Araujo, onformative,
  MONOMANGO, JASZ, Timo Milano, zeitguised) was used as the award-level reference instead.

## v1.7 Realism pass

- **Home and About particles are objects now.** Every particle is shaded as a small polished-metal ball (sphere normal from the point sprite, studio reflection, key-light highlight, Fresnel). A shadow map drawn from the key light lets the balls shade each other and drop a shadow on a lit studio floor. Moving particles still glow lime and feed the bloom. Thrown particles have weight and bounce off the floor.
- **About portrait** runs the same GPU fluid and the same shading, with the photo's brightness as the metal's tone and as depth relief.
- **White pages** drop the ink particles. Behind the content is a quiet white room: a grid floor running to the horizon and a few glass spheres that refract it, with soft shadows and caustics. The camera drifts with the cursor and moves forward as the page scrolls.
- **Lab** is a carousel of screens standing in a dark room with a glossy floor. One piece in front, the rest fanned to the sides. Drag, swipe, wheel, arrow keys, arrow buttons and dots all move one piece. Click the front piece or the button to open it. No page scroll.

## v1.8 Readability, organic glass, deeper Lab

- **Home:** the Fig. captions and floating typewriter labels are gone, the mark sits higher, and a dark gradient behind the copy keeps the text readable over the particles.
- **White pages:** the glass spheres are replaced by one organic, yellow-tinted glass form (ray-marched signed distance field at low resolution), blurred and veiled behind a frosted pane so it stays in the background. The thin hairline grid with small blocks from the brand book sits on top and travels with the scroll.
- **About:** the portrait is back to points: black ink on a white frosted card, lime where the fluid moves or the scan passes. Same fluid simulation, no spheres.
- **Lab:** a lattice of tiles receding into depth that drifts on its own. Scroll or drag to fly, point at a tile to light it, click to bring it to the front with its title and link. The lattice repeats, so it can hold any number of R&D posts.

## v1.9 Portrait, real glass, fuller home

- **About portrait** is rebuilt from the new studio photo: one particle per pixel that holds tone (about 100,000 on desktop), sized by darkness like a halftone, black on white, all running in the GPU fluid (stir, blast, swirl). The photo's backdrop is flattened at build time so only the figure becomes particles.
- **White pages:** the glass form is no longer a blend of spheres. It is a torus and lumps melted together and bent three times, ray-marched at half resolution with refraction through to its far side, dispersion, yellow absorption by thickness and sharp glints. No blur, only a light veil.
- **Home:** the room is furnished. The six featured projects stand as screens in an arc behind the mark, the one showing in the card is lit, and two lime light tubes mark the sides. All of it reflects in the floor.

## v2.0 The hall

- **Home** is a dark hall after the brand-book poster mock-up. One thing glows: a lime poster screen, drawn live on a canvas in the brand-book layout (hairlines, black blocks, wordmark, mark), showing the featured project's title and image and changing with the featured card. It lights the floor, the slatted walls and the back of every particle. Ceiling strips give perspective. The particle mark stands in front of it, smaller, and two organic glass forms float beside the screen and bend the picture behind them (marched at half resolution into a normal/thickness buffer, applied in the final pass).
- **About portrait:** black particles only, the exact brand lime (#D1FB46) with a soft glow where the fluid moves, no scan line.

## v2.1 Correct lime, LED bars

- **Accent colour fix:** the brand colours were passed to the shaders through a colour-space conversion and came out darker and greener than #D1FB46. They are now raw values, so the lime in every 3D layer matches the rest of the site.
- **About portrait:** particles are brand dark grey in the light tones and black in the dark ones. A moving particle is lime with a soft glow, with no in-between tints.
- **Home:** the poster screen and the glass forms are gone. Behind the mark stands a fan of nine LED bars (lime, two white) with halos, floor pools and reflections. A slow pulse runs along them and they flare with the energy of the fluid.

## v2.2 — ceiling lights, clean portrait

- Home: the scan line is gone. The LED bars moved to the ceiling: 18 short white strips in three angled columns per side, receding to the back wall, each casting a soft pool on the floor.
- About: portrait particles are black and grey only (no lime). Where the pointer stirs them they shrink instead of changing colour.

## v2.3 — minimal room

- Home: the slatted walls and scattered strips are replaced by a plain charcoal room with a ceiling and two recessed linear lights running from the back wall toward the camera.
- Walls, ceiling and floor are lit by the analytic falloff of those two line lights, with a soft glossy streak on the floor.

## v2.4 — open space

- Home: the room (walls, ceiling, lights) and both grids (floor grid and the brand-book hairline overlay) are removed. Only the floor and the particles remain.
- The camera sits closer (z 3.85 desktop, 7.4 phone) so the mark fills more of the screen. Particle size is unchanged.
