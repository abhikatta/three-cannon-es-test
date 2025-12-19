import { Body, Box, Material, Vec3 } from "cannon-es";
import { Object3D } from "three";
import { PlayerBase } from "./player-base";

export class Car extends PlayerBase {
  constructor(player3dModel: Object3D) {
    super(player3dModel);
    this.playerMesh = player3dModel;

    this.playerBody = new Body({
      shape: new Box(
        new Vec3(
          this.playerModelSize.x / 2,
          this.playerModelSize.y / 2,
          this.playerModelSize.z / 2
        )
      ),
      position: new Vec3(0, 2, 0),
      mass: 1,
      material: new Material(),
    });
  }
  move() {
    super.move();
  }
  update() {
    this.playerMesh.position.copy(
      new Vec3(
        this.playerBody.position.x - 1.5,
        this.playerBody.position.y - 2,
        this.playerBody.position.z
      )
    );

    this.playerMesh.quaternion.copy(this.playerBody.quaternion);

    // this.camera.lookAt(
    //   this.playerMesh.position.x,
    //   this.playerMesh.position.y,
    //   this.playerMesh.position.z
    // );

    // this.camera.position.set(
    //   this.playerMesh.position.x - 3,
    //   this.playerMesh.position.y + 2,
    //   this.playerMesh.position.z
    // );
  }
}
