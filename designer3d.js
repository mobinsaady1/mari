import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

const mount = document.querySelector('#maede3dMount');
if (!mount) throw new Error('MAEDE 3D viewer mount is missing');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x21172c);
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 1.98, 7.8);
camera.lookAt(0, 1.82, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.domElement.style.display='block'; renderer.domElement.style.width='100%'; renderer.domElement.style.height='100%'; renderer.domElement.style.cursor='grab'; renderer.domElement.style.touchAction='pan-y';
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xfff5fb, 0x49344f, 2.05));
const key = new THREE.DirectionalLight(0xffe8f3, 4.0); key.position.set(-3.5, 6, 4.5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left=-4; key.shadow.camera.right=4; key.shadow.camera.top=5; key.shadow.camera.bottom=-3; key.shadow.bias=-0.00015; scene.add(key);
const rim = new THREE.DirectionalLight(0xd5b8ff, 3.1); rim.position.set(4, 3.5, -4); scene.add(rim);
const fill = new THREE.PointLight(0xffcce4, 26, 14); fill.position.set(0, 3, 3); scene.add(fill);
const floorMat = new THREE.MeshStandardMaterial({color:0xeadff0, roughness:.82, metalness:0});
const floor = new THREE.Mesh(new THREE.CircleGeometry(4.2, 80), floorMat); floor.rotation.x=-Math.PI/2; floor.position.y=-.015; floor.receiveShadow=true; scene.add(floor);
const plinthMat = new THREE.MeshStandardMaterial({color:0xf7eff9, roughness:.28, metalness:.12});
const plinth = new THREE.Mesh(new THREE.CylinderGeometry(.9,.98,.12,72), plinthMat); plinth.position.y=.045; plinth.receiveShadow=true; plinth.castShadow=true; scene.add(plinth);
const plinthEdge = new THREE.Mesh(new THREE.TorusGeometry(.94,.018,10,72), new THREE.MeshStandardMaterial({color:0xc9a6df, metalness:.55, roughness:.25})); plinthEdge.rotation.x=Math.PI/2; plinthEdge.position.y=.105; scene.add(plinthEdge);

{ const pm=new THREE.PMREMGenerator(renderer), env=new THREE.Scene(); env.background=new THREE.Color(0x3a2a4a);
  const box=(p,s,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(...s),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(6)}));m.position.set(...p);env.add(m);};
  box([0,6,0],[10,.2,10],0xffffff); box([-7,2,3],[.2,6,6],0xffd9ec); box([7,2,-3],[.2,6,6],0xd5c4ff);
  scene.environment=pm.fromScene(env,0.04).texture; scene.environmentIntensity=.6; }
const stage = new THREE.Group(); scene.add(stage);
const avatar = new THREE.Group(); stage.add(avatar);
const mannequinAsset = new THREE.Group(); avatar.add(mannequinAsset);
const outfit = new THREE.Group(); avatar.add(outfit);
const jewelry = new THREE.Group(); avatar.add(jewelry);
const accessory = new THREE.Group(); avatar.add(accessory);
const skinMat = new THREE.MeshPhysicalMaterial({ color: 0xf0c0a8, roughness: .52, metalness: 0.0, sheen: .22, sheenRoughness: .72, clearcoat: .035, clearcoatRoughness: .55 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x43263e, roughness: .55 });
const hairHighlightMat = new THREE.MeshStandardMaterial({ color: 0x68415e, roughness: .6 });
const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5cf78, metalness: .78, roughness: .22 });
const accessoryGoldMat = new THREE.MeshStandardMaterial({ color: 0xf5cf78, metalness: .82, roughness: .2 });
const gemMat = new THREE.MeshPhysicalMaterial({ color: 0xc6a0e8, metalness: .18, roughness: .12, clearcoat: 1, clearcoatRoughness: .08 });
const pearlMat = new THREE.MeshPhysicalMaterial({ color: 0xfff0e6, metalness: .05, roughness: .16, clearcoat: 1, clearcoatRoughness: .08, iridescence: .9, iridescenceIOR: 1.4, sheen: .6, sheenColor: new THREE.Color(0xffd6f0) });
const shoeMat = new THREE.MeshStandardMaterial({ color: 0x493047, roughness: .32 });
const bagMat = new THREE.MeshStandardMaterial({ color: 0xc6a0e8, roughness: .34, metalness: .06 });
const bagTrim = new THREE.MeshStandardMaterial({ color: 0x865bb4, metalness: .35, roughness: .3 });
let dressColor = '#b995ed';
let dressLight = '#eadcff';
let dressDark = '#8c5ac8';
let fabricStyle = 'silk';
let selectedModel = 'ballgown';
let selectedSkirtShape = 'auto';
let necklineStyle = 'sweetheart';
let sleeveStyle = 'puff';
let dressLength = 'long';
let necklaceStyle = 'pendant';
let bagStyle = 'classic';
let bagColor = '#c6a0e8';
let bagDark = '#865bb4';
let earringStyle='drop', crownStyle='tiara', glassesStyle='cat', capeStyle='royal', beltStyle='ornate', braceletStyle='stack';
let accessoryTone='#c6a0e8', accessoryMetal='#f5cf78', gloveStyle='opera';
let gloveColor = '#f3e7f5';
let hairColor = '#43263e';
let selectedAccessories = new Set();
let hairStyle = 'down'; const dressExtras = new Set();
let autoRotate = false;
let targetRotation = 0;
let dragging = false;
let lastX = 0;

