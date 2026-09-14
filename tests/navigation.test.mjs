import test from 'node:test';
import assert from 'node:assert/strict';
import {Walker,blocked,groundAt} from '../src/world.mjs';
function go(p,x,z){for(let i=0;i<1800;i++){const dx=x-p.x,dz=z-p.z,len=Math.hypot(dx,dz);if(len<.035)return;p.step(dx/len*2,dz/len*2,1/120);}throw Error('Route blocked toward '+x+','+z+' at '+JSON.stringify(p));}
export const route=[[0,23],[0,17],[0,5],[-3,5],[-3,3.3],[-3,-3.3],[3,-3.3],[3,3.3],[-3,3.3],[-3,-3.3],[0,-3.3],[0,3.4]];
test('continuous walk from Honmaru through basement to third floor and back',()=>{
 const p=new Walker();for(const [x,z] of route)go(p,x,z);assert.ok(Math.abs(p.y-10.8)<.02);
 for(const [x,z] of [...route].reverse())go(p,x,z);go(p,0,31);assert.ok(Math.abs(p.y+4)<.02);
});
test('walls block normal and long frames; player cannot leave first-floor wall',()=>{
 const p=new Walker();p.x=0;p.y=3.6;p.z=5;
 for(let i=0;i<250;i++)p.step(10,0,.03);
 assert.ok(p.x<8);assert.equal(blocked(p.x,p.y,p.z),false);
 p.step(100,0,.2);assert.ok(p.x<8);
});
test('void and stone-edge fall prevention',()=>{
 const p=new Walker();p.x=0;p.y=0;p.z=12;
 for(let i=0;i<150;i++)p.step(0,8,.02);
 assert.ok(p.z<42);assert.ok(Number.isFinite(p.y));
 p.x=22;p.z=30;p.y=-4;
 for(let i=0;i<150;i++)p.step(8,0,.02);
 assert.ok(p.x<=24);assert.equal(p.y,-4);
});
test('no ghost upper floor support',()=>{assert.equal(groundAt(0,0,.2),0);assert.equal(groundAt(0,0,3.8),3.6);});
