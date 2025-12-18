import { Object3D } from "three";
import { PlayerBase } from "./player-base";

export class Car extends PlayerBase {
  constructor(player3dModel: Object3D) {
    super(player3dModel);
  }
  move(): void {}
  update(): void {
    super.update();
  }
}
