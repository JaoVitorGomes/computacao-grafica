import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere,
        initDefaultSpotlight,
        createGroundPlaneXZ} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";

import { CSG } from '../libs/other/CSGMesh.js'      

let scene, renderer, camera, orbit;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
   renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.lookAt(0, 0, 0);
   camera.position.set(5, 5, 5);
   camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

let light;
light = initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0)); 

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// REMOVA ESTA LINHA APÓS CONFIGURAR AS LUZES DESTE EXERCÍCIO
initDefaultBasicLight(scene);


const baseCylinderGeometry = new THREE.CylinderGeometry(1,1,2);
const baseCylinderMaterial = new THREE.MeshPhongMaterial({color: 'cyan'});
const baseCylinder = new THREE.Mesh(baseCylinderGeometry, baseCylinderMaterial);
baseCylinder.position.set(0, 0, 0);

const contentCylinderGeometry = new THREE.CylinderGeometry(0.9,0.9,1.6);
const contentCylinderMaterial = new THREE.MeshPhongMaterial({color: 'cyan'});
const contentCylinder = new THREE.Mesh(contentCylinderGeometry, contentCylinderMaterial);
contentCylinder.position.set(0, 0.2, 0);
contentCylinder.matrixAutoUpdate = false;
contentCylinder.updateMatrix();

const baseCylinderCSG = CSG.fromMesh(baseCylinder);
const contentCylinderCSG = CSG.fromMesh(contentCylinder);
const mugCSG = baseCylinderCSG.subtract(contentCylinderCSG);
const mug = CSG.toMesh(mugCSG, new THREE.Matrix4());
mug.material = new THREE.MeshPhongMaterial({color: 'lightgreen'});
mug.position.set(0, 1, 0);
scene.add(mug);

const ringGeometry = new THREE.TorusGeometry(0.2,0.075,4);
const ringMaterial = new THREE.MeshPhongMaterial({color: 'lightgreen'});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.position.set(0, 0, 0);

const boxGeometry = new THREE.BoxGeometry(1,1);
const boxMaterial = new THREE.MeshPhongMaterial({color: 'cyan'});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0.5, 0, 0);
box.matrixAutoUpdate = false;
box.updateMatrix();

const ringCSG = CSG.fromMesh(ring);
const boxCSG = CSG.fromMesh(box);
const mugHolderCSG = ringCSG.subtract(boxCSG);
const mugHolder = CSG.toMesh(mugHolderCSG, new THREE.Matrix4());
mugHolder.material = new THREE.MeshPhongMaterial({color: 'lightgreen'});
mugHolder.position.set(-1, 1, 0);

scene.add(mugHolder);

//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function buildInterface()
{
  // GUI interface
  let gui = new GUI();
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
