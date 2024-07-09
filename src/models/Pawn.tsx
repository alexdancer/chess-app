import { PieceType, TeamType } from '../Types';
import { Position } from './Position';
import { Tile } from './Tile'

export class Pawn extends Tile {
  enPassant?: boolean;
  constructor(position: Position, team: TeamType) {
    super(position, PieceType.PAWN, team)
    console.log(this.image)
  }
}