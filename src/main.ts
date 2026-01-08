import Game from "./game";

// TODO: for mouse movement
// document.body.addEventListener("click", () => {
//   document.body.requestPointerLock();
// });

async function main() {
  // TODO: Check how heavy the car model is
  // and why the car model is heavier and renders in less FPS
  const game = new Game("boulder");
  await game.start();
}

main();
