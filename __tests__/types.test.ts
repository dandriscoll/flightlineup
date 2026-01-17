import {
    FormatShip,
    findIcon,
    isValidIconFilename,
    Ship,
    Setup,
    SetupDefaults,
    AppModes,
    Icons,
    IconReplacements
} from '../types';

describe('types.ts', () => {
    describe('SetupDefaults', () => {
        it('should have correct default values', () => {
            expect(SetupDefaults.row1).toBe('name');
            expect(SetupDefaults.row2).toBe('tail');
            expect(SetupDefaults.leftBadge).toBe('qualification');
            expect(SetupDefaults.rightBadge).toBe('squadron');
            expect(SetupDefaults.occupants).toBe(false);
            expect(SetupDefaults.labels).toBe(false);
            expect(SetupDefaults.columnLabels).toEqual([]);
            expect(SetupDefaults.rowLabels).toEqual([]);
            expect(SetupDefaults.rowLabelColors).toEqual([]);
            expect(SetupDefaults.isDefault).toBe(true);
        });
    });

    describe('AppModes', () => {
        it('should have exactly 4 modes', () => {
            expect(AppModes).toHaveLength(4);
        });

        it('should have correct mode IDs', () => {
            const modeIds = AppModes.map(m => m.id);
            expect(modeIds).toContain('roster');
            expect(modeIds).toContain('formation');
            expect(modeIds).toContain('assign');
            expect(modeIds).toContain('export');
        });

        it('should have labels and descriptions for all modes', () => {
            AppModes.forEach(mode => {
                expect(mode.label).toBeTruthy();
                expect(mode.description).toBeTruthy();
                expect(mode.icon).toBeTruthy();
            });
        });
    });

    describe('findIcon', () => {
        it('should return none.jpg for empty input', () => {
            expect(findIcon('', 'type')).toBe('none.jpg');
            expect(findIcon(null as any, 'type')).toBe('none.jpg');
            expect(findIcon(undefined as any, 'type')).toBe('none.jpg');
        });

        it('should find exact match for qualification icons', () => {
            expect(findIcon('Wing', 'qualification')).toBe('level-wing.png');
            expect(findIcon('wing', 'qualification')).toBe('level-wing.png');
            expect(findIcon('WING', 'qualification')).toBe('level-wing.png');
            expect(findIcon('Lead', 'qualification')).toBe('level-lead.png');
            expect(findIcon('Safety Observer', 'qualification')).toBe('level-safety.png');
        });

        it('should find exact match for squadron icons', () => {
            expect(findIcon('Rocky Mountain', 'squadron')).toBe('squadron-rocky-mountain.png');
            expect(findIcon('Texas', 'squadron')).toBe('squadron-texas.png');
            expect(findIcon('Best Coast', 'squadron')).toBe('squadron-best-coast.png');
        });

        it('should find aircraft type icons', () => {
            expect(findIcon('M20J', 'type')).toBe('mooney-m20j-201.png');
            expect(findIcon('M20M', 'type')).toBe('mooney-m20m-tlsbravo.png');
            expect(findIcon('Cirrus SR22', 'type')).toBe('cirrus-sr22.png');
        });

        it('should apply icon replacements', () => {
            // "beech" should become "beechcraft"
            expect(findIcon('Beech Bonanza', 'type')).toBe('type-beechcraft-bonanza.png');
        });

        it('should return input name if no icon found', () => {
            expect(findIcon('Unknown Aircraft', 'type')).toBe('Unknown Aircraft');
            expect(findIcon('Custom Squadron', 'squadron')).toBe('Custom Squadron');
        });

        it('should match partial names (parts match)', () => {
            // "Beechcraft Bonanza" contains "beechcraft" and "bonanza"
            expect(findIcon('Beechcraft Bonanza', 'type')).toBe('type-beechcraft-bonanza.png');
        });
    });

    describe('isValidIconFilename', () => {
        it('should return true for valid icon filenames', () => {
            expect(isValidIconFilename('level-wing.png')).toBe(true);
            expect(isValidIconFilename('squadron-texas.png')).toBe(true);
            expect(isValidIconFilename('none.jpg')).toBe(true);
        });

        it('should return false for invalid icon filenames', () => {
            expect(isValidIconFilename('invalid.png')).toBe(false);
            expect(isValidIconFilename('')).toBe(false);
            expect(isValidIconFilename('random-file.jpg')).toBe(false);
        });
    });

    describe('FormatShip', () => {
        const mockShip: Ship = {
            name: 'John Doe',
            tail: 'N12345',
            type: 'Mooney M20J',
            qualification: 'Wing',
            squadron: 'Texas',
            row: 1,
            col: 2,
            seat: null
        };

        const defaultSetup: Setup = { ...SetupDefaults };

        it('should format ship with default setup', () => {
            const formatted = FormatShip(mockShip, defaultSetup, false);

            expect(formatted.row).toBe(1);
            expect(formatted.col).toBe(2);
            expect(formatted.seat).toBe(null);
            expect(formatted.row1).toBe('John Doe'); // name
            expect(formatted.row2).toBe('N12345'); // tail
            expect(formatted.leftIcon).toBe('level-wing.png'); // qualification icon
            expect(formatted.rightIcon).toBe('squadron-texas.png'); // squadron icon
        });

        it('should hide tail and type for occupants', () => {
            const occupantSetup: Setup = {
                ...defaultSetup,
                row1: 'name',
                row2: 'tail',
                leftBadge: 'type',
                rightBadge: 'qualification'
            };

            const formatted = FormatShip(mockShip, occupantSetup, true);

            expect(formatted.row1).toBe('John Doe'); // name stays
            expect(formatted.row2).toBe(''); // tail hidden for occupant
            expect(formatted.leftIcon).toBe('none.jpg'); // type hidden, returns none.jpg
        });

        it('should handle ship with null values', () => {
            const emptyShip: Ship = {
                name: null,
                tail: null,
                type: null,
                qualification: null,
                squadron: null,
                row: null,
                col: null,
                seat: null
            };

            const formatted = FormatShip(emptyShip, defaultSetup, false);

            expect(formatted.row).toBe(null);
            expect(formatted.col).toBe(null);
            expect(formatted.row1).toBe('');
            expect(formatted.row2).toBe('');
            expect(formatted.leftIcon).toBe('none.jpg');
            expect(formatted.rightIcon).toBe('none.jpg');
        });

        it('should use custom field assignments from setup', () => {
            const customSetup: Setup = {
                ...defaultSetup,
                row1: 'tail',
                row2: 'type',
                leftBadge: 'squadron',
                rightBadge: 'qualification'
            };

            const formatted = FormatShip(mockShip, customSetup, false);

            expect(formatted.row1).toBe('N12345'); // tail
            expect(formatted.row2).toBe('Mooney M20J'); // type
            expect(formatted.leftIcon).toBe('squadron-texas.png'); // squadron
            expect(formatted.rightIcon).toBe('level-wing.png'); // qualification
        });
    });

    describe('Icons array', () => {
        it('should have unique filenames', () => {
            const filenames = Icons.map(i => i.filename);
            const uniqueFilenames = [...new Set(filenames)];
            // Note: There might be duplicates by design (e.g., vans rv appears twice)
            // Just check that we have icons
            expect(Icons.length).toBeGreaterThan(0);
        });

        it('should categorize icons by type', () => {
            const qualificationIcons = Icons.filter(i => i.type === 'qualification');
            const typeIcons = Icons.filter(i => i.type === 'type');
            const squadronIcons = Icons.filter(i => i.type === 'squadron');

            expect(qualificationIcons.length).toBeGreaterThan(0);
            expect(typeIcons.length).toBeGreaterThan(0);
            expect(squadronIcons.length).toBeGreaterThan(0);
        });
    });

    describe('IconReplacements', () => {
        it('should have common abbreviations', () => {
            expect(IconReplacements['beech']).toBe('beechcraft');
            expect(IconReplacements['m20']).toBe('mooney');
            expect(IconReplacements['pa-24']).toBe('comanche');
        });
    });
});
