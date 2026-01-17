# FEATURES.md

Complete feature specification for FlightLineup - a web application for creating visual lineup diagrams for formation flying groups.

---

## Roster Management

### Entering Aircraft Data
Users enter their flight roster in a table with five columns:
- **Name** - Pilot's name
- **Tail** - Aircraft tail number (e.g., "N12345")
- **Type** - Aircraft make/model
- **Qualification** - Pilot's formation flying qualification level
- **Squadron** - Formation flying group affiliation

Each row represents one aircraft/pilot. A blank row is always present at the bottom for adding new entries. When the user starts typing in the blank row, another blank row appears below it.

### Autocomplete Suggestions
Three fields offer autocomplete suggestions as the user types:

**Aircraft Types** - Suggestions include:
- Mooney variants: M20A through M20V, including named models (Ranger, Executive, Statesman, 201, 205, Missile, 231, 252, Encore, Rocket, PFM, TLS Bravo, Ovation, Eagle, Acclaim)
- Beechcraft: Bonanza (33, 35, 36 series), Debonair, Baron (55, 56, 58 series)
- Piper: PA-24 Comanche variants (180, 250, 260, 400)
- Cirrus: SR20, SR22, SR22T variants
- Vans RV

**Qualification Levels:**
- New, Wing, Wing Candidate
- Lead, Lead Candidate
- Safety Observer, Safety Observer Candidate
- FFI Wing, FFI Wing Candidate, FFI Lead, FFI Lead Candidate
- Fast Wing, Fast Wing Candidate, Fast Lead, Fast Lead Candidate

**Squadrons:**
- Best Coast, Flying Monkeys, Gunfighters, Mid-Atlantic Group, Northern Flights, Rocky Mountain, Texas

### Deleting Roster Entries
Each row has an "x" button to delete that entry. Deleting a row that was placed in the lineup also removes it from the grid.

### Clearing the Roster
The "Clear roster" button shows a confirmation dialog. Confirming removes all roster entries and clears the lineup grid.

### CSV Import
Clicking "Import CSV" opens a file picker. The application accepts CSV files in several formats:

**Standard format** with headers: Name, Tail, Type, Qualification, Squadron (plus optional Row, Col, Seat for pre-positioned lineups)

**MARVEL roster format** with headers: Full Name, Tail #, AircraftModel, Certification
- Certification codes are translated: 0→New, 1→Wing, 2→Lead, 3→Lead, 9→Safety Observer

**Legacy format** starting with "Row 1" header (older FlightLineup exports)

Imported data replaces the current roster. If the CSV includes position data, aircraft appear in the grid at those positions.

### CSV Export
Clicking "Export CSV" downloads a file named "roster.csv" containing all roster entries with their current grid positions.

---

## Lineup Grid

### Grid Structure
The lineup displays as a grid where each cell can hold one primary aircraft plus optional occupants. The grid adjusts size based on content:
- Columns: 1 to 5 maximum
- Rows: 1 to 50 maximum

### Adding Grid Space
- **Add column (left)** - Inserts a new column on the left, shifting existing aircraft right
- **Add column (right)** - Adds a new column on the right
- **Add row** - Adds a new row at the bottom

Buttons are disabled when at maximum size (5 columns or 50 rows).

### Automatic Grid Sizing
When aircraft are placed beyond the current grid bounds, the grid expands automatically. When loading a shared lineup, the grid sizes to fit all placed aircraft.

### Removing Unused Space
"Remove unused rows and columns" shrinks the grid to fit only the occupied cells, removing empty rows/columns from the edges and shifting aircraft to eliminate gaps.

### Clearing the Lineup
"Clear lineup" shows a confirmation dialog. Confirming removes all aircraft from the grid but keeps them in the roster for reassignment.

### Empty Cells
Empty grid cells display "Click to set" in gray text. Clicking opens the ship picker to assign an aircraft.

### Occupied Cells
Cells with assigned aircraft display a tile showing the aircraft's information (configured in the setup panel). Clicking the tile opens the ship picker to change or remove the assignment.

---

## Placing Aircraft in the Grid

### Ship Picker Dialog
Clicking any grid cell opens a modal dialog for selecting an aircraft.

The dialog shows three sections:
1. **Selected ship** (if cell is occupied) - Shows the current aircraft with "Click to remove this ship from this slot"
2. **Available ships** - Aircraft in the roster not yet placed in the grid
3. **Ships assigned to other slots** - Aircraft already placed elsewhere (selecting one moves it)

### Search Filtering
A search box at the bottom filters the list. Typing matches against any field (name, tail, type, qualification, squadron). The search is case-insensitive.

### Keyboard Shortcuts
- Typing any letter or number focuses the search box
- **Escape** clears the search text, or closes the dialog if search is empty
- **Enter** selects the aircraft if exactly one matches the search

### Selecting an Aircraft
Clicking an aircraft assigns it to the grid cell and closes the dialog. If the aircraft was already placed elsewhere, it moves to the new position.

### Removing an Aircraft
Clicking the currently selected aircraft removes it from the grid (returns it to "available" status).

---

## Aircraft Occupants

### Enabling Occupant Mode
Check "Show aircraft occupants" in the setup panel to display occupant slots.

### Occupant Display
With occupants enabled, each occupied cell shows:
- The primary aircraft tile
- Up to 3 smaller occupant tiles below it
- An "Add occupant" link (if fewer than 3 occupants)

### Adding Occupants
Click "Add occupant" or an existing occupant tile to open the ship picker. Select a person from the roster to assign them as an occupant of that aircraft.

