import { getAbsNum } from "./math-rounders";

export const getBuildingPosition = (GRID_DIM: number) => ({
  x: Math.min(Math.round(Math.random() * GRID_DIM), GRID_DIM - 3),
  y: Math.min(Math.round(Math.random() * GRID_DIM), GRID_DIM - 3),
});

export const getPatrolPosition = (
  PATROL_RADIUS: number,
  POSITION_MODIFIERS: number[],
  GRID_DIM: number,
  { x, y }: ReturnType<typeof getBuildingPosition>
) => {
  const buildingPositionX = x;
  const buildingPositionY = y;

  const position = {
    // place position around +-4 tiles from the (0,0 of x,y i.e. top left coordinate) coordinate of the
    // building else the last row/col coordinate
    x: Math.max(
      Math.min(
        Math.round(
          PATROL_RADIUS * POSITION_MODIFIERS[getAbsNum("round")] +
            buildingPositionX
        ),
        GRID_DIM - 1
      ),
      0
    ),
    y: Math.max(
      Math.min(
        Math.round(
          PATROL_RADIUS * POSITION_MODIFIERS[getAbsNum("round")] +
            buildingPositionY
        ),
        GRID_DIM - 1
      ),
      0
    ),
  };
  return position;
};
