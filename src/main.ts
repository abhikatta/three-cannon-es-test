import {
  AmbientLight,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  PointLightHelper,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// 1. setup
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 30); // zoomed outward on z so its 30 points away on z-axis from (0,0,0) point
const element = document.getElementById("bg");
const renderer = new WebGLRenderer({
  canvas: element!,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// 2. adding a random object
const geometry = new TorusGeometry(10, 3, 100, 100);
const material = new MeshStandardMaterial({
  color: 0xff6347,
});
const torus = new Mesh(geometry, material);
scene.add(torus);

// 3. adding some light
const pointLight = new PointLight(0xffffff); // a flashlight typa light
pointLight.intensity = 1000;
const ambientLight = new AmbientLight(0xffffff); // adding light on everything, like its daytime
scene.add(pointLight, ambientLight);

const pointLightHelper = new PointLightHelper(pointLight); // a helper that shows where the pointLight is
pointLight.position.set(15, 2, 0);

scene.add(pointLightHelper);

// 4. adding orbital controls and grid helper for adding camera movement and understanding movements
const orbitalControls = new OrbitControls(camera, renderer.domElement); // not required for this to be added to scene as its controls not an object
const gridHelper = new GridHelper(200, 50);

scene.add(gridHelper);

// 5. animation loop
function animate() {
  renderer.render(scene, camera);

  orbitalControls.update();
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.03;
  torus.rotation.z += 0.045;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
