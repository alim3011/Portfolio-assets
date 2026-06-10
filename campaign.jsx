// campaign.jsx — campaign / subsection pages in the hacking-interface house style.
// Data-driven: CAMPAIGNS[title] holds real content (film, copy, OOH, activation).
// Campaigns without an entry fall back to the placeholder template.
// Exports window.CampaignPage.

(function () {
  if (document.getElementById('cmp-styles')) return;
  const css = `
  .cmp{position:absolute;inset:0;background:var(--bg);color:var(--fg);
    --ph:#d7e6ff;--bg:#07090b;--glowpx:9px;--headline:'Newsreader';
    --fg:color-mix(in srgb,var(--ph) 86%,#ffffff 14%);
    --muted:color-mix(in srgb,var(--ph) 44%,transparent);
    --rule:color-mix(in srgb,var(--ph) 18%,transparent);
    font-family:var(--font,'IBM Plex Mono',monospace);font-variant-ligatures:none;}
  .cmp[data-glow=off]{--glowpx:0px;} .cmp[data-glow=soft]{--glowpx:5px;}
  .cmp[data-glow=strong]{--glowpx:10px;} .cmp[data-glow=max]{--glowpx:20px;}

  .cmp .scroll{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;padding:0 9vw 14vh;box-sizing:border-box;
    scrollbar-width:thin;scrollbar-color:var(--rule) transparent;}
  .cmp .scroll::-webkit-scrollbar{width:7px;} .cmp .scroll::-webkit-scrollbar-thumb{background:var(--rule);border-radius:4px;}
  .cmp .lnk{appearance:none;background:none;border:none;color:var(--ph);font:inherit;font-size:10.5px;
    letter-spacing:.18em;cursor:pointer;text-transform:uppercase;padding:0;transition:text-shadow .2s;}
  .cmp .lnk:hover{text-shadow:0 0 9px var(--ph);}
  .cmp .lnk.back{font-size:18px;letter-spacing:0;line-height:1;}

  .cmp .top{position:sticky;top:0;z-index:6;display:flex;justify-content:space-between;align-items:center;
    font-size:10.5px;letter-spacing:.18em;color:var(--muted);margin:0 -9vw;padding:24px 9vw 18px;text-transform:uppercase;
    background:linear-gradient(var(--bg) 52%,color-mix(in srgb,var(--bg) 60%,transparent) 80%,transparent);}

  .cmp .hero{padding:9vh 0 7vh;}
  .cmp .bc{font-size:10.5px;letter-spacing:.22em;color:var(--muted);text-transform:uppercase;margin-bottom:30px;}
  .cmp .bc b{color:var(--fg);font-weight:inherit;}

  .cmp .serif{font-family:var(--headline),'Newsreader',serif;font-weight:400;font-style:italic;}
  .cmp .title{font-size:clamp(40px,7.6vw,94px);line-height:.96;margin:0;letter-spacing:-.01em;color:var(--ph);padding-right:.2em;
    text-shadow:0 0 var(--glowpx) color-mix(in srgb,var(--ph) 42%,transparent);}
  .cmp[data-digi=on] .title{color:transparent;-webkit-text-fill-color:transparent;text-shadow:none;
    background-image:repeating-linear-gradient(0deg,var(--ph) 0 2px,color-mix(in srgb,var(--ph) 24%,transparent) 2px 4.4px);
    -webkit-background-clip:text;background-clip:text;
    filter:drop-shadow(0 0 var(--glowpx) color-mix(in srgb,var(--ph) 52%,transparent));}

  .cmp .idea{font-size:13.5px;max-width:56ch;margin:26px 0 22px;line-height:1.7;color:var(--muted);}
  .cmp .idea .pay{display:block;margin-top:1em;color:var(--fg);}
  .cmp .meta{display:flex;gap:26px;flex-wrap:wrap;font-size:10.5px;letter-spacing:.16em;color:var(--muted);text-transform:uppercase;}

  .cmp .block{padding:7vh 0;border-bottom:1px solid var(--rule);}
  .cmp .lbl{font-size:10.5px;letter-spacing:.22em;color:var(--muted);text-transform:uppercase;margin-bottom:22px;
    display:flex;align-items:center;gap:9px;}
  .cmp .lbl::before{content:'';width:20px;height:1px;background:var(--ph);opacity:.55;}
  .cmp .lbl .ix{margin-left:auto;opacity:.6;}

  .cmp .media{position:relative;border:1px solid var(--rule);background:#000;background-size:cover;background-position:center;overflow:hidden;}
  .cmp .media img{display:block;width:100%;height:100%;object-fit:cover;}
  .cmp .media.wide{aspect-ratio:16/9;}
  .cmp video{display:block;}
  .cmp .cap{margin-top:14px;font-size:10.5px;letter-spacing:.1em;color:var(--muted);text-transform:uppercase;}

  .cmp .foot .next{font-size:clamp(15px,2vw,22px);letter-spacing:0;text-transform:none;text-align:right;}

  /* About page */
  .cmp.about .scroll{display:flex;flex-direction:column;}
  .cmp .about-grid{display:grid;grid-template-columns:0.85fr 1fr;gap:6vw;align-items:center;min-height:78vh;padding:4vh 0 8vh;}
  @media(max-width:760px){.cmp .about-grid{grid-template-columns:1fr;gap:5vh;}}
  .cmp .about-photo{border:1px solid var(--rule);overflow:hidden;background:#000;align-self:center;}
  .cmp .about-photo img{display:block;width:100%;height:auto;filter:drop-shadow(0 0 var(--glowpx) color-mix(in srgb,var(--ph) 28%,transparent));}
  .cmp .about-body .title{font-size:clamp(34px,5vw,68px);margin:0 0 30px;}
  .cmp .about-blurb{font-size:clamp(16px,1.7vw,21px);line-height:1.7;color:var(--fg);max-width:40ch;margin:0 0 32px;}
  .cmp .about-blurb b{color:var(--ph);font-weight:inherit;text-shadow:0 0 8px color-mix(in srgb,var(--ph) 45%,transparent);}

  /* face-warp easter egg */
  .cmp .about-photo.warp{position:relative;cursor:crosshair;touch-action:none;}
  .cmp .about-photo.warp canvas{display:block;width:100%;height:auto;
    filter:drop-shadow(0 0 var(--glowpx) color-mix(in srgb,var(--ph) 28%,transparent));}
  .cmp .about-photo .warp-hint{position:absolute;left:0;bottom:-26px;font-size:9.5px;letter-spacing:.2em;
    text-transform:uppercase;color:var(--muted);opacity:0;transition:opacity .3s;}
  .cmp .about-photo.warp:hover .warp-hint{opacity:.8;}

  /* Contact — void + one imposing email */
  .cmp.contact{position:absolute;inset:0;display:flex;flex-direction:column;}
  .cmp .contact-top{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;justify-content:space-between;align-items:center;
    font-size:10.5px;letter-spacing:.18em;color:var(--muted);padding:24px 9vw;text-transform:uppercase;}
  .cmp .contact-stage{flex:1;display:flex;align-items:center;justify-content:center;padding:18vh 6vw;text-align:center;}
  .cmp .contact-email{font-family:var(--headline),'Newsreader',serif;font-style:italic;color:var(--ph);text-decoration:none;
    font-size:clamp(20px,2.6vw,40px);line-height:1.04;letter-spacing:-.01em;word-break:break-word;padding-right:.25em;
    text-shadow:0 0 calc(var(--glowpx) * 2) color-mix(in srgb,var(--ph) 55%,transparent);transition:letter-spacing .4s ease,text-shadow .4s ease;}
  .cmp .contact-email:hover{letter-spacing:.01em;text-shadow:0 0 calc(var(--glowpx) * 3.4) var(--ph);}
  .cmp[data-digi=on] .contact-email{-webkit-text-fill-color:transparent;color:transparent;
    background-image:repeating-linear-gradient(0deg,var(--ph) 0 2px,color-mix(in srgb,var(--ph) 30%,transparent) 2px 3px);
    -webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 var(--glowpx) color-mix(in srgb,var(--ph) 52%,transparent));}
  .cmp .about-meta{display:flex;gap:24px;flex-wrap:wrap;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:34px;}
  .cmp .about-meta span{white-space:nowrap;}
  .cmp .about-contact{font-size:13px;}

  /* grid wall of headlines */
  .cmp .marquee{margin:7px -9vw;overflow:hidden;}
  .cmp .mq-track{display:flex;flex-wrap:nowrap;width:max-content;animation:mqroll 42.5s linear infinite;}
  .cmp .mq-item{flex:0 0 auto;height:clamp(360px,58vh,560px);margin-right:16px;}
  .cmp .mq-item img,.cmp .mq-item video{height:100%;width:auto;display:block;border:1px solid var(--rule);background:#000;}
  @keyframes mqroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  @media(prefers-reduced-motion:reduce){.cmp .mq-track{animation:none;flex-wrap:wrap;gap:16px;}}
  .cmp .grid{display:grid;gap:10px;margin:7px -9vw;}
  .cmp .grid.g2{grid-template-columns:1fr 1fr;}
  .cmp .grid.g3{grid-template-columns:repeat(3,1fr);}
  .cmp .grid .cell{position:relative;aspect-ratio:16/9;overflow:hidden;background:#000;}
  .cmp .grid .cell img,.cmp .grid .cell video{width:100%;height:100%;object-fit:cover;display:block;}
  @media(max-width:680px){.cmp .grid.g2,.cmp .grid.g3{grid-template-columns:1fr;}}

  /* a single contained piece, centered */
  .cmp .frame{display:flex;justify-content:center;margin:7px 0;}
  .cmp .frame img,.cmp .frame video{max-width:min(900px,94%);max-height:90vh;width:auto;height:auto;border:1px solid var(--rule);display:block;}

  /* ragebait reaction wall (placeholder cards) */
  .cmp .reactions{columns:3;column-gap:14px;margin:7vh 0 2vh;}
  @media(max-width:900px){.cmp .reactions{columns:2;}}
  @media(max-width:560px){.cmp .reactions{columns:1;}}
  .cmp .rxn{break-inside:avoid;margin:0 0 14px;border:1px solid var(--rule);background:color-mix(in srgb,var(--ph) 5%,transparent);
    padding:14px 15px;border-radius:4px;}
  .cmp .rxn.hot{border-color:color-mix(in srgb,#e4002b 70%,transparent);background:color-mix(in srgb,#e4002b 9%,transparent);}
  .cmp .rxn-h{display:flex;align-items:center;gap:9px;margin-bottom:10px;}
  .cmp .rxn-h .av{width:26px;height:26px;border-radius:50%;background:color-mix(in srgb,var(--ph) 22%,transparent);flex:0 0 auto;}
  .cmp .rxn-h .hd{display:flex;flex-direction:column;gap:4px;flex:1;}
  .cmp .rxn-h .rd{height:7px;width:62%;background:color-mix(in srgb,var(--ph) 26%,transparent);border-radius:2px;}
  .cmp .rxn-h .rd.sm{width:38%;height:6px;background:color-mix(in srgb,var(--ph) 16%,transparent);}
  .cmp .rxn-h .t{font-size:10px;color:var(--muted);letter-spacing:.08em;}
  .cmp .rxn-b{font-size:14.5px;line-height:1.5;color:var(--fg);}
  .cmp .rxn-f{display:flex;gap:18px;margin-top:13px;font-size:11px;color:var(--muted);letter-spacing:.04em;font-variant-numeric:tabular-nums;}

  /* story block (image + copy) */
  .cmp .story{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,68px);align-items:center;padding:9vh 0;}
  .cmp .story .st-img img,.cmp .story .st-img video{width:100%;height:auto;display:block;border:1px solid var(--rule);}
  .cmp .story .st-h{font-size:clamp(30px,4.6vw,58px);line-height:1;margin:0 0 22px;color:var(--ph);
    text-shadow:0 0 var(--glowpx) color-mix(in srgb,var(--ph) 38%,transparent);}
  .cmp[data-digi=on] .story .st-h{color:transparent;-webkit-text-fill-color:transparent;text-shadow:none;
    background-image:repeating-linear-gradient(0deg,var(--ph) 0 2px,color-mix(in srgb,var(--ph) 24%,transparent) 2px 4.4px);
    -webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 var(--glowpx) color-mix(in srgb,var(--ph) 50%,transparent));}
  .cmp .story .st-b{font-size:14.5px;line-height:1.7;color:var(--fg);max-width:42ch;}
  @media(max-width:680px){.cmp .story{grid-template-columns:1fr;gap:24px;}}

  /* centered narrative text block */
  .cmp .txt{max-width:60ch;margin:0 auto;padding:9vh 0;}
  .cmp .txt p{font-size:15px;line-height:1.85;color:var(--muted);margin:0 0 1.4em;}
  .cmp .txt p:first-child{color:var(--fg);font-size:17px;line-height:1.7;}
  .cmp .txt p:last-child{margin-bottom:0;}

  /* press / vox pops */
  .cmp .press{padding:8vh 0 2vh;}
  .cmp .press-lead{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);margin-bottom:22px;
    display:flex;align-items:center;gap:10px;}
  .cmp .press-lead::after{content:'';flex:1;height:1px;background:var(--rule);}
  .cmp .press-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  @media(max-width:680px){.cmp .press-grid{grid-template-columns:1fr;}}
  .cmp .pcard{display:flex;flex-direction:column;gap:14px;border:1px solid var(--rule);padding:24px 24px 20px;
    text-decoration:none;color:var(--fg);transition:border-color .2s,background .2s;border-radius:4px;}
  .cmp .pcard:hover{border-color:var(--ph);background:color-mix(in srgb,var(--ph) 6%,transparent);}
  .cmp .pcard .pub{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--ph);}
  .cmp .pcard .pq{font-style:italic;font-size:19px;line-height:1.38;color:var(--fg);flex:1;}
  .cmp .pcard .pmore{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);transition:color .2s;}
  .cmp .pcard:hover .pmore{color:var(--ph);}

  /* full-bleed plates */
  .cmp .bleed{margin:7px -9vw;background:#000;}
  .cmp .bleed img{display:block;width:100%;height:auto;}
  .cmp .firstbleed{margin-top:0;}

  /* duo: a landscape + a portrait side by side, full-bleed */
  .cmp .duo{display:flex;gap:8px;margin:7px -9vw;height:clamp(330px,52vh,520px);background:#000;}
  .cmp .duo .land{flex:1;height:100%;overflow:hidden;}
  .cmp .duo .land img{width:100%;height:100%;object-fit:cover;display:block;}
  .cmp .duo .land video{width:100%;height:100%;object-fit:cover;display:block;}
  .cmp .duo .por{flex:0 0 auto;height:100%;}
  .cmp .duo .por img,.cmp .duo .por video{height:100%;width:auto;display:block;}
  @media(max-width:680px){.cmp .duo{height:auto;flex-direction:column;}.cmp .duo .land,.cmp .duo .por{height:auto;width:100%;}.cmp .duo .por img{width:100%;height:auto;}}

  /* film */
  .cmp .film{position:relative;margin:7px -9vw;aspect-ratio:16/9;overflow:hidden;background:#000;}
  .cmp .film img{width:100%;height:100%;object-fit:cover;opacity:.86;transition:opacity .3s,transform .6s;}
  .cmp .film:hover img{opacity:1;transform:scale(1.015);}
  .cmp .film iframe{position:absolute;inset:0;width:100%;height:100%;border:0;}
  .cmp .film .play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;cursor:pointer;appearance:none;border:none;background:none;}
  .cmp .film .play span{width:90px;height:90px;border-radius:50%;border:1.5px solid var(--ph);display:flex;align-items:center;justify-content:center;
    color:var(--ph);font-size:28px;padding-left:6px;background:rgba(7,9,11,.32);backdrop-filter:blur(2px);
    box-shadow:0 0 var(--glowpx) color-mix(in srgb,var(--ph) 55%,transparent);transition:transform .25s,background .25s;}
  .cmp .film:hover .play span{transform:scale(1.08);background:rgba(7,9,11,.12);}
  .cmp .film .ytlink{position:absolute;right:16px;bottom:14px;z-index:3;font-size:10px;letter-spacing:.16em;text-transform:uppercase;
    color:var(--ph);text-decoration:none;background:rgba(7,9,11,.5);padding:6px 11px;border:1px solid var(--rule);backdrop-filter:blur(2px);transition:text-shadow .2s;}
  .cmp .film .ytlink:hover{text-shadow:0 0 9px var(--ph);}

  /* phone mockup + portrait triptych */
  .cmp .strip{display:flex;justify-content:center;align-items:center;gap:clamp(16px,3.5vw,52px);margin:7vh 0;flex-wrap:wrap;}
  .cmp .strip .por{height:clamp(340px,56vh,560px);}
  .cmp .strip .por img,.cmp .strip .por video{height:100%;width:auto;display:block;border:1px solid var(--rule);}
  .cmp .phone{position:relative;height:clamp(360px,58vh,580px);aspect-ratio:9/19.5;border-radius:38px;
    background:#050607;border:1px solid color-mix(in srgb,var(--ph) 26%,#222);padding:9px;box-sizing:border-box;
    box-shadow:0 0 calc(var(--glowpx) * 1.4) color-mix(in srgb,var(--ph) 36%,transparent),0 24px 60px rgba(0,0,0,.6);}
  .cmp .phone .scr{width:100%;height:100%;border-radius:30px;overflow:hidden;background:#000;}
  .cmp .phone .scr img{width:100%;height:100%;object-fit:cover;}
  .cmp .phone .scr video{width:100%;height:100%;object-fit:cover;display:block;}
  .cmp .phone .notch{position:absolute;top:16px;left:50%;transform:translateX(-50%);width:78px;height:20px;
    background:#050607;border-radius:12px;z-index:2;}

  /* real KFC Original Recipe variable font */
  @font-face{font-family:'Original Recipe';src:url('assets/fonts/OriginalRecipe.ttf') format('truetype');font-display:swap;}

  /* generative typeface showcase */
  .cmp .typeface{margin:7px -9vw;padding:9vh 9vw;background:#0a0506;
    background-image:radial-gradient(120% 120% at 50% 0%,color-mix(in srgb,#e4002b 16%,transparent),transparent 60%);
    border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);}
  .cmp .tf-word{display:flex;flex-direction:column;align-items:center;gap:.01em;line-height:.86;
    filter:drop-shadow(0 0 calc(var(--glowpx) * 1.2) rgba(228,0,43,.5));}
  .cmp .tf-line{font-family:'Original Recipe','Anton',sans-serif;color:#e4002b;text-align:center;
    font-size:clamp(46px,10vw,132px);font-feature-settings:'calt' 1,'liga' 1;letter-spacing:.01em;}
  .cmp .tf-copy{max-width:30ch;margin:6vh auto 0;text-align:center;font-size:14px;line-height:1.7;color:var(--fg);}
  .cmp .tf-sub{text-align:center;margin:6vh 0 30px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);}
  .cmp .tf-type{margin:0 -9vw;overflow:hidden;display:flex;justify-content:flex-end;padding:0 9vw;
    -webkit-mask-image:linear-gradient(90deg,transparent,#000 16%,#000 100%);
    mask-image:linear-gradient(90deg,transparent,#000 16%,#000 100%);}
  .cmp .tf-stream{display:flex;flex-wrap:nowrap;align-items:flex-end;width:max-content;flex:0 0 auto;}
  .cmp .tf-e{flex:0 0 auto;font-family:'Original Recipe','Anton',sans-serif;color:#e4002b;
    font-size:clamp(76px,9vw,132px);line-height:1.15;margin-right:.12em;
    filter:drop-shadow(0 0 7px rgba(228,0,43,.4));animation:tfpop .22s ease-out, tfwiggle 2.4s ease-in-out infinite;}
  @keyframes tfpop{from{transform:translateY(8px) scale(.92);}to{transform:none;}}
  @keyframes tfwiggle{0%,100%{transform:rotate(-2deg) scale(1);}50%{transform:rotate(2deg) scale(1.05);}}
  @media(prefers-reduced-motion:reduce){.cmp .tf-e{animation:none;}}
  .cmp .tf-caret{flex:0 0 auto;width:.12em;height:.92em;background:#e4002b;align-self:center;
    font-size:clamp(76px,9vw,132px);filter:drop-shadow(0 0 8px rgba(228,0,43,.6));animation:tfblink 1s steps(1) infinite;}
  @keyframes tfblink{50%{opacity:0;}}
  @media(max-width:680px){.cmp .tf-e,.cmp .tf-caret{font-size:84px;}}

  /* writing block */
  .cmp .words .pull{font-size:clamp(26px,4vw,50px);line-height:1.16;margin:0;max-width:20ch;color:var(--ph);padding-right:.2em;
    text-shadow:0 0 var(--glowpx) color-mix(in srgb,var(--ph) 34%,transparent);}
  .cmp[data-digi=on] .words .pull{color:transparent;-webkit-text-fill-color:transparent;text-shadow:none;
    background-image:repeating-linear-gradient(0deg,var(--ph) 0 2px,color-mix(in srgb,var(--ph) 22%,transparent) 2px 4.4px);
    -webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 var(--glowpx) color-mix(in srgb,var(--ph) 46%,transparent));}
  .cmp .words .pull .last{display:block;margin-top:.5em;color:var(--fg);-webkit-text-fill-color:initial;background:none;filter:none;font-style:italic;}
  .cmp .words.lines .pull{font-size:clamp(20px,2.7vw,34px);line-height:1.4;max-width:30ch;}
  .cmp .words .body{display:grid;grid-template-columns:1fr 1fr;gap:36px;font-size:12.5px;line-height:1.7;color:var(--muted);max-width:72ch;margin-top:28px;}

  /* galleries */
  .cmp .trio{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start;}
  .cmp .trio .media{aspect-ratio:auto;border:1px solid var(--rule);}
  @media(max-width:680px){.cmp .words .body{grid-template-columns:1fr;}.cmp .trio{grid-template-columns:1fr;max-width:360px;}}

  .cmp .foot{display:flex;justify-content:space-between;align-items:baseline;padding-top:7vh;gap:20px;}
  .cmp .foot .next{font-size:clamp(15px,2vw,22px);letter-spacing:0;text-transform:none;text-align:right;}

  @media (prefers-reduced-motion: no-preference){
    .cmp.in-poweron .scroll{animation:cmpOn .55s ease-out;}
    @keyframes cmpOn{0%{transform:scaleY(.004);filter:brightness(2.8);}45%{transform:scaleY(1);filter:brightness(1.5);}100%{transform:none;filter:none;}}
    .cmp.in-expand .scroll{animation:cmpZoom .55s cubic-bezier(.2,.7,.3,1);}
    @keyframes cmpZoom{from{transform:scale(.92);}to{transform:none;}}
    .cmp.in-decrypt .hero,.cmp.in-decrypt .block,.cmp.in-decrypt .foot{animation:cmpRise .5s both;}
    .cmp.in-decrypt .block:nth-of-type(2){animation-delay:.06s;}
    .cmp.in-decrypt .block:nth-of-type(3){animation-delay:.12s;}
    .cmp.in-decrypt .block:nth-of-type(4){animation-delay:.18s;}
    .cmp.in-decrypt .block:nth-of-type(5){animation-delay:.24s;}
    .cmp.in-decrypt .foot{animation-delay:.3s;}
    @keyframes cmpRise{from{transform:translateY(20px);}to{transform:none;}}
  }
  `;
  const s = document.createElement('style'); s.id = 'cmp-styles'; s.textContent = css; document.head.appendChild(s);
})();

