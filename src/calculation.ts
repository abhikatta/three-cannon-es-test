import { GRID_DIM, POSITION_MODIFIERS } from "./utils/constants";
import { getPatrolPosition } from "./utils/get-position";
import { getAbsNum } from "./utils/math-rounders";

interface EventDataProps {
  buildingPosition: {
    x: number;
    y: number;
  };
}

self.onmessage = function (event: MessageEvent<EventDataProps>) {
  const { buildingPosition } = event.data;
  const PATROL_RADIUS = Math.max(getAbsNum("ceil", 7), 4);

  const { x: patrolPositionX, y: patrolPositionY } = getPatrolPosition(
    PATROL_RADIUS,
    POSITION_MODIFIERS,
    GRID_DIM,
    buildingPosition
  );

  self.postMessage({ patrolPositionX, patrolPositionY });
};
