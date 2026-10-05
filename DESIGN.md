---
name: themepaper
description: Recolour any wallpaper into a canonical editor colour scheme, picked from a paint-store fan deck.
colors:
  card-stock: "#fafaf7"
  card-ink: "#141414"
  card-muted: "#5b5b57"
  card-rule: "#dcdcd6"
  counter-ground: "#282828"
  counter-ink: "#ebdbb2"
  counter-ink-muted: "#a89984"
  counter-accent: "#fabd2f"
  brass-rim: "#8a6a3c"
  brass-face: "#c49a5e"
  brass-glint: "#ecd3a2"
typography:
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    fontVariation: "'wdth' 100"
  action:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.01em"
  wordmark:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 800
    lineHeight: 1.45
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 88"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 800
    lineHeight: 1.45
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 84"
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 800
    lineHeight: 1.45
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 84"
  tag:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 88"
  data:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "'tnum' 1"
rounded:
  hairline: "1px"
  sm: "2px"
  md: "3px"
  blade-head: "42px"
spacing:
  chip-gap: "2px"
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "14px"
  gutter: "24px"
  gutter-narrow: "16px"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.counter-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-reverse:
    backgroundColor: "{colors.counter-ink}"
    textColor: "{colors.counter-ground}"
    typography: "{typography.action}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  card-controls:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.md}"
    padding: "12px 14px 10px"
    width: "336px"
  blade:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.blade-head}"
    height: "84px"
  blade-tip-selected:
    backgroundColor: "{colors.card-ink}"
    textColor: "{colors.card-stock}"
    typography: "{typography.title}"
    padding: "10px 12px 8px 14px"
    width: "168px"
  segmented-option:
    backgroundColor: "transparent"
    textColor: "{colors.card-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.sm}"
    height: "28px"
  segmented-option-selected:
    backgroundColor: "{colors.card-ink}"
    textColor: "{colors.card-stock}"
  print-tag:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.card-ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "3px 8px"
  split-grip:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.sm}"
    width: "30px"
    height: "44px"
---

# Design System: themepaper

## Overview

**Creative North Star: "The Fan Deck"**

Every colour scheme is a blade of a paint-store fan deck: matte printed chips on white card stock, riveted at one corner with a brass pivot. You fan the deck out, hover a blade to see the photo repainted in it, and pull it to commit. The page itself is the store counter, and the counter takes on the colour of whatever blade was last pulled: its background floods to the scheme's background, and the text on it turns to the scheme's foreground. So the interface always sits inside the palette the user picked.

Two materials share the screen and never mix. The **counter** is changeable: it carries the scheme's colours, the top bar, and the photo print. The **card stock** is fixed: blades, the settings card, print tags and the split grip are always off-white card printed in near-black ink, whatever the counter is doing. The photo is the hero. The UI is a few small objects lying on the counter around it, and they lift off it with soft shadows.

Hierarchy runs at a single type size, the way a timetable does. Rank comes from weight, case, width and reversal (ink-on-card flipped to card-on-ink), not from scale. Hex values and numbers are data and set in mono. Motion follows one grammar: rotation about the rivet, exponential ease-out, staggered blade by blade.

