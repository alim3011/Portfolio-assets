// crthome.jsx — "hacking interface" homepage: modernised CRT, layered glow,
// phosphor colour, and a pixelated 3D wireframe that drifts behind the type.
// Keeps the Hybrid core: campaign names + still previewing behind a scrim.
// Exports window.HackHome.

(function () {
  if (document.getElementById('hk-styles')) return;
  const css = `
  .hk{position:relative;width:100%;height:100%;overflow:hidden;background:var(--bg);color:var(--fg);
    --ph:#5cff8f;--bg:#04110b;--scrim:#04110b;--glowpx:9px;--headline:'Newsreader';
    --fg:color-mix(in srgb,var(--ph) 82%,#ffffff 18%);
    --muted:color-mix(in srgb,var(--ph) 48%,transparent);
    --rule:color-mix(in srgb,var(--ph) 24%,transparent);
    font-family:var(--font,'JetBrains Mono',monospace);font-variant-ligatures:none;}
  .hk[data-treatment=console]{--bg:#0a0c0a;--scrim:#0a0c0a;}

  .hk .bg{position:absolute;inset:0;z-index:0;}
  .hk .bg img.s{position:absolute;top:-4%;height:108%;right:-3%;left:auto;width:64%;object-fit:cover;object-position:center;
    filter:blur(26px) saturate(.92) brightness(.9);opacity:0;transition:opacity .6s ease;transform:scale(1.04);}
  .hk .bg img.s.on{opacity:1;}
  .hk .scrim{position:absolute;inset:0;z-index:1;pointer-events:none;background:
    linear-gradient(90deg,var(--scrim) 0%,var(--scrim) 30%,color-mix(in srgb,var(--scrim) 72%,transparent) 50%,color-mix(in srgb,var(--scrim) 42%,transparent) 76%,color-mix(in srgb,var(--scrim) 30%,transparent) 100%),
    linear-gradient(0deg,var(--scrim) 0%,transparent 24%),
    linear-gradient(180deg,color-mix(in srgb,var(--scrim) 48%,transparent) 0%,transparent 20%);}

  .hk .gfx{position:absolute;inset:0;z-index:2;pointer-events:none;mix-blend-mode:screen;opacity:.92;}
  .hk .gfx canvas{width:100%;height:100%;image-rendering:pixelated;}
  .hk .gfx.field canvas{filter:drop-shadow(0 0 2px var(--ph));}

  .hk .screen{position:relative;z-index:3;height:100%;display:flex;flex-direction:column;padding:48px 62px 44px;box-sizing:border-box;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--rule) transparent;}
  .hk .screen::-webkit-scrollbar{width:7px;}
  .hk .screen::-webkit-scrollbar-thumb{background:var(--rule);border-radius:4px;}
  .hk .scan{position:absolute;inset:0;z-index:4;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.5) 0 1px,transparent 1px 3px);}
  .hk .crt{position:absolute;inset:0;z-index:5;pointer-events:none;
    background:radial-gradient(120% 120% at 50% 48%,transparent 55%,rgba(0,0,0,.5) 100%);
    box-shadow:inset 0 0 130px rgba(0,0,0,.45);}
  .hk[data-treatment=console] .crt{display:none;}

  .hk .hd{display:flex;flex-direction:column;gap:7px;}
  .hk .hd .top{display:flex;justify-content:space-between;align-items:center;font-size:11.5px;letter-spacing:.14em;color:var(--muted);text-transform:uppercase;}
  .hk .hd .top .id{color:var(--fg);}
  .hk .hd .top .id b{color:var(--ph);font-weight:inherit;}
  .hk .hd .top .nav{display:flex;gap:7px;align-items:center;}
  .hk .navlink{appearance:none;background:none;border:none;color:var(--muted);font:inherit;font-size:11.5px;
    letter-spacing:.14em;text-transform:uppercase;cursor:pointer;padding:0;text-decoration:none;transition:color .2s,text-shadow .2s;}
  .hk .navlink:hover{color:var(--ph);text-shadow:0 0 8px var(--ph);}
  .hk .hd .sub{font-size:10.5px;letter-spacing:.34em;color:var(--muted);text-transform:uppercase;}
  .hk .bk{display:inline-block;color:var(--ph);margin-left:3px;animation:hkblink 1.1s steps(1) infinite;}

  .hk .idx{flex:1 0 auto;display:flex;flex-direction:column;justify-content:safe center;gap:1px;margin-top:clamp(28px,6vh,76px);}
  .hk .r{display:flex;align-items:baseline;gap:16px;padding:11px 0;border-bottom:1px solid var(--rule);cursor:pointer;white-space:nowrap;}
  .hk .r .mk{color:var(--ph);opacity:0;width:14px;flex:0 0 14px;font-size:14px;}
  .hk .r .n{color:var(--ph);font-size:11px;opacity:.55;width:30px;flex:0 0 30px;font-variant-numeric:tabular-nums;letter-spacing:.1em;}
  .hk .r .t{font-size:27px;letter-spacing:0;transition:transform .28s cubic-bezier(.2,.7,.3,1);}
  .hk .r .cur{margin-left:auto;color:var(--ph);opacity:0;font-size:18px;}
  .hk .r .sub{margin-left:auto;font-size:10.5px;letter-spacing:.18em;color:var(--muted);text-transform:uppercase;
    opacity:0;transform:translateX(-6px);transition:opacity .28s,transform .28s;padding-right:18px;}
  .hk .r.on .sub,.hk .r:hover .sub{opacity:.9;transform:translateX(0);}
  .hk .r .sub + .cur{margin-left:0;}
  .hk .r .tag{margin-left:auto;font-size:9.5px;letter-spacing:.24em;color:var(--muted);text-transform:uppercase;
    border:1px solid var(--rule);padding:3px 8px;border-radius:2px;}
  .hk .r.soon{cursor:default;opacity:.4;}
  .hk .r.soon .n{opacity:.4;}
  .hk .r.soon .t{font-style:italic;}
  .hk .r.soon:hover .t{transform:none;}
  .hk .r.on .t,.hk .r:hover .t{transform:translateX(14px);}
  .hk .r.on .mk,.hk .r:hover .mk{opacity:1;}
  .hk .r.on .cur,.hk .r:hover .cur{opacity:.85;animation:hkblink 1.1s steps(1) infinite;}
  .hk .idx:hover .r:not(:hover) .t{opacity:.32;}

  /* elegant serif headline */
  .hk .t-serif{font-family:var(--headline),'Newsreader',serif;font-weight:400;font-style:italic;padding-right:.3em;}
  .hk .r.on .t-serif,.hk .r:hover .t-serif{color:var(--ph);}

  /* the digi filter: scanlines cut into the serif glyphs + phosphor bloom */
  .hk[data-digi=on] .t-serif{color:transparent;-webkit-text-fill-color:transparent;
    background-image:repeating-linear-gradient(0deg,var(--ph) 0 1.3px,color-mix(in srgb,var(--ph) 26%,transparent) 1.3px 3px);
    -webkit-background-clip:text;background-clip:text;
    filter:drop-shadow(0 0 var(--glowpx) color-mix(in srgb,var(--ph) 52%,transparent));}
  .hk[data-digi=on] .r.on .t-serif,.hk[data-digi=on] .r:hover .t-serif{
    background-image:repeating-linear-gradient(0deg,var(--ph) 0 2px,color-mix(in srgb,var(--ph) 50%,transparent) 2px 3px);
    filter:drop-shadow(0 0 calc(var(--glowpx) * 1.7) var(--ph));}

  .hk .ft{display:flex;justify-content:center;align-items:center;color:var(--muted);margin-top:clamp(22px,4vh,52px);flex:0 0 auto;}
  .hk .ft .jolly{display:inline-flex;color:color-mix(in srgb,var(--ph) 60%,transparent);
    filter:drop-shadow(0 0 6px color-mix(in srgb,var(--ph) 38%,transparent));transition:color .3s,filter .3s;}
  .hk:hover .ft .jolly{color:var(--ph);filter:drop-shadow(0 0 10px color-mix(in srgb,var(--ph) 60%,transparent));}
  .hk .eyebrow{font-size:10.5px;letter-spacing:.34em;color:var(--muted);text-transform:uppercase;margin-bottom:14px;}

  /* mobile / small screens */
  @media (max-width: 640px){
    .hk .screen{padding:24px 20px 30px;}
    .hk .bg img.s{width:78%;left:auto;right:-3%;}
    .hk .hd .top{font-size:10px;letter-spacing:.1em;gap:10px;}
    .hk .hd .top .nav{gap:6px;}
    .hk .navlink{font-size:10px;letter-spacing:.1em;}
    .hk .idx{margin-top:30px;gap:0;}
    .hk .r{gap:11px;padding:14px 0;white-space:normal;}
    .hk .r .n{font-size:10px;width:20px;flex-basis:20px;}
    .hk .r .t{font-size:21px;line-height:1.08;transition:none;white-space:normal;overflow-wrap:break-word;min-width:0;}
    .hk .r.on .t,.hk .r:hover .t{transform:none;}      /* no hover-shift on touch */
    .hk .r .mk{display:none;}
    .hk .r .sub{display:none;}                          /* subtitle is hover-only; hide on touch */
    .hk .r .cur{display:none;}
    .hk .r .tag{font-size:8.5px;padding:2px 6px;}
    .hk .ft{margin-top:34px;}
  }

  /* glow tiers (non-digi text + drop-shadow var for digi) */
  .hk[data-glow=off]{--glowpx:0px;}
  .hk[data-glow=soft]{--glowpx:5px;}
  .hk[data-glow=strong]{--glowpx:9px;}
  .hk[data-glow=max]{--glowpx:18px;}
  .hk[data-glow=off] .t,.hk[data-glow=off] .id b{text-shadow:none;}
  .hk[data-digi=off][data-glow=soft] .r.on .t,.hk[data-digi=off][data-glow=soft] .r:hover .t{text-shadow:0 0 6px color-mix(in srgb,var(--ph) 45%,transparent);}
  .hk[data-digi=off][data-glow=strong] .r.on .t,.hk[data-digi=off][data-glow=strong] .r:hover .t{text-shadow:0 0 10px color-mix(in srgb,var(--ph) 55%,transparent),0 0 2px color-mix(in srgb,var(--ph) 80%,transparent);}
  .hk[data-digi=off][data-glow=max] .r.on .t,.hk[data-digi=off][data-glow=max] .r:hover .t{text-shadow:0 0 18px color-mix(in srgb,var(--ph) 72%,transparent),0 0 38px color-mix(in srgb,var(--ph) 42%,transparent);}
  .hk[data-glow=max] .screen{animation:hkflicker 5.5s infinite;}
  .hk[data-glow=strong] .id b,.hk[data-glow=max] .id b{text-shadow:0 0 10px color-mix(in srgb,var(--ph) 55%,transparent);}

  /* section-entry exit transitions */
  @media (prefers-reduced-motion: no-preference){
    .hk.exit-poweron .screen,.hk.exit-poweron .gfx,.hk.exit-poweron .bg{animation:hkOff .43s ease-in forwards;}
    @keyframes hkOff{55%{transform:scaleY(.5);filter:brightness(1.5);}100%{transform:scaleY(.004);filter:brightness(2.8);opacity:.55;}}
    .hk.exit-expand .idx{transform-origin:left center;animation:hkExpOut .43s ease-in forwards;}
    @keyframes hkExpOut{100%{transform:scale(1.5);opacity:0;filter:blur(6px);}}
    .hk.exit-expand .hd,.hk.exit-expand .ft{animation:hkFadeOut .26s forwards;}
    .hk.exit-decrypt .idx{animation:hkFadeOut .2s forwards;}
    @keyframes hkFadeOut{100%{opacity:0;}}
  }

  @keyframes hkblink{50%{opacity:0;}}
  @keyframes hkflicker{0%,100%{opacity:1}3%{opacity:.9}6%{opacity:1}49%{opacity:.97}51%{opacity:1}}
  `;
  const s = document.createElement('style');
  s.id = 'hk-styles';
  s.textContent = css;
  document.head.appendChild(s);
})();

