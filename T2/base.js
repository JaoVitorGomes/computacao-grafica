import * as THREE from "three";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';

import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import {
  initRenderer,
  initCamera,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createLightSphere,
  getMaxSize
} from "../libs/util/util.js";
import { TreePlane } from "./TreePlane.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene(); // Create main scene

scene.background = new THREE.Color(0x87ceeb); // sets background color to blue
scene.fog = new THREE.Fog(0x87ceeb, 10, 400);

renderer = initRenderer(); // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
let trackballControls = new TrackballControls(camera, renderer.domElement);
material = setDefaultMaterial(); // create a basic material
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.
document.addEventListener("mousemove", onDocumentMouseMove);

let lightPosition = new THREE.Vector3(2, 20, 1);

// light = initDefaultBasicLight(scene, true, lightPosition, 8, 512, 0.1, 100);

let lightSphere = createLightSphere(scene, 0.5, 10, 10, lightPosition);

let dirLight = new THREE.DirectionalLight("whites", 2);
dirLight.position.copy(lightPosition);

// Shadow settings
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 20;
dirLight.shadow.camera.left = -5;
dirLight.shadow.camera.right = 5;
dirLight.shadow.camera.top = 5;
dirLight.shadow.camera.bottom = -5;
dirLight.name = "Direction Light";

scene.add(dirLight);

console.log("light -> ", light);

let plane = 0;

let targetX = 0;
let targetY = 0;

let start = false;

let mouseX = 0;
let mouseY = 0;
let rad = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let valueY = 10;
let valueX = 0;

let mira = new THREE.Vector3(0, 10, 30);

let arrayPlane = new Array();

let lookAtVec = new THREE.Vector3(0.0, 0.0, 0.0);
let camPosition = new THREE.Vector3(0, 0.0, 0);
let upVec = new THREE.Vector3(0.0, 0.0, 0.0);

var cameraGroup = new THREE.Group();
var cameramanGeometry = new THREE.BoxGeometry(1, 1, 1);
var cameramanMaterial = setDefaultMaterial();
var cameraman = new THREE.Mesh(cameramanGeometry, cameramanMaterial);


