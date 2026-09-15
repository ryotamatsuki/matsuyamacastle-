import * as T from 'three';
export async function buildAerial(base:string,courtyards:number[][][]){
 const response=await fetch(base+'data/aerial-tiles.json');if(!response.ok)throw Error('航空写真 '+response.status);const data=await response.json();
 const root=new T.Group();root.name='GSI_GeoreferencedAerial';
 for(const tile of data.tiles){
  const texture=await new T.TextureLoader().loadAsync(tile.dataUri);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
  const material=new T.MeshStandardMaterial({map:texture,roughness:1,side:T.DoubleSide});const [x0,z0]=tile.nw,[x1,z1]=tile.se;
  const g=new T.PlaneGeometry(x1-x0,z1-z0);g.rotateX(-Math.PI/2);g.translate((x0+x1)/2,-.03,(z0+z1)/2);
  const mesh=new T.Mesh(g,material);mesh.receiveShadow=true;root.add(mesh);
  // Courtyard footprint holes come directly from the PLATEAU ground polygon.
  // Clip each to the tile bounds so its texture has exactly the same registration.
  for(const ring of courtyards){
   let poly=ring.map(p=>[...p]);
   for(const [axis,bound,sign] of [[0,x0,1],[0,x1,-1],[1,z0,1],[1,z1,-1]]){
    const out:number[][]=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a[axis]-bound)*sign,db=(b[axis]-bound)*sign;if(da>=0)out.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,j)=>v+(b[j]-v)*t));}}poly=out;
   }
   if(poly.length<3)continue;
   const shape=poly.map(p=>new T.Vector2(...p as [number,number])),faces=T.ShapeUtils.triangulateShape(shape,[]),vertices:number[]=[],uv:number[]=[];
   for(const face of faces)for(const i of face){const [x,z]=poly[i];vertices.push(x,9.2,z);uv.push((x-x0)/(x1-x0),1-(z-z0)/(z1-z0));}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.computeVertexNormals();const court=new T.Mesh(geometry,material);court.receiveShadow=true;root.add(court);
  }
 }
 root.userData={sourceId:'GSI-AERIAL',groundHeightAccuracy:'C estimate; aerial imagery is not elevation data'};return root;
}
