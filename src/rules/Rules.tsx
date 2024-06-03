import { PieceType, TeamType, Tile, Position, samePosition } from "../Constants";

export default class Rules {

  tileIsEmptyOrOccupiedByOpponent(
    position: Position,
    boardState: Tile[],
    team: TeamType
  ): boolean {

    return (
      !this.tileIsOccupied(position, boardState) ||
      this.tileIsOccupiedByOpponent(position, boardState, team)
    );
  }

  tileIsOccupied(position: Position, boardState: Tile[]): boolean {
    const piece = boardState.find((p) => samePosition(p.position, position));

    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOpponent(
    position: Position,
    boardState: Tile[],
    team: TeamType
  ): boolean {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team !== team
    );

    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  // does the special enPassant move for pawn
  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Tile[]
  ) {
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }
  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Tile[]
  ) {
    if (type === PieceType.PAWN) {
      const specialRow = team === TeamType.WHITE ? 1 : 6;
      const pawnDirection = team === TeamType.WHITE ? 1 : -1;

      // movement logic
      if (
        initialPosition.x === desiredPosition.x &&
        initialPosition.y === specialRow &&
        desiredPosition.y - initialPosition.y === 2 * pawnDirection
      ) {
        if (
          !this.tileIsOccupied(desiredPosition, boardState) &&
          !this.tileIsOccupied(
            { x: desiredPosition.x, y: desiredPosition.y - pawnDirection },
            boardState
          )
        ) {
          return true;
        }
      } else if (
        initialPosition.x === desiredPosition.x &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        if (!this.tileIsOccupied(desiredPosition, boardState)) {
          return true;
        }
      }
      // attack logic
      else if (
        desiredPosition.x - initialPosition.x === -1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        // attack in upper on bottom left corner
        console.log("upper / bottom left");
        if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
          return true;
        }
      } else if (
        desiredPosition.x - initialPosition.x === 1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        // attack in the upper or bottom right corner
        console.log("upper / bottom right");
        if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
          return true;
        }
      }

    // KNIGHT LOGIC
    } else if (type === PieceType.KNIGHT) {
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          // TOP AND BOTTOM MOVEMENT
          if (desiredPosition.y - initialPosition.y === 2 * i) {
            if (desiredPosition.x - initialPosition.x === j) {
              if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition,boardState, team)) {
                return true;
              }
            }
          }

          // RIGHT AND LEFT MOVEMENT
          if (desiredPosition.x - initialPosition.x === 2 * i) {
            if (desiredPosition.y - initialPosition.y === j) {
              if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition,boardState, team)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
}
