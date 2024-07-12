import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { Tile } from "../../models/Tile";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";


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

    let passedPosition = new Position(initialPosition.x + (i*multiplierX), initialPosition.y + (i*multiplierY));

    if (passedPosition.samePosition(desiredPosition)) {
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

export const getPossibleQueenMoves = (queen: Tile, boardState: Tile[]): Position[] => {
  const possibleMoves: Position[] = [];

    // Top movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x, queen.position.y + i);
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination)
      } else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
        possibleMoves.push(destination)
        break;
      } else {
        break;
      }
    } 
    // Bottom movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x, queen.position.y - i);
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination)
      } else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
        possibleMoves.push(destination)
        break;
      } else {
        break;
      }
    } 
  
    // Left movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x - i, queen.position.y);
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination)
      } else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
        possibleMoves.push(destination)
        break;
      } else {
        break;
      }
    } 
  
    // Right movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x + i, queen.position.y);
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination)
      } else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
        possibleMoves.push(destination)
        break;
      } else {
        break;
      }
    } 

    // Top right movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x + i, queen.position.y + i);
  
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
  
    // Bottom right movement 
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x + i, queen.position.y - i);
  
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
  
    // Bottom left movement 
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x - i, queen.position.y - i);
  
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
  
    // Upper left movement 
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x - i, queen.position.y + i);
  
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
  
  return possibleMoves;
}