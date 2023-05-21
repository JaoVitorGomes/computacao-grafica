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

createCustomGeometry();

function createCustomGeometry()
{
  // Create all vertices of the object
  // In this example, we have six vertices
  let v = [
    0, 2, 0, // 0
    0, 2, 2, // 1
    2, 2, 0, // 2
    2, 2, 2, // 3
    0, 0, 0, // 4
    0, 0, 4, // 5
    2, 0, 0, // 6
    2, 0, 4, // 7
  ];       

  // Create the triangular faces
  // In this example we have 4 triangular faces
  let f =  [
    // Square 0
    0, 1, 2,
    1, 2, 3,

    // Square 1
    4, 5, 6,
    5, 6, 7,

    // Square 2
    1, 3, 5,
    3, 5, 7,

    // Square 3
    0, 4, 5,
    0, 1, 5,

    // Square 4
    3, 2, 6,
    3, 6, 7,

    // Square 5
    0, 2, 6,
    0, 6, 4,
  ];

  // In this example normals = vertices because the center of the object is the origin. 
  // You may have to compute your normals manually.
  const n = v;

  // Set buffer attributes
  var vertices = new Float32Array( v );
  var normals = new Float32Array( n );  
  var indices = new Uint32Array( f );

  // Set the Buffer Geometry
  let geometry = new THREE.BufferGeometry();

  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) ); // 3 components per vertex
  geometry.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );  // 3 components per normal
  geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
  geometry.computeVertexNormals(); 

  material = new THREE.MeshLambertMaterial({color:"#198d26"});
  material.side =  THREE.DoubleSide; // Show front and back polygons
  material.flatShading = true;

  const mesh = new THREE.Mesh( geometry, material);

  mesh.castShadow = true;

  scene.add(mesh);
 
  // Create auxiliary spheres to visualize the points
  createPointSpheres(v);
}

function createPointSpheres(points)
{
  spGroup = new THREE.Object3D();
  var spMaterial = new THREE.MeshPhongMaterial({color:"rgb(255,255,0)"});
  var spGeometry = new THREE.SphereGeometry(0.1);
  for(let i = 0; i < points.length; i+=3){
    var spMesh = new THREE.Mesh(spGeometry, spMaterial);   
    spMesh.position.set(points[i], points[i+1], points[i+2]);
    spGroup.add(spMesh);
  };
  // add the points as a group to the scene
  scene.add(spGroup);  
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
