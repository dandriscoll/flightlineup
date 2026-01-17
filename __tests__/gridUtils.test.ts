import { moveOrSwapCells } from '../src/components/shared/moveOrSwapCells';
import { moveOrSwapRows, swapAt, swapSetupRows } from '../src/components/shared/moveOrSwapRows';
import { FormattedShip, Setup, SetupDefaults, Grid } from '../types';

// Helper to create test ships
const createShip = (row: number | null, col: number | null, name: string): FormattedShip => ({
    row,
    col,
    seat: null,
    row1: name,
    row2: '',
    leftIcon: '',
    rightIcon: ''
});

describe('moveOrSwapCells', () => {
    it('should do nothing when from equals to', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Ship1'),
            createShip(1, 1, 'Ship2')
        ];
        const from: Grid = { row: 0, col: 0, seat: null };
        const to: Grid = { row: 0, col: 0, seat: null };

        const result = moveOrSwapCells(ships, from, to);

        expect(result).toBe(ships); // Same reference, no change
    });

    it('should do nothing when from cell has no ships', () => {
        const ships: FormattedShip[] = [
            createShip(1, 1, 'Ship1')
        ];
        const from: Grid = { row: 0, col: 0, seat: null };
        const to: Grid = { row: 2, col: 2, seat: null };

        const result = moveOrSwapCells(ships, from, to);

        expect(result).toBe(ships); // Same reference, no change
    });

    it('should move ship from one cell to empty cell', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Ship1'),
            createShip(1, 1, 'Ship2')
        ];
        const from: Grid = { row: 0, col: 0, seat: null };
        const to: Grid = { row: 2, col: 2, seat: null };

        const result = moveOrSwapCells(ships, from, to);

        expect(result[0].row).toBe(2);
        expect(result[0].col).toBe(2);
        expect(result[0].row1).toBe('Ship1');
        // Ship2 unchanged
        expect(result[1].row).toBe(1);
        expect(result[1].col).toBe(1);
    });

    it('should swap ships between two occupied cells', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Ship1'),
            createShip(1, 1, 'Ship2')
        ];
        const from: Grid = { row: 0, col: 0, seat: null };
        const to: Grid = { row: 1, col: 1, seat: null };

        const result = moveOrSwapCells(ships, from, to);

        // Ship1 should now be at (1,1)
        const ship1 = result.find(s => s.row1 === 'Ship1');
        expect(ship1?.row).toBe(1);
        expect(ship1?.col).toBe(1);

        // Ship2 should now be at (0,0)
        const ship2 = result.find(s => s.row1 === 'Ship2');
        expect(ship2?.row).toBe(0);
        expect(ship2?.col).toBe(0);
    });

    it('should move multiple ships in the same cell', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Ship1'),
            createShip(0, 0, 'Ship1-Occupant'),
            createShip(1, 1, 'Ship2')
        ];
        const from: Grid = { row: 0, col: 0, seat: null };
        const to: Grid = { row: 2, col: 2, seat: null };

        const result = moveOrSwapCells(ships, from, to);

        // Both ships from cell (0,0) should move
        const movedShips = result.filter(s => s.row === 2 && s.col === 2);
        expect(movedShips).toHaveLength(2);
        expect(movedShips.map(s => s.row1)).toContain('Ship1');
        expect(movedShips.map(s => s.row1)).toContain('Ship1-Occupant');
    });

    it('should not mutate original ships array', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Ship1')
        ];
        const originalRow = ships[0].row;
        const from: Grid = { row: 0, col: 0, seat: null };
        const to: Grid = { row: 2, col: 2, seat: null };

        moveOrSwapCells(ships, from, to);

        expect(ships[0].row).toBe(originalRow);
    });
});