function makeFabricBump() {
  // A softer, irregular woven normal map: subtle warp/weft plus deterministic fibre noise.
  const canvas=document.createElement('canvas'); canvas.width=256; canvas.height=256;
  const ctx=canvas.getContext('2d');
  let seed=91273; const rand=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  const image=ctx.createImageData(256,256);
  for(let i=0;i<image.data.length;i+=4){const n=116+Math.floor(rand()*24);image.data[i]=n;image.data[i+1]=n;image.data[i+2]=n;image.data[i+3]=255;}
  ctx.putImageData(image,0,0);
  for(let i=0;i<256;i+=3){
    ctx.strokeStyle=(i%6===0)?'rgba(255,255,255,.12)':'rgba(25,12,35,.07)';
    ctx.lineWidth=(i%9===0)?1.2:.6;ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+2,256);ctx.stroke();
    ctx.strokeStyle=(i%6===0)?'rgba(25,12,35,.08)':'rgba(255,255,255,.1)';
    ctx.lineWidth=(i%9===0)?1.1:.55;ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(256,i+1);ctx.stroke();
  }
  const tex=new THREE.CanvasTexture(canvas); tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(2.4,3.2); tex.needsUpdate=true; return tex;
}
const fabricBump=makeFabricBump();
let activePatternTexture=null;
function makeFabricPattern(style) {
  const canvas=document.createElement('canvas'); canvas.width=256; canvas.height=256;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,256,256);
  if(style==='satin' || style==='silk') {
    // Fine diagonal fibres and soft irregular highlights make smooth fabrics read as woven cloth.
    for(let i=-256;i<512;i+=8) {
      ctx.strokeStyle=style==='satin'?'rgba(120,90,150,.055)':'rgba(120,90,150,.035)';
      ctx.lineWidth=style==='satin'?1.4:.8;ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+128,256);ctx.stroke();
    }
    for(let i=0;i<22;i++) {
      const x=(i*73)%256, y=(i*109)%256;
      const grad=ctx.createRadialGradient(x,y,1,x,y,24);
      grad.addColorStop(0,style==='satin'?'rgba(255,255,255,.11)':'rgba(255,255,255,.065)');
      grad.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=grad;ctx.fillRect(x-24,y-24,48,48);
    }
  } else if(style==='floral') {
    for(let y=18;y<256;y+=64) for(let x=18;x<256;x+=64) {
      ctx.save(); ctx.translate(x,y); ctx.strokeStyle='rgba(104,68,133,.24)'; ctx.lineWidth=2;
      for(let k=0;k<5;k++){ctx.rotate(Math.PI*2/5);ctx.beginPath();ctx.ellipse(0,-9,5,10,0,0,Math.PI*2);ctx.stroke();}
      ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fillStyle='rgba(190,143,82,.42)';ctx.fill();
      ctx.restore();
    }
  } else if(style==='glitter') {
    let seed=7391; const rand=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
    for(let i=0;i<190;i++){const x=rand()*256,y=rand()*256,r=.35+rand()*1.5;ctx.fillStyle=`rgba(255,255,255,${.28+rand()*.58})`;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
  } else if(style==='lace') {
    ctx.strokeStyle='rgba(110,73,135,.19)';ctx.lineWidth=1.2;
    for(let y=-32;y<288;y+=24) for(let x=-32;x<288;x+=24){ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(x-7,y-7);ctx.lineTo(x+7,y+7);ctx.moveTo(x+7,y-7);ctx.lineTo(x-7,y+7);ctx.stroke();}
  }
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(2,2);tex.anisotropy=4;tex.needsUpdate=true;return tex;
}
function mat(color, roughness=.48, metalness=0) { return new THREE.MeshStandardMaterial({color, roughness, metalness}); }
function mesh(geometry, material, parent, pos=[0,0,0], scale=null) {
  const m = new THREE.Mesh(geometry, material); m.position.set(...pos); if (scale) m.scale.set(...scale); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
}
function sphere(parent, pos, scale, material) { return mesh(new THREE.SphereGeometry(1, 40, 28), material, parent, pos, scale); }
function capsule(parent, a, b, radius, material, radius2=radius) {
  const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), d=end.clone().sub(start);
  const m = mesh(new THREE.CapsuleGeometry(radius, Math.max(.001,d.length()-radius*2), 5, 12), material, parent, start.clone().add(end).multiplyScalar(.5).toArray());
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), d.normalize());
  if (radius2 !== radius) sphere(parent, b, [radius2,radius2,radius2], material);
  return m;
}
function clearGroup(group) {
  const shared = new Set([skinMat,hairMat,hairHighlightMat,goldMat,accessoryGoldMat,gemMat,pearlMat,shoeMat,bagMat,bagTrim]);
  group.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material) { const list=Array.isArray(o.material)?o.material:[o.material]; for(const m of list) if(!shared.has(m)) m.dispose(); } });
  group.clear();
}
function drapeF(mode,a,y){ const t=THREE.MathUtils.clamp((2.05-y)/1.9,0,1), w=t*t*(3-2*t);
  if(mode==='pleat') return 1+.045*w*(Math.abs(Math.sin(a*14))*1.5-.6);
  if(mode==='tight') return 1+.014*w*(Math.sin(a*7+y*3)+.5*Math.sin(a*13-y*2));
  return 1+.034*w*(.55*Math.sin(a*9+y*2.2)+.3*Math.sin(a*17-y*3.1)+.4*Math.sin(a*5+y*1.3+1)); }
