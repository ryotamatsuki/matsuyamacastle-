import {levels,stairs} from '../data/unifiedLayout.mjs';

// Presentation-only safe roaming rectangles in fitted interior local coordinates.
// Each NPC owns one small zone, keeping it away from stairs, walls, columns and inferred partitions.
// These are not claims about historic visitor circulation.
export const npcZones=[
 {id:'f0-west',floor:0,y:levels[0].y,x0:-7.5,x1:-6.0,z0:-4.0,z1:-1.0},
 {id:'f0-south',floor:0,y:levels[0].y,x0:1.0,x1:3.5,z0:-6.0,z1:-5.0},
 {id:'f0-east',floor:0,y:levels[0].y,x0:3.5,x1:5.0,z0:1.0,z1:4.0},
 {id:'f1-west',floor:1,y:levels[1].y,x0:-7.3,x1:-6.0,z0:-5.5,z1:-1.5},
 {id:'f1-centre',floor:1,y:levels[1].y,x0:-1.5,x1:1.5,z0:2.0,z1:5.5},
 {id:'f1-east',floor:1,y:levels[1].y,x0:3.8,x1:5.0,z0:1.2,z1:5.5},
 {id:'f2-west',floor:2,y:levels[2].y,x0:-6.0,x1:-4.2,z0:-5.8,z1:-2.0},
 {id:'f2-centre',floor:2,y:levels[2].y,x0:-1.5,x1:1.5,z0:2.0,z1:5.2},
 {id:'f2-east',floor:2,y:levels[2].y,x0:4.0,x1:5.0,z0:2.0,z1:5.3},
 {id:'f3-west',floor:3,y:levels[3].y,x0:-5.0,x1:-3.8,z0:-5.4,z1:-1.8},
 {id:'f3-centre',floor:3,y:levels[3].y,x0:-1.5,x1:1.5,z0:-5.0,z1:-2.0},
 {id:'f3-east',floor:3,y:levels[3].y,x0:2.0,x1:4.2,z0:2.0,z1:5.0}
];

export const NPC_RADIUS=.28;
export const WALL_CLEARANCE=.4;
export const NPC_MIN_SEPARATION=.72;
export const PLAYER_AVOID_DISTANCE=1.2;

export function pointInZone(zone,x,z,margin=0){return x>=zone.x0+margin&&x<=zone.x1-margin&&z>=zone.z0+margin&&z<=zone.z1-margin;}
export function onAnyStair(x,z,margin=NPC_RADIUS,floor=null){return stairs.some((s,i)=>(floor===null||i===floor||i===floor-1)&&Math.abs(x-s.x)<=s.width/2+margin&&z>=Math.min(s.z0,s.z1)-margin&&z<=Math.max(s.z0,s.z1)+margin);}
export function zonesForFloor(floor){return npcZones.filter(z=>z.floor===floor);}
