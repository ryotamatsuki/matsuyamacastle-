import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const p='public/models/matsuyama_keep.glb';
const first=await fs.readFile(p);
execFileSync(process.execPath,['scripts/build-castle-model.mjs'],{stdio:'inherit'});
const second=await fs.readFile(p);
if(!first.equals(second))throw Error('GLB regeneration is not byte reproducible');
console.log('Byte-identical GLB SHA-256:',createHash('sha256').update(second).digest('hex'));
