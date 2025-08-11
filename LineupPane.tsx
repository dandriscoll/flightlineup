import React from 'react';
import { FormattedShip, Grid, Setup } from './types';
import Tile from './Tile';

interface LineupProps {
    setup: Setup;
    setSetup: (setup: Setup) => void;
    ships: FormattedShip[];
    rows: number;
    cols: number;
    handleClick: (grid: Grid, seat: number) => void;
}

const LineupPane: React.FC<LineupProps> = ({ setup, setSetup, ships, rows, cols, handleClick }) => {
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
        <div className={`lineup-container c${cols} ${setup.labels ? 'labels' : ''}`}>
            {setup.labels && (
                <>
                <div className='linup-cell'>
                </div>
                {Array.from({ length: cols }, (_, col) => (
                    <div key={`label-${col}`} className='lineup-cell lineup-label'>
                        <input
                            type='text'
                            value={setup.columnLabels[col]}
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
                        {setup.labels && (
                            <div className={`lineup-cell lineup-label ${setup.rowLabelColors[row] ? `label-color-${setup.rowLabelColors[row]}` : ''}`}>
                                <input
                                    type='text'
                                    value={setup.rowLabels[row]}
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
                            </div>
                        )}
                        {Array.from({ length: cols }, (_, col) => {
                            const ship = ships.find(s => s.row === row && s.col === col && !s.seat);
                            const occupants = ships.filter(s => s.row === row && s.col === col && s.seat >= 1);
                            const grid: Grid = { row, col, seat: null };

                            if (!ship) {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell empty' onClick={() => handleClick(grid)}>
                                        <div className='lineup-cell-inner'>
                                        Click to set
                                        </div>
                                    </div>
                                );
                            }

                            if (setup.occupants) {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell'>
                                        <div className='lineup-cell-inner'  onClick={() => handleClick(grid)} >
                                            <Tile setup={setup} ship={ship} />
                                        </div>
                                        {occupants && [1,2,3].slice(0, occupants.length).map((seat) => {
                                            const occupant = occupants.find(o => o.seat === seat);
                                            return occupant && (
                                                <div key={seat} className='lineup-occupant' onClick={() => handleClick({ ...grid, seat: seat })} >
                                                    <Tile setup={setup} ship={occupant} forOccupant={true} />
                                                </div>
                                            );
                                        })}
                                        {occupants && occupants.length <= 3 && (
                                            <div className='lineup-occupant-add no-print' onClick={() => handleClick({ ...grid, seat: (occupants?.length ?? 0) + 1})}>Add occupant</div>
                                        )}
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={`${row}-${col}`} className='lineup-cell'>
                                        <div className='lineup-cell-inner' onClick={() => handleClick(grid)} >
                                            <Tile setup={setup} ship={ship}/>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </React.Fragment>
                )}
            )}
        </div>
    );
}

export default LineupPane;