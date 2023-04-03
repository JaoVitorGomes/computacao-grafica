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

let aviao = Aviao();
scene.add(aviao);


let mesh = new THREE.Mesh(aviao, material);
// position the cube
mesh.position.set(0.0, 2.0, 0.0);
// add the cube to the scene
scene.add(mesh);

// Show axes (parameter is size of each axis)
let axesHelper1 = new THREE.AxesHelper(12);
mesh.add(axesHelper1);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Adicionando o angulo do aviao inicial

let angulo = THREE.MathUtils.degToRad(180);   
// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);



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
    if (mesh) {
       mesh.rotation.y -= 0.05 * (targetX + mesh.rotation.y);
       mesh.rotation.x -= 0.05 * (targetY + mesh.rotation.x);
    }
 }
 
 function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
 }

function render()
{
    mouseRotation();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}