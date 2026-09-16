// Walkable approach from the linked-keep courtyard to the Honmaru main plaza.
// Coordinates are metres in the SAME fitted local frame as unifiedLayout.mjs.
// Horizontal registration follows PLATEAU + georeferenced GSI aerial imagery.
// Gate relationships/directions follow Matsuyama City / official castle descriptions;
// exact gate centres, sidewall geometry and vertical closure remain C estimates.

export const routeEvidence={
 version:'2026-09-16-hondan-route-v3',
 sourceIds:['CITY-SUJIGANE','CITY-3MON','CITY-2MON','CITY-1MON','CITY-SUJIGANE-EAST-WALL','CASTLE-OFFICIAL-HONDAN'],
 officialFacts:[
  '筋鉄門は天守と小天守の間の櫓門で、三ノ門とともに天守南側の枡形を構成する。',
  '三ノ門を過ぎて天守石垣下を右折すると筋鉄門（内庭入口）に達する。',
  '一ノ門は本壇入口に西面し、一ノ門と二ノ門の間は枡形を構成する。',
  '一ノ門内で左折して九段の石段を上ると二ノ門に至る。',
  '本壇は本丸より約8m高く、出入口は一ノ門の1か所である。'
 ],
 coordinateAccuracy:'C — best-fit registration to PLATEAU envelope and GSI aerial; not survey-grade gate centres',
 verticalAccuracy:'C — courtyard y=9.2 and Honmaru datum near y=0 are retained. Only the official nine-step count is explicit; the lower rise is a continuous grade, not an asserted historical stair count.',
 visualPolicy:'Do not render an invented monumental exposed stair or a new monumental retaining wall from the Honmaru plaza. Keep the lower C-grade closure narrow, west-offset and bounded only by low grade-following sidewalls.'
};

// Best-fit opening at the west end of the long south-courtyard wall. The ~3m clear
// width matches the registered 筋鉄門 frontage scale, while the exact centre is not
// asserted as surveyed. surfaceTriangles() uses this same box for render + collision.
export const gateOpenings=[{
 id:'sujigane-courtyard-exit',x0:-3.65,x1:-0.65,z0:15.55,z1:17.75,y0:8.92,y1:12.35,
 type:'gate',evidence:['CITY-SUJIGANE','CITY-SUJIGANE-EAST-WALL','PLATEAU-2020'],
 accuracy:'B relationship / C coordinates',note:'PLATEAU/GSI best-fit at the courtyard south-west gate junction; exact gate centre is inferred.'
}];

const platforms=[
 {name:'筋鉄門敷・内庭側',x0:-3.45,x1:-0.85,z0:14.65,z1:18.25,y:9.2,accuracy:'C'},
 {name:'筋鉄門東塀沿い折れ',x0:-3.45,x1:4.85,z0:17.65,z1:19.55,y:9.2,accuracy:'C'},
 {name:'三ノ門側折れ',x0:2.65,x1:4.85,z0:18.75,z1:22.15,y:9.2,accuracy:'C'},
 {name:'二ノ門前枡形',x0:.25,x1:4.85,z0:21.55,z1:23.0,y:9.2,accuracy:'C'},
 {name:'一ノ門内枡形_C',x0:-6.35,x1:2.95,z0:27.05,z1:30.05,y:7.85,accuracy:'B relationship / C footprint'},
 {name:'一ノ門敷・西面取付_C',x0:-6.35,x1:-3.55,z0:27.85,z1:29.55,y:7.85,accuracy:'B orientation / C coordinates'}
];
function steps(name,count,x0,x1,z0,depth,y0,drop,accuracy='C'){
 return Array.from({length:count},(_,i)=>({name:`${name}-${i+1}`,x0,x1,z0:z0+i*depth,z1:z0+(i+1)*depth,y:y0-(i+1)*drop,accuracy,step:i+1,stepCount:count}));
}
// Matsuyama City's 二ノ門 description records nine stone steps. The exact tread/riser
// dimensions are not published in the source used here, so 0.45m/0.15m are C geometry.
export const documentedNineSteps=steps('二ノ門九段',9,.25,2.95,23.0,.45,9.2,.15,'A count / C geometry');

// The former 39-step interpolation was visually misleading: no source supports an
// exposed monumental stair from the plaza. Keep the same vertical closure, but move it
// west of the frontal axis and represent it as one continuous, narrow C-grade approach.
export const approachRamps=[{
 name:'一ノ門外取付坂_C',x0:-6.35,x1:-3.75,z0:30.05,z1:44.6,y0:7.85,y1:.05,
 accuracy:'C — vertical/plan interpolation; no historical slope or stair-count claim',
 evidence:['CITY-1MON','CASTLE-OFFICIAL-HONDAN']
}];

function gradeY(r,z){const t=(z-r.z0)/(r.z1-r.z0);return r.y0+(r.y1-r.y0)*t;}
const lower=approachRamps[0];
// Low sidewalls follow the grade instead of filling the entire wedge down to the plaza
// datum. This deliberately avoids inventing a monumental triangular rampart face. Each
// wall is only ~0.55m thick, extends ~0.55m below the walk surface and ~1.15m above it.
// Segment breaks reduce the impression of a single engineered slab. All dimensions are C.
const wallBreaks=[30.05,34.4,38.8,44.6];
function sidewall(side,i,x0,x1,z0,z1){
 const y0=gradeY(lower,z0),y1=gradeY(lower,z1);
 return {name:`一ノ門外取付坂・${side}低石垣_C-${i+1}`,x0,x1,z0,z1,bottom0:y0-.55,bottom1:y1-.55,top0:y0+1.15,top1:y1+1.15,accuracy:'C low grade-following sidewall; not survey geometry'};
}
export const approachRetainingWalls=wallBreaks.slice(0,-1).flatMap((z0,i)=>{
 const z1=wallBreaks[i+1];return [
  sidewall('西側',i,-6.9,-6.35,z0,z1),
  sidewall('東側',i,-3.75,-3.2,z0,z1)
 ];
});

export const mainPlaza={name:'本丸広場接続面',x0:-14,x1:18,z0:44.6,z1:78,y:.05,accuracy:'C vertical / georeferenced horizontal',render:false};
export const approachSurfaces=[...platforms,...documentedNineSteps,mainPlaza];

function rampPoint(r,z){
 const t=(z-r.z0)/(r.z1-r.z0);return [(r.x0+r.x1)/2,z,r.y0+(r.y1-r.y0)*t];
}
// Unit-test route. Movement uses groundAt(), never a teleport or direct y assignment.
export const routeWaypoints=[
 [-1.9,14.9],[-1.9,16.65],[-1.9,18.45],[3.7,18.45],[3.7,21.75],[1.6,22.55],
 ...documentedNineSteps.map(s=>[(s.x0+s.x1)/2,(s.z0+s.z1)/2]),
 [1.6,28.45],[-4.95,28.45],[-5.05,30.05],
 ...[32.5,35.5,38.5,41.5,44.55].map(z=>rampPoint(lower,z)),
 [-5.05,55.0]
].map(p=>p.slice(0,2));
