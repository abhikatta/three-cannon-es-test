import RenderManager from "@/core/render-manager";
import SceneManager from "@/core/scene-manager";
import Ground from "@/entities/ground";
import Player from "@/entities/boulder-player";
import StarField from "@/entities/star-field";
import { Object3D, PerspectiveCamera } from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

export default class Game {
  renderer;
  scene;
  world;
  player!: Player;
  orbitalCamera: PerspectiveCamera | null = null;
  orbitalControls: OrbitControls | null = null;
  player3dModel!: Object3D;
  ground3dModel!: Object3D;
  loader;
  constructor() {
    const { scene, world } = new SceneManager();
    this.scene = scene;
    this.world = world;

    const { renderer } = new RenderManager();
    this.renderer = renderer;

    const { stars } = new StarField(10000);
    this.scene.add(stars);
    this.loader = new GLTFLoader();
    this.initBoulder();
    this.initGrond();
  }

  async initBoulder() {
    const playerModel = await this.loader.loadAsync(
      "/models/free_stone_sphere.glb"
    );
    this.player3dModel = playerModel.scene;
    this.player3dModel.scale.set(1, 1, 1);
    const player = new Player(this.player3dModel);
    this.player = player;
    this.scene.add(player.playerMesh);
    this.scene.add(player.camera);
    this.world.addBody(player.playerBody);
  }

  async initGrond() {
    const groundModel = await this.loader.loadAsync("/models/stone_ground.glb");
    this.ground3dModel = groundModel.scene;

    new Ground(this.ground3dModel, this.scene, this.world);
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
      if (this.player) {
        this.renderer.render(this.scene, this.player.camera);
        this.world.step(1 / 120);
        this.player.move();
        this.player.update();
      }
    });
  }
}
