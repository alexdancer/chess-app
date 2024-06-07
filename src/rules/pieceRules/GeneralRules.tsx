import { Position, TeamType, Tile, samePosition } from "../../Constants";

export const tileIsOccupied = (position: Position, boardState: Tile[]): boolean => {
  const piece = boardState.find((p) => samePosition(p.position, position));

  if (piece) {
    return true;
  } else {
    return false;
  }
}

export const tileIsOccupiedByOpponent = (
  position: Position,
  boardState: Tile[],
  team: TeamType
): boolean => {
  const piece = boardState.find(
    (p) => samePosition(p.position, position) && p.team !== team
  );

  if (piece) {
    return true;
  } else {
    return false;
  }
}

export const tileIsEmptyOrOccupiedByOpponent = (
  position: Position,
  boardState: Tile[],
  team: TeamType
): boolean => {
  return (
    !tileIsOccupied(position, boardState) ||
    tileIsOccupiedByOpponent(position, boardState, team)
  );
}