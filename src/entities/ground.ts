import { Body, Box, Material, Vec3, World } from "cannon-es";
import { Box3, Scene, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class Ground {
  tilesX;
  tilesZ;

  constructor() {
    this.tilesX = 10;
    this.tilesZ = 10;
  }

  async init(loader: GLTFLoader, scene: Scene, world: World) {
    const groundModel = await loader.loadAsync("/models/stone_ground.glb");

    const size = new Vector3();
    const box = new Box3().setFromObject(groundModel.scene);
    box.getSize(size);

    const groundBody = new Body({
      shape: new Box(
        new Vec3(
          (size.x / 2) * this.tilesX,
          size.y / 2,
          (size.z / 2) * this.tilesZ
        )
      ),
      type: Body.STATIC,
      material: new Material(),
    });
    groundBody.position.set(-size.z / 2, -0.5, -size.x / 2);
    world.addBody(groundBody);

    for (let x = -this.tilesX / 2; x < this.tilesX / 2; x++) {
      for (let z = -this.tilesZ / 2; z < this.tilesZ / 2; z++) {
        const tile = groundModel.scene.clone(true);

        tile.position.set(x * size.x, 0, z * size.z);

        scene.add(tile);
      }
    }
  }
}
