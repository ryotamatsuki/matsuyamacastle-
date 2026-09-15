import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const data=JSON.parse(fs.readFileSync('public/data/plateau-castle-lod2.json'));
const sources=JSON.parse(fs.readFileSync('public/data/source_manifest.json'));
test('actual castle LOD2 has valid provenance, elevations and holes',()=>{
 assert.equal(data.buildingId,'bldg_adf19f2c-f291-4b52-b75f-f883ce5c8e3e');
 assert.equal(data.surfaceCount,471);assert.equal(data.surfaces.length,471);
 assert.ok(data.origin.elevation>100);assert.ok(data.surfaces.some(s=>s.kind==='RoofSurface'));assert.ok(data.surfaces.some(s=>s.rings.length>1));
 for(const s of data.surfaces)for(const r of s.rings){assert.ok(r.length>=4);for(const p of r){assert.ok(p.every(Number.isFinite));assert.ok(p[1]>=0&&p[1]<30);}}
 for(const id of ['PLATEAU-2020','CITY-PHOTO-KEEP','CITY-PHOTO-OVERVIEW','CITY-PHOTO-STONE']){
  const s=sources.find(s=>s.id===id);assert.equal(s.status,'admitted');assert.ok(s.license.startsWith('CC BY'));assert.ok(s.resource_url&&s.derivative_use);
 }
});
test('all PBR files are original and exactly match the material ledger',()=>{
 const ledger=JSON.parse(fs.readFileSync('public/data/material-manifest.json'));assert.equal(ledger.length,18);
 for(const m of ledger){assert.equal(m.source,'ORIGINAL');assert.equal(createHash('sha256').update(fs.readFileSync(m.path)).digest('hex'),m.sha256);}
});

import {surfaceTriangles} from '../src/envelope.mjs';
import {openings,toWorld} from '../src/data/unifiedLayout.mjs';
import * as T from 'three';
test('entrance removes rendered triangles, preserving original wall outside the aperture',()=>{
 const triangles=data.surfaces.filter(s=>s.kind==='WallSurface').flatMap(s=>surfaceTriangles(s));
 function intersects(x,y,z){const w=toWorld(x,z),o=new T.Vector3(w.x,y,w.z),d=new T.Vector3(-.015,0,-1).normalize(),ray=new T.Ray(o,d),hit=new T.Vector3();return triangles.some(t=>ray.intersectTriangle(...t.map(p=>new T.Vector3(...p)),false,hit)&&o.distanceTo(hit)<3);}
 assert.equal(intersects(0,10.5,11.5),false);assert.equal(intersects(2.4,10.5,11.5),true);
 assert.ok(openings.every(o=>o.accuracy.includes('C coordinates')));
});
test('GSI aerial snapshot is original JPEG bytes with georeferenced corners and fixed hashes',()=>{
 const ledger=JSON.parse(fs.readFileSync('public/data/aerial-tiles.json'));assert.equal(ledger.tiles.length,9);
 for(const t of ledger.tiles){const bytes=Buffer.from(t.dataUri.split(',')[1],'base64');assert.equal(createHash('sha256').update(bytes).digest('hex'),t.sha256);assert.equal(bytes[0],255);assert.equal(bytes[1],216);assert.ok(t.nw[0]<t.se[0]&&t.nw[1]<t.se[1]);assert.ok(t.url.startsWith('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/18/'));}
});
