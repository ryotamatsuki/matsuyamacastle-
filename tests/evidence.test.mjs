import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {admittedSourceIds,elementEvidence,evidenceSummary} from '../src/data/interiorEvidence.mjs';

const manifest=JSON.parse(fs.readFileSync(new URL('../public/data/source_manifest.json',import.meta.url),'utf8'));
const byId=new Map(manifest.map(s=>[s.id,s]));
const allowedStatuses=new Set(['admitted','excluded','pending','facts-only']);

test('source manifest uses explicit rights states',()=>{
 for(const source of manifest){
  assert.ok(source.id&&source.title&&source.author,`Incomplete identity for ${source.id}`);
  assert.ok(source.url&&source.accessed&&source.license,`Incomplete rights metadata for ${source.id}`);
  assert.ok(allowedStatuses.has(source.status),`Unexpected status for ${source.id}: ${source.status}`);
  if(source.status==='admitted'&&source.license.startsWith('CC BY')){
   assert.ok(source.license_url?.includes('creativecommons.org/licenses/by/'),`Missing CC BY licence URL for ${source.id}`);
  }
  if(/BY-SA|ShareAlike/i.test(source.license))assert.equal(source.status,'excluded',`${source.id} must remain excluded`);
 }
});

test('every admitted reconstruction source is rights-cleared and manifest-backed',()=>{
 for(const id of admittedSourceIds){
  const source=byId.get(id);assert.ok(source,`Missing manifest source ${id}`);
  assert.ok(['admitted','facts-only'].includes(source.status),`${id} is not admitted/facts-only`);
  assert.ok(!/BY-SA|ShareAlike|unverified|unknown/i.test(source.license),`${id} has disallowed licence: ${source.license}`);
 }
});

test('B grades require multiple independent reusable views and explicit provenance',()=>{
 const b=Object.values(elementEvidence).filter(e=>e.accuracy==='B');
 assert.deepEqual(new Set(b.map(e=>e.id)),new Set(evidenceSummary.bGradeScope));
 for(const e of b){
  assert.ok(e.independentViews>=2,`${e.id} lacks two independent views`);
  assert.ok(e.sourceIds.length>=2,`${e.id} lacks multi-source provenance`);
  for(const id of e.sourceIds){
   const source=byId.get(id);assert.ok(source,`${e.id} references missing source ${id}`);
   assert.ok(['admitted','facts-only'].includes(source.status),`${e.id} references non-admitted source ${id}`);
  }
  assert.equal(e.geometryAccuracy,'C',`${e.id} may not silently promote unregistered coordinates to B`);
 }
});

test('stairs and unregistered geometry remain C',()=>{
 for(const key of ['stairsBasementTo1F','stairs1FTo2F','stairs2FTo3F','columnGrid','floorHeight','partitions']){
  assert.equal(elementEvidence[key].accuracy,'C',`${key} was promoted without sufficient evidence`);
 }
 assert.equal(evidenceSummary.overallAccuracy,'C');
 assert.equal(evidenceSummary.physicalIOSValidation,'NOT VERIFIED');
});
