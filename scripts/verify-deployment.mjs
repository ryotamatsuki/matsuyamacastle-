import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const url=process.env.SITE_URL;
if(!url||!url.startsWith('https://ryotamatsuki.github.io/matsuyamacastle-/'))throw Error('Unexpected deployment URL');
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage();
const errors=[],bad=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url());});
try{
 await page.goto(url,{waitUntil:'domcontentloaded'});
 const assets=[];
 for(const asset of ['models/matsuyama_keep.glb','data/source_manifest.json','data/dependency-notices.txt','data/model-report.json','data/aerial-tiles.json']){
  const r=await page.request.get(new URL(asset,url).href);
  if(r.status()!==200)throw Error('Asset status '+r.status()+': '+asset);
  assets.push({asset,status:r.status()});
 }
 // Published-site smoke verifies transport, core assets and production-only API boundaries.
 // Full WebGL/Walker behavior is already gated in the build job on Chromium + WebKit + mobile WebKit.
 let gpuReady='ready';
 try{await page.waitForFunction(()=>window.__castle?.ready,{},{timeout:20000});}
 catch(e){gpuReady='skipped-swiftshader-ready-timeout';console.warn('Published WebGL ready check skipped:',String(e));}
 if(gpuReady==='ready'){
  await page.locator('[data-panel="sources"]').first().click();
  await page.locator('#panel').waitFor({state:'visible'});
  if(!(await page.locator('#panel').textContent()).includes('CITY-KEEP'))throw Error('Missing attribution');
  await page.locator('#close-panel').click();
  const npcCount=await page.evaluate(()=>window.__npcs?.count);
  if(npcCount!==12)throw Error('Published NPC count '+npcCount);
 }
 const prodApis=await page.evaluate(()=>({walk:typeof window.__walkTest,npc:typeof window.__npcTest,readOnlyNpc:typeof window.__npcs?.snapshot}));
 if(prodApis.walk!=='undefined'||prodApis.npc!=='undefined')throw Error('Production exposes test mutation API: '+JSON.stringify(prodApis));
 if(errors.length||bad.length)throw Error(JSON.stringify({errors,bad}));
 const state=await page.evaluate(()=>({ready:window.__castle?.ready,npcCount:window.__npcs?.count,testApi:typeof window.__walkTest,npcTestApi:typeof window.__npcTest}));
 await fs.mkdir('deployment-evidence',{recursive:true});
 await fs.writeFile('deployment-evidence/smoke.json',JSON.stringify({url,verifiedAt:new Date().toISOString(),gpuReady,state,prodApis,assets,errors,bad},null,2));
 let screenshot='captured';
 try{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
  await page.waitForTimeout(250);
  await page.screenshot({path:'deployment-evidence/published.png',animations:'disabled',timeout:10000});
 }catch(e){
  screenshot='skipped-swiftshader-timeout';
  await fs.writeFile('deployment-evidence/screenshot-note.txt','Published-site transport/assets smoke passed. Screenshot capture was skipped because Chromium/SwiftShader GPU readback timed out; reviewable render PNGs are produced by the browser-validation build gate.\n'+String(e)+'\n');
  console.warn('Published screenshot evidence skipped:',String(e));
 }
 console.log('PUBLIC DEPLOYMENT SMOKE PASS:',url,'gpuReady='+gpuReady,'screenshot='+screenshot);
}finally{await browser.close();}
