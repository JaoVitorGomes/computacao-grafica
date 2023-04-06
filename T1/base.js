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
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let valueY = 0;
let valueX = 0;


let lookAtVec = new THREE.Vector3(0.0, 5, 0.0);
let camPosition = new THREE.Vector3(0, 5, 30);
let upVec = new THREE.Vector3(0.0, 0.0, 0.0);


let virtualCamera = new THREE.PerspectiveCamera(45, 1.3, 1.0, 50.0);
virtualCamera.position.copy(camPosition);
virtualCamera.up.copy(upVec);
virtualCamera.lookAt(lookAtVec);



let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );


let aviao = Aviao();
scene.add(aviao);
console.log("aviao: ",aviao);



// Show axes (parameter is size of each axis)
// let axesHelper1 = new THREE.AxesHelper(12);
// mesh.add(axesHelper1);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)


// Adicionando o angulo do aviao inicial

let angulo = THREE.MathUtils.degToRad(180);   
// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

const lerpConfig = {
   destination: new THREE.Vector3(targetX, targetY, -70),
   alpha: 0.01,
   angle: 0.0,
   move: false
}
const lerpConfigCamera = {
   destination: new THREE.Vector3(0,0, -40),
   alpha: 0.01,
   angle: 0.0,
   move: false
}


// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();



// buildInterface();
render();

// function buildInterface()
// {     

//   var controls = new function () {
//     this.onMoveObject = function () {
//     //   sphere.position.set(-5.0, 1.0, -5.0);
//     //   sphere2.position.set(-5.0, 1.0, 5.0);
//     };
//  };


//   let gui = new GUI();
//   let folder = gui.addFolder("Opcoes");
//     folder.open(); 
//     folder.add(lerpConfig, "move",  true);
//     folder.add(lerpConfig2, "move",  true);
//     folder.add(controls, 'onMoveObject').name(" RESET ");
// }

function mouseRotation() {
    targetX = mouseX * .001;
    targetY = mouseY * .001;
    if (aviao) {
      aviao.rotation.y -= 0.05 * (targetX + aviao.rotation.y);
      aviao.rotation.x -= 0.05 * (targetY + aviao.rotation.x);
      aviao.rotation.z -= 0.05 * (targetX + aviao.rotation.z);
    }
 }
 
 function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY );
 }

 function stopWhenCloseEnough(obj, quat) {
   valueY = ((mouseY * (Math.tan(0.3926991) * 30)) / windowHalfY);
   valueX = ((mouseX * (Math.tan(0.3926991) * 30)) / windowHalfX);

   lerpConfig.destination.x = valueX;
   lerpConfig.destination.y = valueY* (-1);

   let maxDiff = 0.1;
   let diffAngle = obj.quaternion.angleTo(quat)
   let diffDist = obj.position.distanceTo(lerpConfig.destination)
   if (diffAngle < maxDiff && diffDist < maxDiff) {
      lerpConfig.move = false;
   }
}


function render()
{
   if (lerpConfig.move) {
      let rad = THREE.MathUtils.degToRad(lerpConfig.angle)
      let quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad);
      aviao.position.lerp(lerpConfig.destination, lerpConfig.alpha);
      virtualCamera.position.lerp(lerpConfigCamera.destination, lerpConfigCamera.alpha);
      aviao.quaternion.slerp(quat, lerpConfig.alpha)
      console.log("movimento slerp: ",lerpConfig.destination);
      stopWhenCloseEnough(aviao, quat)
      
   }


   mouseRotation();
  requestAnimationFrame(render);
  renderer.render(scene, virtualCamera) // Render scene
}