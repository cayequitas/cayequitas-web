/* ---------- shared ---------- */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const HAS_GL = (()=>{try{const c=document.createElement("canvas");return !!(window.THREE && (c.getContext("webgl2")||c.getContext("webgl")))}catch(e){return false}})();
const LIME = new THREE.Color("#D1FB46"), LIME_D = new THREE.Color("#86A80C");
// phones and small tablets get lighter scenes: lower pixel ratio, fewer particles, 30 fps for ambient layers
const LITE = matchMedia("(max-width:820px), (pointer:coarse)").matches;
const DPR = (cap)=>Math.min(cap, devicePixelRatio||1);
let activeLoop = null, loopRaf = null, loopFps = 60, lastTick = 0;
function runLoop(fn, fps){ activeLoop = fn; loopFps = fps||60; lastTick = 0; if(!loopRaf){ const tick=(t)=>{ loopRaf=requestAnimationFrame(tick); if(document.hidden||!activeLoop) return; if(loopFps<60 && t-lastTick < 1000/loopFps - 2) return; lastTick=t; activeLoop(t); }; loopRaf=requestAnimationFrame(tick);} }
function stopLoop(){ activeLoop=null; if(loopRaf){cancelAnimationFrame(loopRaf); loopRaf=null;} }
const mouse = {x:0,y:0,nx:0,ny:0};
addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.nx=e.clientX/innerWidth*2-1;mouse.ny=-(e.clientY/innerHeight*2-1)});

