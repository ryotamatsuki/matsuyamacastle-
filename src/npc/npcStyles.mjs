export const NPC_STYLES=[
 {id:'navy-beige',skin:0xd8b08c,hair:0x2f261f,top:0x34475c,pants:0xb7aa8a,shoes:0x3c332c,height:1.72,bodyScale:1.00,hat:false,bag:true},
 {id:'white-denim',skin:0xe0b995,hair:0x3b3028,top:0xd9d8d1,pants:0x50657b,shoes:0x4a423c,height:1.64,bodyScale:.96,hat:false,bag:false},
 {id:'gray-black',skin:0xc99c78,hair:0x232323,top:0x686b67,pants:0x2f3132,shoes:0x292723,height:1.78,bodyScale:1.04,hat:true,bag:false},
 {id:'red-beige',skin:0xe1b18d,hair:0x4a3528,top:0x8d4e46,pants:0xb6a789,shoes:0x4d3b32,height:1.58,bodyScale:.94,hat:false,bag:true},
 {id:'green-denim',skin:0xd3a784,hair:0x2b2724,top:0x5d7059,pants:0x4a6174,shoes:0x3a332c,height:1.69,bodyScale:1.01,hat:true,bag:true},
 {id:'mustard-dark',skin:0xe0b794,hair:0x5a4431,top:0x9b8651,pants:0x47453f,shoes:0x302d29,height:1.61,bodyScale:.98,hat:false,bag:false},
 {id:'blue-gray',skin:0xc89672,hair:0x1f1c19,top:0x536f82,pants:0x6b6961,shoes:0x2f2d2a,height:1.81,bodyScale:1.05,hat:false,bag:true},
 {id:'cream-olive',skin:0xdbac87,hair:0x3f332a,top:0xc8bfa7,pants:0x626851,shoes:0x423a33,height:1.55,bodyScale:.93,hat:true,bag:false}
];
export function styleFor(index){const base=NPC_STYLES[index%NPC_STYLES.length];return {...base,id:base.id+'-'+index};}
