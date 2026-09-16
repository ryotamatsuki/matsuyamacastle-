import * as T from 'three';
import {createNpcCharacter} from './npcCharacter';
import {styleFor} from './npcStyles.mjs';
import {npcZones,NPC_MIN_SEPARATION,PLAYER_AVOID_DISTANCE,pointInZone,onAnyStair} from './npcZones.mjs';
import {mulberry32,randRange} from './seededRandom.mjs';
import {chooseTarget,approachAngle,angleDelta} from './npcNavigation.mjs';
import {toWorld,toLocal,frame} from '../data/unifiedLayout.mjs';

type NpcState='idle'|'look'|'turn'|'walk'|'pause';
type Agent={id:string;floor:number;zone:any;root:T.Group;rng:()=>number;state:NpcState;stateTime:number;stateDuration:number;x:number;z:number;prevX:number;prevZ:number;targetX:number;targetZ:number;yaw:number;targetYaw:number;speed:number;phase:number;style:any};

const AI_STEP=.1;
function stateDuration(a:Agent,state:NpcState){if(state==='idle')return randRange(a.rng,3,10);if(state==='look')return randRange(a.rng,2,6);if(state==='turn')return randRange(a.rng,.3,1);if(state==='pause')return randRange(a.rng,1,3);return 999;}

export class NpcSystem{
 readonly agents:Agent[]=[];private accumulator=0;private elapsed=0;
 constructor(private parent:T.Object3D,seed=20260916){
  npcZones.forEach((zone:any,index:number)=>{
   const rng=mulberry32(seed+index*7919),style=styleFor(index),root=createNpcCharacter(style);
   const inset=.5,x=zone.x0+inset+(zone.x1-zone.x0-2*inset)*(.25+.5*rng()),z=zone.z0+inset+(zone.z1-zone.z0-2*inset)*(.25+.5*rng());
   const a:Agent={id:`tourist-${String(index+1).padStart(2,'0')}`,floor:zone.floor,zone,root,rng,state:index%3===0?'walk':index%3===1?'idle':'look',stateTime:0,stateDuration:0,x,z,prevX:x,prevZ:z,targetX:x,targetZ:z,yaw:rng()*Math.PI*2,targetYaw:0,speed:randRange(rng,.55,.9),phase:rng()*Math.PI*2,style};
   const target=chooseTarget(zone,rng,this.agents,a.id);a.targetX=target.x;a.targetZ=target.z;a.targetYaw=Math.atan2(target.x-x,target.z-z);a.stateDuration=stateDuration(a,a.state);
   root.userData={...root.userData,npcId:a.id,floor:a.floor,state:a.state,styleId:style.id};this.parent.add(root);this.agents.push(a);
  });
  this.render(0);
 }
 private setState(a:Agent,state:NpcState){a.state=state;a.stateTime=0;a.stateDuration=stateDuration(a,state);a.root.userData.state=state;}
 private chooseAndTurn(a:Agent){const p=chooseTarget(a.zone,a.rng,this.agents,a.id);a.targetX=p.x;a.targetZ=p.z;a.targetYaw=Math.atan2(p.x-a.x,p.z-a.z);this.setState(a,'turn');}
 private tick(dt:number,player:{x:number;y:number;z:number}){
  const pl=toLocal(player.x,player.z);
  for(const a of this.agents){
   a.prevX=a.x;a.prevZ=a.z;a.stateTime+=dt;
   const nearPlayer=Math.abs(player.y-a.zone.y)<2.1&&Math.hypot(a.x-pl.x,a.z-pl.z)<PLAYER_AVOID_DISTANCE;
   if(nearPlayer&&a.state==='walk'){this.setState(a,'pause');a.stateDuration=randRange(a.rng,1.2,2.5);continue;}
   if(a.state==='idle'){
    if(a.stateTime>=a.stateDuration){if(a.rng()<.34){a.targetYaw=a.yaw+randRange(a.rng,-.75,.75);this.setState(a,'look');}else this.chooseAndTurn(a);}
   }else if(a.state==='look'){
    a.yaw=approachAngle(a.yaw,a.targetYaw,dt*.65);
    if(a.stateTime>=a.stateDuration)this.chooseAndTurn(a);
   }else if(a.state==='turn'){
    a.yaw=approachAngle(a.yaw,a.targetYaw,dt*4.8);
    if(Math.abs(angleDelta(a.yaw,a.targetYaw))<.055||a.stateTime>=a.stateDuration){a.speed=randRange(a.rng,.55,.9);this.setState(a,'walk');}
   }else if(a.state==='walk'){
    let crowded=false;for(const o of this.agents){if(o===a||o.floor!==a.floor)continue;if(Math.hypot(a.x-o.x,a.z-o.z)<NPC_MIN_SEPARATION){crowded=true;break;}}
    if(crowded){this.setState(a,'pause');continue;}
    const dx=a.targetX-a.x,dz=a.targetZ-a.z,dist=Math.hypot(dx,dz);
    if(dist<.12){this.setState(a,'pause');continue;}
    const step=Math.min(a.speed*dt,dist),nx=a.x+dx/dist*step,nz=a.z+dz/dist*step;
    if(!pointInZone(a.zone,nx,nz,.34)||onAnyStair(nx,nz,.34)){this.chooseAndTurn(a);continue;}
    a.x=nx;a.z=nz;a.yaw=Math.atan2(dx,dz);
   }else if(a.state==='pause'&&a.stateTime>=a.stateDuration){if(a.rng()<.45){a.targetYaw=a.yaw+randRange(a.rng,-.55,.55);this.setState(a,'look');}else this.setState(a,'idle');}
  }
 }
 private render(alpha:number){
  for(const a of this.agents){
   const lx=a.prevX+(a.x-a.prevX)*alpha,lz=a.prevZ+(a.z-a.prevZ)*alpha,w=toWorld(lx,lz);a.root.position.set(w.x,a.zone.y+.01,w.z);a.root.rotation.y=a.yaw-frame.angle;
   const parts=a.root.userData.parts as any;if(!parts)continue;
   if(a.state==='walk'){
    a.phase+=.055*a.speed;const swing=Math.sin(a.phase*8);parts.leftLeg.rotation.x=swing*.42;parts.rightLeg.rotation.x=-swing*.42;parts.leftArm.rotation.x=-swing*.28;parts.rightArm.rotation.x=swing*.28;parts.body.position.y=Math.abs(Math.sin(a.phase*8))*.018;
   }else{
    parts.leftLeg.rotation.x*=.82;parts.rightLeg.rotation.x*=.82;parts.leftArm.rotation.x*=.82;parts.rightArm.rotation.x*=.82;parts.body.position.y*=.8;parts.head.rotation.y=Math.sin(this.elapsed*.7+a.phase)*.055;
   }
  }
 }
 update(dt:number,player:{x:number;y:number;z:number}){this.elapsed+=dt;this.accumulator+=dt;while(this.accumulator>=AI_STEP){this.tick(AI_STEP,player);this.accumulator-=AI_STEP;}this.render(this.accumulator/AI_STEP);}
 snapshot(){return this.agents.map(a=>({id:a.id,floor:a.floor,state:a.state,x:a.x,z:a.z,y:a.zone.y,zone:a.zone.id,style:a.style.id,height:a.style.height,hat:a.style.hat,bag:a.style.bag}));}
 dispose(){for(const a of this.agents)this.parent.remove(a.root);}
}
