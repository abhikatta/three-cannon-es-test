import {
  AmbientLight,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  PointLightHelper,
  TorusGeometry,
} from "three";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { saveSceneState } from "three/src/renderers/common/RendererUtils.js";

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 30);
const element = document.getElementById("bg");

const renderer = new WebGLRenderer({
  canvas: element!,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new TorusGeometry(10, 3, 100, 100);
const material = new MeshStandardMaterial({
  color: 0xff6347,
});

const torus = new Mesh(geometry, material);

scene.add(torus);

const pointLight = new PointLight(0xffffff);
pointLight.intensity = 1000;

const ambientLight = new AmbientLight(0xffffff);

const pointLightHelper = new PointLightHelper(pointLight);

scene.add(pointLightHelper);

scene.add(pointLight, ambientLight);
pointLight.position.set(15, 2, 0);

const gridHelper = new GridHelper(200, 50);
const orbitalControls = new OrbitControls(camera, renderer.domElement);

scene.add(gridHelper);
function animate() {
  renderer.render(scene, camera);

  orbitalControls.update();
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.03;
  torus.rotation.z += 0.045;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
