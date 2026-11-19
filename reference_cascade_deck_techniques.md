---
name: reference-cascade-deck-techniques
description: "Technique Set 4 — 'Cascade Deck': stepped 3D card stack (cards fold over a crest and drop away), plus the perf/robustness rules that fixed its glitches. Reusable for shops, testimonials, portfolios, steps"
metadata: 
  node_type: memory
  type: reference
  originSessionId: b399fce0-c957-4260-88d7-ceb021680ade
  modified: 2026-09-19T03:15:46.621Z
---

**Set 4: the Cascade Deck.** Fourth technique set, after the soda/model-viewer sections in [[reference-3d-web-hero-techniques]] (Sets 1-2, incl. [[project_laocoon_page]]) and [[reference-kimi-site-techniques]] (Set 3). Source: `C:\Users\DELL\Documents\cards-cascade-shop.html`, a print-shop remake of the "Cards Cascade" demo on getlayers.ai (see [[project_cards_cascade_shop]] if written). Debugging story and the general fix prompt: [[feedback-ultimate-fix-prompt]].

**What it is:** a *pattern* (stepped 3D card stack) built from a few techniques: CSS 3D transforms + a pinned stage + a time-based animation loop + a pose function per card. Cards wait tilted at the back, the active card is upright at the crest, and passed cards fold forward, drop and fade. Nobody owns the name; "Cascade Deck" is our name for it.

### 1. Stage and deck markup
```css
html,body{height:100%;overflow:hidden;overscroll-behavior:none}   /* page does NOT scroll */
.stage{position:sticky;top:0;height:100vh;overflow:hidden;display:grid;grid-template-columns:1fr 1fr 90px;align-items:center}
.deck{position:relative;height:100vh;perspective:1400px;perspective-origin:50% 35%}
.card{position:absolute;left:50%;top:50%;width:min(300px,64vw);aspect-ratio:.86;
      margin:calc(min(300px,64vw)*-.43) 0 0 calc(min(300px,64vw)/-2);   /* centre without transform */
      border-radius:22px;overflow:hidden;will-change:transform,opacity;backface-visibility:hidden;
      box-shadow:0 24px 36px -22px rgba(0,0,0,.5)}                       /* light shadow: perf */
```
Centre the card with margins, not `translate(-50%,-50%)`, so the JS owns the whole `transform`.

### 2. The pose function (heart of the effect)
```js
const t = i - eff;                       // eff = animated fractional index of the active card
if (t >= 0) {                            // waiting behind: tilt back, rise, shrink
  const k = Math.min(t,1);
  tf = `translate3d(0,${-(t*vh*.05)-k*vh*.02}px,${-t*70}px) rotateX(${k*52+Math.max(0,t-1)*4}deg) scale(${1-Math.min(t,8)*.02})`;
  op = t>7 ? Math.max(0,1-(t-7)) : 1;  z = N - i;
} else {                                 // passed: fold toward viewer, drop, fade
  const u = -t;
  tf = `translate3d(0,${Math.min(u,4)*vh*.6}px,${Math.min(u,3)*40}px) rotateX(${-Math.min(u*38,45)}deg)`;
  op = Math.max(0,1-u*1.1);  z = N + i;
}
el.style.visibility = op<=.01 ? 'hidden' : 'visible';   // stop painting invisible cards
el.style.pointerEvents = Math.abs(t)<.4 ? 'auto' : 'none'; // only the front card is clickable
```
Passed cards get `z-index` above waiting ones so they fall *over* the pile. Cap `translateZ` well below `perspective` (singularity → sizes explode).

### 3. Stepped navigation instead of scroll-offset (the key robustness fix)
Never derive the pose from `scrollY`: scrolling can stop between two cards and leave a stretched half-fold, and Firefox smooth-scroll fights any snap code. Scroll/gestures only choose an integer `target`; time-based animation always lands on it.
```js
function goTo(i){ target = Math.max(0, Math.min(N-1, i)) }
addEventListener('wheel', e => {                      // one notch of intent = one card
  e.preventDefault(); const now = performance.now(); if (now < cool) return;
  acc += e.deltaMode===1 ? e.deltaY*32 : e.deltaY;
  clearTimeout(accT); accT = setTimeout(()=>acc=0,120);
  if (Math.abs(acc) >= 40) { goTo(target + (acc>0?1:-1)); acc = 0; cool = now + 420 }  // cooldown swallows trackpad inertia
},{passive:false});
// + touchstart/touchend swipe (>40px), ArrowKeys/PageUp/Down/Home/End/Space, rail-tick clicks, CTA button
```

### 4. Time-based animation loop (frame-rate independent)
```js
const dt = Math.min(.5, (now-last)/1000); last = now;        // do NOT clamp dt tightly (slow machines crawl)
active += (target-active) * (1 - Math.exp(-dt*7));           // exponential ease, dt-correct
if (Math.abs(target-active) < .004) active = target;          // snap so rest state is EXACT
if (eff === lastEff) { requestAnimationFrame(render); return } // skip style writes when idle
```

### 5. Progress rail + counter
Vertical 1px rail with an accent fill and knob positioned at `active/(N-1)*100%`; big italic counter shows `round(eff)+1`, vertical label shows the current product name. Ticks are 1px tall so give them a hit area: `.rail i::after{content:"";position:absolute;inset:-9px -12px}` (Firefox missed clicks otherwise).

### 6. Performance rules learned (cost ~6 fps → 60 fps)
- No `backdrop-filter` on many stacked cards; no big blurred shadows; keep `will-change` only on the cards.
- Hide fully-faded cards with `visibility:hidden`.
- Don't rewrite styles when the animated value hasn't changed.

### 7. Shop layer bolted on (reusable)
Cards are data-driven (`PRODUCTS` array: name, blurb, price, CSS-gradient art); "Add to cart" only on the front card; slide-in cart drawer with qty +/- and total; cart count pops on change; wheel handler ignores events over the open drawer. Art is pure CSS gradients (fits [[feedback_local_assets_preferred]]); swap `background` for `url(...)` to use real product photos.

### 8. Verification harness pattern (keep using it)
Playwright in the scratchpad, Chromium **and** Firefox, `deviceScaleFactor:1.4` + 975x549 viewport to mimic the user's 140% zoom. Loop every state and assert exact numbers (front card 349px tall, nothing stuck below, no cards taller than rest), sample per-frame rects during a transition, measure fps, spam wheel bursts, click rail/keys, screenshot rest + mid-transition + cart.
