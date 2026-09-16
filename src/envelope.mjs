import * as T from 'three';
import {openings,toLocal,toWorld} from './data/unifiedLayout.mjs';
import {gateOpenings} from './data/hondanRoute.mjs';
// Convex triangle minus a box: each rejected half-space is retained, only the
// intersection is removed. This handles cuts crossing original polygon edges.
export function subtractBox(poly,box){
 let pending=poly,output=[];
 for(const [axis,bound,sign] of [[0,box.x0,1],[0,box.x1,-1],[1,box.y0,1],[1,box.y1,-1],[2,box.z0,1],[2,box.z1,-1]]){
  if(!pending.length)break;
  const inner=[],outer=[];
  for(let i=0;i<pending.length;i++){
   const a=pending[i],b=pending[(i+1)%pending.length],da=(a[axis]-bound)*sign,db=(b[axis]-bound)*sign;
   (da>=-1e-9?inner:outer).push(a);
   if((da>1e-9&&db< -1e-9)||(da< -1e-9&&db>1e-9)){
    const t=da/(da-db),p=a.map((v,j)=>v+(b[j]-v)*t);inner.push(p);outer.push(p);
   }
  }
  if(outer.length>=3)output.push(outer);pending=inner;
 }
 return output;
}
export function surfaceTriangles(s,cut=true){
 const rings=s.rings.map(r=>r.slice(0,-1).map(p=>new T.Vector3(...p))),o=rings[0][0],normal=new T.Vector3();
 for(let i=0;i<rings[0].length;i++){const a=rings[0][i],b=rings[0][(i+1)%rings[0].length];normal.x+=(a.y-b.y)*(a.z+b.z);normal.y+=(a.z-b.z)*(a.x+b.x);normal.z+=(a.x-b.x)*(a.y+b.y);}
 if(normal.length()<1e-8)return [];normal.normalize();
 const u=new T.Vector3(normal.z,0,-normal.x);if(u.length()<.001)u.set(1,0,0);u.normalize();const v=normal.clone().cross(u);
 const flat=rings.map(r=>r.map(p=>new T.Vector2(p.clone().sub(o).dot(u),p.clone().sub(o).dot(v)))),all=rings.flat();
 let polygons=T.ShapeUtils.triangulateShape(flat[0],flat.slice(1)).map(f=>f.map(i=>{const p=all[i],l=toLocal(p.x,p.z);return [l.x,p.y,l.z];}));
 if(cut&&s.kind==='WallSurface')for(const box of [...openings,...gateOpenings]){
  polygons=polygons.flatMap(p=>{
   if(p.every(v=>v[0]<box.x0)||p.every(v=>v[0]>box.x1)||p.every(v=>v[1]<box.y0)||p.every(v=>v[1]>box.y1)||p.every(v=>v[2]<box.z0)||p.every(v=>v[2]>box.z1))return [p];
   return subtractBox(p,box);
  });
 }
 return polygons.flatMap(p=>Array.from({length:p.length-2},(_,i)=>[p[0],p[i+1],p[i+2]].map(v=>{const w=toWorld(v[0],v[2]);return [w.x,v[1],w.z];}))).filter(t=>new T.Triangle(...t.map(p=>new T.Vector3(...p))).getArea()>1e-9);
}
