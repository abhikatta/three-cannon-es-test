import {
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshBasicMaterial,
  SphereGeometry,
} from "three";

export default class StarField {
  stars;
  constructor(count = 10000, spread = 1000) {
    const starGeometry = new SphereGeometry(0.25, 3, 3, 0);
    const starMaterial = new MeshBasicMaterial({ color: "white" });
    this.stars = new InstancedMesh(starGeometry, starMaterial, count);
    const matrix = new Matrix4();

    for (let i = 0; i <= count; i++) {
      const x = MathUtils.randFloatSpread(spread);
      const y = MathUtils.randFloatSpread(spread);
      const z = MathUtils.randFloatSpread(spread);
      matrix.setPosition(x, y, z);
      this.stars.setMatrixAt(i, matrix);
    }
  }
}
