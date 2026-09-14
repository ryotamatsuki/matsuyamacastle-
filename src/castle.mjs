import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {dimensions as D} from './data/castleDimensions.mjs';
import {floorPieces,wall,walls} from './world.mjs';
export function buildCastle(){
 const root=new T.Group();root.name='MatsuyamaKeep_Interpretive_CC_BY_4';
 root.userData={license:'CC-BY-4.0',author:'Matsuyama Castle 3D Walk contributors',source:'CITY-KEEP',accuracy:'C overall; sourced ken ratios A',kenMetres:D.ken};
 const mats={
 wood:new T.MeshStandardMaterial({color:0x59402b,roughness:.88}),
 edge:new T.MeshStandardMaterial({color:0x32271f,roughness:.95}),
 black:new T.MeshStandardMaterial({color:0x282925,roughness:.92}),
 plaster:new T.MeshStandardMaterial({color:0xe6dfc8,roughness:.96}),
 stone:new T.MeshStandardMaterial({color:0x696d61,roughness:1}),
 stone2:new T.MeshStandardMaterial({color:0x858479,roughness:1}),
 roof:new T.MeshStandardMaterial({color:0x3f4547,roughness:.76,metalness:.08}),
 tile:new T.MeshStandardMaterial({color:0x666b68,roughness:.8}),
 ground:new T.MeshStandardMaterial({color:0xb2a88a,roughness:1}),
 iron:new T.MeshStandardMaterial({color:0x292d2d,metalness:.55,roughness:.7}),
 tatami:new T.MeshStandardMaterial({color:0x89866a,roughness:1})
 };for(const [k,m] of Object.entries(mats))m.name=k;
 const buckets=new Map();
 function add(geo,mat,name='structure',confidence='C'){
 geo=geo.index?geo.toNonIndexed():geo;
 const key=mat+':'+name;
 if(!buckets.has(key))buckets.set(key,{list:[],mat,name,confidence});
 buckets.get(key).list.push(geo);
 }
 function box(x,y,z,w,h,d,mat,name,rot=0){
 if(w<=0||h<=0||d<=0)return;
 const g=new T.BoxGeometry(w,h,d);g.rotateY(rot);g.translate(x,y,z);add(g,mat,name);
 }
 function beam(a,b,r,mat,name){
 const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av);
 const g=new T.CylinderGeometry(r,r,v.length(),6);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,mat,name);
 }
 function panel(vertices,mat,name){
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.computeVertexNormals();add(g,mat,name);
 }
 function roof(y,w,d,name,innerW=w-3.2,innerD=d-3.2){
 // Annular hip roof, leaves a real interior void; not a solid pyramid through upper floors.
 const iw=Math.max(innerW,3),id=Math.max(innerD,3),rise=1.5;
 const outer=[[-w/2,y,-d/2],[w/2,y,-d/2],[w/2,y,d/2],[-w/2,y,d/2]];
 const inner=[[-iw/2,y+rise,-id/2],[iw/2,y+rise,-id/2],[iw/2,y+rise,id/2],[-iw/2,y+rise,id/2]];
 for(let k=0;k<4;k++){const j=(k+1)%4;panel([...outer[k],...inner[k],...outer[j],...outer[j],...inner[k],...inner[j]],'roof',name);
 const n=Math.ceil(new T.Vector3(...outer[k]).distanceTo(new T.Vector3(...outer[j]))/.32);
 for(let i=0;i<=n;i++){const t=i/n;const a=outer[k].map((v,c)=>v+(outer[j][c]-v)*t),b=inner[k].map((v,c)=>v+(inner[j][c]-v)*t);a[1]+=.06;b[1]+=.06;beam(a,b,.045,'tile',name);}
 beam(outer[k],outer[j],.09,'edge',name);
 }
 }
 function gable(x,y,z,size,rot,curved,name){
 // Original parametric ornamental silhouette; exact curve and locations are C.
 const pts=[];const n=curved?16:2;
 for(let i=0;i<=n;i++){const t=i/n;pts.push(new T.Vector2((t-.5)*size,curved?size*.36*Math.exp(-Math.pow((t-.5)*3.3,2)):size*.42*(1-Math.abs(2*t-1))));}
 const shape=new T.Shape();shape.moveTo(-size/2,0);for(const p of pts)shape.lineTo(p.x,p.y);shape.lineTo(size/2,0);shape.closePath();
 const g=new T.ExtrudeGeometry(shape,{depth:.15,bevelEnabled:false});g.rotateY(rot);g.translate(x,y,z);add(g,'plaster',name);
 for(let i=1;i<pts.length;i++){const a=new T.Vector3(pts[i-1].x,pts[i-1].y,0).applyAxisAngle(new T.Vector3(0,1,0),rot).add(new T.Vector3(x,y,z)),b=new T.Vector3(pts[i].x,pts[i].y,0).applyAxisAngle(new T.Vector3(0,1,0),rot).add(new T.Vector3(x,y,z));beam(a.toArray(),b.toArray(),.11,'roof',name);}
 }
 box(0,-4.2,30,48,.4,24,'ground','Honmaru');
 box(0,-.18,12,30,.36,12,'ground','Courtyard');
 // Stone retaining front, interrupted for the walkable approach.
 for(let row=0;row<8;row++)for(let col=0;col<28;col++){const x=(col-13.5)*1.05;if(Math.abs(x)<1.8)continue;box(x,-3.75+row*.5,18,1.02,.47,.8,(row+col)%3?'stone':'stone2','TenshumaruStone');}
 for(const x of [-15,15])for(let row=0;row<8;row++)for(let j=0;j<12;j++)box(x,-3.75+row*.5,6.5+j,.65,.47,.96,(row+j)%3?'stone':'stone2','TenshumaruStone');
 for(let j=0;j<24;j++){const t=(j+1)/24;box(0,-4+4*t-.09,22-4*(j+.5)/24,3,.18,4/24,'stone2','ApproachStairs');}
 D.floors.forEach((fl,i)=>{
 const y=fl.y,w=fl.width,d=fl.depth,group='Floor'+i;
 for(const p of floorPieces(i))box((p.x0+p.x1)/2,y-.11,(p.z0+p.z1)/2,p.x1-p.x0,.22,p.z1-p.z0,i?'wood':'stone2',group);
 // Floorboard seams are original geometry, clipped at stair openings.
 for(const p of floorPieces(i))for(let z=p.z0+.24;z<p.z1;z+=.24)box((p.x0+p.x1)/2,y+.002,z,p.x1-p.x0,.004,.007,'edge',group);
 // Central ceiling only; corridor beams stay exposed. Incoming and outgoing stair wells remain open.
 if(i>0)for(const x of [-D.coreWidth/2,0,D.coreWidth/2])for(const z of [-D.coreDepth/2,D.coreDepth/2])box(x,y+1.65,z,.28,3.3,.28,'wood','Columns');
 if(!i)for(const x of [-D.coreWidth/2,0,D.coreWidth/2])for(const z of [-D.coreDepth/2,D.coreDepth/2])box(x,y+1.65,z,.4,3.3,.4,'wood','BasementColumns');
 for(const z of [-D.coreDepth/2,D.coreDepth/2])box(0,y+3.1,z,w,.3,.28,'wood','ExposedBeams');
 for(const x of [-D.coreWidth/2,0,D.coreWidth/2])box(x,y+3.1,0,.26,.28,d,'wood','ExposedBeams');
 if(i===0){
 // Stone enclosure and entrance, no photograph texture.
 for(let row=0;row<7;row++){
 for(let n=0;n<16;n++){const x=(n+.5)*w/16-w/2;box(x,y+row*.46+.23,-d/2,w/16-.025,.435,.36,n%3?'stone':'stone2','Anagura');if(Math.abs(x)>1.35)box(x,y+row*.46+.23,d/2,w/16-.025,.435,.36,n%3?'stone':'stone2','Anagura');}
 for(const x of [-w/2,w/2])for(let n=0;n<13;n++)box(x,y+row*.46+.23,(n+.5)*d/13-d/2,.36,.435,d/13-.025,n%3?'stone':'stone2','Anagura');
 }
 box(0,3.1,d/2,2.8,.45,.5,'stone','EntranceLintel');
 for(const x of [-1.4,1.4])box(x,1.3,d/2+.65,.12,2.6,1.2,'iron','OpenEntranceDoors');
 }else{
 // Four sides with actual open windows, sill and lintel; collision uses closed guard planes.
 for(let side=0;side<4;side++){
 const along=side%2?d:w,rot=side%2?Math.PI/2:0;
 const convert=(u,v)=>side===0?[u,-d/2+v]:side===2?[u,d/2+v]:side===1?[-w/2+v,u]:[w/2+v,u];
 const put=(u,yy,ww,hh,dd,mat,name,v=0)=>{const [x,z]=convert(u,v);box(x,yy,z,ww,hh,dd,mat,name,rot);};
 put(0,y+.48,along,.96,.2,i===3?'plaster':'black','Exterior'+i);
 put(0,y+2.94,along,.72,.2,i===3?'plaster':'black','Exterior'+i);
 const n=Math.max(3,Math.floor(along/2));
 for(let j=0;j<=n;j++)put(-along/2+j*along/n,y+1.8,.28,1.65,.22,'plaster','WindowPosts');
 for(let j=0;j<n;j++){
 const u=-along/2+(j+.5)*along/n,bay=along/n-.3;
 for(let k=0;k<5;k++)put(u-bay/2+(k+.5)*bay/5,y+1.72,.06,1.52,.09,'plaster','Nur igomeLattice'.replace(' ',''));
 // Raised exterior board shutter and parked inner earthen sliding door.
 put(u,y+2.53,bay,.09,.68,'black','RaisedShutters',side<2?-.28:.28);
 put(u+bay*.37,y+1.73,bay*.18,1.5,.1,'plaster','SlidingEarthenDoors',side<2?.17:-.17);
 }
 if(i<3)for(let k=0;k<7;k++)put(0,y+.08+k*.13,along,.025,.23,'edge','BlackCladding');
 }
 roof(y+3.15,w+2.1,d+2.1,'HongawaraRoof'+i,i<3?D.floors[i+1].width:w-1.1,i<3?D.floors[i+1].depth:d-1.1);
 gable(0,y+3.2,d/2+1.06,3.2,0,i===1,'SouthGable'+i);
 gable(0,y+3.2,-d/2-1.15,2.8,Math.PI,false,'NorthGable'+i);
 gable(w/2+1.08,y+3.2,0,2.8,Math.PI/2,i===2,'EastGable'+i);
 gable(-w/2-1.08,y+3.2,0,2.8,-Math.PI/2,false,'WestGable'+i);
 }
 });
 // Top irimoya ridge cover: entirely above the third floor headroom.
 const top=D.floors[3],ry=top.y+4.65;
 const a=top.width-1.1,b=top.depth-1.1;
 panel([-a/2,ry,-b/2,a/2,ry,-b/2,-a/2,ry+1.7,0,a/2,ry,-b/2,a/2,ry+1.7,0,-a/2,ry+1.7,0],'roof','TopRoof');
 panel([-a/2,ry+1.7,0,a/2,ry+1.7,0,-a/2,ry,b/2,a/2,ry+1.7,0,a/2,ry,b/2,-a/2,ry,b/2],'roof','TopRoof');
 beam([-a/2,ry+1.75,0],[a/2,ry+1.75,0],.16,'tile','Ridge');
 for(const x of [-a/2,a/2])gable(x,ry,0,b,Math.PI/2,false,'IrimoyaGable');
 D.stairs.forEach((s,i)=>{
 const n=20;
 for(let j=0;j<n;j++){const t=(j+1)/n;box(s.x,s.y0+(s.y1-s.y0)*t-.07,s.z0+(s.z1-s.z0)*(j+.5)/n,s.width,.14,Math.abs(s.z1-s.z0)/n+.01,'wood','VisitorStairs'+i);}
 for(const dx of [-1,1]){
 const x=s.x+dx*(s.width/2+.16);
 beam([x,s.y0+.95,s.z0],[x,s.y1+.95,s.z1],.045,'wood','StairHandrails');
 for(let j=0;j<=5;j++){const t=j/5;box(x,s.y0+(s.y1-s.y0)*t+.45,s.z0+(s.z1-s.z0)*t,.07,.9,.07,'wood','StairHandrails');}
 // Safety rails around upper stairwell sides.
 box(x,s.y1+.88,0,.08,.08,5.7,'wood','StairwellGuards');
 for(const z of [-2.7,0,2.7])box(x,s.y1+.45,z,.07,.9,.07,'wood','StairwellGuards');
 }
 });
 // Courtyard boundary rails, same extents as collision geometry.
 for(const b of walls.filter(b=>/内庭手摺|外階段手摺/.test(b.name)))box((b.x0+b.x1)/2,(b.y0+b.y1)/2,(b.z0+b.z1)/2,b.x1-b.x0,b.y1-b.y0,b.z1-b.z0,'wood','ApproachGuards');
 for(const {list,mat,name,confidence} of buckets.values()){
 const merged=mergeGeometries(list,false);for(const g of list)g.dispose();
 if(!merged)throw Error('Geometry merge failed '+name);
 const mesh=new T.Mesh(merged,mats[mat]);mesh.name=name+'_'+mat;mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData={confidence,sourceIds:['CITY-KEEP'],note:'Original parametric interpretation; see ACCURACY.md'};root.add(mesh);
 }
 return root;
}
