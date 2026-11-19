---
name: reference-orbit-fan-techniques
description: "Technique Set 5 — 'Orbit Fan': build-ready guide + copy-paste code for a draggable wheel/fan carousel (cards on a hidden circle, endless spin, inertia + snap, tap-to-select, keep-out zones). From getlayers 'Carousel Under The Radar', built as the HAZE scent shop"
metadata: 
  node_type: memory
  type: reference
  originSessionId: b399fce0-c957-4260-88d7-ceb021680ade
  modified: 2026-09-19T05:55:07.104Z
---

**Set 5: Orbit Fan.** Follows [[reference-cascade-deck-techniques]] (Set 4), [[reference-kimi-site-techniques]] (Set 3) and [[reference-3d-web-hero-techniques]] (Sets 1-2). Working example: `C:\Users\DELL\Documents\haze-scent-shop.html` (see [[project-cascade-deck-shop-pages]] for the other demo pages). Before shipping any build of this, run the delivery gate in [[feedback-ultimate-fix-prompt]] (test harness: `harness_playwright_cascade_template.js`).

**What it is:** cards laid out along the top arc of a big hidden circle, each rotated to face outward like a spread hand. One float `pos` says which card is at the top; changing `pos` rotates the whole wheel. No 3D/perspective needed, just 2D `rotate` + `translate`, so it is cheap (~60 fps).

**Use it for:** product shops, portfolios, testimonials, team members, gallery/reel sections — anything with 6-16 visual cards.

---

## 1. Minimal starter (copy, then restyle)

```html
<main class="stage" id="stage">
  <h1 class="headline">Big<br>Title</h1>          <!-- sits ABOVE cards (z-index 4), like the original -->
  <div class="wheel" id="wheel"></div>             <!-- cards are injected here -->
  <section class="panel" id="panel">…active item info + Add button…</section>
  <div class="ctl"><button id="prev">←</button><button id="next">→</button></div>
</main>
```
```css
html,body{height:100%;overflow:hidden;overscroll-behavior:none}
.stage{position:relative;height:100vh;height:100dvh;overflow:hidden;overflow:clip}  /* CLIP is mandatory, see gotchas */
.headline{position:absolute;z-index:4;top:clamp(48px,7vh,80px);right:3.4vw;text-align:right;pointer-events:none}
.wheel{position:absolute;inset:0;z-index:2;cursor:grab;touch-action:none}   /* touch-action:none = horizontal drag works on phones */
.wheel.drag{cursor:grabbing}
.card{position:absolute;left:0;top:0;border-radius:16px;overflow:hidden;will-change:transform,opacity;backface-visibility:hidden}
.panel{position:absolute;z-index:3;left:3.4vw;bottom:5vh}
.ctl{position:absolute;z-index:3;right:3.4vw;bottom:5vh}
@media(max-width:760px){ /* phone: headline top, fan mid, panel bottom, arrows top-right */ }
```

