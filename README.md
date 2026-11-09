# cayequitas-web

Portfolio and workspace site for Carlos Serrano (commercial voice) and Cayé (artistic voice).

## Status

Phase 0: clickable prototype. The production app (Next.js + Payload CMS + Postgres on Vercel) comes next.

## Prototype

`prototype/` is a single-page HTML prototype built from parts:

- `template.html`: page structure and main script
- `parts/`: section markup, WebGL scenes (`scenes.js`, Three.js r158) and the design layer (`style.css`)
- `data/`: project thumbnails and logos as data URIs
- `build.py`: assembles everything into `prototype/cayequitas-prototype.html`

```
python3 prototype/build.py            # prototype with review notes and TBC markers
python3 prototype/build.py --public   # clean single-file review build
pip install fonttools brotli
python3 prototype/build.py --public --site _site   # what GitHub Pages deploys
```

`--site` writes a split, mobile-ready site: a small `index.html` with a viewport tag, plus hashed `assets/` (woff2 fonts, images, `app.js`) that browsers cache.

### Fonts

Heuvel Grotesk and Hogisogi are in `prototype/fonts/` (source files) and `prototype/data/fonts.json` (base64, embedded by the build).

### Palette

#000000, #FFFFFF, #5A5A5A, #707070, Synthetic Green #D1FB46, #86A80C. No other accents.
