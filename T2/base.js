import * as THREE from "three";

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

let airplane = new Airplane();
scene.add(airplane);

airplane;
//airplane.material.opacity = 0.5;

console.log("airplane: ", airplane);

// Listen window size changes
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
  move: true,
};

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Trabalho 1");
controls.addParagraph();
controls.add("Use o mouse para mover o avião");
controls.show();

render();

function mouseRotation() {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  if (airplane) {
    airplane.rotation.y -= 0.05 * (targetX + airplane.rotation.y);
    airplane.rotation.x -= 0.05 * (targetY + airplane.rotation.x);
  }
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
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
  let diffDist = airplane.position.x - lerpConfig.destination.x;

  rad = THREE.MathUtils.degToRad(diffDist * verifyAngle * 4);
  let quat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    rad
  );

  obj.position.lerp(lerpConfig.destination, lerpConfig.alpha);
  cameraman.position.lerp(lerpConfigCamera.destination, lerpConfigCamera.alpha);
  lerpConfig.destination.x = valueX;
  lerpConfig.destination.y = valueY * -1;
  lerpConfig.destination.z -= 2;
  lerpConfigCamera.destination.z -= 2;
  obj.quaternion.slerp(quat, lerpConfig.alpha);
}

function render() {
  if (lerpConfig.move) {
    moveAirplane(airplane);
  }

  mouseRotation();
  airplane.rotateSecondPropeller();

  if (arrayPlane[1].position.z > airplane.position.z) {
    plane = new TreePlane(60, 120);
    modifyArray(plane);
    arrayPlane[4] = plane;
    arrayPlane[4].position.set(0, 0, arrayPlane[3].position.z - 120);

    console.log("plane :", arrayPlane[4]);
    scene.add(arrayPlane[4]);
  }
  requestAnimationFrame(render);
  renderer.render(scene, virtualCamera); // Render scene
}
