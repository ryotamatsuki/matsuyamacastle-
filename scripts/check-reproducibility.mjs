import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
for(const [p,script] of [['public/models/matsuyama_keep.glb','scripts/build-castle-model.mjs'],['public/models/matsuyama_plateau_lod2.glb','scripts/build-plateau-model.mjs']]){
 const first=await fs.readFile(p);
 execFileSync(process.execPath,[script],{stdio:'inherit'});
 const second=await fs.readFile(p);
 if(!first.equals(second))throw Error(p+' regeneration is not byte reproducible');
 console.log(p+' byte-identical SHA-256:',createHash('sha256').update(second).digest('hex'));
}
