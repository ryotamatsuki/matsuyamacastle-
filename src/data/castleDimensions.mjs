import {elementEvidence,kenSensitivity} from './interiorEvidence.mjs';

// CITY-KEEP gives ken-based proportions. Metric conversion, elevations and exact coordinates remain C.
// B grades in interiorEvidence.mjs describe corroborated morphology/relationships, not surveyed coordinates.
export const KEN = kenSensitivity.defaultMetres;
import {levels,stairs,start} from './unifiedLayout.mjs';
export const dimensions = {ken:KEN,kenSensitivity,coreWidth:levels[3].width,coreDepth:levels[3].depth,floors:levels,stairs,start};
export const sourceId='CITY-KEEP';
export const reconstructionEvidence=elementEvidence;
