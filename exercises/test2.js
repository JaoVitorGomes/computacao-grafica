import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere,
        initDefaultSpotlight,
        createGroundPlaneXZ,
        getMaxSize} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';

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


// Elements to be used in UI
let spGroup;  // Will receive the auxiliary spheres representing the points
let material; // to change between flat and shading material


let asset = {
  object: null,
  loaded: false,
  bb: new THREE.Box3()
}

loadGLBFile(asset, '../assets/objects/toon_tank.glb', 10);

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
    obj.updateMatrixWorld( true )
    scene.add ( obj );

    // Store loaded gltf in our js object
    asset.object = gltf.scene;
    }, null, null);
}

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
