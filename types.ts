// App Mode Types
export type AppMode = 'roster' | 'formation' | 'assign' | 'export';

export interface ModeConfig {
    id: AppMode;
    label: string;
    description: string;
    icon: string;
}

export const AppModes: ModeConfig[] = [
    { id: 'roster', label: 'Enter Roster', description: 'Add pilots and aircraft', icon: '📋' },
    { id: 'formation', label: 'Lay Out Formation', description: 'Configure grid and labels', icon: '📐' },
    { id: 'assign', label: 'Assign Ships', description: 'Drag aircraft into positions', icon: '✈️' },
    { id: 'export', label: 'Create Printable Views', description: 'Download, print, or share', icon: '📤' }
];

// Setup Types
export interface Setup {
    row1: string;
    row2: string;
    leftBadge: string;
    rightBadge: string;
    occupants: boolean;
    labels: boolean;
    columnLabels: string[];
    rowLabels: string[];
    rowLabelColors: string[];
    isDefault: boolean | null;
}

export const SetupDefaults: Setup = {
    row1: 'name',
    row2: 'tail',
    leftBadge: 'qualification',
    rightBadge: 'squadron',
    occupants: false,
    labels: false,
    columnLabels: [],
    rowLabels: [],
    rowLabelColors: [],
    isDefault: true
};

// Ship Types
export interface FormattedShip {
    row: number | null;
    col: number | null;
    seat: number | null;
    row1: string;
    row2: string;
    leftIcon: string;
    rightIcon: string;
}

export interface Ship {
    row: number | null;
    col: number | null;
    seat: number | null;
    name: string | null;
    tail: string | null;
    type: string | null;
    qualification: string | null;
    squadron: string | null;
}

const GetPropertyValue = (ship: Ship, property: String, forOccupant: boolean): string => {
    if (!ship || !property) {
        return '';
    }

    if (forOccupant && (property == 'tail' || property == 'type')) {
        return '';
    }

    return ship[property as keyof Ship] as string || '';
}

export const FormatShip = (ship: Ship, setup: Setup, forOccupant: boolean): FormattedShip => {
    return {
        row: ship.row,
        col: ship.col,
        seat: ship.seat,
        row1: GetPropertyValue(ship, setup.row1, forOccupant),
        row2: GetPropertyValue(ship, setup.row2, forOccupant),
        leftIcon: findIcon(GetPropertyValue(ship, setup.leftBadge, forOccupant), setup.leftBadge),
        rightIcon: findIcon(GetPropertyValue(ship, setup.rightBadge, forOccupant), setup.rightBadge)
    };
}

export interface Grid {
    row: number;
    col: number;
    seat: number | null;
}

// Canonical Data Lists
export const CanonicalTypes: string[] = [
    "Mooney",
    "Mooney M20A",
    "Mooney M20B",
    "Mooney M20C Ranger",
    "Mooney M20D Master",
    "Mooney M20E Super 21",
    "Mooney M20F Executive",
    "Mooney M20G Statesman",
    "Mooney M20J 201",
    "Mooney M20J 205",
    "Mooney M20J Missile",
    "Mooney M20K 231",
    "Mooney M20K 252",
    "Mooney M20K 252 Encore",
    "Mooney M20K Rocket",
    "Mooney M20L PFM",
    "Mooney M20M TLS Bravo",
    "Mooney M20R Ovation",
    "Mooney M20S Eagle",
    "Mooney M20TN Acclaim",
    "Mooney M20U Ovation Ultra",
    "Mooney M20V Acclaim Ultra",
    "Mooney M18 Mite",
    "Beechcraft Bonanza",
    "Beechcraft 33 Debonair",
    "Beechcraft 33 Bonanza",
    "Beechcraft 35 Bonanza",
    "Beechcraft 36 Bonanza",
    "Beechcraft 55 Baron",
    "Beechcraft 56 Baron",
    "Beechcraft 58 Baron",
    "Beechcraft 33 225",
    "Beechcraft 33 285",
    "Beechcraft 35 185",
    "Beechcraft 35 225",
    "Beechcraft 35 240",
    "Beechcraft 35 250",
    "Beechcraft 35 260",
    "Beechcraft 35 285",
    "Beechcraft 36 285",
    "Beechcraft 36 300",
    "Beechcraft 36 325",
    "Piper PA-24 Comanche",
    "Piper PA-24 180",
    "Piper PA-24 250",
    "Piper PA-24 260",
    "Piper PA-24 400",
    "Cirrus SR20",
    "Cirrus SR22",
    "Cirrus SR22T",
    "Cirrus SR20 200",
    "Cirrus SR20 215",
    "Cirrus SR22 310",
    "Cirrus SR22T 315",
    "Vans RV"
];

