import { Body, Material, Sphere, Vec3, World } from "cannon-es";
import {
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
} from "three";

// TODO
export class ObstacleField {
  obstacles: {
    obstacle: Mesh;
    obstacleBody: Body;
  }[] = [];
  count;
  constructor(scene: Scene, world: World, count = 30, spread = 100) {
    this.count = count;
    for (let i = 0; i < count; i++) {
      const x = MathUtils.randFloatSpread(spread);
      const y = MathUtils.randFloatSpread(spread);
      const z = MathUtils.randFloatSpread(spread);
      const obstacleGeometry = new SphereGeometry(2);
      const obstacleMaterial = new MeshBasicMaterial({ color: "white" });

      const obstacle = new Mesh(obstacleGeometry, obstacleMaterial);
      const obstacleBody = new Body({
        mass: 1,
        position: new Vec3(x, y, z),
        shape: new Sphere(2),
        material: new Material(),
      });
      this.obstacles.push({ obstacle, obstacleBody });

      world.addBody(obstacleBody);
      scene.add(obstacle);
      obstacle.position.copy(obstacleBody.position);
      obstacle.quaternion.copy(obstacleBody.quaternion);
    }
  }
  update() {
    for (const { obstacle, obstacleBody } of this.obstacles) {
      obstacle.position.copy(obstacleBody.position);
      obstacle.quaternion.copy(obstacleBody.quaternion);
    }
  }
}
