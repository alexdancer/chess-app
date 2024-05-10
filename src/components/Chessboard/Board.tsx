import { useEffect, useRef, useState } from "react";
import Piece from "../Piece/Piece";
import "./Board.css";
import { platform } from "os";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Tile {
  image: string;
  x: number;
  y: number;
}

const initialBoardState: Tile[] = [];

    // populates the board with pieces
for (let p = 0; p < 2; p++) {
  const type = p === 0 ? "black" : "white";
      const y = p === 0 ? 7 : 0;

  initialBoardState.push({ image: `assets/images/rook-${type}.png`, x: 0, y });
  initialBoardState.push({ image: `assets/images/rook-${type}.png`, x: 7, y });
  initialBoardState.push({ image: `assets/images/knight-${type}.png`, x: 1, y });
  initialBoardState.push({ image: `assets/images/knight-${type}.png`, x: 6, y });
  initialBoardState.push({ image: `assets/images/bishop-${type}.png`, x: 2, y });
  initialBoardState.push({ image: `assets/images/bishop-${type}.png`, x: 5, y });
  initialBoardState.push({ image: `assets/images/queen-${type}.png`, x: 3, y });
  initialBoardState.push({ image: `assets/images/king-${type}.png`, x: 4, y });
}
for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: "assets/images/pawn-black.png", x: i, y: 6 });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: "assets/images/pawn-white.png", x: i, y: 1 });
}

export default function Board() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Tile[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
      setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));

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
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      setPieces(value => {
        const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
        const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

        const pieces = value.map(p => {
          if(p.x === gridX && p.y === gridY) {
            p.x = x;
            p.y = y;
          }
          return p;
        })
        return pieces;
      })
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
