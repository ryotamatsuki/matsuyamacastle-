import * as T from 'three';
import data from '../public/data/plateau-castle-lod2.json' with {type:'json'};
import {levels,stairs,start,toLocal,toWorld} from './data/unifiedLayout.mjs';
import {approachSurfaces,approachRamps,approachRetainingWalls} from './data/hondanRoute.mjs';
import {surfaceTriangles} from './envelope.mjs';
import {floorPieces,interiorParts} from './unifiedInterior.mjs';
export {floorPieces};
export const floors=levels.flatMap((_,i)=>floorPieces(i)),ramps=stairs;
export const walls=interiorParts().filter(p=>p.solid).map(p=>({x0:p.x-p.w/2,x1:p.x+p.w/2,z0:p.z-p.d/2,z1:p.z+p.d/2,y0:p.y-p.h/2,y1:p.y+p.h/2,name:p.name}));
const shell=data.surfaces.filter(s=>s.kind!=='GroundSurface').flatMap(s=>surfaceTriangles(s).map(t=>({triangle:new T.Triangle(...t.map(p=>new T.Vector3(...p))),box:new T.Box3().setFromPoints(t.map(p=>new T.Vector3(...p))),source:s.id})));
const courtyards=data.surfaces.find(s=>s.kind==='GroundSurface').rings.slice(1).map(r=>r.map(p=>[p[0],p[2]]));
export {courtyards};
function inside(x,z,ring){let c=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++)if((ring[i][1]>z)!==(ring[j][1]>z)&&x<(ring[j][0]-ring[i][0])*(z-ring[i][1])/(ring[j][1]-ring[i][1])+ring[i][0])c=!c;return c;}
function rampY(r,z){const t=Math.max(0,Math.min(1,(z-r.z0)/(r.z1-r.z0)));return r.y0+(r.y1-r.y0)*t;}
export function groundAt(x,z,maxY){
 const l=toLocal(x,z);let best=-Infinity;
 if(maxY>=9.2&&courtyards.some(r=>inside(x,z,r)))best=9.2;
 // Threshold bridges only wall thickness at the actual keep opening, no front staircase.
 if(Math.abs(l.x)<=1.3&&l.z>=9.3&&l.z<=11.4&&maxY>=9.2)best=9.2;
 // Evidence-bounded route surfaces. Only the official nine-step run is represented as
 // counted steps; the lower plaza rise is handled separately as a continuous grade.
 for(const a of approachSurfaces)if(l.x>=a.x0&&l.x<=a.x1&&l.z>=a.z0&&l.z<=a.z1&&a.y<=maxY+1e-7)best=Math.max(best,a.y);
 for(const r of approachRamps)if(l.x>=r.x0&&l.x<=r.x1&&l.z>=r.z0&&l.z<=r.z1){const y=rampY(r,l.z);if(y<=maxY+.2)best=Math.max(best,y);}
 for(const f of floors)if(l.x>=f.x0&&l.x<=f.x1&&l.z>=f.z0&&l.z<=f.z1&&f.y<=maxY)best=Math.max(best,f.y);
 for(const s of ramps){const t=(l.z-s.z0)/(s.z1-s.z0);if(Math.abs(l.x-s.x)<=s.width/2&&t>=0&&t<=1){const y=s.y0+(s.y1-s.y0)*t;if(y<=maxY)best=Math.max(best,y);}}
 return best;
}
const p=new T.Vector3(),closest=new T.Vector3();
export function blocked(x,y,z,r=.23){
 const l=toLocal(x,z);
 for(const b of walls){if(y+1.55<=b.y0||y+.08>=b.y1)continue;const nx=Math.max(b.x0,Math.min(l.x,b.x1)),nz=Math.max(b.z0,Math.min(l.z,b.z1));if((l.x-nx)**2+(l.z-nz)**2<r*r)return true;}
 // C-grade retaining masses are visible geometry and also solid to the walker. Their
 // sloping top follows the same data definition used by approach.mjs.
 for(const b of approachRetainingWalls){
  if(l.x<b.x0-r||l.x>b.x1+r||l.z<b.z0-r||l.z>b.z1+r)continue;
  const t=Math.max(0,Math.min(1,(l.z-b.z0)/(b.z1-b.z0))),top=b.top0+(b.top1-b.top0)*t;
  if(y+1.55>b.baseY&&y+.08<top)return true;
 }
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
