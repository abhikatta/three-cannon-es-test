interface eventDataProps {
  rows: number;
  cols: number;
  grid: number[][];
  newGrid: number[][];
  buildingPosition: { x: number; y: number };
}

self.onmessage = function (event: MessageEvent<eventDataProps>) {
  let { rows, cols, grid, newGrid } = event.data;

  self.postMessage(newGrid);
};
