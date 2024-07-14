import { PieceType, TeamType } from '../Types';
import { Position } from './Position';
import { Tile } from './Tile'

export class Pawn extends Tile {
  enPassant?: boolean;
  constructor(
    position: Position,
    team: TeamType,
    hasMoved: boolean,
    enPassant?: boolean,
    possibleMoves: Position[] = []
  ) {
    super(position, PieceType.PAWN, team, hasMoved, possibleMoves);
    this.enPassant = enPassant;
  }

  clone(): Pawn {
    return new Pawn(
      this.position.clone(),
      this.team,
      this.hasMoved,
      this.enPassant,
      this.possibleMoves?.map((m) => m.clone())
    );
  }
}