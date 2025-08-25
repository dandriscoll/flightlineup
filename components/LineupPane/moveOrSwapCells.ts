import { FormattedShip, Grid } from "../../types";

// Move entire cell group from -> to. If to has ships, swap groups.
export const moveOrSwapCells = (
  ships: FormattedShip[],
  from: Grid,
  to: Grid
): FormattedShip[] => {
  if (from.row === to.row && from.col === to.col) return ships;

  const inFrom = (s: FormattedShip) => s.row === from.row && s.col === from.col;
  const inTo   = (s: FormattedShip) => s.row === to.row   && s.col === to.col;

  if (!ships.some(inFrom)) return ships; // nothing to move

  // Single-pass based on ORIGINAL membership
  return ships.map(s => {
    if (inFrom(s)) return { ...s, row: to.row, col: to.col };
    if (inTo(s))   return { ...s, row: from.row, col: from.col };
    return s;
  });
};
