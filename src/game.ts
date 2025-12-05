import { OrbitControls } from "three/examples/jsm/Addons.js";
import RenderManager from "./core/render-manager";
import SceneManager from "./core/scene-manager";
import Ground from "./entities/ground";
import Player from "./entities/player";
import Star from "./entities/star";

export default class Game {
  renderer;
  scene;
  world;
  orbitalControls;
  player;

  constructor() {
    const { scene, world } = new SceneManager();
    this.scene = scene;
    this.world = world;

    const { renderer } = new RenderManager();
    this.renderer = renderer;

    const { groundBody, groundMesh } = new Ground();

    this.scene.add(groundMesh);
    this.world.addBody(groundBody);

    Array(1000)
      .fill(0)
      .forEach(() => {
        const { star } = new Star();
        this.scene.add(star);
      });

    const player = new Player();
    this.player = player;
    this.scene.add(this.player.camera);

    this.orbitalControls = new OrbitControls(
      this.player.camera,
      this.renderer.domElement
    );

    this.scene.add(player.playerMesh);
    this.world.addBody(player.playerBody);
  }

  /*
  IMPORTANT JS NOTE:

  This version does NOT work:

    start() {
      this.renderer.render(this.scene, this.camera);
      this.orbitalControls.update();
      this.renderer.setAnimationLoop(this.start);
    }

  Reason:
    - We are passing the method reference `this.start` directly.
    - When Three.js calls that function later, it calls it without an object
      context, so `this` inside start() becomes undefined.
    - Then `this.scene`, `this.camera`, etc. are undefined → nothing renders.

  the follwoing version DOES work:
  goto start(){} below
  
  Reason:
    - Arrow functions capture `this` lexically from the surrounding scope.
    - So inside the arrow function, `this` still refers to the Game instance.
    - The animation loop keeps the correct context and everything updates.
*/

  start() {
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.player.camera);
      this.world.step(1 / 60);
      this.player.move();
      this.player.update();
      this.orbitalControls.update();
    });
  }
}
