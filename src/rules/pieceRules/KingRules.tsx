import { Position, TeamType, samePosition } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { Tile } from "../../models/Tile";

export const kingMove = (
  initialPosition: Position, 
  desiredPosition: Position,
  team: TeamType,
  boardState: Tile[]
): boolean => {
  for (let i = 1; i < 2; i++) {
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

export const getPossibleKingMoves = (king: Tile, boardState: Tile[]): Position[] => {
  const possibleMoves: Position[] = [];

  // Top movement
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x, y: king.position.y + i};
    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if(tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break;
    } else {
      break;
    }
  } 
  // Bottom movement
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x, y: king.position.y - i};
    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if(tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break;
    } else {
      break;
    }
  } 

  // Left movement
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x - i, y: king.position.y};
    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if(tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break;
    } else {
      break;
    }
  } 

  // Right movement
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x + i, y: king.position.y};
    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if(tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break;
    } else {
      break;
    }
  } 

  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x + i, y: king.position.y + i};

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if(tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Bottom right movement 
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x + i, y: king.position.y - i};

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if(tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Bottom left movement 
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x - i, y: king.position.y - i};

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if(tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // Upper left movement 
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x - i, y: king.position.y + i};

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if(tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
}