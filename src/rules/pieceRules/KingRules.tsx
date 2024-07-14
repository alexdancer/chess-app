import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { Tile } from "../../models/Tile";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";


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

export const getPossibleKingMoves = (king: Tile, boardState: Tile[]): Position[] => {
  const possibleMoves: Position[] = [];

  // Top movement
  for(let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y + i);
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
    const destination = new Position(king.position.x, king.position.y - i);
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
    const destination = new Position(king.position.x - i, king.position.y);
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
    const destination = new Position(king.position.x + i, king.position.y);
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
    const destination = new Position(king.position.x + i, king.position.y + i);

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
    const destination = new Position(king.position.x + i, king.position.y - i);

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
    const destination = new Position(king.position.x - i, king.position.y - i);

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
    const destination = new Position(king.position.x - i, king.position.y + i);

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

export const getCastleMoves = (king: Tile, boardState: Tile[]): Position[] => {
  const possibleMoves: Position[] = [];

  if (king.hasMoved) return possibleMoves;

  const rooks = boardState.filter(p => p.isRook && p.team === king.team && !p.hasMoved);
  const enemyPieces = boardState.filter(p => p.team !== king.team);

  for (const rook of rooks) {
    const direction = (rook.position.x - king.position.x > 0) ? 1 : -1;
    let pathClear = true;
    let tilesBetween = [];

    // Check if path between king and rook is clear
    for (let x = king.position.x + direction; x !== rook.position.x; x += direction) {
      if (boardState.some(p => p.position.x === x && p.position.y === king.position.y)) {
        pathClear = false;
        break;
      }
      tilesBetween.push(new Position(x, king.position.y));
    }

    if (!pathClear) continue;

    // Check if any tile between king and rook is under attack
    let pathSafe = !tilesBetween.some(tile => 
      enemyPieces.some(enemy => 
        enemy.possibleMoves?.some(move => move.samePosition(tile))
      )
    );

    if (pathSafe) {
      possibleMoves.push(rook.position.clone());
    }
  }

  return possibleMoves;

}