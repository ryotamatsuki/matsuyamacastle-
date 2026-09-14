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
 await page.waitForFunction(()=>window.__castle?.ready,{},{timeout:60000});
 await page.locator('[data-panel="sources"]').first().click();
 await page.locator('#panel').waitFor({state:'visible'});
 if(!(await page.locator('#panel').textContent()).includes('CITY-KEEP'))throw Error('Missing attribution');
 await page.locator('#close-panel').click();
 await page.locator('#start').click();
 await page.waitForFunction(()=>window.__castle.state.active);
 await page.keyboard.down('KeyW');
 await page.waitForFunction(()=>window.__castle.state.z<31,{},{timeout:20000});
 await page.keyboard.up('KeyW');
 if(await page.evaluate(()=>typeof window.__walkTest!=='undefined'))throw Error('Production exposes test mutation API');
 for(const asset of ['models/matsuyama_keep.glb','data/source_manifest.json','data/dependency-notices.txt','data/model-report.json']){
  const r=await page.request.get(new URL(asset,url).href);
  if(r.status()!==200)throw Error('Asset status '+r.status()+': '+asset);
 }
 // Functional/public-site failures must fail before evidence capture; screenshot timeouts must not mask them.
 if(errors.length||bad.length)throw Error(JSON.stringify({errors,bad}));
 await fs.mkdir('deployment-evidence',{recursive:true});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
 await page.waitForTimeout(250);
 await page.screenshot({path:'deployment-evidence/published.png',animations:'disabled',timeout:60000});
 console.log('PUBLIC DEPLOYMENT SMOKE PASS:',url);
}finally{await browser.close();}
