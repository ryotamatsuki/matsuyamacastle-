import fs from 'node:fs/promises';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {buildCastle} from '../src/castle.mjs';
// GLTFExporter uses FileReader for Blob buffers; Node provides Blob but not FileReader.
globalThis.FileReader=class{
 readAsArrayBuffer(blob){blob.arrayBuffer().then(v=>{this.result=v;this.onloadend?.({target:this});}).catch(e=>this.onerror?.(e));}
 readAsDataURL(blob){blob.arrayBuffer().then(v=>{this.result='data:'+blob.type+';base64,'+Buffer.from(v).toString('base64');this.onloadend?.({target:this});}).catch(e=>this.onerror?.(e));}
};
const model=buildCastle();
const glb=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});
await fs.mkdir('public/models',{recursive:true});
await fs.writeFile('public/models/matsuyama_keep.glb',Buffer.from(glb));
console.log('Generated matsuyama_keep.glb:',glb.byteLength,'bytes;',model.children.length,'merged meshes');
