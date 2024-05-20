import { PieceType, TeamType, Tile } from "../components/Chessboard/Board";

export default class Rules {
  tileIsOccupied(x: number, y: number, boardState: Tile[]): boolean {
    const piece = boardState.find((p) => p.x === x && p.y === y);

    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  TileIsOccupiedByOpponent(x: number, y: number, boardState: Tile[], team: TeamType): boolean {
    const piece = boardState.find((p) => p.x === x && p.y === y && p.team !== team) 

    if(piece) {
      return true;
    } else {
      return false;
    } 
  }

  // does the special enPassant move for pawn
  isEnPassantMove(
    prevX: number,
    prevY: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Tile[]
    ) {
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;

    if(type === PieceType.PAWN) {
      if((x - prevX === -1 || x - prevX === 1) && y - prevY === pawnDirection) {
        const piece = boardState.find(
          (p) => p.x === x && p.y === y - pawnDirection && p.enPassant
        );
        
        if(piece) {
          return true
        }
      }
    }
    return false;
  }

  isValidMove(
    prevX: number,
    prevY: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Tile[]
  ) {

    if (type === PieceType.PAWN) {
      const specialRow = (team === TeamType.WHITE) ? 1 : 6;
      const pawnDirection = (team === TeamType.WHITE) ? 1 : -1;

      // movement logic
      if (
        prevX === x &&
        prevY === specialRow &&
        y - prevY === 2 * pawnDirection
      ) {
        if (
          !this.tileIsOccupied(x, y, boardState) &&
          !this.tileIsOccupied(x, y - pawnDirection, boardState)
        ) {
          return true;
        }
      } else if (prevX === x && y - prevY === pawnDirection) {
        if (!this.tileIsOccupied(x, y, boardState)) {
          return true;
        }
      }
      // attack logic
      else if(x - prevX === -1 && y - prevY === pawnDirection) {
        // attack in upper on bottom left corner
        console.log("upper / bottom left")
        if(this.TileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true;
        }
      } else if(x - prevX === 1 && y - prevY === pawnDirection) {
        // attack in the upper or bottom right corner
        console.log("upper / bottom right")
        if(this.TileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true
        }
      }
    }
    return false;
  }
}
