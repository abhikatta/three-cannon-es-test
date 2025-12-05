import { PerspectiveCamera } from "three";

// TODO
export default class InputManager {
  camera;
  constructor() {
    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    this.camera.position.set(0, 40, 50);
  }
}
