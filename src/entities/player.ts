import { Body, Box, Material, Vec3 } from "cannon-es";
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";

export default class Player {
  playerMesh;
  playerBody;
  constructor() {
    const playerGeometry = new BoxGeometry(2, 5, 2);
    const playerMaterial = new MeshStandardMaterial({ color: "white" });
    this.playerMesh = new Mesh(playerGeometry, playerMaterial);

    this.playerBody = new Body({
      shape: new Box(new Vec3(1, 2.5, 1)),
      position: new Vec3(0, 10, 0),
      type: Body.DYNAMIC,
      material: new Material(),
      mass: 10,
    });

    this.playerMesh.position.copy(this.playerBody.position);
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);
  }
}
