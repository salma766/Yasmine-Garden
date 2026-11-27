// Generates the language-neutral SVG illustrations used as placeholder images
// until real photos are uploaded from the admin. Run: node scripts/placeholders.mjs
import { writeFileSync } from "node:fs";

const out = new URL("../public/images/placeholders/", import.meta.url);
const W = 1200, H = 900;

const leaf = (x, y, s, r, c) =>
  `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 C 30 -60 90 -70 120 -60 C 110 -20 70 30 0 0 Z" fill="${c}"/><path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 C 40 -25 80 -45 118 -58" stroke="rgba(255,255,255,.35)" stroke-width="2.5" fill="none"/>`;

const hills = (c1, c2) =>
  `<path d="M0 ${H * 0.72} Q ${W * 0.25} ${H * 0.6} ${W * 0.5} ${H * 0.7} T ${W} ${H * 0.66} V ${H} H 0 Z" fill="${c1}"/><path d="M0 ${H * 0.82} Q ${W * 0.3} ${H * 0.74} ${W * 0.6} ${H * 0.84} T ${W} ${H * 0.8} V ${H} H 0 Z" fill="${c2}"/>`;

const sun = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;

const pot = (x, y, s, c) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0 H70 L52 120 H-52 Z" fill="${c}"/><rect x="-80" y="-18" width="160" height="26" rx="6" fill="${c}" opacity=".85"/></g>`;

const tree = (x, y, s, trunk, crown) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10 0 C -14 -80 -6 -120 -24 -170 M10 0 C 14 -90 6 -130 30 -175" stroke="${trunk}" stroke-width="22" stroke-linecap="round" fill="none"/><ellipse cx="0" cy="-230" rx="150" ry="95" fill="${crown}"/><ellipse cx="-80" cy="-200" rx="80" ry="55" fill="${crown}" opacity=".85"/><ellipse cx="85" cy="-205" rx="85" ry="60" fill="${crown}" opacity=".9"/></g>`;

