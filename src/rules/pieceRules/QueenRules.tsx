import { Position, TeamType, Tile, samePosition } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

export const queenMove = (
  initialPosition: Position, 
  desiredPosition: Position,
  team: TeamType,
  boardState: Tile[]
): boolean => {
  for (let i = 1; i < 8; i++) {
    // Diagonal
    let multiplierX;
    let multiplierY;
    if(desiredPosition.x < initialPosition.x) {
      multiplierX = -1;
    } else if(desiredPosition.x > initialPosition.x) {
      multiplierX = 1;
    } else {
      multiplierX = 0;
    }

    if(desiredPosition.y < initialPosition.y) {
      multiplierY = -1
    } else if(desiredPosition.y > initialPosition.y) {
      multiplierY = 1
    } else {
      multiplierY = 0
    }

    let passedPosition: Position = {x: initialPosition.x + (i*multiplierX), y: initialPosition.y + (i*multiplierY)};

    if (samePosition(passedPosition, desiredPosition)) {
      if (
        tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)
      ) {
        return true;
      }
    } else {
      if (tileIsOccupied(passedPosition, boardState)) {
        break;
      }
    }
  }
  return false
}