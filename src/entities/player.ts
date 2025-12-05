import { Body, Box, Material, Vec3 } from "cannon-es";
import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
} from "three";
import InputManager from "../core/input-manager";

export default class Player {
  playerMesh;
  playerBody;
  camera;
  InputManager;
  constructor() {
    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1
    );
    const playerGeometry = new BoxGeometry(2, 5, 2);
    const playerMaterial = new MeshStandardMaterial({ color: "white" });
    this.playerMesh = new Mesh(playerGeometry, playerMaterial);

    this.playerBody = new Body({
      shape: new Box(new Vec3(1, 2.5, 1)),
      position: new Vec3(0, 10, 0),
      type: Body.DYNAMIC,
      material: new Material(),
      mass: 1,
    });
    this.camera.position.copy(this.playerMesh.position);
    this.camera.lookAt(
      this.playerMesh.position.x,
      this.playerMesh.position.y,
      this.playerMesh.position.z - 1
    );

    this.InputManager = new InputManager();
    this.playerMesh.position.copy(this.playerBody.position);
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);
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
    if (!this.InputManager.isDown("Space"))
      this.playerBody.applyForce(new Vec3(0, -200, 0));

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
