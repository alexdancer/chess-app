import { PieceType, TeamType, Tile, Position } from "../Constants";
import { pawnMove, knightMove, bishopMove, rookMove, queenMove, kingMove} from './pieceRules';

export default class Rules {
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
    let validMode = false;
    switch (type) {
      case PieceType.PAWN:
        validMode = pawnMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KNIGHT:
        validMode = knightMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.BISHOP:
        validMode = bishopMove(initialPosition, desiredPosition, team,boardState);
        break;
      case PieceType.ROOK:
        validMode = rookMove(initialPosition, desiredPosition, team,boardState);
        break;
      case PieceType.QUEEN:
        validMode = queenMove(initialPosition, desiredPosition, team,boardState);
        break;
      case PieceType.KING:
        validMode = kingMove(initialPosition, desiredPosition, team,boardState);
    }

    return validMode;
  }
}
