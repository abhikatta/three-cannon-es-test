import { Body, Material, Sphere, Vec3 } from "cannon-es";
import { Box3, Object3D, PerspectiveCamera, Vector3 } from "three";
import InputManager from "../core/input-manager";

export default class Player {
  playerMesh;
  playerBody;
  camera;
  InputManager!: InputManager;
  constructor(player3dModel: Object3D) {
    this.playerMesh = player3dModel;

    const box = new Box3().setFromObject(this.playerMesh);
    const size = new Vector3();
    box.getSize(size);

    const radius = Math.max(size.x, size.y, size.z) / 2;

    this.playerBody = new Body({
      shape: new Sphere(radius),
      position: new Vec3(0, radius + 10, 0),
      mass: 1,
      material: new Material(),
    });

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.InputManager = new InputManager();

    // TODO: add a rolling boulder sound later
    // const audioFilePath = "my_sound.wav";
    // this.audio = new Audio(audioFilePath);

    this.update();
  }

  update() {
    this.playerMesh.position.copy(this.playerBody.position);
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);

    // from (-3,2,0) looking at (1,0,0) so its like from behind top looking at front down
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
  }

  move() {
    const speed = 12;
    const force = new Vec3(0, 0, 0);

    if (this.InputManager.isDown("KeyW")) force.z -= speed;
    if (this.InputManager.isDown("KeyS")) force.z += speed;
    if (this.InputManager.isDown("KeyA")) force.x -= speed;
    if (this.InputManager.isDown("KeyD")) force.x += speed;
    if (this.InputManager.isDown("Space")) force.y += speed;

    // TODO: add a state that if player is on ground then dont apply this state
    // only apply this force when player is flying
    // if (!this.InputManager.isDown("Space"))
    //   this.playerBody.applyForce(new Vec3(0, -200, 0));

    // TODO: fix this - play the sound if the boulding is actually moving
    // if (
    //   this.playerBody.torque.x !== 0 ||
    //   this.playerBody.torque.y !== 0 ||
    //   this.playerBody.torque.z !== 0
    // ) {
    //   this.audio.play();
    // }

    this.playerBody.torque.vadd(force, this.playerBody.torque);
    this.playerBody.angularFactor.set(1, 1, 1);
    this.playerBody.angularDamping = 0.5;
    this.playerBody.linearDamping = 0.2;

    this.playerBody.updateMassProperties();

    this.update();
  }
}