const palm = (x, y, s, trunk, frond) => {
  let f = "";
  for (let i = 0; i < 8; i++) {
    const a = -170 + i * 22;
    f += `<path transform="rotate(${a})" d="M0 0 C 60 -30 130 -20 190 30 C 130 0 60 -5 0 0 Z" fill="${frond}"/>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C 10 -120 -10 -240 20 -360" stroke="${trunk}" stroke-width="26" stroke-linecap="round" fill="none"/><g transform="translate(20 -360)">${f}</g></g>`;
};

const cactus = (x, y, s, c) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><rect x="-30" y="-260" width="60" height="260" rx="30"/><path d="M-30 -120 H-80 a 25 25 0 0 1 -25 -25 V -200 a 22 22 0 0 1 44 0 V -165 H -30 Z"/><path d="M30 -150 H85 a 25 25 0 0 0 25 -25 V -230 a 22 22 0 0 0 -44 0 V -195 H 30 Z"/></g>`;

const flowers = (cx, cy, n, colors) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = cx + ((i * 137) % 520) - 260, y = cy + ((i * 71) % 120) - 60, c = colors[i % colors.length];
    s += `<line x1="${x}" y1="${y}" x2="${x + 6}" y2="${y + 90}" stroke="#2f6b43" stroke-width="5"/>`;
    for (let p = 0; p < 5; p++) s += `<ellipse cx="${x}" cy="${y - 16}" rx="10" ry="18" fill="${c}" transform="rotate(${p * 72} ${x} ${y})"/>`;
    s += `<circle cx="${x}" cy="${y}" r="8" fill="#f6d36b"/>`;
  }
  return s;
};

const citrus = (x, y) =>
  tree(x, y, 1.1, "#6b4e33", "#2f7a45") +
  [[-90, -250], [-20, -300], [60, -240], [110, -280], [-60, -190], [20, -210]].map(([dx, dy]) => `<circle cx="${x + dx * 1.1}" cy="${y + dy * 1.1}" r="20" fill="#f2b632"/>`).join("");

const wrap = (bg1, bg2, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>${body}</svg>`;

const leaves = (cx, cy, n, colors, spread = 1) => {
  let s = "";
  for (let i = 0; i < n; i++) s += leaf(cx, cy, (1.2 + (i % 3) * 0.35) * spread, -90 + (i * 360) / n, colors[i % colors.length]);
  return s;
};

const img = {
  hero: wrap("#2d6a4f", "#1b4332", sun(950, 200, 110, "#f4d58d") + hills("#40916c", "#2d6a4f") + palm(250, 720, 1.4, "#7c5c3c", "#52b788") + tree(800, 760, 1.3, "#6b4e33", "#74c69d") + palm(1050, 760, 1.1, "#7c5c3c", "#95d5b2") + flowers(600, 800, 14, ["#e76f51", "#f4a261", "#ffffff", "#e9c46a"])),
  leaf: wrap("#e3efe0", "#b7d3b0", leaves(600, 470, 9, ["#3f7d4e", "#4f9460", "#2a6249"], 1.6)),
  indoor: wrap("#f5efe4", "#e7dcc6", `<rect x="120" y="120" width="380" height="460" rx="12" fill="#ffffff" opacity=".6"/>` + pot(640, 640, 1.6, "#c4663f") + leaves(640, 610, 10, ["#2a6249", "#3f7d4e", "#4f9460"], 2.1) + pot(950, 700, 1, "#d9a066") + leaves(950, 680, 7, ["#52b788", "#40916c"], 1.3)),
  outdoor: wrap("#cfe8f3", "#a7d3b4", sun(200, 180, 80, "#ffe8a3") + hills("#74c69d", "#52b788") + tree(420, 740, 1.2, "#6b4e33", "#2d6a4f") + tree(860, 760, 0.95, "#6b4e33", "#40916c") + flowers(650, 800, 10, ["#ffffff", "#f28482", "#f6bd60"])),
  olive: wrap("#f3ead6", "#d8c9a3", sun(980, 190, 90, "#f7d488") + hills("#b5a86e", "#9c8f55") + `<g transform="translate(600 780) scale(1.6)"><path d="M-14 0 C -40 -60 10 -100 -20 -150 M10 0 C 30 -70 -5 -110 25 -160" stroke="#6e5a40" stroke-width="20" stroke-linecap="round" fill="none"/><ellipse cx="0" cy="-210" rx="160" ry="80" fill="#7d8f5a"/><ellipse cx="-90" cy="-180" rx="80" ry="50" fill="#8fa06a"/><ellipse cx="95" cy="-185" rx="85" ry="52" fill="#6f8150"/></g>`),
  palm: wrap("#ffd9a8", "#f4a261", sun(600, 300, 140, "#ffedd1") + hills("#e9c46a", "#d4a259") + palm(380, 800, 1.5, "#7c5c3c", "#2a9d8f") + palm(820, 820, 1.2, "#7c5c3c", "#264653")),
  flowers: wrap("#fdf0f3", "#f7d6de", hills("#95d5b2", "#74c69d") + flowers(600, 600, 22, ["#e5383b", "#ff8fab", "#ffffff", "#9d4edd", "#f4a261"])),
  cactus: wrap("#fbe7c6", "#f2c78f", sun(950, 200, 90, "#fff3d6") + hills("#e8b86d", "#d9a05b") + cactus(420, 760, 1.6, "#4f9460") + cactus(800, 780, 1.1, "#2a6249") + pot(1020, 760, 0.8, "#c4663f")),
  citrus: wrap("#eaf6e8", "#c7e3c0", hills("#95d5b2", "#74c69d") + citrus(600, 800)),
  design: wrap("#e7f0ea", "#cfe1d5", `<rect x="200" y="150" width="800" height="600" rx="16" fill="#ffffff"/><path d="M260 210 H940 V690 H260 Z" fill="none" stroke="#2a6249" stroke-width="4" stroke-dasharray="14 10"/><circle cx="420" cy="380" r="80" fill="#95d5b2"/><circle cx="760" cy="520" r="110" fill="#74c69d"/><rect x="520" y="260" width="200" height="120" rx="10" fill="#e9c46a" opacity=".7"/><path d="M300 640 C 450 560 600 700 900 600" stroke="#c4663f" stroke-width="10" fill="none"/>`),
  lawn: wrap("#d8f3dc", "#95d5b2", sun(980, 170, 80, "#fff1b8") + `<path d="M0 520 H1200 V900 H0 Z" fill="#52b788"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M0 ${560 + i * 30} H1200" stroke="${i % 2 ? "#40916c" : "#74c69d"}" stroke-width="18" opacity=".6"/>`).join("") + tree(200, 560, 0.7, "#6b4e33", "#2d6a4f")),
  irrigation: wrap("#dff3f6", "#a9dde6", hills("#74c69d", "#52b788") + Array.from({ length: 5 }, (_, i) => { const x = 220 + i * 190; return `<rect x="${x - 8}" y="640" width="16" height="70" fill="#5c677d"/>` + [-60, -30, 0, 30, 60].map((a) => `<path d="M${x} 640 q ${a} -120 ${a * 2.2} -40" stroke="#4cc9f0" stroke-width="4" fill="none" opacity=".8"/>`).join(""); }).join("")),
  maintenance: wrap("#eef5e6", "#cfe3b8", hills("#95d5b2", "#74c69d") + tree(330, 760, 1, "#6b4e33", "#2d6a4f") + `<g transform="translate(780 520) rotate(-30)"><rect x="-10" y="0" width="20" height="240" rx="8" fill="#7c5c3c"/><path d="M-60 -10 H60 L40 60 H-40 Z" fill="#5c677d"/></g>` + flowers(820, 790, 8, ["#f4a261", "#ffffff"])),
  terrace: wrap("#f7efe3", "#e5d3b8", `<rect x="0" y="560" width="1200" height="340" fill="#d6c2a1"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${i * 160} 560 L ${i * 160 - 120} 900" stroke="#c4ad87" stroke-width="4"/>`).join("") + pot(260, 560, 1.1, "#c4663f") + leaves(260, 540, 8, ["#2a6249", "#4f9460"], 1.5) + pot(940, 560, 1.1, "#b5838d") + palm(940, 540, 0.55, "#7c5c3c", "#40916c") + `<rect x="470" y="430" width="260" height="20" rx="6" fill="#7c5c3c"/><rect x="490" y="450" width="14" height="110" fill="#7c5c3c"/><rect x="696" y="450" width="14" height="110" fill="#7c5c3c"/>`),
  tree: wrap("#e3f2fd", "#bfe0c8", hills("#74c69d", "#40916c") + tree(600, 790, 1.7, "#6b4e33", "#2d6a4f")),
  garden1: wrap("#d4ecdd", "#a3cfb4", sun(1000, 160, 70, "#fff1c1") + hills("#74c69d", "#52b788") + `<path d="M600 900 C 560 760 680 680 620 560" stroke="#e9dcc3" stroke-width="70" fill="none"/>` + palm(330, 720, 1, "#7c5c3c", "#2d6a4f") + tree(900, 740, 1, "#6b4e33", "#40916c") + flowers(400, 820, 8, ["#ffffff", "#f28482"])),
  garden2: wrap("#fde8d7", "#f6c6a0", hills("#b7d3b0", "#95b88e") + `<rect x="350" y="520" width="500" height="140" rx="70" fill="#4cc9f0" opacity=".8"/>` + palm(250, 760, 1.2, "#7c5c3c", "#2a9d8f") + palm(960, 760, 1.2, "#7c5c3c", "#2a9d8f") + flowers(600, 800, 12, ["#e76f51", "#ffffff", "#f4a261"])),
  garden3: wrap("#e9f5db", "#c5e1a5", `<rect x="0" y="600" width="1200" height="300" fill="#8bc34a" opacity=".6"/>` + Array.from({ length: 6 }, (_, i) => tree(120 + i * 195, 700 + (i % 2) * 30, 0.6, "#6b4e33", i % 2 ? "#33691e" : "#558b2f")).join("")),
  garden4: wrap("#f1ede3", "#d9d0bb", `<rect x="0" y="620" width="1200" height="280" fill="#cbbd9f"/>` + cactus(250, 700, 1, "#4f9460") + `<g>${flowers(620, 760, 10, ["#9d4edd", "#ffffff", "#c77dff"])}</g>` + olivePlain(950, 720)),
  nursery: wrap("#e6f2e0", "#c3dcb9", `<path d="M100 600 L600 250 L1100 600 Z" fill="#ffffff" opacity=".55"/><path d="M100 600 L600 250 L1100 600" stroke="#9fb89a" stroke-width="8" fill="none"/>` + Array.from({ length: 7 }, (_, i) => pot(180 + i * 140, 720, 0.7, i % 2 ? "#c4663f" : "#d9a066") + leaves(180 + i * 140, 705, 6, ["#2a6249", "#4f9460", "#52b788"], 0.9)).join("")),
};

function olivePlain(x, y) {
  return `<g transform="translate(${x} ${y}) scale(.9)"><path d="M-10 0 C -30 -60 10 -100 -15 -150" stroke="#6e5a40" stroke-width="18" stroke-linecap="round" fill="none"/><ellipse cx="0" cy="-200" rx="140" ry="70" fill="#7d8f5a"/></g>`;
}

for (const [name, svg] of Object.entries(img)) writeFileSync(new URL(`${name}.svg`, out), svg);
console.log(Object.keys(img).length, "placeholders written");
