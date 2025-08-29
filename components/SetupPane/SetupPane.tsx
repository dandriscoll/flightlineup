import React from 'react';
import { Setup, Ship } from '../../types';
import Tile from '../Tile';

interface SetupPaneProps {
    setup: Setup;
    setSetup: (setup: Setup) => void;
}

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, property: keyof Setup) => {
        setSetup({ ...setup, [property]: e.target.value });
    };

    return (
        <form className='setup-pane no-print'>
            <Tile setup={setup} ship={exampleShip} />
            <div className='setup-inputs'>
                <div className='setup-input'>
                    <div className='label'>Left badge</div>
                    <select
                        className='setup-badge'
                        id='setup-left'
                        value={setup.leftBadge}
                        aria-label='Left badge'
                        onChange={(e) => handleInputChange(e, 'leftBadge')}>
                            <option key='none' value='none'>Disable left badge</option>
                            <option key='name' value='name'>Name</option>
                            <option key='tail' value='tail'>Tail number</option>
                            <option key='type' value='type'>Aircraft type</option>
                            <option key='qualification' value='qualification'>Qualification level</option>
                            <option key='squadron' value='squadron'>Mooney Caravan Squadron</option>
                    </select>
                </div>
                <div className='setup-input'>
                    <div className='setup-rows'>
                        <div className='label'>Top row text</div>
                        <select
                            className='setup-row'
                            id='setup-row1'
                            value={setup.row1}
                            aria-label='Row 1'
                            onChange={(e) => handleInputChange(e, 'row1')}>
                                <option key='none' value='none'>No text</option>
                                <option key='name' value='name'>Name</option>
                                <option key='tail' value='tail'>Tail number</option>
                                <option key='type' value='type'>Aircraft type</option>
                                <option key='qualification' value='qualification'>Qualification level</option>
                                <option key='squadron' value='squadron'>Mooney Caravan Squadron</option>
                        </select>
                    </div>
                    <div className='setup-rows'>
                        <div className='label'>Bottom row text</div>
                        <select
                            className='setup-row'
                            id='setup-row2'
                            value={setup.row2}
                            aria-label='Row 2'
                            onChange={(e) => handleInputChange(e, 'row2')}>
                                <option key='none' value='none'>No text</option>
                                <option key='name' value='name'>Name</option>
                                <option key='tail' value='tail'>Tail number</option>
                                <option key='type' value='type'>Aircraft type</option>
                                <option key='qualification' value='qualification'>Qualification level</option>
                                <option key='squadron' value='squadron'>Mooney Caravan Squadron</option>
                        </select>
                    </div>
                </div>
                <div className='setup-input'>
                    <div className='label'>Right badge</div>
                    <select
                        className='setup-badge'
                        id='setup-right'
                        value={setup.rightBadge}
                        aria-label='Right badge'
                        onChange={(e) => handleInputChange(e, 'rightBadge')}>
                            <option key='none' value='none'>Disable left badge</option>
                            <option key='name' value='name'>Name</option>
                            <option key='tail' value='tail'>Tail number</option>
                            <option key='type' value='type'>Aircraft type</option>
                            <option key='qualification' value='qualification'>Qualification level</option>
                            <option key='squadron' value='squadron'>Mooney Caravan Squadron</option>
                    </select>
                </div>
            </div>
            <div className='setup-inputs'>
                <label>
                    <input
                        type='checkbox'
                        checked={setup.occupants}
                        onChange={(e) => setSetup({ ...setup, occupants: e.target.checked })}
                    />
                    Show aircraft occupants
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={setup.labels}
                        onChange={(e) => setSetup({ ...setup, labels: e.target.checked })}
                    />
                    Set row and column labels
                </label>
            </div>
        </form>
    );
};

export default SetupPane;