import { Body, Material, Sphere, Vec3 } from "cannon-es";
import { PlayerBase } from "./player-base";

export default class BoulderPlayer extends PlayerBase {
  async init() {
    const player3dModel = await this.loader.loadAsync(
      "/models/free_stone_sphere.glb"
    );
    this.playerMesh = player3dModel.scene;

    this.playerModelBox = this.playerModelBox.setFromObject(this.playerMesh);
    this.playerModelBox.getSize(this.playerModelSize);

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
    this.scene.add(this.playerMesh);
    this.world.addBody(this.playerBody);
    // TODO: add a rolling boulder sound later
    // const audioFilePath = "my_sound.wav";
    // this.audio = new Audio(audioFilePath);
  }

  move() {
    super.move();
    if (this.inputManager.isDown("KeyW")) this.force.z -= this.speed;
    if (this.inputManager.isDown("KeyS")) this.force.z += this.speed;
    if (this.inputManager.isDown("KeyA")) this.force.x -= this.speed;
    if (this.inputManager.isDown("KeyD")) this.force.x += this.speed;
    if (this.inputManager.isDown("Space")) this.force.y += this.speed;

    // TODO: add a state that if player is on ground then dont apply this state
    // only apply this force when player is flying
    // if (!this.inputManager.isDown("Space"))
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
  }
}
