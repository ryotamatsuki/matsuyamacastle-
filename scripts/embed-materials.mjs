import fs from 'node:fs/promises';
// Embed our generated maps into GLB after export. This keeps normal glTF PBR
// materials portable without browser-only shader hooks or Node canvas shims.
export async function embedMaterials(input){
 const raw=Buffer.from(input),jl=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+jl));
 const binary=raw.subarray(28+jl,28+jl+raw.readUInt32LE(20+jl));
 const chunks=[binary];let length=binary.length;
 const padded=b=>{const p=Buffer.alloc((4-b.length%4)%4);return Buffer.concat([b,p]);};
 doc.images=[];doc.textures=[];doc.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];
 const families={wood:'timber',edge:'timber',black:'timber',plaster:'plaster',stone:'stone',stone2:'stone',roof:'ceramic',tile:'ceramic',ground:'earth',iron:'iron',tatami:'timber'};
 const cache=new Map();
 async function texture(family,kind){
  const key=family+'-'+kind;if(cache.has(key))return cache.get(key);
  const bytes=await fs.readFile('public/textures/'+key+'.png');const view=doc.bufferViews.length;
  doc.bufferViews.push({buffer:0,byteOffset:length,byteLength:bytes.length});const chunk=padded(bytes);chunks.push(chunk);length+=chunk.length;
  const index=doc.textures.length;doc.images.push({bufferView:view,mimeType:'image/png',name:key,extras:{sourceId:'ORIGINAL',license:'CC BY 4.0',method:'mathematical synthesis; no source photo pixels'}});
  doc.textures.push({sampler:0,source:doc.images.length-1});cache.set(key,index);return index;
 }
 for(const m of doc.materials){
  const family=families[m.name];if(!family)continue;
  m.pbrMetallicRoughness.baseColorTexture={index:await texture(family,'color')};
  m.pbrMetallicRoughness.metallicRoughnessTexture={index:await texture(family,'roughness')};
  m.pbrMetallicRoughness.roughnessFactor=1;
  m.normalTexture={index:await texture(family,'normal'),scale:family==='timber'?.65:family==='stone'?1:.45};
  m.extras={...m.extras,textureSource:'ORIGINAL',license:'CC BY 4.0'};
 }
 doc.buffers[0].byteLength=length;
 const json=padded(Buffer.from(JSON.stringify(doc)));for(let i=Buffer.byteLength(JSON.stringify(doc));i<json.length;i++)json[i]=32;
 const header=Buffer.alloc(20);header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);
 const binHeader=Buffer.alloc(8);binHeader.writeUInt32LE(length);binHeader.writeUInt32LE(0x004e4942,4);
 return Buffer.concat([header,json,binHeader,...chunks]);
}
