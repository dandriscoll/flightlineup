import { Setup, FormattedShip } from "../../../types";

export const moveOrSwapRows = (ships: FormattedShip[], fromRow: number, toRow: number): FormattedShip[] => {
    if (fromRow === toRow) return ships;
    if (!Array.isArray(ships)) return ships;
    const inFrom = (s: FormattedShip) => s.row === fromRow;
    const inTo = (s: FormattedShip) => s.row === toRow;

    // If both rows empty, nothing to do
    if (!ships.some(inFrom) && !ships.some(inTo)) return ships;

    return ships.map(s => {
        if (inFrom(s)) return { ...s, row: toRow };
        if (inTo(s)) return { ...s, row: fromRow };
        return s;
    });
};

// Small helper to swap two items in an array
export const swapAt = <T,>(arr: T[], i: number, j: number): T[] => {
    if (i === j) return arr;
    const copy = arr.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
};

// Apply row swap to Setup labels/colors
export const swapSetupRows = (setup: Setup, fromRow: number, toRow: number): Setup => ({
    ...setup,
    rowLabels: swapAt(setup.rowLabels, fromRow, toRow),
    rowLabelColors: swapAt(setup.rowLabelColors, fromRow, toRow),
});
