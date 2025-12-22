import Game from "./game";

const game = new Game("car");

// Enable mouse movement for camera control
document.body.addEventListener("click", () => {
  document.body.requestPointerLock();
});

game.start();
