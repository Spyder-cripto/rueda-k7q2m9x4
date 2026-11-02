// Imagen de estado de WhatsApp (1080×1920): sin datos del enunciado, sin pistas, sin «gratis», con la pastilla del enlace.
//   NODE_PATH=<playwright> node estado.js
const { chromium } = require('playwright');
const COL = ['#ff4f6d', '#ff8a1f', '#e5b800', '#19c37d', '#2f7bff', '#a83ad0'];
const k = 6, R = 250, rc = 70;
let circ = '', arcs = '';
for (let i = 0; i < k; i++) {
  const a = -Math.PI / 2 + i * 2 * Math.PI / k, x = R * Math.cos(a), y = R * Math.sin(a);
  circ += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${rc}" fill="${COL[i]}" stroke="#2b2350" stroke-width="8"/><text y="4" font-size="84" font-weight="900" fill="#fff" stroke="#0004" stroke-width="5" paint-order="stroke" text-anchor="middle" dominant-baseline="central">?</text></g>`;
  const b = -Math.PI / 2 + (i + .5) * 2 * Math.PI / k, bx = (R + 128) * Math.cos(b), by = (R + 128) * Math.sin(b);
  arcs += `<g transform="translate(${bx.toFixed(1)} ${by.toFixed(1)})"><rect x="-52" y="-42" width="104" height="84" rx="26" fill="#fff5c9" stroke="#d8a900" stroke-width="6"/><text y="2" font-size="56" fill="#b9a96a" text-anchor="middle" dominant-baseline="central">+</text></g>`;
}
const html = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1080px;height:1920px;font-family:"Trebuchet MS",Verdana,sans-serif;color:#2b2350;
background:linear-gradient(160deg,#ffc9d9,#ffd9b0 16%,#fff1a8 32%,#c9f2a8 48%,#8fe3a3 64%,#b9ed9a 80%,#fff0b0);position:relative;overflow:hidden}
h1{position:absolute;top:150px;left:0;right:0;margin:0;text-align:center;font-size:132px;line-height:1.05;
background:linear-gradient(90deg,#ff4f9a,#ff9a1f,#e5b800,#19c37d,#0e9f6e,#b03fd0);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{position:absolute;top:440px;left:0;right:0;text-align:center;font-size:54px;font-weight:bold}
svg{position:absolute;left:0;top:520px;width:1080px;height:900px}
.card{position:absolute;left:90px;right:90px;top:500px;height:960px;border-radius:60px;background:#ffffffb3;box-shadow:0 20px 60px #5b3fa044}
.pill{position:absolute;left:150px;right:150px;bottom:150px;height:150px;border-radius:999px;background:#2b2350;color:#fff;display:flex;align-items:center;justify-content:center;font-size:58px;font-weight:bold;box-shadow:0 12px 0 #0003}
.q{position:absolute;top:1490px;left:0;right:0;text-align:center;font-size:56px;font-weight:bold}
</style>
<h1>La rueda<br>de sumas</h1>
<div class="sub">Un acertijo de círculos y números</div>
<div class="card"></div>
<svg viewBox="-540 -450 1080 900"><circle r="${R}" fill="none" stroke="#2b2350" stroke-width="10"/>${arcs}${circ}
<text y="-14" font-size="150" font-weight="900" fill="#2b2350" text-anchor="middle" dominant-baseline="central">?</text></svg>
<div class="q">¿Te atreves a completarla?</div>
<div class="pill">👇 Enlace para jugar 👇</div>`;
(async () => {
  const n = await chromium.launch(), p = await n.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html); await p.waitForTimeout(400);
  const f = 'C:/Users/usuario/Contacts/Downloads/CLAUDE/estado_whatsapp_la_rueda_de_sumas.png';
  await p.screenshot({ path: f });
  await n.close(); console.log(f);
})();
