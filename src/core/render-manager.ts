import { WebGLRenderer } from "three";

export default class RenderManager {
  renderer;
  constructor() {
    this.renderer = new WebGLRenderer({
      canvas: document.getElementById("bg")!,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