export const CanonicalQualifications: string[] = [
    "New",
    "Wing",
    "Wing Candidate",
    "Lead",
    "Lead Candidate",
    "Safety Observer",
    "Safety Observer Candidate",
    "FFI Wing",
    "FFI Wing Candidate",
    "FFI Lead",
    "FFI Lead Candidate",
    "Fast Wing",
    "Fast Wing Candidate",
    "Fast Lead",
    "Fast Lead Candidate"
];

export const CanonicalSquadrons: string[] = [
    "Best Coast",
    "Flying Monkeys",
    "Gunfighters",
    "Mid-Atlantic Group",
    "Northern FLights",
    "Rocky Mountain",
    "Texas"
];

// Icon System
export const IconReplacements: { [key: string]: string } = {
    "beech": "beechcraft",
    "m20": "mooney",
    "pa-24": "comanche",
    "pa 24": "comanche",
    "short body": "short-body",
    "mid body": "mid-body",
    "long body": "long-body",
    "van's": "vans",
    "mid atlantic": "mid-atlantic"
};

export const Icons: { name: string, type: string, filename: string }[] = [
    { name: "", type: "type", filename: "none.jpg" },
    { name: "new", type: "qualification", filename: "level-new.png" },
    { name: "wing", type: "qualification", filename: "level-wing.png" },
    { name: "wing candidate", type: "qualification", filename: "level-wing-candidate.png" },
    { name: "lead", type: "qualification", filename: "level-lead.png" },
    { name: "lead candidate", type: "qualification", filename: "level-lead-candidate.png" },
    { name: "safety observer", type: "qualification", filename: "level-safety.png" },
    { name: "safety observer candidate", type: "qualification", filename: "level-safety-candidate.png" },
    { name: "ffi wing", type: "qualification", filename: "ffi-wing.png" },
    { name: "ffi wing candidate" , type: "qualification", filename: "ffi-wing-candidate.png" },
    { name: "ffi lead", type: "qualification", filename: "ffi-lead.png" },
    { name: "ffi candidate", type: "qualification", filename: "ffi-lead-candidate.png" },
    { name: "fast wing", type: "qualification", filename: "fast-wing.png" },
    { name: "fast wing candidate", type: "qualification", filename: "fast-wing-candidate.png" },
    { name: "fast lead", type: "qualification", filename: "fast-lead.png" },
    { name: "fast candidate", type: "qualification", filename: "fast-lead-candidate.png" },
    { name: "beechcraft bonanza", type: "type", filename: "type-beechcraft-bonanza.png" },
    { name: "cirrus", type: "type", filename: "type-cirrus.png" },
    { name: "m20", type: "type", filename: "type-mooney-m20.png" },
    { name: "piper pa-24", type: "type", filename: "type-piper-pa24.png" },
    { name: "vans rv", type: "type", filename: "type-vans-rv.png" },
    { name: "mooney short-body", type: "type", filename: "mooney-m20-short-body.png" },
    { name: "mooney mid-body", type: "type", filename: "mooney-m20-mid-body.png" },
    { name: "mooney long-body", type: "type", filename: "mooney-m20-long-body.png" },
    { name: "mooney 150hp", type: "type", filename: "mooney-m20-150.png" },
    { name: "m20a", type: "type", filename: "mooney-m20a-180.png" },
    { name: "m20b", type: "type", filename: "mooney-m20b-180.png" },
    { name: "m20c", type: "type", filename: "mooney-m20c-ranger.png" },
    { name: "m20d", type: "type", filename: "mooney-m20d-master.png" },
    { name: "m20e", type: "type", filename: "mooney-m20e-super21.png" },
    { name: "m20f", type: "type", filename: "mooney-m20f-executive.png" },
    { name: "m20g", type: "type", filename: "mooney-m20g-statesman.png" },
    { name: "m20j", type: "type", filename: "mooney-m20j-201.png" },
    { name: "m20j 205", type: "type", filename: "mooney-m20j-205.png" },
    { name: "missile", type: "type", filename: "mooney-m20j-missile.png" },
    { name: "m20k 231", type: "type", filename: "mooney-m20k-231.png" },
    { name: "m20k 252", type: "type", filename: "mooney-m20k-252.png" },
    { name: "encore", type: "type", filename: "mooney-m20k-252encore.png" },
    { name: "rocket", type: "type", filename: "mooney-m20k-rocket.png" },
    { name: "m20l", type: "type", filename: "mooney-m20l-pfm.png" },
    { name: "m20m", type: "type", filename: "mooney-m20m-tlsbravo.png" },
    { name: "m20r", type: "type", filename: "mooney-m20r-ovation.png" },
    { name: "m20s", type: "type", filename: "mooney-m20s-eagle.png" },
    { name: "m20tn", type: "type", filename: "mooney-m20tn-acclaim.png" },
    { name: "m20u", type: "type", filename: "mooney-m20u-ovationultra.png" },
    { name: "m20v", type: "type", filename: "mooney-m20v-acclaimultra.png" },
    { name: "beechcraft 33 debonair", type: "type", filename: "beechcraft-33-debonair.png" },
    { name: "beechcraft 33 bonanza", type: "type", filename: "beechcraft-33-bonanza.png" },
    { name: "beechcraft 35 bonanza", type: "type", filename: "beechcraft-35-bonanza.png" },
    { name: "beechcraft 36 bonanza", type: "type", filename: "beechcraft-36-bonanza.png" },
    { name: "beechcraft 55 baron", type: "type", filename: "beechcraft-55-baron.png" },
    { name: "beechcraft 56 baron", type: "type", filename: "beechcraft-56-baron.png" },
    { name: "beechcraft 58 baron", type: "type", filename: "beechcraft-58-baron.png" },
    { name: "beechcraft 33 225", type: "type", filename: "beechcraft-33-225.png" },
    { name: "beechcraft 33 285", type: "type", filename: "beechcraft-33-285.png" },
    { name: "beechcraft 35 185", type: "type", filename: "beechcraft-35-185.png" },
    { name: "beechcraft 35 225", type: "type", filename: "beechcraft-35-225.png" },
    { name: "beechcraft 35 240", type: "type", filename: "beechcraft-35-240.png" },
    { name: "beechcraft 35 250", type: "type", filename: "beechcraft-35-250.png" },
    { name: "beechcraft 35 260", type: "type", filename: "beechcraft-35-260.png" },
    { name: "beechcraft 35 285", type: "type", filename: "beechcraft-35-285.png" },
    { name: "beechcraft 36 285", type: "type", filename: "beechcraft-36-285.png" },
    { name: "beechcraft 36 300", type: "type", filename: "beechcraft-36-300.png" },
    { name: "beechcraft 36 325", type: "type", filename: "beechcraft-36-325.png" },
    { name: "piper pa-24 180", type: "type", filename: "piper-pa24-180.png" },
    { name: "piper pa-24 250", type: "type", filename: "piper-pa24-250.png" },
    { name: "piper pa-24 260", type: "type", filename: "piper-pa24-260.png" },
    { name: "piper pa-24 400", type: "type", filename: "piper-pa24-400.png" },
    { name: "cirrus sr20", type: "type", filename: "cirrus-sr20.png" },
    { name: "cirrus sr22", type: "type", filename: "cirrus-sr22.png" },
    { name: "cirrus sr20 200", type: "type", filename: "cirrus-sr20-200.png" },
    { name: "cirrus sr20 215", type: "type", filename: "cirrus-sr20-215.png" },
    { name: "cirrus sr22 310", type: "type", filename: "cirrus-sr22-310.png" },
    { name: "cirrus sr22t 315", type: "type", filename: "cirrus-sr22t-315.png" },
    { name: "vans rv", type: "type", filename: "type-vans-rv.png" },
    { name: "best coast", type: "squadron", filename: "squadron-best-coast.png" },
    { name: "flying monkeys", type: "squadron", filename: "squadron-flying-monkeys.png" },
    { name: "gunfighters", type: "squadron", filename: "squadron-gunfighters.png" },
    { name: "mid-atlantic group", type: "squadron", filename: "squadron-mid-atlantic-group.png" },
    { name: "northern flights", type: "squadron", filename: "squadron-northern-flights.png" },
    { name: "rocky mountain", type: "squadron", filename: "squadron-rocky-mountain.png" },
    { name: "texas", type: "squadron", filename: "squadron-texas.png" }
];

export const findIcon = (name: string, type: string): string => {
    if (!name || name == '') {
        return "none.jpg";
    }

    var n = name.toLowerCase();

    var icons = Icons;
    if (type) {
        icons = icons.filter(icon => icon.type === type);
    }

    // Replace all items in the input name with their replacements
    Object.entries(IconReplacements).forEach(([key, value]) => {
        n = n.split(' ').map(token =>
            token === key ? value : token
        ).join(' ');
    });

    // Exact match
    var matches = icons.filter(icon => icon.name.toLowerCase() === n.toLowerCase());
    if (matches.length > 0) {
        return matches[0].filename;
    }

    // Parts match
    matches = icons.filter(icon => matchParts(n, icon.name));
    if (matches.length > 0) {
        return matches[0].filename;
    }

    return name;
}

export const isValidIconFilename = (filename: string): boolean => {
    return Icons.some(icon => icon.filename === filename);
}

const matchParts = (haystack: string, needle: string): boolean => {
    let hay = haystack.toLowerCase().split(' ');
    let needles = needle.toLowerCase().split(' ');

    if (!hay || !needles || hay.length === 0 || needles.length === 0) {
        return false;
    }

    return needles.every(needle => hay.includes(needle.toLowerCase()));
}
