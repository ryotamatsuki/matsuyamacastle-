import * as T from 'three';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
// Surveyed polygon boundaries are kept intact. Added colours/windows/tile caps
// are independent visual interpretations, explicitly C and separately named.
export function buildPlateau(data){
 const root=new T.Group();root.name='MatsuyamaCastle_PLATEAU_LOD2';
 root.userData={sourceIds:['PLATEAU-2020','CITY-PHOTO-KEEP','CITY-PHOTO-OVERVIEW'],buildingId:data.buildingId,sourceCrs:data.sourceCrs,origin:data.origin,license:'CC BY 4.0',geometry:'source LOD2, local E/up/-N transform; no fitted scale',appearance:'C interpretation; procedural PBR, window placement and tile ornament are not surveyed',sourceManifest:'public/data/source_manifest.json'};
 const mats={plaster: new T.MeshStandardMaterial({color:0xf1ecdf,roughness:.93,vertexColors:true,side:T.DoubleSide}),black:new T.MeshStandardMaterial({color:0x33342f,roughness:.85,vertexColors:true,side:T.DoubleSide}),roof:new T.MeshStandardMaterial({color:0x768188,roughness:.7,vertexColors:true,side:T.DoubleSide}),tile:new T.MeshStandardMaterial({color:0x91999d,roughness:.6,vertexColors:true}),stone:new T.MeshStandardMaterial({color:0xaba596,roughness:.96,vertexColors:true,side:T.DoubleSide}),edge:new T.MeshStandardMaterial({color:0x191d1b,roughness:.7,vertexColors:true,side:T.DoubleSide})};
 for(const [name,m] of Object.entries(mats))m.name=name;
 const buckets=new Map();
 function add(g,material,part){
  if(g.index)g=g.toNonIndexed();
  if(!g.attributes.uv)g.setAttribute('uv',new T.Float32BufferAttribute(new Array(g.attributes.position.count*2).fill(0),2));
  if(!g.attributes.color)g.setAttribute('color',new T.Float32BufferAttribute(new Array(g.attributes.position.count*3).fill(1),3));
  const key=part+':'+material;if(!buckets.has(key))buckets.set(key,{material,part,list:[]});buckets.get(key).list.push(g);
 }
 function cap(a,b,r,part='RoofTileDetail_C'){
  const d=b.clone().sub(a),g=new T.CylinderGeometry(r,r,d.length(),4);
  g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));g.translate(...a.clone().add(b).multiplyScalar(.5).toArray());add(g,'tile',part);
 }
 function inside(p,ring){let c=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++)if(((ring[i].y>p.y)!==(ring[j].y>p.y))&&(p.x<(ring[j].x-ring[i].x)*(p.y-ring[i].y)/(ring[j].y-ring[i].y)+ring[i].x))c=!c;return c;}
 for(const s of data.surfaces){
  let rings=s.rings.map(r=>r.map(p=>new T.Vector3(...p)));
  rings=rings.map(r=>r.length>1&&r[0].distanceTo(r.at(-1))<.0001?r.slice(0,-1):r);if(rings[0].length<3)continue;
  const origin=rings[0][0],normal=new T.Vector3();
  for(let i=0;i<rings[0].length;i++){const a=rings[0][i],b=rings[0][(i+1)%rings[0].length];normal.x+=(a.y-b.y)*(a.z+b.z);normal.y+=(a.z-b.z)*(a.x+b.x);normal.z+=(a.x-b.x)*(a.y+b.y);}
  if(normal.length()<1e-8)continue;normal.normalize();
  // Across-slope horizontal axis; consistent tile flow follows the roof fall line.
  const u=new T.Vector3(normal.z,0,-normal.x);if(u.length()<.001)u.set(1,0,0);u.normalize();const v=normal.clone().cross(u).normalize();if(v.y<0){u.negate();v.negate();}
  const flat=rings.map(r=>r.map(p=>{const q=p.clone().sub(origin);return new T.Vector2(q.dot(u),q.dot(v));}));
  const all=rings.flat(),uv=flat.flat();const faces=T.ShapeUtils.triangulateShape(flat[0],flat.slice(1));
  const minY=Math.min(...all.map(p=>p.y)),maxY=Math.max(...all.map(p=>p.y));
  const roof=s.kind==='RoofSurface';const material=roof?'roof':s.kind==='GroundSurface'?'stone':maxY<5?'stone':maxY>22?'plaster':maxY<14?'plaster':'black';
  const positions=[],tex=[],colors=[];
  for(const f of faces)for(const i of f){positions.push(...all[i].toArray());tex.push(uv[i].x*.55,uv[i].y*.55);const tone=.91+.07*Math.sin(origin.x*2.17+origin.z*.7);colors.push(tone,tone,tone);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(tex,2));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.computeVertexNormals();add(g,material,'Surveyed'+s.kind);
  const xs=flat[0].map(p=>p.x),ys=flat[0].map(p=>p.y),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
  const within=(x,y)=>inside(new T.Vector2(x,y),flat[0])&&!flat.slice(1).some(r=>inside(new T.Vector2(x,y),r));
  // Choose the outward/upward normal for decorative offsets independently of winding.
  const outward=normal.clone();if(roof&&outward.y<0)outward.negate();
  const point=(x,y,lift=.045)=>origin.clone().addScaledVector(u,x).addScaledVector(v,y).addScaledVector(outward,lift);
  if(roof&&Math.abs(normal.y)>.2&&xmax-xmin>.45&&ymax-ymin>.3){
   for(let x=Math.ceil(xmin/.29)*.29;x<xmax;x+=.29)for(let y=ymin+.04;y<ymax-.15;y+=.34){
    const end=Math.min(y+.355,ymax-.015);
    if(within(x,y)&&within(x,end))cap(point(x,y),point(x,end),.054);
   }
   for(let i=0;i<rings[0].length;i++){
    const a=rings[0][i],b=rings[0][(i+1)%rings[0].length];
    if(a.distanceTo(b)>.5&&Math.abs(a.y-b.y)<.18)cap(a.clone().addScaledVector(outward,.05),b.clone().addScaledVector(outward,.05),.075,'RoofEdgeDetail_C');
   }
  }
  // Surface decals, not openings in the source envelope; use only generous rectangular bays.
  if(s.kind==='WallSurface'&&Math.abs(normal.y)<.12&&xmax-xmin>2.1&&maxY-minY>1.8&&maxY>6){
   for(let x=xmin+1;x<xmax-.8;x+=2.05){
    const yy=(ymin+ymax)/2,ww=.62,hh=Math.min(.68,(ymax-ymin)*.28);
    if(![[x-ww,yy-hh],[x+ww,yy-hh],[x+ww,yy+hh],[x-ww,yy+hh]].every(p=>within(...p)))continue;
    const corners=[[x-ww,yy-hh],[x+ww,yy-hh],[x+ww,yy+hh],[x-ww,yy+hh]];
    // Winding of original CityGML is preserved; dual-facing plates avoid orientation-dependent loss.
    for(const sign of [-1,1]){
     const ps=corners.map(p=>point(...p,.035*sign)),verts=[0,1,2,0,2,3].flatMap(i=>ps[i].toArray());
     const q=new T.BufferGeometry();q.setAttribute('position',new T.Float32BufferAttribute(verts,3));q.computeVertexNormals();add(q,'edge','WindowPlacement_C');
     for(let k=0;k<5;k++){
      const cx=x-ww+(k+.5)*2*ww/5;
      const a=point(cx,yy-hh,.065*sign),b=point(cx,yy+hh,.065*sign),d=b.clone().sub(a),bar=new T.CylinderGeometry(.026,.026,d.length(),4);
      bar.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));bar.translate(...a.add(b).multiplyScalar(.5).toArray());add(bar,'plaster','WindowLattice_C');
     }
    }
   }
  }
 }
 for(const {material,part,list} of buckets.values()){
  const unindexed=mergeGeometries(list);const merged=mergeVertices(unindexed);unindexed.dispose();list.forEach(g=>g.dispose());const mesh=new T.Mesh(merged,mats[material]);mesh.name=part+'_'+material;mesh.castShadow=true;mesh.receiveShadow=true;
  mesh.userData={sourceIds:part.startsWith('Surveyed')?['PLATEAU-2020']:['CITY-PHOTO-KEEP','CITY-PHOTO-OVERVIEW','ORIGINAL'],accuracy:part.startsWith('Surveyed')?'source LOD2':'C decorative interpretation'};root.add(mesh);
 }
 return root;
}
