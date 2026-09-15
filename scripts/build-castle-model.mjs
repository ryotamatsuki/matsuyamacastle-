import fs from 'node:fs/promises';
import {embedMaterials} from './embed-materials.mjs';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {buildPlateau} from '../src/plateau.mjs';
import {buildInterior} from '../src/unifiedInterior.mjs';
import {assumptions} from '../src/data/unifiedLayout.mjs';
import {evidenceSummary} from '../src/data/interiorEvidence.mjs';

// GLTFExporter uses FileReader for Blob buffers; Node provides Blob but not FileReader.
globalThis.FileReader=class{
 readAsArrayBuffer(blob){blob.arrayBuffer().then(v=>{this.result=v;this.onloadend?.({target:this});}).catch(e=>this.onerror?.(e));}
 readAsDataURL(blob){blob.arrayBuffer().then(v=>{this.result='data:'+blob.type+';base64,'+Buffer.from(v).toString('base64');this.onloadend?.({target:this});}).catch(e=>this.onerror?.(e));}
};

const data=JSON.parse(await fs.readFile('public/data/plateau-castle-lod2.json'));
const model=buildPlateau(data,{unified:true});model.name='MatsuyamaCastle_Unified';model.add(buildInterior());model.userData.assumptions=assumptions;
const meshEvidence=[
 {match:/^ExposedBeams_/,accuracy:'B-morphology / geometry-C',evidenceId:'exposed-timber-morphology',sourceIds:['CITY-KEEP','WM-PD-INSIDE','WM-CCBY-ARMOUR-4']},
 {match:/^(NurigomeLattice|RaisedShutters|SlidingEarthenDoors)_/,accuracy:'B-morphology / placement-C',evidenceId:'window-assembly-morphology',sourceIds:['CITY-KEEP','DPLA-CCBY-WINDOW-1963','WM-PD-TOP']},
 {match:/^Exterior3_/,accuracy:'B-relationship / geometry-C',evidenceId:'top-floor-openings',sourceIds:['CITY-KEEP','WM-PD-TOP','WM-CCBY-COURTYARD-1']},
 {match:/^(VisitorStairs|StairHandrails|StairwellGuards)/,accuracy:'C-gameplay-interpolation',evidenceId:'stairs-unregistered',sourceIds:['CITY-KEEP']},
 {match:/^Columns_/,accuracy:'C-unregistered-coordinates',evidenceId:'column-grid',sourceIds:['CITY-KEEP','WM-PD-INSIDE']}
];
model.traverse(o=>{
 if(!o.isMesh)return;
 const tag=meshEvidence.find(e=>e.match.test(o.name));
 if(tag)o.userData={...o.userData,accuracy:tag.accuracy,evidenceId:tag.evidenceId,sourceIds:tag.sourceIds};
});
// Keep provenance deterministic: do not embed generation timestamps because the GLB is byte-reproducible.
model.userData={
 ...model.userData,
 evidenceVersion:evidenceSummary.version,
 overallAccuracy:evidenceSummary.overallAccuracy,
 bGradeScope:evidenceSummary.bGradeScope,
 bGradeMeaning:'corroborated morphology/relationship only; not survey-grade coordinates',
 sourceIds:['PLATEAU-2020',...evidenceSummary.sourceIds,'CITY-PHOTO-KEEP','CITY-PHOTO-OVERVIEW','CITY-PHOTO-STONE','ORIGINAL'],
 materialManifest:'public/data/material-manifest.json',
 evidenceLedger:'docs/INTERIOR_EVIDENCE_MATRIX.md',
 sourceManifest:'public/data/source_manifest.json',
 physicalIOSValidation:evidenceSummary.physicalIOSValidation
};
const glb=await embedMaterials(await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true}));
await fs.mkdir('public/models',{recursive:true});
await fs.writeFile('public/models/matsuyama_keep.glb',Buffer.from(glb));
console.log('Generated matsuyama_keep.glb:',glb.byteLength,'bytes;',model.children.length,'merged meshes');
