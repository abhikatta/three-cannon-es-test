import "./style.css";
// '?worker' tells Vite to treat the imported file as a Web Worker
import MyWorker from "./calculation.ts?worker";
const calculator = new MyWorker();

let grid: number[][] = [[]];
const initialValue = 40;
let hue = 0;

const [rows, cols] = [initialValue, initialValue];
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
    // dividing the grid on canvas and drawing the squares(cells) and filling them hue or black
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.roundRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        ctx.fillStyle =
          grid[i][j] === 0
            ? "black"
            : `hsl(${(grid[i][j] + 1) % 360}, 100%, 40%)`; // hot sand ig
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
    }
  }
};

setupGrid();

canvas.addEventListener("mousemove", (e) => {
  const canvasBounds = canvas.getBoundingClientRect();
  const canvasX = canvasBounds.x;
  const canvasY = canvasBounds.y;

  const mouseX = e.clientX - canvasX;
  const mouseY = e.clientY - canvasY;
  // calc coordinates of the cell where the mouse is hovered on the canvas
  const x = Math.floor((mouseX * initialValue) / canvas.width);
  const y = Math.floor((mouseY * initialValue) / canvas.height);
  //   if the cell is well inside the canvas boundaries, work on filling the cell
  if (x >= 0 && x <= initialValue - 1 && y >= 0 && y <= initialValue - 1) {
    grid[y][x] = 1;
    setupGrid();
  }
});

canvas.addEventListener("touchmove", (e) => {
  const canvasBounds = canvas.getBoundingClientRect();
  const canvasX = canvasBounds.x;
  const canvasY = canvasBounds.y;
  const touches = e.touches;

  for (let i = 0; i < touches.length; i++) {
    const mouseX = touches[i].clientX - canvasX;
    const mouseY = touches[i].clientY - canvasY;

    const x = Math.floor((mouseX * initialValue) / canvas.width);
    const y = Math.floor((mouseY * initialValue) / canvas.height);
    if (x >= 0 && x <= initialValue - 1 && y >= 0 && y <= initialValue - 1) {
      grid[y][x] = 1;
      setupGrid();
    }
  }
});

app?.append(canvas);

const updateGrid = () => {
  calculator.postMessage({ rows, cols, grid, newGrid, hue });
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
