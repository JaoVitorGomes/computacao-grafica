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
  createLightSphere,
} from "../libs/util/util.js";
import { TreePlane } from "./TreePlane.js";
import KeyboardState from "../libs/util/KeyboardState.js";
import { Tree } from "./Tree.js";

// To use the keyboard
let keyboard = new KeyboardState();

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

let lightPosition = new THREE.Vector3(0.0, 25.0, -2.0);

let lightSphere = createLightSphere(scene, 0.5, 10, 10, lightPosition);

let dirLight = new THREE.DirectionalLight("whites", 2);
dirLight.position.copy(lightPosition);

// Shadow settings
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 8192;
dirLight.shadow.mapSize.height = 8192;
dirLight.shadow.camera.near = 0;
dirLight.shadow.camera.far = 1024;
dirLight.shadow.camera.left = -100;
dirLight.shadow.camera.right = 100;
dirLight.shadow.camera.top = 1024;
dirLight.shadow.camera.bottom = -10;
dirLight.name = "Direction Light";

scene.add(dirLight);

// Create a target object for the light
const target = new THREE.Object3D();
scene.add(target);

// Set the light's target
dirLight.target = target;

// Change the position of the target to change the direction of the light
target.position.set(dirLight.position.x, 0, dirLight.position.z);

// const lineGeometry = new THREE.BufferGeometry().setFromPoints([
//   lightPosition,
//   dirLight.target.position,
// ]);

// const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

// const line = new THREE.Line(lineGeometry, lineMaterial);
// scene.add(line);

console.log("dirLight -> ", dirLight);

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

  lightPosition.x = airplane.position.x;
  lightPosition.z = airplane.position.z;

  updateLightPosition(lightPosition.x, lightPosition.y, lightPosition.z);
}

function updateLightPosition(x, y, z) {
  lightPosition.x = x;
  lightPosition.y = y;
  lightPosition.z = z;

  dirLight.position.copy(lightPosition);
  lightSphere.position.copy(lightPosition);

  // line.geometry.setFromPoints([lightPosition, dirLight.target.position]);

  target.position.set(dirLight.position.x, 0, dirLight.position.z);

  console.log(
    "Light Position: " +
      lightPosition.x.toFixed(2) +
      ", " +
      lightPosition.y.toFixed(2) +
      ", " +
      lightPosition.z.toFixed(2)
  );
}

function keyboardUpdate() {
  keyboard.update();
  if (keyboard.pressed("D")) {
    updateLightPosition(
      lightPosition.x + 0.5,
      lightPosition.y,
      lightPosition.z
    );
  }
  if (keyboard.pressed("A")) {
    updateLightPosition(
      lightPosition.x - 0.5,
      lightPosition.y,
      lightPosition.z
    );
  }
  if (keyboard.pressed("W")) {
    updateLightPosition(
      lightPosition.x,
      lightPosition.y + 0.5,
      lightPosition.z
    );
  }
  if (keyboard.pressed("S")) {
    updateLightPosition(
      lightPosition.x,
      lightPosition.y - 0.5,
      lightPosition.z
    );
  }
  if (keyboard.pressed("E")) {
    updateLightPosition(
      lightPosition.x,
      lightPosition.y,
      lightPosition.z - 0.5
    );
  }
  if (keyboard.pressed("Q")) {
    updateLightPosition(
      lightPosition.x,
      lightPosition.y,
      lightPosition.z + 0.5
    );
  }
}

function render() {
  // keyboardUpdate();

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
  // renderer.render(scene, camera); // Render scene
}
