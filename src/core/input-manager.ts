export default class InputManager {
  keys: {
    [key: KeyboardEvent["code"]]: boolean;
  };
  mouseDeltaX: number = 0;
  mouseDeltaY: number = 0;
  mouseSensitivity: number = 0.002;

  constructor() {
    this.keys = {};
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));

    // Mouse movement for camera
    window.addEventListener("mousemove", (e) => {
      this.mouseDeltaX = e.movementX * this.mouseSensitivity;
      this.mouseDeltaY = e.movementY * this.mouseSensitivity;
    });
  }
  isDown(code: KeyboardEvent["code"]) {
    return this.keys[code];
  }
  getMouseDelta(): { x: number; y: number } {
    const delta = { x: this.mouseDeltaX, y: this.mouseDeltaY };
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return delta;
  }
}
