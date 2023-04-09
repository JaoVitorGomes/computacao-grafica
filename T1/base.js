import * as THREE from  'three';

//Importando o aviao
import {Aviao} from './aviao.js';

import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import GUI from '../libs/util/dat.gui.module.js'
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
let trackballControls = new TrackballControls(camera, renderer.domElement );
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
document.addEventListener('mousemove', onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let rad = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let valueY = 0;
let valueX = 0;


let lookAtVec = new THREE.Vector3(0.0, 0.0, 0.0);
let camPosition = new THREE.Vector3(0, 0.0, 0);
let upVec = new THREE.Vector3(0.0, 0.0, 0.0);

var cameratest = new THREE.Group();
var cameramanGeometry = new THREE.BoxGeometry(1, 1, 1);
var cameramanMaterial = setDefaultMaterial();
var cameraman = new THREE.Mesh(cameramanGeometry, cameramanMaterial);
cameraman.position.set(0,10,30);
cameratest.add(cameraman);
scene.add(cameraman);

let virtualCamera = new THREE.PerspectiveCamera(45, 1.3, 1.0, 50.0);
virtualCamera.position.copy(camPosition);
virtualCamera.up.copy(upVec);
virtualCamera.lookAt(lookAtVec);

cameraman.add(virtualCamera);

let anguloVisao = THREE.MathUtils.degToRad(45/2)

let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );


let aviao = Aviao();
scene.add(aviao);
console.log("aviao: ",aviao);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );



// create the ground plane
let plane = createGroundPlaneXZ(20, 2000)
scene.add(plane);

const lerpConfig = {
   destination: new THREE.Vector3(0, 0, -170),
   alpha: 0.03,
   angle: 0.0,
   move: true
}
const lerpConfigCamera = {
   destination: new THREE.Vector3(0,10, -140),
   alpha: 0.03,
   angle: 0.0,
   move: true
}


// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Trabalho 1");
  controls.addParagraph();
  controls.add("Use o mouse para mover o avião");
  controls.show();



render();

function mouseRotation() {
    targetX = mouseX * .001;
    targetY = mouseY * .001;

    if (aviao) {
      aviao.rotation.y -= 0.05 * (targetX + aviao.rotation.y);
      aviao.rotation.x -= 0.05 * (targetY + aviao.rotation.x);
    }
 }
 
 function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
 }

 function moveFlyer(obj) {
   valueY = ((mouseY * (Math.tan(anguloVisao) * 30)) / windowHalfY);
   valueX = ((mouseX * (Math.tan(anguloVisao) * 30)) / windowHalfX);

   //let diffDist = aviao.position.distanceTo(lerpConfig.destination);
   let verifyAngle = 1;
   let diffDist =aviao.position.x - lerpConfig.destination.x ;

   //if(valueX > obj.position.x){verifyAngle = -1}
   //if(valueX == obj.position.x || diffDist > 24){verifyAngle = 0 }
   
   rad = THREE.MathUtils.degToRad(diffDist * verifyAngle * 4);
   let quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad);

   obj.position.lerp(lerpConfig.destination, lerpConfig.alpha);
   cameraman.position.lerp(lerpConfigCamera.destination, lerpConfigCamera.alpha);
   lerpConfig.destination.x = valueX;
   lerpConfig.destination.y = valueY* (-1);
   obj.quaternion.slerp(quat, lerpConfig.alpha)


}


function render()
{
   if (lerpConfig.move) {
      moveFlyer(aviao)
   }

   mouseRotation();
  requestAnimationFrame(render);
  renderer.render(scene, virtualCamera) // Render scene
}