import { GRID_DIM, POSITION_MODIFIERS } from "./utils/constants";
import { getPatrolPosition } from "./utils/get-position";
import { getAbsNum } from "./utils/math-rounders";

interface EventDataProps {
  buildingPosition: {
    x: number;
    y: number;
  };
}

/*
    What to do:
V   1. get an array of patrolPositions
X   2. sort the array based on x and y ascending so its clockwise patrolling
    3. for 2 adjacent points in th array, calculate all the points in the
       between following in a line
    4. wait for a second if the point is the patrolPosition and increment the
       pointer to the next 2 adjacent positions in the array

{4,5}
{3,2}

{1,3}


 */

self.onmessage = function (event: MessageEvent<EventDataProps>) {
  const { buildingPosition } = event.data;
  const PATROL_RADIUS = Math.max(getAbsNum("ceil", 7), 4);

  const getNewPatrolPosition = () =>
    getPatrolPosition(
      PATROL_RADIUS,
      POSITION_MODIFIERS,
      GRID_DIM,
      buildingPosition
    );

  let patrolPositions = [
    { ...getNewPatrolPosition() },
    { ...getNewPatrolPosition() },
    { ...getNewPatrolPosition() },
    { ...getNewPatrolPosition() },
  ];

  patrolPositions.sort((p1, p2) => p1.x - p2.x || p1.y - p2.y);

  console.log(patrolPositions);
  let p1 = 0;
  let p2 = 1;

  self.postMessage(patrolPositions[0]);
};
