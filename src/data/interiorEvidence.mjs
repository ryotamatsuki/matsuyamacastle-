// Rights-clean reconstruction evidence. This file contains observations and confidence only;
// it does not embed or reproduce source photographs. B never implies survey-grade geometry.
export const evidenceVersion = '2026-09-15-b1';

export const admittedSourceIds = [
  'CITY-KEEP',
  'WM-PD-INSIDE',
  'WM-PD-TOP',
  'WM-CCBY-COURTYARD-1',
  'WM-CCBY-ARMOUR-4',
  'DPLA-CCBY-WINDOW-1963'
];

export const kenSensitivity = {
  defaultMetres: 1.82,
  candidatesMetres: [1.80, 20/11, 1.82],
  accuracy: 'C',
  note: 'Metric ken is not measured at Matsuyama Castle; 20/11 m is the conventional 6-shaku reference and is used only for sensitivity.'
};

export const elementEvidence = {
  upperCoreRatio: {
    id: 'upper-core-ratio',
    floor: '3F/top',
    claim: 'Top basic frame is 6 ken by 4.5 ken.',
    accuracy: 'A-ratio',
    geometryAccuracy: 'C-metric',
    sourceIds: ['CITY-KEEP'],
    independentViews: 0,
    note: 'Direct textual dimension in ken; metre conversion remains assumed.'
  },
  mushaBashiriWidths: {
    id: 'musha-bashiri-widths',
    floor: '1F/2F',
    claim: '1F outer corridor is 1.5 ken; 2F is half that width.',
    accuracy: 'A-ratio',
    geometryAccuracy: 'C-metric',
    sourceIds: ['CITY-KEEP'],
    independentViews: 0,
    note: 'Direct textual width ratios; detailed circulation and bay layout are not established.'
  },
  exposedTimberMorphology: {
    id: 'exposed-timber-morphology',
    floor: 'interior / musha-bashiri',
    claim: 'Exposed structural timber/beams are part of the visible interior character.',
    accuracy: 'B',
    geometryAccuracy: 'C',
    sourceIds: ['CITY-KEEP', 'WM-PD-INSIDE', 'WM-CCBY-ARMOUR-4'],
    independentViews: 2,
    note: 'B applies to visible morphology/presence only. Exact beam section, spacing, species and coordinates remain C.'
  },
  windowAssemblyMorphology: {
    id: 'window-assembly-morphology',
    floor: 'generic keep window',
    claim: 'Keep windows use plastered lattice with an exterior raised board shutter and an interior sliding earthen door.',
    accuracy: 'B',
    geometryAccuracy: 'C',
    sourceIds: ['CITY-KEEP', 'DPLA-CCBY-WINDOW-1963', 'WM-PD-TOP'],
    independentViews: 2,
    note: 'B is limited to assembly morphology. Number, bay assignment, size, sill height, shutter angle and floor-specific placement remain C.'
  },
  topFloorOpenings: {
    id: 'top-floor-openings',
    floor: '3F/top',
    claim: 'The top floor has outward-looking perimeter openings consistent with its observation role.',
    accuracy: 'B',
    geometryAccuracy: 'C',
    sourceIds: ['WM-PD-TOP', 'WM-CCBY-COURTYARD-1', 'CITY-KEEP'],
    independentViews: 2,
    note: 'B covers presence/orientation relationship only; exact bay count and opening coordinates are not registered.'
  },
  columnGrid: {
    id: 'column-grid',
    floor: 'all',
    claim: 'Exact column centre coordinates and sections.',
    accuracy: 'C',
    geometryAccuracy: 'C',
    sourceIds: ['CITY-KEEP', 'WM-PD-INSIDE'],
    independentViews: 1,
    note: 'Text constrains the basic upper frame, but photographic camera registration is not sufficient for exact column centres.'
  },
  stairsBasementTo1F: {
    id: 'stair-basement-1f', floor: 'B1→1F', claim: 'Exact modern visitor stair start/end/direction.', accuracy: 'C', geometryAccuracy: 'C',
    sourceIds: ['CITY-KEEP'], independentViews: 0, note: 'Later visitor stair is documented, but this project has not established exact location/direction from two reusable independent views.'
  },
  stairs1FTo2F: {
    id: 'stair-1f-2f', floor: '1F→2F', claim: 'Exact stair start/end/direction.', accuracy: 'C', geometryAccuracy: 'C',
    sourceIds: [], independentViews: 0, note: 'Gameplay interpolation; no B-grade location evidence admitted.'
  },
  stairs2FTo3F: {
    id: 'stair-2f-3f', floor: '2F→3F', claim: 'Exact stair start/end/direction.', accuracy: 'C', geometryAccuracy: 'C',
    sourceIds: [], independentViews: 0, note: 'Gameplay interpolation; no B-grade location evidence admitted.'
  },
  floorHeight: {
    id: 'floor-height', floor: 'all', claim: '3.6 m floor-to-floor height used by the model.', accuracy: 'C', geometryAccuracy: 'C',
    sourceIds: [], independentViews: 0, note: 'Not measured from reusable evidence.'
  },
  partitions: {
    id: 'partitions', floor: 'all', claim: 'Room boundaries and internal partitions.', accuracy: 'C', geometryAccuracy: 'C',
    sourceIds: ['CITY-KEEP'], independentViews: 0, note: 'Official text establishes ceilings/tatami/tokonoma in the core but not a reusable exact plan.'
  }
};

export const evidenceSummary = {
  version: evidenceVersion,
  overallAccuracy: 'C',
  bGradeScope: Object.values(elementEvidence).filter(e=>e.accuracy==='B').map(e=>e.id),
  cGradeGeometry: Object.values(elementEvidence).filter(e=>e.geometryAccuracy==='C').map(e=>e.id),
  sourceIds: admittedSourceIds,
  physicalIOSValidation: 'NOT VERIFIED',
  statement: 'B grades are morphology/relationship grades only; exact unregistered geometry remains C.'
};
