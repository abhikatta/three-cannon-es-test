import { Body, Box, Material, Quaternion, Vec3 } from "cannon-es";
import { Euler, Object3D, Quaternion as ThreeQuaternion } from "three";
import { PlayerBase } from "./player-base";

export class Car extends PlayerBase {
  sideTiltAngle; // left and right
  lateralTiltAngle; // forward and backward
  constructor(player3dModel: Object3D) {
    super(player3dModel);
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

    // Adjust camera for car
    this.cameraPitch = 0.5;
    this.cameraDistance = 15;
  }
  move() {
    super.move();

    let sideTiltTarget = 0;
    let lateralTiltTarget = 0;

    const maxTilt = 0.2;
    if (this.InputManager.isDown("KeyW")) {
      this.force.z -= this.speed;
      lateralTiltTarget = maxTilt;
    }
    if (this.InputManager.isDown("KeyS")) {
      this.force.z += this.speed;
      lateralTiltTarget = -maxTilt;
    }
    if (this.InputManager.isDown("KeyA")) {
      this.force.x -= this.speed;
      sideTiltTarget = maxTilt;
    }
    if (this.InputManager.isDown("KeyD")) {
      this.force.x += this.speed;
      sideTiltTarget = -maxTilt;
    }
    if (this.InputManager.isDown("KeyQ")) {
      this.force.y += this.speed;
      this.playerBody.torque.setZero();
    }
    if (this.InputManager.isDown("KeyE")) {
      this.force.y -= this.speed;
      this.playerBody.torque.setZero();
    }
    // reset lateraltilt to straight if not going forward or backward
    if (
      !this.InputManager.isDown("KeyW") &&
      !this.InputManager.isDown("KeyS")
    ) {
      lateralTiltTarget = 0;
    }
    // reset sidetilt to straight if not going left or right
    if (
      !this.InputManager.isDown("KeyA") &&
      !this.InputManager.isDown("KeyD")
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
    // Update camera angles based on mouse movement
    const mouseDelta = this.InputManager.getMouseDelta();
    this.cameraYaw -= mouseDelta.x;
    this.cameraPitch = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.cameraPitch - mouseDelta.y)
    );

    // Calculate camera position based on angles
    const cameraX =
      this.playerBody.position.x +
      this.cameraDistance *
        Math.sin(this.cameraYaw) *
        Math.cos(this.cameraPitch);
    const cameraY =
      this.playerBody.position.y +
      this.cameraDistance * Math.sin(this.cameraPitch);
    const cameraZ =
      this.playerBody.position.z +
      this.cameraDistance *
        Math.cos(this.cameraYaw) *
        Math.cos(this.cameraPitch);

    this.camera.position.set(cameraX, cameraY, cameraZ);
    this.camera.lookAt(
      this.playerBody.position.x,
      this.playerBody.position.y + 1,
      this.playerBody.position.z - 1
    );

    this.playerMesh.quaternion.copy(this.playerBody.quaternion);

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
