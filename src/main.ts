import "./style.css";
// '?worker' tells Vite to treat the imported file as a Web Worker
import MyWorker from "./calculation.ts?worker";
import { GRID_DIM } from "./utils/constants";
import { getBuildingPosition } from "./utils/get-position";
const calculator = new MyWorker();

const [rows, cols] = [GRID_DIM, GRID_DIM];

const app = document.getElementById("app");
export const canvas: HTMLCanvasElement = document.createElement("canvas");

canvas.width = rows * 10;
canvas.height = cols * 10;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

const { x, y } = getBuildingPosition(GRID_DIM);
let patrolX: number | null = null;
let patrolY: number | null = null;

const drawBuilding = () => {
  const ctx = canvas.getContext("2d")!;
  if (ctx) {
    ctx.roundRect(x * cellHeight, y * cellWidth, cellWidth, cellHeight);
    ctx.fillStyle = "red";
    ctx.fillRect(x * cellHeight, y * cellWidth, cellWidth * 3, cellHeight * 3);
  }
};

app?.append(canvas);

interface WorkerResponse {
  x: number;
  y: number;
}

calculator.onmessage = function (e: MessageEvent<WorkerResponse>) {
  patrolX = e.data.x;
  patrolY = e.data.y;
};

const update = () => {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBuilding();

  if (patrolX !== null && patrolY !== null) {
    ctx.fillStyle = "green";
    ctx.fillRect(
      patrolX * cellHeight,
      patrolY * cellWidth,
      cellWidth,
      cellHeight
    );
  }

  calculator.postMessage({
    buildingPosition: { x, y },
  });

  requestAnimationFrame(update);
};

// start animation
requestAnimationFrame(update);