function latheDress(points, material, parent=outfit, segments=96, drape=null) {
  // Catmull-Rom interpolation in radius/height keeps silhouettes smooth instead of faceted.
  const curve = new THREE.SplineCurve(points.map(p => new THREE.Vector2(p[0], p[1])));
  const sampled = curve.getPoints(Math.max(48, points.length * 12));
  const safe = sampled.map(p => new THREE.Vector2(Math.max(.012, p.x), p.y));
  const geo = new THREE.LatheGeometry(safe, segments);
  if(drape){ const P=geo.attributes.position; for(let i=0;i<P.count;i++){ const x=P.getX(i), y=P.getY(i), z=P.getZ(i), f=drapeF(drape,Math.atan2(z,x),y); P.setX(i,x*f); P.setZ(i,z*f); } }
  geo.computeVertexNormals();
  return mesh(geo, material, parent, [0,0,0]);
}
function makeDress() {
  clearGroup(outfit);
  if(activePatternTexture) activePatternTexture.dispose();
  const patternMap=makeFabricPattern(fabricStyle); activePatternTexture=patternMap;
  const fabricProfiles={
    silk:{roughness:.34,sheen:.78,sheenRoughness:.32,bump:.012,clearcoat:.16},
    satin:{roughness:.23,sheen:.92,sheenRoughness:.24,bump:.006,clearcoat:.38},
    floral:{roughness:.58,sheen:.28,sheenRoughness:.7,bump:.014,clearcoat:.04},
    lace:{roughness:.68,sheen:.22,sheenRoughness:.76,bump:.026,clearcoat:.02},
    glitter:{roughness:.32,sheen:.42,sheenRoughness:.42,bump:.016,clearcoat:.22}
  };
  const fp=fabricProfiles[fabricStyle]||fabricProfiles.silk;
  const fabricRoughness=fp.roughness, fabricSheen=fp.sheen;
  const main = new THREE.MeshPhysicalMaterial({color:dressColor, map:patternMap, roughness:fabricRoughness, metalness:fabricStyle==='glitter'?.12:.005, side:THREE.DoubleSide, sheen:fabricSheen, sheenRoughness:fp.sheenRoughness, bumpMap:fabricBump, bumpScale:fp.bump, clearcoat:fp.clearcoat, clearcoatRoughness:fabricStyle==='satin'?.2:.42, envMapIntensity:1.05});
  const light = new THREE.MeshPhysicalMaterial({color:dressLight, roughness:Math.min(.82,fabricRoughness+.06), map:patternMap, side:THREE.DoubleSide, sheen:fabricSheen*.84, sheenRoughness:Math.min(.9,fp.sheenRoughness+.12), bumpMap:fabricBump, bumpScale:fp.bump*.78, clearcoat:fp.clearcoat*.7});
  const dark = new THREE.MeshPhysicalMaterial({color:dressDark, roughness:Math.min(.86,fabricRoughness+.09), map:patternMap, side:THREE.DoubleSide, sheen:fabricSheen*.68, sheenRoughness:Math.min(.92,fp.sheenRoughness+.18), bumpMap:fabricBump, bumpScale:fp.bump*.85, clearcoat:fp.clearcoat*.45});
  // Smooth couture bodice, with a real waist-to-shoulder transition.
  const bodice = [[.235,2.04],[.27,2.12],[.31,2.28],[.365,2.43],[.33,2.54],[.255,2.62],[.15,2.66],[.12,2.62]];
  latheDress(bodice, main);
  // The neckline opening now reveals the curved mannequin surface underneath instead of a flat floating skin patch.

  const type = selectedModel;
  const silhouette = selectedSkirtShape === 'auto' ? type : selectedSkirtShape;
  let skirt;
  if(silhouette==='slim') skirt=[[.26,.055],[.29,.12],[.30,.42],[.29,.82],[.285,1.2],[.29,1.58],[.255,2.08]];
  else if(silhouette==='mermaid') skirt=[[.64,.05],[.65,.12],[.53,.42],[.38,.75],[.31,1.05],[.34,1.4],[.29,1.72],[.255,2.08]];
  else if(silhouette==='highlow') skirt=[[.68,.05],[.73,.18],[.58,.52],[.44,.9],[.35,1.28],[.31,1.65],[.255,2.08]];
  else if(silhouette==='pleated') skirt=[[.73,.05],[.74,.12],[.65,.45],[.54,.85],[.43,1.25],[.34,1.62],[.255,2.08]];
  else if(silhouette==='vintage') skirt=[[.66,.05],[.68,.12],[.60,.42],[.51,.82],[.43,1.2],[.34,1.6],[.255,2.08]];
  else if(silhouette==='tulip') skirt=[[.42,.05],[.46,.14],[.58,.5],[.56,.9],[.44,1.3],[.34,1.65],[.255,2.08]];
  else if(silhouette==='trumpet') skirt=[[.72,.05],[.74,.12],[.56,.32],[.37,.62],[.31,1.0],[.3,1.4],[.28,1.75],[.255,2.08]];
  else if(silhouette==='bubble') skirt=[[.46,1.12],[.62,1.24],[.67,1.42],[.56,1.66],[.34,1.88],[.255,2.08]];
  else if(silhouette==='a-line'||silhouette==='tiered') skirt=[[.76,.05],[.77,.12],[.65,.45],[.53,.85],[.42,1.25],[.34,1.62],[.255,2.08]];
  else if(silhouette==='offshoulder') skirt=[[.74,.05],[.75,.12],[.64,.45],[.52,.85],[.42,1.25],[.34,1.62],[.255,2.08]];
  else if(silhouette==='fairy') skirt=[[.83,.05],[.84,.12],[.75,.40],[.62,.72],[.48,1.08],[.37,1.45],[.29,1.76],[.255,2.08]];
  else if(silhouette==='royal' || silhouette==='ballgown' || silhouette==='bridal') skirt=[[.88,.05],[.9,.12],[.79,.42],[.65,.78],[.51,1.15],[.38,1.52],[.255,2.08]];
  else skirt=[[.82,.05],[.83,.12],[.73,.42],[.59,.8],[.47,1.18],[.36,1.55],[.255,2.08]];
  const lengthFactor = dressLength === 'knee' ? .66 : dressLength === 'midi' ? .82 : 1;
  const adjustY = y => 2.08 - (2.08 - y) * lengthFactor;
  skirt = skirt.map(([r,y]) => [r, adjustY(y)]);
  const dmode = silhouette==='pleated' ? 'pleat' : (['slim','mermaid','trumpet'].includes(silhouette) ? 'tight' : 'full');
  latheDress(skirt, main, outfit, 128, dmode);
  // Soft, tapered folds follow the skirt profile; denser on pleated designs.
  const count = 0; const _unused = silhouette==='bubble' ? 0 : silhouette==='pleated' ? 36 : (['ballgown','royal','fairy','a-line','vintage'].includes(silhouette) ? 24 : 14);
  const hem = skirt[0][0];
  for(let i=0;i<count;i++) {
    const a=i/count*Math.PI*2;
    const wave=(i%2===0?1:-1), phase=(i%5)*.13;
    const topR=.265 + Math.sin(i*1.71)*.006;
    const r1=.32 + Math.sin(i*2.17)*.012;
    const r2=Math.max(.34,hem*.60) + Math.sin(i*1.31+phase)*.018;
    const r3=hem*.86 + Math.sin(i*2.41)*.025;
    const curve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a)*topR,2.02,Math.sin(a)*topR),
      new THREE.Vector3(Math.cos(a+phase*.15)*r1,adjustY(1.62),Math.sin(a+phase*.15)*r1),
      new THREE.Vector3(Math.cos(a-phase*.18)*r2,adjustY(1.05),Math.sin(a-phase*.18)*r2),
      new THREE.Vector3(Math.cos(a+phase*.22)*r3,adjustY(.48),Math.sin(a+phase*.22)*r3),
      new THREE.Vector3(Math.cos(a)*(hem + wave*.018 + Math.sin(i*1.2)*.012), adjustY(.075), Math.sin(a)*(hem + wave*.018 + Math.sin(i*1.2)*.012))
    ]);
    mesh(new THREE.TubeGeometry(curve,40,silhouette==='pleated'?.009:.006,6,false), i%3===0?light:dark, outfit);
  }
  // Tailored waist seam, a fine hem finish, and restrained bodice darts add garment construction detail.
  const belt=mesh(new THREE.TorusGeometry(.258,.014,10,72),light,outfit,[0,2.12,0]); belt.rotation.x=Math.PI/2;
  /* real drape replaces the rigid hem ring */
  const frontSeam = new THREE.CatmullRomCurve3([new THREE.Vector3(0,2.52,.285),new THREE.Vector3(0,2.34,.305),new THREE.Vector3(0,2.15,.265)]);
  mesh(new THREE.TubeGeometry(frontSeam,28,.006,6,false),light,outfit);
  for(const side of [-1,1]) {
    const dart=new THREE.CatmullRomCurve3([
      new THREE.Vector3(side*.105,2.48,.265),
      new THREE.Vector3(side*.085,2.34,.292),
      new THREE.Vector3(side*.065,2.18,.255)
    ]);
    mesh(new THREE.TubeGeometry(dart,20,.0045,5,false),dark,outfit);
  }
  // Sleeves are independently configurable instead of being tied to the base dress model.
  if(sleeveStyle !== 'none') {
    for(const side of [-1,1]) {
      if(sleeveStyle === 'long') {
        const sleeveCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side*.34,2.51,.015), new THREE.Vector3(side*.405,2.39,.035),
          new THREE.Vector3(side*.465,2.23,.065), new THREE.Vector3(side*.515,2.03,.105)
        ]);
        mesh(new THREE.TubeGeometry(sleeveCurve,28,.064,12,false),main,outfit);
      } else {
        const puff = sleeveStyle === 'puff';
        const sleeve=sphere(outfit,[side*.365,puff?2.47:2.455,.015],[puff?.155:.125,puff?.13:.095,.145],main);
        sleeve.rotation.z=-side*.18;
      }
    }
  }
  // Neckline piping mirrors the selected cut so it remains legible against patterned fabrics.
  let necklinePoints;
  if(necklineStyle === 'v') necklinePoints=[[-.20,2.65,.19],[-.15,2.57,.265],[0,2.485,.31],[.15,2.57,.265],[.20,2.65,.19]];
  else if(necklineStyle === 'square') necklinePoints=[[-.19,2.65,.19],[-.15,2.565,.27],[.15,2.565,.27],[.19,2.65,.19]];
  else if(necklineStyle === 'offshoulder') necklinePoints=[[-.25,2.59,.16],[-.16,2.55,.25],[0,2.54,.29],[.16,2.55,.25],[.25,2.59,.16]];
  else necklinePoints=[[-.22,2.62,.17],[-.15,2.57,.255],[-.07,2.535,.29],[0,2.565,.30],[.07,2.535,.29],[.15,2.57,.255],[.22,2.62,.17]];
  const neckline = new THREE.CatmullRomCurve3(necklinePoints.map(([x,y,z])=>new THREE.Vector3(x,y,z)));
  mesh(new THREE.TubeGeometry(neckline,40,.012,8,false),light,outfit);
  const ex=new Set(dressExtras); if(type==='tiered') ex.add('tiers'); if(type==='bridal'){ex.add('train');ex.add('beads');}
  const yTop=2.08, yBot=skirt[0][1];
  const rAt=y=>{for(let i=0;i<skirt.length-1;i++){const [r0,y0]=skirt[i],[r1,y1]=skirt[i+1];if(y>=y0&&y<=y1)return r0+(r1-r0)*(y-y0)/((y1-y0)||1);}return skirt[0][0];};
  if(ex.has('tiers')) for(let k=1;k<=3;k++){const y=yBot+(yTop-yBot)*k*.2,r=rAt(y);latheDress([[r-.01,y+.05],[r+.07,y-.04],[r+.12,y-.14]],k%2?light:main,outfit,96);}
  if(ex.has('bow')){const y=2.12,sash=mesh(new THREE.TorusGeometry(.262,.03,10,72),dark,outfit,[0,y,0]);sash.rotation.x=Math.PI/2;const rz=rAt(1.85)+.025;
    for(const s of [-1,1]){const w=sphere(outfit,[s*.12,y+.01,-.31],[.13,.07,.04],dark);w.rotation.z=s*.35;const t=mesh(new THREE.BoxGeometry(.07,.5,.012),light,outfit,[s*.07,1.85,-rz]);t.rotation.z=s*.1;}
    sphere(outfit,[0,y+.01,-.3],[.05,.05,.05],light);}
  if(ex.has('train')){const tr=new THREE.Mesh(new THREE.CircleGeometry(1.7,64,Math.PI/2-.62,1.24),main);tr.rotation.x=-Math.PI/2;tr.position.y=Math.max(yBot,.06)+.07;tr.castShadow=tr.receiveShadow=true;outfit.add(tr);}
  if(ex.has('beads')) for(const p of neckline.getPoints(26)) sphere(outfit,[p.x,p.y,p.z+.004],[.014,.014,.014],pearlMat);
  if(ex.has('scallop')) for(let i=0;i<56;i++){const a=i/56*Math.PI*2,r=(skirt[0][0]+.01)*drapeF(dmode,a,yBot);sphere(outfit,[Math.cos(a)*r,yBot+.012,Math.sin(a)*r],[.04,.026,.04],light);}
  if(ex.has('flowers')) for(let j=0;j<16;j++){const y=yBot+(yTop-yBot)*(.12+.76*((j*7)%16)/16),a=j*2.4,r=rAt(y)*drapeF(dmode,a,y)+.012,cx=Math.cos(a)*r,cz=Math.sin(a)*r;
    for(let p=0;p<5;p++){const b=p/5*Math.PI*2,u=Math.cos(b)*.032,v=Math.sin(b)*.032;sphere(outfit,[cx-Math.sin(a)*u,y+v,cz+Math.cos(a)*u],[.022,.022,.016],pearlMat);}
    sphere(outfit,[cx,y,cz],[.016,.016,.016],gemMat);}
}
function buildAvatar() {
  clearGroup(avatar); avatar.add(mannequinAsset); avatar.add(outfit); avatar.add(jewelry); avatar.add(accessory);
  // Softly sculpted body base beneath the garments.
  const torsoMat = new THREE.MeshPhysicalMaterial({color:0xeab59f, roughness:.52, sheen:.18, sheenRoughness:.7});
  // One smooth lathed torso gives the avatar a continuous waist, hip and shoulder silhouette.
  latheDress([[.19,1.82],[.22,1.9],[.225,2.0],[.18,2.12],[.205,2.22],[.285,2.34],[.30,2.43],[.245,2.52],[.13,2.62],[.09,2.69]], skinMat, avatar, 72);
  // Neck and stylized face with a gentle jaw, nose, lips, brows and eyes.
  capsule(avatar,[0,2.66,0],[0,2.94,0],.095,skinMat);
  sphere(avatar,[0,3.18,0],[.275,.345,.245],skinMat);
  sphere(avatar,[0,3.015,.025],[.205,.13,.205],skinMat); // jaw blend
  const eyeWhite=new THREE.MeshPhysicalMaterial({color:0xfff6f7,roughness:.1,clearcoat:1}), irisMat=mat(0x75536f,.28), liner=mat(0x493147,.5), lipMat=mat(0xb96782,.38);
  for(const side of [-1,1]) {
    sphere(avatar,[side*.105,3.205,.222],[.057,.035,.022],eyeWhite);
    sphere(avatar,[side*.105,3.204,.244],[.024,.027,.012],irisMat);
    sphere(avatar,[side*.105,3.205,.254],[.010,.015,.007],liner);
    const brow=sphere(avatar,[side*.105,3.267,.218],[.065,.012,.012],hairMat); brow.rotation.z=side*.08;
    sphere(avatar,[side*.105,3.228,.232],[.064,.009,.012],liner); sphere(avatar,[side*.105+.012,3.213,.262],[.006,.006,.004],new THREE.MeshBasicMaterial({color:0xffffff})); sphere(avatar,[side*.15,3.1,.205],[.052,.03,.012],new THREE.MeshStandardMaterial({color:0xf0a0a8,roughness:.9,transparent:true,opacity:.45}));
    sphere(avatar,[side*.275,3.105,.015],[.025,.045,.025],skinMat);
  }
  sphere(avatar,[0,3.13,.235],[.028,.055,.04],mat(0xe6b29e,.58));
  sphere(avatar,[0,3.055,.221],[.07,.018,.014],lipMat);
  sphere(avatar,[0,3.038,.22],[.055,.012,.012],lipMat);
  // Sculpted hair cap, long side locks, and a few visible strands.
  sphere(avatar,[0,3.34,-.055],[.30,.31,.265],hairMat);
  sphere(avatar,[0,3.46,.015],[.285,.15,.245],hairMat);
  const fringe=sphere(avatar,[0,3.34,.205],[.225,.105,.075],hairMat); fringe.rotation.z=-.1;
  for(const side of [-1,1]) {
    const lock=sphere(avatar,[side*.245,3.115,.005],[.07,.34,.105],hairMat); lock.rotation.z=side*-.13;
    const strandCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.21,3.42,.205),new THREE.Vector3(side*.25,3.27,.115),new THREE.Vector3(side*.27,3.08,.09),new THREE.Vector3(side*.23,2.94,.075)]);
    mesh(new THREE.TubeGeometry(strandCurve,24,.009,5,false),hairHighlightMat,avatar);
  }
  if(hairStyle==='down'){ sphere(avatar,[0,3.0,-.12],[.28,.45,.17],hairMat);
    let sd=7; const rn=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
    for(let i=0;i<110;i++){ const a=rn()*Math.PI*2,sa=Math.sin(a),ca=Math.cos(a); if(sa>.5) continue;
      const p=.75+rn()*.4,sx=ca*Math.sin(p)*.31,sy=3.31+Math.cos(p)*.34,sz=sa*Math.sin(p)*.28-.04,out=1.04+rn()*.1,len=.9+rn()*.7,w=(rn()-.5)*.06,sg=Math.sign(sx)||1,cl=v=>sg*Math.min(Math.abs(v),.25);
      const pts=[new THREE.Vector3(sx,sy,sz),new THREE.Vector3(cl(sx*out*1.12),sy-.3,Math.min(sz*out*1.1,.1)-.02),new THREE.Vector3(cl(sx*out*1.06)+w,sy-.3-len*.45,Math.min(sz*out,.1)-.07),new THREE.Vector3(cl(sx*.9)+w*2,sy-.3-len*.95,Math.min(sz*.8,.06)-.08)];
      mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),22,.0085,5,false),i%4===0?hairHighlightMat:hairMat,avatar); } }
  else if(hairStyle==='bun'){ sphere(avatar,[0,3.66,-.02],[.16,.14,.16],hairMat); const rg=mesh(new THREE.TorusGeometry(.17,.03,8,32),hairHighlightMat,avatar,[0,3.58,-.02]); rg.rotation.x=Math.PI/2; }
  else if(hairStyle==='ponytail'){ mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,3.45,-.22),new THREE.Vector3(0,3.3,-.45),new THREE.Vector3(0,2.9,-.46),new THREE.Vector3(0,2.45,-.36)]),30,.075,10,false),hairMat,avatar); sphere(avatar,[0,3.44,-.23],[.045,.045,.045],gemMat); }
  else if(hairStyle==='braid'){ for(let i=0;i<10;i++) sphere(avatar,[(i%2?1:-1)*.022,3.2-i*.085,-.26-i*.004],[.07-i*.003,.062,.07-i*.003],i%2?hairMat:hairHighlightMat); }
  // Anatomically ordered arm chain: shoulder -> upper arm -> elbow -> forearm -> wrist -> palm -> fingers.
  for(const side of [-1,1]) {
    sphere(avatar,[side*.335,2.53,0],[.13,.14,.135],skinMat);
    capsule(avatar,[side*.35,2.52,0],[side*.455,2.285,.015],.088,skinMat,.078);
    sphere(avatar,[side*.455,2.285,.015],[.078,.082,.078],skinMat);
    capsule(avatar,[side*.455,2.285,.015],[side*.515,2.015,.085],.066,skinMat,.052);
    // Wrist is narrower than the forearm and the palm begins beyond it, never on top of it.
    capsule(avatar,[side*.515,2.035,.085],[side*.525,1.965,.105],.045,skinMat,.041);
    sphere(avatar,[side*.525,1.91,.115],[.055,.09,.038],skinMat);
    for(let f=0;f<4;f++) {
      const spread=(f-1.5)*.027;
      const x=side*.525+spread;
      const len=[.105,.13,.125,.095][f];
      capsule(avatar,[x,1.87,.135],[x+side*.006,1.87-len,.145],.013,skinMat,.010);
      sphere(avatar,[x+side*.006,1.87-len,.145],[.011,.014,.011],skinMat);
    }
    capsule(avatar,[side*.49,1.925,.135],[side*.465,1.855,.16],.016,skinMat,.012); // thumb
    sphere(avatar,[side*.125,1.99,.005],[.135,.17,.15],skinMat);
    // Legs remain visible below shorter silhouettes; joints overlap smoothly.
    capsule(avatar,[side*.13,1.95,0],[side*.14,.78,.015],.09,skinMat,.067);
    sphere(avatar,[side*.14,.78,.015],[.069,.085,.068],skinMat);
    capsule(avatar,[side*.14,.78,.015],[side*.14,.29,.035],.061,skinMat,.047);
    const shoe=sphere(avatar,[side*.14,.17,.12],[.105,.055,.19],shoeMat);
    const sole=sphere(avatar,[side*.14,.135,.13],[.11,.018,.19],goldMat);
  }
  makeDress(); if(window.__glb) avatar.children.forEach(c=>{ if(![outfit,jewelry,accessory,mannequinAsset].includes(c)) c.visible=false; });
}
function addNecklace() {
  const group = new THREE.Group(); jewelry.add(group);
  if(necklaceStyle==='choker') {
    const chokerMat=mat(0x30213b,.32);
    const points=[];
    for(let i=0;i<64;i++) { const a=i/64*Math.PI*2; points.push(new THREE.Vector3(Math.sin(a)*.112,2.785,-Math.cos(a)*.09)); }
    const chokerCurve=new THREE.CatmullRomCurve3(points,true,'centripetal');
    mesh(new THREE.TubeGeometry(chokerCurve,96,.022,10,true),chokerMat,group);
    sphere(group,[0,2.77,.112],[.025,.03,.018],accessoryGoldMat);
    return;
  }
  // Necklace follows the neck/collarbone surface: the chain rises around the sides and
  // dips naturally over the upper chest instead of floating in front of the mannequin.
  const frontPoints=[];
  for(let i=0;i<=40;i++) {
    const t=-Math.PI/2 + Math.PI*i/40;
    const x=.118*Math.sin(t);
    const y=2.755-.19*Math.cos(t);
    const z=.075+.215*Math.cos(t);
    frontPoints.push(new THREE.Vector3(x,y,z));
  }
  // A rear arc closes the necklace around the neck, behind the mannequin.
  const loopPoints=[...frontPoints];
  for(let i=1;i<=24;i++) {
    const u=i/24;
    loopPoints.push(new THREE.Vector3(.118-.236*u,2.775,-.075));
  }
  const curve=new THREE.CatmullRomCurve3(loopPoints,true,'centripetal');
  const chainRadius=necklaceStyle==='pearl'?.012:.0105;
  mesh(new THREE.TubeGeometry(curve,100,chainRadius,8,true),accessoryGoldMat,group);
  if(necklaceStyle==='pearl') {
    for(let i=0;i<=24;i++) {
      const t=-Math.PI/2 + Math.PI*i/24;
      const x=.118*Math.sin(t), y=2.755-.19*Math.cos(t), z=.081+.215*Math.cos(t);
      sphere(group,[x,y,z],[.024,.024,.022],pearlMat);
    }
  } else {
    const jewelMat=gemMat; jewelMat.color.set(necklaceStyle==='heart'?'#f28aaf':accessoryTone);
    const pendantY=2.365, pendantZ=.315;
    // Short links follow the body angle from the chain's low point to the pendant.
    capsule(group,[0,2.565,.29],[0,2.475,.315],.009,accessoryGoldMat,.009);
    if(necklaceStyle==='heart') {
      sphere(group,[-.026,pendantY+.005,pendantZ],[.035,.037,.019],jewelMat);
      sphere(group,[.026,pendantY+.005,pendantZ],[.035,.037,.019],jewelMat);
      const heartTip=mesh(new THREE.ConeGeometry(.047,.065,4),jewelMat,group,[0,pendantY-.035,pendantZ]);
      heartTip.rotation.z=Math.PI;
      sphere(group,[0,2.425,.315],[.014,.014,.012],accessoryGoldMat);
    } else {
      sphere(group,[0,2.435,.315],[.021,.021,.018],accessoryGoldMat);
      const gem=mesh(new THREE.OctahedronGeometry(.052),jewelMat,group,[0,pendantY,pendantZ]); gem.rotation.set(.12,Math.PI/4,.18);
      sphere(group,[0,2.315,.315],[.012,.012,.01],accessoryGoldMat);
    }
  }
}
function addEarrings() {
  const gem=gemMat;
  for(const side of [-1,1]) {
    const x=side*.285;
    if(earringStyle==='stud') { sphere(jewelry,[x,3.105,.155],[.035,.035,.025],gem); sphere(jewelry,[x,3.105,.18],[.018,.018,.012],accessoryGoldMat); }
    else if(earringStyle==='hoop') { const hoop=mesh(new THREE.TorusGeometry(.055,.012,10,32),accessoryGoldMat,jewelry,[x,3.075,.13]); hoop.scale.y=1.25; }
    else if(earringStyle==='pearl') { sphere(jewelry,[x,3.12,.14],[.03,.03,.025],accessoryGoldMat); sphere(jewelry,[x,3.055,.145],[.045,.045,.04],pearlMat); }
    else if(earringStyle==='chandelier') { sphere(jewelry,[x,3.12,.14],[.025,.025,.02],accessoryGoldMat); capsule(jewelry,[x,3.095,.14],[x,3.015,.15],.012,accessoryGoldMat); sphere(jewelry,[x,2.99,.15],[.055,.065,.035],gem); sphere(jewelry,[x-side*.04,3.025,.15],[.025,.035,.025],gem); sphere(jewelry,[x+side*.04,3.025,.15],[.025,.035,.025],gem); }
    else { sphere(jewelry,[x,3.12,.14],[.025,.025,.02],accessoryGoldMat); capsule(jewelry,[x,3.1,.14],[x,3.025,.15],.012,accessoryGoldMat); sphere(jewelry,[x,2.99,.15],[.042,.06,.035],gem); }
  }
}
function addGlasses() {
  const frameMat=mat(accessoryMetal,.22,.72), lensMat=new THREE.MeshPhysicalMaterial({color:accessoryTone,metalness:.08,roughness:.14,transparent:true,opacity:glassesStyle==='sun'?.58:.28,side:THREE.DoubleSide,clearcoat:1});
  for(const side of [-1,1]) {
    const x=side*.105, y=3.205, z=.282;
    const w=glassesStyle==='sun'?.095:(glassesStyle==='butterfly'?.098:.083), h=glassesStyle==='sun'?.068:.052;
    let pts;
    if(glassesStyle==='round') { pts=[]; for(let i=0;i<=24;i++){const a=i/24*Math.PI*2;pts.push(new THREE.Vector3(x+Math.cos(a)*.064,y+Math.sin(a)*.064,z));} }
    else { const flare=glassesStyle==='cat'||glassesStyle==='butterfly'?.025:0; pts=[[-w,-h*.65],[-w+flare,-h],[w*.65,-h],[w,h*.1],[w*.72,h],[ -w*.65,h],[-w,h*.1]].map(([px,py])=>new THREE.Vector3(x+px,y+py,z)); }
    const curve=new THREE.CatmullRomCurve3(pts); mesh(new THREE.TubeGeometry(curve,48,.009,6,false),frameMat,accessory);
    sphere(accessory,[x,y,z-.004],[w*.88,h*.82,.004],lensMat);
    capsule(accessory,[x+side*.075,y,.278],[x+side*.18,y+.015,.12],.008,frameMat,.006);
  }
  capsule(accessory,[-.028,3.205,.284],[.028,3.205,.284],.008,frameMat,.007);
}
function addCrown() {
  const crownMat=accessoryGoldMat;
  if(crownStyle==='halo') { const halo=mesh(new THREE.TorusGeometry(.205,.012,8,64),crownMat,accessory,[0,3.51,-.015]); halo.rotation.x=Math.PI/2; for(let i=0;i<8;i++){const a=i*Math.PI/4;sphere(accessory,[Math.cos(a)*.205,3.51,Math.sin(a)*.205],[.012,.012,.012],gemMat);} return; }
  const base=mesh(new THREE.TorusGeometry(.20,.018,8,48),crownMat,accessory,[0,3.48,0]); base.rotation.x=Math.PI/2;
  if(crownStyle==='floral') { for(let i=0;i<7;i++){const x=(i-3)*.058; sphere(accessory,[x,3.52,.02],[.034,.027,.018],gemMat); for(let k=0;k<5;k++){const a=k*Math.PI*2/5;sphere(accessory,[x+Math.cos(a)*.027,3.52+Math.sin(a)*.027,.02],[.018,.024,.012],pearlMat);} } return; }
  for(let i=0;i<5;i++){const x=(i-2)*.075;const peak=crownStyle==='princess'?.13:.09;capsule(accessory,[x,3.48,.015],[x,3.57+(i%2)*peak,.015],.012,crownMat);sphere(accessory,[x,3.58+(i%2)*peak,.015],[.025,.027,.022],gemMat); if(i===2&&crownStyle==='princess')sphere(accessory,[x,3.68,.015],[.032,.04,.025],pearlMat);}
}
function addBag() {
  bagMat.color.set(bagColor); bagTrim.color.set(bagDark);
  // The handle is aligned to the mannequin's right hand; the bag hangs directly below the grip.
  const g=new THREE.Group(); accessory.add(g); g.position.set(.615,1.635,.235);
  const scale=bagStyle==='round'?[.17,.17,.075]:bagStyle==='clutch'?[.22,.13,.055]:[.18,.20,.075];
  const handleCurve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.105,.045,-.075), new THREE.Vector3(-.11,.19,-.075),
    new THREE.Vector3(-.075,.265,-.075), new THREE.Vector3(.035,.27,-.075),
    new THREE.Vector3(.105,.20,-.075), new THREE.Vector3(.105,.045,-.075)
  ]);
  mesh(new THREE.TubeGeometry(handleCurve,40,.018,10,false),bagTrim,g);
  if(bagStyle==='bow') {
    sphere(g,[-.075,-.005,0],[.09,.07,.045],bagMat); sphere(g,[.075,-.005,0],[.09,.07,.045],bagMat); sphere(g,[0,0,.045],[.04,.045,.03],bagTrim);
    sphere(g,[0,-.09,0],[.16,.1,.065],bagMat);
  } else if(bagStyle==='round') {
    sphere(g,[0,-.005,0],[.16,.16,.065],bagMat); sphere(g,[0,-.005,.065],[.12,.12,.018],bagTrim);
  } else {
    const body=mesh(new THREE.BoxGeometry(...scale),bagMat,g,[0,-.005,0]); body.rotation.z=bagStyle==='clutch'?.05:0;
    if(bagStyle!=='clutch') {
      const flap=mesh(new THREE.BoxGeometry(.145,.045,.012),bagTrim,g,[0,.065,.044]);
      sphere(g,[0,.055,.055],[.018,.018,.012],goldMat);
    }
  }
  sphere(g,[0,-.005,.085],[.025,.025,.018],goldMat);
}
function addGloves() {
  const gloveMat=mat(gloveColor,.34,gloveStyle==='lace'?.12:.02);
  for(const side of [-1,1]) {
    const palmY=1.91;
    sphere(accessory,[side*.525,palmY,.158],[.061,.09,.045],gloveMat);
    if(gloveStyle!=='fingerless') {
      for(let f=0;f<4;f++) {
        const spread=(f-1.5)*.027, x=side*.525+spread;
        const len=[.105,.13,.125,.095][f];
        capsule(accessory,[x,1.865,.178],[x+side*.006,1.865-len,.185],.016,gloveMat,.013);
      }
    }
    capsule(accessory,[side*.49,1.925,.178],[side*.465,1.855,.19],.021,gloveMat,.015);
    const cuffY=gloveStyle==='opera'?2.13:(gloveStyle==='short'?1.99:1.985);
    capsule(accessory,[side*.515,cuffY,.15],[side*.522,1.955,.16],gloveStyle==='opera'?.052:.047,gloveMat,.043);
    if(gloveStyle==='lace') for(let i=0;i<5;i++) sphere(accessory,[side*.515+(i-2)*.018,2.015,.195],[.009,.009,.008],gemMat);
  }
}
function addCape() {
  const capeMat=new THREE.MeshStandardMaterial({color:accessoryTone,roughness:capeStyle==='sheer'?.28:.58,transparent:capeStyle==='sheer',opacity:capeStyle==='sheer'?.55:1,side:THREE.DoubleSide});
  const height=capeStyle==='short'?.58:(capeStyle==='hood'?.86:1.05); const width=capeStyle==='short'?.38:.48;
  const geo=new THREE.ConeGeometry(width,height,48,2,true); const cape=mesh(geo,capeMat,accessory,[0,1.72,-.19]); cape.rotation.x=Math.PI;
  if(capeStyle==='hood'){const hood=mesh(new THREE.SphereGeometry(.19,24,16,0,Math.PI*2,0,Math.PI/2),capeMat,accessory,[0,2.91,-.13]); hood.scale.set(1,.9,.7);}
}
function rebuildAccessories() {
  clearGroup(jewelry); clearGroup(accessory);
  if(selectedAccessories.has('necklace')) addNecklace();
  if(selectedAccessories.has('earring')) addEarrings();
  if(selectedAccessories.has('crown')) addCrown();
  if(selectedAccessories.has('bag')) addBag();
  if(selectedAccessories.has('cape')) addCape();
  if(selectedAccessories.has('belt')) {
    if(beltStyle==='chain') { for(let i=0;i<25;i++){const a=i/25*Math.PI*2;const link=mesh(new THREE.TorusGeometry(.027,.008,6,12),accessoryGoldMat,accessory,[Math.cos(a)*.315,2.13,Math.sin(a)*.315]);link.rotation.x=Math.PI/2;} }
    else { const width=beltStyle==='slim'?.016:.03;const ring=mesh(new THREE.TorusGeometry(.31,width,10,64),accessoryGoldMat,accessory,[0,2.13,0]); ring.rotation.x=Math.PI/2; if(beltStyle==='ornate'){for(let i=0;i<13;i++){const a=i/13*Math.PI*2;sphere(accessory,[Math.cos(a)*.315,2.13,Math.sin(a)*.315],[.022,.022,.018],gemMat);} sphere(accessory,[0,2.13,.323],[.06,.06,.025],gemMat);} if(beltStyle==='bow'){sphere(accessory,[-.07,2.13,.32],[.07,.045,.025],bagMat);sphere(accessory,[.07,2.13,.32],[.07,.045,.025],bagMat);sphere(accessory,[0,2.13,.34],[.025,.03,.02],accessoryGoldMat);} }
  }
  if(selectedAccessories.has('bracelet')) for(const side of [-1,1]) {
    if(braceletStyle==='pearls'||braceletStyle==='stack'){const count=braceletStyle==='stack'?2:1;for(let layer=0;layer<count;layer++){const r=.07+layer*.025;const b=mesh(new THREE.TorusGeometry(r,.012,8,32),braceletStyle==='pearls'?pearlMat:accessoryGoldMat,accessory,[side*.54,1.94+layer*.018,.12]);b.rotation.x=Math.PI/2;}}
    else if(braceletStyle==='cuff'){const b=mesh(new THREE.TorusGeometry(.075,.027,8,32),accessoryGoldMat,accessory,[side*.54,1.94,.12]);b.rotation.x=Math.PI/2;sphere(accessory,[side*.54,2.015,.12],[.025,.025,.018],gemMat);}
    else {const b=mesh(new THREE.TorusGeometry(.07,.012,8,32),accessoryGoldMat,accessory,[side*.54,1.94,.12]);b.rotation.x=Math.PI/2; sphere(accessory,[side*.54,1.85,.15],[.027,.035,.02],gemMat);}
  }
  if(selectedAccessories.has('glove')) addGloves();
  if(selectedAccessories.has('glasses')) addGlasses();
}
function rebuild() { makeDress(); rebuildAccessories(); }

