import {NPC_RADIUS,NPC_MIN_SEPARATION,pointInZone,onAnyStair} from './npcZones.mjs';
import {randRange} from './seededRandom.mjs';

export function randomPointInZone(zone,rng,margin=NPC_RADIUS+.12){
 return {x:randRange(rng,zone.x0+margin,zone.x1-margin),z:randRange(rng,zone.z0+margin,zone.z1-margin)};
}

export function targetIsSafe(zone,target,agents,selfId){
 if(!pointInZone(zone,target.x,target.z,NPC_RADIUS+.08))return false;
 if(onAnyStair(target.x,target.z,NPC_RADIUS+.08))return false;
 for(const other of agents){
  if(other.id===selfId||other.floor!==zone.floor)continue;
  if(Math.hypot(target.x-other.x,target.z-other.z)<NPC_MIN_SEPARATION)return false;
 }
 return true;
}

export function chooseTarget(zone,rng,agents,selfId,attempts=18){
 for(let i=0;i<attempts;i++){
  const p=randomPointInZone(zone,rng);
  if(targetIsSafe(zone,p,agents,selfId))return p;
 }
 return {x:(zone.x0+zone.x1)/2,z:(zone.z0+zone.z1)/2};
}

export function angleDelta(a,b){let d=(b-a+Math.PI)%(Math.PI*2)-Math.PI;if(d<-Math.PI)d+=Math.PI*2;return d;}
export function approachAngle(a,b,maxStep){const d=angleDelta(a,b);return a+Math.max(-maxStep,Math.min(maxStep,d));}