/* ---------- HOME: 3D point-cloud mark ---------- */
const FEAT = ["on-the-other-earth","danny-ocean-2025-tour","penumbra","spectral-lures"];
let fi=0, featT0=0;
function showFeat(i){
  const p=bySlug[FEAT[i]];
  $("#featImg").src=IMG[p.slug].img; $("#featTitle").textContent=p.title; $("#featRole").textContent=p.role;
  $("#featIdx").textContent=String(i+1).padStart(2,"0"); $("#featCard").onclick=()=>location.hash="p-"+p.slug;
  featT0=performance.now();
}
const Home = (function(){
  if(!HAS_GL) return {start(){showFeat(0)},stop(){}};
  const canvas=$("#gl-home");
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"high-performance"});
  renderer.setClearColor(0x000000,0);
  const scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x000000,.09);
  const camera=new THREE.PerspectiveCamera(48,1,.05,100); camera.position.set(0,.35,4.6);
  const root=new THREE.Group(); scene.add(root);
  const U={uTime:{value:0},uMouse:{value:new THREE.Vector3(9,9,0)},uScan:{value:-2},uPx:{value:1},uIntro:{value:0},uLime:{value:LIME},uLimeD:{value:LIME_D}};
  let markPts=null, count=0;

  // mark point cloud from logo alpha
  const im=new Image();
  im.onload=()=>{
    const w=360,h=Math.round(w/LOGO.mark.ar),c=document.createElement("canvas");c.width=w;c.height=h;
    const g=c.getContext("2d");g.drawImage(im,0,0,w,h);const d=g.getImageData(0,0,w,h).data;
    const base=[];for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){if(d[(y*w+x)*4+3]>128)base.push([x/w-.5,(y/h-.5)/LOGO.mark.ar])}
    const L=6, S=3.4, pos=[], rnd=[], dir=[];
    for(const [x,y] of base){ for(let l=0;l<L;l++){ if(Math.random()<.35) continue;
      pos.push(x*S+(Math.random()-.5)*.012, -y*S+.62, (l/(L-1)-.5)*.34+(Math.random()-.5)*.03);
      rnd.push(Math.random()); const a=Math.random()*6.283,b=Math.acos(Math.random()*2-1); dir.push(Math.sin(b)*Math.cos(a),Math.sin(b)*Math.sin(a),Math.cos(b)); } }
    // drifting debris around the mark
    for(let i=0;i<(LITE?600:1400);i++){ pos.push((Math.random()-.5)*6,(Math.random()-.2)*2.6,(Math.random()-.5)*3); rnd.push(Math.random()*.4+1.0); dir.push(0,0,0); }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute("aRand",new THREE.Float32BufferAttribute(rnd,1));
    geo.setAttribute("aDir",new THREE.Float32BufferAttribute(dir,3));
    const mat=new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
      vertexShader:`uniform float uTime,uScan,uPx,uIntro;uniform vec3 uMouse;attribute float aRand;attribute vec3 aDir;varying float vScan;varying float vDeb;varying float vDepth;
      void main(){vec3 p=position;vDeb=step(1.0,aRand);float r=fract(aRand);
        if(vDeb>.5){p.y+=sin(uTime*.2+r*30.)*.15;p.x+=sin(uTime*.1+r*50.)*.2;}
        else{p.z+=sin(p.x*2.6+uTime*1.4+r*6.28)*.07;p.y+=sin(p.x*4.-uTime*1.8)*.025;
          float d=distance(p.xy,uMouse.xy);float f=smoothstep(.75,0.,d);p+=normalize(vec3(p.xy-uMouse.xy,.6))*f*.45;
          p=mix(p+aDir*3.5,p,smoothstep(0.,1.,clamp(uIntro*1.4-r*.4,0.,1.)));}
        vScan=smoothstep(.16,0.,abs(p.x-uScan))*(1.-vDeb);
        vec4 mv=modelViewMatrix*vec4(p,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;
        gl_PointSize=(vDeb>.5?1.4:(1.6+r*2.2+vScan*3.))*uPx*(3.6/-mv.z);}`,
      fragmentShader:`uniform vec3 uLime,uLimeD;varying float vScan;varying float vDeb;varying float vDepth;
      void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;float a=smoothstep(.5,.0,d);
        vec3 col=mix(vec3(.82),uLime,clamp(vScan*1.4,0.,1.));col=mix(col,uLimeD*.9,vDeb*.6);
        float fade=clamp(1.6-vDepth*.22,.15,1.);gl_FragColor=vec4(col,a*(vDeb>.5?.35:.75)*fade+vScan*.4);}`});
    markPts=new THREE.Points(geo,mat); root.add(markPts); count=pos.length/3;
    $("#hudPts").textContent="POINTS "+count.toLocaleString("en");
  };
  im.src=LOGO.mark.src;

  // laser plane following the scan
  const laser=new THREE.Mesh(new THREE.PlaneGeometry(.035,3.4),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uLime:U.uLime},
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform vec3 uLime;varying vec2 vUv;void main(){float a=smoothstep(.5,0.,abs(vUv.x-.5))*smoothstep(0.,.25,vUv.y)*smoothstep(1.,.75,vUv.y);gl_FragColor=vec4(uLime,a*.9);}`}));
  laser.position.set(0,.55,.25); root.add(laser);

  // perspective grid floor
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60,1,1),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime:U.uTime,uLimeD:U.uLimeD,uLime:U.uLime,uScan:U.uScan},
    vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uTime,uScan;uniform vec3 uLimeD,uLime;varying vec3 vW;
      float line(float v,float w){float f=abs(fract(v)-.5);return smoothstep(.5-w,.5,f);}
      void main(){vec2 g=vW.xz*1.6;g.y+=uTime*.35;float l=max(line(g.x,.03),line(g.y,.03));
        float dist=length(vW.xz-vec2(0.,0.));float fade=smoothstep(14.,1.5,dist);
        float pulse=smoothstep(.5,0.,abs(vW.x-uScan))*.8;
        gl_FragColor=vec4(mix(uLimeD,uLime,pulse),l*fade*(.38+pulse));}`}));
  floor.rotation.x=-Math.PI/2; floor.position.y=-1.05; scene.add(floor);

  // floating techy elements
  const techy=new THREE.Group(); scene.add(techy);
  const lineMat=(c,o)=>new THREE.LineBasicMaterial({color:c,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false});
  const ico=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.9,1)),lineMat(0x86A80C,.10)); ico.position.y=.4; techy.add(ico);
  const rings=[];
  [[2.25,.0,.55],[2.6,1.1,.35],[1.9,-.6,.25]].forEach(([r,tilt,o],i)=>{
    const pts=[];for(let k=0;k<=200;k++){const a=k/200*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r))}
    const g=new THREE.BufferGeometry().setFromPoints(pts);const m=new THREE.LineDashedMaterial({color:i===0?0xD1FB46:0x707070,dashSize:.06,gapSize:.1,transparent:true,opacity:o});
    const ln=new THREE.Line(g,m);ln.computeLineDistances();ln.rotation.x=Math.PI/2.25+tilt*.3;ln.rotation.z=tilt;ln.position.y=.45;techy.add(ln);rings.push(ln);
  });
  const cubes=[];
  for(let i=0;i<16;i++){
    const s=.06+Math.random()*.14, m=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(s,s,s)),lineMat(i%4===0?0xD1FB46:0xFFFFFF,i%4===0?.9:.35));
    const a=Math.random()*6.28, r=1.8+Math.random()*1.6; m.userData={a,r,y:(Math.random()-.3)*2.2,sp:.05+Math.random()*.12,rs:(Math.random()-.5)*2};
    techy.add(m);cubes.push(m);
  }
  // orbiting satellites with trails
  const sats=[];for(let i=0;i<3;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.018,8,8),new THREE.MeshBasicMaterial({color:0xD1FB46}));s.userData={ring:rings[i],off:i*2.1};techy.add(s);sats.push(s)}

  const ray=new THREE.Raycaster(), plane=new THREE.Plane(new THREE.Vector3(0,0,1),0), hit=new THREE.Vector3(), mv=new THREE.Vector2();
  let W=0,H=0,t0=0,last=0,frames=0,fpsT=0;
  function resize(){W=canvas.clientWidth;H=canvas.clientHeight;const pr=DPR(LITE?1.5:2);renderer.setPixelRatio(pr);renderer.setSize(W,H,false);camera.aspect=W/H;
    const nar=W<820;camera.position.z=nar?8.2:4.6;root.position.y=nar?1.25:.38;laser.position.y=.55;camera.updateProjectionMatrix();U.uPx.value=pr*(H/900);}
  addEventListener("resize",()=>{if($("#home").classList.contains("on"))resize()});
  function frame(now){
    const t=(now-t0)/1000; U.uTime.value=t; U.uIntro.value=Math.min(1,t/2.4);
    U.uScan.value=((t*.42)%3.6)-1.8; laser.position.x=U.uScan.value; laser.material.opacity=1;
    camera.position.x+=(mouse.nx*.55-camera.position.x)*.04; camera.position.y+=(.35+mouse.ny*.3-camera.position.y)*.04; camera.lookAt(0,.3,0);
    mv.set(mouse.nx,mouse.ny); ray.setFromCamera(mv,camera); if(ray.ray.intersectPlane(plane,hit)) U.uMouse.value.copy(hit);
    root.rotation.y=Math.sin(t*.25)*.18;
    ico.rotation.y=t*.04; ico.rotation.x=t*.02; rings.forEach((r,i)=>r.rotation.y=t*(.08+i*.05)*(i%2?-1:1));
    cubes.forEach(c=>{const u=c.userData;const a=u.a+t*u.sp;c.position.set(Math.cos(a)*u.r,u.y+Math.sin(t*.6+u.a)*.12,Math.sin(a)*u.r-.5);c.rotation.x=t*u.rs;c.rotation.y=t*u.rs*.7});
    sats.forEach((s,i)=>{const g=s.userData.ring.geometry.attributes.position;const k=Math.floor(((t*.05+s.userData.off/6.28)%1)*200);const v=new THREE.Vector3().fromBufferAttribute(g,k);s.position.copy(v.applyMatrix4(s.userData.ring.matrixWorld))});
    renderer.render(scene,camera);
    frames++; if(now-fpsT>500){$("#hudFps").textContent="FPS "+Math.round(frames*1000/(now-fpsT));frames=0;fpsT=now;}
    $("#hudScan").textContent="SCAN "+((U.uScan.value+1.8)/3.6).toFixed(3);
    const d=new Date();$("#hudClock").textContent=d.toLocaleTimeString("de-DE",{timeZone:"Europe/Berlin",hour12:false});
    const fp=(now-featT0)/5200; $("#featBar").style.width=Math.min(100,fp*100)+"%"; if(fp>=1){fi=(fi+1)%FEAT.length;showFeat(fi)}
  }
  return {start(){resize();t0=performance.now();showFeat(fi);if(REDUCED){U.uIntro.value=1;frame(t0+4000);return}runLoop(frame)},stop(){stopLoop()}};
})();

