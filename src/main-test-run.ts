// import { Body, Box, Material, Vec3, World } from "cannon-es";
// import {
//   AmbientLight,
//   BoxGeometry,
//   MathUtils,
//   Mesh,
//   MeshBasicMaterial,
//   MeshStandardMaterial,
//   PerspectiveCamera,
//   Scene,
//   SphereGeometry,
//   WebGLRenderer,
// } from "three";
// import { OrbitControls } from "three/examples/jsm/Addons.js";

// const canvas = document.getElementById("bg");

// const scene = new Scene();
// const camera = new PerspectiveCamera(
//   60,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.set(0, 50, 100); // zoomed outward on z so its 30 points away on z-axis from (0,0,0) point
// const renderer = new WebGLRenderer({
//   canvas: canvas!,
// });

// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// const ambientLight = new AmbientLight(0xffffff); // adding light on everything, like its daytime
// scene.add(ambientLight);
// const orbitalControls = new OrbitControls(camera, renderer.domElement); // not required for this to be added to scene as its controls not an object

// interface BoxObject {
//   boxMesh: Mesh;
//   boxBody: Body;
// }
// const boxes: BoxObject[] = [];

// window.addEventListener("keydown", (e) => {
//   if (e.shiftKey) {
//     const boxGeometry = new BoxGeometry(1, 1, 1);
//     const boxMaterial = new MeshStandardMaterial({
//       color: "red",
//     });
//     const boxMesh = new Mesh(boxGeometry, boxMaterial);
//     scene.add(boxMesh);

//     const boxPhysMat = new Material();
//     const boxBody = new Body({
//       shape: new Box(new Vec3(0.5, 0.5, 0.5)),
//       position: new Vec3(0, 20, 0),
//       mass: 1,
//       material: boxPhysMat,
//     });
//     boxMesh.position.copy(boxBody.position);
//     boxMesh.quaternion.copy(boxBody.quaternion);
//     world.addBody(boxBody);
//     boxes.push({ boxBody, boxMesh });
//   }
// });

// export const addStar = (scene: Scene) => {
//   const starGeometry = new SphereGeometry(0.25, 3, 3, 0);
//   const starMaterial = new MeshBasicMaterial();
//   const star = new Mesh(starGeometry, starMaterial);

//   const [x, y, z] = Array(3)
//     .fill(0)
//     .map(() => MathUtils.randFloatSpread(500));

//   star.position.set(x, y, z);

//   scene.add(star);
// };

// Array(1000).fill(0).forEach(addStar);

// // adding physics on a ground
// const groundGeometry = new BoxGeometry(50, 50, 0.1);
// const groundMaterial = new MeshStandardMaterial({ color: 0xffffff });
// const ground = new Mesh(groundGeometry, groundMaterial);

// const groundPhysMat = new Material();
// const groundBody = new Body({
//   shape: new Box(new Vec3(25, 25, 0.05)),
//   type: Body.STATIC,
//   material: groundPhysMat,
// });

// scene.add(ground);

// const world = new World({
//   gravity: new Vec3(0, -9.81, 0),
// });

// world.addBody(groundBody);

// groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

// // 5. animation loop
// function animate() {
//   world.step(1 / 60);
//   ground.position.copy(groundBody.position);
//   ground.quaternion.copy(groundBody.quaternion);
//   renderer.render(scene, camera);

//   boxes.forEach((i) => {
//     i.boxMesh.position.copy(i.boxBody.position);
//     i.boxMesh.quaternion.copy(i.boxBody.quaternion);
//   });
//   orbitalControls.update();
// }

// renderer.setAnimationLoop(animate);
