import Game from "./game";

// TODO: for mouse movement
// document.body.addEventListener("click", () => {
//   document.body.requestPointerLock();
// });

async function main() {
  const game = new Game("boulder");
  await game.start();
}

main();
