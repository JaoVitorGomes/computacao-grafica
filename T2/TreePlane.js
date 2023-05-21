import * as THREE from "three";
import {
  createGroundPlane,
  createGroundPlaneWired,
  createGroundPlaneXZ,
} from "../libs/util/util.js";
import { Tree } from "./Tree.js";
import { CylinderGeometry, BoxGeometry } from "../build/three.module.js";

export class TreePlane extends THREE.Group {
  constructor(
    width = 60,
    height = 200,
    widthSegments = 10,
    heightSegments = 10,
    color = 0x56d837,
    position = [0, -0.1, -40]
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

    this.leftWall = this.createWall(color, height, [width / 2 + 5, 5, 0]);
    this.rightWall = this.createWall(color, height, [-width / 2 - 5, 5, 0]);

    this.trees = this.createTrees(position[2] - height / 2);

    this.add(this.ground);
    this.add(this.leftWall);
    this.add(this.rightWall);
    this.trees.map((tree) => {
      this.add(tree);
    });
    this.matrixPosition = position;
  }

  getRandomZ(startPos = -60) {
    return Math.floor(Math.random() * (startPos / 3)) * 3;
  }

  getRandomX() {
    return Math.floor(Math.random() * (50 / 3)) * 3 - 24;
  }

  generateXZPairs(maximumSize = 10, zStartPos = -120) {
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

  createTrees(zStartPos = -60) {
    const treePositions = this.generateXZPairs(10, zStartPos).map(([x, z]) => [
      x,
      0.5,
      z,
    ]);

    return treePositions.map((treePosition) => new Tree(...treePosition));
  }

  createGround(
    width,
    height,
    widthSegments = 10,
    heightSegments = 10,
    color = "rgb(200,200,200)"
  ) {
    let plane = createGroundPlaneWired(
      width,
      height,
      widthSegments,
      heightSegments,
      0,
      color,
      color
    );

    // let plane = createGroundPlaneXZ(
    //   width,
    //   height,
    //   widthSegments,
    //   heightSegments,
    //   0,
    //   color,
    //   color
    // );

    console.log("PLANE -> ", plane);

    return plane;
  }

  createWall(color, depth, position) {
    const wallGeometry = new BoxGeometry(10, 10, depth);

    const wallMaterial = new THREE.MeshPhongMaterial({
      color,
      shininess: "200",
    });

    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.castShadow = true;
    wall.receiveShadow = true;

    wall.side = THREE.DoubleSide;

    wall.position.set(...position);

    return wall;
  }
}
