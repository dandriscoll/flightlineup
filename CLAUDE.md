# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlightLineup is a web application for creating visual lineup diagrams for formation flying groups. Pilots can arrange aircraft positions in a grid, add pilot/aircraft information, and share lineups via generated links.

**Tech Stack:** React 18 + TypeScript, Parcel bundler, LESS for styling, PHP backend for sharing

## Build Commands

```bash
npm run build    # Production build (outputs to root directory)
npm run serve    # Development server with hot reload
npm run watch    # Watch mode for development
```

## Architecture

### State Management
All application state lives in `src/App.tsx`:
- `ships[]` - Array of Ship objects (roster data)
- `setup` - Display configuration (tile appearance, labels, colors)
- `rows/cols` - Grid dimensions

State persists to localStorage (`ships` and `setup` keys).

### Component Structure
```
App.tsx (root state, handlers, grid sizing)
├── RosterPane/     - Aircraft roster CRUD, CSV import/export
├── SetupPane/      - Tile display configuration, row labels
└── LineupPane/     - Grid visualization, drag-drop
    ├── PlanePicker - Modal for assigning ships to positions
    └── Share       - Share/export modal
```

### Core Data Types (types.ts)
- `Ship` - Roster entry: name, tail, type, qualification, squadron, grid position (row/col/seat)
- `Setup` - Display config: which Ship fields show in tiles, badge assignments, row labels/colors
- `FormattedShip` - Ship data formatted for display based on Setup

### Icon System
Aircraft types, qualifications, and squadrons are matched to icons via fuzzy matching in `findIcon()`. The `Icons[]` array maps normalized names to filenames in `img/`. The `IconReplacements` object handles common aliases (e.g., "beech" → "beechcraft").

### Backend (handler.php)
PHP API that stores/retrieves lineups as JSON files:
- POST: Saves lineup, returns generated filename
- GET with `?l=filename`: Retrieves lineup JSON

Shared lineups are loaded via URL parameter `?l=lineupName` in App.tsx.

### Drag-Drop
Uses HTML5 drag API. Key utilities:
- `moveOrSwapCells.ts` - Swaps ship groups between grid positions
- `moveOrSwapRows.ts` - Swaps entire rows including label/color updates
