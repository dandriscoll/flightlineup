// Minimal, dependency-free XLSX reader for the browser.
//
// An .xlsx file is a ZIP archive of XML parts. We read the ZIP central
// directory, inflate the parts we need with the browser's built-in
// DecompressionStream('deflate-raw'), and pull the cell values out of
// xl/sharedStrings.xml + the first worksheet. The result is converted to a
// CSV string so it can flow through the existing parseCsvRoster path.

const SIG_EOCD = 0x06054b50;
const SIG_CENTRAL = 0x02014b50;

// Does this file look like a ZIP/xlsx (starts with the "PK\x03\x04" magic)?
const isXlsx = (bytes: Uint8Array): boolean =>
    bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;

const inflateRaw = async (bytes: Uint8Array): Promise<Uint8Array> => {
    const ds = new DecompressionStream('deflate-raw');
    const stream = new Response(bytes as BufferSource).body!.pipeThrough(ds);
    return new Uint8Array(await new Response(stream).arrayBuffer());
};

interface ZipEntry { method: number; compSize: number; localOff: number; }

const readCentralDirectory = (dv: DataView, u8: Uint8Array): Record<string, ZipEntry> => {
    // Find the End Of Central Directory record by scanning backwards.
    let eocd = -1;
    for (let i = u8.length - 22; i >= 0; i--) {
        if (dv.getUint32(i, true) === SIG_EOCD) { eocd = i; break; }
    }
    if (eocd === -1) throw new Error('Not a valid xlsx file (no ZIP directory found)');

    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const td = new TextDecoder();
    const entries: Record<string, ZipEntry> = {};

    for (let n = 0; n < count; n++) {
        if (dv.getUint32(p, true) !== SIG_CENTRAL) break;
        const method = dv.getUint16(p + 10, true);
        const compSize = dv.getUint32(p + 20, true);
        const nameLen = dv.getUint16(p + 28, true);
        const extraLen = dv.getUint16(p + 30, true);
        const commentLen = dv.getUint16(p + 32, true);
        const localOff = dv.getUint32(p + 42, true);
        const name = td.decode(u8.subarray(p + 46, p + 46 + nameLen));
        entries[name] = { method, compSize, localOff };
        p += 46 + nameLen + extraLen + commentLen;
    }
    return entries;
};

const readEntry = async (
    dv: DataView, u8: Uint8Array, entries: Record<string, ZipEntry>, name: string
): Promise<string | null> => {
    const e = entries[name];
    if (!e) return null;
    // The local header repeats the name/extra lengths; the compressed data
    // starts right after it.
    const nameLen = dv.getUint16(e.localOff + 26, true);
    const extraLen = dv.getUint16(e.localOff + 28, true);
    const dataStart = e.localOff + 30 + nameLen + extraLen;
    const comp = u8.subarray(dataStart, dataStart + e.compSize);
    const raw = e.method === 0 ? comp : await inflateRaw(comp);
    return new TextDecoder().decode(raw);
};

const decodeXml = (s: string): string =>
    s.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&amp;/g, '&'); // ampersand last so decoded entities aren't re-decoded

const parseSharedStrings = (xml: string | null): string[] => {
    if (!xml) return [];
    const strings: string[] = [];
    for (const si of xml.matchAll(/<si>(.*?)<\/si>/gs)) {
        // An <si> may hold one <t> or several <r><t> rich-text runs; join them.
        let text = '';
        for (const t of si[1].matchAll(/<t[^>]*>(.*?)<\/t>/gs)) text += t[1];
        strings.push(decodeXml(text));
    }
    return strings;
};

// "A" -> 0, "B" -> 1, ... "AA" -> 26
const columnToIndex = (col: string): number => {
    let n = 0;
    for (let i = 0; i < col.length; i++) n = n * 26 + (col.charCodeAt(i) - 64);
    return n - 1;
};

const parseSheet = (xml: string, shared: string[]): string[][] => {
    const rows: string[][] = [];
    for (const rowMatch of xml.matchAll(/<row[^>]*>(.*?)<\/row>/gs)) {
        const cells: string[] = [];
        // Match both self-closing (<c .../>) and paired (<c ...>...</c>) cells.
        for (const cellMatch of rowMatch[1].matchAll(/<c\b([^>]*?)(?:\/>|>(.*?)<\/c>)/gs)) {
            const attrs = cellMatch[1];
            const inner = cellMatch[2] ?? '';
            const ref = /\br="([A-Z]+)\d+"/.exec(attrs);
            if (!ref) continue;
            const type = /\bt="([^"]+)"/.exec(attrs)?.[1];

            let value = '';
            if (type === 's') {
                const v = /<v>(.*?)<\/v>/s.exec(inner);
                if (v) value = shared[Number(v[1])] ?? '';
            } else if (type === 'inlineStr') {
                const v = /<t[^>]*>(.*?)<\/t>/s.exec(inner);
                if (v) value = decodeXml(v[1]);
            } else {
                const v = /<v>(.*?)<\/v>/s.exec(inner);
                if (v) value = decodeXml(v[1]);
            }
            cells[columnToIndex(ref[1])] = value;
        }
        // Fill gaps left by skipped (empty) cells so columns stay aligned.
        for (let i = 0; i < cells.length; i++) if (cells[i] === undefined) cells[i] = '';
        rows.push(cells);
    }
    return rows;
};

const escapeCsvCell = (value: string): string =>
    /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const rowsToCsv = (rows: string[][]): string =>
    rows.map(row => row.map(escapeCsvCell).join(',')).join('\n');

// Parse an .xlsx ArrayBuffer into a CSV string (first worksheet only).
const xlsxToCsv = async (buffer: ArrayBuffer): Promise<string> => {
    const dv = new DataView(buffer);
    const u8 = new Uint8Array(buffer);
    const entries = readCentralDirectory(dv, u8);

    const shared = parseSharedStrings(await readEntry(dv, u8, entries, 'xl/sharedStrings.xml'));

    // Pick the lowest-numbered worksheet (sheet1.xml, sheet2.xml, ...).
    const sheetName = Object.keys(entries)
        .filter(name => /^xl\/worksheets\/sheet\d+\.xml$/.test(name))
        .sort((a, b) => (parseInt(a.match(/(\d+)/)![1]) - parseInt(b.match(/(\d+)/)![1])))[0];
    if (!sheetName) throw new Error('No worksheet found in xlsx file');

    const sheetXml = await readEntry(dv, u8, entries, sheetName);
    return rowsToCsv(parseSheet(sheetXml!, shared));
};

export { isXlsx, xlsxToCsv };
