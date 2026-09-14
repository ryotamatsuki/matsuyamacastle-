// Ken proportions: CITY-KEEP. Metric conversion and all elevations/coordinates: C.
// All geometry is original. No plans or photographic textures imported.
export const KEN = 1.82;
export const dimensions = {
  ken:KEN, coreWidth:6*KEN, coreDepth:4.5*KEN, floorHeight:3.6,
  floors:[
    {name:'石造穴蔵',y:0,width:9*KEN,depth:7.5*KEN},
    {name:'天守1階',y:3.6,width:9*KEN,depth:7.5*KEN},
    {name:'天守2階',y:7.2,width:7.5*KEN,depth:6*KEN},
    {name:'天守3階',y:10.8,width:6*KEN,depth:4.5*KEN}
  ],
  stairs:[
    {x:-3,z0:2.8,z1:-2.8,y0:0,y1:3.6,width:1.5},
    {x:3,z0:-2.8,z1:2.8,y0:3.6,y1:7.2,width:1.5},
    {x:-3,z0:2.8,z1:-2.8,y0:7.2,y1:10.8,width:1.5}
  ],
  start:{x:0,y:-4,z:31}
};
export const sourceId='CITY-KEEP';