/* ---------------- real campaign content ---------------- */
const CAMPAIGNS = {
  'Believe in Chicken': {
    client: 'KFC',
    meta: ['KFC', 'Film · OOH · Activation'],
    ideaLines: [
      'When you can’t believe in your government. When you can’t believe in your disappointing boyfriend. When you can’t believe in the weather. When you can’t believe in crisp packets being half-filled with air.',
    ],
    pay: 'You can always Believe in Chicken.',
    blocks: [
      { kind: 'film', poster: 'assets/bic/field.webp', yt: 'UrfQaMAH0Ss' },
      { kind: 'bleed', src: 'assets/bic/piccadilly.gif' },
      { kind: 'strip', items: [
        { src: 'assets/bic/pub.webp', type: 'por' },
        { src: 'assets/bic/ring.gif', type: 'phone' },
      ] },
      { kind: 'duo', land: 'assets/bic/field.webp', por: 'assets/bic/plane.gif' },
      { kind: 'bleed', src: 'assets/bic/parliament.gif' },
      { kind: 'bleed', src: 'assets/bic/neon.gif' },
    ],
  },

  'Building a Cult': {
    client: 'KFC',
    meta: ['KFC', 'OOH · Type Design'],
    ideaLines: [
      'Believe in Chicken didn’t run as one ad — it ran as a faith. A relentless wall of headlines, each one a different sermon for the same gospel: the chicken.',
    ],
    blocks: [
      { kind: 'bleed', src: 'assets/cult/board.webp' },
      { kind: 'bleed', src: 'assets/cult/spices.webp' },
      { kind: 'bleed', src: 'assets/cult/wings.webp' },
      { kind: 'bleed', src: 'assets/cult/tower.webp' },
      { kind: 'bleed', src: 'assets/cult/hand.webp' },
      { kind: 'bleed', src: 'assets/cult/waterloo.webp' },
      { kind: 'bleed', src: 'assets/cult/belbuild.gif' },
      { kind: 'bleed', src: 'assets/cult/texture2.gif' },
      { kind: 'typeface', word: 'ORIGINAL RECIPE', letter: 'E' },
      { kind: 'film', poster: 'assets/cult/believe-tease.gif', yt: 'szdRUBVoP84' },
      { kind: 'marquee', items: ['assets/cult/succumb.webp', 'assets/cult/sacredsauce.mp4', 'assets/cult/unfry.mp4', 'assets/cult/behold.gif', 'assets/cult/single.mp4'] },
      { kind: 'bleed', src: 'assets/cult/platform.gif' },
    ],
  },

  'Believe in Chicken 2': {
    client: 'KFC',
    meta: ['KFC', 'Film'],
    ideaLines: [
      'We needed to follow our first film with something even more powerful. Enter: the gravy baptism.',
    ],
    pay: 'People hated it.',
    blocks: [
      { kind: 'film', poster: 'https://img.youtube.com/vi/SVHHQKmzYOc/maxresdefault.jpg', yt: 'SVHHQKmzYOc' },
      { kind: 'reactions', items: [
        { text: 'absolutely vile. who signed this off??', l: '2.4k', rt: '310', r: '188', hot: true },
        { text: 'i have genuinely lost my appetite', l: '940', rt: '77', t: '3d' },
        { text: 'what in the unholy hell did i just watch', l: '5.1k', rt: '1.2k', r: '402', hot: true },
        { text: 'unfollowed. reported. goodbye.', l: '612', rt: '44', t: '1d' },
        { text: 'this is the most cursed thing on my feed today', l: '1.8k', rt: '260', t: '2d' },
        { text: 'make it stop. make it STOP.', l: '730', rt: '51' },
        { text: 'whoever made this needs a lie down', l: '3.3k', rt: '880', r: '215', hot: true },
        { text: 'i will never eat there again and neither should you', l: '420', rt: '38', t: '4d' },
        { text: 'why is this allowed on television', l: '1.1k', rt: '149', t: '2d' },
        { text: 'genuinely unhinged advertising. i kind of respect it', l: '6.7k', rt: '2.1k', r: '530', hot: true },
        { text: 'i can’t unsee the gravy thing', l: '880', rt: '95', t: '3d' },
        { text: 'new fear unlocked', l: '2.0k', rt: '410' },
      ] },
    ],
  },

  'Seeing Double': {
    client: 'KFC',
    displayTitle: 'Double Down',
    meta: ['KFC', 'Film · Double Down'],
    ideaLines: [
      'The plan: gaslight the nation into thinking about the Double Down every time they saw double. A flicker of déjà vu in any ad break — and down the spiral they went.',
    ],
    pay: 'A nationwide epidemic of seeing double.',
    blocks: [
      { kind: 'film', poster: 'https://img.youtube.com/vi/CdUcZg3pvFA/maxresdefault.jpg', yt: 'CdUcZg3pvFA' },
      { kind: 'film', poster: 'https://img.youtube.com/vi/-ZCjR70IURw/maxresdefault.jpg', yt: '-ZCjR70IURw' },
      { kind: 'film', poster: 'https://img.youtube.com/vi/cPcXuC2dCvk/maxresdefault.jpg', yt: 'cPcXuC2dCvk' },
    ],
  },

  'Lost and Found': {
    client: 'Uber',
    meta: ['Uber Exec', 'Social Activation'],
    ideaLines: [
      'Ever left something in the back of an Uber? So have celebrities — only theirs were in Uber Execs. To drive upgrades, we launched Uber Exec: Lost & Found: a social activation starring Lando Norris and Kylie Minogue, who “lost” prized possessions in their rides.',
    ],
    pay: 'The public were challenged to track them down.',
    blocks: [
      { kind: 'film', poster: 'https://img.youtube.com/vi/KcIBHTnYQKI/maxresdefault.jpg', yt: 'KcIBHTnYQKI' },
      { kind: 'duo', land: 'assets/lost/glove-case.webp', por: 'assets/lost/glove-poster.gif' },
      { kind: 'duo', land: 'assets/lost/helmet-case.webp', por: 'assets/lost/helmet-poster.gif' },
      { kind: 'story', img: 'assets/lost/blair.png',
        title: 'Meet Blair.',
        body: 'Shoutout to Blair, who found Kylie’s glove. Not sure he realised what was going on.' },
    ],
  },

  'Ramadan': {
    client: 'Uber Eats',
    displayTitle: 'Uber Eats Ramadan',
    meta: ['Uber Eats', 'OOH · Ramadan'],
    ideaLines: [
      'A campaign for Uber Eats that marks the month of Ramadan with one execution and hundreds of variations. The posters update daily to reflect the exact time of sunset — when Muslims break their fast and enjoy Iftar. Customised per location, every day, for the whole month.',
    ],
    pay: 'One idea. A different time, everywhere.',
    blocks: [
      { kind: 'bleed', src: 'assets/ramadan/wall.webp' },
      { kind: 'bleed', src: 'assets/ramadan/watermelon.webp' },
      { kind: 'bleed', src: 'assets/ramadan/tube.webp' },
      { kind: 'bleed', src: 'assets/ramadan/street.webp' },
      { kind: 'bleed', src: 'assets/ramadan/dates.webp' },
    ],
  },

  'Reserved': {
    client: 'Uber Reserve',
    displayTitle: 'Uber Reserve',
    meta: ['Uber Reserve', 'OOH · Film'],
    ideaLines: [
      'A print campaign for Uber Reserve — beautifully simple posters for the moments worth booking a cab ahead. Each car folded, origami-style, from the very ticket that gets you there.',
    ],
    pay: 'Book it in advance.',
    blocks: [
      { kind: 'bleed', src: 'assets/reserve/airport.webp' },
      { kind: 'strip', items: [
        { src: 'assets/reserve/theatre.webp', type: 'por' },
        { src: 'assets/reserve/datenight.webp', type: 'por' },
      ] },
      { kind: 'bleed', src: 'assets/reserve/matchday.webp' },
      { kind: 'film', poster: 'https://img.youtube.com/vi/_Qv6H7-RwD0/maxresdefault.jpg', yt: '_Qv6H7-RwD0' },
      { kind: 'film', poster: 'https://img.youtube.com/vi/y_tNUwRUzbo/maxresdefault.jpg', yt: 'y_tNUwRUzbo' },
      { kind: 'film', poster: 'https://img.youtube.com/vi/M5aeEPmp9Jg/maxresdefault.jpg', yt: 'M5aeEPmp9Jg' },
    ],
  },

  'I Feel Nothing': {
    client: 'Triumph',
    meta: ['Triumph', 'Film · Print · 360°'],
    ideaLines: [
      'When women put on a bra, do they want to feel like a boss? A goddess? A champion of their gender? Or do they just want to feel… nothing? To modernise this heritage brand, we built a 360° campaign across Europe that redefined empowerment.',
    ],
    pay: 'Because the best bra isn’t one you think about. It’s one you don’t feel at all.',
    blocks: [
      { kind: 'film', poster: 'https://img.youtube.com/vi/DA9PYFW0pis/maxresdefault.jpg', yt: 'DA9PYFW0pis' },
      { kind: 'film', poster: 'https://img.youtube.com/vi/p0_rMF8qMr4/maxresdefault.jpg', yt: 'p0_rMF8qMr4' },
      { kind: 'bleed', src: 'assets/nothing/couple.webp' },
      { kind: 'bleed', src: 'assets/nothing/carousel.webp' },
      { kind: 'frame', src: 'assets/nothing/bride.webp' },
    ],
  },

  'Sterling Sells': {
    client: 'Samsung',
    meta: ['Samsung', 'Social · Film'],
    ideaLines: [
      'An alternate universe where Raheem Sterling isn’t a world-class footballer but a world-class phone salesman. Social content for Samsung that smuggled every Galaxy S23 feature into a straight face.',
    ],
    pay: 'Same ambassadors. Entirely wrong careers.',
    blocks: [
      { kind: 'film', vimeo: '845019288', poster: 'https://vumbnail.com/845019288.jpg' },
    ],
  },

  'Guappp': {
    client: 'Self-initiated',
    displayTitle: 'GUAPPP',
    meta: ['Self-initiated', 'Covid · 2020'],
    ideaLines: [
      'In 2020, with Covid in full swing and placements at top agencies thin on the ground, my creative partner and I did the only sensible thing: we founded a top agency of our very own. GUAPPP.',
    ],
    pay: 'Give Us A Placement, Pretty Please.',
    blocks: [
      { kind: 'frame', src: 'assets/guap/linkedin.png' },
      { kind: 'frame', src: 'assets/guap/team.png' },
      { kind: 'text', body: [
        'And it worked. We simultaneously became the Founders, CCOs, ECDs, CDs, ACDs, Midweights, Juniors, Placement Team and Janitors of our very own advertising agency.',
        'Clients flooded in. We’re talking N.S. James & Sons Butchers. Abergavenny AND Newport Sunbeds and Spray Tans Ltd.',
        'We were quickly bought out by London’s leading agencies, in an industry merger never seen before.',
      ] },
      { kind: 'bleed', src: 'assets/guap/lamb.png' },
      { kind: 'strip', items: [
        { src: 'assets/guap/butcher.png', type: 'por' },
        { src: 'assets/guap/waitrose.png', type: 'por' },
      ] },
      { kind: 'bleed', src: 'assets/guap/arrow.png' },
      { kind: 'press', items: [
        { pub: 'Rob Fletcher — isobel, ECD & Founder', quote: '“Ali and Paloma have already proven they’re self-starters by forming their own agency … the idea worked, and those are the best ideas.”', href: 'https://marcommnews.com/isobel-hire-guappp-creative-studios-duo/' },
        { pub: 'Tony Cullingham — Watford Ad School', quote: '“They need to harness the wealth of creative talent leaving ad schools and colleges right now.”', href: 'https://www.campaignlive.co.uk/article/watford-grads-fight-hiring-freeze-setting-own-agency/1694654' },
        { pub: 'The Drum', quote: '“Creative directors and agencies are now sliding into our DMs left, right and centre.”', href: 'https://www.thedrum.com/opinion/we-started-our-own-ad-agency-and-gave-ourselves-placements-here-s-why' },
        { pub: 'MarComm News', quote: '“isobel hire the savvy graduates who set up their own creative agency.”', href: 'https://marcommnews.com/isobel-hire-guappp-creative-studios-duo/' },
        { pub: 'Campaign', quote: '“We want to use our skills and create big campaigns for small businesses.”', href: 'https://www.campaignlive.co.uk/article/watford-grads-fight-hiring-freeze-setting-own-agency/1694654' },
        { pub: 'Evening Standard', quote: '“Give us a placement, pretty please.”', href: 'https://www.standard.co.uk/lifestyle/how-to-find-a-job-internship-give-us-a-placement-pretty-please-a4572954.html' },
      ] },
    ],
  },
};

