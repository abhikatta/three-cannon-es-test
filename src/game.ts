import RenderManager from "@/core/render-manager";
import SceneManager from "@/core/scene-manager";
import Ground from "@/entities/ground";
import StarField from "@/entities/star-field";
import { Object3D, PerspectiveCamera } from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import BoulderPlayer from "@/entities/boulder-player";
import { PlayerBase } from "./entities/player-base";
import { Car } from "./entities/car-player";
import CannonDebugger from "cannon-es-debugger";
import { Vec3 } from "cannon-es";

export default class Game {
  renderer;
  scene;
  world;
  player!: PlayerBase;
  orbitalCamera!: PerspectiveCamera;
  orbitalControls: OrbitControls | null = null;
  player3dModel!: Object3D;
  ground3dModel!: Object3D;
  loader;
  cannonDebugger: ReturnType<typeof CannonDebugger> | null = null;
  constructor(player: "boulder" | "car") {
    const gravity =
      player === "boulder" ? new Vec3(0, -9.81, 0) : new Vec3(0, 0, 0);
    const { scene, world } = new SceneManager(gravity);
    this.scene = scene;
    this.world = world;

    const { renderer } = new RenderManager();
    this.renderer = renderer;

    const { stars } = new StarField(10000);
    this.scene.add(stars);
    this.loader = new GLTFLoader();
    player === "boulder" ? this.initBoulder() : this.initCar();
    this.initGrond();
    this.initOrbitalCamera();
    // this.cannonDebugger = CannonDebugger(scene, world);
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo?.UNMASKED_RENDERER_WEBGL)
      console.log(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
  }
  async initBoulder() {
    const playerModel = await this.loader.loadAsync(
      "/models/free_stone_sphere.glb"
    );
    this.player3dModel = playerModel.scene;
    const player = new BoulderPlayer(this.player3dModel);
    this.player = player;
    this.scene.add(player.playerMesh);
    this.scene.add(player.camera);
    this.world.addBody(player.playerBody);
  }

  async initCar() {
    const playerModel = await this.loader.loadAsync("/models/car.glb");
    this.player3dModel = playerModel.scene;
    const player = new Car(this.player3dModel);
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

  initOrbitalCamera() {
    this.orbitalCamera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.orbitalCamera.position.set(0, 10, 0);
    this.orbitalControls = new OrbitControls(
      this.orbitalCamera,
      this.renderer.domElement
    );
    this.scene.add(this.orbitalCamera);
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
        this.renderer.render(
          this.scene,
          //   this.orbitalCamera
          this.player.camera
        );
        this.world.step(1 / 120);
        this.player.move();
        this.player.update();
        this.cannonDebugger?.update();
        this.orbitalControls?.update();
      }
    });
  }
}
