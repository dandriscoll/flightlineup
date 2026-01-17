import React from 'react';
import { Setup, Ship } from '../../../types';
import TileConfig from '../shared/TileConfig';

interface FormationModeProps {
    setup: Setup;
    setSetup: (setup: Setup) => void;
    rows: number;
    cols: number;
    ships: Ship[];
    addColLeft: () => void;
    addColRight: () => void;
    addRow: () => void;
    removeUnusedRowsAndColumns: (ships: Ship[]) => void;
}

const FormationMode: React.FC<FormationModeProps> = ({
    setup,
    setSetup,
    rows,
    cols,
    ships,
    addColLeft,
    addColRight,
    addRow,
    removeUnusedRowsAndColumns
}) => {
    const ROW_COLORS = [
        { id: '', label: 'None', color: 'transparent' },
        { id: 'red', label: 'Red', color: '#ef4444' },
        { id: 'white', label: 'White', color: '#ffffff' },
        { id: 'blue', label: 'Blue', color: '#3b82f6' },
        { id: 'green', label: 'Green', color: '#22c55e' },
        { id: 'yellow', label: 'Yellow', color: '#fbbf24' }
    ];

    const handleRowLabel = (row: number, value: string) => {
        const newRowLabels = [...setup.rowLabels];
        newRowLabels[row] = value;
        setSetup({ ...setup, rowLabels: newRowLabels });
    };

    const handleRowColor = (row: number, color: string) => {
        const newRowLabelColors = [...setup.rowLabelColors];
        newRowLabelColors[row] = color;
        setSetup({ ...setup, rowLabelColors: newRowLabelColors });
    };

    const handleColumnLabel = (col: number, value: string) => {
        const newColumnLabels = [...setup.columnLabels];
        newColumnLabels[col] = value;
        setSetup({ ...setup, columnLabels: newColumnLabels });
    };

    return (
        <div className="formation-mode">
            {/* Tile Configuration */}
            <TileConfig setup={setup} setSetup={setSetup} />

            {/* Grid Size Controls */}
            <div className="card mt-6">
                <div className="card-header">
                    <h3 className="card-title">Grid Size</h3>
                    <p className="card-description">Configure the formation grid dimensions</p>
                </div>

                <div className="flex gap-4 items-center mb-4">
                    <span className="text-sm text-secondary">
                        Current size: {rows} rows × {cols} columns
                    </span>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <button
                        className="btn btn-secondary"
                        onClick={addColLeft}
                        disabled={cols >= 5}
                    >
                        + Column (Left)
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={addRow}
                        disabled={rows >= 50}
                    >
                        + Row
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={addColRight}
                        disabled={cols >= 5}
                    >
                        + Column (Right)
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => removeUnusedRowsAndColumns(ships)}
                    >
                        Remove Unused
                    </button>
                </div>
            </div>

            {/* Row Labels (when enabled) */}
            {setup.labels && (
                <div className="card mt-6">
                    <div className="card-header">
                        <h3 className="card-title">Row Labels</h3>
                        <p className="card-description">Set labels and colors for each row</p>
                    </div>

                    <div className="row-labels-list">
                        {Array.from({ length: rows }, (_, row) => (
                            <div key={row} className="row-label-item">
                                <span className="row-number">Row {row + 1}</span>
                                <input
                                    type="text"
                                    value={setup.rowLabels[row] ?? ''}
                                    onChange={(e) => handleRowLabel(row, e.target.value)}
                                    placeholder="Enter row label..."
                                    className="form-input"
                                />
                                <div className="color-picker">
                                    {ROW_COLORS.map((c) => (
                                        <div
                                            key={c.id}
                                            className={`color-swatch ${c.id} ${setup.rowLabelColors[row] === c.id ? 'active' : ''}`}
                                            style={{ backgroundColor: c.color }}
                                            onClick={() => handleRowColor(row, c.id)}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Column Labels (when enabled) */}
            {setup.labels && (
                <div className="card mt-6">
                    <div className="card-header">
                        <h3 className="card-title">Column Labels</h3>
                        <p className="card-description">Set labels for each column</p>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        {Array.from({ length: cols }, (_, col) => (
                            <div key={col} className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                                <label className="form-label">Column {col + 1}</label>
                                <input
                                    type="text"
                                    value={setup.columnLabels[col] ?? ''}
                                    onChange={(e) => handleColumnLabel(col, e.target.value)}
                                    placeholder="Label..."
                                    className="form-input"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormationMode;
