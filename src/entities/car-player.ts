import { Body, Cylinder, Material, Quaternion, Vec3 } from "cannon-es";
import { Object3D } from "three";
import { PlayerBase } from "./player-base";

export class Car extends PlayerBase {
  constructor(player3dModel: Object3D) {
    super(player3dModel);
    this.playerMesh = player3dModel;
    this.playerBody = new Body({
      shape: new Cylinder(
        this.playerModelSize.y / 2,
        this.playerModelSize.y,
        this.playerModelSize.x,
        6
      ),
      position: new Vec3(0.5, 0.25, 0),
      quaternion: new Quaternion(0, 0, 1),
      mass: 1,
      material: new Material(),
    });
  }
  move(): void {}
  update(): void {
    this.playerMesh.position.copy(
      new Vec3(0, this.playerBody.position.y - 0.5, 0)
    );
    console.log(this.playerBody.quaternion.z);
    this.playerMesh.quaternion.copy(
      new Quaternion(
        this.playerBody.quaternion.x,
        this.playerBody.quaternion.y,
        this.playerBody.quaternion.z - 0.7
      )
    );
    this.camera.lookAt(
      this.playerMesh.position.x + 1,
      this.playerMesh.position.y,
      this.playerMesh.position.z
    );
    this.camera.position.copy(
      new Vec3(
        this.playerMesh.position.x - 3,
        this.playerMesh.position.y + 2,
        this.playerMesh.position.z
      )
    );
    // this.camera.position.copy(
    //   new Vec3(
    //     this.playerMesh.position.x - 4,
    //     this.playerMesh.position.y + 2,
    //     this.playerMesh.position.z
    //   )
    // );
  }
}
