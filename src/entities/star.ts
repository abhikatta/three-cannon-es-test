import { MathUtils, Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export default class Star {
  star;
  constructor() {
    const starGeometry = new SphereGeometry(0.25, 3, 3, 0);
    const starMaterial = new MeshBasicMaterial();
    this.star = new Mesh(starGeometry, starMaterial);

    const [x, y, z] = Array(3)
      .fill(0)
      .map(() => MathUtils.randFloatSpread(1000));

    this.star.position.set(x, y + 500, z);
  }
}
