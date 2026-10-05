import { hexToRgb } from "./schemes";

export type Mode = "smooth" | "strict";

export interface RenderParams {
  palette: string[];
  mode: Mode;
  /** 0..1, mix between the original photo and the remapped one. */
  strength: number;
  /** Ordered dithering between the two nearest chips (strict only). */
  dither: boolean;
}

const MAX_PALETTE = 32;

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uImg;
uniform vec3 uPal[${MAX_PALETTE}];
uniform int uN;
uniform int uMode;
uniform float uStrength;
uniform bool uDither;
uniform vec2 uLRange;

vec3 toLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
vec3 linearToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(l, 1.0 / 3.0); m = pow(m, 1.0 / 3.0); s = pow(s, 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLinear(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
     4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076522010 * s);
}

// Lightness counts slightly more than hue when matching photo tones.
float dist2(vec3 a, vec3 b) {
  vec3 d = a - b;
  return d.x * d.x * 1.4 + d.y * d.y + d.z * d.z;
}

float bayer8(vec2 p) {
  ivec2 q = ivec2(mod(p, 8.0));
  int x = q.x, y = q.y;
  int v = 0;
  int xy = x ^ y;
  v |= ((xy & 1) << 5) | ((x & 1) << 4);
  v |= ((xy & 2) << 2) | ((x & 2) << 1);
  v |= ((xy & 4) >> 1) | ((x & 4) >> 2);
  return (float(v) + 0.5) / 64.0;
}

void main() {
  vec4 src = texture(uImg, vUv);
  vec3 lab = linearToOklab(toLinear(src.rgb));
  vec3 mapped;

  if (uMode == 1) {
    // Strict: snap to the nearest chip, optionally dithering toward the runner-up.
    float d1 = 1e9, d2 = 1e9;
    vec3 p1 = uPal[0], p2 = uPal[0];
    for (int i = 0; i < ${MAX_PALETTE}; i++) {
      if (i >= uN) break;
      float d = dist2(lab, uPal[i]);
      if (d < d1) { d2 = d1; p2 = p1; d1 = d; p1 = uPal[i]; }
      else if (d < d2) { d2 = d; p2 = uPal[i]; }
    }
    mapped = p1;
    if (uDither && uN > 1) {
      vec3 axis = p2 - p1;
      float f = clamp(dot(lab - p1, axis) / max(dot(axis, axis), 1e-6), 0.0, 1.0);
      if (f > bayer8(gl_FragCoord.xy)) mapped = p2;
    }
  } else {
    // Smooth: stretch photo tones into the palette's lightness range, then blend
    // nearby chips with Gaussian weights. Half the photo's own lightness rides
    // through so texture and detail survive.
    float L = mix(uLRange.x, uLRange.y, clamp(lab.x, 0.0, 1.0));
    // Exaggerate the photo's chroma while matching so coloured regions reach
    // the accent chips instead of collapsing onto the scheme's neutrals.
    vec3 q = vec3(L, lab.yz * 1.7);
    float dmin = 1e9;
    for (int i = 0; i < ${MAX_PALETTE}; i++) {
      if (i >= uN) break;
      dmin = min(dmin, dist2(q, uPal[i]));
    }
    const float sigma2 = 2.0 * 0.06 * 0.06;
    vec3 acc = vec3(0.0);
    float wsum = 0.0;
    for (int i = 0; i < ${MAX_PALETTE}; i++) {
      if (i >= uN) break;
      float w = exp(-(dist2(q, uPal[i]) - dmin) / sigma2);
      acc += uPal[i] * w;
      wsum += w;
    }
    vec3 m = acc / wsum;
    mapped = vec3(mix(m.x, L, 0.45), m.yz);
  }

  vec3 outLab = mix(lab, mapped, uStrength);
  outColor = vec4(toSrgb(oklabToLinear(outLab)), src.a);
}`;

function srgbHexToOklab(hex: string): [number, number, number] {
  const lin = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const [r, g, b] = lin;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export class Recolorer {
  readonly canvas: HTMLCanvasElement;
  readonly maxSize: number;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private tex: WebGLTexture;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private hasImage = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true, premultipliedAlpha: false });
    if (!gl) throw new Error("WebGL2 is not available in this browser.");
    this.gl = gl;
    this.maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    this.program = this.link();
    gl.useProgram(this.program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(this.program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    for (const n of ["uImg", "uPal", "uN", "uMode", "uStrength", "uDither", "uLRange"]) {
      this.loc[n] = gl.getUniformLocation(this.program, n);
    }
    this.tex = gl.createTexture()!;
  }

  private link(): WebGLProgram {
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link error");
    return p;
  }

  /** Uploads the source image. Returns the size the canvas renders at. */
  setImage(source: TexImageSource & { width: number; height: number }): { width: number; height: number } {
    const gl = this.gl;
    let { width, height } = source;
    const scale = Math.min(1, this.maxSize / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);

    let upload: TexImageSource = source;
    if (scale < 1) {
      const tmp = document.createElement("canvas");
      tmp.width = width;
      tmp.height = height;
      tmp.getContext("2d")!.drawImage(source as CanvasImageSource, 0, 0, width, height);
      upload = tmp;
    }

    this.canvas.width = width;
    this.canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, upload);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.hasImage = true;
    return { width, height };
  }

  render(p: RenderParams): void {
    if (!this.hasImage) return;
    const gl = this.gl;
    const labs = p.palette.slice(0, MAX_PALETTE).map(srgbHexToOklab);
    const flat = new Float32Array(MAX_PALETTE * 3);
    labs.forEach((v, i) => flat.set(v, i * 3));
    const Ls = labs.map((v) => v[0]);

    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform1i(this.loc.uImg, 0);
    gl.uniform3fv(this.loc.uPal, flat);
    gl.uniform1i(this.loc.uN, labs.length);
    gl.uniform1i(this.loc.uMode, p.mode === "strict" ? 1 : 0);
    gl.uniform1f(this.loc.uStrength, p.strength);
    gl.uniform1i(this.loc.uDither, p.dither ? 1 : 0);
    gl.uniform2f(this.loc.uLRange, Math.min(...Ls), Math.max(...Ls));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  toBlob(): Promise<Blob> {
    return new Promise((resolve, reject) =>
      this.canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode PNG."))), "image/png"),
    );
  }
}
