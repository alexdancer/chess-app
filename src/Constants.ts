import { Tile } from "./models/Tile";

export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const GRID_SIZE = 100;

// gets the position fo the piece and checks if piece is on top of another piecesd
export function samePosition(p1: Position, p2: Position) {
  return p1.x === p2.x && p1.y === p2.y;
}

export interface Position {
  x: number;
  y: number
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
}

export enum TeamType {
  BLACK,
  WHITE,
}

export const initialBoardState: Tile[] = [
  // BLACK PIECES
  new Tile(
    `assets/images/rook-black.png`,
    { x: 0, y: 7 },
    PieceType.ROOK,
    TeamType.BLACK
  ),

  new Tile(
    `assets/images/knight-black.png`,
    { x: 1, y: 7 },
    PieceType.KNIGHT,
    TeamType.BLACK
  ),

  new Tile(
    `assets/images/bishop-black.png`,
    { x: 2, y: 7 },
    PieceType.BISHOP,
    TeamType.BLACK
  ),

  new Tile(
    `assets/images/queen-black.png`,
    { x: 3, y: 7 },
    PieceType.QUEEN,
    TeamType.BLACK
  ),

  new Tile(
    `assets/images/king-black.png`,
    { x: 4, y: 7 },
    PieceType.KING,
    TeamType.BLACK
  ),

  new Tile(
    `assets/images/bishop-black.png`,
    { x: 5, y: 7 },
    PieceType.BISHOP,
    TeamType.BLACK
  ),

  new Tile(
    `assets/images/knight-black.png`,
    { x: 6, y: 7 },
    PieceType.KNIGHT,
    TeamType.BLACK
  ),

  new Tile(
    `assets/images/rook-black.png`,
    { x: 7, y: 7 },
    PieceType.ROOK,
    TeamType.BLACK
  ),

  new Tile(
    `assets/images/pawn-black.png`,
    { x: 0, y: 6 },
    PieceType.PAWN,
    TeamType.BLACK
  ),
  new Tile(
    `assets/images/pawn-black.png`,
    { x: 1, y: 6 },
    PieceType.PAWN,
    TeamType.BLACK
  ),
  new Tile(
    `assets/images/pawn-black.png`,
    { x: 2, y: 6 },
    PieceType.PAWN,
    TeamType.BLACK
  ),
  new Tile(
    `assets/images/pawn-black.png`,
    { x: 3, y: 6 },
    PieceType.PAWN,
    TeamType.BLACK
  ),
  new Tile(
    `assets/images/pawn-black.png`,
    { x: 4, y: 6 },
    PieceType.PAWN,
    TeamType.BLACK
  ),
  new Tile(
    `assets/images/pawn-black.png`,
    { x: 5, y: 6 },
    PieceType.PAWN,
    TeamType.BLACK
  ),
  new Tile(
    `assets/images/pawn-black.png`,
    { x: 6, y: 6 },
    PieceType.PAWN,
    TeamType.BLACK
  ),
  new Tile(
    `assets/images/pawn-black.png`,
    { x: 7, y: 6 },
    PieceType.PAWN,
    TeamType.BLACK
  ),

  // WHITE PIECES

  new Tile(
    `assets/images/rook-white.png`,
    { x: 0, y: 0 },
    PieceType.ROOK,
    TeamType.WHITE
  ),

  new Tile(
    `assets/images/knight-white.png`,
    { x: 1, y: 0 },
    PieceType.KNIGHT,
    TeamType.WHITE
  ),

  new Tile(
    `assets/images/bishop-white.png`,
    { x: 2, y: 0 },
    PieceType.BISHOP,
    TeamType.WHITE
  ),

  new Tile(
    `assets/images/queen-white.png`,
    { x: 3, y: 0 },
    PieceType.QUEEN,
    TeamType.WHITE
  ),

  new Tile(
    `assets/images/king-white.png`,
    { x: 4, y: 0 },
    PieceType.KING,
    TeamType.WHITE
  ),

  new Tile(
    `assets/images/bishop-white.png`,
    { x: 5, y: 0 },
    PieceType.BISHOP,
    TeamType.WHITE
  ),

  new Tile(
    `assets/images/knight-white.png`,
    { x: 6, y: 0 },
    PieceType.KNIGHT,
    TeamType.WHITE
  ),

  new Tile(
    `assets/images/rook-white.png`,
    { x: 7, y: 0 },
    PieceType.ROOK,
    TeamType.WHITE
  ),

  new Tile(
    `assets/images/pawn-white.png`,
    { x: 0, y: 1 },
    PieceType.PAWN,
    TeamType.WHITE
  ),
  new Tile(
    `assets/images/pawn-white.png`,
    { x: 1, y: 1 },
    PieceType.PAWN,
    TeamType.WHITE
  ),
  new Tile(
    `assets/images/pawn-white.png`,
    { x: 2, y: 1 },
    PieceType.PAWN,
    TeamType.WHITE
  ),
  new Tile(
    `assets/images/pawn-white.png`,
    { x: 3, y: 1 },
    PieceType.PAWN,
    TeamType.WHITE
  ),
  new Tile(
    `assets/images/pawn-white.png`,
    { x: 4, y: 1 },
    PieceType.PAWN,
    TeamType.WHITE
  ),
  new Tile(
    `assets/images/pawn-white.png`,
    { x: 5, y: 1 },
    PieceType.PAWN,
    TeamType.WHITE
  ),
  new Tile(
    `assets/images/pawn-white.png`,
    { x: 6, y: 1 },
    PieceType.PAWN,
    TeamType.WHITE
  ),
  new Tile(
    `assets/images/pawn-white.png`,
    { x: 7, y: 1 },
    PieceType.PAWN,
    TeamType.WHITE
  ),
];
