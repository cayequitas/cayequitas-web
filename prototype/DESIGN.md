# Design direction: "scan sheet" (v1.2)

Carlos captures the physical world with scans and rebuilds it live, so the site reads like his capture notebook:
a technical drawing sheet with his work on it, measured and annotated, with lime used as a highlighter.

## Rules
- **Two grounds, one object.** Night (black) for Home and Lab, white paper for Projects, a project, Shows and About.
  What connects them is one fixed 3D layer: the Cayé mark as a point cloud. On Home it is light points scanned by the lime laser;
  on the paper pages the same cloud steps aside and is drawn as black ink with an olive scan line that follows the scroll.
  Fast scrolling scatters it, hovering a project or changing a filter nudges it, page changes burst it under the lime wipe.
  (v1.1 tried all-black pages; dropped because it lost the fun of the paper.)
- **Type.** Heuvel Grotesk Black, uppercase, cropped big for page heads (15vw+). Heuvel Light for contrast inside a headline.
  Hogisogi only for small labels, numbers and the count superscripts.
- **Lime is flat.** #D1FB46 as a block behind black text (nav state, filters, hover rows, stickers, the page wipe). No gradients, no glow, no text sheen.
- **Lines, not cards.** 1px hairlines, square corners, title blocks (bordered cells with a small label on top) for facts.
- **Dimension lines.** Project thumbnails draw their own dimension lines on hover (aspect ratio across, index down the side);
  the home has one between the two voices (Carlos Serrano / Cayé).
- **Stickers.** One tilted lime sticker per screen at most ("feel" on home, "Cayé" on art projects).
- **Motion.** A lime sheet with the Cayé mark wipes between pages. Projects keeps its "Something cool in every project" intro, on lime.

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
