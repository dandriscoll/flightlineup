import { parseCsvRoster, cleanupShips, generateCsv, hasEmptyRow, addEmptyRow } from '../src/components/shared/rosterTools';
import { Ship, FormattedShip } from '../types';

describe('rosterTools', () => {
    describe('cleanupShips', () => {
        it('should nullify invalid row values', () => {
            const ships: Ship[] = [
                { name: 'Test', tail: 'N123', type: null, qualification: null, squadron: null, row: -1, col: 0, seat: null },
                { name: 'Test2', tail: 'N456', type: null, qualification: null, squadron: null, row: 100, col: 0, seat: null },
                { name: 'Test3', tail: 'N789', type: null, qualification: null, squadron: null, row: NaN, col: 0, seat: null }
            ];

            const cleaned = cleanupShips(ships);

            expect(cleaned[0].row).toBeNull();
            expect(cleaned[0].col).toBeNull();
            expect(cleaned[1].row).toBeNull();
            expect(cleaned[1].col).toBeNull();
            expect(cleaned[2].row).toBeNull();
            expect(cleaned[2].col).toBeNull();
        });

        it('should nullify invalid col values', () => {
            const ships: Ship[] = [
                { name: 'Test', tail: 'N123', type: null, qualification: null, squadron: null, row: 0, col: -1, seat: null },
                { name: 'Test2', tail: 'N456', type: null, qualification: null, squadron: null, row: 0, col: 10, seat: null }
            ];

            const cleaned = cleanupShips(ships);

            expect(cleaned[0].row).toBeNull();
            expect(cleaned[0].col).toBeNull();
            expect(cleaned[1].row).toBeNull();
            expect(cleaned[1].col).toBeNull();
        });

        it('should nullify invalid seat values', () => {
            const ships: Ship[] = [
                { name: 'Test', tail: 'N123', type: null, qualification: null, squadron: null, row: 0, col: 0, seat: -1 },
                { name: 'Test2', tail: 'N456', type: null, qualification: null, squadron: null, row: 0, col: 0, seat: 10 },
                { name: 'Test3', tail: 'N789', type: null, qualification: null, squadron: null, row: 0, col: 0, seat: NaN }
            ];

            const cleaned = cleanupShips(ships);

            expect(cleaned[0].seat).toBeNull();
            expect(cleaned[1].seat).toBeNull();
            expect(cleaned[2].seat).toBeNull();
        });

        it('should keep valid position values', () => {
            const ships: Ship[] = [
                { name: 'Test', tail: 'N123', type: null, qualification: null, squadron: null, row: 0, col: 0, seat: null },
                { name: 'Test2', tail: 'N456', type: null, qualification: null, squadron: null, row: 2, col: 3, seat: 1 }
            ];

            const cleaned = cleanupShips(ships);

            expect(cleaned[0].row).toBe(0);
            expect(cleaned[0].col).toBe(0);
            expect(cleaned[1].row).toBe(2);
            expect(cleaned[1].col).toBe(3);
            expect(cleaned[1].seat).toBe(1);
        });
    });

    describe('parseCsvRoster', () => {
        it('should parse simple CSV with header', () => {
            const csv = `Name,Tail,Type,Qualification,Squadron,Row,Col,Seat
John Doe,N12345,Mooney M20J,Wing,Texas,0,0,
Jane Smith,N67890,Cirrus SR22,Lead,Rocky Mountain,0,1,`;

            const ships = parseCsvRoster(csv);

            expect(ships).toHaveLength(2);
            expect(ships[0].name).toBe('John Doe');
            expect(ships[0].tail).toBe('N12345');
            expect(ships[0].type).toBe('Mooney M20J');
            expect(ships[0].qualification).toBe('Wing');
            expect(ships[0].squadron).toBe('Texas');
            expect(ships[0].row).toBe(0);
            expect(ships[0].col).toBe(0);
        });

        it('should handle quoted values with commas', () => {
            const csv = `Name,Tail,Type,Qualification,Squadron,Row,Col,Seat
"Doe, John",N12345,Mooney M20J,Wing,Texas,0,0,`;

            const ships = parseCsvRoster(csv);

            expect(ships[0].name).toBe('Doe, John');
        });

        it('should handle escaped quotes', () => {
            const csv = `Name,Tail,Type,Qualification,Squadron,Row,Col,Seat
"John ""JD"" Doe",N12345,Mooney M20J,Wing,Texas,0,0,`;

            const ships = parseCsvRoster(csv);

            expect(ships[0].name).toBe('John "JD" Doe');
        });

        it('should return empty array for empty CSV', () => {
            const ships = parseCsvRoster('');
            expect(ships).toEqual([]);
        });

        it('should handle Marvel export format', () => {
            const csv = `Full Name,Tail #,AircraftModel,Certification
John Doe,N12345,Mooney M20J,1`;

            const ships = parseCsvRoster(csv);

            expect(ships).toHaveLength(1);
            expect(ships[0].name).toBe('John Doe');
            expect(ships[0].tail).toBe('N12345');
            expect(ships[0].type).toBe('Mooney M20J');
            expect(ships[0].qualification).toBe('Wing'); // '1' maps to 'Wing'
        });

        it('should parse Marvel qualification codes', () => {
            const testCases = [
                { code: '0', expected: 'New' },
                { code: '1', expected: 'Wing' },
                { code: '2', expected: 'Lead' },
                { code: '3', expected: 'Lead' },
                { code: '9', expected: 'Safety Observer' }
            ];

            testCases.forEach(({ code, expected }) => {
                const csv = `Full Name,Tail #,AircraftModel,Certification
Test,N123,Type,${code}`;
                const ships = parseCsvRoster(csv);
                expect(ships[0].qualification).toBe(expected);
            });
        });
    });

    describe('generateCsv', () => {
        it('should generate CSV with headers', () => {
            const ships: Ship[] = [
                { name: 'John Doe', tail: 'N12345', type: 'Mooney', qualification: 'Wing', squadron: 'Texas', row: 0, col: 0, seat: null }
            ];

            const csv = generateCsv(ships);
            const lines = csv.split('\n');

            expect(lines[0]).toBe('Name,Tail,Type,Qualification,Squadron,Row,Col,Seat');
            expect(lines[1]).toBe('John Doe,N12345,Mooney,Wing,Texas,0,0,');
        });

        it('should escape values with commas', () => {
            const ships: Ship[] = [
                { name: 'Doe, John', tail: 'N12345', type: 'Mooney', qualification: 'Wing', squadron: 'Texas', row: 0, col: 0, seat: null }
            ];

            const csv = generateCsv(ships);
            expect(csv).toContain('"Doe, John"');
        });

        it('should escape values with quotes', () => {
            const ships: Ship[] = [
                { name: 'John "JD" Doe', tail: 'N12345', type: 'Mooney', qualification: 'Wing', squadron: 'Texas', row: 0, col: 0, seat: null }
            ];

            const csv = generateCsv(ships);
            expect(csv).toContain('"John ""JD"" Doe"');
        });

        it('should filter out empty ships', () => {
            const ships: Ship[] = [
                { name: 'John Doe', tail: 'N12345', type: 'Mooney', qualification: 'Wing', squadron: 'Texas', row: 0, col: 0, seat: null },
                { name: null, tail: null, type: null, qualification: null, squadron: null, row: null, col: null, seat: null }
            ];

            const csv = generateCsv(ships);
            const lines = csv.split('\n');

            expect(lines).toHaveLength(2); // Header + 1 data row
        });

        it('should handle null values', () => {
            const ships: Ship[] = [
                { name: 'John Doe', tail: null, type: null, qualification: null, squadron: null, row: null, col: null, seat: null }
            ];

            const csv = generateCsv(ships);
            expect(csv).toContain('John Doe,,,,,,,');
        });
    });

    describe('hasEmptyRow', () => {
        it('should return false for empty array', () => {
            expect(hasEmptyRow([])).toBe(false);
        });

        it('should return true if last row is empty', () => {
            const ships: FormattedShip[] = [
                { row1: 'John', row2: 'N123', leftIcon: '', rightIcon: '', row: 0, col: 0, seat: null },
                { row1: '', row2: '', leftIcon: '', rightIcon: '', row: null, col: null, seat: null }
            ];

            expect(hasEmptyRow(ships)).toBe(true);
        });

        it('should return false if last row has data', () => {
            const ships: FormattedShip[] = [
                { row1: '', row2: '', leftIcon: '', rightIcon: '', row: null, col: null, seat: null },
                { row1: 'John', row2: 'N123', leftIcon: '', rightIcon: '', row: 0, col: 0, seat: null }
            ];

            expect(hasEmptyRow(ships)).toBe(false);
        });
    });

    describe('addEmptyRow', () => {
        it('should add an empty row to the array', () => {
            const ships: FormattedShip[] = [
                { row1: 'John', row2: 'N123', leftIcon: '', rightIcon: '', row: 0, col: 0, seat: null }
            ];

            const result = addEmptyRow(ships);

            expect(result).toHaveLength(2);
            expect(result[1].row1).toBe('');
            expect(result[1].row2).toBe('');
            expect(result[1].row).toBeNull();
            expect(result[1].col).toBeNull();
        });

        it('should not mutate original array', () => {
            const ships: FormattedShip[] = [
                { row1: 'John', row2: 'N123', leftIcon: '', rightIcon: '', row: 0, col: 0, seat: null }
            ];

            const result = addEmptyRow(ships);

            expect(ships).toHaveLength(1);
            expect(result).toHaveLength(2);
        });
    });

    describe('CSV round-trip', () => {
        it('should preserve data through export and import', () => {
            const originalShips: Ship[] = [
                { name: 'John Doe', tail: 'N12345', type: 'Mooney M20J', qualification: 'Wing', squadron: 'Texas', row: 0, col: 0, seat: null },
                { name: 'Jane Smith', tail: 'N67890', type: 'Cirrus SR22', qualification: 'Lead', squadron: 'Rocky Mountain', row: 1, col: 1, seat: null }
            ];

            const csv = generateCsv(originalShips);
            const parsedShips = parseCsvRoster(csv);

            expect(parsedShips).toHaveLength(2);
            expect(parsedShips[0].name).toBe(originalShips[0].name);
            expect(parsedShips[0].tail).toBe(originalShips[0].tail);
            expect(parsedShips[0].type).toBe(originalShips[0].type);
            expect(parsedShips[1].name).toBe(originalShips[1].name);
        });
    });
});
