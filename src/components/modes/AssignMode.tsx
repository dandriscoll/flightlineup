import React, { useState } from 'react';
import { Ship, Grid, Setup } from '../../../types';
import LineupGrid from '../shared/LineupGrid';
import Modal from '../shared/Modal';
import PlanePicker from '../shared/PlanePicker';

interface AssignModeProps {
    setup: Setup;
    setSetup: (setup: Setup) => void;
    ships: Ship[];
    setShips: (ships: Ship[]) => void;
    rows: number;
    cols: number;
    onMoveCells: (from: Grid, to: Grid) => void;
    onMoveRows: (fromRow: number, toRow: number) => void;
}

const AssignMode: React.FC<AssignModeProps> = ({
    setup,
    setSetup,
    ships,
    setShips,
    rows,
    cols,
    onMoveCells,
    onMoveRows
}) => {
    const [modalPickerTarget, setModalPickerTarget] = useState<Grid>(null);
    const [lineupModalOpen, setLineupModalOpen] = useState<boolean>(false);
    const [clearModalOpen, setClearModalOpen] = useState<boolean>(false);

    const handleLineupClick = (grid: Grid) => {
        setModalPickerTarget(grid);
        setLineupModalOpen(true);
    };

    const closeLineupModalPicker = () => {
        setModalPickerTarget(null);
        setLineupModalOpen(false);
    };

    const clearPositions = () => {
        setShips(ships.map(ship => ({
            ...ship,
            row: null,
            col: null,
            seat: null
        })));
    };

    // Count assigned and unassigned ships
    const definedShips = ships.filter(s => s.name || s.tail || s.type || s.qualification || s.squadron);
    const assignedShips = definedShips.filter(s => s.row !== null);
    const unassignedShips = definedShips.filter(s => s.row === null);

    return (
        <div className="assign-mode">
            {/* Stats */}
            <div className="card mb-6">
                <div className="flex gap-6 items-center">
                    <div>
                        <span className="text-2xl font-semibold">{assignedShips.length}</span>
                        <span className="text-sm text-secondary ml-2">assigned</span>
                    </div>
                    <div>
                        <span className="text-2xl font-semibold">{unassignedShips.length}</span>
                        <span className="text-sm text-secondary ml-2">unassigned</span>
                    </div>
                    <div className="flex-1" />
                    <button
                        className="btn btn-ghost"
                        onClick={() => setClearModalOpen(true)}
                        disabled={assignedShips.length === 0}
                    >
                        Clear All Positions
                    </button>
                </div>
            </div>

            {/* Clear Modal */}
            <Modal isOpen={clearModalOpen} setIsOpen={setClearModalOpen} title="Clear Lineup">
                <div>
                    <p>Are you sure you want to remove all ships from the formation grid?</p>
                    <p className="text-sm text-secondary mt-2">This will not delete ships from your roster.</p>
                    <div className="flex gap-4 mt-6">
                        <button
                            className="btn btn-danger flex-1"
                            onClick={() => { clearPositions(); setClearModalOpen(false); }}
                        >
                            Yes, Clear Lineup
                        </button>
                        <button
                            className="btn btn-secondary flex-1"
                            onClick={() => setClearModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Lineup Grid */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Formation Grid</h3>
                    <p className="card-description">Click cells to assign ships, drag to rearrange positions</p>
                </div>

                <LineupGrid
                    setup={setup}
                    setSetup={setSetup}
                    ships={ships}
                    rows={rows}
                    cols={cols}
                    handleClick={handleLineupClick}
                    onMoveCells={onMoveCells}
                    onMoveRows={onMoveRows}
                />

                <div className="mt-4 text-sm text-secondary">
                    <strong>Tips:</strong> Drag ships between cells to swap positions. Drag the ⋮⋮ handle to swap entire rows.
                </div>
            </div>

            {/* Plane Picker Modal */}
            <Modal isOpen={lineupModalOpen} setIsOpen={closeLineupModalPicker}>
                <PlanePicker
                    setup={setup}
                    grid={modalPickerTarget}
                    ships={ships}
                    setShips={setShips}
                    signalComplete={closeLineupModalPicker}
                />
            </Modal>
        </div>
    );
};

export default AssignMode;
