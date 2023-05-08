import * as THREE from "three";
import { CylinderGeometry } from "../build/three.module.js";

export class Tree extends THREE.Group {
  constructor(x, y, z) {
    super();

    this.trunk = this.createTrunk(x, y, z);
    this.firstLeaves = this.createLeaves(0, 2.4, 0);
    this.secondLeaves = this.createLeaves(0, 3.6, 0);

    this.add(this.trunk);
    this.trunk.add(this.firstLeaves);
    this.trunk.add(this.secondLeaves);

    this.position.set(x, y, z);

  }

  createLeaves(x, y, z) {
    const leavesGeometry = new THREE.ConeGeometry(1.6, 3.2, 160);
    const leavesMaterial = new THREE.MeshPhongMaterial({
      color: 0x297a18,
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.castShadow = true;
    leaves.position.set(x, y, z);

    return leaves;
  }

  createTrunk() {
    const trunkGeometry = new CylinderGeometry(0.3, 0.3, 0.8);

    const trunkMaterial = new THREE.MeshPhongMaterial({
      color: 0x964b00,
      shininess: "200",
    });

    trunkMaterial.side = THREE.DoubleSide;

    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.position.set(0, 0, 0);

    return trunk;
  }

}
