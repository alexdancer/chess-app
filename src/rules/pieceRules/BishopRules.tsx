import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { Tile } from "../../models/Tile";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";


export const bishopMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Tile[]
): boolean => {
  for (let i = 1; i < 8; i++) {
    // UP RIGHT MOVEMENT
    if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
      let passedPosition = new Position(initialPosition.x + i, initialPosition.y + i);
      // Checking if tile is destination tile
      if (passedPosition.samePosition(desiredPosition)) {
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
      let passedPosition: Position = new Position(initialPosition.x + i, initialPosition.y - i);
      // Checking if tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
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
      let passedPosition = new Position(initialPosition.x - i, initialPosition.y - i);
      // Checking if tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
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
      let passedPosition = new Position(initialPosition.x - i, initialPosition.y + i);
      // Checking if tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
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

export const getPossibleBishopMoves = (bishop: Tile, boardState: Tile[]): Position[] => {
  const possibleMoves: Position[] = [];
  
  // Upper right movement 
  for(let i = 1; i < 8; i++) {
    const destination = new Position(bishop.position.x + i, bishop.position.y + i);

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Bottom right movement 
  for(let i = 1; i < 8; i++) {
    const destination: Position = new Position(bishop.position.x + i, bishop.position.y - i);

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Bottom left movement 
  for(let i = 1; i < 8; i++) {
    const destination = new Position(bishop.position.x - i, bishop.position.y - i);

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Upper left movement 
  for(let i = 1; i < 8; i++) {
    const destination = new Position(bishop.position.x - i, bishop.position.y + i);

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
}