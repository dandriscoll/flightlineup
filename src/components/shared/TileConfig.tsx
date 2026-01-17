import React, { useState } from 'react';
import { Setup, Ship } from '../../../types';
import Tile from './Tile';

interface TileConfigProps {
    setup: Setup;
    setSetup: (setup: Setup) => void;
}

const FIELDS = ['name', 'tail', 'type', 'qualification', 'squadron'] as const;
type Field = typeof FIELDS[number];

const POSITIONS = ['left', 'right', 'midTop', 'midBottom'] as const;
type Position = typeof POSITIONS[number];

const getAssignments = (s: Setup): Record<Position, Field | 'none'> => ({
    left: s.leftBadge as Field | 'none',
    right: s.rightBadge as Field | 'none',
    midTop: s.row1 as Field | 'none',
    midBottom: s.row2 as Field | 'none'
});

const setAssignments = (s: Setup, pos: Position, val: Field | 'none'): Setup => {
    const next = { ...s };
    if (pos === 'left') next.leftBadge = val;
    if (pos === 'right') next.rightBadge = val;
    if (pos === 'midTop') next.row1 = val;
    if (pos === 'midBottom') next.row2 = val;
    return next;
};

const TileConfig: React.FC<TileConfigProps> = ({ setup, setSetup }) => {
    const exampleShip: Ship = {
        name: 'Example Name',
        tail: 'N12345',
        type: 'Mooney M20M TLS Bravo',
        qualification: 'Safety Observer',
        squadron: 'Rocky Mountain',
        row: null,
        col: null,
        seat: null
    };

    const [showSettings, setShowSettings] = useState(false);

    const assignments = getAssignments(setup);

    const toggle = (field: Field, pos: Position) => {
        setSetup(prev => {
            const a = getAssignments(prev);
            const isSelected = a[pos] === field;
            let next = { ...prev };

            if (isSelected) {
                next = setAssignments(next, pos, 'none');
            } else {
                for (const p of POSITIONS) {
                    if (a[p] === field) next = setAssignments(next, p, 'none');
                }
                next = setAssignments(next, pos, field);
            }
            return next;
        });
    };

    const isDisabled = (field: Field, pos: Position) => {
        const assigned = assignments[pos];
        return assigned !== 'none' && assigned !== field;
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="card-title">Tile Preview</h3>
                        <p className="card-description">Configure how ships appear in the lineup</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSettings(v => !v)}
                        className="btn btn-ghost"
                    >
                        {showSettings ? 'Hide Settings' : 'Show Settings'}
                    </button>
                </div>
            </div>

            <div className="text-center mb-4">
                <Tile setup={setup} ship={exampleShip} />
            </div>

            <div className="preview-checkbox-row">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={setup.occupants}
                        onChange={(e) => setSetup({ ...setup, occupants: e.target.checked })}
                    />
                    <span>Show aircraft occupants</span>
                </label>

                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={setup.labels}
                        onChange={(e) => setSetup({ ...setup, labels: e.target.checked })}
                    />
                    <span>Set row and column labels</span>
                </label>
            </div>

            {showSettings && (
                <div className="settings-panel mt-4">
                    <div className="settings-grid">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Left Badge</th>
                                    <th>Top Text</th>
                                    <th>Bottom Text</th>
                                    <th>Right Badge</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FIELDS.map((field) => (
                                    <tr key={field}>
                                        <th scope="row" className="row-label">
                                            {field === 'qualification' ? 'Qual level' :
                                                field === 'type' ? 'Aircraft type' :
                                                    field === 'tail' ? 'Tail number' :
                                                        field === 'squadron' ? 'Squadron' : 'Name'}
                                        </th>

                                        {(['left', 'midTop', 'midBottom', 'right'] as Position[]).map((pos) => {
                                            const checked = assignments[pos] === field;
                                            const disabled = !checked && isDisabled(field, pos);
                                            return (
                                                <td key={pos} className={disabled ? 'disabled' : ''}>
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        disabled={disabled}
                                                        onChange={() => toggle(field, pos)}
                                                        aria-label={`${field} in ${pos}`}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TileConfig;