/* ---------- LAB: 3D wall of glowing panels, scan line plays them ---------- */
const Lab = (function(){
  const items=P.filter(p=>!p.archive);
  if(!HAS_GL) return {start(){},stop(){}};
  const canvas=$("#gl-lab");
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setClearColor(0x000000,1);
  const scene=new THREE.Scene(); scene.fog=new THREE.Fog(0x000000,4,13);
  const camera=new THREE.PerspectiveCamera(52,1,.05,60);
  const loader=new THREE.TextureLoader();
  const panels=[]; let wall=null, gridLines=null, COLS=3, ROWS=0, PW=1.6, PH=1.0, GAP=.22, R=4.2;
  const scanU={uScanY:{value:0},uTime:{value:0},uLime:{value:LIME},uLimeD:{value:LIME_D}};
  const panelMat=(tex)=>new THREE.ShaderMaterial({transparent:true,uniforms:{map:{value:tex},uActive:{value:0},uTime:scanU.uTime,uScanY:scanU.uScanY,uLime:scanU.uLime,uY:{value:0},uH:{value:PH},uAspect:{value:1},uClean:{value:0},uDim:{value:0}},
    vertexShader:`varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform sampler2D map;uniform float uActive,uTime,uScanY,uY,uH,uAspect,uClean,uDim;uniform vec3 uLime;varying vec2 vUv;varying vec3 vW;
      void main(){vec3 clean=texture2D(map,vUv).rgb;vec2 uv=vUv;float pa=1.6;float ta=uAspect;vec2 sc=ta>pa?vec2(pa/ta,1.):vec2(1.,ta/pa);uv=(uv-.5)*sc+.5;
        float z=1.-.07*uActive-.02*sin(uTime*.6)*uActive;uv=(uv-.5)*z+.5+vec2(sin(uTime*.3),cos(uTime*.25))*.01*uActive;
        float g=(1.-uActive)*.012+step(.97,fract(uTime*1.7+uY))*.004*uActive;
        vec3 c=vec3(texture2D(map,uv+vec2(g,0)).r,texture2D(map,uv).g,texture2D(map,uv-vec2(g,0)).b);
        float l=dot(c,vec3(.299,.587,.114));vec3 gray=vec3(l)*.42;vec3 col=mix(gray,c,uActive);
        col*=.9+.1*sin(vUv.y*420.+uTime*8.);
        vec2 e=min(vUv,1.-vUv);float edge=min(e.x/1.,e.y*1.6);float rim=smoothstep(.02,.0,edge);
        col=mix(col,uLime,rim*(.25+.75*uActive));
        float band=smoothstep(.035,0.,abs(vW.y-uScanY));col+=uLime*band*.9;
        float vig=smoothstep(.0,.25,e.x)*smoothstep(.0,.25,e.y);col*=mix(.7,1.,vig);
        col=mix(col,clean,smoothstep(.15,.85,uClean));col*=1.-uDim*.75;
        gl_FragColor=vec4(col,1.);}`});
  const TEX={};
  function texFor(slug,cb){let e=TEX[slug];
    if(!e){e=TEX[slug]={cbs:[],a:0};e.t=loader.load(IMG[slug].img,(t)=>{e.a=t.image.width/t.image.height;e.cbs.forEach(f=>f(e.a));e.cbs=[]});e.t.colorSpace=THREE.SRGBColorSpace||e.t.colorSpace;}
    if(e.a)setTimeout(()=>cb(e.a));else e.cbs.push(cb);return e.t;}
  function build(){
    if(wall){scene.remove(wall);wall.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.dispose)o.material.dispose()});panels.length=0}
    wall=new THREE.Group(); scene.add(wall);
    const narrow=innerWidth<820; COLS=narrow?2:3; PW=narrow?1.3:1.6; PH=PW/1.6; GAP=narrow?.16:.22; R=narrow?3.6:4.2;
    ROWS=Math.ceil(items.length*1.5/COLS); const total=ROWS*COLS;
    const angStep=(PW+GAP)/R;
    for(let i=0;i<total;i++){
      const r=Math.floor(i/COLS), c=i%COLS, it=items[i%items.length];
      const tex=texFor(it.slug,(a)=>{m.material.uniforms.uAspect.value=a});
      const m=new THREE.Mesh(new THREE.PlaneGeometry(PW,PH),panelMat(tex));
      const th=(c-(COLS-1)/2)*angStep + (r%2?angStep*.5:0)*(narrow?0:1)*.0;
      const zOff=((i*37)%7/7-.5)*.5;
      m.position.set(Math.sin(th)*(R+zOff),-r*(PH+GAP),-Math.cos(th)*(R+zOff)); m.rotation.y=-th;
      m.material.uniforms.uY.value=m.position.y; m.userData={it,act:0,f:0,home:{p:m.position.clone(),q:m.quaternion.clone()}};
      if(it.video){const v=document.createElement('video');v.src=it.video;v.muted=true;v.loop=true;v.playsInline=true;v.crossOrigin='anonymous';m.userData.video=v;m.material.uniforms.map.value=new THREE.VideoTexture(v);} wall.add(m); panels.push(m);
      // glow frame behind panel
      const fr=new THREE.Mesh(new THREE.PlaneGeometry(PW*1.18,PH*1.3),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uA:{value:0},uLime:scanU.uLime},
        vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader:`uniform float uA;uniform vec3 uLime;varying vec2 vUv;void main(){vec2 d=abs(vUv-.5)*2.;float b=max(d.x,d.y);float a=smoothstep(1.,.8,b)*smoothstep(.6,.86,b);gl_FragColor=vec4(uLime,a*(.05+.5*uA));}`}));
      fr.position.copy(m.position).multiplyScalar(1.0); fr.position.x*=1.004; fr.position.z*=1.004; fr.rotation.y=m.rotation.y; wall.add(fr); m.userData.frame=fr;
    }
    // glowing grid lines across the wall
    const gp=[]; const rows=ROWS+2, cols=COLS+1;
    for(let r=-1;r<=ROWS;r++){const y=-r*(PH+GAP)+(PH+GAP)/2;for(let k=0;k<60;k++){const a0=((k/60)-.5)*angStep*(COLS+2),a1=(((k+1)/60)-.5)*angStep*(COLS+2);gp.push(Math.sin(a0)*R*1.02,y,-Math.cos(a0)*R*1.02,Math.sin(a1)*R*1.02,y,-Math.cos(a1)*R*1.02)}}
    for(let c=0;c<=COLS;c++){const a=(c-COLS/2)*angStep;gp.push(Math.sin(a)*R*1.02,(PH+GAP),-Math.cos(a)*R*1.02,Math.sin(a)*R*1.02,-ROWS*(PH+GAP),-Math.cos(a)*R*1.02)}
    const gg=new THREE.BufferGeometry();gg.setAttribute("position",new THREE.Float32BufferAttribute(gp,3));
    gridLines=new THREE.LineSegments(gg,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:scanU,
      vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
      fragmentShader:`uniform float uScanY;uniform vec3 uLime,uLimeD;varying vec3 vW;void main(){float b=smoothstep(1.4,0.,abs(vW.y-uScanY));gl_FragColor=vec4(mix(uLimeD,uLime,b),.12+.6*b);}`}));
    wall.add(gridLines);
  }
  // scan laser: horizontal glowing sheet
  const laser=new THREE.Mesh(new THREE.PlaneGeometry(14,.5),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:scanU,
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform vec3 uLime;uniform float uTime;varying vec2 vUv;void main(){float core=smoothstep(.04,0.,abs(vUv.y-.5));float halo=smoothstep(.5,0.,abs(vUv.y-.5))*.35;float x=smoothstep(0.,.3,vUv.x)*smoothstep(1.,.7,vUv.x);float n=.85+.15*sin(vUv.x*80.-uTime*12.);gl_FragColor=vec4(uLime,(core+halo)*x*n);}`}));
  laser.position.z=-R*.92; scene.add(laser);
  // dust
  const dg=new THREE.BufferGeometry(),dp=[];for(let i=0;i<(LITE?1000:2500);i++)dp.push((Math.random()-.5)*12,-Math.random()*40+3,-Math.random()*7);
  dg.setAttribute("position",new THREE.Float32BufferAttribute(dp,3));
  const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xFFFFFF,size:.012,transparent:true,opacity:.5,depthWrite:false}));scene.add(dust);

  let W=0,H=0,t0=0,prog=0,smooth=0,lastIdx=-1;
  let focused=null, cand=null, candT=0, outT=0, lastProg=0, touch=false;
  const ray=new THREE.Raycaster(), pv=new THREE.Vector2(), fwd=new THREE.Vector3(), tq=new THREE.Quaternion(), tp=new THREE.Vector3();
  let pointerIn=false; canvas.addEventListener('pointerenter',()=>pointerIn=true); canvas.addEventListener('pointerleave',()=>pointerIn=false);
  canvas.addEventListener('pointerdown',e=>{touch=e.pointerType!=='mouse'});
  canvas.addEventListener('click',e=>{mouse.nx=e.clientX/innerWidth*2-1;mouse.ny=-(e.clientY/innerHeight*2-1);pv.set(mouse.nx,mouse.ny);ray.setFromCamera(pv,camera);const h=ray.intersectObjects(focused?[focused]:panels)[0];
    if(focused && (!h)) {setFocus(null);return} if(h && h.object!==focused) setFocus(h.object); else if(touch && h && h.object===focused) setFocus(null);});
  addEventListener('keydown',e=>{if(e.key==='Escape')setFocus(null)});
  function setFocus(m){ if(focused&&focused.userData.video)focused.userData.video.pause(); focused=m; outT=0; candT=0;
    if(m&&m.userData.video){m.userData.video.currentTime=0;m.userData.video.play().catch(()=>{})}
    $("#lab").classList.toggle('focus',!!m); if(m){const it=m.userData.it;$("#labTitle").textContent=it.title;$("#labTools").textContent=(it.tools||"Real-time").toUpperCase();} }
  const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
  let builtNarrow=null;
  function resize(){W=innerWidth;H=innerHeight;renderer.setPixelRatio(DPR(LITE?1.5:2));renderer.setSize(W,H,false);camera.aspect=W/H;camera.updateProjectionMatrix();
    const nar=innerWidth<820; if(nar!==builtNarrow){builtNarrow=nar;build();} // phone URL-bar resizes no longer rebuild the wall
    $("#labSpacer").style.height=(ROWS*55)+"vh";laser.position.z=-R*.9;}
  addEventListener("resize",()=>{if($("#lab").classList.contains("on"))resize()});
  addEventListener("scroll",()=>{if(!$("#lab").classList.contains("on"))return;const max=document.documentElement.scrollHeight-innerHeight;prog=max>0?Math.min(1,scrollY/max):0},{passive:true});
  function frame(now){
    const t=(now-t0)/1000; scanU.uTime.value=t;
    smooth+=(prog-smooth)*.08;
    const top=.2, bottom=-(ROWS-1)*(PH+GAP);
    const camY=top+(bottom-top)*smooth;
    const par=focused?0:1;
    camera.position.set(mouse.nx*.35*par, camY+.15+mouse.ny*.12*par, .4);
    camera.lookAt(mouse.nx*.15*par, camY-.05, -R);
    camera.updateMatrixWorld();
    if(Math.abs(prog-lastProg)>.004 && focused) setFocus(null); lastProg=prog;
    // pointing: dwell on a panel to bring it forward, move off it to send it back
    if(!touch && pointerIn){pv.set(mouse.nx,mouse.ny);ray.setFromCamera(pv,camera);
      if(focused){const h=ray.intersectObject(focused)[0]; if(!h && focused.userData.f>.95){outT+=16; if(outT>260) setFocus(null)} else outT=0;}
      else {const h=ray.intersectObjects(panels)[0]; const o=h?h.object:null; if(o!==cand){cand=o;candT=0} else if(o){candT+=16; if(candT>420) setFocus(o)} canvas.style.cursor=o?'zoom-in':'default';}
    }
    const vh=2*2.2*Math.tan(camera.fov*Math.PI/360), vw=vh*camera.aspect;
    const scanY=camY+Math.sin(t*.9)*.05; scanU.uScanY.value=scanY; laser.position.y=scanY;
    let best=null,bd=1e9;
    const anyF=focused?1:0;
    for(const m of panels){const u=m.userData;const d=Math.abs(u.home.p.y-scanY);const target=d<PH*.62?1:0;u.act+=(target-u.act)*.08;m.material.uniforms.uActive.value=u.act;u.frame.material.uniforms.uA.value=u.act*(1-u.f);
      u.f+=((focused===m?1:0)-u.f)*.09; const e=ease(Math.min(1,Math.max(0,u.f)));
      m.material.uniforms.uClean.value=u.f; m.material.uniforms.uDim.value+=((anyF&&focused!==m?1:0)-m.material.uniforms.uDim.value)*.08;
      if(u.f>.002){const ta=m.material.uniforms.uAspect.value||1.6;let hT=Math.min(vh*.74,vw*.84/ta);const sx=hT*ta/PW, sy=hT/PH;
        camera.getWorldDirection(fwd);tp.copy(camera.position).addScaledVector(fwd,2.2);m.position.lerpVectors(u.home.p,tp,e);
        m.quaternion.slerpQuaternions(u.home.q,camera.quaternion,e);m.scale.set(1+(sx-1)*e,1+(sy-1)*e,1);m.renderOrder=10;m.material.depthTest=e<.4;}
      else if(m.renderOrder){m.position.copy(u.home.p);m.quaternion.copy(u.home.q);m.scale.set(1,1,1);m.renderOrder=0;m.material.depthTest=true;}
      const dd=d+Math.abs(m.position.x)*.3;if(dd<bd){bd=dd;best=m}}
    dust.rotation.y=t*.01; dust.position.y=Math.sin(t*.2)*.1;
    renderer.render(scene,camera);
    if(best&&!focused){const idx=panels.indexOf(best);if(idx!==lastIdx){lastIdx=idx;const it=best.userData.it;$("#labTitle").textContent=it.title;$("#labTools").textContent=(it.tools||"Real-time").toUpperCase();$("#labIdx").textContent=String(idx+1).padStart(2,"0")+" / "+panels.length}}
    $("#labProg").style.height=(smooth*100)+"%";
  }
  return {start(){t0=performance.now();resize();prog=0;smooth=0;if(REDUCED){frame(t0+1000);return}runLoop(frame)},stop(){stopLoop()}};
})();

/* ---------- ABOUT: portrait as particles, with the home scan line ---------- */
const Portrait = (function(){
  const fig=$("#portrait"); if(!fig) return {render(){},start(){}};
  if(!HAS_GL){fig.classList.add("nogl");return {render(){},start(){}}}
  const canvas=$("#gl-portrait");
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setClearColor(0x000000,0);
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(30,4/5,.1,50); camera.position.set(0,0,4.6);
  const U={uTime:{value:0},uScan:{value:-2},uMouse:{value:new THREE.Vector2(9,9)},uIntro:{value:0},uPx:{value:1},uLime:{value:LIME}};
  let pts=null, t0=0, ready=false;
  const im=new Image();
  im.onload=()=>{
    const w=300,h=375,c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");g.drawImage(im,0,0,w,h);const d=g.getImageData(0,0,w,h).data;
    const pos=[],lum=[],rnd=[];const SW=1.97,SH=2.46;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const L=d[(y*w+x)*4]/255; if(L>.92) continue; // drop the white backdrop
      if(Math.random()>.72) continue;
      pos.push((x/w-.5)*SW+(Math.random()-.5)*.006,-(y/h-.5)*SH+(Math.random()-.5)*.006,(Math.random()-.5)*.05+(L-.5)*.12);lum.push(L);rnd.push(Math.random());}
    const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));geo.setAttribute("aL",new THREE.Float32BufferAttribute(lum,1));geo.setAttribute("aR",new THREE.Float32BufferAttribute(rnd,1));
    pts=new THREE.Points(geo,new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.NormalBlending,
      vertexShader:`uniform float uTime,uScan,uIntro,uPx;uniform vec2 uMouse;attribute float aL,aR;varying float vL,vS;
        void main(){vec3 p=position;vL=aL;
          p.z+=sin(p.y*5.+uTime*1.3+aR*6.28)*.025;
          float d=distance(p.xy,uMouse);p+=vec3(normalize(p.xy-uMouse+.0001),.4)*smoothstep(.35,0.,d)*.18;
          vec3 off=vec3(sin(aR*91.),cos(aR*57.),sin(aR*13.))*1.8;p=mix(p+off,p,smoothstep(0.,1.,clamp(uIntro*1.3-aR*.3,0.,1.)));
          vS=smoothstep(.07,0.,abs(p.y-uScan));
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=(1.9+aR*.9+vS*2.)*uPx*(4.6/-mv.z);}`,
      fragmentShader:`uniform vec3 uLime;varying float vL,vS;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;
        float b=.12+pow(smoothstep(.06,.84,vL),.7)*1.1;vec3 col=mix(vec3(b),uLime,clamp(vS*1.3,0.,1.));gl_FragColor=vec4(col,smoothstep(.5,0.,d)*(.85+vS*.4));}`}));
    scene.add(pts);ready=true;};
  im.src=$("#portraitImg").src;
  function size(){const r=canvas.getBoundingClientRect();if(!r.width)return;const pr=DPR(LITE?1.5:2);renderer.setPixelRatio(pr);renderer.setSize(r.width,r.height,false);U.uPx.value=pr*r.height/650;}
  addEventListener("resize",size);
  const ray=new THREE.Raycaster(),pv=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),0),hit=new THREE.Vector3();
  return {start(){t0=performance.now();U.uIntro.value=0;size();},
    render(now){if(!ready)return;const r=canvas.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
      if(renderer.domElement.width===0)size();
      const t=(now-t0)/1000;U.uTime.value=t;U.uIntro.value=Math.min(1,t/2.4);
      U.uScan.value=1.15-((t*.32)%1)*2.6; // scan sweeps top to bottom
      pv.set(((mouse.x-r.left)/r.width)*2-1,-((mouse.y-r.top)/r.height)*2+1);ray.setFromCamera(pv,camera);
      if(Math.abs(pv.x)<1.2&&Math.abs(pv.y)<1.2&&ray.ray.intersectPlane(plane,hit))U.uMouse.value.set(hit.x,hit.y);else U.uMouse.value.set(9,9);
      pts.rotation.y=Math.sin(t*.25)*.06+(pv.x>-1.2&&pv.x<1.2?pv.x*.08:0);
      renderer.render(scene,camera);}};
})();

/* ---------- AMBIENT: 3D world seen through frosted glass ---------- */
const Amb = (function(){
  if(!HAS_GL) return {start(){},stop(){}};
  const canvas=$("#gl-amb");
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setClearColor(0x000000,0);
  const scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x000000,.06);
  const camera=new THREE.PerspectiveCamera(55,1,.05,120);
  const U={uTime:{value:0},uLime:{value:LIME},uLimeD:{value:LIME_D},uPx:{value:1}};
  // floor grid with a slow travelling glow
  {const v=[];const N=40,S=1.4;for(let i=-N;i<=N;i++){v.push(i*S,0,-N*S,i*S,0,N*S,-N*S,0,i*S,N*S,0,i*S)}
   const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(v,3));
   var floor=new THREE.LineSegments(g,new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
     vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
     fragmentShader:`uniform float uTime;uniform vec3 uLime;varying vec3 vW;void main(){float d=length(vW.xz-cameraPosition.xz);
       float pulse=smoothstep(1.,0.,abs(fract(-vW.z*.04+uTime*.03)-.5)*6.);vec3 c=mix(vec3(.5),uLime,pulse);
       gl_FragColor=vec4(c,.75*(1.-smoothstep(3.,26.,d))*(.45+pulse*.9));}`}));floor.position.y=-2.2;scene.add(floor);}
  // soft glowing orbs (read as light through the glass)
  const orbs=[];[[-4.5,1.2,-8,1.6,LIME],[5,-.6,-7,1.2,LIME_D],[1.5,2.4,-13,2.2,LIME_D],[-2,-1.4,-5,.6,LIME]].forEach(([x,y,z,s,c],i)=>{
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uC:{value:c},uA:{value:i%2?.55:.45}},
      vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`uniform vec3 uC;uniform float uA;varying vec2 vUv;void main(){float d=length(vUv-.5)*2.;gl_FragColor=vec4(uC,uA*pow(max(0.,1.-d),2.2));}`}));
    m.scale.setScalar(s*3);m.position.set(x,y,z);m.userData.b=new THREE.Vector3(x,y,z);scene.add(m);orbs.push(m)});
  // a few slow wireframe solids
  const solids=[];[[new THREE.IcosahedronGeometry(.9,1),-5.2,1.,-7],[new THREE.TorusKnotGeometry(.55,.16,90,10),4.6,1.8,-10],[new THREE.OctahedronGeometry(.7,0),3.4,-1.2,-5.5]]
    .forEach(([g,x,y,z],i)=>{const m=new THREE.LineSegments(new THREE.EdgesGeometry(g),new THREE.LineBasicMaterial({color:i===1?0xD1FB46:0xFFFFFF,transparent:true,opacity:.85}));m.scale.setScalar(1.6);m.position.set(x,y,z);m.userData.b=new THREE.Vector3(x,y,z);m.userData.s=.15+Math.random()*.2;scene.add(m);solids.push(m)});
  // dust
  {const n=LITE?700:1600,p=[],r=[];for(let i=0;i<n;i++){p.push((Math.random()-.5)*30,(Math.random()-.5)*12,(Math.random()-.5)*30);r.push(Math.random())}
   const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));g.setAttribute("aR",new THREE.Float32BufferAttribute(r,1));
   scene.add(new THREE.Points(g,new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
     vertexShader:`uniform float uTime,uPx;attribute float aR;void main(){vec3 p=position;p.y+=sin(uTime*.15+aR*40.)*.3;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=(1.5+aR*2.5)*uPx*(4./-mv.z);}`,
     fragmentShader:`void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(.9),smoothstep(.5,0.,d)*.75);}`})));}
  let mode="",t0=0,sm=0;
  function resize(){const pr=LITE?.35:DPR(1.5);renderer.setPixelRatio(pr);renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();U.uPx.value=pr*innerHeight/900;}
  addEventListener("resize",()=>{if(mode)resize()});
  function frame(now){const t=(now-t0)/1000;U.uTime.value=t;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);sm+=(scrollY/max-sm)*.06;
    camera.position.set(mouse.nx*.5,.2+mouse.ny*.25-sm*1.2,6-sm*9);camera.lookAt(mouse.nx*.15,-sm*1.4,-6-sm*9);
    floor.position.z=Math.floor(camera.position.z/1.4)*1.4;
    solids.forEach((m,i)=>{m.rotation.x=t*m.userData.s;m.rotation.y=t*m.userData.s*1.3;m.position.y=m.userData.b.y+Math.sin(t*.35+i)*.25;m.position.z=m.userData.b.z+camera.position.z-6});
    orbs.forEach((m,i)=>{m.position.x=m.userData.b.x+Math.sin(t*.08+i*2)*1.2;m.position.y=m.userData.b.y+Math.cos(t*.06+i)*.6;m.position.z=m.userData.b.z+camera.position.z-6;m.quaternion.copy(camera.quaternion)});
    renderer.render(scene,camera);if(mode==="about")Portrait.render(now);}
  return {start(m){mode=m;resize();t0=performance.now();if(m==="about")Portrait.start();canvas.classList.add("on");$("#frost").classList.add("on");if(REDUCED){frame(t0+2000);return}runLoop(frame,LITE?30:60)},
    stop(){mode="";canvas.classList.remove("on");$("#frost").classList.remove("on");stopLoop()}};
})();
// deepen the glass while choosing a project
document.querySelectorAll("#collage .item,#mosaic .tile").forEach(el=>{el.addEventListener("pointerenter",()=>document.body.classList.add("choosing"));el.addEventListener("pointerleave",()=>document.body.classList.remove("choosing"))});
document.querySelectorAll("#collage .item .ph,#mosaic .tile").forEach(el=>el.insertAdjacentHTML("beforeend",'<i class="sweep"></i>'));
addEventListener("hashchange",()=>document.body.classList.remove("choosing"));

/* ---------- reveal on scroll ---------- */
const revealIO=("IntersectionObserver" in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");revealIO.unobserve(e.target)}}),{rootMargin:"0px 0px -6% 0px"}):null;
document.querySelectorAll("#collage .item,#mosaic .tile,#about .card").forEach((el,i)=>{el.classList.add("rv");el.style.setProperty("--d",(i%3)*80+"ms");revealIO?revealIO.observe(el):el.classList.add("in")});
