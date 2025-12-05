import { OrbitControls } from "three/examples/jsm/Addons.js";
import InputManager from "./core/input-manager";
import RenderManager from "./core/render-manager";
import SceneManager from "./core/scene-manager";
import Ground from "./entities/ground";
import Star from "./entities/star";
import Player from "./entities/player";

export default class Game {
  renderer;
  scene;
  camera;
  world;
  orbitalControls;
  playerMesh;
  playerBody;

  constructor() {
    const { scene, world } = new SceneManager();
    this.scene = scene;
    this.world = world;

    const { camera } = new InputManager();
    this.camera = camera;

    const { renderer } = new RenderManager();
    this.renderer = renderer;

    const { groundBody, groundMesh } = new Ground();

    this.scene.add(groundMesh);
    this.world.addBody(groundBody);

    this.orbitalControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    Array(1000)
      .fill(0)
      .forEach(() => {
        const { star } = new Star();
        this.scene.add(star);
      });

    const { playerBody, playerMesh } = new Player();
    this.playerMesh = playerMesh;
    this.playerBody = playerBody;
    this.scene.add(playerMesh);
    this.world.addBody(playerBody);
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
      this.renderer.render(this.scene, this.camera);
      this.world.step(1 / 60);
      this.playerMesh.position.copy(this.playerBody.position);
      this.playerMesh.quaternion.copy(this.playerBody.quaternion);

      this.orbitalControls.update();
    });
  }
}
