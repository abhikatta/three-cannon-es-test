import RenderManager from "@/core/render-manager";
import SceneManager from "@/core/scene-manager";
import Ground from "@/entities/ground";
import Player from "@/entities/player";
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
  enableOrbitalControls;
  player3dModel!: Object3D;
  constructor(enableOrbitalControls: boolean) {
    const { scene, world } = new SceneManager();
    this.scene = scene;
    this.world = world;

    const { renderer } = new RenderManager();
    this.renderer = renderer;

    const { groundBody, groundMesh } = new Ground();

    this.scene.add(groundMesh);
    this.world.addBody(groundBody);

    const { stars } = new StarField(10000);
    this.scene.add(stars);
    this.enableOrbitalControls = enableOrbitalControls;
    this.init();
    if (this.enableOrbitalControls) {
      this.addOrbitalCamera();
    }
  }
  async init() {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync("/models/sphere.glb");
    gltf.scene.scale.set(1, 1, 1);
    this.player3dModel = gltf.scene;

    const player = new Player(this.player3dModel);
    this.player = player;

    this.scene.add(player.playerMesh);
    this.scene.add(player.camera);
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

  addOrbitalCamera() {
    this.orbitalCamera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      999999999999999
    );
    this.orbitalCamera.position.set(0, 30, 50);
    this.orbitalControls = new OrbitControls(
      this.orbitalCamera,
      this.renderer.domElement
    );

    this.scene.add(this.orbitalCamera);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(
        this.scene,
        this.enableOrbitalControls && this.orbitalCamera
          ? this.orbitalCamera
          : this.player.camera
      );
      this.world.step(1 / 120);
      // for orbital controls:
      if (this.enableOrbitalControls) this.orbitalControls?.update(1 / 120);
      if (this.player) {
        this.player.move();
        this.player.update();
      }
    });
  }
}
