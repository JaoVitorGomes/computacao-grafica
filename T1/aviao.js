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
let anguloTotal = THREE.MathUtils.degToRad(180);   
var aviao = new THREE.Group();
        
// Criando a fuselagem
var fuselagemGeometry = new THREE.CylinderGeometry(0.8,1,6,32);
//new THREE.BoxGeometry(2, 0.5, 0.5);
var fuselagemMaterial = setDefaultMaterial();
var fuselagem = new THREE.Mesh(fuselagemGeometry, fuselagemMaterial);
fuselagem.position.set(0,5,0);

fuselagem.rotateX(angulo);
aviao.add(fuselagem);
        
// Criando as asas
var asaGeometry = new THREE.BoxGeometry(10, 0.8, 1.5);
var asaMaterial = setDefaultMaterial();
var asaDireita = new THREE.Mesh(asaGeometry, asaMaterial);
asaDireita.position.set(0, 5, 1);
aviao.add(asaDireita);


var finalGeometry = new THREE.BoxGeometry(3, 0.25, 0.5);
var asaMaterial = setDefaultMaterial();
var asaFinal = new THREE.Mesh(finalGeometry, asaMaterial);
asaFinal.position.set(0, 5, -2.5);
aviao.add(asaFinal);

var final2Geometry = new THREE.BoxGeometry(1, 0.25, 0.5);
var asaMaterial = setDefaultMaterial();
var asaFinal2 = new THREE.Mesh(final2Geometry, asaMaterial);
asaFinal2.position.set(0, 6, -2.5);
asaFinal2.rotateZ(angulo);
aviao.add(asaFinal2);


        
// var asaEsquerda =materialal = setDefaultMaterial();
// var cauda = new THREE.Mesh(caudaGeometry, caudaMaterial);
// cauda.position.set(-1, 0, 0);
// aviao.add(cauda);
        
// // Posicionando o avião
// aviao.position.set(0, 0, -2);
     
// Adicionando o avião à cena
aviao.rotateY(anguloTotal)
return aviao;
}
