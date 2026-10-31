import fs from 'node:fs/promises'
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
globalThis.FileReader=class{result=null;onloadend=null;readAsArrayBuffer(blob){blob.arrayBuffer().then(data=>{this.result=data;this.onloadend?.()})}}
const mat=(color,metalness=.7,roughness=.35,opacity=1)=>new THREE.MeshStandardMaterial({color,metalness,roughness,transparent:opacity<1,opacity,side:THREE.DoubleSide})
const iron=mat('#60737a'),machined=mat('#b8c3bf'),dark=mat('#283e43'),bronze=mat('#b8895d'),orange=mat('#b35c38'),blue=mat('#5f8d95'),glass=mat('#5f8290',.4,.35,.27),rubber=mat('#252c2c',.1,.75),red=mat('#b56d54')
const scene=new THREE.Scene();scene.name='MechLab_InlineFourEngine';const root=new THREE.Group();root.name='InlineFourEngine';scene.add(root)
function group(name,parent=root,x=0,y=0,z=0){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent.add(g);return g}
function mesh(name,geometry,material,parent=root,x=0,y=0,z=0,rx=0,ry=0,rz=0){const m=new THREE.Mesh(geometry,material);m.name=name;m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(name,w,h,d,material,parent=root,x=0,y=0,z=0){return mesh(name,new THREE.BoxGeometry(w,h,d),material,parent,x,y,z)}
function cyl(name,rt,rb,h,material,parent,x=0,y=0,z=0,rx=0,ry=0,rz=0,open=false){return mesh(name,new THREE.CylinderGeometry(rt,rb,h,32,1,open),material,parent,x,y,z,rx,ry,rz)}
function tube(name,points,radius,material,parent=root){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(name,new THREE.TubeGeometry(curve,32,radius,9,false),material,parent)}
const xs=[-1.5,-.5,.5,1.5]
// Open front engine block: structural rear wall, side rails, cylinder sleeves and a deep crankcase.
box('EngineBlockRear',4.75,2.2,.28,iron,root,0,.18,-.73)
for(const x of [-2.28,2.28])box('EngineBlockSide',.22,2.2,1.45,iron,root,x,.18,-.02)
box('CrankcaseBase',4.65,.32,1.45,iron,root,0,-1.02,-.02)
box('CrankcaseRear',4.65,.48,.2,dark,root,0,-1.36,-.7)
for(let i=0;i<4;i++){
 const x=xs[i];
 cyl(`CylinderSleeve${i+1}`,.41,.41,1.55,glass,root,x,.34,0,0,0,0,true)
 cyl(`CylinderRim${i+1}`,.42,.42,.08,machined,root,x,1.14,0)
 const piston=group(`PistonAssembly${i+1}`,root,x,.45,0)
 cyl(`Piston${i+1}`,.34,.34,.42,machined,piston)
 for(const y of [-.13,0,.13])cyl(`PistonRing${i+1}`, .345,.345,.026,dark,piston,0,y,0)
 cyl(`WristPin${i+1}`,.08,.08,.7,bronze,piston,0,-.13,0,Math.PI/2)
 const rod=group(`ConnectingRodAssembly${i+1}`,root,x,-.45,0)
 box(`ConnectingRod${i+1}`,.14,.87,.17,machined,rod)
 cyl(`RodBigEnd${i+1}`,.18,.18,.14,bronze,rod,0,-.45,0,Math.PI/2)
 cyl(`RodSmallEnd${i+1}`,.11,.11,.13,bronze,rod,0,.45,0,Math.PI/2)
 const throwGroup=group(`CrankThrow${i+1}`,root,x,-1.48,0)
 for(const offset of [-.13,.13])box(`CrankWeb${i+1}`,.18,.62,.36,iron,throwGroup,offset,.26,0)
 cyl(`CrankPin${i+1}`,.12,.12,.42,bronze,throwGroup,0,.4,0,0,0,Math.PI/2)
 // Valve pair and overhead cam followers, named for component selection.
 for(const [kind,z,material] of [['Intake',-.24,blue],['Exhaust',.24,orange]]){
  const valve=group(`${kind}ValveAssembly${i+1}`,root,x,1.47,z)
  cyl(`${kind}Valve${i+1}`,.055,.055,.55,machined,valve,0,0,0)
  cyl(`${kind}ValveHead${i+1}`,.15,.15,.06,material,valve,0,-.28,0)
  cyl(`${kind}ValveSpring${i+1}`,.11,.11,.2,dark,valve,0,.17,0)
 }
 cyl(`SparkPlug${i+1}`,.06,.06,.48,machined,root,x,1.66,0)
 cyl(`SparkBoot${i+1}`,.12,.12,.2,rubber,root,x,1.88,0)
 tube(`IntakeRunner${i+1}`,[[x,1.35,-.3],[x,1.6,-.65],[x,1.58,-1.18]],.09,blue)
 tube(`ExhaustRunner${i+1}`,[[x,1.36,.32],[x,1.57,.7],[x,1.29,1.12]],.095,orange)
}
// Full length crankshaft and accessory drive.
cyl('Crankshaft',.13,.13,5.05,machined,root,0,-1.48,0,0,0,Math.PI/2)
const flywheel=group('FlywheelAssembly',root,2.62,-1.48,0)
cyl('Flywheel',.68,.68,.22,iron,flywheel,0,0,0,0,0,Math.PI/2)
cyl('FlywheelHub',.24,.24,.28,bronze,flywheel,0,0,0,0,0,Math.PI/2)
for(let i=0;i<8;i++){const a=i*Math.PI/4;cyl(`FlywheelBolt${i+1}`,.035,.035,.05,machined,flywheel,.15,Math.cos(a)*.46,Math.sin(a)*.46,0,0,Math.PI/2)}
const pulley=group('TimingPulleyAssembly',root,-2.6,-1.48,0)
cyl('CrankPulley',.38,.38,.22,dark,pulley,0,0,0,0,0,Math.PI/2)
cyl('PulleyHub',.15,.15,.27,bronze,pulley,0,0,0,0,0,Math.PI/2)
// Cylinder head, camshafts, intake plenum, exhaust collector and oil pan.
box('CylinderHeadRear',4.65,.55,.32,iron,root,0,1.46,-.72)
for(const z of [-.6,.6])box('CylinderHeadRail',4.65,.18,.24,machined,root,0,1.73,z)
for(const z of [-.28,.28])cyl(z<0?'IntakeCamshaft':'ExhaustCamshaft',.10,.10,4.7,bronze,root,0,1.82,z,0,0,Math.PI/2)
for(const x of xs)for(const z of [-.28,.28])cyl('CamLobe',.19,.11,.15,bronze,root,x,1.82,z,0,0,Math.PI/2)
box('ValveCoverSpine',4.7,.16,.25,orange,root,0,2.06,0)
box('IntakePlenum',4.6,.34,.45,blue,root,0,1.53,-1.28)
cyl('ThrottleBody',.25,.25,.55,iron,root,-2.52,1.53,-1.28,0,0,Math.PI/2)
tube('ExhaustManifold',[[1.9,1.25,1.1],[1.3,1.05,1.23],[.3,.98,1.25],[-.7,.9,1.25],[-1.8,.78,1.27]],.16,orange)
cyl('ExhaustOutlet',.19,.19,.65,orange,root,-2.12,.72,1.27,0,0,Math.PI/2)
const pan=group('OilPanAssembly',root,0,-1.9,-.02);box('OilPan',4.4,.55,1.35,dark,pan);box('OilPanRim',4.6,.11,1.5,iron,pan,0,.3,0)
for(const x of [-2,-1,0,1,2]){box('CoolingFin',.045,.68,1.2,iron,root,x,-.5,-.06);cyl('HeadBolt',.055,.055,.12,bronze,root,x,1.84,-.56)}
box('EngineMountLeft',.6,.18,1.6,iron,root,-2.1,-1.83,0);box('EngineMountRight',.6,.18,1.6,iron,root,2.1,-1.83,0)
// A small front badge makes the orientation obvious when users orbit the model.
box('MechLabBadge',.7,.18,.035,red,root,0,1.52,.78)

// Exterior assembly: the default presentation is a complete car engine, with the
// cutaway kept in the same GLB for the lesson's inspect-internals control.
const exterior=group('ExteriorAssembly')
const alloy=mat('#aeb9b2',.7,.28),black=mat('#202b2e',.28,.58),silver=mat('#d0d7cf',.82,.24),copper=mat('#a8754d',.65,.32),accent=mat('#bb663f',.55,.35)
function rounded(name,w,h,d,r,material,parent,x=0,y=0,z=0){return mesh(name,new RoundedBoxGeometry(w,h,d,4,r),material,parent,x,y,z)}
rounded('EngineBlockExterior',4.65,2.35,1.65,.22,alloy,exterior,0,-.05,0)
rounded('CylinderHeadExterior',4.75,.65,1.73,.17,silver,exterior,0,1.32,0)
rounded('ValveCoverExterior',4.53,.62,1.48,.24,black,exterior,0,1.91,0)
rounded('ValveCoverAccent',4.1,.055,.88,.025,accent,exterior,0,2.23,0)
rounded('ValveCoverCenterRib',4.1,.07,.13,.025,silver,exterior,0,2.28,.04)
for(const x of xs){
 rounded('IgnitionCoil',.38,.27,.32,.06,black,exterior,x,2.31,0)
 cyl('CoilFastener',.045,.045,.045,silver,exterior,x,2.46,.08)
 rounded('CylinderHeadRib',.055,.36,1.55,.018,iron,exterior,x+.43,1.35,0)
 // Intake side: four curved cast-aluminum runners feed the cylinders.
 tube('IntakeManifoldRunner',[[x,1.2,.82],[x,1.13,1.17],[x,.88,1.48],[x,.72,1.65]],.16,silver,exterior)
 cyl('IntakePortCollar',.21,.21,.15,bronze,exterior,x,1.2,.83,Math.PI/2)
 // Exhaust side, visible when orbiting to the rear of the engine.
 tube('ExhaustHeader',[[x,1.13,-.86],[x,1.0,-1.23],[x-.1,.65,-1.47]],.11,iron,exterior)
 for(const z of [.81,-.81])cyl('HeadFastener',.048,.048,.08,dark,exterior,x,1.62,z)
}
rounded('IntakePlenumExterior',4.5,.47,.48,.18,blue,exterior,0,.65,1.65)
cyl('ThrottleBodyExterior',.31,.31,.6,silver,exterior,-2.48,.65,1.65,0,0,Math.PI/2)
cyl('ThrottleValve',.18,.18,.06,dark,exterior,-2.84,.65,1.65,0,0,Math.PI/2)
tube('FuelRail',xs.map(x=>[x,1.48,.94]),.055,copper,exterior)
for(const x of xs)cyl('FuelInjector',.08,.08,.23,copper,exterior,x,1.32,.94)
rounded('ExhaustCollectorExterior',4.2,.24,.23,.1,iron,exterior,0,.55,-1.45)
tube('ExhaustDownpipe',[[-1.75,.53,-1.45],[-2.05,.15,-1.53],[-2.0,-.5,-1.49]],.19,iron,exterior)
// Side detail: oil filter, starter motor, mounts, gasket lines and cast ribs.
const oilFilter=group('OilFilterAssembly',exterior,1.33,-.8,.98)
cyl('OilFilter',.26,.26,.65,blue,oilFilter,0,0,0,Math.PI/2)
cyl('OilFilterCap',.27,.27,.07,dark,oilFilter,0,0,.34,Math.PI/2)
const starter=group('StarterMotorAssembly',exterior,1.62,-1.02,-.8)
cyl('StarterMotor',.23,.23,.95,dark,starter,0,0,0,0,0,Math.PI/2)
cyl('StarterSolenoid',.11,.11,.6,copper,starter,0,.24,0,0,0,Math.PI/2)
for(const x of [-1.9,-1.1,-.3,.5,1.3,2.1]){rounded('BlockCastingRib',.07,1.72,.12,.025,iron,exterior,x,-.12,.88);cyl('BlockSideBolt',.07,.07,.1,dark,exterior,x,-.72,.91,Math.PI/2)}
rounded('OilPanExterior',4.48,.63,1.58,.19,dark,exterior,0,-1.8,0)
rounded('OilPanFlange',4.62,.12,1.72,.04,iron,exterior,0,-1.47,0)
for(const x of [-1.9,-1.2,-.5,.2,.9,1.6])rounded('OilPanFin',.05,.24,1.48,.015,iron,exterior,x,-2.1,0)
cyl('OilFillerCap',.22,.22,.14,black,exterior,1.55,2.32,-.35)
for(let i=0;i<12;i++){const a=i*Math.PI/6;box('OilCapGrip',.06,.08,.07,dark,exterior,1.55+Math.cos(a)*.2,2.4,-.35+Math.sin(a)*.2)}
// Front accessory drive is oriented along the crankshaft (X axis).
const accessory=group('AccessoryDriveAssembly',exterior)
function wheel(name,x,y,z,r,material){const w=group(name,accessory,x,y,z);cyl(name+'Body',r,r,.2,material,w,0,0,0,0,0,Math.PI/2);cyl(name+'Hub',r*.26,r*.26,.27,bronze,w,-.12,0,0,0,0,Math.PI/2);return w}
wheel('CrankPulleyExterior',-2.7,-1.48,0,.44,dark)
wheel('CamPulleyExterior',-2.7,1.86,0,.33,dark)
wheel('TensionerPulley',-2.72,-.14,1.3,.22,iron)
wheel('AlternatorPulley',-3.25,.5,1.1,.31,dark)
wheel('WaterPumpPulley',-2.76,.12,-1.04,.29,iron)
const alternator=group('AlternatorAssembly',exterior,-2.92,.5,1.1)
cyl('AlternatorHousing',.47,.47,.7,iron,alternator,0,0,0,0,0,Math.PI/2)
for(let i=0;i<10;i++){const a=i*Math.PI/5;box('AlternatorVent',.52,.045,.09,black,alternator,0,Math.cos(a)*.39,Math.sin(a)*.39)}
cyl('AlternatorEndCap',.32,.32,.1,bronze,alternator,.39,0,0,0,0,Math.PI/2)
// The belt is a black continuous loop that wraps the accessory pulley centers.
tube('SerpentineBelt',[[-2.92,-1.84,-.25],[-2.92,-1.86,.28],[-3.1,-.6,1.45],[-3.48,.37,1.37],[-3.48,.75,1.1],[-3.08,1.92,.27],[-2.92,2.2,0],[-2.92,1.92,-.3],[-2.92,.2,-1.34],[-2.92,-.1,-1.27],[-2.92,-1.84,-.25]],.045,rubber,accessory)
for(const z of [-.6,.6])rounded('AccessoryBracket',.18,1.38,.14,.035,dark,exterior,-2.45,-.4,z)
// Wiring, coolant and vacuum hoses improve the recognizability of the exterior.
tube('UpperCoolantHose',[[-2.07,1.12,-.65],[-2.45,1.4,-.82],[-2.83,1.29,-1.1]],.12,rubber,exterior)
tube('LowerCoolantHose',[[-1.85,-.93,-.72],[-2.42,-1.05,-1.18],[-2.85,-.86,-1.23]],.13,rubber,exterior)
for(const x of xs)tube('IgnitionWire',[[x,2.43,0],[x,2.55,-.38],[1.9,2.48,-.63]],.035,black,exterior)

const data=await new GLTFExporter().parseAsync(scene,{binary:true,onlyVisible:true,trs:true});const path=new URL('../public/models/engine/inline-four-engine.glb',import.meta.url);await fs.writeFile(path,Buffer.from(data));console.log('Generated',path.pathname,data.byteLength,'bytes')
