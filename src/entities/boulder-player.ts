import { Body, Material, Sphere, Vec3 } from "cannon-es";
import { Object3D } from "three";
import { PlayerBase } from "./player-base";

export default class BoulderPlayer extends PlayerBase {
  constructor(player3dModel: Object3D) {
    super(player3dModel);
    this.playerMesh = player3dModel;

    const radius =
      Math.max(
        this.playerModelSize.x,
        this.playerModelSize.y,
        this.playerModelSize.z
      ) / 2;

    this.playerBody = new Body({
      shape: new Sphere(radius),
      position: new Vec3(0, radius + 4, 0),
      mass: 1,
      material: new Material(),
    });

    // TODO: add a rolling boulder sound later
    // const audioFilePath = "my_sound.wav";
    // this.audio = new Audio(audioFilePath);

    this.update();
  }

  move() {
    super.move();
    if (this.InputManager.isDown("KeyW")) this.force.z -= this.speed;
    if (this.InputManager.isDown("KeyS")) this.force.z += this.speed;
    if (this.InputManager.isDown("KeyA")) this.force.x -= this.speed;
    if (this.InputManager.isDown("KeyD")) this.force.x += this.speed;
    if (this.InputManager.isDown("Space")) this.force.y += this.speed;

    // TODO: add a state that if player is on ground then dont apply this state
    // only apply this force when player is flying
    // if (!this.InputManager.isDown("Space"))
    //   this.playerBody.applyForce(new Vec3(0, -200, 0));

    // TODO: fix this - play the sound if the boulder is actually moving
    // if (
    //   this.playerBody.torque.x !== 0 ||
    //   this.playerBody.torque.y !== 0 ||
    //   this.playerBody.torque.z !== 0
    // ) {
    //   this.audio.play();
    // }

    this.playerBody.torque.vadd(this.force, this.playerBody.torque);
    this.playerBody.angularFactor.set(1, 1, 1);
    this.playerBody.angularDamping = 0.5;
    this.playerBody.linearDamping = 0.2;

    this.update();
  }
}
