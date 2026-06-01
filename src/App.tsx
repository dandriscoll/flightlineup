import React, { useState, useEffect } from 'react';
import AppShell from './components/Layout/AppShell';
import RosterMode from './components/modes/RosterMode';
import FormationMode from './components/modes/FormationMode';
import AssignMode from './components/modes/AssignMode';
import ExportMode from './components/modes/ExportMode';
import { Ship, Grid, Setup, SetupDefaults, AppMode } from '../types';
import { cleanupShips, hasEmptyRow } from './components/shared/rosterTools';
import { moveOrSwapCells } from './components/shared/moveOrSwapCells';
import { moveOrSwapRows, swapSetupRows } from './components/shared/moveOrSwapRows';

const App = () => {
    const [activeMode, setActiveMode] = useState<AppMode>('roster');
    const [setup, setSetup] = useState<Setup>(SetupDefaults);
    const [ships, setShips] = useState<Ship[]>([]);
    const [rows, setRows] = useState<number>(3);
    const [cols, setCols] = useState<number>(4);
    const [loadError, setLoadError] = useState<string>('');

    // Load shared lineup from URL parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const lineupName = params.get('l');
        if (!lineupName) {
            return;
        }

        const applyData = (data: any) => {
            if (data && data.setup) {
                setSetup({ ...data.setup, isDefault: false });
            }
            if (data && data.ships) {
                setAllShips(cleanupShips(data.ships));
            }
            // Switch to export mode to show the loaded lineup
            setActiveMode('export');
        };

        // The share endpoint is rate limited (HTTP 429, ~2s/IP) and shared by
        // every visitor on the same IP, so a load can transiently fail. Retry
        // once after the cooldown before surfacing an error.
        const loadShared = (attempt: number) => {
            fetch(`https://adverseyaw.com/flightlineup/api/${lineupName}`)
                .then(response => {
                    if (response.status === 200) {
                        return response.json().then(applyData);
                    }
                    if (response.status === 429 && attempt === 0) {
                        setTimeout(() => loadShared(attempt + 1), 2500);
                        return;
                    }
                    if (response.status === 404) {
                        setLoadError('That shared lineup could not be found — the link may be incorrect or expired.');
                        return;
                    }
                    setLoadError('Could not load the shared lineup. Please try opening the link again in a moment.');
                })
                .catch(() => {
                    setLoadError('Could not load the shared lineup. Please check your connection and try again.');
                });
        };

        loadShared(0);

        // Remove the URL parameter
        window.history.replaceState({}, '', window.location.pathname);
    }, []);

    const setAllShips = (allShips: Ship[]) => {
        setShips(allShips);
        removeUnusedRowsAndColumns(allShips);
    };

    const addColLeft = () => {
        if (cols < 5) {
            setCols(cols + 1);
            ships.forEach(ship => {
                ship.col += 1;
            });
            setShips([...ships]);
        }
    };

    const addColRight = () => {
        if (cols < 5) {
            setCols(cols + 1);
        }
    };

    const addRow = () => {
        if (rows < 50) {
            setRows(rows + 1);
        }
    };

    const handleMoveCells = (from: Grid, to: Grid) => {
        setShips(prev => moveOrSwapCells(prev, from, to));
    };

    const handleMoveRows = (fromRow: number, toRow: number) => {
        setShips(prev => moveOrSwapRows(prev, fromRow, toRow));
        setSetup(prev => swapSetupRows(prev, fromRow, toRow));
    };

    const resizeLabelArrays = () => {
        const newColumnLabels = [...setup.columnLabels];
        const newRowLabels = [...setup.rowLabels];
        const newRowLabelColors = [...setup.rowLabelColors];

        while (newColumnLabels.length < cols) {
            newColumnLabels.push('');
        }
        while (newColumnLabels.length > cols) {
            newColumnLabels.pop();
        }

        while (newRowLabels.length < rows) {
            newRowLabels.push('');
        }
        while (newRowLabels.length > rows) {
            newRowLabels.pop();
        }

        while (newRowLabelColors.length < rows) {
            newRowLabelColors.push('');
        }
        while (newRowLabelColors.length > rows) {
            newRowLabelColors.pop();
        }

        setSetup({ ...setup, columnLabels: newColumnLabels, rowLabels: newRowLabels, rowLabelColors: newRowLabelColors });
    };

    const removeUnusedRowsAndColumns = (s: Ship[]) => {
        const slottedShips = s.filter(ship => ship.row !== null && ship.col !== null && ship.row !== undefined && ship.col !== undefined);

        if (!slottedShips || slottedShips.length === 0) {
            setRows(1);
            setCols(1);
            return;
        }

        const minRow = slottedShips.reduce((min, ship) => Math.min(min, ship.row!), rows);
        const minCol = slottedShips.reduce((min, ship) => Math.min(min, ship.col!), cols);
        var maxRow = slottedShips.reduce((max, ship) => Math.max(max, ship.row!), 0);
        var maxCol = slottedShips.reduce((max, ship) => Math.max(max, ship.col!), 0);

        if (minRow > 0) {
            setRows(minRow);
            slottedShips.forEach(ship => {
                ship.row! -= minRow;
            });
            maxRow -= minRow;
        }

        if (minCol > 0) {
            setCols(minCol);
            slottedShips.forEach(ship => {
                ship.col! -= minCol;
            });
            maxCol -= minCol;
        }

        setRows(maxRow + 1);
        setCols(maxCol + 1);

        setShips(s);
    };

    // Persist ships to localStorage
    useEffect(() => {
        resizeLabelArrays();

        if (!ships || ships.length === 0) {
            return;
        } else if (ships.length === 1 && hasEmptyRow(ships)) {
            return;
        }

        const slottedShips = ships.filter(ship => ship.row !== null && ship.col !== null && ship.row !== undefined && ship.col !== undefined);
        const maxRow = slottedShips.reduce((max, ship) => Math.max(max, ship.row), 0);
        const maxCol = slottedShips.reduce((max, ship) => Math.max(max, ship.col), 0);

        if (maxRow > rows) {
            setRows(maxRow + 1);
        }

        if (maxCol > cols) {
            setCols(maxCol + 1);
        }

        localStorage.setItem('ships', JSON.stringify(ships));
    }, [ships]);

    // Persist setup to localStorage
    useEffect(() => {
        if (setup && setup.isDefault !== true) {
            localStorage.setItem('setup', JSON.stringify(setup));
        }
    }, [setup]);

    // Load from localStorage on mount
    useEffect(() => {
        const storedSetup = localStorage.getItem('setup') ?? '';
        try {
            const json = JSON.parse(storedSetup);
            const parsedSetup: Setup = { ...json, isDefault: false };
            if (!Array.isArray(parsedSetup.columnLabels)) {
                parsedSetup.columnLabels = [];
            }
            if (!Array.isArray(parsedSetup.rowLabels)) {
                parsedSetup.rowLabels = [];
            }
            if (!Array.isArray(parsedSetup.rowLabelColors)) {
                parsedSetup.rowLabelColors = [];
            }

            setSetup(parsedSetup);
        } catch (error) {
            setSetup({ ...SetupDefaults, isDefault: false });
        }

        const storedShips = localStorage.getItem('ships');
        if (storedShips) {
            const roster = JSON.parse(storedShips);
            if (roster.length > 0 && roster[0].name) {
                setAllShips(cleanupShips(roster));
            }
        }
    }, []);

    const renderActiveMode = () => {
        switch (activeMode) {
            case 'roster':
                return (
                    <RosterMode
                        ships={ships}
                        setShips={setShips}
                        setAllShips={setAllShips}
                    />
                );
            case 'formation':
                return (
                    <FormationMode
                        setup={setup}
                        setSetup={setSetup}
                        rows={rows}
                        cols={cols}
                        ships={ships}
                        addColLeft={addColLeft}
                        addColRight={addColRight}
                        addRow={addRow}
                        removeUnusedRowsAndColumns={removeUnusedRowsAndColumns}
                    />
                );
            case 'assign':
                return (
                    <AssignMode
                        setup={setup}
                        setSetup={setSetup}
                        ships={ships}
                        setShips={setShips}
                        rows={rows}
                        cols={cols}
                        onMoveCells={handleMoveCells}
                        onMoveRows={handleMoveRows}
                    />
                );
            case 'export':
                return (
                    <ExportMode
                        setup={setup}
                        setSetup={setSetup}
                        ships={ships}
                        rows={rows}
                        cols={cols}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AppShell activeMode={activeMode} onModeChange={setActiveMode}>
            {loadError && (
                <div className="load-error-banner" role="alert">
                    <span>{loadError}</span>
                    <button
                        type="button"
                        className="load-error-banner-dismiss"
                        aria-label="Dismiss"
                        onClick={() => setLoadError('')}
                    >
                        ×
                    </button>
                </div>
            )}
            {renderActiveMode()}
        </AppShell>
    );
};

export default App;
