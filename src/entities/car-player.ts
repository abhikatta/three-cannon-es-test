import { Body, Box, Material, Quaternion, Vec3 } from "cannon-es";
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
      quaternion: new Quaternion(0, 1, 0, -1),
      position: new Vec3(0, 2, 5),
      mass: 1,
      material: new Material(),
    });
  }
  move() {
    super.move();
    if (this.InputManager.isDown("KeyW")) {
      this.force.z -= this.speed;
      this.playerMesh.rotateZ(Math.PI / 4);
    }
    if (this.InputManager.isDown("KeyS")) {
      this.force.z += this.speed;
      this.playerMesh.rotateZ(Math.PI / 4);
    }
    if (this.InputManager.isDown("KeyA")) {
      this.force.x -= this.speed;
      this.playerMesh.rotateZ(Math.PI / 4);
    }
    if (this.InputManager.isDown("KeyD")) {
      this.force.x += this.speed;
      this.playerMesh.rotateZ(Math.PI / 4);
    }

    this.playerBody.applyForce(this.force);
    this.playerBody.fixedRotation = true;
    this.playerBody.linearDamping = 0.4;

    this.update();
  }
  update() {
    this.camera.lookAt(
      this.playerBody.position.x,
      this.playerBody.position.y,
      this.playerBody.position.z - 15
    );
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);

    this.camera.position.copy(
      new Vec3(
        this.playerBody.position.x,
        this.playerBody.position.y + 10,
        this.playerBody.position.z + 12
      )
    );

    this.playerMesh.position.copy(
      new Vec3(
        this.playerBody.position.x,
        this.playerBody.position.y,
        this.playerBody.position.z - 1.5
      )
    );
  }
}