/* ---------------- fallback placeholder content ---------------- */
const CMP_STILLS = [
  'linear-gradient(135deg,#caa57f,#6b4b3a 60%,#2c1d16)', 'linear-gradient(160deg,#9fb3c8,#41566b 55%,#1d2733)',
  'linear-gradient(120deg,#e3b9a0,#b56a52 50%,#5e2f2a)', 'linear-gradient(150deg,#bcc7b0,#6f7d5e 55%,#2f3a26)',
  'linear-gradient(135deg,#d8c6e0,#8a6f9e 55%,#3d2c4a)', 'radial-gradient(120% 120% at 30% 20%,#e8d6a8,#a07b3e 55%,#3f2c14)',
  'linear-gradient(135deg,#b0c4c9,#5d7e84 55%,#243437)', 'linear-gradient(160deg,#e6a9a0,#9e4b46 55%,#46201e)',
  'linear-gradient(135deg,#c9c2b4,#7c7363 55%,#33302a)', 'linear-gradient(160deg,#9fb3c8,#41566b 55%,#1d2733)',
  'linear-gradient(120deg,#e3b9a0,#b56a52 50%,#5e2f2a)', 'linear-gradient(150deg,#bcc7b0,#6f7d5e 55%,#2f3a26)',
];
const CMP_BODY = 'Placeholder copy — where the thinking lives. The problem, the insight, the idea, and what happened when it met the world.';

