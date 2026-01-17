import React from 'react';
import { FormattedShip, Grid, Setup } from '../../../types';
import Tile from './Tile';

interface LineupGridProps {
    setup: Setup;
    setSetup: (setup: Setup) => void;
    ships: FormattedShip[];
    rows: number;
    cols: number;
    handleClick: (grid: Grid, seat?: number) => void;
    onMoveCells: (from: Grid, to: Grid) => void;
    onMoveRows: (fromRow: number, toRow: number) => void;
    readOnly?: boolean;
}

const LineupGrid: React.FC<LineupGridProps> = ({
    setup,
    setSetup,
    ships,
    rows,
    cols,
    handleClick,
    onMoveCells,
    onMoveRows,
    readOnly = false
}) => {
    // getPrimaryAt is a helper function that returns true if a primary ship is present at the given row/col
    const getPrimaryAt = (row: number, col: number) =>
        ships.find(s => s.row === row && s.col === col && s.seat === null || s.seat === 0);

    const onDragStart = (e: React.DragEvent, from: Grid) => {
        if (readOnly) return;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify(from));
    };

    const onDragOver = (e: React.DragEvent) => {
        if (readOnly) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (e: React.DragEvent, to: Grid) => {
        if (readOnly) return;
        e.preventDefault();
        try {
            const raw = e.dataTransfer.getData('application/json');
            if (!raw) return;
            const from: Grid = JSON.parse(raw);
            if (from.row === to.row && from.col === to.col) return;
            onMoveCells(from, to);
        } catch { }
    };

    const onRowDragStart = (e: React.DragEvent, fromRow: number) => {
        if (readOnly) return;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/x-row', String(fromRow));
    };

    const onRowDragOver = (e: React.DragEvent) => {
        if (readOnly) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const onRowDrop = (e: React.DragEvent, toRow: number) => {
        if (readOnly) return;
        e.preventDefault();
        const raw = e.dataTransfer.getData('application/x-row');
        if (raw === '') return;
        const fromRow = Number(raw);
        if (Number.isNaN(fromRow) || fromRow === toRow) return;
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
                                readOnly={readOnly}
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
                            {!readOnly && (
                                <span
                                    className="drag-handle no-print"
                                    onClick={(e) => e.stopPropagation()}
                                    draggable
                                    onDragStart={(e) => onRowDragStart(e, row)}
                                >
                                    ⋮⋮
                                </span>
                            )}
                            {setup.labels && (
                                <>
                                    <input
                                        type='text'
                                        value={setup.rowLabels[row] ?? ""}
                                        onChange={(e) => handleRowLabel(e, row)}
                                        aria-label={`Label for row ${row}`}
                                        className='lineup-label-input'
                                        readOnly={readOnly}
                                    />
                                    {!readOnly && (
                                        <button
                                            tabIndex={-1}
                                            className="color-button no-print btn btn-ghost btn-sm"
                                            onClick={(e) => {
                                                const existing = document.getElementById("color-picker-row-" + row);
                                                if (existing) {
                                                    document.body.removeChild(existing);
                                                    return;
                                                }
                                                const colors = ['red', 'white', 'blue', 'green', 'yellow'];
                                                const colorPicker = document.createElement('div');
                                                colorPicker.id = 'color-picker-row-' + row;
                                                colorPicker.style.position = 'absolute';
                                                colorPicker.style.display = 'flex';
                                                colorPicker.style.gap = '5px';
                                                colorPicker.style.padding = '8px';
                                                colorPicker.style.backgroundColor = 'white';
                                                colorPicker.style.border = '1px solid #e2e8f0';
                                                colorPicker.style.borderRadius = '8px';
                                                colorPicker.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                                colorPicker.style.top = `${e.pageY + 20}px`;
                                                colorPicker.style.left = `${e.pageX}px`;
                                                colorPicker.style.zIndex = '9999';

                                                colorPicker.addEventListener('click', ev => ev.stopPropagation());

                                                colors.forEach(color => {
                                                    const option = document.createElement('div');
                                                    option.style.width = '24px';
                                                    option.style.height = '24px';
                                                    option.style.backgroundColor = color;
                                                    option.style.cursor = 'pointer';
                                                    option.style.borderRadius = '4px';
                                                    option.style.border = color === 'white' ? '1px solid #e2e8f0' : 'none';
                                                    option.onclick = () => {
                                                        setSetup(prev => {
                                                            const newRowLabelColors = [...prev.rowLabelColors];
                                                            newRowLabelColors[row] =
                                                                newRowLabelColors[row] === color ? '' : color;
                                                            return { ...prev, rowLabelColors: newRowLabelColors };
                                                        });
                                                        document.body.removeChild(colorPicker);
                                                    };
                                                    colorPicker.appendChild(option);
                                                });
                                                document.body.appendChild(colorPicker);
                                            }}
                                        >
                                            🎨
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        {Array.from({ length: cols }, (_, col) => {
                            const ship = ships.find(s => s.row === row && s.col === col && !s.seat);
                            const occupants = ships.filter(s => s.row === row && s.col === col && s.seat >= 1);
                            const grid: Grid = { row, col, seat: null };

                            const dropHandlers = readOnly ? {} : {
                                onDragOver,
                                onDrop: (e: React.DragEvent) => onDrop(e, grid),
                            };

                            if (!ship) {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell empty' {...dropHandlers} onClick={() => !readOnly && handleClick(grid)}>
                                        <div className='lineup-cell-inner'>
                                            {!readOnly && 'Click to set'}
                                        </div>
                                    </div>
                                );
                            }

                            const primary = getPrimaryAt(row, col);
                            const draggableProps = primary && !readOnly ? {
                                draggable: true,
                                onDragStart: (e: React.DragEvent) => onDragStart(e, grid),
                                onDragOver,
                            } : {};

                            if (setup.occupants) {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell' {...dropHandlers}>
                                        <div className='lineup-cell-inner' onClick={() => !readOnly && handleClick(grid)} {...draggableProps} >
                                            <Tile setup={setup} ship={ship} />
                                        </div>
                                        {occupants && [1, 2, 3].slice(0, occupants.length).map((seat) => {
                                            const occupant = occupants.find(o => o.seat === seat);
                                            return occupant && (
                                                <div key={seat} className='lineup-occupant' onClick={() => !readOnly && handleClick({ ...grid, seat: seat })} >
                                                    <Tile setup={setup} ship={occupant} forOccupant={true} />
                                                </div>
                                            );
                                        })}
                                        {!readOnly && occupants && occupants.length <= 3 && (
                                            <div className='lineup-occupant-add no-print' onClick={() => handleClick({ ...grid, seat: (occupants?.length ?? 0) + 1 })}>Add occupant</div>
                                        )}
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell' {...dropHandlers}>
                                        <div className='lineup-cell-inner' onClick={() => !readOnly && handleClick(grid)} {...draggableProps} >
                                            <Tile setup={setup} ship={ship} />
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </React.Fragment>
                );
            }
            )}
        </div>
    );
};

export default LineupGrid;
