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
    updatePossibleMoves();
  });

  function updatePossibleMoves() {
    board.calculateAllMoves();
  }

  function playMove(playedPiece: Tile, destination: Position): boolean {
    let playedMoveIsValid = false;

    const validMove = isValidMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    // playMove modifies the board
    setBoard((previousBoard) => {
      // playing the move
      playedMoveIsValid = board.playMove(enPassantMove, validMove, playedPiece, destination);
      return board.clone();
    });

    // Promoting pawn
    let promotionRow = playedPiece.team === TeamType.WHITE ? 7 : 0;

    if (destination.y === promotionRow && playedPiece.isPawn) {
      modalRef.current?.classList.remove("hidden");
      setPromotionPawn(playedPiece);
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

    board.pieces = board.pieces.reduce((results, piece) => {
      if (piece.samePiecePosition(promotionPawn)) {
        piece.type = pieceType;
        const teamType = piece.team === TeamType.WHITE ? "white" : "black";
        let image = "";
        switch (pieceType) {
          case PieceType.ROOK: {
            image = "rook";
            break;
          }
          case PieceType.BISHOP: {
            image = "bishop";
            break;
          }
          case PieceType.KNIGHT: {
            image = "knight";
            break;
          }
          case PieceType.QUEEN: {
            image = "queen";
            break;
          }
        }
        piece.image = `assets/images/${image}-${teamType}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Tile[]);

    updatePossibleMoves();

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.WHITE ? "white" : "black";
  }

  return (
    <>
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