const CMP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#@%';
function useDecode(text, run) {
  const [disp, setDisp] = React.useState(text);
  React.useEffect(() => {
    if (!run) { setDisp(text); return; }
    const start = performance.now(), dur = 640; let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur), reveal = Math.floor(p * text.length);
      let s = ''; for (let k = 0; k < text.length; k++) s += (k < reveal || text[k] === ' ') ? text[k] : CMP_CHARS[(Math.random() * CMP_CHARS.length) | 0];
      setDisp(s); if (p < 1) raf = requestAnimationFrame(tick); else setDisp(text);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [text, run]);
  return disp;
}

function Media({ src }) {
  if (/\.mp4$/i.test(src)) {
    return <video src={src} autoPlay loop playsInline muted
      ref={(el) => { if (el) { el.muted = true; el.volume = 0; el.defaultMuted = true; } }} />;
  }
  return <img src={src} alt="" loading="lazy" />;
}

function FilmPlate({ poster, yt, vimeo, first }) {
  const [play, setPlay] = React.useState(false);
  const embed = vimeo
    ? 'https://player.vimeo.com/video/' + vimeo + '?autoplay=1&title=0&byline=0&portrait=0'
    : 'https://www.youtube-nocookie.com/embed/' + yt + '?autoplay=1&rel=0&playsinline=1&modestbranding=1';
  const watch = vimeo ? 'https://vimeo.com/' + vimeo : 'https://www.youtube.com/watch?v=' + yt;
  const label = vimeo ? 'Watch on Vimeo ↗' : 'Watch on YouTube ↗';
  return (
    <div className={'film' + (first ? ' firstbleed' : '')}>
      {play
        ? <iframe src={embed} title="Film" allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
        : <React.Fragment>
            <img src={poster} alt="" onError={(e) => { if (e.target.src.indexOf('maxresdefault') !== -1) e.target.src = e.target.src.replace('maxresdefault', 'hqdefault'); else e.target.style.display = 'none'; }} />
            <button className="play" onClick={() => setPlay(true)} aria-label="Play film"><span>▶</span></button>
          </React.Fragment>}
      <a className="ytlink" href={watch} target="_blank" rel="noopener noreferrer">{label}</a>
    </div>
  );
}

