// Prueba de la rueda de sumas con un navegador de verdad: soluciones por nivel, teclear una solución, repetidos, suma mal, pista, solución y deshacer.
//   NODE_PATH=<playwright> node probar.js [url]
'use strict';
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2] || 'file:///' + __dirname.split(String.fromCharCode(92)).join('/') + '/index.html';
  const nav = await chromium.launch(), pag = await nav.newPage({ viewport: { width: 900, height: 1100 } }), errores = [];
  pag.on('pageerror', (e) => errores.push(e.message));
  await pag.goto(url); await pag.waitForTimeout(500);
  let fallos = 0; const mal = (t) => { fallos++; console.log('FALLO: ' + t); };
  const texto = (id) => pag.textContent(id);
  // 1) las soluciones de cada nivel (con giros y espejos: se cuentan las clases en el mensaje)
  const esperadas = [1, 2, 1, 5];
  for (let i = 0; i < 4; i++) {
    await pag.evaluate((n) => window.__juego.setLevel(n), i);
    const m = await texto('#msg'), n = await pag.evaluate(() => window.__juego.SOLS.length);
    console.log(`1) nivel ${i}: ${n} soluciones con giros · ${m.slice(0, 70)}`);
    if (!m.includes('<b>'.replace('<b>', '') + esperadas[i])) mal('nivel ' + i + ': el mensaje no dice ' + esperadas[i]);
  }
  // 2) teclear una solución del nivel 13 (el 1.er círculo, etc.) y ganar
  await pag.evaluate(() => window.__juego.setLevel(1));
  const sol = await pag.evaluate(() => window.__juego.SOLS[0]);
  for (let i = 0; i < sol.length; i++) { await pag.evaluate((j) => window.__juego.selecciona(j), i); for (const d of String(sol[i])) await pag.click(`#pad [data-d="${d}"]`); }
  await pag.waitForTimeout(200);
  const gano = await pag.evaluate(() => window.__juego.won);
  console.log('2) tecleada la solución', JSON.stringify(sol), '→ resuelto:', gano, '·', (await texto('#msg')).slice(0, 80));
  if (!gano) mal('no se detecta la victoria');
  await pag.screenshot({ path: path.join(__dirname, 'captura_gana.png') });
  // 3) suma incorrecta y repetidos (nivel 7: 1, 2, 3 suma 6; y 2, 2, 3)
  await pag.evaluate(() => window.__juego.setLevel(0));
  const poner = async (vs) => { for (let i = 0; i < vs.length; i++) { await pag.evaluate((j) => window.__juego.selecciona(j), i); for (const d of String(vs[i])) await pag.click(`#pad [data-d="${d}"]`); } };
  await poner([1, 2, 3]); let m3 = await texto('#msg'); console.log('3a) 1,2,3 →', m3.slice(0, 90));
  if (!m3.includes('suman')) mal('no avisa de que la suma no es 7');
  await pag.click('#bReset'); await poner([2, 2, 3]); m3 = await texto('#msg'); console.log('3b) 2,2,3 →', m3.slice(0, 90), '· repetidos:', await texto('#repV'));
  if (!m3.includes('más de una vez')) mal('no avisa de repetidos');
  // 4) pista y deshacer
  await pag.click('#bReset'); await pag.click('#bHint'); const v1 = await pag.evaluate(() => window.__juego.vals.slice());
  console.log('4a) una pista:', JSON.stringify(v1), (await texto('#msg')).slice(0, 70));
  if (v1.filter((x) => x).length !== 1) mal('la pista no rellena un círculo');
  await pag.click('#bUndo'); const v2 = await pag.evaluate(() => window.__juego.vals.slice());
  if (v2.some((x) => x)) mal('deshacer no vacía');
  // 5) pista hasta resolver el hexágono, y la solución animada
  await pag.evaluate(() => window.__juego.setLevel(3));
  for (let i = 0; i < 6; i++) await pag.click('#bHint');
  const g6 = await pag.evaluate(() => window.__juego.won); console.log('5a) 6 pistas en el hexágono → resuelto:', g6); if (!g6) mal('las pistas no resuelven');
  await pag.click('#bReset'); await pag.click('#bSol'); await pag.waitForTimeout(4600);
  const g7 = await pag.evaluate(() => window.__juego.won); console.log('5b) solución animada → resuelto:', g7, '·', (await texto('#msg')).slice(0, 90)); if (!g7) mal('la solución animada no termina');
  await pag.screenshot({ path: path.join(__dirname, 'captura_hexagono.png') });
  // 6) móvil
  await pag.setViewportSize({ width: 390, height: 844 }); await pag.evaluate(() => window.__juego.setLevel(2)); await pag.click('#bHint'); await pag.waitForTimeout(300);
  const ancho = await pag.evaluate(() => document.documentElement.scrollWidth); console.log('6) móvil: ancho de página', ancho); if (ancho > 392) mal('desborda en el móvil');
  await pag.screenshot({ path: path.join(__dirname, 'captura_movil.png'), fullPage: true });
  console.log(`errores de la página: ${errores.length ? errores.join(' | ') : 'ninguno'} · fallos: ${fallos}`);
  await nav.close();
})();