const HK_WORK = [
  { t: 'Believe in Chicken', sub: '' },
  { t: 'Building a Cult', sub: '' },
  { t: 'Believe in Chicken 2', sub: '' },
  { t: 'Seeing Double', sub: '' },
  { t: 'Lost and Found', sub: '' },
  { t: 'Ramadan', sub: '' },
  { t: 'Reserved', sub: '' },
  { t: 'I Feel Nothing', sub: '' },
  { t: 'Sterling Sells', sub: '' },
  { t: 'Guappp', sub: '' },
  { t: 'Coming Soon', sub: '', soon: true },
  { t: 'Coming Soon', sub: '', soon: true },
  { t: 'Coming Soon', sub: '', soon: true },
];
const HK_PREVIEWS = [
  'assets/bic/field.webp',
  'assets/cult/spices.webp',
  'https://img.youtube.com/vi/SVHHQKmzYOc/hqdefault.jpg',
  'https://img.youtube.com/vi/CdUcZg3pvFA/hqdefault.jpg',
  'assets/lost/glove-case.webp',
  'assets/ramadan/wall.webp',
  'assets/reserve/airport.webp',
  'assets/nothing/couple.webp',
  'https://vumbnail.com/845019288.jpg',
  'assets/guap/team.png',
  '', '', '',
];

