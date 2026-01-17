import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Ship, Grid, Setup } from '../../../types';
import Tile from './Tile';

interface PlanePickerProps {
    setup: Setup;
    grid: Grid;
    ships: Ship[];
    setShips?: (ships: Ship[]) => void;
    signalComplete: (open: boolean) => void;
}

const PlanePicker: React.FC<PlanePickerProps> = ({ setup, grid, ships, setShips, signalComplete }) => {
    const [selectedShip, setSelectedShip] = useState<Ship>(null);
    const [availableShips, setAvailableShips] = useState<Ship[]>([]);
    const [assignedShips, setAssignedShips] = useState<Ship[]>([]);
    const [filteredShips, setFilteredShips] = useState<Ship[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const forOccupant = useMemo(() => grid && grid.seat != null, [grid]);

    const handleSelect = (e, ship) => {
        e.preventDefault();
        ships.forEach(s => {
            if (grid.seat) {
                if (s.row === grid.row && s.col === grid.col && s.seat === grid.seat) {
                    s.row = null;
                    s.col = null;
                    s.seat = null;
                }
            } else {
                if (s.row === grid.row && s.col === grid.col) {
                    s.row = null;
                    s.col = null;
                    s.seat = null;
                }
            }
        });

        if (ship) {
            ship.row = grid.row;
            ship.col = grid.col;
            ship.seat = grid.seat;
        }

        var shipsAtSamePosition = ships.filter(s => s.row === grid.row && s.col === grid.col);
        if (ship && !shipsAtSamePosition.includes(ship)) {
            shipsAtSamePosition.push(ship);
        }

        if (!ship && !grid.seat) {
            // Clear out all seats if the plane is deselected
            shipsAtSamePosition.forEach(s => {
                s.row = null;
                s.col = null;
                s.seat = null;
            });
        } else {
            // Reflow seats
            shipsAtSamePosition.sort((a, b) => (a.seat || 0) - (b.seat || 0));
            shipsAtSamePosition.forEach((s, index) => {
                if (index == 0) {
                    s.seat = null;
                } else {
                    s.seat = index;
                }
            });
        }

        setShips([...ships]);
        setSearchText('');
        signalComplete(true);
    };

    useEffect(() => {
        const definedShips = ships.filter(s => { return s.name || s.tail || s.type || s.qualification || s.squadron });
        if (grid) {
            setSelectedShip(definedShips.find(s => s.row === grid.row && s.col === grid.col && s.seat === grid.seat));
        } else {
            setSelectedShip(null);
        }
        setAvailableShips(definedShips.filter(s => s.row === null));
        setAssignedShips(definedShips.filter(s => s.row !== null && !(grid && s.row === grid.row && s.col === grid.col && s.seat === grid.seat)));
    }, [ships, grid]);

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
        setFilteredShips(ships.filter(s => shipMatchesText(s, e.target.value)));
    };

    const shipMatchesText = (s, text) => {
        if (!s || !text) {
            return false;
        }

        const fields = [s.name, s.tail, s.type, s.qualification, s.squadron];

        return fields.some(field => field && field.toLowerCase().includes(text.toLowerCase()));
    };

    const handleKeypressCallback = useCallback((e) => {
        if (!grid) {
            return;
        }

        const input = document.getElementById('search-text') as HTMLInputElement;
        if (input) {
            if (e.key.match(/^[a-zA-Z0-9]$/)) {
                if (!input.matches(':focus')) {
                    input.focus();
                }
            } else if (e.key === 'Escape') {
                if (searchText) {
                    setSearchText('');
                } else {
                    signalComplete(true);
                }
            }
        } else if (e.key === 'Escape') {
            signalComplete(true);
        }
    }, [grid, searchText]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeypressCallback);
        return () => {
            document.removeEventListener('keydown', handleKeypressCallback);
        };
    }, [handleKeypressCallback]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (filteredShips.length === 1) {
            handleSelect(e, filteredShips[0]);
        }
    };

    return (
        <div className='plane-pick' onClick={(e) => e.stopPropagation()}>
            <div className='close-button' onClick={() => signalComplete(true)}>
                <button>X</button>
            </div>
            <div className='plane-all'>
                {selectedShip &&
                    <>
                        <h3>Selected {forOccupant ? 'occupant' : 'ship'}:</h3>
                        <ul>
                            <li key={selectedShip.name + selectedShip.tail} onClick={(e) => handleSelect(e, null)}>
                                <Tile setup={setup} ship={selectedShip} forOccupant={forOccupant} />
                                Click to remove this ship from this slot.
                            </li>
                        </ul>
                    </>
                }
                {availableShips.length > 0 && !searchText &&
                    <>
                        <h3>Available {forOccupant ? 'people' : 'ships'}:</h3>
                        <ul>
                            {availableShips.map(ship => (
                                <li key={ship.name + ship.tail} onClick={(e) => handleSelect(e, ship)}>
                                    <Tile setup={setup} ship={ship} forOccupant={forOccupant} />
                                </li>
                            ))}
                        </ul>
                    </>
                }
                {assignedShips.length > 0 && !searchText &&
                    <>
                        <h3>{forOccupant ? 'People' : 'Ships'} assigned to other slots:</h3>
                        <ul>
                            {assignedShips.map(ship => (
                                <li key={ship.name + ship.tail} onClick={(e) => handleSelect(e, ship)}>
                                    <Tile setup={setup} ship={ship} forOccupant={forOccupant} />
                                </li>
                            ))}
                        </ul>
                    </>
                }
                {searchText &&
                    <ul>
                        {filteredShips.map(ship => (
                            <li key={ship.name + ship.tail} onClick={(e) => handleSelect(e, ship)}>
                                <Tile setup={setup} ship={ship} forOccupant={forOccupant} />
                            </li>
                        ))}
                    </ul>
                }
                {!selectedShip && availableShips.length == 0 && assignedShips.length == 0 && !searchText &&
                    <>
                        <h3>Enter your roster to get started</h3>
                        <div>
                            Close this dialog and enter the planes in your flight in the 'Roster' tab.
                        </div>
                    </>
                }
            </div>
            {(availableShips.length + assignedShips.length > 0) &&
                <div className='search-text'>
                    <form className='search-text' onSubmit={handleSubmit}>
                        <input type='text' id='search-text' value={searchText} placeholder='Search...' onChange={handleSearchTextChange} />
                    </form>
                </div>
            }
        </div>
    );
};

export default PlanePicker;
