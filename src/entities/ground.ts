import { Body, Box, Material, Vec3, World } from "cannon-es";
import { Box3, Object3D, Scene, Vector3 } from "three";

export default class Ground {
  constructor(ground3dModel: Object3D, scene: Scene, world: World) {
    const tilesX = 10;
    const tilesZ = 10;
    const box = new Box3().setFromObject(ground3dModel);
    const size = new Vector3();
    box.getSize(size);

    const groundBody = new Body({
      shape: new Box(
        new Vec3((size.x / 2) * tilesX, size.y / 2, (size.z / 2) * tilesZ)
      ),
      type: Body.STATIC,
      material: new Material(),
    });
    groundBody.position.set(-size.z / 2, -0.5, -size.x / 2);
    world.addBody(groundBody);

    for (let x = -tilesX / 2; x < tilesX / 2; x++) {
      for (let z = -tilesZ / 2; z < tilesZ / 2; z++) {
        const tile = ground3dModel.clone(true);

        tile.position.set(x * size.x, 0, z * size.z);

        scene.add(tile);
      }
    }
  }
}