/* ---------- pixelated 3D wireframe engine ---------- */
function hkBuildShape(shape) {
  const lines = [], TAU = Math.PI * 2;
  if (shape === 'globe') {
    const lat = 6, lon = 10, seg = 30;
    for (let i = 1; i < lat; i++) { const phi = -Math.PI / 2 + Math.PI * i / lat, y = Math.sin(phi), r = Math.cos(phi), pts = []; for (let j = 0; j <= seg; j++) { const th = TAU * j / seg; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); } lines.push({ pts }); }
    for (let i = 0; i < lon; i++) { const th = TAU * i / lon, pts = []; for (let j = 0; j <= seg; j++) { const phi = -Math.PI / 2 + Math.PI * j / seg, y = Math.sin(phi), r = Math.cos(phi); pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); } lines.push({ pts }); }
  } else if (shape === 'cube') {
    const v = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
    const e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    e.forEach(([a, b]) => lines.push({ pts: [v[a], v[b]] }));
    const v2 = v.map(p => p.map(c => c * 0.45)); e.forEach(([a, b]) => lines.push({ pts: [v2[a], v2[b]] }));
  } else if (shape === 'torus') {
    const R = 0.92, rr = 0.4, maj = 16, min = 11;
    for (let i = 0; i < maj; i++) { const u = TAU * i / maj, pts = []; for (let j = 0; j <= min; j++) { const vv = TAU * j / min; pts.push([(R + rr * Math.cos(vv)) * Math.cos(u), rr * Math.sin(vv), (R + rr * Math.cos(vv)) * Math.sin(u)]); } lines.push({ pts }); }
    for (let j = 0; j < min; j++) { const vv = TAU * j / min, pts = []; for (let i = 0; i <= maj; i++) { const u = TAU * i / maj; pts.push([(R + rr * Math.cos(vv)) * Math.cos(u), rr * Math.sin(vv), (R + rr * Math.cos(vv)) * Math.sin(u)]); } lines.push({ pts }); }
  } else if (shape === 'tunnel') {
    for (let i = 0; i < 13; i++) { const r = 0.25 + i * 0.13, z = -1 + i * 0.16, pts = []; for (let j = 0; j <= 4; j++) { const th = TAU * j / 4 + Math.PI / 4; pts.push([Math.cos(th) * r, Math.sin(th) * r, z]); } lines.push({ pts }); }
  }
  return lines;
}

