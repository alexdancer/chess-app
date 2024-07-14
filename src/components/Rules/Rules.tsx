import { useEffect, useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import Board from "../Chessboard/Board";
import {
  bishopMove,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
} from "../../rules/pieceRules";
import { Tile } from "../../models/Tile";
import { Position } from "../../models/Position";
import { PieceType, TeamType } from "../../Types";
import { Pawn } from "../../models/Pawn";
import { Chessboard } from "../../models/Chessboard";

export default function Rules() {
  const [board, setBoard] = useState<Chessboard>(initialBoard);
  const [promotionPawn, setPromotionPawn] = useState<Tile>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    board.calculateAllMoves();
  });

  function playMove(playedPiece: Tile, destination: Position): boolean {
    // If the piece has no possible moves, return false
    if (playedPiece.possibleMoves === undefined) return false;

    if (playedPiece.team === TeamType.WHITE && board.numberOfTurns % 2 !== 1)
      return false; // only allow the white player to play
    if (playedPiece.team === TeamType.BLACK && board.numberOfTurns % 2 !== 0)
      return false; // only allow the black player to play


    let playedMoveIsValid = false;

    const validMove = playedPiece.possibleMoves?.some((m) =>
      m.samePosition(destination)
    );

    if (!validMove) return false;

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    // playMove modifies the board
    setBoard(() => {
      const clonedBoard = board.clone();
      clonedBoard.numberOfTurns += 1;
      // playing the move
      playedMoveIsValid = clonedBoard.playMove(
        enPassantMove,
        validMove,
        playedPiece,
        destination
      );
      
      return clonedBoard;
    });

    // Promoting pawn
    let promotionRow = playedPiece.team === TeamType.WHITE ? 7 : 0;

    if (destination.y === promotionRow && playedPiece.isPawn) {
      modalRef.current?.classList.remove("hidden");
      setPromotionPawn((previousPromotionPawn) => {
        const clonedPlayedPiece = playedPiece.clone();
        clonedPlayedPiece.position = destination.clone();
        return clonedPlayedPiece;
      });
    }

    return playedMoveIsValid;
  }

  // does the special enPassant move for pawn
  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = board.pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.isPawn &&
            (p as Pawn).enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  function isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    let validMode = false;
    switch (type) {
      case PieceType.PAWN:
        validMode = pawnMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.KNIGHT:
        validMode = knightMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.BISHOP:
        validMode = bishopMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.ROOK:
        validMode = rookMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.QUEEN:
        validMode = queenMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.KING:
        validMode = kingMove(initialPosition, desiredPosition, team, board.pieces);
    }

    return validMode;
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    setBoard((previousBoard) => {
      const clonedBoard = board.clone();
      clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(promotionPawn)) {
          results.push(new Tile(piece.position.clone(), pieceType, piece.team, true));
        } else {
          results.push(piece);
        }
        return results;
      }, [] as Tile[]);

      clonedBoard.calculateAllMoves();

      return clonedBoard;

    });

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.WHITE ? "white" : "black";
  }

  return (
    <>
    <p style={{color: 'white', fontSize: "24px"}}>{board.numberOfTurns}</p>
      <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            src={`/assets/images/rook-${promotionTeamType()}.png`}
            alt=""
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            src={`/assets/images/bishop-${promotionTeamType()}.png`}
            alt=""
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            src={`/assets/images/knight-${promotionTeamType()}.png`}
            alt=""
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            src={`/assets/images/queen-${promotionTeamType()}.png`}
            alt=""
          />
        </div>
      </div>
      <Board playMove={playMove} pieces={board.pieces} />
    </>
  );
}
