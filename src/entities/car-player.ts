import { Body, Box, Material, Quaternion, Vec3 } from "cannon-es";
import { Box3, Euler, Quaternion as ThreeQuaternion } from "three";
import { PlayerBase } from "./player-base";

export class Car extends PlayerBase {
  sideTiltAngle = 0; // left and right // radians
  lateralTiltAngle = 0; // forward and backward // radians
  cameraOffset = new Vec3(0, 7, 9);
  async init() {
    const player3dModel = await this.loader.loadAsync("/models/car.glb");
    this.playerMesh = player3dModel.scene;
    this.playerModelBox = new Box3().setFromObject(this.playerMesh);
    this.playerModelBox.getSize(this.playerModelSize);

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
    // this.playerBody.fixedRotation = true;
    this.playerBody.linearDamping = 0.5;
    this.playerBody.angularDamping = 0.8;
    this.playerBody.updateMassProperties();
    this.scene.add(this.playerMesh);
    this.world.addBody(this.playerBody);
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
    if (this.inputManager.isDown("ArrowLeft")) {
      this.playerBody.torque.y += this.speed * 4;
      this.camera.setRotationFromQuaternion(new ThreeQuaternion());
    }

    if (this.inputManager.isDown("ArrowRight")) {
      this.playerBody.torque.y -= this.speed * 4;
    }

    // if (this.inputManager.isDown("ArrowUp")) {
    //   this.force.y += this.speed;
    //   this.playerBody.torque.setZero();
    // }
    // if (this.inputManager.isDown("ArrowDown")) {
    //   this.force.y -= this.speed;
    //   this.playerBody.torque.setZero();
    // }
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

    this.camera.position.copy(this.playerBody.position).add(this.cameraOffset);

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