function hkHexRgb(hex){ hex = (hex || '#ffffff').replace('#',''); if (hex.length===3) hex = hex.split('').map(c=>c+c).join(''); const n = parseInt(hex,16); return [(n>>16)&255,(n>>8)&255,n&255]; }

function CRTGraphic({ shape, color, glow, mouse }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv || shape === 'none') return;
    const ctx = cv.getContext('2d');
    const isField = shape === 'field';
    const PX = isField ? 5 : 4;
    const lines = isField ? null : hkBuildShape(shape);
    const t0 = performance.now();
    const glowPx = { off: 0, soft: 2, strong: 4, max: 8 }[glow] ?? 4;
    const parent = cv.parentElement;
    let rect = parent.getBoundingClientRect();
    const resize = () => { rect = parent.getBoundingClientRect(); cv.width = Math.max(60, Math.round(rect.width / PX)); cv.height = Math.max(40, Math.round(rect.height / PX)); };
    resize(); const ro = new ResizeObserver(resize); ro.observe(parent);
    const ms = { x: -9999, y: -9999 };
    const onMove = (e) => { ms.x = e.clientX; ms.y = e.clientY; };
    if (isField && mouse) window.addEventListener('pointermove', onMove);
    const [pr, pg, pb] = hkHexRgb(color);
    let raf;
    const frame = (now) => {
      const t = now - t0, w = cv.width, h = cv.height;
      if (isField) {
        const img = ctx.createImageData(w, h); const d = img.data;
        const mx = (ms.x - rect.left) / PX, my = (ms.y - rect.top) / PX;
        const useM = mouse && ms.x > -9000;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const u = x * 0.135 + Math.sin(y * 0.10 + t * 0.0007) * 1.3;
            const v = y * 0.135 + Math.cos(x * 0.09 - t * 0.0006) * 1.3;
            let n = (Math.sin(u + t * 0.0012) + Math.sin(v * 1.4 - t * 0.0014) + Math.sin((u + v) * 0.7 + t * 0.0009)) / 3;
            let inten = 0.5 + 0.5 * n;
            if (useM) { const dx = x - mx, dy = y - my, dd = Math.sqrt(dx * dx + dy * dy); inten += Math.sin(dd * 0.3 - t * 0.005) * Math.exp(-dd * 0.02) * 0.85; }
            let a = inten > 0.66 ? (inten - 0.66) / 0.34 : 0; if (a > 1) a = 1;
            const idx = (y * w + x) * 4; d[idx] = pr; d[idx + 1] = pg; d[idx + 2] = pb; d[idx + 3] = a * 175;
          }
        }
        ctx.putImageData(img, 0, 0);
      } else {
        const ay = t * 0.00038, ax = t * 0.00024;
        const cX = Math.cos(ax), sX = Math.sin(ax), cY = Math.cos(ay), sY = Math.sin(ay);
        const cx = w * 0.5 + Math.sin(t * 0.00017) * w * 0.22, cy = h * 0.5 + Math.cos(t * 0.00012) * h * 0.18;
        const scale = Math.min(w, h) * 0.34, f = 3.4;
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.shadowColor = color; ctx.shadowBlur = glowPx;
        for (const L of lines) {
          ctx.beginPath();
          for (let k = 0; k < L.pts.length; k++) {
            let [x, y, z] = L.pts[k];
            const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
            const y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
            const p = f / (f + z2), sx = cx + x1 * p * scale, sy = cy + y1 * p * scale;
            k === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('pointermove', onMove); };
  }, [shape, color, glow, mouse]);
  if (shape === 'none') return null;
  return <div className={'gfx' + (shape === 'field' ? ' field' : '')}><canvas ref={ref} /></div>;
}

