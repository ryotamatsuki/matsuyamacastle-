import * as T from 'three';

type Style={id:string;skin:number;hair:number;top:number;pants:number;shoes:number;height:number;bodyScale:number;hat:boolean;bag:boolean};

const GEO={
 head:new T.SphereGeometry(.14,8,6),
 torso:new T.BoxGeometry(.42,.58,.24),
 upperArm:new T.BoxGeometry(.12,.46,.12),
 leg:new T.BoxGeometry(.14,.58,.16),
 shoe:new T.BoxGeometry(.16,.09,.28),
 hair:new T.SphereGeometry(.145,8,5,0,Math.PI*2,0,Math.PI*.52),
 hat:new T.CylinderGeometry(.18,.18,.08,10),
 brim:new T.CylinderGeometry(.24,.24,.025,10),
 bag:new T.BoxGeometry(.26,.34,.12)
};

function mat(color:number){return new T.MeshStandardMaterial({color,roughness:.92,metalness:0});}
function mesh(g:T.BufferGeometry,m:T.Material,name:string){const o=new T.Mesh(g,m);o.name=name;o.castShadow=false;o.receiveShadow=false;return o;}

export function createNpcCharacter(style:Style){
 const root=new T.Group();root.name='TouristNPC_'+style.id;root.userData.presentation='ambience';
 const body=new T.Group();root.add(body);
 const skin=mat(style.skin),hairMat=mat(style.hair),top=mat(style.top),pants=mat(style.pants),shoes=mat(style.shoes),bagMat=mat(0x574b3d);
 const torso=mesh(GEO.torso,top,'torso');torso.position.y=1.16;torso.scale.x=style.bodyScale;body.add(torso);
 const head=mesh(GEO.head,skin,'head');head.position.y=1.60;body.add(head);
 const hair=mesh(GEO.hair,hairMat,'hair');hair.position.y=1.655;hair.rotation.x=.04;body.add(hair);
 const leftArm=new T.Group(),rightArm=new T.Group();leftArm.position.set(-.28*style.bodyScale,1.38,0);rightArm.position.set(.28*style.bodyScale,1.38,0);
 const la=mesh(GEO.upperArm,top,'leftArmMesh');la.position.y=-.23;const ra=mesh(GEO.upperArm,top,'rightArmMesh');ra.position.y=-.23;leftArm.add(la);rightArm.add(ra);body.add(leftArm,rightArm);
 const leftLeg=new T.Group(),rightLeg=new T.Group();leftLeg.position.set(-.11,.88,0);rightLeg.position.set(.11,.88,0);
 const ll=mesh(GEO.leg,pants,'leftLegMesh');ll.position.y=-.29;const rl=mesh(GEO.leg,pants,'rightLegMesh');rl.position.y=-.29;leftLeg.add(ll);rightLeg.add(rl);
 const ls=mesh(GEO.shoe,shoes,'leftShoe');ls.position.set(0,-.61,.06);const rs=mesh(GEO.shoe,shoes,'rightShoe');rs.position.set(0,-.61,.06);leftLeg.add(ls);rightLeg.add(rs);body.add(leftLeg,rightLeg);
 if(style.hat){const h=mesh(GEO.hat,mat(0x746a58),'hat');h.position.y=1.76;const b=mesh(GEO.brim,h.material,'hatBrim');b.position.y=1.72;body.add(h,b);}
 if(style.bag){const bag=mesh(GEO.bag,bagMat,'bag');bag.position.set(.25*style.bodyScale,1.12,.16);bag.rotation.z=-.08;body.add(bag);}
 root.scale.setScalar(style.height/1.7);
 root.userData.parts={body,torso,head,leftArm,rightArm,leftLeg,rightLeg};
 root.userData.height=style.height;
 return root;
}
