import test from 'node:test';import assert from 'node:assert/strict';
import {Walker,blocked,groundAt} from '../src/world.mjs';
import {toWorld,toLocal,levels} from '../src/data/unifiedLayout.mjs';
function drive(p,points){for(const [x,z] of points){const w=toWorld(x,z);let reached=false;for(let i=0;i<3600;i++){const dx=w.x-p.x,dz=w.z-p.z,n=Math.hypot(dx,dz);if(n<.035){reached=true;break;}p.step(dx/n*2,dz/n*2,1/120);}assert.ok(reached,`Blocked at ${x},${z}: ${JSON.stringify(p)}`);}}
const ascent=[[0,8],[-2.8,8],[-2.8,4.5],[-2.8,-4.8],[2.8,-4.8],[2.8,-4.5],[2.8,4.8],[-2.8,4.8],[-2.8,4.5],[-2.8,-4.8],[0,-4.8],[0,-2]];
test('one continuous courtyard-to-top-and-back route crosses actual envelope without teleporting',()=>{const p=new Walker();drive(p,ascent);assert.equal(p.y,21.8);drive(p,[...ascent].reverse());drive(p,[[0,13.1]]);assert.equal(p.y,9.2);});
test('entrance is open but neighbouring original wall and inferred inner wall remain solid',()=>{for(const x of [0,2.4,-2.4]){const p=toWorld(x,10.29);assert.equal(blocked(p.x,9.2,p.z),x!==0);}const p=toWorld(0,10.29);assert.equal(groundAt(p.x,p.z,9.4),9.2);});
test('upper exterior constrains walker even at an open window sill',()=>{const p=new Walker(),w=toWorld(0,-2);Object.assign(p,w,{y:21.8});for(let i=0;i<1200;i++)p.step(4,0,1/120);assert.ok(toLocal(p.x,p.z).x<levels[3].width/2);assert.equal(p.y,21.8);});
