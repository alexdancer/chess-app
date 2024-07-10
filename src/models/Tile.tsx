import { Position } from "./Position";
import { PieceType, TeamType } from "../Types";

export class Tile {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  possibleMoves?: Position[];
  constructor(
    position: Position,
    type: PieceType,
    team: TeamType,
    possibleMoves: Position[] = []
  ) {
    this.image = `assets/images/${type}-${team}.png`;
    this.position = position;
    this.type = type;
    this.team = team;
    this.possibleMoves = possibleMoves;
  }

  get isPawn(): boolean {
    return this.type === PieceType.PAWN;
  }

  get isRook(): boolean {
    return this.type === PieceType.ROOK;
  }

  get isKnight(): boolean {
    return this.type === PieceType.KNIGHT;
  }

  get isBishop(): boolean {
    return this.type === PieceType.BISHOP;
  }

  get isQueen(): boolean {
    return this.type === PieceType.QUEEN;
  }

  get isKing(): boolean {
    return this.type === PieceType.KING;
  }

  samePiecePosition(otherPiece: Tile): boolean {
    return this.position.samePosition(otherPiece.position);
  }

  samePosition(otherPosition: Position): boolean {
    return this.position.samePosition(otherPosition);
  }

  clone(): Tile {
    return new Tile(
      this.position.clone(),
      this.type,
      this.team,
      this.possibleMoves?.map((m) => m.clone())
    );
  }
}