### Occupant Information
Occupant tiles show the person's name and qualification but not aircraft-specific fields (tail number, aircraft type) since they share the primary aircraft.

### Removing Occupants
Click an occupant tile and select the currently assigned person to remove them. Removing the primary aircraft also removes all its occupants.

---

## Drag and Drop

### Moving Aircraft Between Cells
Drag an aircraft tile to another cell to move it. If the destination cell is occupied, the two aircraft swap positions.

Dragging moves the entire cell contents including any occupants.

### Swapping Rows
Each row has a drag handle (⋮⋮) on the left side. Drag the handle to another row's handle area to swap all aircraft in those two rows.

Row labels and colors (if enabled) swap along with the aircraft.

---

## Tile Appearance

### Tile Structure
Each aircraft tile displays:
- **Left badge** - An icon or text on the left side
- **Middle top** - Primary text line
- **Middle bottom** - Secondary text line
- **Right badge** - An icon or text on the right side

### Preview
The setup panel shows a live preview tile with example data, demonstrating the current configuration.

### Configuring Field Positions
Click the gear icon (⚙️) in the setup panel to reveal a settings matrix.

The matrix has:
- Rows: Name, Tail number, Aircraft type, Qual level, Squadron
- Columns: Left, Middle (top), Middle (bottom), Right

Check a box to assign that field to that position. Each field can only appear in one position. Each position can only show one field.

### Default Configuration
- Left badge: Qualification
- Middle top: Name
- Middle bottom: Tail number
- Right badge: Squadron

### Icon Display
For badge positions (left and right), the application displays icons when possible:

**Qualification icons** - Visual badges for each qualification level (New, Wing, Lead, Safety Observer, FFI variants, Fast variants)

**Squadron icons** - Logos for each formation flying group

**Aircraft type icons** - Silhouettes for aircraft families and specific models:
- Mooney M20 variants (short-body, mid-body, long-body, and specific models)
- Beechcraft Bonanza, Debonair, Baron variants
- Piper Comanche variants
- Cirrus SR20/SR22 variants
- Vans RV

When no matching icon exists, the text value displays instead.

### Icon Matching
Icons match flexibly - entering "Beech 35" finds the Beechcraft 35 Bonanza icon, "M20J" finds the Mooney M20J icon, etc. Common abbreviations work (e.g., "Beech" for "Beechcraft").

---

## Row and Column Labels

### Enabling Labels
Check "Set row and column labels" in the setup panel to display editable labels.

### Column Labels
With labels enabled, a row of text inputs appears above the grid. Enter text to label each column (e.g., "Lead", "Left Wing", "Right Wing", "Tail").

### Row Labels
A text input appears to the left of each row. Enter text to label rows (e.g., "Flight 1", "Flight 2", "Spares").

### Row Colors
Next to each row label is a color button (🎨). Clicking it shows a color picker with five options: red, white, blue, green, yellow.

Select a color to highlight that row's label area. Click the same color again to remove it. Colors help visually group or distinguish rows.

---

## Sharing Lineups

### Creating a Share Link
Click "Share" to open the share dialog. Optionally enter a name for the lineup, then click "Share."

The application generates a unique URL. The link includes all roster data, grid positions, and display settings.

### Copying the Link
After sharing, the URL appears with a "Copy" button. Clicking it copies the link to the clipboard and briefly flashes the input yellow to confirm.

### Opening a Shared Lineup
When someone opens a shared link, the application loads that lineup automatically. The roster, grid positions, and settings all restore to match the shared state.

After loading, the URL cleans up (the share parameter disappears) so bookmarking captures the main page, not the temporary share link.

---

## Exporting and Printing

### PNG Download
Click "Download PNG" to save the lineup as an image file named "lineup.png". The image captures the grid with all placed aircraft, hiding editing controls.

### Printing
Click "Print" to open the browser's print dialog. The print layout shows only the lineup grid on a white background, hiding the roster, setup controls, and editing buttons.

### What's Hidden in Export/Print
- Roster pane
- Setup controls
- "Add column/row" buttons
- "Clear lineup" button
- "Add occupant" links
- Empty cell placeholder text
- Color picker buttons

---

## Data Persistence

### Automatic Saving
The application automatically saves to the browser's local storage:
- All roster entries
- Grid positions
- Display configuration (tile field assignments, occupant mode, labels)
- Row/column labels and colors

### Restoring on Return
Returning to the application restores the previous session. Roster entries, grid positions, and all settings reappear as they were left.

### Browser-Specific Storage
Data is stored in the browser, not on a server. Using a different browser or device starts fresh. Clearing browser data removes saved lineups.

---

## Collapsible Panels

### Roster Panel
The "Roster" panel can be collapsed by clicking the chevron (—) in its title bar. When collapsed, the title bar shows (+) and the roster table is hidden. Click again to expand.

### Lineup Panel
The "Lineup" panel contains both the setup controls and the grid. It can also be collapsed the same way.

Collapsing panels helps focus on one area when working on a small screen.

---

## Privacy

All data processing happens in the browser. Roster information is not sent to any server during normal use.

The only server communication occurs when:
- **Sharing** - The lineup data is sent to create a shareable link
- **Loading a shared link** - The lineup data is retrieved from the server

Shared lineups are stored on the server and accessible to anyone with the link.

---

## Responsive Behavior

### Small Screens
On narrow screens (under 600px):
- The roster table scrolls horizontally
- The lineup grid scrolls horizontally
- Setup controls stack vertically

### Scalable Elements
- The header text scales with screen width
- Aircraft tiles maintain proportions at different sizes
- Icons scale appropriately within tiles
