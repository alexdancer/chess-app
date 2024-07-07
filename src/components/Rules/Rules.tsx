import { useEffect, useRef, useState } from "react";
import {
  PieceType,
  Position,
  TeamType,
  initialBoardState,
  samePosition,
} from "../../Constants";
import Board from "../Chessboard/Board";
import {
  bishopMove,
  getPossibleBishopMoves,
  getPossibleKingMoves,
  getPossibleKnightMoves,
  getPossiblePawnMoves,
  getPossibleQueenMoves,
  getPossibleRookMoves,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
} from "../../rules/pieceRules";
import { Tile } from "../../models/Tile";

export default function Rules() {
  const [pieces, setPieces] = useState<Tile[]>(initialBoardState);
  const [promotionPawn, setPromotionPawn] = useState<Tile>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePossibleMoves();
  })

  function updatePossibleMoves() {
    setPieces((currentPieces) => {
      return currentPieces.map((p) => {
        p.possibleMoves = getValidMoves(p, currentPieces);
        return p;
      });
    });
  }

  function playMove(playedPiece: Tile, destination: Position) : boolean {
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

    const pawnDirection = playedPiece.team === TeamType.WHITE ? 1 : -1;

    if (enPassantMove) {
      const updatedPieces = pieces.reduce((results, piece) => {
        if (samePosition(piece.position, playedPiece.position)) {
          piece.enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (!samePosition(piece.position, { x: destination.x, y: destination.y - pawnDirection })) {
          if (piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Tile[]);

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else if (validMove) {
      // updates piece position
      // and if a piece is attacked, remove it
      const updatedPieces = pieces.reduce((results, piece) => {
        // if piece is moving
        if (samePosition(piece.position, playedPiece.position)) {
          // special move
          piece.enPassant =
            Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === PieceType.PAWN;

          piece.position.x = destination.x;
          piece.position.y = destination.y;

          let promotionRow = piece.team === TeamType.WHITE ? 7 : 0;

          if (destination.y === promotionRow && piece.type === PieceType.PAWN) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(piece);
          }
          results.push(piece);
        } else if (!samePosition(piece.position, { x: destination.x, y: destination.y })) {
          if (piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Tile[]);

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else {
      return false;
    }
    return true;
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
        const piece = pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
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
        validMode = pawnMove(
          initialPosition,
          desiredPosition,
          team,
          pieces
        );
        break;
      case PieceType.KNIGHT:
        validMode = knightMove(
          initialPosition,
          desiredPosition,
          team,
          pieces
        );
        break;
      case PieceType.BISHOP:
        validMode = bishopMove(
          initialPosition,
          desiredPosition,
          team,
          pieces
        );
        break;
      case PieceType.ROOK:
        validMode = rookMove(
          initialPosition,
          desiredPosition,
          team,
          pieces
        );
        break;
      case PieceType.QUEEN:
        validMode = queenMove(
          initialPosition,
          desiredPosition,
          team,
          pieces
        );
        break;
      case PieceType.KING:
        validMode = kingMove(
          initialPosition,
          desiredPosition,
          team,
          pieces
        );
    }

    return validMode;
  }

  function getValidMoves(piece: Tile, boardState: Tile[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
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
    updatePossibleMoves();
    setPieces(updatedPieces)

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return (promotionPawn?.team === TeamType.WHITE) ? "white" : "black";
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
      <Board playMove={playMove} pieces={pieces} />
    </>
  );
}
