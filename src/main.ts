import "./style.css";
// '?worker' tells Vite to treat the imported file as a Web Worker
import MyWorker from "./calculation.ts?worker";
const calculator = new MyWorker();

let grid: number[][] = [[]];
const initialValue = 40;

const [rows, cols] = [initialValue, initialValue];

const buildingPosition = {
  x: Math.min(Math.ceil(Math.random() * initialValue), initialValue - 1),
  y: Math.min(Math.ceil(Math.random() * initialValue), initialValue - 1),
};

console.log(buildingPosition);
const app = document.getElementById("app");
const canvas: HTMLCanvasElement = document.createElement("canvas");

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
  canvas.width = rows * 10;
  canvas.height = cols * 10;
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d")!;
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;
    // dividing the grid on canvas and drawing the squares(cells)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.roundRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        ctx.fillStyle = "black";
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);

        // ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        // ctx.strokeStyle = "white";

        if (buildingPosition.x === i && buildingPosition.y === j) {
          ctx.roundRect(j * cellHeight, i * cellWidth, cellWidth, cellHeight);
          ctx.fillStyle = "red";
          ctx.fillRect(j * cellHeight, i * cellWidth, cellWidth, cellHeight);
        }
      }
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
