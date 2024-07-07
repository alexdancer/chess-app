import { useRef, useState } from "react";
import Piece from "../Piece/Piece";
import "./Board.css";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, samePosition } from "../../Constants"
import { Tile } from "../../models/Tile";
import { Position } from "../../models/Position";

interface Props {
  playMove: (piece: Tile, position: Position) => boolean;
  pieces: Tile[];
}

export default function Board({ playMove, pieces} : Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const chessboardRef = useRef<HTMLDivElement>(null);
  

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition(new Position(grabX, grabY));

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
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

      activePiece.style.left = x < minX ? `${minX}px` : `${x}px`;
      activePiece.style.top = y < minY ? `${minY}px` : `${y}px`;
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );

      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );

      if (currentPiece) {
        var success = playMove(currentPiece, new Position(x, y)); 
        
        if(!success) {
          // Resets the piece position if wrong move
          activePiece.style.position = "relative"
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      // updates the piece position
      setActivePiece(null);
    }
  }
  
  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        samePosition(p.position, new Position(i, j))
      );
      let image = piece ? piece.image : undefined;

      let currentPiece = activePiece != null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
      let highlight = currentPiece?.possibleMoves
        ? currentPiece.possibleMoves.some((p) =>
            samePosition(p, new Position(i, j))
          )
        : false;

      board.push(<Piece key={`${j},${i}`} image={image} number={number} highlight={highlight} />);
    }
  }

  return (
    <>
      
      <div
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
      >
        {board}
      </div>
    </>
  );
}
