import { Position, TeamType, Tile, samePosition } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

export const bishopMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Tile[]
): boolean => {
  for (let i = 1; i < 8; i++) {
    // UP RIGHT MOVEMENT
    if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
      let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
      // Checking if tile is destination tile
      if (samePosition(passedPosition, desiredPosition)) {
        // Dealing with destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        // Dealing with passing tile
        if (tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
    // bottom right movement
    if (
      desiredPosition.x > initialPosition.x &&
      desiredPosition.y < initialPosition.y
    ) {
      let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y - i};
      // Checking if tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
        // Dealing with destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if (tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
    // bottom left movement
    if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
      let passedPosition: Position = {x: initialPosition.x - i,y: initialPosition.y - i};
      // Checking if tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
        // Dealing with destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if (tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
    // top left movement
    if (desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
      let passedPosition: Position = {x: initialPosition.x - i,y: initialPosition.y + i};
      // Checking if tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
        // Dealing with destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if (tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
  }
  return false;
}