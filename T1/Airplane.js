import * as THREE from "three";
import { setDefaultMaterial } from "../libs/util/util.js";

export class Airplane extends THREE.Group {
  constructor() {
    super();

    const angle = THREE.MathUtils.degToRad(-90);

    this.fuselage = this.createFuselage(angle);
    this.mainWings = this.createMainWings(angle);
    this.verticalTailWing = this.createVerticalTailWing(angle);
    this.horizontalTailWings = this.createHorizontalTailWings(angle);
    this.cabin = this.createCabin(angle);
    this.firstPropeller = this.createFirstPropeller();
    this.secondPropeller = this.createSecondPropeller();

    this.add(this.fuselage);
    this.fuselage.add(this.mainWings);
    this.fuselage.add(this.verticalTailWing);
    this.fuselage.add(this.horizontalTailWings);
    this.fuselage.add(this.cabin);
    this.fuselage.add(this.firstPropeller);
    this.fuselage.add(this.secondPropeller);
  }

  createFuselage(angle) {
    const fuselageGeometry = new THREE.CylinderGeometry(0.95, 0.75, 6, 32);
    const fuselageMaterial = setDefaultMaterial("grey");
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);

    fuselage.position.set(0, 10, 0);
    fuselage.rotateX(angle);

    return fuselage;
  }

  createMainWings(angle) {
    const mainWingsGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const mainWingsMaterial = setDefaultMaterial("DarkBlue");
    const mainWings = new THREE.Mesh(mainWingsGeometry, mainWingsMaterial);

    mainWings.position.set(0, 1.5, 0);
    mainWings.rotateX(angle);
    mainWingsGeometry.scale(10, 1, 1.9);

    return mainWings;
  }

  createVerticalTailWing(angle) {
    const verticalTailWingGeometry = new THREE.BoxGeometry(3, 0.25, 0.5);
    const verticalTailWingMaterial = setDefaultMaterial("DarkBlue");
    const verticalTailWing = new THREE.Mesh(
      verticalTailWingGeometry,
      verticalTailWingMaterial
    );

    verticalTailWing.position.set(0, -2.5, 0);
    verticalTailWing.rotateX(angle);

    return verticalTailWing;
  }

  createHorizontalTailWings(angle) {
    const horizontalTailWingsGeometry = new THREE.BoxGeometry(1, 0.25, 0.5);
    const horizontalTailWingsMaterial = setDefaultMaterial("DarkBlue");
    const horizontalTailWings = new THREE.Mesh(
      horizontalTailWingsGeometry,
      horizontalTailWingsMaterial
    );
    horizontalTailWings.position.set(0, -2.5, 1);
    horizontalTailWings.rotateX(angle);
    horizontalTailWings.rotateZ(angle);

    return horizontalTailWings;
  }

  createCabin(angle) {
    const cabinGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const cabinMaterial = setDefaultMaterial("DimGray");
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.rotateZ(angle);
    cabinGeometry.scale(2, 1, 1);
    cabin.position.set(0, 1.8, 0.8);

    return cabin;
  }

  createFirstPropeller() {
    const firstPropellerGeometry = new THREE.CylinderGeometry(
      0.2,
      0.2,
      0.7,
      32
    );
    const firstPropellerMaterial = setDefaultMaterial("grey");
    const firstPropeller = new THREE.Mesh(
      firstPropellerGeometry,
      firstPropellerMaterial
    );
    firstPropeller.position.set(0, 3.4, 0);

    return firstPropeller;
  }

  createSecondPropeller() {
    const secondPropellerGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const secondPropellerMaterial = setDefaultMaterial("white");
    const secondPropeller = new THREE.Mesh(
      secondPropellerGeometry,
      secondPropellerMaterial
    );
    secondPropellerGeometry.scale(2.7, 0.3, 0.5);
    secondPropeller.position.set(0, 3.5, 0);

    return secondPropeller;
  }

  rotateSecondPropeller() {
    this.secondPropeller.rotation.y += 0.7;
  }
}
