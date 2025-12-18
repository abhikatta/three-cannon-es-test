import { Body, Box, Material, Vec3 } from "cannon-es";
import { Box3, Object3D, Vector3 } from "three";

export default class Ground {
  groundMesh;
  groundBody;
  constructor(ground3dModel: Object3D) {
    this.groundMesh = ground3dModel;

    const box = new Box3().setFromObject(this.groundMesh);
    const size = new Vector3();
    box.getSize(size);

    this.groundBody = new Body({
      shape: new Box(new Vec3(size.x / 2, size.y / 2, size.z / 2)),
      type: Body.STATIC,
      material: new Material(),
    });

    this.groundMesh.position.copy(this.groundBody.position);
    this.groundMesh.quaternion.copy(this.groundBody.quaternion);
  }
}