```js
const N = ITEMS.length, $ = id => document.getElementById(id);
const wheel = $("wheel");
const cards = ITEMS.map((it,i)=>{ const el=document.createElement("article"); el.className="card"; el.dataset.i=i;
  el.innerHTML = /* card art + label */ ""; wheel.appendChild(el); return el; });

/* ---------- geometry (recomputed on resize) ---------- */
let W,H,cw,ch,R,cx,cy,stepDeg,maxAng,pxPerCard,keep=[];
function layout(){
  W=innerWidth; H=innerHeight; const mobile=W<=760;
  ch=Math.max(150,Math.min(mobile?236:290,H*(mobile?.31:.34))); cw=ch*.72;          // card size from viewport
  R =mobile?Math.max(300,W*1.05):Math.max(430,Math.min(900,W*.64));                // wheel radius
  cx=mobile?W*.5:W*.40;  cy=(mobile?H*.44:H*.39)+R;                                 // circle centre (far below the fan)
  stepDeg=(cw*1.22/R)*180/Math.PI;                                                  // cards nearly touch
  maxAng=Math.min(92,(N/2)*stepDeg-3);                                              // hide beyond this (must be < half the ring)
  pxPerCard=R*stepDeg*Math.PI/180;                                                  // arc length per card → drag feels 1:1
  cards.forEach(c=>{c.style.width=cw+"px";c.style.height=ch+"px"});
  const rc=e=>{const r=e.getBoundingClientRect();return{l:r.left,r:r.right,t:r.top,b:r.bottom}};
  keep=[rc($("panel")),rc(document.querySelector(".ctl"))];                        // text zones cards must not cover
  lastKey=null;
}
const wrap=d=>((d+N/2)%N+N)%N-N/2;                                                 // shortest signed distance on the ring → endless

/* ---------- pose: one transform per card ---------- */
let pos=0,target=0,lastKey=null;
function place(){
  const key=pos+"|"+W+"|"+H; if(key===lastKey)return; lastKey=key;                 // skip when nothing moved
  cards.forEach((el,i)=>{
    const d=wrap(i-pos), ang=d*stepDeg, a=Math.abs(ang), rad=ang*Math.PI/180;
    const xc=cx+R*Math.sin(rad), yc=cy-R*Math.cos(rad);
    let op=a>=maxAng?0:Math.min(1,(maxAng-a)/10);                                    // fade at the ends
    for(const z of keep){                                                            // fade while overlapping UI text
      const ox=Math.min(xc+cw*.5,z.r)-Math.max(xc-cw*.5,z.l), oy=Math.min(yc+ch*.5,z.b)-Math.max(yc-ch*.5,z.t);
      if(ox>0&&oy>0)op*=Math.max(0,1-Math.min(ox,oy)/30);
    }
    if(op<=.01){el.style.visibility="hidden";return}
    el.style.visibility="visible"; el.style.opacity=op;
    el.style.zIndex=100-Math.round(Math.abs(d)*10);                                  // closest card on top
    el.style.transform=`translate3d(${cx}px,${cy}px,0) rotate(${ang}deg) translate3d(${-cw/2}px,${-R-ch/2}px,0) scale(${1+.1*Math.max(0,1-Math.abs(d))})`;
  });
}

/* ---------- motion: time-based ease to an integer; drag writes pos directly ---------- */
let dragging=false,last=performance.now(),userActive=false,idleAt=performance.now()+3800,hover=false;
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
function go(t){target=Math.round(t);userActive=true}
function frame(){
  const now=performance.now(),dt=Math.min(.5,(now-last)/1000);last=now;             // don't clamp dt tightly (slow PCs crawl)
  if(!dragging){
    pos=reduce.matches?target:pos+(target-pos)*(1-Math.exp(-dt*7.5));
    if(Math.abs(target-pos)<.003)pos=target;                                         // land EXACTLY on an integer
    if(!userActive&&!document.hidden&&now>idleAt&&!hover){target=Math.round(pos)+1;idleAt=now+3800}  // optional autoplay drift
  }
  place(); updatePanel();                                                            // updatePanel: index=((round(pos)%N)+N)%N
  requestAnimationFrame(frame);
}

/* ---------- pointer: drag + inertia + tap ---------- */
let lx=0,lt=0,vel=0,moved=0,downCard=null;
wheel.addEventListener("pointerdown",e=>{dragging=true;userActive=true;lx=e.clientX;lt=performance.now();vel=0;moved=0;
  downCard=e.target.closest(".card");wheel.setPointerCapture(e.pointerId);wheel.classList.add("drag")});
wheel.addEventListener("pointermove",e=>{
  if(dragging&&e.buttons===0)return endDrag();                                       // missed pointerup (Firefox touch emu)
  if(!dragging)return; const dx=e.clientX-lx,now=performance.now(); moved+=Math.abs(dx); lx=e.clientX;
  pos-=dx/pxPerCard; target=pos;
  vel=.8*vel+.2*(-dx/pxPerCard/Math.max(.001,(now-lt)/1000)); lt=now;               // smoothed velocity in cards/sec
});
function endDrag(){
  if(!dragging)return; dragging=false; wheel.classList.remove("drag");
  if(moved<6&&downCard){ go(Math.round(pos)+Math.round(wrap(+downCard.dataset.i-pos))) }   // tap → bring that card to top
  else { if(performance.now()-lt>90)vel=0; go(pos+Math.max(-4,Math.min(4,vel*.22))) }      // flick → coast then snap
}
["pointerup","pointercancel","lostpointercapture"].forEach(t=>wheel.addEventListener(t,endDrag));
addEventListener("pointerup",endDrag); addEventListener("blur",endDrag);              // never leave a drag stuck
wheel.addEventListener("mouseenter",()=>hover=true); wheel.addEventListener("mouseleave",()=>hover=false);

/* ---------- wheel notch / keys / buttons: one card per gesture ---------- */
let acc=0,cool=0,accT;
addEventListener("wheel",e=>{ if(e.target.closest(".drawer"))return; e.preventDefault();
  const now=performance.now(); if(now<cool)return;
  const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY; acc+=e.deltaMode===1?d*32:d;
  clearTimeout(accT); accT=setTimeout(()=>acc=0,120);
  if(Math.abs(acc)>=40){go(Math.round(target)+(acc>0?1:-1));acc=0;cool=now+420}       // cooldown swallows trackpad inertia
},{passive:false});
addEventListener("keydown",e=>{ if(["ArrowRight","ArrowDown"].includes(e.key)){e.preventDefault();go(Math.round(target)+1)}
                                 if(["ArrowLeft","ArrowUp"].includes(e.key)){e.preventDefault();go(Math.round(target)-1)} });
$("next").onclick=()=>go(Math.round(target)+1); $("prev").onclick=()=>go(Math.round(target)-1);

$("stage").addEventListener("scroll",e=>{e.target.scrollTop=0;e.target.scrollLeft=0});  // safety net
addEventListener("resize",layout); addEventListener("load",layout);
document.fonts&&document.fonts.ready.then(layout);                                       // keep-out rects depend on font metrics
layout(); requestAnimationFrame(frame);
```

