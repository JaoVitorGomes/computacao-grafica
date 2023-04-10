import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { Tree } from "./Tree.js";

export class TreePlane extends THREE.Group {
  constructor(
    width = 60,
    height = 2000,
    widthSegments = 10,
    heightSegments = 10,
    color = 0x56d837,
    position = [0, -0.1, -1000]
  ) {
    super();

    this.ground = this.createGround(
      width,
      height,
      widthSegments,
      heightSegments,
      color,
      position
    );

    this.trees = this.createTrees(position[2] - 1000);

    this.add(this.ground);
    this.trees.map((tree) => {
      this.add(tree);
    });
    this.matrixPosition = position;
  }

  getRandomZ(startPos = -2000) {
    return Math.floor(Math.random() * (startPos / 3)) * 3;
  }

  getRandomX() {
    return Math.floor(Math.random() * (60 / 3)) * 3 - 30;
  }

  generateXZPairs(maximumSize = 10, zStartPos = -2000) {
    const pairs = [];
    while (true) {
      const newPair = [this.getRandomX(), this.getRandomZ(zStartPos)];

      const pairExists = pairs.some((p) => p.toString() === newPair.toString());

      if (pairExists) {
        continue;
      }

      pairs.push(newPair);

      if (pairs.length >= maximumSize) {
        break;
      }
    }

    return pairs;
  }

  createTrees(zStartPos = -2000) {
    const treePositions = this.generateXZPairs(100, zStartPos).map(([x, z]) => [
      x,
      0.1,
      z,
    ]);

    return treePositions.map((treePosition) => new Tree(...treePosition));
  }

  createGround(
    width,
    height,
    widthSegments = 10,
    heightSegments = 10,
    color = "rgb(200,200,200)",
    position = [0.0, -0.1, 0.0]
  ) {
    const planeGeometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );

    const planeMaterial = new THREE.MeshLambertMaterial({
      color,
      side: THREE.DoubleSide,
    });

    const mat4 = new THREE.Matrix4(); // Aux mat4 matrix
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.receiveShadow = true;
    // Rotate 90 in X and perform a small translation in Y
    plane.matrixAutoUpdate = false;
    plane.matrix.identity(); // resetting matrices
    // Will execute R1 and then T1
    plane.matrix.multiply(mat4.makeTranslation(...position)); // T1
    plane.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90))); // R1

    return plane;
  }
}