/* ---------- hacker text decode ---------- */
const HK_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#@%';
function Scramble({ text, active, on }) {
  const [disp, setDisp] = React.useState(text);
  React.useEffect(() => {
    if (!on || !active) { setDisp(text); return; }
    const start = performance.now(), dur = 420; let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur), reveal = Math.floor(p * text.length);
      let s = ''; for (let k = 0; k < text.length; k++) s += (k < reveal || text[k] === ' ') ? text[k] : HK_CHARS[(Math.random() * HK_CHARS.length) | 0];
      setDisp(s); if (p < 1) raf = requestAnimationFrame(tick); else setDisp(text);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [active, on, text]);
  return <span>{disp}</span>;
}

/* Interactive face-warp easter egg — drag to liquify, double-click to reset */
function FaceWarp({ src }) {
  const canvasRef = React.useRef(null);
  const state = React.useRef({ orig: null, buf: null, w: 0, h: 0, down: false, last: null });
  React.useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const img = new Image();
    img.onload = () => {
      const W = 540, H = Math.round(W * img.height / img.width);
      cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, W, H);
      const im = ctx.getImageData(0, 0, W, H);
      state.current.orig = new Uint8ClampedArray(im.data);
      state.current.buf = im;
      state.current.w = W; state.current.h = H;
    };
    img.src = src;
  }, [src]);

  const paint = () => {
    const cv = canvasRef.current; const s = state.current; if (!cv || !s.buf) return;
    cv.getContext('2d').putImageData(s.buf, 0, 0);
  };
  const toCanvas = (e) => {
    const cv = canvasRef.current; const r = cv.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * cv.width, y: (e.clientY - r.top) / r.height * cv.height };
  };
  // smudge: push pixels along drag vector within a soft radius
  const smudge = (cx, cy, dx, dy) => {
    const s = state.current; if (!s.buf) return;
    const { w, h } = s; const R = 46; const src = new Uint8ClampedArray(s.buf.data); const dst = s.buf.data;
    const x0 = Math.max(0, Math.floor(cx - R)), x1 = Math.min(w - 1, Math.ceil(cx + R));
    const y0 = Math.max(0, Math.floor(cy - R)), y1 = Math.min(h - 1, Math.ceil(cy + R));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const d = Math.hypot(x - cx, y - cy); if (d > R) continue;
        const f = (1 - d / R); const fall = f * f;
        let sx = x - dx * fall, sy = y - dy * fall;
        sx = Math.max(0, Math.min(w - 1, sx)); sy = Math.max(0, Math.min(h - 1, sy));
        const si = (Math.round(sy) * w + Math.round(sx)) * 4;
        const di = (y * w + x) * 4;
        dst[di] = src[si]; dst[di+1] = src[si+1]; dst[di+2] = src[si+2]; dst[di+3] = src[si+3];
      }
    }
    paint();
  };
  const onDown = (e) => { state.current.down = true; state.current.last = toCanvas(e); e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => {
    const s = state.current; if (!s.down) return;
    const p = toCanvas(e); const dx = p.x - s.last.x, dy = p.y - s.last.y;
    if (Math.hypot(dx, dy) > 0.5) { smudge(p.x, p.y, dx, dy); s.last = p; }
  };
  const onUp = (e) => { state.current.down = false; };
  const reset = () => { const s = state.current; if (!s.orig) return; s.buf.data.set(s.orig); paint(); };

  return (
    <div className="about-photo warp">
      <canvas ref={canvasRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
        onPointerLeave={onUp} onDoubleClick={reset} />
      <span className="warp-hint">drag to warp · double-click to reset</span>
    </div>
  );
}

/* About — same dark phosphor grade as the campaign pages */
function AboutPage({ color, typeface, glow, headline, digi, entry, onBack }) {
  return (
    <div className={'cmp about in-' + (entry || 'decrypt')} data-glow={glow} data-digi={digi ? 'on' : 'off'}
      style={{ '--ph': color, '--font': typeface + ',monospace', '--headline': headline }}>
      <div className="scroll">
        <div className="top">
          <button className="lnk back" onClick={onBack} aria-label="Back to index">←</button>
          <span>About</span>
        </div>
        <div className="about-grid">
          <FaceWarp src="assets/about/ali.webp" />
          <div className="about-body">
            <h1 className="title serif">Hello future&nbsp;employer.</h1>
            <p className="about-blurb">
              I currently work at <b>Mother London</b> and have done since 2022.
              I have also worked at <b>Mother LA</b>, <b>The Corner London</b> and
              <b> Isobel</b> at other times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Contact — one email, centered, imposing, surrounded by void */
function ContactPage({ color, typeface, glow, headline, digi, onBack }) {
  return (
    <div className={'cmp contact'} data-glow={glow} data-digi={digi ? 'on' : 'off'}
      style={{ '--ph': color, '--font': typeface + ',monospace', '--headline': headline }}>
      <div className="contact-top">
        <button className="lnk back" onClick={onBack} aria-label="Back to index">←</button>
        <span>Contact</span>
      </div>
      <div className="contact-stage">
        <a className="contact-email serif" href="mailto:alimilne14@gmail.com">alimilne14@gmail.com</a>
      </div>
    </div>
  );
}

function HackHome({ treatment = 'crt', typeface = "'JetBrains Mono'", color = '#5cff8f', glow = 'strong', graphic = 'globe', scanlines = true, decode = true, mouse = true, headline = "'Newsreader'", digi = true, entry = 'decrypt' }) {
  const [active, setActive] = React.useState(null);
  const [open, setOpen] = React.useState(null);
  const [about, setAbout] = React.useState(false);
  const [contact, setContact] = React.useState(false);
  const [exiting, setExiting] = React.useState(false);

  const openCampaign = (i) => {
    if (HK_WORK[i].soon) return;
    if (entry === 'decrypt') { setOpen(i); return; }
    setExiting(true);
    setTimeout(() => { setOpen(i); setExiting(false); }, 440);
  };

  const nextOpenable = (from, dir) => {
    let i = from;
    for (let k = 0; k < HK_WORK.length; k++) {
      i = (i + dir + HK_WORK.length) % HK_WORK.length;
      if (!HK_WORK[i].soon) return i;
    }
    return from;
  };

  if (about) {
    return <AboutPage color={color} typeface={typeface} glow={glow} headline={headline} digi={digi} entry={entry}
      scanlines={scanlines} treatment={treatment} onBack={() => setAbout(false)} />;
  }
  if (contact) {
    return <ContactPage color={color} typeface={typeface} glow={glow} headline={headline} digi={digi}
      onBack={() => setContact(false)} />;
  }

  if (open !== null && window.CampaignPage) {
    return <window.CampaignPage
      key={open}
      index={open} total={HK_WORK.length} title={HK_WORK[open].t} subtitle={HK_WORK[open].sub}
      nextTitle={HK_WORK[nextOpenable(open, 1)].t}
      color={color} typeface={typeface} glow={glow} headline={headline} digi={digi} entry={entry}
      onBack={() => setOpen(null)}
      onNav={(d) => setOpen(nextOpenable(open, d))} />;
  }

  return (
    <div className={'hk' + (exiting ? ' exit-' + entry : '')} data-treatment={treatment} data-glow={glow} data-digi={digi ? 'on' : 'off'}
      style={{ '--ph': color, '--font': typeface + ',monospace', '--headline': headline }}>
      <div className="bg">{HK_PREVIEWS.map((src, i) => src ? <img key={i} className={'s' + (i === active ? ' on' : '')} src={src} alt="" /> : null)}</div>
      <div className="scrim" />
      <CRTGraphic shape={graphic} color={color} glow={glow} mouse={mouse} />
      <div className="screen">
        <div className="hd">
          <div className="top">
            <span className="id">Ali Milne<span className="bk">▉</span></span>
            <span className="nav"><button className="navlink" onClick={() => setAbout(true)}>About</button> · <button className="navlink" onClick={() => setContact(true)}>Contact</button></span>
          </div>
        </div>
        <div className="idx" onMouseLeave={() => setActive(null)}>
          {HK_WORK.map((w, i) => (
            <div key={i} className={'r' + (i === active ? ' on' : '') + (w.soon ? ' soon' : '')} onMouseEnter={() => setActive(i)} onClick={() => openCampaign(i)}>
              <span className="mk">{w.soon ? '·' : '›'}</span>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <span className="t t-serif"><Scramble text={w.t} active={i === active && !w.soon} on={decode} /></span>
              {w.sub ? <span className="sub">{w.sub}</span> : null}
              {w.soon ? <span className="tag">soon</span> : <span className="cur">█</span>}
            </div>
          ))}
        </div>
        <div className="ft">
          <span className="jolly" aria-label="skull and crossbones">
            <svg viewBox="0 0 32 32" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4.5c-4.7 0-8 3.2-8 7.6 0 2.6 1.1 4.3 2.4 5.4.5.4.8 1 .8 1.7v1.1c0 .6.5 1.1 1.1 1.1h7.4c.6 0 1.1-.5 1.1-1.1v-1.1c0-.7.3-1.3.8-1.7 1.3-1.1 2.4-2.8 2.4-5.4 0-4.4-3.3-7.6-8-7.6Z"/>
              <circle cx="12.4" cy="12.6" r="1.7" fill="currentColor" stroke="none"/>
              <circle cx="19.6" cy="12.6" r="1.7" fill="currentColor" stroke="none"/>
              <path d="M16 15.8l-.9 2.2h1.8L16 15.8Z" fill="currentColor" stroke="none"/>
              <path d="M6.5 25.5l19-5M6.5 20.5l19 5"/>
              <circle cx="6.2" cy="25.8" r="1" fill="currentColor" stroke="none"/>
              <circle cx="6.2" cy="20.2" r="1" fill="currentColor" stroke="none"/>
              <circle cx="25.8" cy="20.2" r="1" fill="currentColor" stroke="none"/>
              <circle cx="25.8" cy="25.8" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </span>
        </div>
      </div>
      {scanlines && <div className="scan" />}
      <div className="crt" />
    </div>
  );
}

window.HackHome = HackHome;
