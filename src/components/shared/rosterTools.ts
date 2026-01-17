import { FormattedShip, Ship } from '../../../types';

const parseCsvRow = (row: string): string[] => {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
            if (insideQuotes && row[i + 1] === '"') {
                currentValue += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    values.push(currentValue.trim());
    return values;
};

const parseCsvRoster = (csv: string): Ship[] => {
    const rows = csv.split('\n');

    if (rows.length === 0) {
        return [];
    }

    // Old format - don't touch
    if (rows[0].startsWith('Row 1,') || rows[0].startsWith('"Row 1')) {
        rows.shift(); // Remove header row

        const ships = rows.map(row => {
            const columns = parseCsvRow(row);
            return {
                name: columns[0],
                tail: columns[1],
                type: null,
                qualification: null,
                squadron: null,
                row: columns.length >= 5 ? parseInt(columns[4]) : null,
                col: columns.length >= 6 ? parseInt(columns[5]) : null,
                seat: null
            };
        });

        return cleanupShips(ships);
    } else {
        const headerRow = parseCsvRow(rows[0]);
        const headerMap = parseHeader(headerRow);
        if (Object.values(headerMap).every(index => index === -1)) {
            return [];
        }

        const ships = rows.slice(1).map(row => {
            const columns = parseCsvRow(row);

            var qualificationText = headerMap.qualification !== -1 ? columns[headerMap.qualification] : null;

            if (headerRow[0] == 'Full Name') {
                // Parse Marvel quals
                qualificationText = parseQualificationText(qualificationText);
            }

            return {
                name: headerMap.name !== -1 ? columns[headerMap.name] : null,
                tail: headerMap.tail !== -1 ? columns[headerMap.tail] : null,
                type: headerMap.type !== -1 ? columns[headerMap.type] : null,
                qualification: qualificationText,
                squadron: headerMap.squadron !== -1 ? columns[headerMap.squadron] : null,
                row: headerMap.row !== -1 ? parseInt(columns[headerMap.row]) : null,
                col: headerMap.col !== -1 ? parseInt(columns[headerMap.col]) : null,
                seat: headerMap.seat !== -1 ? parseInt(columns[headerMap.seat]) : null
            };
        });

        return cleanupShips(ships);
    }
};

const parseHeader = (row: string[]): any => {
    row = row.map(element => element.trim().toLowerCase());

    if (row.indexOf('name') != -1) {
        return {
            name: row.indexOf('name'),
            tail: row.indexOf('tail'),
            type: row.indexOf('type'),
            qualification: row.indexOf('qualification'),
            squadron: row.indexOf('squadron'),
            row: row.indexOf('row'),
            col: row.indexOf('col'),
            seat: row.indexOf('seat')
        };
    } else if (row.indexOf('full name') != -1) {
        return {
            name: row.indexOf('full name'),
            tail: row.indexOf('tail #'),
            type: row.indexOf('aircraftmodel'),
            qualification: row.indexOf('certification'),
            squadron: -1,
            row: -1,
            col: -1,
            seat: -1
        };
    }

    // Return default object with all -1 values if header format not recognized
    return {
        name: -1,
        tail: -1,
        type: -1,
        qualification: -1,
        squadron: -1,
        row: -1,
        col: -1,
        seat: -1
    };
};

const parseQualificationText = (text: string | null): string | null => {
    if (!text) {
        return text;
    }

    switch (text) {
        case '0': return 'New';
        case '1': return 'Wing';
        case '2': return 'Lead';
        case '3': return 'Lead';
        case '9': return 'Safety Observer';
    }

    return text;
};

const cleanupShips = (ships: Ship[]): Ship[] => {
    ships.forEach((ship) => {
        if (ship.row === undefined
            || Number.isNaN(ship.row)
            || (ship.row && ship.row < 0)
            || (ship.row && ship.row > 50)
            || ship.col === undefined
            || Number.isNaN(ship.col)
            || (ship.col && ship.col < 0)
            || (ship.col && ship.col > 5)
        ) {
            ship.row = ship.col = null;
        }
        if (ship.seat === undefined
            || Number.isNaN(ship.seat)
            || (ship.seat && ship.seat < 0)
            || (ship.seat && ship.seat > 4)
        ) {
            ship.seat = null;
        }
    });

    return ships;
};

const generateCsv = (ships: any[]): string => {
    const csv =
        `Name,Tail,Type,Qualification,Squadron,Row,Col,Seat\n` +
        ships
            .filter(ship => Object.values(ship).some(value => value != '' && value != null && value != undefined))
            .map(ship => {
                return [
                    ship.name,
                    ship.tail,
                    ship.type,
                    ship.qualification,
                    ship.squadron,
                    ship.row,
                    ship.col,
                    ship.seat
                ].map(value => {
                    if (value === null || value === undefined) return '';
                    const str = String(value);
                    return str.includes(',') || str.includes('"')
                        ? `"${str.replace(/"/g, '""')}"`
                        : str;
                }).join(',');
            })
            .join('\n');

    return csv;
};

const hasEmptyRow = (ships: FormattedShip[]): boolean => {
    if (ships.length === 0) {
        return false;
    }

    return !Object.values(ships[ships.length - 1]).some(value => value !== '' && value !== null && value !== undefined);
};

const addEmptyRow = (ships: FormattedShip[]): FormattedShip[] => {
    return [...ships, { row1: '', row2: '', leftIcon: '', rightIcon: '', row: null, col: null, seat: null }];
};

export { parseCsvRoster, cleanupShips, generateCsv, hasEmptyRow, addEmptyRow };
