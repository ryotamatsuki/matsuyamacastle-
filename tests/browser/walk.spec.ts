import {test,expect} from '@playwright/test';
test('load GLB, evidence, licence, continuous stairs, walls and inputs',async({page},info)=>{
 const errors:string[]=[];const bad:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url());});
 await page.goto('./');await page.waitForFunction(()=> (window as any).__castle?.ready);
 await expect(page.locator('#start')).toBeEnabled();
 await page.screenshot({path:'test-results/'+info.project.name+'-exterior.png'});
 await page.getByRole('button',{name:'出典・ライセンス',exact:true}).click();
 await expect(page.locator('#panel')).toBeVisible();
 await expect(page.locator('#panel')).toContainText('CITY-KEEP');
 await expect(page.locator('#panel')).toContainText('WM-PD-INSIDE');
 await expect(page.locator('#panel')).toContainText('WM-CCBY-COURTYARD-1');
 await expect(page.locator('#panel')).toContainText('CC BY 4.0');
 await expect(page.locator('#panel')).toContainText('モデル全体の正確なジオメトリはC');
 await page.locator('#close-panel').click();
 await page.getByRole('button',{name:'復元について',exact:true}).click();
 await expect(page.locator('#panel')).toContainText('B');
 await expect(page.locator('#panel')).toContainText('階段位置・方向');
 await expect(page.locator('#panel')).toContainText('Cのまま');
 await page.locator('#close-panel').click();
 await page.locator('#start').click();
 await expect.poll(()=>page.evaluate(()=> (window as any).__castle.state.active)).toBe(true);
 if(info.project.name.includes('mobile')){
 const joy=page.locator('#joystick'),b=(await joy.boundingBox())!;
 // Two simultaneous touch pointer streams through production handlers.
 await joy.dispatchEvent('pointerdown',{pointerId:11,pointerType:'touch',clientX:b.x+b.width/2,clientY:b.y+b.height/2});
 await joy.dispatchEvent('pointermove',{pointerId:11,pointerType:'touch',clientX:b.x+b.width/2,clientY:b.y+8});
 await page.locator('#look').dispatchEvent('pointerdown',{pointerId:12,pointerType:'touch',clientX:300,clientY:300});
 await page.locator('#look').dispatchEvent('pointermove',{pointerId:12,pointerType:'touch',clientX:320,clientY:305});
 await page.waitForTimeout(450);
 await joy.dispatchEvent('pointerup',{pointerId:11,pointerType:'touch'});await page.locator('#look').dispatchEvent('pointerup',{pointerId:12,pointerType:'touch'});
 const state=await page.evaluate(()=> (window as any).__castle.state);expect(state.z).toBeLessThan(31);expect(state.yaw).not.toBe(0);
 }else{
 await page.keyboard.down('KeyW');
 try { await expect.poll(()=>page.evaluate(()=> (window as any).__castle.state.z),{timeout:20000}).toBeLessThan(31); }
 finally { await page.keyboard.up('KeyW'); }
 }
 // Exercise the identical production Walker at fixed timestep; no floor teleports.
 await page.evaluate(()=>{
 const api=(window as any).__walkTest;api.reset();
 const route=[[0,23],[0,17],[0,5],[-3,5],[-3,3.3],[-3,-3.3],[3,-3.3],[3,3.3],[-3,3.3],[-3,-3.3],[0,-3.3],[0,3.4]];
 for(const [x,z] of route){let arrived=false;for(let i=0;i<2400;i++){const p=(window as any).__castle.state,dx=x-p.x,dz=z-p.z,n=Math.hypot(dx,dz);if(n<.035){arrived=true;break;}api.step(dx/n*2,dz/n*2,1/120);}if(!arrived)throw Error('Blocked route '+x+','+z);}
 });
 expect(await page.evaluate(()=> (window as any).__castle.state.y)).toBeCloseTo(10.8);
 await page.evaluate(()=> (window as any).__walkTest.look(0,0));
 await page.waitForTimeout(500);await page.screenshot({path:'test-results/'+info.project.name+'-interior.png'});
 await page.evaluate(()=>{const a=(window as any).__walkTest;for(let i=0;i<300;i++)a.step(8,0,.02);});
 expect(await page.evaluate(()=> (window as any).__castle.state.x)).toBeLessThan(5.4);
 expect(errors).toEqual([]);expect(bad).toEqual([]);
 const model=await page.request.get('models/matsuyama_keep.glb');expect(model.status()).toBe(200);
 const data=await model.body();expect(data.subarray(0,4).toString()).toBe('glTF');
 const manifest=await page.request.get('data/source_manifest.json');expect(manifest.status()).toBe(200);
 const sources=await manifest.json();expect(sources.some((s:any)=>s.id==='WM-PD-TOP'&&s.status==='admitted')).toBe(true);
 expect(sources.some((s:any)=>/BY-SA/.test(s.license)&&s.status!=='excluded')).toBe(false);
 const n=await page.request.get('data/dependency-notices.txt');expect(n.status()).toBe(200);
});
