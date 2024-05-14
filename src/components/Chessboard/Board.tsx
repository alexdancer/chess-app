import { useRef, useState } from "react";
import Piece from "../Piece/Piece";
import "./Board.css";
import Rules from "../../rules/Rules";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export interface Tile {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
}

export enum TeamType {
  BLACK,
  WHITE,
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
}

const initialBoardState: Tile[] = [];

// populates the board with pieces
for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.BLACK : TeamType.WHITE;
  const type = teamType === TeamType.BLACK ? "black" : "white";
  const y = teamType === TeamType.BLACK ? 7 : 0;

  initialBoardState.push({
    image: `assets/images/rook-${type}.png`,
    x: 0,
    y,
    type: PieceType.ROOK,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/rook-${type}.png`,
    x: 7,
    y,
    type: PieceType.ROOK,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/knight-${type}.png`,
    x: 1,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/knight-${type}.png`,
    x: 6,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/bishop-${type}.png`,
    x: 2,
    y,
    type: PieceType.BISHOP,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/bishop-${type}.png`,
    x: 5,
    y,
    type: PieceType.BISHOP,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/queen-${type}.png`,
    x: 3,
    y,
    type: PieceType.QUEEN,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/king-${type}.png`,
    x: 4,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });
}
for (let i = 0; i < 8; i++) {
  initialBoardState.push({
    image: "assets/images/pawn-black.png",
    x: i,
    y: 6,
    type: PieceType.PAWN,
    team: TeamType.BLACK,
  });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({
    image: "assets/images/pawn-white.png",
    x: i,
    y: 1,
    type: PieceType.PAWN,
    team: TeamType.WHITE,
  });
}

export default function Board() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Tile[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const rules = new Rules();

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
      setGridY(
        Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))
      );

      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      // if x is smaller than min amount
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
        // if x is bgger than max amount
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
        // if x is inside of board
      } else {
        activePiece.style.left = `${x}px`;
      }

      // if y is smaller than min amount
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
        // if y is greater than max amount
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
        // if y is inside of board
      } else {
        activePiece.style.top = `${y}px`;
      }

      activePiece.style.left = (x < minX) ? `${minX}px` : `${x}px`;
      activePiece.style.top = (y < minY) ? `${minY}px` : `${y}px`;
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)
      );

      // updates the piece position
      setPieces((value) => {
        const pieces = value.map((p) => {
          if (p.x === gridX && p.y === gridY) {
            const validMove = rules.isValidMove(
              gridX,
              gridY,
              x,
              y,
              p.type,
              p.team,
              value
            );

            if (validMove) {
              p.x = x;
              p.y = y;
            } else {
              activePiece.style.position = "relative";
              activePiece.style.removeProperty("top");
              activePiece.style.removeProperty("left");
            }
          }
          return p;
        });
        return pieces;
      });
      setActivePiece(null);
    }
  }

  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;
      let image = undefined;

      pieces.forEach((p) => {
        if (p.x === i && p.y === j) {
          image = p.image;
        }
      });

      board.push(<Piece key={`${j},${i}`} image={image} number={number} />);
    }
  }

  return (
    <div
      onMouseMove={(e) => movePiece(e)}
      onMouseDown={(e) => grabPiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      id="chessboard"
      ref={chessboardRef}
    >
      {board}
    </div>
  );
}
