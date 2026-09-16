import * as T from 'three';
import data from '../public/data/plateau-castle-lod2.json' with {type:'json'};
import {levels,stairs,start,toLocal,toWorld} from './data/unifiedLayout.mjs';
import {approachSurfaces} from './data/hondanRoute.mjs';
import {surfaceTriangles} from './envelope.mjs';
import {floorPieces,interiorParts} from './unifiedInterior.mjs';
export {floorPieces};
export const floors=levels.flatMap((_,i)=>floorPieces(i)),ramps=stairs;
export const walls=interiorParts().filter(p=>p.solid).map(p=>({x0:p.x-p.w/2,x1:p.x+p.w/2,z0:p.z-p.d/2,z1:p.z+p.d/2,y0:p.y-p.h/2,y1:p.y+p.h/2,name:p.name}));
const shell=data.surfaces.filter(s=>s.kind!=='GroundSurface').flatMap(s=>surfaceTriangles(s).map(t=>({triangle:new T.Triangle(...t.map(p=>new T.Vector3(...p))),box:new T.Box3().setFromPoints(t.map(p=>new T.Vector3(...p))),source:s.id})));
const courtyards=data.surfaces.find(s=>s.kind==='GroundSurface').rings.slice(1).map(r=>r.map(p=>[p[0],p[2]]));
export {courtyards};
function inside(x,z,ring){let c=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++)if((ring[i][1]>z)!==(ring[j][1]>z)&&x<(ring[j][0]-ring[i][0])*(z-ring[i][1])/(ring[j][1]-ring[i][1])+ring[i][0])c=!c;return c;}
export function groundAt(x,z,maxY){
 const l=toLocal(x,z);let best=-Infinity;
 if(maxY>=9.2&&courtyards.some(r=>inside(x,z,r)))best=9.2;
 // Threshold bridges only wall thickness at the actual keep opening, no front staircase.
 if(Math.abs(l.x)<=1.3&&l.z>=9.3&&l.z<=11.4&&maxY>=9.2)best=9.2;
 // Evidence-bounded but coordinate-inferred Hon-dan route. The same surfaces are rendered
 // into the GLB by approach.mjs, so collision and visible steps cannot drift apart.
 // Epsilon prevents binary floating-point error from rejecting an exactly 0.20m return step.
 for(const a of approachSurfaces)if(l.x>=a.x0&&l.x<=a.x1&&l.z>=a.z0&&l.z<=a.z1&&a.y<=maxY+1e-7)best=Math.max(best,a.y);
 for(const f of floors)if(l.x>=f.x0&&l.x<=f.x1&&l.z>=f.z0&&l.z<=f.z1&&f.y<=maxY)best=Math.max(best,f.y);
 for(const s of ramps){const t=(l.z-s.z0)/(s.z1-s.z0);if(Math.abs(l.x-s.x)<=s.width/2&&t>=0&&t<=1){const y=s.y0+(s.y1-s.y0)*t;if(y<=maxY)best=Math.max(best,y);}}
 return best;
}
const p=new T.Vector3(),closest=new T.Vector3();
export function blocked(x,y,z,r=.23){
 const l=toLocal(x,z);
 for(const b of walls){if(y+1.55<=b.y0||y+.08>=b.y1)continue;const nx=Math.max(b.x0,Math.min(l.x,b.x1)),nz=Math.max(b.z0,Math.min(l.z,b.z1));if((l.x-nx)**2+(l.z-nz)**2<r*r)return true;}
 for(const b of shell){
  if(x<b.box.min.x-r||x>b.box.max.x+r||z<b.box.min.z-r||z>b.box.max.z+r||y+1.6<b.box.min.y||y+.08>b.box.max.y)continue;
  for(const h of [.24,.64,1.04,1.4]){p.set(x,y+h,z);b.triangle.closestPointToPoint(p,closest);if(p.distanceToSquared(closest)<r*r)return true;}
 }
 return false;
}
export function initWorld(){} // immutable shared geometry
const D={start};
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
