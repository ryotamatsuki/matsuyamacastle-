import fs from 'node:fs/promises';
import path from 'node:path';
const lock=JSON.parse(await fs.readFile('package-lock.json','utf8'));
let text='THIRD-PARTY SOFTWARE — exact installed lockfile inventory\nNo third-party image, font or model assets are bundled.\n\n';
const inventory=[];
for(const [dir,meta] of Object.entries(lock.packages)){
 if(!dir||!dir.includes('node_modules/'))continue;
 let pkg;try{pkg=JSON.parse(await fs.readFile(path.join(dir,'package.json'),'utf8'));}catch{continue;}
 inventory.push({name:pkg.name,version:pkg.version,license:pkg.license||meta.license||'UNDECLARED'});
 text+='\n=== '+pkg.name+' '+pkg.version+' | '+JSON.stringify(pkg.license||meta.license)+' ===\n';
 const names=await fs.readdir(dir);let found=false;
 for(const name of names.filter(n=>/^(license|licence|notice|copying)(\.|$)/i.test(n))){try{text+='\n'+name+'\n'+await fs.readFile(path.join(dir,name),'utf8')+'\n';found=true;}catch{}}
 if(!found)text+='No root licence file: declared licence above; review package before redistribution.\n';
}
await fs.mkdir('public/data',{recursive:true});
await fs.writeFile('public/data/dependency-notices.txt',text);
await fs.writeFile('public/data/dependency-inventory.json',JSON.stringify(inventory,null,2));
const runtime=inventory.find(p=>p.name==='three');
if(!runtime||runtime.license!=='MIT')throw Error('Unexpected Three.js licence');