/* generative type: the REAL KFC Original Recipe variable font.
   Two axes (KFCA, KFCB, each 0–100) + stylistic sets warp every glyph.
   The E is "typed" out in an endless line, each one slightly different. */
function TypefaceShowcase({ word = 'ORIGINAL RECIPE', letter = 'E' }) {
  const [tick, setTick] = React.useState(0);
  const [es, setEs] = React.useState([]);
  const idRef = React.useRef(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1100);
    return () => clearInterval(id);
  }, []);
  // typewriter: append a fresh, unique E on an interval; keep a rolling buffer
  React.useEffect(() => {
    const sets = ['normal', "'ss01' 1", "'ss02' 1", "'ss03' 1"];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MAX = 46;
    const seed = () => {
      const k = idRef.current++;
      return { id: k, a: Math.floor(Math.random() * 100), b: Math.floor(Math.random() * 100), feat: sets[k % 4], delay: -(Math.random() * 2.4).toFixed(2) };
    };
    if (reduce) { setEs(Array.from({ length: 26 }, seed)); return; }
    setEs([seed(), seed()]);
    const id = setInterval(() => {
      setEs(prev => { const next = prev.concat(seed()); return next.length > MAX ? next.slice(next.length - MAX) : next; });
    }, 360);
    return () => clearInterval(id);
  }, []);
  const words = word.split(' ');
  const wordVar = (wi, i) => {
    const s = (tick * 17 + wi * 53 + i * 29);
    return "'KFCA' " + (s % 100) + ", 'KFCB' " + ((s * 7 + 11) % 100);
  };
  return (
    <div className="typeface">
      <div className="tf-word">
        {words.map((w, wi) => (
          <div className="tf-line" key={wi}>
            {w.split('').map((c, i) => (
              <span key={wi + '-' + i} style={{ fontVariationSettings: wordVar(wi, i) }}>{c}</span>
            ))}
          </div>
        ))}
      </div>
      <p className="tf-copy">
        We drew KFC a living typeface. Every time a character was set, the system
        redrew it slightly differently — so no two letters were ever identical.
        Like the chicken: every piece original.
      </p>
      <div className="tf-sub">One letter, endless iterations, always original.</div>
      <div className="tf-type">
        <div className="tf-stream">
          {es.map((g) => (
            <span key={g.id} className="tf-e"
              style={{ fontVariationSettings: "'KFCA' " + g.a + ", 'KFCB' " + g.b, fontFeatureSettings: g.feat, animationDelay: '0s, ' + g.delay + 's' }}>{letter}</span>
          ))}
          <span className="tf-caret" />
        </div>
      </div>
    </div>
  );
}

