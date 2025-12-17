import { Vec3, World } from "cannon-es";
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
} from "three";

export default class SceneManager {
  scene;
  world;
  constructor() {
    this.scene = new Scene();

    const sun = new DirectionalLight(0xffffff, 9);
    sun.position.set(600, 2000, 600);
    sun.castShadow = true;

    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 1000;
    sun.shadow.camera.left = -200;
    sun.shadow.camera.right = 200;
    sun.shadow.camera.top = 200;
    sun.shadow.camera.bottom = -200;

    this.scene.add(sun);
    this.scene.add(new AmbientLight(0xffffff));

    const sunMesh = new Mesh(
      new SphereGeometry(100, 32, 32),
      new MeshBasicMaterial({ color: 0xffffcc })
    );

    sunMesh.position.copy(sun.position);
    this.scene.add(sunMesh);
    this.world = new World({
      gravity: new Vec3(0, -8.81, 0),
      frictionGravity: new Vec3(0, 0.18, 0),
    });
  }
}
