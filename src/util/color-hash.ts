// Hash two integers (can be negative) to a "nice" RGBA color.
export function hashColor(i: number, j: number, as = "rgba") {
  // --- fast 32-bit SplitMix-style PRNG seeded from (i,j) ---
  function mix32(x: number) {
    x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
    x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
    return (x ^ (x >>> 16)) >>> 0;
  }
  let seed = mix32(Math.imul((i | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ (j | 0));
  function rand() {
    seed = (seed + 0x9e3779b9) >>> 0;            // golden ratio
    let x = seed;
    x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b);
    x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35);
    x ^= x >>> 16;
    // uniform in [0,1)
    return (x >>> 0) / 4294967296;
  }

  // --- "nice" HSL ranges (avoid grays & extremes) ---
  const h = Math.floor(rand() * 360);            // 0..359
  const s = 60 + rand() * 25;                    // 60–85%
  const l = 45 + rand() * 20;                    // 45–65%

  // HSL -> RGB (0..255)
  const [r, g, b] = hslToRgb(h, s, l);

  const a = 0.788;
  if (as === "rgba") return `rgba(${r}, ${g}, ${b}, ${a})`;
  if (as === "array") return [r, g, b, a];
  if (as === "rgb") return `rgb(${r}, ${g}, ${b})`;
  // hex without alpha (browser hex alpha is #RRGGBBAA if you want)
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  function hslToRgb(h: number, s: number, l: number) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let [r1, g1, b1] =
      hp < 1 ? [c, x, 0] :
        hp < 2 ? [x, c, 0] :
          hp < 3 ? [0, c, x] :
            hp < 4 ? [0, x, c] :
              hp < 5 ? [x, 0, c] :
                [c, 0, x];
    const m = l - c / 2;
    return [
      Math.round((r1 + m) * 255),
      Math.round((g1 + m) * 255),
      Math.round((b1 + m) * 255),
    ];
  }
  function toHex(n: number) { return n.toString(16).padStart(2, "0"); }
}

// --- examples ---
console.log(hashColor(12, 34));          // "rgba(…, …, …, 0.788)"
console.log(hashColor(12, 34, "hex"));   // "#RRGGBB"
console.log(hashColor(-7, 999, "array"));// [r,g,b,0.788]
