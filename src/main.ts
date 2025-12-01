import "./style.css";
// '?worker' tells Vite to treat the imported file as a Web Worker
import MyWorker from "./calculation.ts?worker";
import { GRID_DIM, PATROL_RADIUS, POSITION_MODIFIERS } from "./utils/constants";
import { getBuildingPosition, getPatrolPosition } from "./utils/get-position";
import { make2DArray } from "./utils/misc";
const calculator = new MyWorker();

const [rows, cols] = [GRID_DIM, GRID_DIM];

const app = document.getElementById("app");
const canvas: HTMLCanvasElement = document.createElement("canvas");

canvas.width = rows * 10;
canvas.height = cols * 10;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

let grid = make2DArray(rows, cols);
const newGrid = make2DArray(rows, cols);

const { x, y } = getBuildingPosition(GRID_DIM);
const { x: patrolPositionX, y: patrolPositionY } = getPatrolPosition(
  PATROL_RADIUS,
  POSITION_MODIFIERS,
  GRID_DIM,
  { x, y }
);

const setupGrid = () => {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d")!;
    // dividing the grid on canvas and drawing the squares(cells)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.roundRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        ctx.fillStyle = "black";
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
    }
    if (ctx) {
      ctx.roundRect(x * cellHeight, y * cellWidth, cellWidth, cellHeight);
      ctx.fillStyle = "red";
      ctx.fillRect(
        x * cellHeight,
        y * cellWidth,
        cellWidth * 3,
        cellHeight * 3
      );

      ctx.roundRect(
        patrolPositionX * cellHeight,
        patrolPositionY * cellWidth,
        cellWidth,
        cellHeight
      );
      ctx.fillStyle = "white";
      ctx.fillRect(
        patrolPositionX * cellHeight,
        patrolPositionY * cellWidth,
        cellWidth,
        cellHeight
      );
    }
  }
};

setupGrid();

app?.append(canvas);

const updateGrid = () => {
  calculator.postMessage({ rows, cols, grid, newGrid });
  calculator.onmessage = function (e) {
    grid = e.data;
    setupGrid();
  };
  calculator.onerror = function (e) {
    console.error(e.message);
  };
  requestAnimationFrame(updateGrid);
};

// start animation
requestAnimationFrame(updateGrid);
