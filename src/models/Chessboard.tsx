import { PieceType, TeamType } from "../Types";
import {
  getPossibleBishopMoves,
  getPossibleKingMoves,
  getPossibleKnightMoves,
  getPossiblePawnMoves,
  getPossibleQueenMoves,
  getPossibleRookMoves,
} from "../rules/pieceRules";
import { Pawn } from "./Pawn";
import { Position } from "./Position";
import { Tile } from "./Tile";

export class Chessboard {
  pieces: Tile[];

  constructor(pieces: Tile[]) {
    this.pieces = pieces;
  }

  calculateAllMoves() {
    // calcluates the moves of all pieces for the possible moves
    for (const piece of this.pieces) {
      piece.possibleMoves = this.getValidMoves(piece, this.pieces);
    }

    this.checkKingMoves();
  }

  checkKingMoves() {
    const king = this.pieces.find(p => p.isKing && p.team === TeamType.BLACK)

    if(king?.possibleMoves === undefined) return;

    // predicts the future moves of the king
    for(const move of king.possibleMoves) {
      const simulatedBoard = this.clone();

      const pieceAtDestination = this.pieces.find(p => p.samePosition(move))

      // if piece at destination remove the move
      if(pieceAtDestination !== undefined) {
        simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));
      }

      const simulatedKing = simulatedBoard.pieces.find(p => p.isKing && p.team === TeamType.BLACK)
      // Tell the compilier that the simulatedKing is always present
      simulatedKing!.position = move;

      for(const enemy of simulatedBoard.pieces.filter(p => p.team === TeamType.WHITE)) {
        enemy.possibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces)
      }

      let safe = true; 

      // checks if the king can make the move without being in check
      for(const p of simulatedBoard.pieces) {
        if (p.team === TeamType.BLACK) continue;

        if (p.isPawn) {
          const possiblePawnMoves = this.getValidMoves(p, simulatedBoard.pieces);

          if (possiblePawnMoves?.some(
            (ppm) => ppm.x !== p.position.x && ppm.samePosition(move))) {
            safe = false;
            break;
          }
        } else if (p.possibleMoves?.some((p) => p.samePosition(move))) {
          safe = false;
          break;
        }
      }
      
      // Remove from possible moves
      if(!safe) {
        king.possibleMoves = king.possibleMoves?.filter(m => !m.samePosition(move));
      }
    }
  }

  getValidMoves(piece: Tile, boardState: Tile[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  playMove(
    enPassantMove: boolean,
    validMove: boolean,
    playedPiece: Tile,
    destination: Position
  ): boolean {
    const pawnDirection = playedPiece.team === TeamType.WHITE ? 1 : -1;

    if (enPassantMove) {
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (
          !piece.samePosition(
            new Position(destination.x, destination.y - pawnDirection)
          )
        ) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Tile[]);

      this.calculateAllMoves();
    } else if (validMove) {
      // updates piece position
      // and if a piece is attacked, remove it
      this.pieces = this.pieces.reduce((results, piece) => {
        // if piece we are currently moving
        if (piece.samePiecePosition(playedPiece)) {
          // special move
          if (piece.isPawn) {
            (piece as Pawn).enPassant =
              Math.abs(playedPiece.position.y - destination.y) === 2 &&
              piece.type === PieceType.PAWN;
          }

          piece.position.x = destination.x;
          piece.position.y = destination.y;

          results.push(piece);
        } else if (!piece.samePosition(destination)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Tile[]);

      this.calculateAllMoves();
    } else {
      return false;
    }

    return true;
  }

  clone(): Chessboard {
    return new Chessboard(this.pieces.map(p => p.clone()));
  }
}