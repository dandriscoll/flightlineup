import React, { useState, useEffect } from 'react';
import Modal from './Modal.tsx';
import { Ship, CanonicalTypes, CanonicalQualifications, CanonicalSquadrons } from './types';
import { generateCsv, parseCsvRoster, addEmptyRow, hasEmptyRow } from './rosterTools';

interface RosterPaneProps {
    ships: Ship[];
    setShips: (ships: Ship[]) => void;
    setAllShips: (ships: Ship[]) => void;
}

const RosterPane: React.FC<RosterPaneProps> = ({ ships, setShips, setAllShips }) => {
    const [clearModalOpen, setClearModalOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, property: keyof Ship, index: number) => {
        const updatedShip = { ...ships[index], [property]: e.target.value };
        const updatedShips = [...ships];
        updatedShips[index] = updatedShip;
        setShips && setShips(updatedShips);
    };

    const addRow = () => {
        const updatedShips = addEmptyRow(ships);
        setShips(updatedShips);
        setTimeout(() => {
            const newRowInput = document.getElementById(`ship-${updatedShips.length - 1}-row1`);
            newRowInput?.focus();
        }, 0);
    }

    const importCsv = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const csv = event.target?.result as string;
                    if (csv) {
                        const newShips = parseCsvRoster(csv);
                        setAllShips(newShips);
                    }
                };
                reader.readAsText(file);
            }
        });

        fileInput.click();
    }

    const exportCsv = () => {
        const csv = generateCsv(ships);

        const downloadCsv = (csv: string, filename: string) => {
            const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const csvUrl = URL.createObjectURL(csvData);
            const tempLink = document.createElement('a');
            tempLink.href = csvUrl;
            tempLink.setAttribute('download', filename);
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        };

        downloadCsv(csv, 'roster.csv');
    }

    const ensureBlankRow = () => {
        if (!hasEmptyRow(ships)) {
            setShips(addEmptyRow(ships));
        }
    }

    useEffect(ensureBlankRow, [ships]);
    useEffect(ensureBlankRow, []);

    return (
        <form className='roster-pane no-print'>
            <Modal isOpen={clearModalOpen} setIsOpen={() => setClearModalOpen(false)} handleClick={() => setClearModalOpen(false)}>
                <div>
                    <p>Are you sure you want to clear the roster?</p>
                    <input type='button' value='Yes' className='modal-control' onClick={() => { setShips([]); setClearModalOpen(false); }} />
                    <input type='button' value='No' className='modal-control' onClick={() => setClearModalOpen(false)} />
                </div>
            </Modal>

            <table className='roster-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Tail</th>
                        <th>Type</th>
                        <th>Qualification</th>
                        <th>Squadron</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {ships.map((ship, index) => (
                    <tr key={index}>
                        <td>
                            <input
                                type='text'
                                className='name'
                                id={`ship-${index}-name`}
                                value={ship.name ?? ''}
                                aria-label={`Name for ship ${index}`}
                                onChange={(e) => handleInputChange(e, 'name', index)}
                            />
                        </td>
                        <td>
                            <input
                                type='text'
                                className='tail'
                                id={`ship-${index}-tail`}
                                value={ship.tail ?? ''}
                                aria-label={`Tail number for ship ${index}`}
                                onChange={(e) => handleInputChange(e, 'tail', index)}
                            />
                        </td>
                        <td>
                            <input
                                type='text'
                                className='type'
                                id={`ship-${index}-type`}
                                value={ship.type ?? ''}
                                list='canonical-types'
                                aria-label={`Type for ship ${index}`}
                                onChange={(e) => handleInputChange(e, 'type', index)}
                            />
                            <datalist id='canonical-types'>
                                {CanonicalTypes.map((type, i) => (
                                    <option key={i} value={type} />
                                ))}
                            </datalist>
                        </td>
                        <td>
                            <input
                                type='text'
                                className='qualification'
                                id={`ship-${index}-qualification`}
                                value={ship.qualification ?? ''}
                                list='canonical-qualifications'
                                aria-label={`Qualification for ship ${index}`}
                                onChange={(e) => handleInputChange(e, 'qualification', index)}
                            />
                            <datalist id='canonical-qualifications'>
                                {CanonicalQualifications.map((qualification, i) => (
                                    <option key={i} value={qualification} />
                                ))}
                            </datalist>
                        </td>
                        <td>
                            <input
                                type='text'
                                className='squadron'
                                id={`ship-${index}-squadron`}
                                value={ship.squadron ?? ''}
                                list='canonical-squadrons'
                                aria-label={`Squadron for ship ${index}`}
                                onChange={(e) => handleInputChange(e, 'squadron', index)}
                            />
                            <datalist id='canonical-squadrons'>
                                {CanonicalSquadrons.map((squadron, i) => (
                                    <option key={i} value={squadron} />
                                ))}
                            </datalist>
                        </td>
                        <td>
                            <input 
                                type='button' 
                                onClick={() => setShips && setShips(ships.filter((_, i) => i !== index))} 
                                value='x'
                                tabIndex={-1} 
                            />
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={5}>
                        <input type='button' onClick={() => addRow()} value='Add row' />
                        <input type='button' onClick={() => importCsv()} value='Import CSV' />
                        <input type='button' onClick={() => exportCsv()} value='Export CSV' />
                        <input type='button' onClick={() => setClearModalOpen(true)} value='Clear roster' />
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    );
}

export default RosterPane;