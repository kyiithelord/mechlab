import fs from 'node:fs/promises'
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
// Node has Blob but not FileReader. The exporter only needs array buffers for this texture-free model.
globalThis.FileReader = class {
  result = null
  onloadend = null
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(buffer => { this.result = buffer; this.onloadend?.() }) }
}
const metal=(color,metalness=.75,roughness=.3)=>new THREE.MeshStandardMaterial({color,metalness,roughness})
const steel=metal('#9eada8'),blue=metal('#688d96'),bronze=metal('#caa778'),dark=metal('#435b5c'),base=metal('#263a3d',.55,.4)
function gearGeometry(teeth,radius){const shape=new THREE.Shape();for(let i=0;i<teeth*4;i++){const a=i*Math.PI*2/(teeth*4)-Math.PI/2;const r=radius*(i%4===0||i%4===3?1.09:1);if(!i)shape.moveTo(Math.cos(a)*r,Math.sin(a)*r);else shape.lineTo(Math.cos(a)*r,Math.sin(a)*r)}shape.closePath();const center=new THREE.Path();center.absarc(0,0,radius*.16,0,Math.PI*2,true);shape.holes.push(center);return new THREE.ExtrudeGeometry(shape,{depth:.3,bevelEnabled:true,bevelThickness:.025,bevelSize:.018,bevelSegments:2,curveSegments:8})}
function mesh(name,geometry,material,parent,position=[0,0,0],rotation=[0,0,0]){const obj=new THREE.Mesh(geometry,material);obj.name=name;obj.position.set(...position);obj.rotation.set(...rotation);parent.add(obj);return obj}
const scene=new THREE.Scene();scene.name='MechLab_GearSystem';const assembly=new THREE.Group();assembly.name='GearSystemAssembly';scene.add(assembly)
function addGear(name,x,teeth,radius,color){const group=new THREE.Group();group.name=`${name}Assembly`;group.position.x=x;assembly.add(group);mesh(`${name}Gear`,gearGeometry(teeth,radius),color,group);mesh(`${name}Hub`,new THREE.CylinderGeometry(radius*.21,radius*.21,.22,32),bronze,group,[0,0,.35],[Math.PI/2,0,0]);mesh(`${name}SpokeRing`,new THREE.TorusGeometry(radius*.42,.055,10,40),steel,group,[0,0,.33]);for(let i=0;i<6;i++){const spoke=mesh(`${name}Spoke${i+1}`,new THREE.BoxGeometry(radius*.65,.085,.09),steel,group,[0,0,.34],[0,0,i*Math.PI/3]);spoke.userData.component=name.toLowerCase()}return group}
addGear('Driver',-.55,20,.55,steel);addGear('Driven',1.1,40,1.1,blue)
const teethMarker=mesh('GearTeeth',new THREE.BoxGeometry(.085,.085,.35),bronze,assembly.getObjectByName('DriverAssembly'),[.57,0,.16]);teethMarker.userData.component='teeth'
for(const [name,x] of [['Input',-.55],['Output',1.1]]){mesh(`${name}Shaft`,new THREE.CylinderGeometry(.13,.13,1.45,28),dark,assembly,[x,0,-.22],[Math.PI/2,0,0]);mesh(`${name}Bearing`,new THREE.TorusGeometry(.23,.1,12,32),bronze,assembly,[x,0,-.55])}
mesh('MountingPlate',new THREE.BoxGeometry(4.7,3.5,.13),base,assembly,[.28,0,-.85]);for(const x of [-1.75,2.28])for(const y of [-1.35,1.35])mesh(`MountingBolt_${x}_${y}`,new THREE.CylinderGeometry(.08,.08,.08,12),bronze,assembly,[x,y,-.76],[Math.PI/2,0,0])
const data=await new GLTFExporter().parseAsync(scene,{binary:true,onlyVisible:true,trs:true});await fs.writeFile(new URL('../public/models/gears/gear-system.glb',import.meta.url),Buffer.from(data));console.log('Generated public/models/gears/gear-system.glb',data.byteLength,'bytes')
