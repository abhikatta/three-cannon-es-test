export default class InputManager {
  keys: {
    [key: KeyboardEvent["code"]]: boolean;
  };

  constructor() {
    this.keys = {};
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
  }
  isDown(code: KeyboardEvent["code"]) {
    return this.keys[code];
  }
}
