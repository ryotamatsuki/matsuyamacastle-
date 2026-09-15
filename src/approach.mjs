import * as T from 'three';
import {approachSurfaces,routeEvidence,documentedNineSteps,inferredLowerSteps,mainPlaza} from './data/hondanRoute.mjs';
import {toWorld} from './data/unifiedLayout.mjs';

export function buildApproach(){
 const root=new T.Group();root.name='HondanToHonmaruApproach_C';
 root.userData={accuracy:'B route relationships / C coordinates and step geometry',sourceIds:routeEvidence.sourceIds,evidence:'public/data/hondan-route-evidence.json'};
 const stone=new T.MeshStandardMaterial({name:'ApproachStone_C',color:0x989285,roughness:.98});
 const threshold=new T.MeshStandardMaterial({name:'GateThreshold_C',color:0x6d675b,roughness:.94});
 const plazaName=mainPlaza.name;
 for(const a of approachSurfaces){
  // The plaza itself remains the georeferenced aerial image. It is collision-only;
  // rendering another slab there would obscure the imagery the route is meant to meet.
  if(a.name===plazaName)continue;
  const w=a.x1-a.x0,d=a.z1-a.z0,cx=(a.x0+a.x1)/2,cz=(a.z0+a.z1)/2,p=toWorld(cx,cz);
  const h=a.step?Math.min(.16,Math.max(.08,a.stepCount===9?.12:.10)):.10;
  const g=new T.BoxGeometry(w,h,d);g.rotateY(-.015);g.translate(p.x,a.y-h/2,p.z);
  const mesh=new T.Mesh(g,a.name.startsWith('筋鉄門')?threshold:stone);mesh.name=a.name;mesh.receiveShadow=true;mesh.castShadow=false;
  mesh.userData={accuracy:a.accuracy||'C',sourceIds:routeEvidence.sourceIds};root.add(mesh);
 }
 root.userData.documentedNineStepCount=documentedNineSteps.length;
 root.userData.inferredLowerStepCount=inferredLowerSteps.length;
 return root;
}