describe('moveOrSwapRows', () => {
    it('should do nothing when fromRow equals toRow', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Ship1'),
            createShip(1, 0, 'Ship2')
        ];

        const result = moveOrSwapRows(ships, 0, 0);

        expect(result).toBe(ships); // Same reference
    });

    it('should return ships as-is when not an array', () => {
        const result = moveOrSwapRows(null as any, 0, 1);
        expect(result).toBeNull();
    });

    it('should do nothing when both rows are empty', () => {
        const ships: FormattedShip[] = [
            createShip(2, 0, 'Ship1')
        ];

        const result = moveOrSwapRows(ships, 0, 1);

        expect(result).toBe(ships); // Same reference
    });

    it('should move all ships in a row to a new row', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Ship1'),
            createShip(0, 1, 'Ship2'),
            createShip(0, 2, 'Ship3'),
            createShip(2, 0, 'OtherShip')
        ];

        const result = moveOrSwapRows(ships, 0, 1);

        // All ships from row 0 should be in row 1
        const movedShips = result.filter(s => s.row === 1);
        expect(movedShips).toHaveLength(3);

        // OtherShip unchanged
        const otherShip = result.find(s => s.row1 === 'OtherShip');
        expect(otherShip?.row).toBe(2);
    });

    it('should swap ships between two rows', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Row0Ship'),
            createShip(1, 0, 'Row1Ship')
        ];

        const result = moveOrSwapRows(ships, 0, 1);

        const row0Ship = result.find(s => s.row1 === 'Row0Ship');
        expect(row0Ship?.row).toBe(1);

        const row1Ship = result.find(s => s.row1 === 'Row1Ship');
        expect(row1Ship?.row).toBe(0);
    });

    it('should preserve column positions when swapping rows', () => {
        const ships: FormattedShip[] = [
            createShip(0, 0, 'Ship1'),
            createShip(0, 2, 'Ship2'),
            createShip(1, 1, 'Ship3')
        ];

        const result = moveOrSwapRows(ships, 0, 1);

        const ship1 = result.find(s => s.row1 === 'Ship1');
        expect(ship1?.row).toBe(1);
        expect(ship1?.col).toBe(0);

        const ship2 = result.find(s => s.row1 === 'Ship2');
        expect(ship2?.row).toBe(1);
        expect(ship2?.col).toBe(2);

        const ship3 = result.find(s => s.row1 === 'Ship3');
        expect(ship3?.row).toBe(0);
        expect(ship3?.col).toBe(1);
    });
});

describe('swapAt', () => {
    it('should do nothing when indices are equal', () => {
        const arr = ['a', 'b', 'c'];
        const result = swapAt(arr, 1, 1);
        expect(result).toBe(arr); // Same reference
    });

    it('should swap two elements', () => {
        const arr = ['a', 'b', 'c'];
        const result = swapAt(arr, 0, 2);
        expect(result).toEqual(['c', 'b', 'a']);
    });

    it('should not mutate original array', () => {
        const arr = ['a', 'b', 'c'];
        swapAt(arr, 0, 2);
        expect(arr).toEqual(['a', 'b', 'c']);
    });

    it('should work with numbers', () => {
        const arr = [1, 2, 3, 4, 5];
        const result = swapAt(arr, 1, 3);
        expect(result).toEqual([1, 4, 3, 2, 5]);
    });
});

describe('swapSetupRows', () => {
    it('should swap row labels', () => {
        const setup: Setup = {
            ...SetupDefaults,
            rowLabels: ['Red Flight', 'Blue Flight', 'Green Flight'],
            rowLabelColors: ['red', 'blue', 'green']
        };

        const result = swapSetupRows(setup, 0, 2);

        expect(result.rowLabels).toEqual(['Green Flight', 'Blue Flight', 'Red Flight']);
    });

    it('should swap row label colors', () => {
        const setup: Setup = {
            ...SetupDefaults,
            rowLabels: ['Red Flight', 'Blue Flight', 'Green Flight'],
            rowLabelColors: ['red', 'blue', 'green']
        };

        const result = swapSetupRows(setup, 0, 2);

        expect(result.rowLabelColors).toEqual(['green', 'blue', 'red']);
    });

    it('should not mutate original setup', () => {
        const setup: Setup = {
            ...SetupDefaults,
            rowLabels: ['Red Flight', 'Blue Flight'],
            rowLabelColors: ['red', 'blue']
        };

        swapSetupRows(setup, 0, 1);

        expect(setup.rowLabels).toEqual(['Red Flight', 'Blue Flight']);
        expect(setup.rowLabelColors).toEqual(['red', 'blue']);
    });

    it('should preserve other setup properties', () => {
        const setup: Setup = {
            ...SetupDefaults,
            row1: 'name',
            row2: 'tail',
            occupants: true,
            labels: true,
            rowLabels: ['A', 'B'],
            rowLabelColors: ['red', 'blue']
        };

        const result = swapSetupRows(setup, 0, 1);

        expect(result.row1).toBe('name');
        expect(result.row2).toBe('tail');
        expect(result.occupants).toBe(true);
        expect(result.labels).toBe(true);
    });
});
