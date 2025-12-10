import { Vec3, World } from "cannon-es";
import { AmbientLight, Scene } from "three";

export default class SceneManager {
  scene;
  world;
  constructor() {
    this.scene = new Scene();
    this.scene.add(new AmbientLight());
    this.world = new World({
      gravity: new Vec3(0, -8.81, 0),
      frictionGravity: new Vec3(0, 0.18, 0),
    });
  }
}
