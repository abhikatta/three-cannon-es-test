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
      0.1,
      500
    );
    const playerGeometry = new BoxGeometry(2, 5, 2);
    const playerMaterial = new MeshStandardMaterial({ color: "white" });
    this.playerMesh = new Mesh(playerGeometry, playerMaterial);

    this.playerBody = new Body({
      shape: new Box(new Vec3(1, 2.5, 1)),
      position: new Vec3(0, 10, 0),
      type: Body.DYNAMIC,
      material: new Material(),
      mass: 100,
    });
    this.camera.position.set(0, 20, 30);

    this.InputManager = new InputManager();
    this.playerMesh.position.copy(this.playerBody.position);
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);
  }

  update() {
    this.playerMesh.position.copy(this.playerBody.position);
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);
  }

  move() {
    const speed = 8;
    const force = new Vec3(0, 0, 0);

    if (this.InputManager.isDown("KeyW")) force.z -= speed;
    if (this.InputManager.isDown("KeyS")) force.z += speed;
    if (this.InputManager.isDown("KeyA")) force.x -= speed;
    if (this.InputManager.isDown("KeyD")) force.x += speed;
    if (this.InputManager.isDown("Space")) force.y += speed;

    this.playerBody.velocity.x = force.x;
    this.playerBody.velocity.z = force.z;

    this.playerMesh.position.copy(this.playerBody.position);
  }
}
