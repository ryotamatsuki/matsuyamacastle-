import {test,expect} from '@playwright/test';

function watchPage(page:any){
 const errors:string[]=[];const bad:string[]=[];
 page.on('pageerror',(e:Error)=>errors.push(e.message));
 page.on('console',(m:any)=>{if(m.type()==='error')errors.push(m.text());});
 page.on('response',(r:any)=>{if(r.status()>=400)bad.push(r.status()+' '+r.url());});
 return {errors,bad};
}

test('single PLATEAU model remains loaded between orbit and walking',async({page},info)=>{
 const {errors,bad}=watchPage(page);
 await page.goto('./');
 await page.waitForFunction(()=> (window as any).__castle?.ready);
 await page.getByRole('button',{name:'連立天守群を見渡す',exact:true}).click();
 await expect(page.getByRole('button',{name:'初期視点に戻す',exact:true})).toBeVisible({timeout:60000});
 await page.waitForFunction(()=>{const s=(window as any).__castle?.state;return s?.surveyReady&&s?.surveyMode;},{timeout:60000});
 await expect(page.locator('#load-status')).toContainText('PLATEAU連立天守群');
 await page.screenshot({path:'test-results/'+info.project.name+'-plateau.png'});
 await page.getByRole('button',{name:'初期視点に戻す',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=> (window as any).__castle.state.surveyMode)).toBe(false);
 await page.screenshot({path:'test-results/'+info.project.name+'-exterior.png'});
 expect(errors).toEqual([]);expect(bad).toEqual([]);
});

test('evidence, licence, production input and rendered interior',async({page},info)=>{
 test.setTimeout(120000);
 const {errors,bad}=watchPage(page);
 await page.goto('./');await page.waitForFunction(()=> (window as any).__castle?.ready);
 await expect(page.locator('#start')).toBeEnabled();
 await page.getByRole('button',{name:'出典・ライセンス',exact:true}).click();
 await expect(page.locator('#panel')).toBeVisible();
 await expect(page.locator('#panel')).toContainText('CITY-KEEP');
 await expect(page.locator('#panel')).toContainText('CITY-PHOTO-KEEP');
 await expect(page.locator('#panel')).toContainText('PLATEAU-2020');
 await expect(page.locator('#panel')).toContainText('WM-PD-INSIDE');
 await expect(page.locator('#panel')).toContainText('WM-CCBY-COURTYARD-1');
 await expect(page.locator('#panel')).toContainText('CC BY 4.0');
 await expect(page.locator('#panel')).toContainText('内部の正確なジオメトリはC');
 await page.locator('#close-panel').click();
 await page.getByRole('button',{name:'復元について',exact:true}).click();
 await expect(page.locator('#panel')).toContainText('B');
 await expect(page.locator('#panel')).toContainText('階段位置・方向');
 await expect(page.locator('#panel')).toContainText('Cのまま');
 await page.locator('#close-panel').click();
 await page.locator('#start').click();
 await expect(page.locator('#welcome')).toBeHidden();
 await expect(page.locator('#pause')).toBeVisible();
 expect(await page.evaluate(()=> (window as any).__castle.state.active)).toBe(true);
 if(info.project.name.includes('mobile')){
  const joy=page.locator('#joystick'),b=(await joy.boundingBox())!;
  await joy.dispatchEvent('pointerdown',{pointerId:11,pointerType:'touch',clientX:b.x+b.width/2,clientY:b.y+b.height/2});
  await joy.dispatchEvent('pointermove',{pointerId:11,pointerType:'touch',clientX:b.x+b.width/2,clientY:b.y+8});
  await page.locator('#look').dispatchEvent('pointerdown',{pointerId:12,pointerType:'touch',clientX:300,clientY:300});
  await page.locator('#look').dispatchEvent('pointermove',{pointerId:12,pointerType:'touch',clientX:320,clientY:305});
  await page.waitForTimeout(450);
  await joy.dispatchEvent('pointerup',{pointerId:11,pointerType:'touch'});await page.locator('#look').dispatchEvent('pointerup',{pointerId:12,pointerType:'touch'});
  const state=await page.evaluate(()=> (window as any).__castle.state);expect(state.z).toBeLessThan(7.7786);expect(state.yaw).not.toBe(0);
 }else{
  await page.keyboard.down('KeyW');
  try { await expect.poll(()=>page.evaluate(()=> (window as any).__castle.state.z),{timeout:20000}).toBeLessThan(7.7786); }
  finally { await page.keyboard.up('KeyW'); }
 }
 // Rendering evidence is intentionally independent of the long route simulation.
 // VITE_TEST-only mutation puts the production camera/player on the top floor without claiming a physical route measurement.
 await page.evaluate(()=>{const a=(window as any).__walkTest;const w=a.toWorld(0,-2);a.set(w.x,21.8,w.z);a.look(0,0);});
 await page.waitForTimeout(500);
 // Chromium SwiftShader can block indefinitely on any explicit GPU framebuffer readback.
 // Use Three's renderer call count to prove the production render loop is drawing there; WebKit projects persist human-reviewable interior PNG evidence.
 await expect.poll(()=>page.evaluate(()=> (window as any).__castle.state.meshes),{timeout:10000}).toBeGreaterThan(0);
 if(!info.project.name.includes('chromium'))await page.screenshot({path:'test-results/'+info.project.name+'-interior.png'});
 expect(await page.evaluate(()=> (window as any).__castle.state.y)).toBeCloseTo(21.8);
 expect(errors).toEqual([]);expect(bad).toEqual([]);
 const loadedKeep=await page.evaluate(()=>performance.getEntriesByType('resource').some((e:any)=>e.name.includes('/models/matsuyama_keep.glb')));
 expect(loadedKeep).toBe(true);
 expect(await page.evaluate(()=>performance.getEntriesByType('resource').filter((e:any)=>e.name.includes('/models/')).map((e:any)=>e.name.split('/').pop()))).toEqual(['matsuyama_keep.glb']);
 await expect(page.locator('#map-credit')).toContainText('国土地理院');
 const manifest=await page.request.get('data/source_manifest.json');expect(manifest.status()).toBe(200);
 const sources=await manifest.json();expect(sources.some((s:any)=>s.id==='WM-PD-TOP'&&s.status==='admitted')).toBe(true);
 expect(sources.some((s:any)=>/BY-SA/.test(s.license)&&s.status!=='excluded')).toBe(false);
 const n=await page.request.get('data/dependency-notices.txt');expect(n.status()).toBe(200);
});