function resize() {
  const width=Math.max(1,mount.clientWidth), height=Math.max(1,mount.clientHeight || 460);
  renderer.setSize(width,height,false); camera.aspect=width/height; camera.updateProjectionMatrix();
}
const ro=new ResizeObserver(resize); ro.observe(mount); resize();

// Controls are connected to the same selectors already used by the 2D designer.
document.querySelectorAll('[data-model]').forEach(el=>el.addEventListener('click',()=>{selectedModel=el.dataset.model;document.querySelectorAll('[data-model]').forEach(b=>{b.classList.toggle('selected',b===el);b.setAttribute('aria-pressed',String(b===el));});makeDress();}));
document.querySelectorAll('.color-choice').forEach(el=>el.addEventListener('click',()=>{dressColor=el.dataset.color||dressColor;dressLight=el.dataset.light||dressLight;dressDark=el.dataset.dark||dressDark;document.querySelectorAll('.color-choice').forEach(b=>{b.classList.toggle('selected',b===el);b.setAttribute('aria-pressed',String(b===el));});makeDress();}));
document.querySelectorAll('[data-fabric]').forEach(el=>el.addEventListener('click',()=>{fabricStyle=el.dataset.fabric;document.querySelectorAll('[data-fabric]').forEach(b=>{b.classList.toggle('selected',b===el);b.setAttribute('aria-pressed',String(b===el));});makeDress();}));
const skirtShapeButtons = [...document.querySelectorAll('[data-skirt-shape]')];
function syncSelectedButtons(selector, value, dataKey) {
  document.querySelectorAll(selector).forEach(button => {
    const selected = button.dataset[dataKey] === value;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
skirtShapeButtons.forEach(el=>el.addEventListener('click',()=>{
  selectedSkirtShape=el.dataset.skirtShape;
  syncSelectedButtons('[data-skirt-shape]',selectedSkirtShape,'skirtShape');
  makeDress();
}));
document.querySelector('#necklineOptions')?.addEventListener('change',e=>{necklineStyle=e.target.value;makeDress();});
document.querySelector('#sleeveOptions')?.addEventListener('change',e=>{sleeveStyle=e.target.value;makeDress();});
const lengthControl=document.querySelector('#dressLengthOptions');
const lengthLabel=document.querySelector('#dressLengthLabel');
function setDressLengthFromControl(){
  const values=['knee','midi','long'];
  const labels=['تا روی زانو','میدی','بلند'];
  const index=Number(lengthControl?.value ?? 2);
  dressLength=values[index]||'long';
  if(lengthLabel) lengthLabel.textContent=labels[index]||'بلند';
  makeDress();
}
lengthControl?.addEventListener('input',setDressLengthFromControl);

document.querySelectorAll('.accessory-button').forEach(el=>el.addEventListener('click',()=>{const name=el.dataset.accessory;if(selectedAccessories.has(name)) selectedAccessories.delete(name); else selectedAccessories.add(name);el.classList.toggle('selected',selectedAccessories.has(name));el.setAttribute('aria-pressed',String(selectedAccessories.has(name)));rebuildAccessories();}));

const accessoryStyleBindings={earringStyle:v=>earringStyle=v,crownStyle:v=>crownStyle=v,glassesStyle:v=>glassesStyle=v,capeStyle:v=>capeStyle=v,beltStyle:v=>beltStyle=v,braceletStyle:v=>braceletStyle=v,gloveStyle:v=>gloveStyle=v};
Object.entries(accessoryStyleBindings).forEach(([id,setter])=>document.querySelector('#'+id)?.addEventListener('change',e=>{setter(e.target.value);rebuildAccessories();}));
document.querySelectorAll('.accessory-tone').forEach(el=>el.addEventListener('click',()=>{accessoryTone=el.dataset.accessoryTone||accessoryTone;gemMat.color.set(accessoryTone);document.querySelectorAll('.accessory-tone').forEach(b=>{b.classList.toggle('selected',b===el);b.setAttribute('aria-pressed',String(b===el));});rebuildAccessories();}));
document.querySelectorAll('.accessory-metal').forEach(el=>el.addEventListener('click',()=>{accessoryMetal=el.dataset.accessoryMetal||accessoryMetal;accessoryGoldMat.color.set(accessoryMetal);document.querySelectorAll('.accessory-metal').forEach(b=>{b.classList.toggle('selected',b===el);b.setAttribute('aria-pressed',String(b===el));});rebuildAccessories();}));

document.querySelector('#necklaceStyle')?.addEventListener('change',e=>{necklaceStyle=e.target.value;rebuildAccessories();});
document.querySelector('#bagStyle')?.addEventListener('change',e=>{bagStyle=e.target.value;rebuildAccessories();});
document.querySelectorAll('.bag-color[data-bag-color]').forEach(el=>el.addEventListener('click',()=>{bagColor=el.dataset.bagColor||bagColor;bagDark=el.dataset.bagDark||bagDark;document.querySelectorAll('.bag-color[data-bag-color]').forEach(b=>{b.classList.toggle('selected',b===el);b.setAttribute('aria-pressed',String(b===el));});rebuildAccessories();}));
document.querySelectorAll('.glove-color').forEach(el=>el.addEventListener('click',()=>{gloveColor=el.dataset.gloveColor||gloveColor;document.querySelectorAll('.glove-color').forEach(b=>{b.classList.toggle('selected',b===el);b.setAttribute('aria-pressed',String(b===el));});rebuildAccessories();}));
document.querySelectorAll('.hair-color').forEach(el=>el.addEventListener('click',()=>{hairColor=el.dataset.hairColor||hairColor;hairMat.color.set(hairColor);const highlights={'#43263e':'#68415e','#17151d':'#514852','#7a3e24':'#b76e45','#d9b65c':'#f5d993','#c9a56b':'#f1d6a0','#e8e0d2':'#fff6e8','#bd425f':'#e77d9a','#6d86bd':'#a8c4f4'};hairHighlightMat.color.set(highlights[hairColor]||hairColor);document.querySelectorAll('.hair-color').forEach(b=>{b.classList.toggle('selected',b===el);b.setAttribute('aria-pressed',String(b===el));});}));
const rotateBtn=document.querySelector('#rotateModelBtn');
rotateBtn?.addEventListener('click',()=>{autoRotate=!autoRotate;rotateBtn.setAttribute('aria-pressed',String(autoRotate));rotateBtn.textContent=autoRotate?'توقف چرخش':'چرخش خودکار ۳۶۰°';});
document.querySelector('#resetModelViewBtn')?.addEventListener('click',()=>{targetRotation=0;autoRotate=false;camera.position.set(0,1.98,7.8);camera.lookAt(0,1.8,0);if(rotateBtn){rotateBtn.setAttribute('aria-pressed','false');rotateBtn.textContent='چرخش خودکار ۳۶۰°';}});
document.querySelector('#resetDesignBtn')?.addEventListener('click',()=>{
  selectedModel='ballgown';
  selectedSkirtShape='auto'; necklineStyle='sweetheart'; sleeveStyle='puff'; dressLength='long';
  document.querySelectorAll('[data-model]').forEach(b=>{const active=b.dataset.model==='ballgown';b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  syncSelectedButtons('[data-skirt-shape]','auto','skirtShape');
  if(document.querySelector('#necklineOptions'))document.querySelector('#necklineOptions').value='sweetheart';
  if(document.querySelector('#sleeveOptions'))document.querySelector('#sleeveOptions').value='puff';
  if(lengthControl){lengthControl.value='2';} if(lengthLabel)lengthLabel.textContent='بلند';
  const color=document.querySelector('.color-choice.selected'); if(color){dressColor=color.dataset.color||'#b995ed';dressLight=color.dataset.light||'#eadcff';dressDark=color.dataset.dark||'#8c5ac8';}
  selectedAccessories.clear(); necklaceStyle='pendant'; bagStyle='classic'; bagColor='#c6a0e8'; bagDark='#865bb4'; earringStyle='drop'; crownStyle='tiara'; glassesStyle='cat'; capeStyle='royal'; beltStyle='ornate'; braceletStyle='stack'; accessoryTone='#c6a0e8'; accessoryMetal='#f5cf78'; gloveStyle='opera'; gemMat.color.set(accessoryTone); accessoryGoldMat.color.set(accessoryMetal); gloveColor='#f3e7f5'; hairColor='#43263e'; hairMat.color.set(hairColor); hairHighlightMat.color.set('#68415e'); fabricStyle='silk';
  if(document.querySelector('#necklaceStyle'))document.querySelector('#necklaceStyle').value=necklaceStyle;
  if(document.querySelector('#bagStyle'))document.querySelector('#bagStyle').value=bagStyle;
  Object.entries({earringStyle,crownStyle,glassesStyle,capeStyle,beltStyle,braceletStyle,gloveStyle}).forEach(([id,value])=>{if(document.querySelector('#'+id))document.querySelector('#'+id).value=value;});
  document.querySelectorAll('.accessory-tone').forEach(b=>{b.classList.toggle('selected',b.dataset.accessoryTone===accessoryTone);b.setAttribute('aria-pressed',String(b.dataset.accessoryTone===accessoryTone));});
  document.querySelectorAll('.accessory-metal').forEach(b=>{b.classList.toggle('selected',b.dataset.accessoryMetal===accessoryMetal);b.setAttribute('aria-pressed',String(b.dataset.accessoryMetal===accessoryMetal));});
  document.querySelectorAll('[data-fabric]').forEach(b=>{b.classList.toggle('selected',b.dataset.fabric==='silk');b.setAttribute('aria-pressed',String(b.dataset.fabric==='silk'));});
  document.querySelectorAll('.bag-color[data-bag-color]').forEach(b=>{b.classList.toggle('selected',b.dataset.bagColor===bagColor);b.setAttribute('aria-pressed',String(b.dataset.bagColor===bagColor));});
  document.querySelectorAll('.hair-color').forEach(b=>{b.classList.toggle('selected',b.dataset.hairColor===hairColor);b.setAttribute('aria-pressed',String(b.dataset.hairColor===hairColor));});
  document.querySelectorAll('.glove-color').forEach(b=>{b.classList.toggle('selected',b.dataset.gloveColor===gloveColor);b.setAttribute('aria-pressed',String(b.dataset.gloveColor===gloveColor));});
  targetRotation=0;autoRotate=false;if(rotateBtn){rotateBtn.setAttribute('aria-pressed','false');rotateBtn.textContent='چرخش خودکار ۳۶۰°';}
  makeDress();rebuildAccessories();
});
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();camera.position.z=THREE.MathUtils.clamp(camera.position.z+Math.sign(e.deltaY)*.35,6.2,11.5);},{passive:false});
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;renderer.domElement.style.cursor='grabbing';renderer.domElement.setPointerCapture(e.pointerId);});
renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX;targetRotation+=dx*.009;lastX=e.clientX;});
renderer.domElement.addEventListener('pointerup',()=>{dragging=false;renderer.domElement.style.cursor='grab';});
renderer.domElement.addEventListener('pointercancel',()=>{dragging=false;renderer.domElement.style.cursor='grab';});