---

## 2. Tuning knobs
| Knob | Effect |
|---|---|
| `R` (radius) | bigger = flatter arc, smaller = tighter fan |
| `1.22` in `stepDeg` | card spacing (1.0 = touching, 1.4 = airy) |
| `N` | keep `maxAng < (N/2)*stepDeg` or you see wrap-around pop-in; 10-14 cards works well |
| `cy` fraction (.39 / .44) | how high the active card sits |
| `dt*7.5` | settle speed |
| `vel*.22`, `±4` | fling distance in cards |
| `.1` in scale | how much the active card grows |
| autoplay `3800` ms | drift speed (or delete the line) |

## 3. Rules that made it pass the delivery gate
1. **`overflow:clip` on the stage** (with `overflow:hidden` fallback). Rotated hidden cards make the stage scroll-able (903px content in a 549px box); `hidden` still allows programmatic/focus scrolling → whole layout shifted up in one Firefox run. `clip` cannot scroll. Keep the scroll-reset listener too.
2. **Headline above the cards, not fading cards for it.** Fading cards near big type looked ghostly; the original lets cards pass behind the headline. Only fade for small UI (panel, arrows, hint).
3. **Drag end must be bullet-proof** (pointerup on window, lostpointercapture, blur, `buttons===0`) — Firefox touch emulation left drags stuck.
4. **Rest state always an exact integer** (snap in the loop) so nothing rests half-way.
5. **Time-based loop, not scroll-based** — same lesson as Set 4.
6. **Hide (`visibility:hidden`) cards beyond `maxAng`**; don't render 60 cards.
7. **Mobile:** `touch-action:none` on the wheel only (not body, or the cart drawer can't scroll); shrink `ch`, raise `R` to ~1.05×width, move the arrows top-right, hide description.
8. **Reduced motion:** jump straight to target.

## 4. How to test it (from the harness in the memory folder)
Assert exact numbers at every rest: active card centre (cx,cy) equals baseline ±2px, card width equal, page scroll = 0 **absolutely** (not only relative to a baseline), no overflow. Cases: 14 next + 14 prev clicks (wraps the ring both ways), keyboard, wheel notch, drag ≈2 cards, fast flick, tap a side card (find the click point with `elementFromPoint`, not the bounding-box centre — rotated boxes have empty corners), autoplay drifts then stops after first input, shop flow. Engines: Chromium + Firefox; viewports: 975x549@1.4, 1366x768, tablet 820x1180 touch, phone 390x844 touch; one CPU-4x run. **Run one config per tool call** (10-minute tool limit) and take best-of-2 for Firefox fps (noisy under load).

## 5. Not tested
Real phones/tablets (touch was emulated), Safari, the user's exact browser/GPU.
