const pw=require('playwright');
const snap=`(()=>{const cs=[...document.querySelectorAll('.card')];
 const vis=cs.map((c,i)=>({i,r:c.getBoundingClientRect(),o:parseFloat(c.style.opacity),v:c.style.visibility})).filter(x=>x.o>0.05&&x.v!=='hidden');
 const idx=+document.getElementById('n').textContent-1;const f=vis.find(x=>x.i===idx);
 return {idx,frontH:f&&Math.round(f.r.height),frontTop:f&&Math.round(f.r.top),maxH:Math.round(Math.max(...vis.map(x=>x.r.height))),maxW:Math.round(Math.max(...vis.map(x=>x.r.width))),below:vis.filter(x=>x.i<idx).length,n:vis.length,sy:scrollY}})()`;
async function run(name,type){
 const b=await type.launch();
 const ctx=await b.newContext({viewport:{width:975,height:549},deviceScaleFactor:1.4,hasTouch:false});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/cards-cascade-shop.html');await p.waitForTimeout(700);
 await p.mouse.move(600,300);
 let bad=0;
 const check=async(label,want)=>{await p.waitForFunction(()=>{const a=document.querySelector('.card');return true},null,{timeout:1000});await p.waitForTimeout(1800);const r=await p.evaluate(snap);
  const ok=r.idx===want&&r.frontH===349&&r.maxH===349&&r.maxW<=340&&r.below===0&&r.sy===0;
  if(!ok){bad++;console.log(name,label,'BAD',JSON.stringify(r))}return r};
 await check('start',0);
 // 10 wheel steps down, each must land exactly
 for(let i=1;i<=10;i++){await p.mouse.wheel(0,100);await check('down'+i,i)}
 // extra wheel at end stays
 await p.mouse.wheel(0,300);await check('end-clamp',10);
 // 10 up
 for(let i=9;i>=0;i--){await p.mouse.wheel(0,-100);await check('up'+i,i)}
 // inertia burst: many small wheel events should = 1 step per cooldown, not skip wildly, and end at rest
 for(let k=0;k<40;k++){await p.mouse.wheel(0,12);await p.waitForTimeout(16)}
 await p.waitForTimeout(1500);const burst=await p.evaluate(snap);console.log(name,'burst-end',JSON.stringify(burst));
 if(burst.frontH!==349||burst.maxH!==349)bad++;
 // keyboard + rail click + explore
 await p.keyboard.press('Home');await check('home',0);
 await p.keyboard.press('ArrowDown');await p.keyboard.press('ArrowDown');await check('2 keys',2);
 const bx=await p.evaluate(()=>{const r=document.querySelectorAll('#rail i')[7].getBoundingClientRect();return [r.x+2,r.y]});await p.mouse.click(bx[0],bx[1]+3);await check('rail',7);
 await p.keyboard.press('Home');await p.waitForTimeout(800);await p.click('#explore');await check('explore',1);
 // transition frame sampling: worst-case size/aspect while moving one step
 await p.keyboard.press('Home');await p.waitForTimeout(1200);
 const worst=await p.evaluate(()=>new Promise(res=>{let m=0,mw=0,f=0;
  const cs=[...document.querySelectorAll('.card')];
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown'}));window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown'}));
  (function loop(){cs.forEach(c=>{if(parseFloat(c.style.opacity)>.05&&c.style.visibility!=='hidden'){const r=c.getBoundingClientRect();m=Math.max(m,r.height);mw=Math.max(mw,r.width)}});
   if(++f<90)requestAnimationFrame(loop);else res({maxH:Math.round(m),maxW:Math.round(mw)})})()}));
 console.log(name,'worst frame during a step (rest=349x300):',JSON.stringify(worst));
 if(worst.maxH>420||worst.maxW>340)bad++;
 // screenshots: rest at 10, and mid-transition
 await p.keyboard.press('End');await p.waitForTimeout(1500);await p.screenshot({path:`${name}-end.png`});
 await p.keyboard.press('Home');await p.waitForTimeout(1300);
 await p.keyboard.press('ArrowDown');await p.waitForTimeout(160);await p.screenshot({path:`${name}-mid.png`});
 await p.waitForTimeout(1200);
 // cart
 await p.click('.card:nth-child(2) .add');await p.click('#openCart');await p.waitForTimeout(600);await p.screenshot({path:`${name}-cart.png`});
 console.log(name,'cart count',await p.evaluate(()=>document.getElementById('cnt').textContent),'errors',errs,'BAD COUNT',bad);
 await b.close();
}
(async()=>{await run('chromium',pw.chromium);await run('firefox',pw.firefox)})();