buildAvatar();
// Fully local procedural avatar: no remote GLB can replace, misalign, or hide the fitted 3D body.
// This keeps the dress rig and body in the same coordinate system on every run.
function animate(){requestAnimationFrame(animate);if(autoRotate&&!dragging)targetRotation+=.006;stage.rotation.y+=(targetRotation-stage.rotation.y)*.12;renderer.render(scene,camera);}
animate();

document.querySelector('#hairStyleOptions')?.addEventListener('change',e=>{hairStyle=e.target.value;buildAvatar();rebuildAccessories();});
document.querySelectorAll('[data-extra]').forEach(el=>el.addEventListener('click',()=>{const k=el.dataset.extra;if(dressExtras.has(k))dressExtras.delete(k);else dressExtras.add(k);el.classList.toggle('selected',dressExtras.has(k));el.setAttribute('aria-pressed',String(dressExtras.has(k)));makeDress();}));
document.querySelector('#resetDesignBtn')?.addEventListener('click',()=>{dressExtras.clear();hairStyle='down';const h=document.querySelector('#hairStyleOptions');if(h)h.value='down';document.querySelectorAll('[data-extra]').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});buildAvatar();rebuildAccessories();});
// materials: skin sheen, diamond-like gems, polished metal, softer shadows
skinMat.sheen=.5; skinMat.sheenColor=new THREE.Color(0xff9d8f);
Object.assign(gemMat,{transmission:.6,ior:1.8,thickness:.4,roughness:.03,iridescence:.35});
accessoryGoldMat.roughness=.13; goldMat.roughness=.15;
key.shadow.mapSize.set(2048,2048); key.shadow.radius=4; renderer.toneMappingExposure=1.05;
// optional: put a real mannequin.glb next to index.html and it replaces the procedural body
(async()=>{ try{ const r=await fetch('mannequin.glb',{method:'HEAD'}); if(!r.ok) return;
  const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js'); const g=await new GLTFLoader().loadAsync('mannequin.glb'), m=g.scene;
  const b=new THREE.Box3().setFromObject(m); m.scale.setScalar(3.6/(b.max.y-b.min.y)); const c=new THREE.Box3().setFromObject(m);
  m.position.set(-(c.min.x+c.max.x)/2,-c.min.y,-(c.min.z+c.max.z)/2); m.traverse(o=>{ if(o.isMesh) o.castShadow=o.receiveShadow=true; });
  window.__glb=true; mannequinAsset.add(m); buildAvatar(); rebuildAccessories();
 }catch(e){ console.warn('mannequin.glb skipped',e); } })();
window.maede3d = { THREE, scene, camera, renderer, floorMat, plinthMat };