function Reactions({ items }) {
  return (
    <div className="reactions">
      {items.map((it, i) => (
        <div key={i} className={'rxn' + (it.hot ? ' hot' : '')}>
          <div className="rxn-h">
            <span className="av" />
            <span className="hd"><span className="rd" /><span className="rd sm" /></span>
            <span className="t">{it.t || '2d'}</span>
          </div>
          <div className="rxn-b">{it.text}</div>
          <div className="rxn-f"><span>↩ {it.r || ''}</span><span>↻ {it.rt || ''}</span><span>♡ {it.l || ''}</span></div>
        </div>
      ))}
    </div>
  );
}

function Block({ b, first }) {
  if (b.kind === 'film') return <FilmPlate poster={b.poster} yt={b.yt} vimeo={b.vimeo} first={first} />;
  if (b.kind === 'reactions') return <Reactions items={b.items} />;
  if (b.kind === 'text') return <section className="txt">{b.body.map((p, i) => <p key={i}>{p}</p>)}</section>;
  if (b.kind === 'press') {
    return (
      <section className="press">
        <div className="press-lead">In the press</div>
        <div className="press-grid">
          {b.items.map((it, i) => (
            <a key={i} className="pcard" href={it.href} target="_blank" rel="noopener noreferrer">
              <span className="pub">{it.pub}</span>
              <span className="pq serif">{it.quote}</span>
              <span className="pmore">Read →</span>
            </a>
          ))}
        </div>
      </section>
    );
  }
  if (b.kind === 'story') {
    return (
      <section className="story">
        <div className="st-img"><Media src={b.img} /></div>
        <div className="st-txt">
          <h2 className="st-h serif">{b.title}</h2>
          <p className="st-b">{b.body}</p>
        </div>
      </section>
    );
  }
  if (b.kind === 'typeface') return <TypefaceShowcase word={b.word} letter={b.letter} />;
  if (b.kind === 'bleed') {
    return <div className={'bleed' + (first ? ' firstbleed' : '')}><Media src={b.src} /></div>;
  }
  if (b.kind === 'frame') {
    return <div className="frame"><Media src={b.src} /></div>;
  }
  if (b.kind === 'grid') {
    return (
      <div className={'grid g' + (b.cols || 2)}>
        {b.items.map((src, i) => <div key={i} className="cell"><Media src={src} /></div>)}
      </div>
    );
  }
  if (b.kind === 'marquee') {
    return (
      <div className="marquee">
        <div className="mq-track">
          {[...b.items, ...b.items].map((src, i) => <div key={i} className="mq-item"><Media src={src} /></div>)}
        </div>
      </div>
    );
  }
  if (b.kind === 'strip') {
    return (
      <div className="strip">
        {b.items.map((it, i) => it.type === 'phone'
          ? <div key={i} className="phone"><div className="notch" /><div className="scr"><Media src={it.src} /></div></div>
          : <div key={i} className="por"><Media src={it.src} /></div>
        )}
      </div>
    );
  }
  if (b.kind === 'duo') {
    return (
      <div className="duo">
        <div className="land"><Media src={b.land} /></div>
        <div className="por"><Media src={b.por} /></div>
      </div>
    );
  }
  return null;
}