const materiallinha = new THREE.LineBasicMaterial( { color: 0x0000ff,linewidth: 3 } );
const points = [];
points.push( new THREE.Vector3(-0.5, 0, 0 ) );
points.push( new THREE.Vector3( 0.5, 0, 0 ) );
points.push( new THREE.Vector3( 0.5, 1, 0 ) );
points.push( new THREE.Vector3(-0.5, 1, 0 ) );
points.push( new THREE.Vector3(-0.5, 0, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( geometry, materiallinha );
line.position.set(mira.x,mira.y,mira.z)
scene.add( line );

cameraman.position.set(0, 10, 30);
cameraman.visible = true;
cameraGroup.add(cameraman);
scene.add(cameraman);

let virtualCamera = new THREE.PerspectiveCamera(45, 1.5, 1.0, 480.0);
virtualCamera.position.copy(camPosition);
virtualCamera.up.copy(upVec);
virtualCamera.lookAt(lookAtVec);

cameraman.add(virtualCamera);


let raycaster = new THREE.Raycaster();

// Enable layers to raycaster and camera (layer 0 is enabled by default)
raycaster.layers.enable( 0 );           
virtualCamera.layers.enable( 0 );
// Create list of plane objects 
let planeRay, planeGeometry, planeMaterial;

function RaycasterPlane(){
   planeGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
   planeMaterial = new THREE.MeshLambertMaterial();
   planeMaterial.side = THREE.DoubleSide;
   planeMaterial.opacity = 0;
   planeMaterial.transparent = true;

   planeRay = new THREE.Mesh(planeGeometry, planeMaterial);
   scene.add(planeRay);

// Change plane's layer, position and color
let colors = ["red", "green", "blue", "white"];
  planeRay.translateZ(-0*6 + 6); // change position
  planeRay.position.set(0,5,0);
  planeRay.layers.set(0);  // change layer
  //planeRay.material.color.set(colors[0]); // change color
}

// aircraft
let asset = {
  object: null,
  loaded: false,
  bb: new THREE.Box3()
}
 
loadGLBFile(asset, '../T2/aircraft.glb', 7.0);


function loadGLBFile(asset, file, desiredScale)
{
 let loader = new GLTFLoader( );
 loader.load( file, function ( gltf ) {
   let obj = gltf.scene;
   obj.traverse( function ( child ) {
     if ( child.isMesh ) {
         child.castShadow = true;
     }
   });
   obj = normalizeAndRescale(obj, desiredScale);
   obj = fixPosition(obj);
   obj.updateMatrixWorld( true );
   obj.rotateY(THREE.MathUtils.degToRad(180));
   obj.rotateX(THREE.MathUtils.degToRad(12));
   obj.position.set(0,10,0)
   scene.add ( obj );

   asset.object = obj;

   }, null, null);
}

function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function fixPosition(obj)
{
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject( obj );
  if(box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1*box.min.y);
  return obj;
}

window.addEventListener(
  "resize",
  function () {
    onWindowResize(virtualCamera, renderer);
  },
  false
);

createArrayPlane();

const lerpConfig = {
  destination: new THREE.Vector3(0, 0, -170),
  alpha: 0.03,
  angle: 0.0,
  move: true,
};
const lerpConfigCamera = {
  destination: new THREE.Vector3(0, 10, -140),
  alpha: 0.03,
  angle: 0.0,
  move: false,
};
const lerpConfigPlaneRay = {
  destination: new THREE.Vector3(0, 5, -170),
  alpha: 0.03,
  angle: 0.0,
  move: false,
};

RaycasterPlane();


const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

window.addEventListener("keydown", (event) => {
  if (event.key == "i") {
    if(start){
      start = false;
      blocker.style.display = 'block';
      instructions.style.display = '';
    }else{
      start = true;
      instructions.style.display = 'none';
      blocker.style.display = 'none';
    }
  }
});

function mouseRotation() {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  if (asset.object) {
    console.log("valor do asset modificado: ", THREE.MathUtils.degToRad(12), asset.object.rotation.y)
    //asset.object.rotation.y -= 0.05 * (targetX + (-testeb + asset.object.rotation.y));
    //asset.object.rotation.x -= 0.05 * (targetY + (-testea + asset.object.rotation.x));
    
    
  }
}

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Trabalho 2");
controls.addParagraph();
controls.add("Use o mouse para mover o avião");
controls.show();

render();


function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  // calculate pointer position in normalized device coordinates
 // (-1 to +1) for both components
  let pointer = new THREE.Vector2();
  pointer.x =  (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, virtualCamera);
  // calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects([planeRay]);
  
  // -- Find the selected objects ------------------------------
  if ((intersects.length > 0) && (line != null))  // Check if there is a intersection
  {      
     let point = intersects[0].point; // Pick the point where interception occurrs
     mira.set(point.x, point.y-0.5, point.z)
        if(planeRay == intersects[0].object ) {
          valueX = point.x;
          valueY = point.y;
        }
  }

}



function createArrayPlane() {
  let positionZ = -60;
  for (var i = 0; i < 5; i++) {
    arrayPlane[i] = new TreePlane(60, 120);
    arrayPlane[i].position.set(0, 0, positionZ);
    scene.add(arrayPlane[i]);
    positionZ -= 120;
  }
}

function modifyArray() {
  scene.remove(arrayPlane[0]);
  for (var i = 1; i < 5; i++) {
    arrayPlane[i - 1] = arrayPlane[i];
  }
  arrayPlane[4] = plane;
}

function moveAirplane(obj) {
  let verifyAngle = 1;
  let diffDist = 1;

  rad = THREE.MathUtils.degToRad(diffDist * verifyAngle * 4);
  let quat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 0),
    rad
  );

  obj.position.lerp(lerpConfig.destination, lerpConfig.alpha);
  cameraman.position.lerp(lerpConfigCamera.destination, lerpConfigCamera.alpha);
  planeRay.position.lerp(lerpConfigPlaneRay.destination, lerpConfigPlaneRay.alpha);
  lerpConfig.destination.x = valueX;
  lerpConfig.destination.y = valueY;
  lerpConfig.destination.z -= 2;
  lerpConfigCamera.destination.z -= 2;
  lerpConfigPlaneRay.destination.z -= 2;
  //obj.quaternion.slerp(quat, lerpConfig.alpha);
}


function render() {
  if (asset.object !== null) {
    if(start){
      moveAirplane(asset.object);
      line.position.set(mira.x,mira.y,planeRay.position.z)
    }
    mouseRotation();
  
  
  if (arrayPlane[1].position.z > asset.object.position.z) {
    plane = new TreePlane(60, 120);
    modifyArray(plane);
    arrayPlane[4] = plane;
    arrayPlane[4].position.set(0, 0, arrayPlane[3].position.z - 120);

    scene.add(arrayPlane[4]);
  }
}
  requestAnimationFrame(render);
  // renderer.render(scene, virtualCamera); // Render scene
  renderer.render(scene, virtualCamera); // Render scene
}
