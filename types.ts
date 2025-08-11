export interface Setup {
    row1: string;
    row2: string;
    leftBadge: string;
    rightBadge: string;
    occupants: boolean;
    labels: boolean
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

export const TypeIcons: {make?: string, model?: string, qualification?: string, squadron?: string, filename: string}[] = [
    { model: "M20", filename: "type-mooney-m20.png" },
    { make: "Mooney", model: "short-body", filename: "mooney-m20-short-body.png" },
    { make: "Mooney", model: "short body", filename: "mooney-m20-short-body.png" },
    { make: "Mooney", model: "mid-body", filename: "mooney-m20-mid-body.png" },
    { make: "Mooney", model: "mid body", filename: "mooney-m20-mid-body.png" },
    { make: "Mooney", model: "long-body", filename: "mooney-m20-long-body.png" },
    { make: "Mooney", model: "long body", filename: "mooney-m20-long-body.png" },
    { model: "M20 150hp", filename: "mooney-m20-150.png" },
    { model: "M20A", filename: "mooney-m20a-180.png" },
    { model: "M20B", filename: "mooney-m20b-180.png" },
    { model: "M20C", filename: "mooney-m20c-ranger.png" },
    { model: "Ranger", filename: "mooney-m20c-ranger.png" },
    { model: "M20D", filename: "mooney-m20d-master.png" },
    { model: "M20E", filename: "mooney-m20e-super21.png" },
    { model: "M20F", filename: "mooney-m20f-executive.png" },
    { model: "M20G", filename: "mooney-m20g-statesman.png" },
    { model: "M20J", filename: "mooney-m20j-201.png" },
    { model: "201", filename: "mooney-m20j-201.png" },
    { model: "205", filename: "mooney-m20j-205.png" },
    { model: "Missile", filename: "mooney-m20j-missile.png" },
    { model: "M20J 205", filename: "mooney-m20j-205.png" },
    { model: "M20K", filename: "mooney-m20k-231.png" },
    { model: "231", filename: "mooney-m20k-231.png" },
    { model: "252", filename: "mooney-m20k-252.png" },
    { model: "M20K 252", filename: "mooney-m20k-252.png" },
    { model: "252 Encore", filename: "mooney-m20k-252encore.png" },
    { model: "M20K 252 Encore", filename: "mooney-m20k-252encore.png" },
    { model: "Rocket", filename: "mooney-m20k-rocket.png" },
    { model: "305", filename: "mooney-m20k-rocket.png" },
    { model: "M20L", filename: "mooney-m20l-pfm.png" },
    { model: "PFM", filename: "mooney-m20l-pfm.png" },
    { model: "M20M", filename: "mooney-m20m-tlsbravo.png" },
    { model: "TLS", filename: "mooney-m20m-tlsbravo.png" },
    { model: "Bravo", filename: "mooney-m20m-tlsbravo.png" },
    { model: "M20R", filename: "mooney-m20r-ovation.png" },
    { model: "Ovation", filename: "mooney-m20r-ovation.png" },
    { model: "M20S", filename: "mooney-m20s-eagle.png" },
    { model: "Eagle", filename: "mooney-m20s-eagle.png" },
    { model: "M20TN", filename: "mooney-m20tn-acclaim.png" },
    { model: "Acclaim", filename: "mooney-m20tn-acclaim.png" },
    { model: "M20U", filename: "mooney-m20u-ovationultra.png" },
    { model: "Ovation Ultra", filename: "mooney-m20u-ovationultra.png" },
    { model: "M20V", filename: "mooney-m20v-acclaimultra.png" },
    { model: "Acclaim Ultra", filename: "mooney-m20v-acclaimultra.png" },
    
    { model: "Bonanza", filename: "type-beechcraft-bonanza.png" },
    { model: "Debonair", filename: "type-beechcraft-debonair.png" },
    { make: "Beechcraft", model: "33", filename: "beechcraft-33-debonair.png" },
    { make: "Beechcraft", model: "33 Bonanza", filename: "beechcraft-33-bonanza.png" },
    { make: "Beechcraft", model: "35", filename: "beechcraft-35-bonanza.png" },
    { make: "Beechcraft", model: "36", filename: "beechcraft-36-bonanza.png" },
    { make: "Beech", model: "33", filename: "beechcraft-33-debonair.png" },
    { make: "Beech", model: "33 Bonanza", filename: "beechcraft-33-bonanza.png" },
    { make: "Beech", model: "35", filename: "beechcraft-35-bonanza.png" },
    { make: "Beech", model: "36", filename: "beechcraft-36-bonanza.png" },
    { model: "Baron", filename: "type-beechcraft-baron.png" },
    { make: "Beechcraft", model: "55", filename: "beechcraft-55-baron.png" },
    { make: "Beechcraft", model: "56", filename: "beechcraft-56-baron.png" },
    { make: "Beechcraft", model: "58", filename: "beechcraft-58-baron.png" },
    { make: "Beech", model: "55", filename: "beechcraft-55-baron.png" },
    { make: "Beech", model: "56", filename: "beechcraft-56-baron.png" },
    { make: "Beech", model: "58", filename: "beechcraft-58-baron.png" },
    { model: "33 225hp", filename: "beechcraft-33-225.png" },
    { model: "33 285hp", filename: "beechcraft-33-285.png" },
    { model: "35 185hp", filename: "beechcraft-35-185.png" },
    { model: "35 225hp", filename: "beechcraft-35-225.png" },
    { model: "35 240hp", filename: "beechcraft-35-240.png" },
    { model: "35 250hp", filename: "beechcraft-35-250.png" },
    { model: "35 260hp", filename: "beechcraft-35-260.png" },
    { model: "35 285hp", filename: "beechcraft-35-285.png" },
    { model: "36 285hp", filename: "beechcraft-36-285.png" },
    { model: "36 300hp", filename: "beechcraft-36-300.png" },
    { model: "36 325hp", filename: "beechcraft-36-325.png" },

    { model: "PA-24", filename: "type-piper-pa24.png" },
    { model: "Comanche", filename: "type-piper-pa24.png" },
    { model: "Comanche 180", filename: "piper-pa24-180.png" },
    { model: "Comanche 250", filename: "piper-pa24-250.png" },
    { model: "Comanche 260", filename: "piper-pa24-260.png" },
    { model: "Comanche 400", filename: "piper-pa24-400.png" },

    { model: "SR20", filename: "type-cirrus-sr20.png" },
    { model: "SR22", filename: "type-cirrus-sr22.png" },
    { model: "SR20", filename: "cirrus-sr20-200.png" },
    { model: "SR20 215hp", filename: "cirrus-sr20-215.png" },
    { model: "SR22", filename: "cirrus-sr22-310.png" },
    { model: "SR22T", filename: "cirrus-sr22t-315.png" },

    { make: "Van's", filename: "type-vans-rv.png" },
    { make: "Vans", filename: "type-vans-rv.png" },
    { make: "RV", filename: "type-vans-rv.png" },
    { model: "RV", filename: "type-vans-rv.png" },
];

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
