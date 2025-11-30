import "./style.css";
// '?worker' tells Vite to treat the imported file as a Web Worker
import MyWorker from "./calculation.ts?worker";
import { getAbsNum } from "./utils/math-rounders";
const calculator = new MyWorker();

let grid: number[][] = [[]];
const gridDim = 40;

const [rows, cols] = [gridDim, gridDim];

const app = document.getElementById("app");
const canvas: HTMLCanvasElement = document.createElement("canvas");

canvas.width = rows * 10;
canvas.height = cols * 10;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

const buildingPosition = {
  x: Math.min(Math.round(Math.random() * gridDim), gridDim - 3),
  y: Math.min(Math.round(Math.random() * gridDim), gridDim - 3),
};

const PATROL_RADIUS = 4; //TODO: add a bit of randomness to this
const POSITION_MODIFIERS = [-1, 1];
const patrolPosition: { x: number; y: number }[] = [
  {
    // place position around +-4 tiles from the (0,0 of x,y i.e. top left coordinate) coordinate of the
    // building else the last row/col coordinate
    x: Math.min(
      Math.round(
        PATROL_RADIUS * POSITION_MODIFIERS[getAbsNum("round")] +
          buildingPosition.x
      ),
      gridDim - 1
    ),
    y: Math.min(
      Math.round(
        PATROL_RADIUS * POSITION_MODIFIERS[getAbsNum("round")] +
          buildingPosition.y
      ),
      gridDim - 1
    ),
  },
];

function make2DArray(rows: number, cols: number): number[][] {
  let arr = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(cols).fill(0);
  }
  return arr;
}

grid = make2DArray(rows, cols);
const newGrid = make2DArray(rows, cols);

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
      ctx.roundRect(
        buildingPosition.x * cellHeight,
        buildingPosition.y * cellWidth,
        cellWidth,
        cellHeight
      );
      ctx.fillStyle = "red";
      ctx.fillRect(
        buildingPosition.x * cellHeight,
        buildingPosition.y * cellWidth,
        cellWidth * 3,
        cellHeight * 3
      );

      ctx.roundRect(
        patrolPosition[0].x * cellHeight,
        patrolPosition[0].y * cellWidth,
        cellWidth,
        cellHeight
      );
      ctx.fillStyle = "white";
      ctx.fillRect(
        patrolPosition[0].x * cellHeight,
        patrolPosition[0].y * cellWidth,
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
