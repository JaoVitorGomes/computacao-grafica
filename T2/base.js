import * as THREE from "three";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
//Importando o airplane
import { Airplane } from "./Airplane.js";

import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize, 
    SecondaryBox,
    createGroundPlane, 
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
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.
document.addEventListener("mousemove", onDocumentMouseMove);

let plane = 0;

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let rad = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let valueY = 0;
let valueX = 0;

let arrayPlane = new Array();

let lookAtVec = new THREE.Vector3(0.0, 0.0, 0.0);
let camPosition = new THREE.Vector3(0, 0.0, 0);
let upVec = new THREE.Vector3(0.0, 0.0, 0.0);

var cameraGroup = new THREE.Group();
var cameramanGeometry = new THREE.BoxGeometry(1, 1, 1);
var cameramanMaterial = setDefaultMaterial();
var cameraman = new THREE.Mesh(cameramanGeometry, cameramanMaterial);
cameraman.position.set(0, 10, 30);
cameraman.visible = false;
cameraGroup.add(cameraman);
scene.add(cameraman);

let virtualCamera = new THREE.PerspectiveCamera(45, 1.5, 1.0, 480.0);
virtualCamera.position.copy(camPosition);
virtualCamera.up.copy(upVec);
virtualCamera.lookAt(lookAtVec);

cameraman.add(virtualCamera);

let anguloVisaoY = THREE.MathUtils.degToRad(45 / 2);
let anguloVisaoX = THREE.MathUtils.degToRad((45 * 1.5) / 2);

//let airplane = new Airplane();
//scene.add(airplane);

let raycaster = new THREE.Raycaster();

// Enable layers to raycaster and camera (layer 0 is enabled by default)
raycaster.layers.enable( 0 );
raycaster.layers.enable( 1 );
raycaster.layers.enable( 2 );            
camera.layers.enable( 0 );
camera.layers.enable( 1 );
camera.layers.enable( 2 );

// Create list of plane objects 
let planeRay, planeGeometry, planeMaterial;

function RaycasterPlane(){
   planeGeometry = new THREE.PlaneGeometry(7, 7, 20, 20);
   planeMaterial = new THREE.MeshLambertMaterial();
   planeMaterial.side = THREE.DoubleSide;
   planeMaterial.transparent = true;
   planeMaterial.opacity = 0.8;
   planeRay = new THREE.Mesh(planeGeometry, planeMaterial);
   planeRay.set
   scene.add(planeRay);

// Change plane's layer, position and color
let colors = ["red", "green", "blue", "white"];
  planeRay.translateZ(-0*6 + 6); // change position
  planeRay.position.set(lerpConfigCamera.destination.x,lerpConfigCamera.destination.y, lerpConfigCamera.destination.z);
  planeRay.layers.set(0);  // change layer
  //planeRay.material.color.set(colors[0]); // change color



// Object to represent the intersection point
let intersectionSphere = new THREE.Mesh(
   new THREE.SphereGeometry(.2, 30, 30, 0, Math.PI * 2, 0, Math.PI),
   new THREE.MeshPhongMaterial({color:"orange", shininess:"200"}));
scene.add(intersectionSphere);
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
   obj.rotateX(THREE.MathUtils.degToRad(15));
   obj.position.set(0,10,0)
   //console.log("valor do obj: ",obj);
   scene.add ( obj );

   // Store loaded gltf in our js object
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
    onWindowResize(camera, renderer);
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

RaycasterPlane();
// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Trabalho 2");
controls.addParagraph();
controls.add("Use o mouse para mover o avião");
controls.show();

render();

function mouseRotation() {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  if (asset.object) {
    //asset.object.rotation.y -= 0.05 * (targetX + asset.object.rotation.y);
    //asset.object.rotation.x -= 0.05 * (targetY + asset.object.rotation.x);
 }
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  intersectionSphere.visible = false;
  // calculate pointer position in normalized device coordinates
 // (-1 to +1) for both components
  let pointer = new THREE.Vector2();
  pointer.x =  (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);
  // calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects([planeRay]);
  
  // -- Find the selected objects ------------------------------
  if (intersects.length > 0) // Check if there is a intersection
  {      
     let point = intersects[0].point; // Pick the point where interception occurrs
     intersectionSphere.visible = true;
     intersectionSphere.position.set(point.x, point.y, point.z); 

        if(planeRay == intersects[0].object ) {
           clearSelected(); // Removes emissive for all layers 
           planeRay.material.emissive.setRGB(0.4, 0.4, 0.4);
           showInterceptionCoords(point);
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
  valueY = (mouseY * (Math.tan(anguloVisaoY) * 30)) / windowHalfY;
  valueX = (mouseX * (Math.tan(anguloVisaoX) * 30)) / windowHalfX;

  let verifyAngle = 1;
  console.log("valor do asset pbject",asset.object);
  let diffDist = 1;
  //asset.object.position.x - lerpConfig.destination.x;

  rad = THREE.MathUtils.degToRad(diffDist * verifyAngle * 4);
  let quat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 0),
    rad
  );

  obj.position.lerp(lerpConfig.destination, lerpConfig.alpha);
  cameraman.position.lerp(lerpConfigCamera.destination, lerpConfigCamera.alpha);
  lerpConfig.destination.x = valueX;
  lerpConfig.destination.y = valueY * -1;
  lerpConfig.destination.z -= 2;
  lerpConfigCamera.destination.z -= 2;
  //obj.quaternion.slerp(quat, lerpConfig.alpha);
}


function clearSelected() 
{
      planeRay.material.emissive.setRGB(0, 0, 0);
}

function showInterceptionCoords( point)
{
  valueX = point.x;
  valueY = point.y;
  console.log("valor do x: ",point.x, ", valor do y: ",point.y,", valor do z: ",point.z);

}

function render() {
  if (asset.object !== null) {
    if(!lerpConfig.move){
      moveAirplane(asset.object);
    }
    mouseRotation();  
  }
  
  //airplane.rotateSecondPropeller();

  if (arrayPlane[1].position.z > 
    //airplane.position.z
    arrayPlane[1].position.z) {
    plane = new TreePlane(60, 120);
    modifyArray(plane);
    arrayPlane[4] = plane;
    arrayPlane[4].position.set(0, 0, arrayPlane[3].position.z - 120);

    console.log("plane :", arrayPlane[4]);
    scene.add(arrayPlane[4]);
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}
