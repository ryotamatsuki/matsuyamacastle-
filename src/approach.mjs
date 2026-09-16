import * as T from 'three';
import {approachSurfaces,approachRamps,approachRetainingWalls,routeEvidence,documentedNineSteps,mainPlaza} from './data/hondanRoute.mjs';
import {toWorld} from './data/unifiedLayout.mjs';

function prismGeometry({x0,x1,z0,z1,bottom0,bottom1,top0,top1}){
 const local=[
  [x0,bottom0,z0],[x1,bottom0,z0],[x1,bottom1,z1],[x0,bottom1,z1],
  [x0,top0,z0],[x1,top0,z0],[x1,top1,z1],[x0,top1,z1]
 ];
 const faces=[
  [0,2,1],[0,3,2],
  [4,5,6],[4,6,7],
  [0,1,5],[0,5,4],
  [3,7,6],[3,6,2],
  [0,4,7],[0,7,3],
  [1,2,6],[1,6,5]
 ];
 const positions=[],uv=[];
 for(const f of faces)for(const i of f){
  const [x,y,z]=local[i],p=toWorld(x,z);positions.push(p.x,y,p.z);uv.push(x*.22,z*.22);
 }
 const g=new T.BufferGeometry();
 g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
 g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
 g.computeVertexNormals();return g;
}

export function buildApproach(){
 const root=new T.Group();root.name='HondanToHonmaruApproach_C';
 root.userData={accuracy:'B route relationships / C coordinates, terrain closure and sidewall geometry',sourceIds:routeEvidence.sourceIds,evidence:'public/data/hondan-route-evidence.json'};
 const stone=new T.MeshStandardMaterial({name:'ApproachStone_C',color:0x989285,roughness:.98});
 const threshold=new T.MeshStandardMaterial({name:'GateThreshold_C',color:0x6d675b,roughness:.94});
 const plazaName=mainPlaza.name;
 for(const a of approachSurfaces){
  if(a.name===plazaName||a.render===false)continue;
  const w=a.x1-a.x0,d=a.z1-a.z0,cx=(a.x0+a.x1)/2,cz=(a.z0+a.z1)/2,p=toWorld(cx,cz);
  const h=a.step?Math.min(.16,Math.max(.08,a.stepCount===9?.12:.10)):.10;
  const g=new T.BoxGeometry(w,h,d);g.rotateY(-.015);g.translate(p.x,a.y-h/2,p.z);
  const isThreshold=a.name.startsWith('筋鉄門')||a.name.startsWith('一ノ門敷');
  const mesh=new T.Mesh(g,isThreshold?threshold:stone);mesh.name=a.name;mesh.receiveShadow=true;mesh.castShadow=false;
  mesh.userData={accuracy:a.accuracy||'C',sourceIds:routeEvidence.sourceIds};root.add(mesh);
 }
 // Lower vertical closure is one continuous grade, not dozens of invented visible steps.
 for(const r of approachRamps){
  const g=prismGeometry({...r,bottom0:r.y0-.12,bottom1:r.y1-.12,top0:r.y0,top1:r.y1});
  const mesh=new T.Mesh(g,stone);mesh.name=r.name;mesh.receiveShadow=true;mesh.castShadow=false;
  mesh.userData={accuracy:r.accuracy,sourceIds:r.evidence||routeEvidence.sourceIds,visualRole:'continuous C-grade approach; no inferred stair count'};root.add(mesh);
 }
 // The first v2 attempt filled each side down to the plaza datum and produced a huge
 // triangular invented wall. v3 keeps only low, thin bands that follow the grade itself.
 for(const w of approachRetainingWalls){
  const g=prismGeometry(w);
  const mesh=new T.Mesh(g,stone);mesh.name=w.name;mesh.receiveShadow=true;mesh.castShadow=true;
  mesh.userData={accuracy:w.accuracy,sourceIds:routeEvidence.sourceIds,visualRole:'low C sidewall following the inferred grade; not a reconstructed rampart face'};root.add(mesh);
 }
 root.userData.documentedNineStepCount=documentedNineSteps.length;
 root.userData.lowerApproachMode='continuous C-grade approach with low slope-following sidewalls; no inferred visible stair count';
 return root;
}
