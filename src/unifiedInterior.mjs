import * as T from 'three';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {levels,stairs,openings,toWorld,frame,assumptions} from './data/unifiedLayout.mjs';
import {subtractBox} from './envelope.mjs';
export function floorPieces(i){
 const f=levels[i],w=f.width/2-f.thickness,d=f.depth/2-f.thickness,s=stairs[i-1];
 if(!s)return [{x0:-w,x1:w,z0:-d,z1:d,y:f.y}];
 const a=s.x-s.width/2-.12,b=s.x+s.width/2+.12,near=Math.min(s.z0,s.z1),far=Math.max(s.z0,s.z1);
 return [{x0:-w,x1:a,z0:-d,z1:d},{x0:b,x1:w,z0:-d,z1:d},{x0:a,x1:b,z0:-d,z1:near},{x0:a,x1:b,z0:far,z1:d}].map(p=>({...p,y:f.y}));
}
// Render and collision definitions are generated together, in the fitted keep frame.
export function interiorParts(){
 const parts=[];
 function box(name,material,x,y,z,w,h,d,solid=true){parts.push({name,material,x,y,z,w,h,d,solid});}
 box('EntranceThreshold','stone',0,9.1,10.3,2.6,.2,2,false);
 levels.forEach((f,i)=>{
  for(const p of floorPieces(i))box('Floor'+i,i?'wood':'stone',(p.x0+p.x1)/2,f.y-.10,(p.z0+p.z1)/2,p.x1-p.x0,.2,p.z1-p.z0,false);
  // Core axes follow the upper-tier facade; corridor widths adapt to real LOD2 extents.
  const cw=levels[3].width/2-.48,cd=levels[3].depth/2-.48,h=f.top-f.y;
  for(const x of [-cw,0,cw])for(const z of [-cd,cd])box('Columns_'+i,'wood',x,f.y+h/2,z,.3,h,.3);
  for(const z of [-cd,0,cd])box('ExposedBeams_'+i,'wood',0,f.top-.45,z,f.width-f.thickness*2,.34,.32,false);
  for(const x of [-cw,cw])box('ExposedBeams_'+i,'wood',x,f.top-.6,0,.28,.32,f.depth-f.thickness*2,false);
  // Low inner partitions with generous documented-as-inferred doorways.
  if(i>0)for(const sign of [-1,1]){
   box('InteriorPartitions_'+i,'plaster',sign*(cw+3.8)/2,f.y+1.5,0,cw-3.8,3,.16);
   box('PartitionLintel_'+i,'wood',0,f.y+2.7,0,2.2,.2,.2,false);
  }
  // Inner skin uses the same aperture volumes as the surveyed exterior shell.
  // Segmentation at all aperture edges prevents invisible collision across a window/door.
  for(const side of ['E','W','N','S']){
   const ew=side==='E'||side==='W',sign=side==='E'||side==='S'?1:-1;
   const pos=sign*(ew?f.width:f.depth)/2,extent=(ew?f.depth:f.width)/2;
   const related=openings.filter(o=>o.y0<f.top&&o.y1>f.y&&(ew?o.x0<=pos&&o.x1>=pos:o.z0<=pos&&o.z1>=pos));
   const cuts=[-extent,extent,...related.flatMap(o=>ew?[o.z0,o.z1]:[o.x0,o.x1])].filter(v=>v>=-extent&&v<=extent).sort((a,b)=>a-b);
   const ys=[f.y,f.top,...related.flatMap(o=>[Math.max(f.y,o.y0),Math.min(f.top,o.y1)])].sort((a,b)=>a-b);
   for(let a=0;a<cuts.length-1;a++)for(let b=0;b<ys.length-1;b++){
    const q=(cuts[a]+cuts[a+1])/2,y=(ys[b]+ys[b+1])/2;
    if(related.some(o=>y>o.y0&&y<o.y1&&q>(ew?o.z0:o.x0)&&q<(ew?o.z1:o.x1)))continue;
    if(cuts[a+1]-cuts[a]<.001||ys[b+1]-ys[b]<.001)continue;
    box('InnerWall_'+i,i?'plaster':'stone',ew?pos-sign*f.thickness/2:q,y,ew?q:pos-sign*f.thickness/2,ew?f.thickness:cuts[a+1]-cuts[a],ys[b+1]-ys[b],ew?cuts[a+1]-cuts[a]:f.thickness);
   }
  }
 });
 for(const [i,s] of stairs.entries()){
  for(const sign of [-1,1]){box('StairwellGuards'+i,'wood',s.x+sign*(s.width/2+.13),s.y1+.85,0,.09,.12,Math.abs(s.z1-s.z0),true);for(const z of [-3,0,3])box('StairwellPosts'+i,'wood',s.x+sign*(s.width/2+.13),s.y1+.43,z,.08,.86,.08,true);}
  const count=32,run=Math.abs(s.z1-s.z0),sign=Math.sign(s.z1-s.z0);
  for(let k=0;k<count;k++){const y=s.y0+(s.y1-s.y0)*(k+1)/count;box('VisitorStairs'+i,'wood',s.x,y-.08,s.z0+sign*run*(k+.5)/count,s.width,.16,run/count+.015,false);}
  for(const side of [-1,1])for(let k=0;k<24;k++){
   const t=(k+.5)/24,y=s.y0+(s.y1-s.y0)*t,z=s.z0+(s.z1-s.z0)*t;
   box('StairHandrails'+i,'wood',s.x+side*(s.width/2+.1),y+.8,z,.09,.12,run/24+.025,true);
   if(k%4===0)box('StairPosts'+i,'wood',s.x+side*(s.width/2+.1),y+.4,z,.08,.8,.08,true);
  }
 }
 for(const o of openings){
  const ew=o.id.includes('EW'),x=(o.x0+o.x1)/2,z=(o.z0+o.z1)/2,w=ew?o.z1-o.z0:o.x1-o.x0;
  for(const y of [o.y0,o.y1])box('ApertureReveal_'+o.id,'wood',x,y,z,ew?.22:w,.12,ew?w:.22,false);
  for(const side of [-1,1])box('ApertureJamb_'+o.id,'wood',ew?x:x+side*w/2,(o.y0+o.y1)/2,ew?z+side*w/2:z,.13,o.y1-o.y0,.13,false);
  if(o.type==='window')for(let k=1;k<5;k++)box('NurigomeLattice_'+o.id,'plaster',ew?x:o.x0+w*k/5,(o.y0+o.y1)/2,ew?o.z0+w*k/5:z,.045,o.y1-o.y0,.045,false);
 }
 return parts;
}
export function buildInterior(){
 const root=new T.Group();root.name='FittedInterior_C';root.userData={assumptions,sourceIds:['CITY-KEEP','WM-PD-INSIDE','WM-PD-TOP'],accuracy:'C geometry / B corroborated morphology'};
 const materials={};for(const [name,color] of Object.entries({wood:0x796047,stone:0x989384,plaster:0xe7dfcc})) {materials[name]=new T.MeshStandardMaterial({color,roughness:.9});materials[name].name=name;}
 const buckets=new Map();
 for(const p of interiorParts()){
  const g=new T.BoxGeometry(p.w,p.h,p.d),uv=g.attributes.uv;
  // Box UVs have physical repeats so the existing timber grain stays human-scale.
  for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*Math.max(p.w,p.d),uv.getY(i)*Math.max(.2,p.h));
  g.translate(p.x,p.y,p.z);g.rotateY(-frame.angle);g.translate(frame.x,0,frame.z);
  const key=p.name.split('_')[0]+':'+p.material;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(g.toNonIndexed());
 }
 for(const [key,list] of buckets){const [name,mat]=key.split(':'),mesh=new T.Mesh(mergeVertices(mergeGeometries(list)),materials[mat]);mesh.name=name+'_'+mat;mesh.userData={accuracy:'C fitted geometry',sourceIds:['CITY-KEEP','WM-PD-INSIDE','WM-PD-TOP','ORIGINAL']};root.add(mesh);}
 return root;
}
