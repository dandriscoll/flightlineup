import React from 'react';
import { FormattedShip, Grid, Setup } from '../../types';
import Tile from '../Tile';

interface LineupProps {
    setup: Setup;
    setSetup: (setup: Setup) => void;
    ships: FormattedShip[];
    rows: number;
    cols: number;
    handleClick: (grid: Grid, seat: number) => void;
    onMoveCells: (from: Grid, to: Grid) => void;
    onMoveRows: (fromRow: number, toRow: number) => void;
}


const LineupPane: React.FC<LineupProps> = ({ setup, setSetup, ships, rows, cols, handleClick, onMoveCells, onMoveRows }) => {

    // getPrimaryAt is a helper function that returns true if a primary ship is present at the given row/col
    const getPrimaryAt = (row: number, col: number) =>
        ships.find(s => s.row === row && s.col === col && s.seat === null || s.seat === 0);

    const onDragStart = (e: React.DragEvent, from: Grid) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify(from));
    }

    const onDragOver = (e: React.DragEvent) => {
        // must preventDefault to allow dropping
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (e: React.DragEvent, to: Grid) => {
        e.preventDefault();
        try {
            const raw = e.dataTransfer.getData('application/json');
            if (!raw) return;
            const from: Grid = JSON.parse(raw);
            if (from.row === to.row && from.col === to.col) return; // no move
            onMoveCells(from, to);
        } catch { }
    };


    const onRowDragStart = (e: React.DragEvent, fromRow: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/x-row', String(fromRow));
    };

    const onRowDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const onRowDrop = (e: React.DragEvent, toRow: number) => {
        e.preventDefault();
        const raw = e.dataTransfer.getData('application/x-row');
        if (raw === '') return;
        const fromRow = Number(raw);
        if (Number.isNaN(fromRow) || fromRow === toRow) return; // no move
        onMoveRows(fromRow, toRow);
    };

    const handleColumnLabel = (e: React.ChangeEvent<HTMLInputElement>, column: number) => {
        const newColumnLabels = [...setup.columnLabels];
        newColumnLabels[column] = e.target.value;
        setSetup({ ...setup, columnLabels: newColumnLabels });
    };

    const handleRowLabel = (e: React.ChangeEvent<HTMLInputElement>, row: number) => {
        const newRowLabels = [...setup.rowLabels];
        newRowLabels[row] = e.target.value;
        setSetup({ ...setup, rowLabels: newRowLabels });
    };

    return (
        <div className={`lineup-container c${cols} ${setup.labels ? 'labels' : 'has-row-handle'}`}>
            {setup.labels && (
                <>
                    <div className='lineup-cell'>
                    </div>
                    {Array.from({ length: cols }, (_, col) => (
                        <div key={`label-${col}`} className='lineup-cell lineup-label'>
                            <input
                                type='text'
                                value={setup.columnLabels[col] ?? ""}
                                onChange={(e) => handleColumnLabel(e, col)}
                                aria-label={`Label for column ${col}`}
                                placeholder='Column label'
                                className='lineup-label-input'
                            />
                        </div>
                    ))}
                </>
            )}

            {Array.from({ length: rows }, (_, row) => {
                return (
                    <React.Fragment key={`row-${row}`}>
                        <div className={`lineup-cell lineup-label ${setup.rowLabelColors[row] ? `label-color-${setup.rowLabelColors[row]}` : ''}`}
                            onDragOver={onRowDragOver}
                            onDrop={(e) => { onRowDrop(e, row) }}
                        >
                            <span
                                className="drag-handle"
                                onClick={(e) => e.stopPropagation()} // don’t trigger label click
                                draggable
                                onDragStart={(e) => onRowDragStart(e, row)}
                            >
                                ⋮⋮
                            </span>
                            {setup.labels && (
                                <>
                                    <input
                                        type='text'
                                        value={setup.rowLabels[row] ?? ""}
                                        onChange={(e) => handleRowLabel(e, row)}
                                        aria-label={`Label for row ${row}`}
                                        className='lineup-label-input'
                                    />
                                    <button
                                        tabIndex={-1}
                                        className="color-button no-print"
                                        onClick={(e) => {
                                            const colors = ['red', 'white', 'blue', 'green', 'yellow'];
                                            const colorPicker = document.createElement('div');
                                            colorPicker.style.position = 'absolute';
                                            colorPicker.style.display = 'flex';
                                            colorPicker.style.gap = '5px';
                                            colorPicker.style.padding = '5px';
                                            colorPicker.style.backgroundColor = 'white';
                                            colorPicker.style.border = '1px solid black';
                                            colorPicker.style.borderRadius = '5px';

                                            colors.forEach(color => {
                                                const option = document.createElement('div');
                                                option.style.width = '20px';
                                                option.style.height = '20px';
                                                option.style.backgroundColor = color;
                                                option.style.cursor = 'pointer';
                                                option.onclick = () => {
                                                    if (setup.rowLabelColors[row] == color) {
                                                        color = ''
                                                    }
                                                    const newRowLabelColors = [...setup.rowLabelColors];
                                                    newRowLabelColors[row] = color;
                                                    setSetup({ ...setup, rowLabelColors: newRowLabelColors });
                                                    document.body.removeChild(colorPicker);
                                                };
                                                colorPicker.appendChild(option);
                                            });

                                            colorPicker.style.top = `${e.pageY + 20}px`;
                                            colorPicker.style.left = `${e.pageX}px`;
                                            document.body.appendChild(colorPicker);
                                        }}
                                    >
                                        🎨
                                    </button>
                                </>
                            )}
                        </div>
                        {Array.from({ length: cols }, (_, col) => {
                            const ship = ships.find(s => s.row === row && s.col === col && !s.seat);
                            const occupants = ships.filter(s => s.row === row && s.col === col && s.seat >= 1);
                            const grid: Grid = { row, col, seat: null };

                            // Make the cell drop a target regardless of contexts
                            const dropHandlers = {
                                onDragOver,
                                onDrop: (e: React.DragEvent) => onDrop(e, grid),
                            };

                            if (!ship) {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell empty' {...dropHandlers} onClick={() => handleClick(grid)}>
                                        <div className='lineup-cell-inner'>
                                            Click to set
                                        </div>
                                    </div>
                                );
                            }

                            // draggable source + droppable target (for swap)
                            const primary = getPrimaryAt(row, col);
                            const draggableProps = primary ? {
                                draggable: true,
                                onDragStart: (e: React.DragEvent) => onDragStart(e, grid),
                                onDragOver,
                            } : {};

                            if (setup.occupants) {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell' {...dropHandlers}>
                                        <div className='lineup-cell-inner' onClick={() => handleClick(grid)} {...draggableProps} >
                                            <Tile setup={setup} ship={ship} />
                                        </div>
                                        {occupants && [1, 2, 3].slice(0, occupants.length).map((seat) => {
                                            const occupant = occupants.find(o => o.seat === seat);
                                            return occupant && (
                                                <div key={seat} className='lineup-occupant' onClick={() => handleClick({ ...grid, seat: seat })} >
                                                    <Tile setup={setup} ship={occupant} forOccupant={true} />
                                                </div>
                                            );
                                        })}
                                        {occupants && occupants.length <= 3 && (
                                            <div className='lineup-occupant-add no-print' onClick={() => handleClick({ ...grid, seat: (occupants?.length ?? 0) + 1 })}>Add occupant</div>
                                        )}
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell' {...dropHandlers}>
                                        <div className='lineup-cell-inner' onClick={() => handleClick(grid)} {...draggableProps} >
                                            <Tile setup={setup} ship={ship} />
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </React.Fragment>
                )
            }
            )}
        </div>
    );
}

export default LineupPane;