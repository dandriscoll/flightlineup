import React, { useState } from 'react';
import { Setup, Ship } from '../../types';
import Tile from '../Tile';

interface SetupPaneProps {
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

const SetupPane: React.FC<SetupPaneProps> = ({ setup, setSetup }) => {
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

    const [open, setOpen] = useState(false); // don't show settings panel initially

    const assignments = getAssignments(setup);

    // toggle a checkbox at (field, position). Only one selection per column
    const toggle = (field: Field, pos: Position) => {
        setSetup(prev => {
            const a = getAssignments(prev);
            const isSelected = a[pos] === field;
            let next = { ...prev };

            if (isSelected) {
                // unassign this column
                next = setAssignments(next, pos, 'none');
            } else {
                // remove this field from any other column
                for (const p of POSITIONS) {
                    if (a[p] === field) next = setAssignments(next, p, 'none');
                }
                // assign this field to the chosen column
                next = setAssignments(next, pos, field);
            }
            return next;
        });
    };

    // disable unchecked boxes in a column if that column already has a selection
    const isDisabled = (field: Field, pos: Position) => {
        const assigned = assignments[pos];
        return assigned !== 'none' && assigned !== field;
    };
    return (
        <div className="setup-pane no-print">
            <div className="preview-pane">
                <div className="preview-header">
                    <h3 className="preview-title">Preview</h3>
                    <button type="button" onClick={() => setOpen(v => !v)} className="preview-settings-btn">⚙️</button>
                </div>
                <Tile setup={setup} ship={exampleShip} />
                <div className="preview-checkbox-row">
                    <label>
                        <input
                            type="checkbox"
                            checked={setup.occupants}
                            onChange={(e) => setSetup({ ...setup, occupants: e.target.checked })}
                        />
                        {' '}Show aircraft occupants
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={setup.labels}
                            onChange={(e) => setSetup({ ...setup, labels: e.target.checked })}
                        />
                        {' '}Set row and column labels
                    </label>
                </div>
            </div>

            {/* settings matrix */}
            {open && (
                <div className="settings-panel">
                    <div className="settings-grid">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Left</th>
                                    <th>Middle (top)</th>
                                    <th>Middle (bottom)</th>
                                    <th>Right</th>
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

export default SetupPane;