test('continuous production Walker route and third-floor wall constraint',async({page})=>{
 test.setTimeout(90000);
 const {errors,bad}=watchPage(page);
 await page.goto('./');await page.waitForFunction(()=> (window as any).__castle?.ready);
 const result=await page.evaluate(()=>{
  const api=(window as any).__walkTest;api.start();api.reset();
  const route=[[0,8],[-2.8,8],[-2.8,4.5],[-2.8,-4.8],[2.8,-4.8],[2.8,-4.5],[2.8,4.8],[-2.8,4.8],[-2.8,4.5],[-2.8,-4.8],[0,-4.8],[0,-2]].map(([x,z])=>{const p=api.toWorld(x,z);return [p.x,p.z];});
  for(const [x,z] of route){
   let arrived=false;
   for(let i=0;i<2400;i++){
    const p=(window as any).__castle.state,dx=x-p.x,dz=z-p.z,n=Math.hypot(dx,dz);
    if(n<.035){arrived=true;break;}
    api.step(dx/n*2,dz/n*2,1/120);
   }
   if(!arrived)throw Error('Blocked route '+x+','+z);
  }
  const topY=(window as any).__castle.state.y;
  for(let i=0;i<300;i++)api.step(8,0,.02);
  const final=(window as any).__castle.state;
  return {topY,x:final.x,z:final.z};
 });
 expect(result.topY).toBeCloseTo(21.8);
 expect(result.x).toBeLessThan(7.4);
 expect(errors).toEqual([]);expect(bad).toEqual([]);
});
