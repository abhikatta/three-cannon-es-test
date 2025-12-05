import { Vec3, World } from "cannon-es";
import { AmbientLight, Scene } from "three";

export default class SceneManager {
  scene;
  world;
  constructor() {
    this.scene = new Scene();
    this.scene.add(new AmbientLight());
    this.world = new World({
      gravity: new Vec3(0, -9.81, 0),
    });
  }
}
