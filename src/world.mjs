import {dimensions as D} from './data/castleDimensions.mjs';
export const walls=[],floors=[],ramps=[];
export function rect(x,z,w,d,y,name=''){const a={x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,y,name};floors.push(a);return a;}
export function wall(x,y,z,w,h,d,name=''){walls.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,y0:y-h/2,y1:y+h/2,name});}
export function holeFor(i){if(!i)return null;const s=D.stairs[i-1];return {x0:s.x-s.width/2-.1,x1:s.x+s.width/2+.1,z0:Math.min(s.z0,s.z1),z1:Math.max(s.z0,s.z1)};}
export function floorPieces(i){
 const f=D.floors[i],h=holeFor(i),x=f.width/2,z=f.depth/2;
 if(!h)return [{x0:-x,x1:x,z0:-z,z1:z,y:f.y,name:f.name}];
 return [
 {x0:-x,x1:h.x0,z0:-z,z1:z},{x0:h.x1,x1:x,z0:-z,z1:z},
 {x0:h.x0,x1:h.x1,z0:-z,z1:h.z0},{x0:h.x0,x1:h.x1,z0:h.z1,z1:z}
 ].map(r=>({...r,y:f.y,name:f.name}));
}
export function initWorld(){
 walls.length=0;floors.length=0;ramps.length=0;
 // Honmaru and courtyard: independent interpretive layout, not a survey.
 rect(0,30,48,24,-4,'本丸広場');
 rect(0,12,30,12,0,'天守丸・内庭');
 ramps.push({x:0,width:3,z0:22,z1:18,y0:-4,y1:0,name:'天守丸への階段'});
 D.floors.forEach((f,i)=>{
 floors.push(...floorPieces(i));
 const h=3.6,w=f.width,d=f.depth,th=.32;
 wall(-w/2,f.y+h/2,0,th,h,d,'西壁');wall(w/2,f.y+h/2,0,th,h,d,'東壁');
 wall(0,f.y+h/2,-d/2,w,h,th,'北壁');
 if(i===0){const seg=(w-2.6)/2;wall(-(2.6+seg)/2,f.y+h/2,d/2,seg,h,th,'入口左');wall((2.6+seg)/2,f.y+h/2,d/2,seg,h,th,'入口右');}
 else wall(0,f.y+h/2,d/2,w,h,th,'南壁');
 // Aligned structural corner/intermediate columns, leave central route open.
 for(const x of [-D.coreWidth/2,0,D.coreWidth/2])for(const z of [-D.coreDepth/2,D.coreDepth/2])
 wall(x,f.y+1.65,z,.28,3.3,.28,'柱');
 const incoming=i?D.stairs[i-1]:null;
 if(incoming)for(const dx of [-1,1])wall(incoming.x+dx*(incoming.width/2+.16),f.y+.5,0,.14,1,5.9,'階段開口手摺');
 });
 for(const s of D.stairs){ramps.push({...s,name:'後補を表現した推定階段'});for(let j=0;j<20;j++){const t=(j+.5)/20,y=s.y0+(s.y1-s.y0)*t;for(const dx of [-1,1])wall(s.x+dx*(s.width/2+.16),y+.55,s.z0+(s.z1-s.z0)*t,.12,1.1,Math.abs(s.z1-s.z0)/20+.01,'階段側面手摺');}}
 // Interpretive auxiliary keep volumes. Solid excluded interiors, matching visible envelopes.
 for(const b of [{x:-11,z:10,w:5,d:7,h:7},{x:11,z:10,w:5,d:7,h:5},{x:-6,z:15.5,w:7,d:3,h:3},{x:6,z:15.5,w:7,d:3,h:3}])wall(b.x,b.h/2,b.z,b.w,b.h,b.d,'付属棟（外観のみ・推定）');
 // Retaining edges prevent stepping off the high courtyard.
 wall(-15,-.7,12,.3,1.4,12,'内庭端');wall(15,-.7,12,.3,1.4,12,'内庭端');
 for(const x of [-8.35,8.35])wall(x,.5,17.8,13.3,1,.2,'内庭手摺');
 for(const x of [-1.7,1.7])for(let j=0;j<20;j++){let t=(j+.5)/20;wall(x,-4+4*t+.5,22-4*t,.16,1,.25,'外階段手摺');}
}
export function groundAt(x,z,maxY){
 let best=-Infinity;
 for(const f of floors)if(x>=f.x0&&x<=f.x1&&z>=f.z0&&z<=f.z1&&f.y<=maxY)best=Math.max(best,f.y);
 for(const s of ramps){const t=(z-s.z0)/(s.z1-s.z0);if(Math.abs(x-s.x)<=s.width/2&&t>=0&&t<=1){const y=s.y0+(s.y1-s.y0)*t;if(y<=maxY)best=Math.max(best,y);}}
 return best;
}
export function blocked(x,y,z,r=.23){
 for(const b of walls){if(y+1.55<=b.y0||y+.08>=b.y1)continue;
 const nx=Math.max(b.x0,Math.min(x,b.x1)),nz=Math.max(b.z0,Math.min(z,b.z1));
 if((x-nx)**2+(z-nz)**2<r*r)return true;
 }return false;
}
export class Walker{
 x=0;y=0;z=0;vy=0;
 constructor(){this.reset();}
 reset(){this.x=D.start.x;this.y=D.start.y;this.z=D.start.z;this.vy=0;}
 step(dx,dz,dt){
 // Small fixed substeps stop tunnelling; ramp support shares the model definition.
 const n=Math.max(1,Math.ceil(dt/.008));dt/=n;
 for(let j=0;j<n;j++){
 for(const axis of ['x','z']){
 const nx=this.x+(axis==='x'?dx*dt:0),nz=this.z+(axis==='z'?dz*dt:0);
 const g=groundAt(nx,nz,this.y+.2);
 // Explicit fall protection: refuse walking out of navigable areas or over openings.
 if(!Number.isFinite(g)||g<this.y-.35)continue;
 const ny=Math.max(this.y,g);
 if(!blocked(nx,ny,nz)){this.x=nx;this.z=nz;if(g>this.y)this.y=g;}
 }
 const g=groundAt(this.x,this.z,this.y+.2);
 this.vy-=9.81*dt;this.y+=this.vy*dt;
 if(Number.isFinite(g)&&this.y<=g){this.y=g;this.vy=0;}
 if(!Number.isFinite(this.y)||this.y<-12)this.reset();
 }
 }
}
initWorld();
