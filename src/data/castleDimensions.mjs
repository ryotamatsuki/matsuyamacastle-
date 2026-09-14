import {elementEvidence,kenSensitivity} from './interiorEvidence.mjs';

// CITY-KEEP gives ken-based proportions. Metric conversion, elevations and exact coordinates remain C.
// B grades in interiorEvidence.mjs describe corroborated morphology/relationships, not surveyed coordinates.
export const KEN = kenSensitivity.defaultMetres;
export const dimensions = {
  ken: KEN,
  kenSensitivity,
  coreWidth: 6 * KEN,
  coreDepth: 4.5 * KEN,
  floorHeight: 3.6,
  floors: [
    {name:'石造穴蔵', y:0, width:9*KEN, depth:7.5*KEN, accuracy:'C', evidenceId:'floor-height'},
    {name:'天守1階', y:3.6, width:9*KEN, depth:7.5*KEN, accuracy:'C', evidenceId:'musha-bashiri-widths'},
    {name:'天守2階', y:7.2, width:7.5*KEN, depth:6*KEN, accuracy:'C', evidenceId:'musha-bashiri-widths'},
    {name:'天守3階', y:10.8, width:6*KEN, depth:4.5*KEN, accuracy:'C-metric/A-ratio', evidenceId:'upper-core-ratio'}
  ],
  // These stairs remain gameplay interpolation. Do not infer historical/visitor-route accuracy from walkability.
  stairs: [
    {x:-3, z0:2.8, z1:-2.8, y0:0, y1:3.6, width:1.5, accuracy:'C', evidenceId:'stair-basement-1f'},
    {x:3, z0:-2.8, z1:2.8, y0:3.6, y1:7.2, width:1.5, accuracy:'C', evidenceId:'stair-1f-2f'},
    {x:-3, z0:2.8, z1:-2.8, y0:7.2, y1:10.8, width:1.5, accuracy:'C', evidenceId:'stair-2f-3f'}
  ],
  start: {x:0, y:-4, z:31},
  evidence: {
    upperCoreRatio: elementEvidence.upperCoreRatio,
    mushaBashiriWidths: elementEvidence.mushaBashiriWidths,
    exposedTimberMorphology: elementEvidence.exposedTimberMorphology,
    windowAssemblyMorphology: elementEvidence.windowAssemblyMorphology,
    topFloorOpenings: elementEvidence.topFloorOpenings,
    columnGrid: elementEvidence.columnGrid,
    floorHeight: elementEvidence.floorHeight,
    partitions: elementEvidence.partitions
  }
};

export const sourceId = 'CITY-KEEP';
export const reconstructionEvidence = elementEvidence;
