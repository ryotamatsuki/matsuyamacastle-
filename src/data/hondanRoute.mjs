// Walkable approach from the linked-keep courtyard to the Honmaru main plaza.
// Coordinates are metres in the SAME fitted local frame as unifiedLayout.mjs.
// Horizontal registration follows PLATEAU + georeferenced GSI aerial imagery.
// Gate relationships/directions follow Matsuyama City / official castle descriptions;
// exact gate centres, step geometry and vertical closure are C estimates.

export const routeEvidence={
 version:'2026-09-16-hondan-route-v1',
 sourceIds:['CITY-SUJIGANE','CITY-3MON','CITY-2MON','CITY-1MON','CITY-SUJIGANE-EAST-WALL','CASTLE-OFFICIAL-HONDAN'],
 officialFacts:[
  '筋鉄門は天守と小天守の間の櫓門で、三ノ門とともに天守南側の枡形を構成する。',
  '三ノ門を過ぎて天守石垣下を右折すると筋鉄門（内庭入口）に達する。',
  '三ノ門南櫓の西側には筋鉄門東塀が接続する。',
  '本壇は本丸より約8m高く、出入口は一ノ門の1か所である。'
 ],
 coordinateAccuracy:'C — best-fit registration to PLATEAU envelope and GSI aerial; not survey-grade gate centres',
 verticalAccuracy:'C — existing courtyard y=9.2 is retained; the final 0.05m plaza datum prioritises a continuous visible connection to the existing aerial plane.'
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
 {name:'二ノ門下踊場',x0:.25,x1:2.95,z0:27.05,z1:29.0,y:7.85,accuracy:'C'},
];
function steps(name,count,x0,x1,z0,depth,y0,drop,accuracy='C'){
 return Array.from({length:count},(_,i)=>({name:`${name}-${i+1}`,x0,x1,z0:z0+i*depth,z1:z0+(i+1)*depth,y:y0-(i+1)*drop,accuracy,step:i+1,stepCount:count}));
}
// Matsuyama City's 二ノ門 description records nine stone steps. The exact tread/riser
// dimensions are not published in the source used here, so 0.45m/0.15m are C geometry.
export const documentedNineSteps=steps('二ノ門九段',9,.25,2.95,23.0,.45,9.2,.15,'A count / C geometry');
// Remaining descent closes the current 9.2m model datum onto the existing GSI plane.
// Count/shape are deliberately C and should be replaced if survey-grade route geometry is obtained.
export const inferredLowerSteps=steps('一ノ門外石段',39,.25,2.95,29.0,.40,7.85,.20,'C — continuity interpolation');
export const mainPlaza={name:'本丸広場接続面',x0:-14,x1:18,z0:44.6,z1:78,y:.05,accuracy:'C vertical / georeferenced horizontal'};
export const approachSurfaces=[...platforms,...documentedNineSteps,...inferredLowerSteps,mainPlaza];

// Unit-test route. All points are local x/z; no teleporting is permitted.
export const routeWaypoints=[
 [-1.9,14.9],[-1.9,16.65],[-1.9,18.45],[3.7,18.45],[3.7,21.75],[1.6,22.55],
 ...documentedNineSteps.map(s=>[(s.x0+s.x1)/2,(s.z0+s.z1)/2]),
 [1.6,28.0],
 ...inferredLowerSteps.map(s=>[(s.x0+s.x1)/2,(s.z0+s.z1)/2]),
 [1.6,46.0],[1.6,55.0]
];
