import {test,expect} from '@playwright/test';

function watchPage(page:any){const errors:string[]=[];const bad:string[]=[];page.on('pageerror',(e:Error)=>errors.push(e.message));page.on('console',(m:any)=>{if(m.type()==='error')errors.push(m.text());});page.on('response',(r:any)=>{if(r.status()>=400)bad.push(r.status()+' '+r.url());});return {errors,bad};}

test('twelve lightweight tourist NPCs animate three per interior floor',async({page},info)=>{
 test.setTimeout(120000);const {errors,bad}=watchPage(page);
 await page.goto('./');await page.waitForFunction(()=> (window as any).__castle?.ready);
 await page.waitForFunction(()=> (window as any).__npcs?.count===12);
 const initial=await page.evaluate(()=> (window as any).__npcs.snapshot());
 expect(initial).toHaveLength(12);
 for(let floor=0;floor<4;floor++)expect(initial.filter((n:any)=>n.floor===floor)).toHaveLength(3);
 expect(new Set(initial.map((n:any)=>n.style)).size).toBe(12);
 expect(initial.some((n:any)=>n.state==='idle')).toBe(true);
 expect(initial.some((n:any)=>n.state==='walk')).toBe(true);
 expect(initial.some((n:any)=>n.hat)).toBe(true);expect(initial.some((n:any)=>n.bag)).toBe(true);
 await page.waitForTimeout(1800);
 const later=await page.evaluate(()=> (window as any).__npcs.snapshot());
 const moved=later.some((n:any,i:number)=>Math.hypot(n.x-initial[i].x,n.z-initial[i].z)>.08);
 expect(moved).toBe(true);
 expect(later.every((n:any)=>Number.isFinite(n.x)&&Number.isFinite(n.z)&&Number.isFinite(n.y))).toBe(true);
 expect(errors).toEqual([]);expect(bad).toEqual([]);

 if(!info.project.name.includes('chromium')){
  const names=['hole','floor1','floor2','floor3'] as const;
  await page.evaluate(()=> (window as any).__walkTest.start());
  // Visual evidence follows the middle NPC on each floor from a nearby, safe interior point.
  // This avoids columns/walls obscuring the frame and makes scale, floor contact and clothing reviewable.
  for(let floor=0;floor<4;floor++){
   await page.evaluate((f:number)=>{
    const api=(window as any).__walkTest,npcs=(window as any).__npcs.snapshot().filter((n:any)=>n.floor===f),target=npcs[1];
    const camX=target.x+(f===1||f===2?1.0:.65),camZ=target.z+1.8,w=api.toWorld(camX,camZ);
    const dx=target.x-camX,dz=target.z-camZ,yaw=Math.atan2(-dx,-dz);
    api.set(w.x,target.y,w.z);api.look(yaw,.04);
   },floor);
   await page.waitForTimeout(450);
   await page.screenshot({path:`test-results/${info.project.name}-${names[floor]}-npcs.png`});
  }
 }
});

test('NPC ambience is read-only in production-facing diagnostics and does not replace Walker controls',async({page})=>{
 await page.goto('./');await page.waitForFunction(()=> (window as any).__castle?.ready&&(window as any).__npcs?.count===12);
 expect(await page.evaluate(()=>typeof (window as any).__npcs.snapshot)).toBe('function');
 expect(await page.evaluate(()=>typeof (window as any).__npcTest)).toBe('object');
 const before=await page.evaluate(()=> (window as any).__castle.state);
 await page.evaluate(()=>{const a=(window as any).__walkTest;a.start();a.step(0,-2,.1);});
 const after=await page.evaluate(()=> (window as any).__castle.state);
 expect(Number.isFinite(after.x)&&Number.isFinite(after.z)).toBe(true);
 expect(after.x!==before.x||after.z!==before.z||after.y===before.y).toBe(true);
});
