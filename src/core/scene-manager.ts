import { Vec3, World } from "cannon-es";
import { DirectionalLight, Scene } from "three";

export default class SceneManager {
  scene;
  world;
  constructor() {
    this.scene = new Scene();
    const sun = new DirectionalLight(0xffffff, 4);
    sun.position.set(50, 100, 50);
    this.scene.add(sun);
    this.scene.add(sun.target);
    this.world = new World({
      gravity: new Vec3(0, 0, 0),
    });
  }
}