**Key Characteristics:**
- The counter floods to the committed scheme's bg/fg. Previewing repaints only the print. The counter floods only on commit.
- Fixed card stock (#fafaf7 / #141414) for every object lying on the counter.
- One type size (13px). Rank by weight, case, width and reversal.
- JetBrains Mono only for hex codes and numeric readouts.
- A flat brass SVG rivet is the deck's pivot and its open/close control.
- Soft, diffuse offset shadows. Card stock rests on the counter; it does not float.
- One motion grammar: exponential ease-out, 460ms fan with per-blade stagger, short pull.

## Colors

The palette has two layers: a counter that borrows the active scheme's colours at runtime, and a fixed set of card-stock neutrals plus brass that belong to the deck itself.

### Primary
- **Counter Ground** (counter-ground): page background. Set from JS to the committed scheme's `bg`. The recorded value is the Gruvbox Dark default the page boots with. Transitions over 420ms on the ease-out curve.
- **Counter Ink** (counter-ink): all text and outline buttons on the counter, set from the scheme's `fg`. The reversed Download button fills with it.

### Secondary
- **Counter Accent** (counter-accent): the scheme's accent. Used only for the wordmark chip, `:focus-visible` outlines on the counter, and text selection. Nothing else.

### Tertiary
- **Brass Rim / Brass Face / Brass Glint** (brass-rim, brass-face, brass-glint): the rivet's three flat fills (outer ring, face, highlight arc). Brass belongs to the rivet and nowhere else.

### Neutral
- **Card Stock** (card-stock): surface of blades, the settings card, print tags, the split line and grip, and the wordmark plate.
- **Card Ink** (card-ink): text, segmented-control borders, slider track fill and thumb, and the reversed (selected) blade tip.
- **Card Muted** (card-muted): secondary text on card: hints, blade meta, the privacy line.
- **Card Rule** (card-rule): hairline divider above the privacy line and the unfilled slider track.
- **Counter Ink Muted** (counter-ink-muted): secondary status text on the counter, from the scheme's `muted`.

### Named Rules
**The Flood-on-Commit Rule.** Only a pulled (committed) blade repaints the counter. Hover and arrow-key preview repaint the photo print alone and leave the ground, ink and accent untouched.

**The Fixed Stock Rule.** Card-stock surfaces never take scheme colours. A blade, card, tag or grip is #fafaf7 with #141414 ink on every scheme, light or dark.

**The Official Hex Rule.** Chip colours and counter floods come straight from each scheme's official values in `schemes.ts`. Never tint, approximate or blend them for display.

## Typography

**Body Font:** Archivo Variable (with Archivo, system-ui, sans-serif), using its width axis
**Label/Mono Font:** JetBrains Mono Variable (with JetBrains Mono, ui-monospace, monospace)

**Character:** A sturdy grotesque that condenses and gets heavier where a printed swatch label would. Mono shows up only where the value is literal data.

### Hierarchy
- **Title** (800, 13px, 0.04em, uppercase, width 84%): scheme family name at the blade tip. On phones with the deck fanned it condenses to width 66% at 0.02em to fit the visible strip.
- **Label** (800, 13px, 0.06em, uppercase, width 84%): control row labels on the settings card (Mode, Strength, Dither).
- **Tag** (700, 13px, 0.06em, uppercase, width 88%): the card-stock tags pinned to the print corners, and the scheme name leading the status line.
- **Wordmark** (800, 13px, 0.01em, width 88%, lowercase "themepaper"): the wordmark plate only.
- **Action** (700, 13px, 0.01em): buttons, segmented options, the fan cue.
- **Body** (400, 13px, line-height 1.45): status line, variant names, hints, the stage note (max 46ch).
- **Data** (500, 13px, line-height 1, -0.02em, tabular numerals, mono): hex codes on chips (vertical), the strength readout, keyboard hints.

### Named Rules
**The One Size Rule.** Every piece of text is 13px. To rank something, change its weight, case, width or reverse it onto ink. Never change its size.

**The Data-Only Mono Rule.** JetBrains Mono sets hex codes, numeric readouts and key names. Words are never set in mono.

## Layout

There are three rows on a full-height grid: a 64px top bar, a stage that takes the remaining height, and a dock. The top bar has the wordmark plate at left, a status line that ellipsizes, and the actions at right. The print is centred in the stage and sized as large as fits. In the dock, the deck sits bottom-left with its rivet at the corner, and the 336px settings card sits bottom-right. Gutter is 24px. The page does not scroll on desktop.

The blade is 84px high and as long as the dock allows (760px default, set from JS). Its head is a square (2 x 42px) around the punched hole. Chips share the length between the head and a 168px tip, 2px apart. Chip hex codes run vertically and are dropped when a chip is narrower than 15px. Fanned open, the deck spreads up to 84° (limited by the room above the pivot) and lies over the stage.

At 860px and below, the gutter becomes 16px, blades 76px high, the page scrolls, the status line wraps to its own row, and the dock stacks deck over a full-width settings card. Each fanned blade's label condenses into one line at the tip. At 480px and below, button labels shorten ("Open", "Download").

Spacing is tight and practical: 2px between chips, 6/8/10px between rows and elements, 12-14px inside cards, 24px gutters.

## Elevation & Depth

Depth is physical and has one rule: card stock resting on the counter casts a soft, offset shadow, and the counter itself is flat. The light comes from above, so shadows drop straight down: a tight contact shadow plus a wide, negatively spread ambient. Nothing glows, and no shadow is hard-edged.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 1px 1px rgb(0 0 0 / 0.16), 0 8px 22px -8px rgb(0 0 0 / 0.5)`): blades, the settings card, tags, the split grip, the wordmark plate.
- **Print rest** (`box-shadow: 0 2px 3px rgb(0 0 0 / 0.2), 0 24px 60px -24px rgb(0 0 0 / 0.6)`): the photo print, the largest sheet on the counter.
- **Blade lifted** (`box-shadow: 0 2px 3px rgb(0 0 0 / 0.2), 0 18px 34px -10px rgb(0 0 0 / 0.65)`): a hovered or focused blade in the open fan, together with a 14px slide outward along its own axis.
- **Punched hole** (`box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.35)`): the hole in each blade head that the rivet passes through.
- **Sliver** (`box-shadow: 0 -1px 0 rgb(0 0 0 / 0.35)`, with `filter: brightness(0.62) saturate(0.85)`): unchosen blades in the closed deck, which show edge-on above the chosen one.

### Named Rules
**The Brightest Blade Rule.** When the deck is closed, only the chosen blade lies flat at full brightness. The others are dimmed slivers fanned 0.2° apart behind it.

## Shapes

Corners are nearly square: 2px on buttons, tags, grips and the segmented control, 3px on the settings card and blade tips, 1px on the slider thumb. The one curved form is the blade's rounded head (the 42px radius equals half the blade height), which gives each blade a fan-deck silhouette around its rivet. The rivet and the punched hole are true circles. Borders are 1px solid ink on outline controls. The single dashed border is the drag-and-drop hint (2px dashed counter ink).

## Components

### Buttons
Printed and direct: an outline for a secondary action, reversed ink for the primary one.
- **Shape:** near-square (2px), 36px tall, 14px side padding (10px on narrow screens), 16px stroke icon plus label with an 8px gap.
- **Outline:** transparent, with a counter-ink border at 55% mix. Hover makes the border full ink and adds a 10% ink wash.
- **Reverse (primary, Download):** filled with counter ink, text in counter ground. Hover mixes 14% ground into the fill.
- **Disabled:** 40% opacity, not-allowed cursor.
- **Focus:** 2px accent outline, 3px offset.

### Segmented control and switch (on card)
- **Style:** 1px card-ink border, 2px radius, 28px tall. Options are divided by a 1px ink rule.
- **State:** the selected option reverses to ink with card-stock text. Unselected options get an 8% ink wash on hover. Focus uses a 2px card-ink outline.
- **Switch:** the same construction with two halves (On/Off). Whichever half is active is reversed.

### Range slider (on card)
A 2px track that is filled in card ink up to the value and card-rule beyond it. The thumb is a 12 x 22px ink tab with a 1px radius, a 2px card-stock border and a 1px ink ring. The readout to its right is set in Data type.

### Cards / Containers
- **Corner Style:** 3px.
- **Background:** card stock with card-ink text.
- **Shadow Strategy:** card rest.
- **Border:** none. A card-rule hairline separates the footer line.
- **Internal Padding:** 12px 14px 10px. Rows sit on a 76px label column with 10px gaps.

### Print tags
Small card-stock labels pinned 12px in from the print's top corners ("Original" left, scheme name right), set in Tag type. A tag fades out when the split hides its side.

### Split compare
A 2px card-stock line (with a faint dark ring) and a 30 x 44px card-stock grip with a chevron icon. The hit area is 44px wide. Focus outlines the grip in the accent.

### The Fan Deck (signature)
- **Blade:** a card-stock strip with a rounded head, a punched hole, a run of printed chips, and a 168px tip. The tip shows the family name (Title type), the variant (Body), and meta "NN/20 · N chips · dark/light" in card muted, pinned to the bottom.
- **Selected:** the tip reverses (ink background, card-stock text, meta at 72% card).
- **Rivet:** a flat 26px brass disc (rim, face, glint arc, centre dot) with a 1px drop shadow. It is a real button and toggles the fan (key F). On hover it turns -30° and scales up by 8%.
- **Fan:** blades rotate about the rivet on `cubic-bezier(0.16, 1, 0.3, 1)` over 460ms. Each blade starts 12ms after the one before it when opening, and they close in reverse at 6ms per blade. Hex codes hide while fanned, and only names are shown.
- **Preview / pull:** hovering or arrowing a blade lifts it 14px over 220ms and repaints the print. Clicking or pressing Enter pulls it 36px over 160ms, the counter floods (420ms), and after 170ms the deck swings shut.
- **Fan cue:** an underlined text button beside the deck ("Fan out 20 schemes" / "Hover to preview, click to pick"), with an SVG fan icon.
- **Reduced motion:** the fan duration drops to 0 and floods snap.

## Do's and Don'ts

### Do:
- **Do** put every object lying on the counter (blades, the settings card, print tags, the split grip, the wordmark plate) on card stock (#fafaf7, ink #141414) with the card rest shadow. Bar actions, status and the fan cue go directly on the counter in scheme ink.
- **Do** set text on the counter in the scheme's own fg/muted, and use the scheme accent only for the wordmark chip, focus and selection.
- **Do** rank text with weight, uppercase, the width axis (84-88%, down to 66% for fanned phone labels) and ink reversal, all at 13px.
- **Do** set hex codes and numeric readouts in JetBrains Mono with tabular numerals.
- **Do** animate movement as rotation or a slide along the blade axis, with exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) and per-blade stagger. Snap under reduced motion.
- **Do** keep previews confined to the print. Only flood the counter on commit.

### Don't:
- **Don't** introduce a second font size, or a display face for headings.
- **Don't** tint card stock with the active scheme.
- **Don't** use hard-edged offset shadows or glows. Card stock casts soft, downward shadows only.
- **Don't** use brass anywhere except the rivet.
- **Don't** approximate or restyle a scheme's colours. Chips and floods use the official hex values.
- **Don't** set words in mono, or hex values in Archivo.
