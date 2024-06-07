import { useRef, useState } from "react";
import Piece from "../Piece/Piece";
import "./Board.css";
import Rules from "../../rules/Rules";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, Tile, PieceType, TeamType, initialBoardState, Position, samePosition } from "../../Constants"

export default function Board() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [promotionPawn, setPromotionPawn] = useState<Tile>();
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Tile[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const rules = new Rules();

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition({ x: grabX, y: grabY });

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
        const validMove = rules.isValidMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const isEnPassantMove = rules.isEnPassantMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const pawnDirection = currentPiece.team === TeamType.WHITE ? 1 : -1;

        if (isEnPassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (
              !samePosition(piece.position, { x, y: y - pawnDirection })
            ) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Tile[]);

          setPieces(updatedPieces);
        } else if (validMove) {
          // updates piece position
          // and if a piece is attacked, remove it
          const updatedPieces = pieces.reduce((results, piece) => {
            // if piece is moving
            if (samePosition(piece.position, grabPosition)) {
              // special move
              piece.enPassant =
                Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.PAWN;

              piece.position.x = x;
              piece.position.y = y;

              let promotionRow = piece.team === TeamType.WHITE ? 7 : 0;

              if (y === promotionRow && piece.type === PieceType.PAWN) {
                modalRef.current?.classList.remove("hidden");
                setPromotionPawn(piece);
              }
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Tile[]);

          setPieces(updatedPieces);
        } else {
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      // updates the piece position
      setActivePiece(null);
    }
  }

  function promotePawn(pieceType: PieceType) {
    if(promotionPawn === undefined) {
      return;
    }

    const updatedPieces = pieces.reduce((results, piece) => {
      if(samePosition(piece.position, promotionPawn.position)) {
        piece.type = pieceType
        const teamType = (piece.team === TeamType.WHITE) ? "white" : "black";
        let image = "";
        switch(pieceType) {
          case PieceType.ROOK : {
            image = 'rook'
            break;
          }
          case PieceType.BISHOP : {
            image = 'bishop'
            break;
          }
          case PieceType.KNIGHT : {
            image = 'knight'
            break;
          }
          case PieceType.QUEEN : {
            image = 'queen'
            break;
          }
        }
        piece.image = `assets/images/${image}-${teamType}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Tile[])

    setPieces(updatedPieces)

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return (promotionPawn?.team === TeamType.WHITE) ? "white" : "black";
  }

  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        samePosition(p.position, { x: i, y: j })
      );
      let image = piece ? piece.image : undefined;

      board.push(<Piece key={`${j},${i}`} image={image} number={number} />);
    }
  }

  return (
    <>
      <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
        <div className="modal-body">
          <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook-${promotionTeamType()}.png`} alt='' />
          <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop-${promotionTeamType()}.png`} alt='' />
          <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight-${promotionTeamType()}.png`} alt='' />
          <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen-${promotionTeamType()}.png`} alt='' />
        </div>
      </div>
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
