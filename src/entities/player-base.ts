import InputManager from "@/core/input-manager";
import { Body, Vec3 } from "cannon-es";
import { Box3, Object3D, PerspectiveCamera, Vector3 } from "three";

export abstract class PlayerBase {
  playerMesh;
  playerBody!: Body;
  camera;
  InputManager!: InputManager;
  force;
  speed;
  playerModelSize;
  playerModelBox;
  cameraYaw: number = 0;
  cameraPitch: number = 0.3;
  cameraDistance: number = 5;
  constructor(player3dModel: Object3D) {
    this.playerMesh = player3dModel;
    this.speed = 30;
    this.force = new Vec3(0, 0, 0);

    this.playerModelBox = new Box3().setFromObject(this.playerMesh);
    this.playerModelSize = new Vector3();
    this.playerModelBox.getSize(this.playerModelSize);

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.InputManager = new InputManager();
  }

  move() {
    this.force.set(0, 0, 0); //resetting force vector every frame else it would go to infinite
  }

  update() {
    this.playerMesh.position.copy(this.playerBody.position);
    this.playerMesh.quaternion.copy(this.playerBody.quaternion);

    // Update camera angles based on mouse movement
    const mouseDelta = this.InputManager.getMouseDelta();
    this.cameraYaw -= mouseDelta.x;
    this.cameraPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraPitch - mouseDelta.y));

    // Calculate camera position based on angles
    const cameraX = this.playerMesh.position.x + this.cameraDistance * Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch);
    const cameraY = this.playerMesh.position.y + this.cameraDistance * Math.sin(this.cameraPitch);
    const cameraZ = this.playerMesh.position.z + this.cameraDistance * Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch);

    this.camera.position.set(cameraX, cameraY, cameraZ);
    this.camera.lookAt(this.playerMesh.position);
  }
}
