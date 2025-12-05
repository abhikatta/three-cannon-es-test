import { Body, Box, Material, Vec3 } from "cannon-es";
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";

export default class Ground {
  groundMesh;
  groundBody;
  constructor() {
    const groundGeometry = new BoxGeometry(200, 200, 0.5);
    const groundMaterial = new MeshStandardMaterial({ color: "teal" });
    this.groundMesh = new Mesh(groundGeometry, groundMaterial);

    this.groundBody = new Body({
      shape: new Box(new Vec3(100, 100, 0.25)),
      type: Body.STATIC,
      material: new Material(),
    });
    this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    this.groundMesh.position.copy(this.groundBody.position);
    this.groundMesh.quaternion.copy(this.groundBody.quaternion);
  }
}
