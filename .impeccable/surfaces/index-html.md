---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface: themepaper app (index.html)

Scope: the single-page tool. Mode: Operate. Ricer uploads a wallpaper, picks a scheme, compares, exports full-res PNG.

## Direction contract

THESIS: Every colour scheme is a paint-store fan-deck blade; you fan the deck, hover a blade to preview, pull it to commit, and the photo is repainted in it. Refuses the category default: dropzone card + scheme dropdown + settings sidebar on a dark panel UI.

OWN-WORLD: Matte printed chips on white card-stock blades (#fafaf7, ink #141414), a brass rivet at the pivot, soft offset shadows. The ground is the store counter, flooded with the selected scheme's background; UI text on the ground is the scheme's foreground. One type size everywhere (Archivo, hex codes in JetBrains Mono as data); rank by weight, case, reversal only. Raises: one-size type (timetable); the pulled blade floods the board (acetate); unchosen blades stay closed edge-on as slivers so the chosen one burns brightest (transit).

STORY: The visitor sees their photo already living in a scheme, understands every blade is an exact official palette, flicks through blades with instant preview, and downloads.

FIRST VIEWPORT: Thin top line: chip wordmark left, Open image / Download PNG right (download reversed). Photo print centred, as large as fits, split-compare handle. Bottom-left: the closed deck pivoting on a rivet at the viewport corner, current blade lying horizontal with chips + vertical hex codes + name at the tip, slivers of other blades peeking above. Bottom-right: a card-stock controls card (Mode Smooth/Strict, Strength, Dither, privacy line).

SIGNATURE INTERACTION: Click rivet (or press F) fans the deck open across ~80° over the stage; hovering/arrowing a blade previews it live on the photo; click/Enter pulls it, deck swings shut, counter floods to its background. Motion: one rotation grammar, exponential ease-out ~450ms, staggered per blade; reduced motion snaps.

FORM: The Fan Deck, position 6 of the ordered grounded list; seed key 61853ecd.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
