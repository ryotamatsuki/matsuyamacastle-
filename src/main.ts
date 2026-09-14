import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Walker,floors,walls,ramps} from './world.mjs';
import {dimensions as D} from './data/castleDimensions.mjs';
import './style.css';
const $=<E extends HTMLElement=HTMLElement>(s:string)=>document.querySelector(s) as E;
const base=import.meta.env.BASE_URL,canvas=$<HTMLCanvasElement>('#scene');
const touchDevice=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;
const scene=new T.Scene();scene.background=new T.Color(0xb9c6c5);scene.fog=new T.Fog(0xb9c6c5,75,210);
const camera=new T.PerspectiveCamera(65,innerWidth/innerHeight,.08,350);camera.rotation.order='YXZ';
const renderer=new T.WebGLRenderer({canvas,antialias:!touchDevice,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,touchDevice?1.35:1.75));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
const hemi=new T.HemisphereLight(0xe1eef5,0x6a6043,2);scene.add(hemi);
const sun=new T.DirectionalLight(0xffefce,3.2);sun.position.set(-28,45,24);sun.castShadow=true;sun.shadow.mapSize.set(touchDevice?1024:2048,touchDevice?1024:2048);Object.assign(sun.shadow.camera,{left:-25,right:25,top:25,bottom:-25,near:1,far:100});sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;scene.add(sun,sun.target);
// Gentle non-shadow fill approximates bounce through windows without claiming baked measured light.
const fill=new T.HemisphereLight(0xc2c8bc,0x342919,.7);scene.add(fill);scene.add(new T.AmbientLight(0xffe4be,.5));
const player=new Walker();let yaw=0,pitch=0,active=false,loaded=false,frameCount=0,elapsed=0,fps=0;
let ignoreMouseMoves=0;let joyX=0,joyY=0;const keys=new Set<string>();let manifest:any[]=[];
const panel=$<HTMLDialogElement>('#panel');
type Hotspot={name:string;floor:number;x:number;z:number;text:string;accuracy:string;sourceIds:string[]};
const hotspots:Hotspot[]=[
 {name:'石造穴蔵',floor:0,x:0,z:5.3,text:'木造天守の下に石造の階があります。入口・柱・梁の構成は公式解説を参照し、石材割付と寸法は推定しています。',accuracy:'C geometry',sourceIds:['CITY-KEEP']},
 {name:'後補の階段',floor:0,x:-3,z:2.8,text:'公式解説は穴蔵から上階への階段を観光用の後補としています。このモデルの階段位置・勾配は歩行のための推定で、江戸期または現況の正確な配置復元ではありません。',accuracy:'C — gameplay interpolation',sourceIds:['CITY-KEEP']},
 {name:'武者走りと梁',floor:1,x:6,z:0,text:'1階武者走り1.5間・2階はその半分という公式比率を反映しています。露出木部の存在・形態は複数の権利確認済み内部写真でも相互確認していますが、梁断面・柱芯・座標は推定です。',accuracy:'A-ratio / B morphology / geometry C',sourceIds:['CITY-KEEP','WM-PD-INSIDE','WM-CCBY-ARMOUR-4']},
 {name:'塗籠角格子・建具',floor:2,x:0,z:-4.8,text:'塗籠角格子、外側の突揚げ板戸、内側の引き土戸という構成は公式記述と権利確認済み写真で相互確認しています。窓数・寸法・bay配置・開き角は推定です。',accuracy:'B morphology / placement C',sourceIds:['CITY-KEEP','DPLA-CCBY-WINDOW-1963','WM-PD-TOP']},
 {name:'最上階',floor:3,x:0,z:3.4,text:'最上階の基本寸法比は6間×4.5間。外向き開口と眺望関係は複数の再利用可能写真で相互確認しています。ここでは1間=1.82mを仮定し、正確な窓bay座標・柱芯・階高はCです。',accuracy:'A-ratio / B relationship / geometry C',sourceIds:['CITY-KEEP','WM-PD-TOP','WM-CCBY-COURTYARD-1']},
 {name:'下見板・破風',floor:-1,x:0,z:14,text:'下の木造2層は黒い下見板、最上階は白い漆喰という公式記述を反映。破風曲線・屋根割付・配置は推定です。',accuracy:'C geometry',sourceIds:['CITY-KEEP']}
];
let currentHotspot:Hotspot|null=null;
function floorIndex(){return player.z>7.1?-1:Math.max(0,Math.min(3,Math.floor((player.y+.05)/3.6)));}
function resetInput(){keys.clear();joyX=joyY=0;$('#joystick i').style.transform='';}
function pause(){active=false;resetInput();if(document.pointerLockElement)document.exitPointerLock();$('#welcome').hidden=false;$('#start').textContent=loaded?'散歩を再開':'モデルを読み込み中…';$('#touch').hidden=true;}
function start(){if(!loaded)return;active=true;$('#welcome').hidden=true;$('#hud').hidden=false;$('#route').hidden=false;$('#reticle').hidden=touchDevice;$('#touch').hidden=!touchDevice;if(!touchDevice){const p=canvas.requestPointerLock();p?.catch(()=>{});}}
$('#start').onclick=start;$('#pause').onclick=pause;
document.addEventListener('keydown',e=>{if(e.code==='Escape'){if(panel.open)panel.close();pause();}if(active&&!panel.open){keys.add(e.code);if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();}});
document.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',resetInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement===canvas)ignoreMouseMoves=2;if(!document.pointerLockElement&&!touchDevice&&active)pause();});
document.addEventListener('mousemove',e=>{if(active&&!panel.open&&document.pointerLockElement===canvas){if(ignoreMouseMoves>0){ignoreMouseMoves--;return;}yaw-=Math.max(-150,Math.min(150,e.movementX))*.0022;pitch=Math.max(-1.3,Math.min(1.3,pitch-Math.max(-150,Math.min(150,e.movementY))*.0022));}});
canvas.onclick=()=>{if(active&&!touchDevice&&!panel.open)canvas.requestPointerLock()?.catch(()=>{});};
function pointerArea(id:string,fn:(dx:number,dy:number,first:boolean,e:PointerEvent)=>void,end:()=>void){
 const el=$(id);let pointer:number|null=null,px=0,py=0;
 el.addEventListener('pointerdown',e=>{if(pointer!==null)return;pointer=e.pointerId;px=e.clientX;py=e.clientY;try{el.setPointerCapture(pointer);}catch{/* Synthetic pointer events have no active browser pointer. */}fn(0,0,true,e);e.preventDefault();});
 el.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;fn(e.clientX-px,e.clientY-py,false,e);px=e.clientX;py=e.clientY;e.preventDefault();});
 const release=(e:PointerEvent)=>{if(pointer===e.pointerId){pointer=null;end();}};
 el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);
}
pointerArea('#joystick',(_dx,_dy,_first,e)=>{const b=$('#joystick').getBoundingClientRect();let x=(e.clientX-b.left-b.width/2)/42,y=(e.clientY-b.top-b.height/2)/42;const n=Math.max(1,Math.hypot(x,y));joyX=x/n;joyY=y/n;$('#joystick i').style.transform='translate('+joyX*32+'px,'+joyY*32+'px)';},()=>{joyX=joyY=0;$('#joystick i').style.transform='';});
pointerArea('#look',(dx,dy)=>{if(active&&!panel.open){yaw-=dx*.004;pitch=Math.max(-1.3,Math.min(1.3,pitch-dy*.004));}},()=>{});
function openPanel(title:string,html:string){resetInput();if(document.pointerLockElement)document.exitPointerLock();$('#panel-content').innerHTML='<h2>'+title+'</h2>'+html;panel.showModal();}
$('#close-panel').onclick=()=>panel.close();panel.addEventListener('close',resetInput);
function escape(s:any){const div=document.createElement('div');div.textContent=String(s);return div.innerHTML;}
function sourceHTML(){return '<p>自作モデル・procedural素材：© Matsuyama Castle 3D Walk contributors。<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>。コードはMIT。松山市の公認・監修を意味しません。</p><p><strong>Accuracy:</strong> モデル全体の正確なジオメトリはC。Bは複数の再利用可能資料で相互確認した形態・関係だけです。</p>'+manifest.map(s=>'<h3>'+escape(s.id)+' / '+escape(s.title)+'</h3><p>'+escape(s.author)+' — '+escape(s.license)+' — status: '+escape(s.status)+'</p><p>'+escape(s.usage)+'<br>'+escape(s.redistribution_status)+'</p><a target="_blank" rel="noopener" href="'+escape(s.original_url)+'">原出典</a>').join('')+'<p>写真ピクセル・既存図面のトレースなし。CC BY-SA、PLATEAU、権利不明素材は今回の復元入力から除外しています。</p><p><a href="'+base+'data/source_manifest.json">出典台帳 JSON</a> · <a href="https://github.com/ryotamatsuki/matsuyamacastle-/blob/main/docs/INTERIOR_EVIDENCE_MATRIX.md" target="_blank" rel="noopener">内部Evidence Matrix</a> · <a href="'+base+'data/dependency-notices.txt">依存ライセンス</a></p>';}
document.querySelectorAll<HTMLButtonElement>('[data-panel]').forEach(b=>b.onclick=()=>{
 const kind=b.dataset.panel;
 if(kind==='sources')openPanel('出典・復元精度・ライセンス',sourceHTML());
 if(kind==='help')openPanel('操作方法','<p>PC：WASDで移動、マウスで見回す、Shiftで早歩き。Escで視点操作を解除します。階段はそのまま歩いて上れます。</p><p>iPhone / iPad：左スティックで移動、画面右側をドラッグして視点を操作します。同時に操作できます。横画面を推奨します。</p><p>現行推定経路：本丸の石段 → 内庭 → 天守正面の入口 → 穴蔵左側 → 1階右側 → 2階左側 → 最上階。階段位置はC — gameplay interpolationで、実在位置を証明するものではありません。</p>');
 if(kind==='about')openPanel('復元について','<p class="note">本コンテンツは文化財の測量データそのものではなく、権利確認済み公開資料と明示した推定に基づく3D復元です。</p><p>松山市公式解説の建築事実に加え、Public Domain / CC BYの内部写真を建築形態の相互確認に利用しています。写真はテクスチャとして使用せず、人物・展示・説明板等もモデル化しません。</p><p>A-ratio：公式資料に明示された間単位の比率。B：複数の適法な独立資料から相互確認した形態・関係。C：推定または未登録座標。モデル全体と正確な内部ジオメトリはCです。</p><p>現在のB範囲は露出木部の形態、窓・格子・板戸・内側建具の構成、最上階の外向き開口と眺望関係です。柱芯、窓bay座標、階高、階段位置・方向、間仕切りはCのままです。</p><p>1間=1.82mは換算仮定です。実測値ではありません。</p><p><a href="https://github.com/ryotamatsuki/matsuyamacastle-/blob/main/docs/ACCURACY.md">部位別の復元精度</a> · <a href="https://github.com/ryotamatsuki/matsuyamacastle-/blob/main/docs/INTERIOR_EVIDENCE_MATRIX.md">Evidence Matrix</a> · <a href="'+base+'models/matsuyama_keep.glb" download>3Dモデル（GLB）</a></p>');
 if(kind==='settings'){openPanel('設定','<label>光 <select id="light"><option value="day">昼</option><option value="evening">夕方</option></select></label><label>描画品質 <select id="quality"><option value="standard">標準</option><option value="low">軽量</option></select></label><button id="reset">本丸へ戻る</button><p>フロア概略図は本モデルの歩行領域から独自描画しています。実物の平面図ではありません。</p><canvas id="floor-map" width="420" height="310"></canvas>');$('#light').onchange=()=>{const evening=$<HTMLSelectElement>('#light').value==='evening';sun.color.set(evening?0xffb573:0xffefce);sun.position.set(-28,evening?15:45,24);renderer.toneMappingExposure=evening?1:1.18;};$('#quality').onchange=()=>{const low=$<HTMLSelectElement>('#quality').value==='low';renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,touchDevice?1.35:1.75));renderer.shadowMap.enabled=!low;};$('#reset').onclick=()=>{player.reset();yaw=pitch=0;panel.close();};drawMap();}
});
function drawMap(){const c=$<HTMLCanvasElement>('#floor-map'),ctx=c.getContext('2d')!;const i=floorIndex(),y=i<0?player.y:D.floors[i].y;ctx.fillStyle='#dce0d1';ctx.fillRect(0,0,420,310);const sz=i<0?6:17,ox=210,oz=i<0?0:155;ctx.fillStyle='#929b80';for(const f of floors.filter(f=>Math.abs(f.y-y)<.2))ctx.fillRect(ox+f.x0*sz,oz+f.z0*sz,(f.x1-f.x0)*sz,(f.z1-f.z0)*sz);ctx.fillStyle='#855e35';for(const r of ramps.filter(r=>r.y0===y||r.y1===y))ctx.fillRect(ox+(r.x-r.width/2)*sz,oz+Math.min(r.z0,r.z1)*sz,r.width*sz,Math.abs(r.z1-r.z0)*sz);ctx.fillStyle='#a53327';ctx.beginPath();ctx.arc(ox+player.x*sz,oz+player.z*sz,4,0,Math.PI*2);ctx.fill();}
$('#hotspot').onclick=()=>{if(currentHotspot)openPanel(currentHotspot.name,'<p>'+currentHotspot.text+'</p><p><strong>Accuracy:</strong> '+escape(currentHotspot.accuracy)+'</p><p><strong>Evidence:</strong> '+currentHotspot.sourceIds.map(escape).join(', ')+'</p><p>詳細はACCURACY.md / INTERIOR_EVIDENCE_MATRIX.mdを参照。</p>');};
// Original distant silhouette. Explicitly conceptual, no surveyed or third-party map inputs.
const landscape=new T.Group();landscape.name='ConceptualSurroundings';
const terrain=new T.Mesh(new T.CylinderGeometry(36,80,25,40),new T.MeshStandardMaterial({color:0x52674a,roughness:1}));terrain.position.set(0,-17,10);landscape.add(terrain);
const cityGeo=new T.BoxGeometry(1,1,1),cityMat=new T.MeshStandardMaterial({color:0x9faaa6,roughness:1});
const city=new T.InstancedMesh(cityGeo,cityMat,150),dummy=new T.Object3D();let seed=8401;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
for(let i=0;i<150;i++){const angle=random()*Math.PI*2,r=70+random()*90,h=3+random()*10;dummy.position.set(Math.cos(angle)*r,-28+h/2,Math.sin(angle)*r);dummy.scale.set(3+random()*5,h,3+random()*5);dummy.updateMatrix();city.setMatrixAt(i,dummy.matrix);}landscape.add(city);scene.add(landscape);
const loader=new GLTFLoader();
Promise.all([loader.loadAsync(base+'models/matsuyama_keep.glb'),fetch(base+'data/source_manifest.json').then(r=>{if(!r.ok)throw Error('source_manifest '+r.status);return r.json();})]).then(([gltf,sources])=>{
 manifest=sources;gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){m.side=T.DoubleSide;if(m instanceof T.MeshStandardMaterial){const name=m.name;m.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 vOriginalPos;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvOriginalPos = position;');shader.fragmentShader='varying vec3 vOriginalPos;\n'+shader.fragmentShader;const wood=['wood','edge','black'].includes(name);const expr=wood?'0.9 + 0.10*sin(vOriginalPos.x*130.0 + sin(vOriginalPos.z*2.0)*4.0)':'0.97 + 0.03*sin(dot(vOriginalPos,vec3(97.0,137.0,79.0)))';shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb *= '+expr+';');};m.customProgramCacheKey=()=>name;}}}});
 scene.add(gltf.scene);loaded=true;$('#start').removeAttribute('disabled');$('#start').textContent='散歩をはじめる';$('#load-status').textContent='本丸 → 穴蔵 → 1階 → 2階 → 3階';
}).catch(e=>{console.error(e);$('#load-status').textContent='読み込みに失敗しました。通信を確認して再読み込みしてください。';});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
let last=performance.now();
function frame(now:number){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;
 if(active&&!panel.open){
 let x=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+joyX,z=(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0)+joyY;const n=Math.max(1,Math.hypot(x,z));x/=n;z/=n;const speed=keys.has('ShiftLeft')?4:2.3;player.step((x*Math.cos(yaw)+z*Math.sin(yaw))*speed,(-x*Math.sin(yaw)+z*Math.cos(yaw))*speed,dt);
 camera.position.set(player.x,player.y+1.62,player.z);camera.rotation.set(pitch,yaw,0,'YXZ');
 const i=floorIndex();$('#location').textContent=i<0?(player.y<-1?'本丸広場':'天守丸・内庭'):D.floors[i].name;
 $('#route').textContent=i<0?'石段を上り、内庭から天守へ':i===0?'左の階段へ · C推定経路':i===1?'右奥の階段から2階へ · C推定経路':i===2?'左手前の階段から3階へ · C推定経路':'最上階 · Bは開口関係、座標はC';
 currentHotspot=hotspots.find(h=>h.floor===i&&Math.hypot(h.x-player.x,h.z-player.z)<2.8)||null;
 $('#hotspot').hidden=!currentHotspot;if(currentHotspot)$('#hotspot').textContent='ⓘ '+currentHotspot.name;
 }else if(!$('#welcome').hidden&&!panel.open){camera.position.set(25,14,36);camera.lookAt(0,6,0);}
 frameCount++;elapsed+=dt;if(elapsed>=1){fps=Math.round(frameCount/elapsed);$('#fps').textContent=fps+' FPS';frameCount=0;elapsed=0;}
 renderer.render(scene,camera);
}
requestAnimationFrame(frame);
// Read-only diagnostics are available publicly; test mutation API only in CI build.
(window as any).__castle={get ready(){return loaded},get state(){return {x:player.x,y:player.y,z:player.z,yaw,pitch,active,fps,meshes:renderer.info.render.calls}},get floor(){return floorIndex()}};
if(import.meta.env.VITE_TEST==='1')(window as any).__walkTest={look:(y:number,p:number)=>{yaw=y;pitch=p;},step:(x:number,z:number,dt:number)=>player.step(x,z,dt),reset:()=>player.reset(),set:(x:number,y:number,z:number)=>{player.x=x;player.y=y;player.z=z;},start:()=>{active=true;$('#welcome').hidden=true;$('#hud').hidden=false;$('#touch').hidden=!touchDevice;},world:{floors,walls,ramps}};
