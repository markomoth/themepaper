# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + vanilla TypeScript, no UI framework. Static build. Deploy target: GitHub Pages from the public repo.

## Users

Ricers: Linux/desktop customisers who have already themed their terminal, editor and bar with a famous colour scheme, and want their wallpaper to match. They arrive with a photo they like and a scheme they already use; the job is "make this image belong to my setup" in under a minute.

## Product Purpose

Upload a wallpaper photo, pick a well-known colour scheme, get the same image recoloured into that scheme, download it at full resolution. Success: the result looks deliberate on a desktop next to themed apps, not like a cheap filter.

## Positioning

Runs entirely in the browser (no upload to a server, no install), offers both a perceptual "smooth" remap that keeps photographic detail and a "strict" palette snap for the classic gowall/ImageGoNord look, with a strength control, across a curated set of canonical schemes with exact official hex values.

## Operating Context

Used on a desktop browser while ricing; output is set as wallpaper via feh, swww, hyprpaper, GNOME/KDE settings, macOS etc. Input images are often large (4K+, ultrawide). Users compare schemes back and forth before committing.

## Capabilities and Constraints

- Client-side only; images never leave the device.
- Modes: Smooth (OKLab perceptual mapping) and Strict (nearest palette colour, optional dithering), plus strength/mix.
- Schemes include at least: Solarized Dark/Light, Gruvbox Dark/Light, Dracula, Nord, Catppuccin (Latte/Frappé/Macchiato/Mocha), Tokyo Night, Rosé Pine, Everforest, One Dark, Kanagawa.
- Export at original resolution, PNG.
- Must stay responsive on 4K+ images (work off the main thread / GPU).

## Brand Commitments

Name: themepaper (lowercase).

## Evidence on Hand

No testimonials, users, or sample photography exist yet. Do not fabricate usage claims.

## Product Principles

1. The image is the hero; the UI gets out of its way.
2. Exact palettes: use official hex values, never approximations.
3. Instant comparison: switching schemes must feel immediate.
4. Private by construction: nothing is uploaded.

## Accessibility & Inclusion

Keyboard-operable scheme picker and controls; WCAG AA contrast for UI text.
