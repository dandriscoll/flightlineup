import React, { useState, useEffect } from 'react';
import Pane from '../components/Pane/Pane';
import SetupPane from '../components/SetupPane/SetupPane';
import RosterPane from '../components/RosterPane/RosterPane';
import LineupPane from '../components/LineupPane/LineupPane';
import Modal from '../components/Modal';
import PlanePicker from '../components/LineupPane/PlanePicker';
import Share from '../components/LineupPane/Share';
import { Ship, Grid, Setup, SetupDefaults } from '../types';
import html2canvas from 'html2canvas';
import { cleanupShips, hasEmptyRow } from '../components/RosterPane/rosterTools';
import { moveOrSwapCells } from '../components/LineupPane/moveOrSwapCells';

const App = () => {
    const [setup, setSetup] = useState<Setup>(SetupDefaults);
    const [ships, setShips] = useState<Ship[]>([]);
    const [rows, setRows] = useState<number>(3);
    const [cols, setCols] = useState<number>(4);
    const [modalPickerTarget, setModalPickerTarget] = useState<Grid>(null);
    const [lineupModalOpen, setLineupModalOpen] = useState<boolean>(false);
    const [clearModalOpen, setClearModalOpen] = useState<boolean>(false);
    const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const lineupName = params.get('l');
        if (lineupName) {
            try {
                const response = fetch(`https://adverseyaw.com/flightlineup/api/${lineupName}`).then(response => {
                    if (response.status === 200) {
                        return response.json().then(data => {
                            if (data.setup) {
                                setSetup({ ...data.setup, isDefault: false });
                            }
                            if (data.ships) {
                                setAllShips(cleanupShips(data.ships));
                            }
                        });
                    }
                });
            } catch (error) {
                console.error('Failed to parse shared data:', error);
            }

            // Always remove the string
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    const setAllShips = (allShips: Ship[]) => {
        setShips(allShips);
        removeUnusedRowsAndColumns(allShips);
    }

    const handleLineupClick = (grid: Grid) => {
        setModalPickerTarget(grid);
        setLineupModalOpen(true);
    }

    const closeLineupModalPicker = () => {
        setModalPickerTarget(null);
        setLineupModalOpen(false);
    }

    const addColLeft = () => {
        if (cols < 5) {
            setCols(cols + 1);
            ships.forEach(ship => {
                ship.col += 1;
            });
            setShips(ships);
        }
    }

    const addColRight = () => {
        if (cols < 5) {
            setCols(cols + 1);
        }
    }

    const addRow = () => {
        if (rows < 50) {
            setRows(rows + 1);
        }
    }

    const handleMoveCells = (from: Grid, to: Grid) => {
        setShips(prev => moveOrSwapCells(prev, from, to));
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
    }

    const clearPositions = () => {
        setShips(ships.map(ship => {
            ship.row = ship.col = null;
            return ship;
        }));
    }

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
    }

    const capturePng = () => {
        document.body.classList.add('no-print');

        html2canvas(document.body, {
            scrollX: 0,
            scrollY: 0,
            windowWidth: Math.max(document.documentElement.scrollWidth, 800),
        }).then(c => {
            document.body.classList.remove('no-print');

            const a = document.createElement('a');
            a.href = c.toDataURL('image/png');
            a.download = 'lineup.png';
            a.click();
        });
    }

    useEffect(() => {
        resizeLabelArrays();

        // Skip if no rows, or if one empty row
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

    useEffect(() => {
        if (setup && setup.isDefault !== true) {
            localStorage.setItem('setup', JSON.stringify(setup));
        }
    }, [setup]);

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
            // Only set roster if we have new format
            if (roster.length > 0 && roster[0].name) {
                setAllShips(cleanupShips(roster));
            }
        }
    }, []);

    return (
        <>
            <h1 className='header'>FlightLineup.com <img src='flight_lineup.png' alt='Flight Lineup logo' /></h1>
            <div className='subtitle no-print'><b>Build a visual lineup of your formation flight.</b> Make it cool and professional. Be the envy of your friends.</div>

            <div className='content'>
                <Pane title='Roster'>
                    <RosterPane ships={ships} setShips={setShips} setAllShips={setAllShips} />
                </Pane>

                <Pane title='Setup'>
                    <SetupPane setup={setup} setSetup={setSetup} />
                </Pane>

                <Pane title='Lineup'>
                    <form className='no-print'>
                        <input type='button' value='Add column (left)' onClick={addColLeft} disabled={cols >= 5} />
                        <input type='button' value='Add row' onClick={addRow} disabled={rows >= 50} />
                        <input type='button' value='Add column (right)' onClick={addColRight} disabled={cols >= 5} />
                        <input type='button' value='Remove unused rows and columns' onClick={() => removeUnusedRowsAndColumns(ships)} />
                        <input type='button' value='Clear lineup' onClick={() => setClearModalOpen(true)} />
                    </form>
                    <Modal isOpen={clearModalOpen} setIsOpen={() => setClearModalOpen(false)} handleClick={() => setClearModalOpen(false)}>
                        <div>
                            <p>Are you sure you want to clear the lineup?</p>
                            <input type='button' value='Yes' className='modal-control' onClick={() => { clearPositions(); setClearModalOpen(false); }} />
                            <input type='button' value='No' className='modal-control' onClick={() => setClearModalOpen(false)} />
                        </div>
                    </Modal>
                    <LineupPane setup={setup} setSetup={setSetup} ships={ships} rows={rows} cols={cols} handleClick={handleLineupClick} onMoveCells={handleMoveCells} />

                    <form>
                        <input type='button' className='no-print' value='Download PNG' onClick={() => capturePng()} />
                        <input type='button' className='no-print' value='Print' onClick={() => window.print()} />
                        <input type='button' className='no-print' value='Share' onClick={() => setShareModalOpen(true)} />
                    </form>
                </Pane>
            </div>

            <div className='privacy no-print'>Your data is not sent anywhere. All processing and storage happens within your web browser.</div>
            <div className='contact'>Questions? Feedback? Mail <a href='mailto:dan@adverseyaw.com'>dan@adverseyaw.com</a></div>

            <Modal isOpen={lineupModalOpen} setIsOpen={closeLineupModalPicker}>
                <PlanePicker setup={setup} grid={modalPickerTarget} signalComplete={closeLineupModalPicker} ships={ships} setShips={setShips} />
            </Modal>

            <Modal isOpen={shareModalOpen} setIsOpen={setShareModalOpen}>
                <Share setup={setup} ships={ships} signalComplete={() => setShareModalOpen(false)} />
            </Modal>
        </>
    );
};

export default App;
