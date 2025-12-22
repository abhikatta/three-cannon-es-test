import InputManager from "@/core/input-manager";
import { Body, Vec3 } from "cannon-es";
import { Box3, Object3D, PerspectiveCamera, Vector3 } from "three";

export abstract class PlayerBase {
  playerMesh;
  playerBody!: Body;
  camera;
  inputManager!: InputManager;
  force;
  speed;
  playerModelSize;
  playerModelBox;
  constructor(player3dModel: Object3D, inputManager: InputManager) {
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

    this.inputManager = inputManager;
  }

  move() {
    this.force.set(0, 0, 0); //resetting force vector every frame else it would go to infinite
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
}
