import { PieceType, TeamType } from "../Types";
import {
  getCastleMoves,
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
  numberOfTurns: number;

  constructor(pieces: Tile[], numberOfTurns: number) {
    this.pieces = pieces;
    this.numberOfTurns = numberOfTurns;
  }

  get currentTeam(): TeamType {
    return this.numberOfTurns % 2 === 0 ? TeamType.BLACK : TeamType.WHITE;
  }

  calculateAllMoves() {
    // calcluates the moves of all pieces for the possible moves
    for (const piece of this.pieces) {
      piece.possibleMoves = this.getValidMoves(piece, this.pieces);
    }

    // Calculates the castle moves
    for(const king of this.pieces.filter(p => p.isKing)) {
      if(king.possibleMoves === undefined) continue;
      king.possibleMoves = [...king.possibleMoves, ...getCastleMoves(king, this.pieces)];
    }

    this.checkCurrentTeamMoves(); // checks if the current team moves are valid

    for(const piece of this.pieces.filter(p => p.team !== this.currentTeam)) {
      piece.possibleMoves = [];
    }
  }

  checkKingMoves() {
    const king = this.pieces.find(p => p.isKing && p.team === this.currentTeam);

    if(king?.possibleMoves === undefined) return;

    // predicts the future moves of the king
    for(const move of king.possibleMoves) {
      const simulatedBoard = this.clone();

      const pieceAtDestination = simulatedBoard.pieces.find(p => p.samePosition(move))

      // if piece at destination remove the move
      if(pieceAtDestination !== undefined) {
        simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));
      }

      const simulatedKing = simulatedBoard.pieces.find(p => p.isKing && p.team === simulatedBoard.currentTeam)
      // Tell the compilier that the simulatedKing is always present
      simulatedKing!.position = move;

      for(const enemy of simulatedBoard.pieces.filter(p => p.team !== simulatedBoard.currentTeam)) {
        enemy.possibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces)
      }

      let safe = true; 

      // checks if the king can make the move without being in check
      for(const p of simulatedBoard.pieces) {
        if (p.team === simulatedBoard.currentTeam) continue;

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

  checkCurrentTeamMoves() {
    for(const piece of this.pieces.filter(p => p.team === this.currentTeam)) {
      if(piece.possibleMoves === undefined) continue;

      // Simulate all the piece moves
      for (const move of piece.possibleMoves) {
        const simulatedBoard = this.clone();

        // removes the piece at destination
        simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));
        
        // gets the piece on the cloned board
        const clonedPiece = simulatedBoard.pieces.find((p) =>
          p.samePiecePosition(piece)
        )!; // Used the ! to tell the compiler that the piece is always present
        clonedPiece.position = move.clone();

        // gets the king on the cloned board
        const clonedKing = simulatedBoard.pieces.find(p => p.isKing && p.team === simulatedBoard.currentTeam)!;

        for (const enemy of simulatedBoard.pieces.filter((p) => p.team !== simulatedBoard.currentTeam)) {
          enemy.possibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces);
        
          const isDangerousMove = enemy.possibleMoves.some(m => {
            const isPawnConditionMet = enemy.isPawn ? m.x !== enemy.position.x : true;
            return isPawnConditionMet && m.samePosition(clonedKing.position);
          });
        
          if (isDangerousMove) {
            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.samePosition(move));
            break; // Assuming you can break after finding the first dangerous move for efficiency
          }
        }
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
    const destinationPiece = this.pieces.find(p => p.samePosition(destination));

    // Castling logic
    this.pieces = this.pieces.map(p => {
      if(p.samePiecePosition(playedPiece)) {
        p.hasMoved = true; // Mark the piece as having moved
      }
      return p;
    });
    
    // Step 3: Check the movement state before allowing a castle move
    if (
      playedPiece.isKing &&
      !playedPiece.hasMoved && // Check that the king hasn't moved
      destinationPiece?.isRook &&
      !destinationPiece.hasMoved && // Check that the rook hasn't moved
      destinationPiece.team === playedPiece.team
    ) {
      const direction = (destinationPiece.position.x - playedPiece.position.x > 0) ? 1 : -1;
      const newKingPosition = playedPiece.position.x + direction * 2;
    
      this.pieces = this.pieces.map(p => {
        if(p.samePiecePosition(playedPiece)) {
          p.position.x = newKingPosition;
          p.hasMoved = true;
        } else if(p.samePiecePosition(destinationPiece)) {
          p.position.x = newKingPosition - direction;
          p.hasMoved = true;
        }
    
        return p;
      })
    
      return true;
    }


    if (enPassantMove) {
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          piece.hasMoved = true;
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
          piece.hasMoved = true;

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
    return new Chessboard(
      this.pieces.map((p) => p.clone()),
      this.numberOfTurns
    );
  }
}