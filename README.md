# themepaper

Recolour any wallpaper into the colour scheme your desktop already uses.

Drop in a photo, fan out the deck, pick a scheme, download a full-resolution PNG. Everything runs in the browser on the GPU (WebGL2); images never leave your device.

## Schemes

Solarized (Dark, Light) · Gruvbox (Dark, Light) · Dracula · Nord · Catppuccin (Latte, Frappé, Macchiato, Mocha) · Tokyo Night (Night, Storm) · Rosé Pine (Main, Moon, Dawn) · Everforest (Dark, Light) · One Dark · Kanagawa Wave · Monokai

Palettes use each scheme's official hex values (`src/schemes.ts`).

## Modes

- **Smooth**: stretches the photo's lightness into the palette's range, then blends nearby palette colours in OKLab with Gaussian weights. Keeps photographic detail.
- **Strict**: every pixel snaps to the nearest palette colour (OKLab). Optional 8×8 ordered dithering between the two nearest colours.
- **Strength**: mixes the original and the remapped photo.

## Keys

| Key | Action |
| --- | --- |
| `F` | Fan the deck open / closed |
| `←` `→` | Previous / next scheme |
| `O` | Open an image |
| `⌘S` / `Ctrl+S` | Download PNG |
| `Esc` | Close the deck |

You can also drop or paste an image anywhere on the page.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## Deploy

`.github/workflows/pages.yml` builds and deploys to GitHub Pages on every push to `main`.
