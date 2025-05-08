interface eventDataProps {
  rows: number;
  cols: number;
  grid: number[][];
  newGrid: number[][];
  hue: number;
}

self.onmessage = function (event: MessageEvent<eventDataProps>) {
  let { rows, cols, grid, newGrid, hue } = event.data;
  for (let i = 0; i < rows; i++) {
    hue += 1;
    for (let j = 0; j < cols; j++) {
      // 0 = unfilled cell, 1(or hue value) means filled cell
      // so this is, if the hovered cell is filled
      if (grid[i][j] !== 0) {
        // if the hovered cell is atleast the last column and the cell has a row below it
        if (i < rows - 1 && j < cols) {
          // if the cell below hovered cell is 0(not filled)
          if (grid[i + 1][j] === 0) {
            newGrid[i + 1][j] = hue; //fill the cell below hovered cell in newgrid (newgrid because repaint)
            newGrid[i][j] = 0; //unfill the cell hovered cell in newgrid

            // So here, the sand first looks to right bottom cell, so it always falls to right
            // if its right bottom cell is empty

            // slide the sand to the right bottom cell if right bottom cell exits and its empty
          } else if (i + 1 < rows && j + 1 < cols && grid[i + 1][j + 1] === 0) {
            newGrid[i + 1][j + 1] = hue;
            newGrid[i][j] = 0;
            // else slide the sand to the left bottom cell if left bottom cell exits and its empty
          } else if (i + 1 < rows && j - 1 >= 0 && grid[i + 1][j - 1] === 0) {
            newGrid[i + 1][j - 1] = hue;
            newGrid[i][j] = 0;
          } else {
            newGrid[i][j] = hue;
          }
        }
        // fill the current cell if all below cells are filled, i think
        else {
          newGrid[i][j] = hue;
        }
      }
    }
  }
  self.postMessage(newGrid);
};
