import { Body, Box, Material, Quaternion, Vec3 } from "cannon-es";
import { Euler, Object3D, Quaternion as ThreeQuaternion } from "three";
import { PlayerBase } from "./player-base";
import InputManager from "@/core/input-manager";

export class Car extends PlayerBase {
  sideTiltAngle; // left and right
  lateralTiltAngle; // forward and backward
  constructor(player3dModel: Object3D, inputManager: InputManager) {
    super(player3dModel, inputManager);
    this.sideTiltAngle = 0; // radians
    this.lateralTiltAngle = 0; // radians
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
    this.playerBody.fixedRotation = true;
    this.playerBody.linearDamping = 0.5;
    this.playerBody.updateMassProperties();
  }
  move() {
    super.move();

    let sideTiltTarget = 0;
    let lateralTiltTarget = 0;

    const maxTilt = 0.2;
    if (this.inputManager.isDown("KeyW")) {
      this.force.z -= this.speed;
      lateralTiltTarget = maxTilt;
    }
    if (this.inputManager.isDown("KeyS")) {
      this.force.z += this.speed;
      lateralTiltTarget = -maxTilt;
    }
    if (this.inputManager.isDown("KeyA")) {
      this.force.x -= this.speed;
      sideTiltTarget = maxTilt;
    }
    if (this.inputManager.isDown("KeyD")) {
      this.force.x += this.speed;
      sideTiltTarget = -maxTilt;
    }
    if (this.inputManager.isDown("KeyQ")) {
      this.force.y += this.speed;
      this.playerBody.torque.setZero();
    }
    if (this.inputManager.isDown("KeyE")) {
      this.force.y -= this.speed;
      this.playerBody.torque.setZero();
    }
    // reset lateraltilt to straight if not going forward or backward
    if (
      !this.inputManager.isDown("KeyW") &&
      !this.inputManager.isDown("KeyS")
    ) {
      lateralTiltTarget = 0;
    }
    // reset sidetilt to straight if not going left or right
    if (
      !this.inputManager.isDown("KeyA") &&
      !this.inputManager.isDown("KeyD")
    ) {
      sideTiltTarget = 0;
    }

    const tiltSpeed = 0.1;
    // per frame update the tilt angle
    this.sideTiltAngle += (sideTiltTarget - this.sideTiltAngle) * tiltSpeed;
    this.lateralTiltAngle +=
      (lateralTiltTarget - this.lateralTiltAngle) * tiltSpeed;

    this.playerBody.applyForce(this.force);
  }
  update() {
    this.camera.lookAt(
      this.playerBody.position.x,
      this.playerBody.position.y + 1,
      this.playerBody.position.z - 1
    );
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);

    this.camera.position.copy(
      new Vec3(
        this.playerBody.position.x,
        this.playerBody.position.y + 7,
        this.playerBody.position.z + 9
      )
    );

    this.playerMesh.position.copy(
      new Vec3(
        this.playerBody.position.x,
        this.playerBody.position.y,
        this.playerBody.position.z - 1.5
      )
    );

    // per frame set the updated tilt angle
    const tiltQuat = new ThreeQuaternion();
    tiltQuat.setFromEuler(
      new Euler(this.sideTiltAngle, 0, this.lateralTiltAngle)
    );
    this.playerMesh.quaternion.multiply(tiltQuat);
  }
}
