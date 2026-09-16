// All coordinates are metres in the original PLATEAU E/up/-N frame.
// Facade bounds: p23809 (lower), p23805 (middle), p23802 (upper).
// Internal elevations and thicknesses are C estimates, NOT CityGML interiors.
export const frame={x:1.43,z:-5.32,angle:-.015};
export function toWorld(x,z){const c=Math.cos(frame.angle),s=Math.sin(frame.angle);return {x:frame.x+c*x-s*z,z:frame.z+s*x+c*z};}
export function toLocal(x,z){const c=Math.cos(frame.angle),s=Math.sin(frame.angle),dx=x-frame.x,dz=z-frame.z;return {x:c*dx+s*dz,z:-s*dx+c*dz};}
export const levels=[
 {name:'石造穴蔵',y:9.2,top:13.2,width:17.58,depth:20.58,thickness:.65,source:'p23809'},
 {name:'天守1階',y:13.2,top:17.6,width:17.58,depth:20.58,thickness:.32,source:'p23809'},
 {name:'天守2階',y:17.6,top:21.8,width:14.52,depth:17.5,thickness:.30,source:'p23805'},
 {name:'天守3階',y:21.8,top:25.2,width:11.93,depth:14.86,thickness:.28,source:'p23802'}
];
export const stairs=levels.slice(0,-1).map((f,i)=>({x:i%2?2.8:-2.8,width:1.5,z0:i%2?-4.5:4.5,z1:i%2?4.5:-4.5,y0:f.y,y1:levels[i+1].y,name:'後補階段・位置と勾配は推定',accuracy:'C'}));
// Photo/document-confirmed aperture TYPES and courtyard-facing entrance.
// Exact bay registration, opening sizes and floor heights remain inferred.
export const openings=[{id:'courtyard-entry',x0:-1.3,x1:1.3,z0:9.3,z1:11.3,y0:9.15,y1:12.1,type:'entrance',evidence:['CITY-KEEP','CITY-PHOTO-KEEP'],accuracy:'B relationship / C coordinates'}];
for(let i=1;i<4;i++){
 const f=levels[i],y0=f.y+1.05,y1=Math.min(f.y+2.55,f.top-.35);
 for(const sign of [-1,1]){
  for(const z of [-4.6,0,4.6])openings.push({id:`window-${i}-EW-${sign}-${z}`,x0:sign*f.width/2-.75,x1:sign*f.width/2+.75,z0:z-.66,z1:z+.66,y0,y1,type:'window',evidence:['CITY-KEEP','DPLA-CCBY-WINDOW-1963','WM-PD-TOP'],accuracy:'B morphology / C coordinates'});
  for(const x of [-3,0,3])openings.push({id:`window-${i}-NS-${sign}-${x}`,x0:x-.66,x1:x+.66,z0:sign*f.depth/2-.75,z1:sign*f.depth/2+.75,y0,y1,type:'window',evidence:['CITY-KEEP','CITY-PHOTO-KEEP','WM-PD-TOP'],accuracy:'B morphology / C coordinates'});
 }
}
// Opening viewpoint: stay in the same Honmaru-plaza area as the user's reference view,
// but shift a few metres east/right and back so the inferred approach sits to the left
// while the linked keep reads clearly in the centre. This is presentation framing, not
// an assertion of an official historic viewpoint.
export const start={...toWorld(-2.0,60.0),y:.05};
// Aim toward the keep's mid-height. Exact framing is C presentation geometry.
export const initialView={yaw:-.04,pitch:.17,accuracy:'C presentation framing'};
export const assumptions={floorElevations:levels.map(f=>f.y),floorHeights:levels.map(f=>f.top-f.y),wallThicknesses:levels.map(f=>f.thickness),courtyardElevation:9.2,datum:'PLATEAU origin elevation 131.72277507 m; local y, not sea-level elevation',basis:'Roof/wall tier envelopes constrain the fitted interior. Heights, courtyard level, thickness, partitions, stair positions and exact window bays are C estimates; no surveyed interior supplied.',entrance:'Courtyard-facing entrance confirmed by CITY-KEEP; exact position and size interpolated. Not a certified current visitor route.',spawn:'Honmaru plaza local (-2.0,60.0), y=0.05. Chosen to match the user reference composition: approach left, linked keep centred; presentation coordinate is C.'};
