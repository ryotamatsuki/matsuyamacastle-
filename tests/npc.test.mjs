import test from 'node:test';
import assert from 'node:assert/strict';
import {npcZones,NPC_RADIUS,pointInZone,onAnyStair,zonesForFloor} from '../src/npc/npcZones.mjs';
import {styleFor} from '../src/npc/npcStyles.mjs';
import {mulberry32} from '../src/npc/seededRandom.mjs';
import {chooseTarget} from '../src/npc/npcNavigation.mjs';
import {blocked,groundAt} from '../src/world.mjs';
import {toWorld} from '../src/data/unifiedLayout.mjs';

test('tourist plan is exactly twelve NPCs, three per interior floor, with distinct presentation styles',()=>{
 assert.equal(npcZones.length,12);
 for(let floor=0;floor<4;floor++)assert.equal(zonesForFloor(floor).length,3);
 const styles=[...Array(12)].map((_,i)=>styleFor(i));
 assert.equal(new Set(styles.map(s=>s.id)).size,12);
 assert.ok(new Set(styles.map(s=>s.top)).size>=6);
 assert.ok(styles.some(s=>s.hat)&&styles.some(s=>s.bag));
});

test('all NPC zones stay on valid fitted floors and clear of walls and stair volumes',()=>{
 for(const zone of npcZones){
  const samples=[
   [(zone.x0+zone.x1)/2,(zone.z0+zone.z1)/2],
   [zone.x0+.42,zone.z0+.42],[zone.x1-.42,zone.z0+.42],
   [zone.x0+.42,zone.z1-.42],[zone.x1-.42,zone.z1-.42]
  ];
  for(const [x,z] of samples){
   assert.ok(pointInZone(zone,x,z,.34),`${zone.id} sample outside safe margin`);
   assert.equal(onAnyStair(x,z,NPC_RADIUS+.08),false,`${zone.id} intersects stair`);
   const w=toWorld(x,z);
   assert.equal(blocked(w.x,zone.y,w.z,NPC_RADIUS),false,`${zone.id} blocked at ${x},${z}`);
   assert.equal(groundAt(w.x,w.z,zone.y+.12),zone.y,`${zone.id} has no floor at ${x},${z}`);
  }
 }
});

test('deterministic roaming simulation remains finite, inside zones and non-overlapping',()=>{
 const agents=npcZones.map((zone,index)=>{
  const rng=mulberry32(20260916+index*7919),x=(zone.x0+zone.x1)/2,z=(zone.z0+zone.z1)/2;
  return {id:`npc-${index}`,floor:zone.floor,zone,rng,x,z,target:{x,z},speed:.55+(index%5)*.07};
 });
 for(const a of agents)a.target=chooseTarget(a.zone,a.rng,agents,a.id);
 for(let step=0;step<1800;step++){
  for(const a of agents){
   let dx=a.target.x-a.x,dz=a.target.z-a.z,dist=Math.hypot(dx,dz);
   if(dist<.08){a.target=chooseTarget(a.zone,a.rng,agents,a.id);dx=a.target.x-a.x;dz=a.target.z-a.z;dist=Math.hypot(dx,dz);}
   if(dist>.0001){const d=Math.min(a.speed*.05,dist);a.x+=dx/dist*d;a.z+=dz/dist*d;}
   assert.ok(Number.isFinite(a.x)&&Number.isFinite(a.z));
   assert.ok(pointInZone(a.zone,a.x,a.z,.33),`${a.id} left ${a.zone.id}`);
   assert.equal(onAnyStair(a.x,a.z,.34),false,`${a.id} entered stair`);
  }
  for(let floor=0;floor<4;floor++){
   const same=agents.filter(a=>a.floor===floor);
   for(let i=0;i<same.length;i++)for(let j=i+1;j<same.length;j++)assert.ok(Math.hypot(same[i].x-same[j].x,same[i].z-same[j].z)>.05,'NPCs exactly overlap');
  }
 }
});
