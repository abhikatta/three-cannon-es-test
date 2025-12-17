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
      position: new Vec3(0, 10, 0),
      mass: 1,
      material: new Material(),
    });

    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1
    );

    this.camera.position.copy(this.playerMesh.position);
    this.camera.lookAt(
      this.playerMesh.position.x,
      this.playerMesh.position.y,
      this.playerMesh.position.z - 1
    );

    this.InputManager = new InputManager();
    this.update();
  }

  update() {
    this.playerMesh.position.copy(this.playerBody.position);
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);
  }

  move() {
    const speed = 50;
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

    this.playerBody.applyForce(force, this.playerBody.position);

    this.playerBody.fixedRotation = true;
    this.playerBody.updateMassProperties();

    this.playerMesh.position.copy(this.playerBody.position);
    this.camera.position.copy(this.playerMesh.position);
    this.camera.lookAt(
      this.playerMesh.position.x,
      this.playerMesh.position.y,
      this.playerMesh.position.z - 1
    );
  }
}
