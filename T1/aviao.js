import * as THREE from  'three';
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

export function Aviao(){

let angulo = THREE.MathUtils.degToRad(-90);   
var aviao = new THREE.Group();
        
// Criando a fuselagem
var fuselagemGeometry = new THREE.CylinderGeometry(0.95,0.75,6,32);
//new THREE.BoxGeometry(2, 0.5, 0.5);
var fuselagemMaterial = setDefaultMaterial("grey");

var fuselagem = new THREE.Mesh(fuselagemGeometry, fuselagemMaterial);
fuselagem.position.set(0,10,0);

fuselagem.rotateX(angulo);
aviao.add(fuselagem);
        
// Criando as asas
var asaGeometry = new THREE.SphereGeometry(0.5, 32, 16);
var asaMaterial = setDefaultMaterial("DarkBlue");
var asaDireita = new THREE.Mesh(asaGeometry, asaMaterial);
asaDireita.position.set(0, 1.5, 0);
asaDireita.rotateX(angulo);
asaGeometry.scale(10, 1, 1.9);
fuselagem.add(asaDireita);


var finalGeometry = new THREE.BoxGeometry(3, 0.25, 0.5);
var asaMaterial = setDefaultMaterial("DarkBlue");
var asaFinal = new THREE.Mesh(finalGeometry, asaMaterial);
asaFinal.position.set(0, -2.5, 0);
asaFinal.rotateX(angulo);
fuselagem.add(asaFinal);

var final2Geometry = new THREE.BoxGeometry(1, 0.25, 0.5);
var asaMaterial = setDefaultMaterial("DarkBlue");
var asaFinal2 = new THREE.Mesh(final2Geometry, asaMaterial);
asaFinal2.position.set(0, -2.5, 1);
asaFinal2.rotateX(angulo);
asaFinal2.rotateZ(angulo);
fuselagem.add(asaFinal2);

var cabineGeometry = new THREE.SphereGeometry(0.5, 32, 16);
var cabineMaterial = setDefaultMaterial("DimGray");
var cabine = new THREE.Mesh(cabineGeometry, cabineMaterial);
cabine.rotateZ(angulo);
cabineGeometry.scale(2, 1, 1);
cabine.position.set(0, 1.8 , 0.8);
fuselagem.add(cabine);

var elice1Geometry = new THREE.CylinderGeometry(0.2,0.2,0.7,32);
var elice1Material = setDefaultMaterial("grey");
var elice1 = new THREE.Mesh(elice1Geometry, elice1Material);
elice1.position.set(0, 3.4 , 0);
fuselagem.add(elice1);

var elice2Geometry = new THREE.SphereGeometry(0.5, 32, 16);
var elice2Material = setDefaultMaterial("white");
var elice2 = new THREE.Mesh(elice2Geometry, elice2Material);
//elice2.rotateZ(angulo);
elice2Geometry.scale(2.7, 0.3, 0.5);
elice2.position.set(0, 3.5 , 0);
fuselagem.add(elice2);

render();
function render()
{
  elice2.rotation.y += 0.7;
  requestAnimationFrame(render);
}

return aviao;
}