function CampaignPage({ index, total, title, subtitle = '', nextTitle, color = '#d7e6ff', typeface = "'IBM Plex Mono'", glow = 'strong', headline = "'Newsreader'", digi = true, entry = 'decrypt', onBack, onNav }) {
  const n2 = (k) => String(k).padStart(2, '0');
  const data = CAMPAIGNS[title];
  const heroTitle = useDecode((data && data.displayTitle) || title, entry === 'decrypt');
  const meta = (data && data.meta) || ['Client — placeholder', 'Film · OOH'];
  const fallbackIdea = subtitle || 'Idea line — placeholder.';

  React.useEffect(() => { const s = document.querySelector('.cmp .scroll'); if (s) s.scrollTop = 0; }, [title]);

  return (
    <div className={'cmp in-' + entry} data-glow={glow} data-digi={digi ? 'on' : 'off'}
      style={{ '--ph': color, '--font': typeface + ',monospace', '--headline': headline }}>
      <div className="scroll">
        <div className="top">
          <button className="lnk back" onClick={onBack} aria-label="Back to index">←</button>
          <span>{n2(index + 1)} / {n2(total)}</span>
        </div>

        <header className="hero">
          <h1 className="title serif">{heroTitle}</h1>
          {data
            ? <p className="idea">{data.ideaLines.map((l, i) => <span key={i}>{l}</span>)}{data.pay && <span className="pay">{data.pay}</span>}</p>
            : <p className="idea"><span className="pay" style={{ marginTop: 0, color: 'var(--fg)' }}>{fallbackIdea}</span></p>}
          <div className="meta">{meta.map((m, i) => <span key={i}>{m}</span>)}</div>
        </header>

        {data
          ? data.blocks.map((b, i) => <Block key={i} b={b} first={i === 0} />)
          : (
            <React.Fragment>
              <div className="bleed firstbleed" style={{ aspectRatio: '16/9', background: CMP_STILLS[index % CMP_STILLS.length] }} />
              <section className="block words lines"><blockquote className="pull serif">“{fallbackIdea}”</blockquote><div className="body"><p>{CMP_BODY}</p><p>{CMP_BODY}</p></div></section>
              <div className="bleed" style={{ aspectRatio: '16/9', background: CMP_STILLS[(index + 1) % CMP_STILLS.length] }} />
            </React.Fragment>
          )}

        <footer className="foot">
          <button className="lnk" onClick={onBack}>← All work</button>
          <button className="lnk next serif" onClick={() => onNav(1)} style={{ fontStyle: 'italic' }}>Next — {nextTitle} →</button>
        </footer>
      </div>
    </div>
  );
}

window.CampaignPage = CampaignPage;
