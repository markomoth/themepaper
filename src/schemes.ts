export interface Chip {
  name: string;
  hex: string;
}

export interface Scheme {
  id: string;
  family: string;
  variant: string;
  kind: "dark" | "light";
  /** Background the counter floods to when this blade is pulled. */
  bg: string;
  /** Foreground used for UI text on the flooded counter. */
  fg: string;
  /** Muted foreground for secondary UI text on the counter. */
  muted: string;
  /** Accent used for the wordmark chip and focus marks. */
  accent: string;
  chips: Chip[];
}

const c = (name: string, hex: string): Chip => ({ name, hex });

// Official values from each scheme's own spec or reference implementation.
export const SCHEMES: Scheme[] = [
  {
    id: "solarized-dark",
    family: "Solarized",
    variant: "Dark",
    kind: "dark",
    bg: "#002b36",
    fg: "#93a1a1",
    muted: "#839496",
    accent: "#b58900",
    chips: [
      c("base03", "#002b36"), c("base02", "#073642"), c("base01", "#586e75"),
      c("base0", "#839496"), c("base1", "#93a1a1"), c("yellow", "#b58900"),
      c("orange", "#cb4b16"), c("red", "#dc322f"), c("magenta", "#d33682"),
      c("violet", "#6c71c4"), c("blue", "#268bd2"), c("cyan", "#2aa198"),
      c("green", "#859900"),
    ],
  },
  {
    id: "solarized-light",
    family: "Solarized",
    variant: "Light",
    kind: "light",
    bg: "#fdf6e3",
    fg: "#073642",
    muted: "#586e75",
    accent: "#cb4b16",
    chips: [
      c("base3", "#fdf6e3"), c("base2", "#eee8d5"), c("base1", "#93a1a1"),
      c("base00", "#657b83"), c("base01", "#586e75"), c("yellow", "#b58900"),
      c("orange", "#cb4b16"), c("red", "#dc322f"), c("magenta", "#d33682"),
      c("violet", "#6c71c4"), c("blue", "#268bd2"), c("cyan", "#2aa198"),
      c("green", "#859900"),
    ],
  },
  {
    id: "gruvbox-dark",
    family: "Gruvbox",
    variant: "Dark",
    kind: "dark",
    bg: "#282828",
    fg: "#ebdbb2",
    muted: "#a89984",
    accent: "#fabd2f",
    chips: [
      c("bg", "#282828"), c("bg1", "#3c3836"), c("bg2", "#504945"),
      c("gray", "#928374"), c("fg4", "#a89984"), c("fg", "#ebdbb2"),
      c("red", "#fb4934"), c("green", "#b8bb26"), c("yellow", "#fabd2f"),
      c("blue", "#83a598"), c("purple", "#d3869b"), c("aqua", "#8ec07c"),
      c("orange", "#fe8019"),
    ],
  },
  {
    id: "gruvbox-light",
    family: "Gruvbox",
    variant: "Light",
    kind: "light",
    bg: "#fbf1c7",
    fg: "#3c3836",
    muted: "#7c6f64",
    accent: "#af3a03",
    chips: [
      c("bg", "#fbf1c7"), c("bg1", "#ebdbb2"), c("bg2", "#d5c4a1"),
      c("gray", "#928374"), c("fg4", "#7c6f64"), c("fg", "#3c3836"),
      c("red", "#9d0006"), c("green", "#79740e"), c("yellow", "#b57614"),
      c("blue", "#076678"), c("purple", "#8f3f71"), c("aqua", "#427b58"),
      c("orange", "#af3a03"),
    ],
  },
  {
    id: "dracula",
    family: "Dracula",
    variant: "Classic",
    kind: "dark",
    bg: "#282a36",
    fg: "#f8f8f2",
    muted: "#a3acd0",
    accent: "#bd93f9",
    chips: [
      c("background", "#282a36"), c("current", "#44475a"), c("comment", "#6272a4"),
      c("foreground", "#f8f8f2"), c("cyan", "#8be9fd"), c("green", "#50fa7b"),
      c("orange", "#ffb86c"), c("pink", "#ff79c6"), c("purple", "#bd93f9"),
      c("red", "#ff5555"), c("yellow", "#f1fa8c"),
    ],
  },
  {
    id: "nord",
    family: "Nord",
    variant: "Polar Night",
    kind: "dark",
    bg: "#2e3440",
    fg: "#eceff4",
    muted: "#d8dee9",
    accent: "#88c0d0",
    chips: [
      c("nord0", "#2e3440"), c("nord1", "#3b4252"), c("nord2", "#434c5e"),
      c("nord3", "#4c566a"), c("nord4", "#d8dee9"), c("nord5", "#e5e9f0"),
      c("nord6", "#eceff4"), c("nord7", "#8fbcbb"), c("nord8", "#88c0d0"),
      c("nord9", "#81a1c1"), c("nord10", "#5e81ac"), c("nord11", "#bf616a"),
      c("nord12", "#d08770"), c("nord13", "#ebcb8b"), c("nord14", "#a3be8c"),
      c("nord15", "#b48ead"),
    ],
  },
  {
    id: "catppuccin-latte",
    family: "Catppuccin",
    variant: "Latte",
    kind: "light",
    bg: "#eff1f5",
    fg: "#4c4f69",
    muted: "#6c6f85",
    accent: "#8839ef",
    chips: [
      c("base", "#eff1f5"), c("mantle", "#e6e9ef"), c("surface0", "#ccd0da"),
      c("overlay0", "#9ca0b0"), c("subtext0", "#6c6f85"), c("text", "#4c4f69"),
      c("rosewater", "#dc8a78"), c("flamingo", "#dd7878"), c("pink", "#ea76cb"),
      c("mauve", "#8839ef"), c("red", "#d20f39"), c("maroon", "#e64553"),
      c("peach", "#fe640b"), c("yellow", "#df8e1d"), c("green", "#40a02b"),
      c("teal", "#179299"), c("sky", "#04a5e5"), c("sapphire", "#209fb5"),
      c("blue", "#1e66f5"), c("lavender", "#7287fd"),
    ],
  },
  {
    id: "catppuccin-frappe",
    family: "Catppuccin",
    variant: "Frappé",
    kind: "dark",
    bg: "#303446",
    fg: "#c6d0f5",
    muted: "#a5adce",
    accent: "#ca9ee6",
    chips: [
      c("crust", "#232634"), c("base", "#303446"), c("surface0", "#414559"),
      c("overlay0", "#737994"), c("subtext0", "#a5adce"), c("text", "#c6d0f5"),
      c("rosewater", "#f2d5cf"), c("flamingo", "#eebebe"), c("pink", "#f4b8e4"),
      c("mauve", "#ca9ee6"), c("red", "#e78284"), c("maroon", "#ea999c"),
      c("peach", "#ef9f76"), c("yellow", "#e5c890"), c("green", "#a6d189"),
      c("teal", "#81c8be"), c("sky", "#99d1db"), c("sapphire", "#85c1dc"),
      c("blue", "#8caaee"), c("lavender", "#babbf1"),
    ],
  },
  {
    id: "catppuccin-macchiato",
    family: "Catppuccin",
    variant: "Macchiato",
    kind: "dark",
    bg: "#24273a",
    fg: "#cad3f5",
    muted: "#a5adcb",
    accent: "#c6a0f6",
    chips: [
      c("crust", "#181926"), c("base", "#24273a"), c("surface0", "#363a4f"),
      c("overlay0", "#6e738d"), c("subtext0", "#a5adcb"), c("text", "#cad3f5"),
      c("rosewater", "#f4dbd6"), c("flamingo", "#f0c6c6"), c("pink", "#f5bde6"),
      c("mauve", "#c6a0f6"), c("red", "#ed8796"), c("maroon", "#ee99a0"),
      c("peach", "#f5a97f"), c("yellow", "#eed49f"), c("green", "#a6da95"),
      c("teal", "#8bd5ca"), c("sky", "#91d7e3"), c("sapphire", "#7dc4e4"),
      c("blue", "#8aadf4"), c("lavender", "#b7bdf8"),
    ],
  },
  {
    id: "catppuccin-mocha",
    family: "Catppuccin",
    variant: "Mocha",
    kind: "dark",
    bg: "#1e1e2e",
    fg: "#cdd6f4",
    muted: "#a6adc8",
    accent: "#cba6f7",
    chips: [
      c("crust", "#11111b"), c("base", "#1e1e2e"), c("surface0", "#313244"),
      c("overlay0", "#6c7086"), c("subtext0", "#a6adc8"), c("text", "#cdd6f4"),
      c("rosewater", "#f5e0dc"), c("flamingo", "#f2cdcd"), c("pink", "#f5c2e7"),
      c("mauve", "#cba6f7"), c("red", "#f38ba8"), c("maroon", "#eba0ac"),
      c("peach", "#fab387"), c("yellow", "#f9e2af"), c("green", "#a6e3a1"),
      c("teal", "#94e2d5"), c("sky", "#89dceb"), c("sapphire", "#74c7ec"),
      c("blue", "#89b4fa"), c("lavender", "#b4befe"),
    ],
  },
  {
    id: "tokyo-night",
    family: "Tokyo Night",
    variant: "Night",
    kind: "dark",
    bg: "#1a1b26",
    fg: "#c0caf5",
    muted: "#a9b1d6",
    accent: "#7aa2f7",
    chips: [
      c("bg_dark", "#16161e"), c("bg", "#1a1b26"), c("bg_hl", "#292e42"),
      c("black", "#414868"), c("comment", "#565f89"), c("fg_dark", "#a9b1d6"),
      c("fg", "#c0caf5"), c("blue", "#7aa2f7"), c("cyan", "#7dcfff"),
      c("blue1", "#2ac3de"), c("magenta", "#bb9af7"), c("purple", "#9d7cd8"),
      c("orange", "#ff9e64"), c("yellow", "#e0af68"), c("green", "#9ece6a"),
      c("green1", "#73daca"), c("teal", "#1abc9c"), c("red", "#f7768e"),
    ],
  },
  {
    id: "tokyo-night-storm",
    family: "Tokyo Night",
    variant: "Storm",
    kind: "dark",
    bg: "#24283b",
    fg: "#c0caf5",
    muted: "#a9b1d6",
    accent: "#bb9af7",
    chips: [
      c("bg_dark", "#1f2335"), c("bg", "#24283b"), c("bg_hl", "#292e42"),
      c("black", "#414868"), c("comment", "#565f89"), c("fg_dark", "#a9b1d6"),
      c("fg", "#c0caf5"), c("blue", "#7aa2f7"), c("cyan", "#7dcfff"),
      c("blue1", "#2ac3de"), c("magenta", "#bb9af7"), c("purple", "#9d7cd8"),
      c("orange", "#ff9e64"), c("yellow", "#e0af68"), c("green", "#9ece6a"),
      c("green1", "#73daca"), c("teal", "#1abc9c"), c("red", "#f7768e"),
    ],
  },
  {
    id: "rose-pine",
    family: "Rosé Pine",
    variant: "Main",
    kind: "dark",
    bg: "#191724",
    fg: "#e0def4",
    muted: "#908caa",
    accent: "#ebbcba",
    chips: [
      c("base", "#191724"), c("surface", "#1f1d2e"), c("overlay", "#26233a"),
      c("hl_high", "#524f67"), c("muted", "#6e6a86"), c("subtle", "#908caa"),
      c("text", "#e0def4"), c("love", "#eb6f92"), c("gold", "#f6c177"),
      c("rose", "#ebbcba"), c("pine", "#31748f"), c("foam", "#9ccfd8"),
      c("iris", "#c4a7e7"),
    ],
  },
  {
    id: "rose-pine-moon",
    family: "Rosé Pine",
    variant: "Moon",
    kind: "dark",
    bg: "#232136",
    fg: "#e0def4",
    muted: "#908caa",
    accent: "#ea9a97",
    chips: [
      c("base", "#232136"), c("surface", "#2a273f"), c("overlay", "#393552"),
      c("hl_high", "#56526e"), c("muted", "#6e6a86"), c("subtle", "#908caa"),
      c("text", "#e0def4"), c("love", "#eb6f92"), c("gold", "#f6c177"),
      c("rose", "#ea9a97"), c("pine", "#3e8fb0"), c("foam", "#9ccfd8"),
      c("iris", "#c4a7e7"),
    ],
  },
  {
    id: "rose-pine-dawn",
    family: "Rosé Pine",
    variant: "Dawn",
    kind: "light",
    bg: "#faf4ed",
    fg: "#575279",
    muted: "#797593",
    accent: "#d7827e",
    chips: [
      c("base", "#faf4ed"), c("surface", "#fffaf3"), c("overlay", "#f2e9e1"),
      c("hl_high", "#cecacd"), c("muted", "#9893a5"), c("subtle", "#797593"),
      c("text", "#575279"), c("love", "#b4637a"), c("gold", "#ea9d34"),
      c("rose", "#d7827e"), c("pine", "#286983"), c("foam", "#56949f"),
      c("iris", "#907aa9"),
    ],
  },
  {
    id: "everforest-dark",
    family: "Everforest",
    variant: "Dark",
    kind: "dark",
    bg: "#2d353b",
    fg: "#d3c6aa",
    muted: "#9da9a0",
    accent: "#a7c080",
    chips: [
      c("bg0", "#2d353b"), c("bg1", "#343f44"), c("bg3", "#475258"),
      c("grey1", "#859289"), c("fg", "#d3c6aa"), c("red", "#e67e80"),
      c("orange", "#e69875"), c("yellow", "#dbbc7f"), c("green", "#a7c080"),
      c("aqua", "#83c092"), c("blue", "#7fbbb3"), c("purple", "#d699b6"),
    ],
  },
  {
    id: "everforest-light",
    family: "Everforest",
    variant: "Light",
    kind: "light",
    bg: "#fdf6e3",
    fg: "#5c6a72",
    muted: "#829181",
    accent: "#8da101",
    chips: [
      c("bg0", "#fdf6e3"), c("bg1", "#f4f0d9"), c("bg3", "#e6e2cc"),
      c("grey1", "#939f91"), c("fg", "#5c6a72"), c("red", "#f85552"),
      c("orange", "#f57d26"), c("yellow", "#dfa000"), c("green", "#8da101"),
      c("aqua", "#35a77c"), c("blue", "#3a94c5"), c("purple", "#df69ba"),
    ],
  },
  {
    id: "one-dark",
    family: "One Dark",
    variant: "Atom",
    kind: "dark",
    bg: "#282c34",
    fg: "#abb2bf",
    muted: "#7f848e",
    accent: "#61afef",
    chips: [
      c("bg", "#282c34"), c("gutter", "#3e4451"), c("comment", "#5c6370"),
      c("fg", "#abb2bf"), c("red", "#e06c75"), c("orange", "#d19a66"),
      c("yellow", "#e5c07b"), c("green", "#98c379"), c("cyan", "#56b6c2"),
      c("blue", "#61afef"), c("magenta", "#c678dd"),
    ],
  },
  {
    id: "kanagawa",
    family: "Kanagawa",
    variant: "Wave",
    kind: "dark",
    bg: "#1f1f28",
    fg: "#dcd7ba",
    muted: "#c8c093",
    accent: "#7e9cd8",
    chips: [
      c("sumiInk3", "#1f1f28"), c("sumiInk4", "#2a2a37"), c("sumiInk6", "#54546d"),
      c("fujiGray", "#727169"), c("oldWhite", "#c8c093"), c("fujiWhite", "#dcd7ba"),
      c("waveBlue2", "#2d4f67"), c("crystalBlue", "#7e9cd8"), c("springBlue", "#7fb4ca"),
      c("waveAqua2", "#7aa89f"), c("springGreen", "#98bb6c"), c("carpYellow", "#e6c384"),
      c("boatYellow2", "#c0a36e"), c("surimiOrange", "#ffa066"), c("peachRed", "#ff5d62"),
      c("autumnRed", "#c34043"), c("sakuraPink", "#d27e99"), c("oniViolet", "#957fb8"),
    ],
  },
  {
    id: "monokai",
    family: "Monokai",
    variant: "Classic",
    kind: "dark",
    bg: "#272822",
    fg: "#f8f8f2",
    muted: "#a59f85",
    accent: "#a6e22e",
    chips: [
      c("bg", "#272822"), c("line", "#3e3d32"), c("comment", "#75715e"),
      c("fg", "#f8f8f2"), c("pink", "#f92672"), c("orange", "#fd971f"),
      c("yellow", "#e6db74"), c("green", "#a6e22e"), c("blue", "#66d9ef"),
      c("purple", "#ae81ff"),
    ],
  },
];

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Relative luminance (WCAG) for choosing ink on a chip. */
export function luminance(hex: string): number {
  const ch = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
